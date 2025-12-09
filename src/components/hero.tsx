import styles from '../styles/hero.module.css';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaCode, FaFileDownload } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.cosmicBackground}></div>
      <div className={styles.starfield}></div>
      
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            <div className={styles.imageFrame}>
              <img
                src="/hamza.jpg"
                alt="Hamza Gorcevic"
                width={220}
                height={220}
                className={styles.profileImage}
              />
            </div>
            <div className={styles.orbitRing}></div>
          </div>
          
          <div className={styles.nameContainer}>
            <h1 className={styles.name}>Hamza Gorcevic</h1>
            <div className={styles.cosmicText}>Developer</div>
          </div>
          
          <p className={styles.title}>Full Stack Developer</p>
        </div>
        
        <div className={styles.linksContainer}>
          <div className={styles.linksRow}>
            <a
              href="https://github.com/HamzaGorcevic"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <FaGithub className={styles.icon} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/hamza-gor%C4%8Devi%C4%87-112951246/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <FaLinkedin className={styles.icon} />
              LinkedIn
            </a>
            <a
              href="mailto:hamzagorcevic100@gmail.com"
              className={styles.link}
            >
              <FaEnvelope className={styles.icon} />
              Gmail
            </a>
            <a
              href="tel:062-8967329"
              className={styles.link}
            >
              <FaPhone className={styles.icon} />
              Contact
            </a>
          </div>
          
          <div className={styles.linksRow}>
            <a
              href="/projects"
              className={`${styles.link} ${styles.primaryBtn}`}
            >
              <FaCode className={styles.icon} />
              View Projects
            </a>
            <a
              href="/files/resume.pdf"
              download
              className={`${styles.link} ${styles.primaryBtn}`}
            >
              <FaFileDownload className={styles.icon} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;