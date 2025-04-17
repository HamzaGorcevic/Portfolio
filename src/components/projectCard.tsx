import React from 'react';
import styles from '../styles/projectCard.module.css';
import { Project } from '@/types/project';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        {project.liveUrl ? (
          <iframe
            src={project.liveUrl}
            title={project.title}
            className={styles.cardIframe}
            width="600"
            height="400"
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className={styles.noImage}>No Preview Available</div>
        )}
      </div>
      <div className={styles.cardDetails}>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardDescription}>{project.description}</p>
        <div className={styles.cardMeta}>
          <div className={styles.cardTech}>
            {project.technologies.map((tech) => (
              <span key={tech} className={styles.tech}>{tech}</span>
            ))}
          </div>
          <div className={styles.cardLinks}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardurl}
              >
                <FaGithub />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                <FaExternalLinkAlt />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;