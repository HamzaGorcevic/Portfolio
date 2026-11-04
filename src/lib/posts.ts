import { marked } from "marked";
import { prisma } from "@/lib/prisma";

// Posts live in the Blog table and are written in Markdown from /admin.
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  image: string | null;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

type BlogRow = {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string;
  image: string | null;
  publishedAt: Date;
  updatedAt: Date;
};

export const splitTags = (tags: string) =>
  tags.split(",").map((t) => t.trim()).filter(Boolean);

function toMeta(row: BlogRow): PostMeta {
  const words = row.content.split(/\s+/).filter(Boolean).length;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.publishedAt.toISOString(),
    updated: row.updatedAt.toISOString(),
    tags: splitTags(row.tags),
    image: row.image,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const rows = await prisma.blog.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toMeta);
}

export async function getPost(slug: string): Promise<Post | null> {
  const row = await prisma.blog.findFirst({ where: { slug, published: true } });
  if (!row) return null;
  return { ...toMeta(row), html: marked.parse(row.content, { async: false }) };
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
