'use client'
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import styles from '../../styles/admin.module.css';
import blog from '../../styles/blogAdmin.module.css';
import { saveBlogPost, deleteBlogPost, type BlogInput } from '@/app/admin/blogActions';

export type AdminPost = {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string;
  image: string | null;
  published: boolean;
  publishedAt: Date;
  updatedAt: Date;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

const toInput = (p: AdminPost | null): BlogInput => ({
  id: p?.id,
  slug: p?.slug ?? '',
  title: p?.title ?? '',
  description: p?.description ?? '',
  content: p?.content ?? '',
  tags: p?.tags ?? '',
  image: p?.image ?? '',
  published: p?.published ?? false,
  publishedAt: (p ? new Date(p.publishedAt) : new Date()).toISOString().slice(0, 10),
});

// Next 16 serves a revalidated page stale once while it rebuilds. Requesting the pages
// right after a save triggers that rebuild, so "View live" shows the new version.
const warm = (...paths: string[]) => {
  for (const path of paths) fetch(path, { cache: 'no-store' }).catch(() => {});
};

const BlogManager = ({ posts }: { posts: AdminPost[] }) => {
  const router = useRouter();
  const [editing, setEditing] = useState<BlogInput | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const preview = useMemo(
    () => (editing && tab === 'preview' ? marked.parse(editing.content, { async: false }) : ''),
    [editing, tab],
  );

  const open = (p: AdminPost | null) => {
    setEditing(toInput(p));
    setSlugTouched(!!p);
    setTab('write');
    setMessage(null);
  };

  const set = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) =>
    setEditing((e) => {
      if (!e) return e;
      const next = { ...e, [key]: value };
      if (key === 'title' && !slugTouched) next.slug = slugify(String(value));
      return next;
    });

  const save = (publish?: boolean) => {
    if (!editing) return;
    const input = publish === undefined ? editing : { ...editing, published: publish };
    startTransition(async () => {
      const res = await saveBlogPost(input);
      if (!res.ok) {
        setMessage({ ok: false, text: res.error });
        return;
      }
      const slug = input.slug.trim().toLowerCase();
      warm('/blog', `/blog/${slug}`, '/sitemap.xml');
      setEditing({ ...input, id: res.id, slug });
      setSlugTouched(true);
      setMessage({ ok: true, text: input.published ? 'Saved. The post is live.' : 'Saved as a draft.' });
      router.refresh();
    });
  };

  const remove = (p: AdminPost) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deleteBlogPost(p.id);
      if (res.ok) warm('/blog', `/blog/${p.slug}`, '/sitemap.xml');
      setMessage(res.ok ? { ok: true, text: 'Post deleted.' } : { ok: false, text: res.error });
      router.refresh();
    });
  };

  if (!editing) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Blog posts</h2>
          <button onClick={() => open(null)} className={styles.primaryButton}>
            <FaPlus style={{ marginRight: '0.5rem' }} />
            New post
          </button>
        </div>
        {message && (
          <div className={`${styles.message} ${message.ok ? styles.success : styles.error}`}>{message.text}</div>
        )}
        {posts.length === 0 ? (
          <p className={blog.empty}>No posts yet. Write your first one.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.title}</strong>
                      <div className={blog.slug}>/blog/{p.slug}</div>
                    </td>
                    <td>
                      <span className={p.published ? blog.live : blog.draft}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{new Date(p.publishedAt).toLocaleDateString()}</td>
                    <td>
                      <div className={blog.rowActions}>
                        {p.published && (
                          <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className={styles.button} title="View">
                            <FaExternalLinkAlt />
                          </a>
                        )}
                        <button onClick={() => open(p)} className={styles.button} title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => remove(p)} className={styles.button} title="Delete" disabled={pending}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <button onClick={() => { setEditing(null); setMessage(null); }} className={styles.button}>
          <FaArrowLeft style={{ marginRight: '0.5rem' }} />
          All posts
        </button>
        <div className={blog.headerActions}>
          {editing.published && editing.id && (
            <a href={`/blog/${editing.slug}`} target="_blank" rel="noopener noreferrer" className={styles.button}>
              View live
            </a>
          )}
          <button onClick={() => save(false)} className={styles.button} disabled={pending}>
            {editing.published ? 'Unpublish' : 'Save draft'}
          </button>
          <button onClick={() => save(true)} className={styles.primaryButton} disabled={pending}>
            {pending ? 'Saving…' : editing.published ? 'Save' : 'Publish'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`${styles.message} ${message.ok ? styles.success : styles.error}`}>{message.text}</div>
      )}

      <div className={blog.form}>
        <label className={blog.field}>
          <span>Title</span>
          <input className={styles.input} value={editing.title} onChange={(e) => set('title', e.target.value)} placeholder="What the post is about" />
        </label>

        <div className={blog.row}>
          <label className={blog.field}>
            <span>URL slug</span>
            <input
              className={styles.input}
              value={editing.slug}
              onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }}
              placeholder="building-an-ai-operator"
            />
            <small>hamzagorcevic.vercel.app/blog/{editing.slug || '…'}</small>
          </label>
          <label className={blog.field}>
            <span>Publish date</span>
            <input type="date" className={styles.input} value={editing.publishedAt} onChange={(e) => set('publishedAt', e.target.value)} />
          </label>
        </div>

        <label className={blog.field}>
          <span>Description <em>({editing.description.length}/160)</em></span>
          <textarea
            className={styles.input}
            rows={2}
            value={editing.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="One or two sentences. Google shows this under the title in search results."
          />
        </label>

        <div className={blog.row}>
          <label className={blog.field}>
            <span>Tags (comma separated)</span>
            <input className={styles.input} value={editing.tags} onChange={(e) => set('tags', e.target.value)} placeholder="AI agents, Node.js, automation" />
            <small>Used as SEO keywords and shown on the post.</small>
          </label>
          <label className={blog.field}>
            <span>Cover image URL (optional)</span>
            <input className={styles.input} value={editing.image} onChange={(e) => set('image', e.target.value)} placeholder="https://… (defaults to your photo)" />
            <small>Shown when the post is shared on LinkedIn, X or Slack.</small>
          </label>
        </div>

        <div className={blog.editorTabs}>
          <button className={tab === 'write' ? blog.editorTabActive : blog.editorTab} onClick={() => setTab('write')}>Write</button>
          <button className={tab === 'preview' ? blog.editorTabActive : blog.editorTab} onClick={() => setTab('preview')}>Preview</button>
          <span className={blog.hint}>Markdown: ## heading, **bold**, [link](url), - list, `code`</span>
        </div>
        {tab === 'write' ? (
          <textarea
            className={`${styles.input} ${blog.content}`}
            value={editing.content}
            onChange={(e) => set('content', e.target.value)}
            placeholder="Write the post in Markdown…"
          />
        ) : (
          <div className={blog.preview} dangerouslySetInnerHTML={{ __html: preview }} />
        )}
      </div>
    </div>
  );
};

export default BlogManager;
