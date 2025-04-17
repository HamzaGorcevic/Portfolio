import Head from 'next/head';
import Hero from '@/components/hero';
import ProjectSlider from '@/components/projectSlider';
import styles from './page.module.css';

export default async function Home() {
  const req = await fetch("http://localhost:3000/api/projects");
  const projects = await req.json();
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Hamza Gorcevic - Portfolio</title>
        <meta name="description" content="Hamza Gorcevic's portfolio website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Hero />
        
        <section className={styles.projectsSection}>
          <h2 className={styles.sectionTitle}>My Projects</h2>
          <ProjectSlider projects={projects} />
        </section>
      </main>
    </div>
  );
}