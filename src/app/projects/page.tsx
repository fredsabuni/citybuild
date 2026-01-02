'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { PlusIcon } from '@heroicons/react/24/outline';

type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'BIDDING' | 'AWARDED' | 'COMPLETED';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  useEffect(() => {
    fetchProjects();
  }, [page, filter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (filter !== 'all') {
        params.append('status', filter.toUpperCase());
      }

      const res = await fetchWithAuth(`/api/v1/projects/?${params}`);
      
      if (!res.ok) {
        if (res.status === 401) {
          // Auth modal will be shown by fetchWithAuth
          return;
        }
        throw new Error('Failed to fetch projects');
      }

      const data = await res.json();
      setProjects(data.projects || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
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

  const renderProjectCard = (project: any) => (
    <CardWidget
      key={project.id}
      title={project.name}
      variant={project.status === 'ACTIVE' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Budget:</span>
              <div className="font-medium">{formatCurrency(project.estimated_cost || 0)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Timeline:</span>
              <div className="font-medium">{project.timeline}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div className="font-medium">{formatDate(new Date(project.created_at))}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>

          {project.project_files && project.project_files.length > 0 && (
            <div className="pt-3 border-t">
              <span className="text-sm font-medium text-muted-foreground mb-2 block">
                Files ({project.project_files.length})
              </span>
              <div className="space-y-1.5">
                {project.project_files.slice(0, 3).map((file: any) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between text-xs bg-muted px-2.5 py-1.5 rounded hover:bg-muted/80 transition-colors group"
                  >
                    <span className="truncate flex-1 font-medium">
                      📄 {file.original_name || file.filename}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(file.s3_url, '_blank');
                      }}
                      className="ml-2 text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ⬇
                    </button>
                  </div>
                ))}
                {project.project_files.length > 3 && (
                  <div className="text-xs text-muted-foreground pl-2.5">
                    +{project.project_files.length - 3} more file{project.project_files.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Link href={`/projects/${project.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          {project.status === 'DRAFT' && (
            <Button size="sm">
              Publish
            </Button>
          )}
        </div>
      }
    />
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your construction projects and track their progress
            </p>
          </div>
          
          <Link href="/projects/create">
            <Button className="sm:w-auto">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Projects
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Drafts
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'bidding' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('bidding')}
          >
            Bidding
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : (
          <ListWidget
            items={projects}
            renderItem={renderProjectCard}
            emptyState={
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {filter === 'all' ? 'No Projects Yet' : `No ${filter.toLowerCase()} Projects`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? 'Start by creating your first construction project.'
                    : `You don't have any ${filter.toLowerCase()} projects at the moment.`
                  }
                </p>
                <Link href="/projects/create">
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            }
          />
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}