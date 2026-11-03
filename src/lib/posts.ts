import fs from "fs";
import path from "path";
import { marked } from "marked";

// Posts are Markdown files in src/content/blog. The file name is the URL slug,
// and the front matter at the top holds title, description, date and tags.
const postsDir = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

function parse(slug: string, raw: string): PostMeta & { body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Post ${slug} has no front matter`);

  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) fields[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }

  const body = match[2];
  const words = body.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: fields.title,
    description: fields.description,
    date: fields.date,
    tags: (fields.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    readingMinutes: Math.max(1, Math.round(words / 220)),
    body,
  };
}

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const post = parse(slug, fs.readFileSync(path.join(postsDir, f), "utf8"));
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        tags: post.tags,
        readingMinutes: post.readingMinutes,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const file = path.join(postsDir, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const { body, ...meta } = parse(slug, fs.readFileSync(file, "utf8"));
  return { ...meta, html: marked.parse(body, { async: false }) };
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
