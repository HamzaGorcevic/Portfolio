'use client'
import { ReactEventHandler, useState } from 'react';
import styles from '../../styles/admin.module.css';
import { Project } from '@/types/project';


const AdminPage = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    image: '',
  });
  const [projectMessage, setProjectMessage] = useState('');

  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    if (name === 'technologies') {
      setNewProject((prevState) => ({
        ...prevState,
        [name]: value.split(',').map((tech:string) => tech.trim()),
      }));
    } else {
      setNewProject((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddProjectClick = () => {
    setIsAddingProject(true);
    setProjectMessage(''); // Clear any previous messages
    setNewProject({
      title: '',
      description: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      image: '',
    }); // Reset form
  };

  const handleCancelAddProject = () => {
    setIsAddingProject(false);
  };

  const handleSubmitProject = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        setProjectMessage('Project added successfully!');
        setNewProject({
          title: '',
          description: '',
          technologies: [],
          githubUrl: '',
          liveUrl: '',
          image: '',
        }); // Clear form on success
      } else {
        setProjectMessage(`Error adding project: ${data.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      setProjectMessage('Failed to add project. Please try again.');
    }
  };

  if (!authorized) {
    return (
      <div className={styles.adminContainer}>
        <h2>Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={checkPassword} className={styles.button}>Login</button>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Dashboard</h1>

      {!isAddingProject ? (
        <button onClick={handleAddProjectClick} className={styles.button}>Add New Project</button>
      ) : (
        <div className={styles.formContainer}>
          <h2>Add New Project</h2>
          <form onSubmit={handleSubmitProject}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProject.title}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newProject.description}
                onChange={handleInputChange}
                className={styles.textarea}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="technologies">Technologies (comma-separated):</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={newProject.technologies.join(', ')}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="githubUrl">GitHub Link:</label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={newProject.githubUrl}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="liveUrl">Live Link (Optional):</label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={newProject.liveUrl ?? ''}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">Image URL:</label>
              <input
                type="url"
                id="image"
                name="image"
                value={newProject.image}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.button}>Add Project</button>
            <button type="button" onClick={handleCancelAddProject} className={styles.button}>Cancel</button>
          </form>
          {projectMessage && <p className={styles.message}>{projectMessage}</p>}
        </div>
      )}

      {/* You can add more forms here for adding blog posts etc. */}
    </div>
  );
};

export default AdminPage;