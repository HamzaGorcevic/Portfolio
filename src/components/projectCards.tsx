import React from 'react';
import styles from '../styles/projectCards.module.css';
import ProjectCard from './projectCard';
import { Project } from '@/types/project';

const ProjectCards = ({ projects }:{projects:Project[]}) => {
  return (
    <div className={styles.grid}>
      {projects.map((project:Project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectCards;