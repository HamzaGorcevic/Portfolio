---
title: Building an AI operator: Claude Code sessions that test, fix and ship our web app
description: How I built an AI harness around Claude Code that crawls a web app, tests every page, fixes what it finds, merges the fixes through a merge queue, and only asks me what it really cannot decide.
date: 2026-11-03
tags: AI harness, AI agents, Claude Code, workflow automation, Python, Node.js, Playwright, developer tools
---

At [Hubora](https://hubora.com) I lead the Workspace and Collaboration area of a large business platform. A product that size has hundreds of pages and controls, and testing all of them by hand after every round of changes simply doesn't happen. So over the last few weeks I built something I call the **operator**: a harness around Claude Code that tests our web app, fixes what it finds, merges the fixes, and reports back.

This post is about how it works and, more usefully, about what I had to learn to make AI agents run unattended for days without making a mess. The tool is internal, so there's no repo to link, but the ideas carry over to any team that wants agents doing real work.

## The short version

The operator runs on a development VM. A cron job "ticks" it every couple of minutes, and each tick moves every run one step forward. A run looks like this:

1. **Crawl.** A Playwright script signs in and walks the app, listing every page and every control on it.
2. **Test.** For each page, the operator starts a Claude Code session in its own tmux window, with a checklist of everything on that page. The session uses a real browser to click through it and writes down what's broken.
3. **Plan and fix.** Findings become fix units. Each unit gets its own session and its own git worktree, so fixes never step on each other.
4. **Merge.** Finished fixes are bundled into a pull request, reviewed by a fresh agent, and merged through the repository's merge queue, so CI decides, not the agent.
5. **Verify.** Once a fix is deployed, a retest session checks it on the real environment. "Fixed" means verified, not just merged.
6. **Report.** Everything ends in an HTML report: fixed, partly fixed, not fixed or skipped, with the PRs and evidence behind each row.

There is also a **builder**, which reuses the same engine for new features instead of bugs: a plan session writes a spec, units build it, a merge session reviews and ships it.

## A harness, not a prompt

The most important lesson came early. A clever prompt is maybe 10% of the work. The other 90% is the harness: the plain, boring code around the model that decides what runs, keeps state, checks results and recovers from failure.

The operator's engine is a Python program split into about sixteen parts: storage, sessions, questions, the pump that moves runs forward, watchdogs, reports, memory and so on. The agents never hold the state of a run in their heads. They read it from files and write results back through small commands, like `op check` to tick off a checklist item or `op report` to finish a job. That way, if a session crashes, the VM reboots or I stop everything, nothing is lost: the next tick picks up from the files.

A few rules made the biggest difference:

- **Structured output beats prose.** Report rows used to be free text that I parsed. Now the report session fills in typed fields (status, repo, PRs, confidence), and the tool trusts those fields instead of guessing.
- **Fail loudly.** Every silent stall I found became a watchdog. A session that has been quiet too long, a fix that never reached the merge queue, a run waiting on a question nobody saw: each one now shows up in the panel instead of quietly rotting.
- **Never deploy a broken harness.** The engine has a self-test that covers report classification, rechecks, account leasing and the watchdogs, without network or real credentials. The VM only gets a new version of the engine if that self-test passes.

## One operator you talk to

The first versions had a problem I hadn't expected: questions. A dozen sessions running at once each needed a decision now and then, and they all asked *me*. I became the bottleneck of my own automation.

The fix was a single always-on session, the operator itself, that every other session asks instead. It answers from the code, the run's files, the problem history and my earlier decisions, and types its answer back into the session that asked. It only escalates what it shouldn't decide alone: things that are hard to undo, product calls with no precedent, infrastructure merges, sign-ins.

When it does need me, the question goes to my phone as a push notification with up to three answer buttons, the recommended one first. Tapping one sends a signed reply that the next tick verifies and passes on. I can answer a question from the bus, and the run keeps going.

The builder goes a step further: a question I haven't answered after a few hours takes the recommended answer, and the decision is written into the spec so I can change it later. Waiting forever for a human is a bug.

## Memory and lessons

Agents repeat mistakes unless you give them a way not to. The builder keeps a ledger of every problem across runs: units that failed, parts built only partly, and bugs I found after a run said it was done. Every new session gets the open and related problems in its prompt.

When I report a bug the builder missed, it starts a round that reproduces the bug, records why it slipped through, writes a failing test first and then fixes it. A retro at the end of each run turns those escapes into short lessons that go into the prompts of future runs.

## The parts nobody talks about

Running agents for days on one machine taught me more about operations than about AI:

- **Watch the machine, not just the agents.** One day the VM's load average went over a thousand. The cause wasn't the agents at all: container health checks had piled up on a slow disk. The VS Code panel now has a problems tab that spots crash loops, unhealthy containers, overload, orphaned processes and full disks, and can stop or restart things with one click.
- **Measure the cost.** Every session's tokens are counted (deduplicated by message, since my first version counted some twice) and turned into money per run, so I always know what a run cost.
- **Small bugs in tooling hurt the most.** A single apostrophe in a generated page script once blanked all three panels of the VS Code extension. Now a check script builds and parses every panel before I can package it. Another time the report renderer was rewriting about 360 MB of files every minute and helped fill the disk. It now writes about 10 MB, at most every five minutes.
- **Respect edits you didn't make.** If someone changes the engine directly on the VM, the tool refuses to overwrite that copy and tells you how to bring the change back.

## What it looks like day to day

Most of my interaction now happens in a VS Code panel: a chat with the operator, a short "the operator asks you" list, one status line per run, and a morning summary of what was fixed overnight and what is left for whom. I also built a way to move a Claude Code session, along with its branch and uncommitted work, between my Mac and the VM, so I can start something locally and let it continue on the server.

## Takeaways if you want to build one

- Put state in files and treat sessions as disposable workers.
- Give agents small, typed commands to report results instead of parsing what they write.
- Let CI and a merge queue be the judge of "done", and verify fixes on the real environment.
- Route every question through one place, and make waiting for a human the exception.
- Self-test the harness before every deploy, and add a watchdog for every silent failure you find.

Building this changed how I think about AI in software teams. The model is good enough already. What makes it useful is the engineering around it: an AI harness that makes agents reliable, observable and safe to leave running. That is the kind of system I like to build, whether it's for testing, internal workflows or customer-facing automation.
