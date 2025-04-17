import React from 'react';
import styles from '../styles/projectCard.module.css';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';


const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className={styles.cardImage}
            loading="lazy"
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
              <span key={tech} className={styles.tech}>
                {tech}
              </span>
            ))}
          </div>
          <div className={styles.cardLinks}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
                aria-label="View GitHub Repository"
              >
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
                aria-label="View Live Project"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;