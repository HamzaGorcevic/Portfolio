-- First post: the request trace and AI operator story. Edit it later from /admin.
INSERT INTO "Blog" ("slug", "title", "description", "content", "tags", "published", "publishedAt", "updatedAt")
VALUES (
  'building-an-ai-operator',
  'From request traces to an AI operator: how I built Claude Code agents that test, fix and ship our web app',
  'How a tracing pipeline into our own ClickHouse and a request-trace panel grew into a Claude Code operator that tests every page, fixes bugs and merges them.',
  $post$At Hubora I lead the Workspace and Collaboration area of a large business platform. Over about six weeks this autumn I built a chain of developer tools, each one growing out of the last: a tracing pipeline into our own ClickHouse, an in-app panel that shows what every click does on the server, a dashboard for the AI coding sessions on my dev machine, and finally an **operator**: a harness around Claude Code that tests the whole web app page by page, fixes what it finds, merges the fixes and asks me only what it really can't decide.

This post tells that story in order, because the order is the point. The AI part only worked because the boring observability work came first.

## Step 1: one place where every request leaves a trace

It started with a simple frustration. When something was slow or broken, finding out why meant asking someone to dig through browser DevTools, then guessing what happened on the server. A request in our system can pass through an API, Postgres, Redis, a background queue, an outbox, Kafka and a realtime server, and we couldn't follow it across those hops.

So I wired everything into OpenTelemetry:

- **Every Node service** starts the OpenTelemetry SDK with `node --import`, before any app code loads. I measured that without this, Redis and Express calls produced no spans at all.
- **Context crosses every boundary.** A job put on a queue used to start a brand new trace in the worker; now it continues the one that queued it. The same goes for the outbox, Kafka events and the realtime connection after the WebSocket handshake.
- **A surprise along the way:** several services had carried an OpenTelemetry SDK for months and never exported a single span, because the exporter endpoint was never set. There was even a test asserting it stayed unset.

Where to store it was a real decision. A managed observability service would have meant an account and a password before a developer could see their own requests, and a third party holding our customers' identifiers. So the stack runs **its own ClickHouse**, and there is exactly one telemetry store. (I briefly added a popular open-source UI on top and removed it the same day: it cost two extra containers, 2 GB of images and its own database just for logins.) A colleague set up the production ClickHouse cluster; I built the collector, the schema, the dashboards and the path from every service into it.

A few design choices I'd repeat anywhere:

- **The collector decides what may be stored.** Attributes go through an allowlist, so SQL is stored without values, URLs without query strings, and anything unexpected is dropped rather than leaked.
- **Data expires on its own.** Traces live for 7 days and logs for 14.
- **Queries can't accidentally scan everything.** Developers and tools read through parameterised views like `traces(minutes)` and `trace(id)`, where the time bound is part of the view, not a `WHERE` you might forget.
- **AI gets read-only access by grant, not by prompt.** An AI assistant can query telemetry through a ClickHouse MCP server, but its database user simply can't insert or read system tables. I tested that the attempts fail. Telemetry is treated as evidence, never as instructions.
- **Watch the database's own logs.** At one point ClickHouse's diagnostic logs had filled 8.4 GB of an 11 GB volume while our actual telemetry was under 1 GB.

## Step 2: a panel that shows what a click did

Traces in a database are only useful if people look at them. So I built a request-trace panel into the web app. Press **Cmd/Ctrl+Shift+X** and a small draggable panel opens:

- **One tab per action.** Every click, Enter or file upload gets its own tab, plus a "Page load" tab for the first seconds after a navigation.
- **Browser and server joined.** Each API request sent shortly after a click carries a fresh W3C `traceparent` header, so the browser request and its backend spans share one trace id.
- **Every hop, opened up.** A request card shows the method, status, round-trip time and query count, and opens into its hops (API, Postgres folded by count, Redis, outbound HTTP, queues, consumers, realtime) and the full span tree, with errors in red.
- **The why, not just the what.** Failed requests show the reason, which code sent them (a short initiator stack), the request id, and console errors from the same moment.
- **Copy all.** One button exports every tab with its spans as JSON, with tokens, passwords and secrets masked.

Locally the panel reads ClickHouse through the dev server, and a production build contains none of that code. On staging and production it is locked: a developer unlocks it with a secret the server holds, and gets a signed key bound to their account that expires after eight hours. Server-side reads are tightly bounded: a handful of trace ids, the last day only, a capped number of spans and attributes.

## Step 3: a dashboard for my AI sessions

In parallel I had a more personal problem. I run several Claude Code sessions at once on a development VM, inside tmux. When the VM crashed, the sessions vanished, and I lost track of which conversation was doing what.

It began as "a small terminal helper I will never publish": a script that resumes lost sessions, and a terminal dashboard showing CPU, memory, disk, tmux, Claude sessions and Docker over a single SSH connection. It grew into a VS Code extension where I can see every session, send "continue" to the idle ones, open or kill them, and have a model draft a suggested next message for each. A little later it learned to tell me which sessions were actually waiting for me.

## Step 4: the operator

Those two tools met when I had a simple idea: *the trace panel shows exactly what every action does. What if an AI tester clicked through the whole app and read the trace after every action?* My original request was a button where I paste a link to the local, staging or production app, and it starts a Claude session for each route.

That's roughly what the operator became:

1. **Crawl.** A plain Playwright script (no AI) signs in and walks the app, listing every page and every button, link and field on it.
2. **Test.** Each page gets its own Claude Code session in a tmux window, driving a real Chrome through Playwright, with a checklist of every control on that page. A session can't report "done" while items are still open.
3. **Read the evidence.** Before the app even loads, the browser is set up so the trace panel is on. After every page load, click or bout of typing, the "Copy all" output is saved as a file next to the session. Findings must cite the method, path, status, time, initiator and spans, not impressions.
4. **Fix.** Findings become a plan of fix units. Each unit gets its own session and its own git worktree, so fixes don't collide.
5. **Merge.** Finished fixes are bundled into pull requests and go through the repository's merge queue, so CI decides what is done. Infrastructure changes always wait for me.
6. **Report and verify.** A live HTML report shows every problem with how it was found, the fix PR, and a status of fixed, partly fixed, not fixed or skipped. Once a fix is deployed, a retest session checks it on the real environment.

One detail I like: the first integration point was a hack. The operator replaces the browser's `navigator.clipboard.writeText`, so when it clicks "Copy all", the JSON lands in the script instead of the clipboard. Later the operator's own feature builder (more on that below) rebuilt the trace as a proper browser API that works without the panel, starts capturing before the app boots, and counts what it drops. The tool ended up improving the tool it was built on.

### What a big run looks like

The largest run so far took a day of testing on our staging environment:

- **128 testing sessions**, 577 page loads and about 3,100 actions.
- The crawl found **1,230 buttons, links and fields on 33 pages**. Of those, 1,106 were tried.
- **134 distinct problems** came out of it, and fixes for 127 of them were merged.

The honest footnote matters more than the headline. At that point only *one* of those fixes had been verified on staging after deployment. "Merged" isn't "fixed", which is why retest sessions and a separate "verified" field exist now.

### Did the traces actually help?

The report counts which kind of evidence led to each finding. Reading the code was the biggest single source (316 findings). But trace data, meaning action traces, page-load traces and server spans, was cited in 467 findings, and the plain network log and console in about 200 more. Findings often cite several sources, so these overlap, but the trace clearly pulled its weight. Interestingly, reading the trace took only about 2% of session time. Most of the time went to the model thinking.

## When the tool got in the way of the app

Building tools for agents taught me things that building tools for people didn't:

- **The observer changed the system.** In one staging session, the trace panel and "Copy all" made 121 of 197 API calls. Early on, its polling even triggered extra token refreshes that ran into the sign-in rate limit. It now caches settled traces and asks for each one once.
- **Agents click where people don't.** The panel opened in the top-right corner and covered header buttons, so Playwright's clicks landed on the panel. It moved to the bottom-right and grows upward.
- **Silent drops are the worst bugs.** Actions that only changed a query string were mistaken for background polling, and uploads picked after a short window weren't attributed to the click. Both are fixed, and the rebuilt trace now counts what it drops instead of hiding it.
- **Parallel testers fight over sign-in.** Many sessions signing in at once tripped rate limits and locked each other out. Staggered starts, a separate test account for each session, and a cap on staging parallelism fixed it.

## The operator grows up

A few more pieces turned a test runner into something that can work for days:

- **A builder.** The same engine builds new features instead of fixing bugs: a planning session writes a spec, units build it, a fresh agent reviews the PRs against the spec, and it merges through the queue. Two features have already shipped this way, one of them the rebuilt trace API mentioned above.
- **One operator you talk to.** At first every session asked *me* its questions, and I became the bottleneck of my own automation. Now one always-on session receives every question from every run, answers from the code, the run's files and my earlier decisions, and escalates only what is hard to undo or a genuine product call.
- **Answers from my phone.** Escalated questions arrive as push notifications with up to three buttons, recommended first. A tap sends a signed reply that the next cron tick checks and passes on.
- **Never blocking.** Sessions carry on with everything that doesn't depend on an answer. In the builder, a question I haven't answered after a few hours takes the recommended answer, and the decision is written into the spec so I can change it later.
- **Memory.** After each run a retro turns mistakes into short lessons that go into future prompts, and the builder keeps a ledger of every problem that slipped through, which it reproduces with a failing test before fixing.
- **Self-tests before every deploy.** The engine (now around 5,700 lines of Python, split into 17 parts) has a self-test that must pass before a new version reaches the VM. It also refuses to overwrite a copy that was edited directly on the VM, after that once cost me a better version.

## The unglamorous lessons

Running dozens of agents on one machine is mostly an operations problem:

- **Watch the machine, not just the agents.** One day the VM's load average hit 1,281. The cause was Docker health checks piling up on a slow disk, not the agents. The VS Code extension now has a tab for crash loops, unhealthy containers, overload, orphaned processes and full disks.
- **Your own tooling can be the heaviest workload.** The report renderer was rewriting about 360 MB of files every minute. It now writes about 10 MB, at most every five minutes. And running eight fix sessions at once stalled the disk entirely, which is why parallelism now depends on free memory and load.
- **Tiny bugs in tools hurt the most.** A single apostrophe in a generated page script left every panel of the extension stuck on "Connecting". A check now builds and parses every panel before packaging.
- **Measure what it costs.** Every session's tokens are counted and priced, as a yardstick for comparing runs.
- **Design for the human's attention.** Things I said along the way, like "it's asking me too much" and "I have really low understanding of what's running", turned into features: the single operator, the live view, and explanations that show once and then hide behind a "?".

## Takeaways

- **Build observability before AI.** The agents were only as good as the evidence they could read. A trace of every action turns "it seems broken" into something like "this request returned 403 after 1.2 s, and this code sent it".
- **Put state in files and treat sessions as disposable.** A crash, a reboot or a stop loses nothing; the next tick picks up.
- **Let CI and a merge queue judge "done", then verify on the real environment.**
- **Route every question through one place,** and make waiting for a human the exception.
- **Fail loudly.** Every silent stall I found became a watchdog or a counter.

The model is good enough already. What makes it useful is the engineering around it: telemetry it can read, a harness that keeps it on track, and checks that don't trust it blindly. That's the kind of system I like to build, whether it's for testing, internal workflows or automation your customers see.
$post$,
  'AI harness, AI agents, Claude Code, OpenTelemetry, ClickHouse, observability, workflow automation, Node.js, Playwright, developer tools',
  true,
  '2026-11-03T12:00:00Z',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
