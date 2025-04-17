import { Project } from "@/types/project";
import styles from "../../styles/projectsTable.module.css"

export default function ProjectTable({ projects, onDelete, onEdit }:{projects:Project[],onDelete:(id:number)=>void,onEdit:(project:Project)=>void}) {
  console.log(projects,'projects')  
  return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Technologies</th>
              <th>Links</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project:Project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td className={styles.descriptionCell}>{project.description}</td>
                <td>
                  {project.technologies.slice(0, 3).join(', ')}
                  {project.technologies.length > 3 && '...'}
                </td>
                <td>
                  <div className={styles.linkButtons}>
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.tableLink}
                    >
                      GitHub
                    </a>
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.tableLink}
                      >
                        Live
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