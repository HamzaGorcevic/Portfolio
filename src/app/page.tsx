import Head from 'next/head';
import Hero from '@/components/hero';
import ProjectCards from '@/components/projectCards';
import { Project } from '@/types/project';

export default async function Home() {
  const req = await fetch("http://localhost:3000/api/projects");
  const projects = await req.json();
  return (
    <div >
      <Head>
        <title>Hamza Gorcevic - Portfolio</title>
        <meta name="description" content="Hamza Gorcevic's portfolio website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <section>
        <h2>My Projects</h2>
        <ProjectCards projects={projects} />
      </section>
    </div>
  );
}
