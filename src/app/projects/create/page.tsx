'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget } from '@/components/widgets';
import { Button } from '@/components/ui';
import ProjectForm from '@/components/projects/ProjectForm';
import { useApp } from '@/lib/context';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateProjectPage() {
  const router = useRouter();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);

  const handleProjectSubmit = async (projectData: any) => {
    setLoading(true);
    
    try {
      const res = await fetchWithAuth('/api/v1/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Auth modal will be shown by fetchWithAuth
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed with ${res.status}`);
      }

      const created = await res.json();
      console.log('Project created:', created);

      router.push('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  // Check if user is authorized to create projects
  if (!user || user.role !== 'gc') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <CardWidget
            title="Access Denied"
            content={
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                <p className="text-muted-foreground">
                  Only General Contractors can create projects.
                </p>
              </div>
            }
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Projects</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Set up your construction project and start receiving bids from qualified contractors
          </p>
        </div>

        {/* Project Form */}
        <CardWidget
          title=""
          content={
            <ProjectForm
              onSubmit={handleProjectSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          }
        />
      </div>
    </Layout>
  );
}