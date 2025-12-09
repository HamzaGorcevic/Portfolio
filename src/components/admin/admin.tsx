'use client'
import { useState } from 'react';
import styles from '../../styles/admin.module.css';
import { Project } from '@/types/project';
import ProjectForm from './projectForm';
import ProjectTable from './projectTable';
import { logout } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { FaUpload, FaCheck, FaFilePdf, FaImage, FaFolderOpen, FaSignOutAlt, FaPlus } from 'react-icons/fa';

type TabType = 'projects' | 'profile' | 'resume';

const AdminDashboard = ({projects}:{projects:Project[]}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const router = useRouter();
  
  // Profile upload state
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  
  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeMessage, setResumeMessage] = useState('');
  
  const handleLogout = async () => {
    await logout();
    router.refresh();
  };
  
  const onDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`api/projects/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
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
  
  const onEdit = (project: Project) => {
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
  
  // Profile image upload
  const handleProfileUpload = async () => {
    if (!profileFile) return;
    
    setProfileUploading(true);
    setProfileMessage('');
    
    const formData = new FormData();
    formData.append('file', profileFile);
    
    try {
      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setProfileMessage('Profile image updated successfully!');
        setProfileFile(null);
      } else {
        setProfileMessage(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setProfileMessage('Failed to upload image');
    } finally {
      setProfileUploading(false);
    }
  };
  
  // Resume upload
  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    
    setResumeUploading(true);
    setResumeMessage('');
    
    const formData = new FormData();
    formData.append('file', resumeFile);
    
    try {
      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResumeMessage('Resume updated successfully!');
        setResumeFile(null);
      } else {
        setResumeMessage(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      setResumeMessage('Failed to upload resume');
    } finally {
      setResumeUploading(false);
    }
  };
  
  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.h1}>Admin Dashboard</h1>
        <div className={styles.headerButtons}>
          <button onClick={handleLogout} className={styles.button}>
            <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'projects' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <FaFolderOpen style={{ marginRight: '0.5rem' }} />
          Projects
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaImage style={{ marginRight: '0.5rem' }} />
          Profile Image
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'resume' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          <FaFilePdf style={{ marginRight: '0.5rem' }} />
          Resume
        </button>
      </div>
      
      {/* Content */}
      <div className={styles.dashboard}>
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Manage Projects</h2>
              <button onClick={onAddNew} className={styles.primaryButton}>
                <FaPlus style={{ marginRight: '0.5rem' }} />
                Add New Project
              </button>
            </div>
            <ProjectTable projects={projects} onDelete={onDelete} onEdit={onEdit}/>
          </div>
        )}
        
        {/* Profile Image Tab */}
        {activeTab === 'profile' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Update Profile Image</h2>
            <p style={{ color: '#a0a0a0', marginBottom: '1.5rem' }}>
              Upload a new profile image to replace the current one on your homepage.
            </p>
            
            <div className={styles.previewContainer}>
              {/* Current Image */}
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Current Image</p>
                <img 
                  src={`/hamza.jpg?t=${Date.now()}`} 
                  alt="Current profile" 
                  className={styles.imagePreview}
                />
              </div>
              
              {/* Upload Area */}
              <label 
                className={`${styles.uploadArea} ${profileFile ? styles.uploadAreaActive : ''}`}
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                />
                <FaUpload className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {profileFile ? profileFile.name : 'Click or drag to upload image'}
                </p>
                <p className={styles.uploadHint}>Recommended: Square image, at least 400x400px</p>
              </label>
              
              {profileFile && (
                <button 
                  onClick={handleProfileUpload} 
                  className={styles.primaryButton}
                  disabled={profileUploading}
                  style={{ marginTop: '1rem' }}
                >
                  {profileUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              )}
              
              {profileMessage && (
                <div className={`${styles.message} ${profileMessage.includes('success') ? styles.success : styles.error}`}>
                  {profileMessage}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Update Resume</h2>
            <p style={{ color: '#a0a0a0', marginBottom: '1.5rem' }}>
              Upload a new resume PDF to replace the current downloadable resume.
            </p>
            
            <div className={styles.previewContainer}>
              {/* Current Resume */}
              <div className={styles.filePreview} style={{ marginBottom: '1.5rem' }}>
                <FaFilePdf className={styles.fileIcon} />
                <div>
                  <p className={styles.fileName}>resume.pdf</p>
                  <a 
                    href="/files/resume.pdf" 
                    target="_blank" 
                    style={{ color: '#667eea', fontSize: '0.85rem' }}
                  >
                    View current resume →
                  </a>
                </div>
              </div>
              
              {/* Upload Area */}
              <label 
                className={`${styles.uploadArea} ${resumeFile ? styles.uploadAreaActive : ''}`}
                style={{ width: '100%', maxWidth: '400px' }}
              >
                <input 
                  type="file" 
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <FaUpload className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {resumeFile ? resumeFile.name : 'Click or drag to upload PDF'}
                </p>
                <p className={styles.uploadHint}>PDF format only</p>
              </label>
              
              {resumeFile && (
                <button 
                  onClick={handleResumeUpload} 
                  className={styles.primaryButton}
                  disabled={resumeUploading}
                  style={{ marginTop: '1rem' }}
                >
                  {resumeUploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              )}
              
              {resumeMessage && (
                <div className={`${styles.message} ${resumeMessage.includes('success') ? styles.success : styles.error}`}>
                  {resumeMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <ProjectForm projectData={selectedProject} isOpen={isOpen} onClose={onClose}/>
    </div>
  );
};

export default AdminDashboard;
