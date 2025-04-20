import ProjectSlider from '@/components/projectSlider';
import React from 'react'
import styles from "../../styles/projects.module.css"
const Page = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'; 
    const req = await fetch(`${baseUrl}/api/projects`);
    const projects = await req.json(); 
  return (
            
    <div className={styles.container}>
          <a href="/" className={styles.homeButton}>← Back Home</a>
    <ProjectSlider projects={projects} />
  </div>    
  )
}

export default Page