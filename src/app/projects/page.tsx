'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all' 
    ? mockProjects 
    : mockProjects.filter(project => project.status === filter);

  const renderProjectCard = (project: any) => (
    <CardWidget
      key={project.id}
      title={project.name}
      variant={project.status === 'active' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Budget:</span>
              <div className="font-medium">{formatCurrency(project.estimatedCost || 0)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Timeline:</span>
              <div className="font-medium">{project.timeline}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <div className="font-medium">{formatDate(project.createdAt)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge
                  variant={
                    project.status === 'active'
                      ? 'success'
                      : project.status === 'bidding'
                      ? 'warning'
                      : project.status === 'completed'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>

          {project.planFiles && project.planFiles.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Files:</span>
              <div className="mt-1 space-y-1">
                {project.planFiles.map((file: any) => (
                  <div key={file.id} className="text-xs bg-muted px-2 py-1 rounded">
                    📄 {file.name}
                  </div>
                ))}
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
          {project.status === 'draft' && (
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
        <ListWidget
          items={filteredProjects}
          renderItem={renderProjectCard}
          emptyState={
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {filter === 'all' ? 'No Projects Yet' : `No ${filter} Projects`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? 'Start by creating your first construction project.'
                  : `You don't have any ${filter} projects at the moment.`
                }
              </p>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          }
        />
      </div>
    </Layout>
  );
}