import React, { useEffect, useState } from 'react';
import styles from "../../styles/projectForm.module.css";
import { Project } from '@/types/project';

const ProjectForm = ({projectData=null, isOpen, onClose}:{projectData?:Project|null, isOpen:boolean, onClose:()=>void}) => {
    const [projectMessage, setProjectMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        image: null,
    });

    useEffect(() => {
        if (projectData) {
            setNewProject({
                title: projectData.title,
                description: projectData.description,
                technologies: projectData.technologies,
                githubUrl: projectData.githubUrl,
                liveUrl: projectData.liveUrl ?? '',
                image: projectData.image,
            });
        }
    }, [projectData]);

    const handleSubmitProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", newProject.title);
            formData.append("description", newProject.description);
            formData.append("githubUrl", newProject.githubUrl);
            formData.append('technologies',newProject.technologies);
            if (newProject.image) {
                formData.append('image', newProject.image);
            }
            if (newProject.liveUrl) {
                formData.append('liveUrl', newProject.liveUrl);
            }

            const method = projectData ? 'PUT' : 'POST';
            const id = projectData?.id ? projectData.id : null;
            const baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || 'http://localhost:3000'; // Use your localhost in dev
            const response = await fetch(`${baseUrl}/api/projects/${id || ''}`, {
                method: method,
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setProjectMessage('Project saved successfully!');
                setMessageType('success');
                onClose();
                setNewProject({
                        title: '',
                        description: '',
                        technologies:'',
                        githubUrl: '',
                        liveUrl: '',
                        image: null,
                    });
            } else {
                setProjectMessage(`Error saving project: ${data.message || 'Something went wrong.'}`);
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            setProjectMessage('Failed to save project. Please try again.');
            setMessageType('error');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files;
        if (name === 'image' && files && files[0]) {
            setNewProject(prevState => ({
                ...prevState,
                image: files[0],
            }));
        
        } else {
            setNewProject(prevState => ({
                ...prevState,
                [name]: files ? files : value,
            }));
        }
    };

    const handleModalClose = () => {
        setProjectMessage('');
        setMessageType('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{projectData ? 'Edit Project' : 'Add New Project'}</h2>
                    <button type="button" className={styles.modalClose} onClick={handleModalClose}>×</button>
                </div>
                
                <div className={styles.modalContent}>
                    <form id="projectForm" onSubmit={handleSubmitProject}>
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
                                value={newProject.technologies}
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
                            <label htmlFor="image">Image:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleInputChange}
                                className={styles.input}
                                accept="image/*"
                                required={!projectData}
                            />
                        </div>
                    </form>
                    
                    {projectMessage && (
                        <p className={`${styles.message} ${styles[messageType]}`}>
                            {projectMessage}
                        </p>
                    )}
                </div>
                
                <div className={styles.modalFooter}>
                    <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={handleModalClose}>
                        Cancel
                    </button>
                    <button type="submit" form="projectForm" className={`${styles.button} ${styles.primary}`}>
                        {projectData ? 'Update Project' : 'Add Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
