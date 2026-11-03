import styles from '../styles/about.module.css';

const services = [
  {
    title: 'Workflow & business process automation',
    text: 'I automate repetitive work end to end: email pipelines, onboarding and billing flows, data syncs between tools, and internal dashboards. Built with Node.js, queues like Kafka, and integrations with the services your team already uses.',
  },
  {
    title: 'AI harness & AI agent development',
    text: 'I build the harness around large language models (Claude, GPT): tool calling, agent loops, retrieval-augmented generation (RAG), evaluation, and the UI people use to work with them. This is AI that runs reliably inside a real product, not just a demo.',
  },
  {
    title: 'Node.js backend development',
    text: 'Production APIs with Node.js, NestJS and Express, plus authentication, SSO and OAuth 2.0, PostgreSQL, Redis, and observability with OpenTelemetry and Grafana.',
  },
  {
    title: 'React & Next.js frontend development',
    text: 'Fast, accessible interfaces in React, Next.js and TypeScript, from admin panels and dashboards to search experiences and AI chat interfaces.',
  },
];

const experience = [
  {
    role: 'Team Lead',
    company: 'Hubora',
    period: 'Aug 2026 – Present',
    text: 'Leading the Workspace and Collaboration area of a business platform spanning collaboration, ERP and CRM.',
  },
  {
    role: 'Full-Stack Developer',
    company: 'Centific (Microsoft vendor)',
    period: 'Feb 2026 – Aug 2026',
    text: 'Built React interfaces for AI systems, KQL-style search experiences, and dashboards for multi-model interaction.',
  },
  {
    role: 'Full-Stack Developer',
    company: 'Glossa',
    period: 'Jul 2025 – Dec 2025',
    text: 'Next.js and Node.js / Express at an AI startup: authentication, SSO, access control, onboarding and billing.',
  },
  {
    role: 'Full-Stack Developer',
    company: 'Tourism Software Solution',
    period: 'Apr 2024 – Jan 2025',
    text: 'Angular admin panels, backend email automation in Node.js, and an AI assistant built on a RAG architecture.',
  },
];

const skills = [
  'JavaScript', 'TypeScript', 'Node.js', 'React', 'Next.js', 'NestJS', 'Express',
  'Angular', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Kafka', 'ClickHouse',
  'LLMs', 'RAG', 'LangChain', 'OAuth 2.0 / SSO', 'OpenTelemetry',
];

const About = () => {
  return (
    <section className={styles.about} aria-labelledby="about-heading">
      <div className={styles.inner}>
        <h2 id="about-heading" className={styles.heading}>
          Software engineer for automation, AI and full-stack JavaScript
        </h2>
        <p className={styles.lead}>
          I&apos;m Hamza Gorcevic, a software engineer with a BSc in Software Engineering
          and several years of professional full-stack experience. I specialize in
          Node.js, React and JavaScript/TypeScript, and I help teams automate their
          workflows and ship AI features that work in production. I&apos;m based in Serbia
          and work remotely with clients and teams worldwide.
        </p>

        <h2 className={styles.heading}>What I can build for you</h2>
        <div className={styles.grid}>
          {services.map((s) => (
            <article key={s.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardText}>{s.text}</p>
            </article>
          ))}
        </div>

        <h2 className={styles.heading}>Experience</h2>
        <ol className={styles.timeline}>
          {experience.map((e) => (
            <li key={e.company} className={styles.job}>
              <h3 className={styles.cardTitle}>
                {e.role}, {e.company}
              </h3>
              <p className={styles.period}>{e.period}</p>
              <p className={styles.cardText}>{e.text}</p>
            </li>
          ))}
        </ol>

        <h2 className={styles.heading}>Education & awards</h2>
        <ul className={styles.list}>
          <li>
            <strong>BSc in Software Engineering</strong>, State University of Novi Pazar
            (graduated Oct 2026)
          </li>
          <li>1st place, hackathon at State University of Novi Pazar (Dec 2024), among 17 university teams</li>
          <li>1st place, hackathon at International University of Novi Pazar (Apr 2025)</li>
          <li>
            Conference paper at CPMMI 2026: &ldquo;Can Algorithms Understand Emotions? A
            Comparative Evaluation of Machine Learning Approaches on the GoEmotions Dataset&rdquo;
          </li>
        </ul>

        <h2 className={styles.heading}>Skills</h2>
        <ul className={styles.skills}>
          {skills.map((s) => (
            <li key={s} className={styles.skill}>{s}</li>
          ))}
        </ul>

        <p className={styles.cta}>
          Need a Node.js or React developer, or someone to automate a workflow or build an
          AI agent? <a href="mailto:hamzagorcevic100@gmail.com">Email me</a> or reach out on{' '}
          <a href="https://www.linkedin.com/in/hamza-gor%C4%8Devi%C4%87-112951246/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>
      </div>
    </section>
  );
};

export default About;
