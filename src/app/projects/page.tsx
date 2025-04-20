import ProjectSlider from '@/components/projectSlider';
import React from 'react'
import styles from "../../styles/projects.module.css"
import Link from 'next/link';
const Page = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'; 
    const req = await fetch(`${baseUrl}/api/projects`);
    const projects = await req.json(); 
  return (
            
    <div className={styles.container}>
          <Link href="/" className={styles.homeButton}>← Back Home</Link>
    <ProjectSlider projects={projects} />
  </div>    
  )
}

export default Page