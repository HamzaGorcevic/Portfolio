import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/styles/blog.module.css";
import { formatDate, getAllPosts } from "@/lib/posts";

// Pages are cached and refreshed when a post is saved in /admin.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Hamza Gorcevic",
  description:
    "Hamza Gorcevic writes about AI agents and harnesses, workflow automation, Node.js, React and building software that runs on its own.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Blog | Hamza Gorcevic" },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.crumbs}>
          <Link href="/">← Hamza Gorcevic</Link>
        </nav>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.intro}>
          Notes on AI agents, automation and full-stack JavaScript, mostly about things I built
          and what I learned building them.
        </p>

        {posts.length === 0 && <p className={styles.intro}>The first post is on its way.</p>}

        <ul className={styles.postList}>
          {posts.map((p) => (
            <li key={p.slug} className={styles.postItem}>
              <Link href={`/blog/${p.slug}`} className={styles.postLink}>
                <h2 className={styles.postTitle}>{p.title}</h2>
                <p className={styles.meta}>
                  {formatDate(p.date)} · {p.readingMinutes} min read
                </p>
                <p className={styles.postDescription}>{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
