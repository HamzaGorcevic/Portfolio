import AdminDashboard from '@/components/admin/admin';
import LoginForm from '@/components/admin/loginForm';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from './actions';

export const metadata: Metadata = { robots: { index: false, follow: false } };

const Page = async () => {
  const isAuthenticated = await getSession();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  const projects = await prisma.project.findMany();
  
  return <AdminDashboard projects={projects} />;
};

export default Page;