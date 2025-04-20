import AdminPage from '@/components/admin/admin';
import { getBaseUrl } from '@/lib/baseUrl';
import React from 'react'

const  Page = async () => {
  const baseUrl = getBaseUrl();
    const req = await fetch(`/api/projects`,{ cache: 'no-store' });
  const projects = await req.json(); 
  return (
    <AdminPage projects={projects}/>
  )
}

export default Page