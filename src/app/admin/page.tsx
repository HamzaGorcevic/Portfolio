import AdminPage from '@/components/admin/admin';
import React from 'react'

const  Page = async () => {
  const req = await fetch("http://localhost:3000/api/projects");
  const projects = await req.json(); 
  return (
    <AdminPage projects={projects}/>
  )
}

export default Page