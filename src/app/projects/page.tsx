import ProjectSlider from '@/components/projectSlider';
import React from 'react'
import styles from "../../styles/projects.module.css"
import Link from 'next/link';
import { getBaseUrl } from '@/lib/baseUrl';
const Page = async () => {
    const baseUrl = getBaseUrl();
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