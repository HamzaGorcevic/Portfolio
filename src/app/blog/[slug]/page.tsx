import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/styles/blog.module.css";
import { formatDate, getPost } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

// Pages are rendered on first visit, cached, and refreshed when a post is saved in /admin.
export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const image = post.image || "/hamza.jpg";

  return {
    title: `${post.title} | Hamza Gorcevic`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: ["Hamza Gorcevic"],
      tags: post.tags,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    keywords: post.tags.join(", "),
    url: `${siteUrl}/blog/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    image: post.image || `${siteUrl}/hamza.jpg`,
    author: { "@id": `${siteUrl}/#person`, "@type": "Person", name: "Hamza Gorcevic", url: siteUrl },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className={styles.inner}>
        <nav className={styles.crumbs}>
          <Link href="/">Hamza Gorcevic</Link> / <Link href="/blog">Blog</Link>
        </nav>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.meta}>
          {formatDate(post.date)} · {post.readingMinutes} min read · by{" "}
          <Link href="/">Hamza Gorcevic</Link>
        </p>
        <ul className={styles.tags}>
          {post.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
        <aside className={styles.footer}>
          I&apos;m Hamza, a software engineer who builds AI agents, automation and full-stack
          JavaScript. If you want something like this for your team,{" "}
          <a href="mailto:hamzagorcevic100@gmail.com">email me</a>.
        </aside>
      </article>
    </main>
  );
}
