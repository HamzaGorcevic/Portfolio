import AdminDashboard from '@/components/admin/admin';
import LoginForm from '@/components/admin/loginForm';
import { prisma } from '@/lib/prisma';
import { getSession } from './actions';

const Page = async () => {
  const isAuthenticated = await getSession();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  const projects = await prisma.project.findMany();
  
  return <AdminDashboard projects={projects} />;
};

export default Page;