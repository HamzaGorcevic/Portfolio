'use client'
import { useState } from 'react';
import styles from '../../styles/admin.module.css';
import { Project } from '@/types/project';
import ProjectForm from './projectForm';
import ProjectTable from './projectTable';

const AdminPage = ({projects}:{projects:Project[]}) => {
  const [authorized, setAuthorized] = useState(false);
  const [selectedProject,setSelectedProject] = useState<Project |null>(null);
  const [password, setPassword] = useState('');
  const [isOpen,setIsOpen] = useState(false);
  
  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };
  
  if (!authorized) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2 className={styles.h2}>Admin Login</h2>
          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter admin password"
            />
          </div>
          <button onClick={checkPassword} className={styles.button}>Login</button>
        </div>
      </div>
    );
  }
  
  const onDelete = async (id:number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refresh the page or update the projects list
          window.location.reload();
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };
  
  const onEdit = (project:Project) => {
    setIsOpen(true);
    setSelectedProject(project);
  };
  
  const onClose = () => {
    setIsOpen(false);
    setSelectedProject(null);
  };
  
  const onAddNew = () => {
    setIsOpen(true);
    setSelectedProject(null);
  };
  
  return (
    <div className={styles.adminContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.h1}>Admin Dashboard</h1>
        <button 
          onClick={onAddNew}
          className={styles.primaryButton}
        >
          Add New Project
        </button>
      </div>
      
      <div className={styles.dashboard}>
        <div>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <ProjectTable projects={projects} onDelete={onDelete} onEdit={onEdit}/>
        </div>
      </div>
      
      <ProjectForm projectData={selectedProject} isOpen={isOpen} onClose={onClose}/>
    </div>
  );
};

export default AdminPage;