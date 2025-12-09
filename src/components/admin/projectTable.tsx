import { Project } from "@/types/project";
import styles from "../../styles/projectsTable.module.css"
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function ProjectTable({ projects, onDelete, onEdit }:{projects:Project[],onDelete:(id:number)=>void,onEdit:(project:Project)=>void}) {
  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Technologies</th>
            <th>Links</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project: Project) => (
            <tr key={project.id}>
              <td>
                {typeof project.image === 'string' && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className={styles.projectImage}
                  />
                )}
              </td>
              <td className={styles.titleCell}>{project.title}</td>
              <td className={styles.descriptionCell}>{project.description}</td>
              <td>
                <div className={styles.techBadges}>
                  {project.technologies.split(',').slice(0, 3).map((tech, idx) => (
                    <span key={idx} className={styles.techBadge}>
                      {tech.trim()}
                    </span>
                  ))}
                  {project.technologies.split(',').length > 3 && (
                    <span className={styles.techBadge}>+{project.technologies.split(',').length - 3}</span>
                  )}
                </div>
              </td>
              <td>
                <div className={styles.linkButtons}>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.tableLink}
                  >
                    <FaGithub /> GitHub
                  </a>
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.tableLink}
                    >
                      <FaExternalLinkAlt /> Live
                    </a>
                  )}
                </div>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.buttonEdit}
                    onClick={() => onEdit(project)}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles.buttonDelete}
                    onClick={() => onDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}