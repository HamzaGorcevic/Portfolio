import styles from '../styles/hero.module.css';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa'; // Import icons

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.imageContainer}>
        <Image
          src="/hamza.jpg"
          alt="Hamza Gorcevic"
          width={200}
          height={200}
          className={styles.profileImage}
        />
      </div>
      <h1 className={styles.name}>Hamza Gorcevic</h1>
      <p className={styles.title}>Full Stack Developer</p>
      <div className={styles.links}>
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <FaGithub className={styles.icon} />
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <FaLinkedin className={styles.icon} />
          LinkedIn
        </a>
        <a href="mailto:hamzagorcevic100@gmail.com" className={styles.link}>
          <FaEnvelope className={styles.icon} />
          Gmail
        </a>
        <a href="tel:062-8967329" className={styles.link}>
          <FaPhone className={styles.icon} />
          062-8967329
        </a>
      </div>
    </section>
  );
};

export default Hero;