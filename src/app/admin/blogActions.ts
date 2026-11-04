"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "./actions";

export type BlogInput = {
  id?: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string;
  image: string;
  published: boolean;
  publishedAt: string;
};

type Result = { ok: true; id: number } | { ok: false; error: string };

function refresh(...slugs: string[]) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const s of slugs) revalidatePath(`/blog/${s}`);
}

export async function saveBlogPost(input: BlogInput): Promise<Result> {
  if (!(await getSession())) return { ok: false, error: "Your session expired. Log in again." };

  const slug = input.slug.trim().toLowerCase();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, error: "Slug can only use lowercase letters, numbers and single dashes." };
  }
  if (!input.content.trim()) return { ok: false, error: "Content is required." };

  const date = new Date(input.publishedAt);
  const data = {
    slug,
    title,
    description: input.description.trim(),
    content: input.content,
    tags: input.tags,
    image: input.image.trim() || null,
    published: input.published,
    publishedAt: isNaN(date.getTime()) ? new Date() : date,
  };

  const clash = await prisma.blog.findFirst({ where: { slug, NOT: input.id ? { id: input.id } : undefined } });
  if (clash) return { ok: false, error: `Another post already uses the slug "${slug}".` };

  if (input.id) {
    const before = await prisma.blog.findUnique({ where: { id: input.id } });
    const row = await prisma.blog.update({ where: { id: input.id }, data });
    refresh(slug, ...(before && before.slug !== slug ? [before.slug] : []));
    return { ok: true, id: row.id };
  }

  const row = await prisma.blog.create({ data });
  refresh(slug);
  return { ok: true, id: row.id };
}

export async function deleteBlogPost(id: number): Promise<Result> {
  if (!(await getSession())) return { ok: false, error: "Your session expired. Log in again." };
  const row = await prisma.blog.delete({ where: { id } });
  refresh(row.slug);
  return { ok: true, id };
}
