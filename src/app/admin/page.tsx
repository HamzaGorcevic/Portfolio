import AdminPage from '@/components/admin/admin';
import React from 'react'

const  Page = async () => {
  const baseUrl = `${`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}` || 'http://localhost:3000'; // Use your localhost in dev
    const req = await fetch(`${baseUrl}/api/projects`);
  const projects = await req.json(); 
  return (
    <AdminPage projects={projects}/>
  )
}

export default Page