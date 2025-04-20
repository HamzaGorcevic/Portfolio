import AdminPage from '@/components/admin/admin';
import { getBaseUrl } from '@/lib/baseUrl';
import { prisma } from '@/lib/prisma';
import React from 'react'
const  Page = async () => {
  // const baseUrl = getBaseUrl();
  //   const req = await fetch(`${baseUrl}/api/projects`,{ cache: 'no-store' });
  const projects = await prisma.project.findMany();
  
  return (
    <AdminPage projects={projects}/>
  )
}

export default Page