import ProjectSlider from '@/components/projectSlider';
import React from 'react'
import styles from "../../styles/projects.module.css"
import Link from 'next/link';
import { getBaseUrl } from '@/lib/baseUrl';
import { prisma } from '@/lib/prisma';
const Page = async () => {
    const projects = await prisma.project.findMany();
  return (
            
    <div className={styles.container}>
          <Link href="/" className={styles.homeButton}>← Back Home</Link>
    <ProjectSlider projects={projects} />
  </div>    
  )
}

export default Page