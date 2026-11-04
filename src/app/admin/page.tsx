import AdminDashboard from '@/components/admin/admin';
import LoginForm from '@/components/admin/loginForm';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { robots: { index: false, follow: false } };

const Page = async () => {
  const isAuthenticated = await getSession();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  const [projects, posts] = await Promise.all([
    prisma.project.findMany(),
    prisma.blog.findMany({ orderBy: { publishedAt: 'desc' } }),
  ]);

  return <AdminDashboard projects={projects} posts={posts} />;
};

export default Page;