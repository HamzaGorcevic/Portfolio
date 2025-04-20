import Head from 'next/head';
import Hero from '@/components/hero';

export default async function Home() {

  
  return (
    <div >
      <Head>
        <title>Hamza Gorcevic - Portfolio</title>
        <meta name="description" content="Hamza Gorcevic's portfolio website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />

      </main>
    </div>
  );
}