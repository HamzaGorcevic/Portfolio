import ProjectSlider from '@/components/projectSlider';
import React from 'react'
import styles from "../../styles/projects.module.css"
const Page = async () => {
    const req = await fetch("http://localhost:3000/api/projects");
    const projects = await req.json(); 
  return (
            
    <div className={styles.container}>
          <a href="/" className={styles.homeButton}>← Back Home</a>
    <ProjectSlider projects={projects} />
  </div>    
  )
}

export default Page