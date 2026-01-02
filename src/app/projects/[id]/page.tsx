'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import {
  DocumentIcon,
  PencilIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'BIDDING' | 'AWARDED' | 'COMPLETED';

interface ProjectFile {
  id: string;
  name: string;
  original_name: string;
  file_type: string;
  mime_type: string;
  size: number;
  category: string;
  s3_url: string;
  created_at: string;
  uploaded_by_user_id: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  project_type: string;
  estimated_cost: number;
  timeline: string;
  start_date: string;
  end_date: string;
  special_requirements: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  status: ProjectStatus;
  gc_organization_id: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  project_files: ProjectFile[];
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState<string>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    estimated_cost: 0,
    status: '' as ProjectStatus,
    start_date: '',
    end_date: '',
    timeline: '',
  });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetchWithAuth(`/api/v1/projects/${projectId}`);
      
      if (!res.ok) {
        if (res.status === 401) {
          // Auth modal will be shown by fetchWithAuth
          return;
        }
        if (res.status === 422) {
          setError('Invalid project ID or project data is malformed.');
          return;
        }
        if (res.status === 404) {
          setError('Project not found.');
          return;
        }
        throw new Error('Failed to fetch project details');
      }

      const data = await res.json();
      setProject(data);
      setEditForm({
        name: data.name,
        description: data.description,
        estimated_cost: data.estimated_cost,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        timeline: data.timeline,
      });
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('An unexpected error occurred while loading the project.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeline = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.round((diffDays % 365) / 30);
      if (remainingMonths > 0) {
        return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      }
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'BIDDING':
        return 'warning';
      case 'COMPLETED':
        return 'default';
      case 'DRAFT':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handlePublish = async () => {
    if (!projectId) return;
    
    setPublishing(true);
    try {
      const res = await fetchWithAuth(`/api/v1/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          return;
        }
        throw new Error('Failed to publish project');
      }

      const updatedProject = await res.json();
      setProject(updatedProject);
      setEditForm({
        name: updatedProject.name,
        description: updatedProject.description,
        estimated_cost: updatedProject.estimated_cost,
        status: updatedProject.status,
        start_date: updatedProject.start_date,
        end_date: updatedProject.end_date,
        timeline: updatedProject.timeline,
      });
    } catch (err) {
      console.error('Error publishing project:', err);
      alert('Failed to publish project. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/v1/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert('You are not authorized to update this project. Please log in again.');
          setLoading(false);
          return;
        }
        throw new Error('Failed to update project');
      }

      const updatedProject = await res.json();
      setProject(updatedProject);
      setEditForm({
        name: updatedProject.name,
        description: updatedProject.description,
        estimated_cost: updatedProject.estimated_cost,
        status: updatedProject.status,
        start_date: updatedProject.start_date,
        end_date: updatedProject.end_date,
        timeline: updatedProject.timeline,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !projectId) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', fileCategory);

      const res = await fetchWithAuth(`/api/v1/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setUploadError('You are not authorized to upload files. Please log in again.');
          return;
        }
        
        if (res.status === 400) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || errorData.message || 'Invalid file or missing required fields.');
        }
        
        if (res.status === 413) {
          throw new Error('File is too large. Please choose a smaller file.');
        }
        
        if (res.status === 415) {
          throw new Error('File type is not supported. Please choose a different file.');
        }
        
        if (res.status === 422) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Invalid data provided. Please check your input.');
        }
        
        if (res.status === 500) {
          throw new Error('Server error occurred. Please try again later.');
        }
        
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Upload failed with status ${res.status}`);
      }

      const uploadedFile = await res.json();
      
      // Show success message
      setUploadSuccess(`File "${uploadedFile.original_name}" uploaded successfully!`);
      
      // Refresh project details to show the new file
      await fetchProjectDetails();
      
      // Reset form after a short delay to show success message
      setTimeout(() => {
        setSelectedFile(null);
        setFileCategory('general');
        setShowUploadForm(false);
        setUploadSuccess(null);
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }, 2000);
      
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setUploadError(err.message || 'An unexpected error occurred while uploading the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setFileCategory('general');
    setShowUploadForm(false);
    setUploadError(null);
    setUploadSuccess(null);
    
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Project</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push('/projects')}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            <Button onClick={fetchProjectDetails}>
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Project not found.</p>
          <Link href="/projects">
            <Button variant="outline" className="mt-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            
            <div className="flex items-start gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-3xl font-bold mb-2 w-full px-3 py-1 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                )}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ProjectStatus })}
                      className="px-3 py-1 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="BIDDING">BIDDING</option>
                      <option value="AWARDED">AWARDED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  ) : (
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground capitalize">
                    {project.project_type}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {project.status === 'DRAFT' && !isEditing && (
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing ? 'Publishing...' : 'Publish Project'}
              </Button>
            )}
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: project.name,
                      description: project.description,
                      estimated_cost: project.estimated_cost,
                      status: project.status,
                      start_date: project.start_date,
                      end_date: project.end_date,
                      timeline: project.timeline,
                    });
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <CardWidget
              title="Project Description"
              content={
                <div className="space-y-4">
                  {isEditing ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  ) : (
                    <p className="text-foreground">{project.description}</p>
                  )}
                  
                  {project.special_requirements && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Special Requirements</h4>
                      <p className="text-muted-foreground">{project.special_requirements}</p>
                    </div>
                  )}
                </div>
              }
            />

            {/* Budget & Timeline */}
            <CardWidget
              title="Budget & Timeline"
              content={
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CurrencyDollarIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Estimated Cost</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editForm.estimated_cost}
                            onChange={(e) => setEditForm({ ...editForm, estimated_cost: Number(e.target.value) })}
                            className="text-2xl font-bold text-primary w-full px-2 py-1 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(project.estimated_cost)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Timeline</p>
                        <p className="text-lg font-medium">
                          {isEditing ? editForm.timeline || project.timeline : project.timeline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editForm.start_date}
                            onChange={(e) => {
                              const newStartDate = e.target.value;
                              const newTimeline = calculateTimeline(newStartDate, editForm.end_date);
                              setEditForm({ 
                                ...editForm, 
                                start_date: newStartDate,
                                timeline: newTimeline,
                              });
                            }}
                            className="text-lg font-medium w-full px-2 py-1 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <p className="text-lg font-medium">
                            {formatDate(new Date(project.start_date))}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CalendarIcon className="w-5 h-5 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">End Date</p>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editForm.end_date}
                            onChange={(e) => {
                              const newEndDate = e.target.value;
                              const newTimeline = calculateTimeline(editForm.start_date, newEndDate);
                              setEditForm({ 
                                ...editForm, 
                                end_date: newEndDate,
                                timeline: newTimeline,
                              });
                            }}
                            className="text-lg font-medium w-full px-2 py-1 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <p className="text-lg font-medium">
                            {formatDate(new Date(project.end_date))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Project Files */}
            <CardWidget
              title="Project Files"
              actions={
                <Button
                  size="sm"
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  variant={showUploadForm ? 'outline' : 'default'}
                >
                  {showUploadForm ? (
                    <>
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              }
              content={
                <div className="space-y-4">
                  {/* Upload Form */}
                  {showUploadForm && (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                            Select File
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileSelect}
                            className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
                            disabled={uploading}
                          />
                          {selectedFile && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="file-category" className="block text-sm font-medium mb-2">
                            Category
                          </label>
                          <select
                            id="file-category"
                            value={fileCategory}
                            onChange={(e) => setFileCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled={uploading}
                          >
                            <option value="general">General</option>
                            <option value="plans">Plans</option>
                            <option value="permits">Permits</option>
                            <option value="contracts">Contracts</option>
                            <option value="specifications">Specifications</option>
                            <option value="drawings">Drawings</option>
                            <option value="reports">Reports</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {uploadError && (
                          <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-sm text-destructive">{uploadError}</p>
                          </div>
                        )}

                        {uploadSuccess && (
                          <div className="p-3 bg-green-500/10 border border-green-500 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-400">{uploadSuccess}</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button
                            onClick={handleFileUpload}
                            disabled={!selectedFile || uploading}
                            className="flex-1"
                          >
                            {uploading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                                Upload File
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={cancelUpload}
                            variant="outline"
                            disabled={uploading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files List */}
                  {project.project_files && project.project_files.length > 0 ? (
                    <div className="space-y-2">
                      {project.project_files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <DocumentIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{file.original_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.category} • {(file.size / 1024).toFixed(2)} KB • Uploaded {formatDate(new Date(file.created_at))}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => window.open(file.s3_url, '_blank')}
                          >
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : !showUploadForm ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <DocumentIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No files uploaded yet</p>
                      <p className="text-sm mt-1">Click "Upload File" to add project documents</p>
                    </div>
                  ) : null}
                </div>
              }
            />
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Location */}
            <CardWidget
              title="Location"
              content={
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <p className="text-foreground">{project.location}</p>
                </div>
              }
            />

            {/* Contact Information */}
            <CardWidget
              title="Contact Information"
              content={
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <UserIcon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{project.contact_person}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a 
                        href={`tel:${project.contact_phone}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {project.contact_phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a 
                        href={`mailto:${project.contact_email}`}
                        className="font-medium hover:text-primary transition-colors break-all"
                      >
                        {project.contact_email}
                      </a>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Timestamps */}
            <CardWidget
              title="Project Info"
              content={
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {formatDate(new Date(project.created_at))}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {formatDate(new Date(project.updated_at))}
                    </p>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
