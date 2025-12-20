'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/context';
import { CardWidget, FormWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { SunIcon, MoonIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/types';
import Link from 'next/link';

export default function DemoPage() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<any>(null);

  // Sample form fields
  const sampleFormFields: FormField[] = [
    {
      name: 'projectName',
      label: 'Project Name',
      type: 'text',
      placeholder: 'Enter project name',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50,
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'role',
      label: 'User Role',
      type: 'select',
      required: true,
      options: [
        { value: 'gc', label: 'General Contractor' },
        { value: 'subcontractor', label: 'Subcontractor' },
        { value: 'supplier', label: 'Supplier' },
        { value: 'bank', label: 'Bank' },
      ],
    },
    {
      name: 'description',
      label: 'Project Description',
      type: 'textarea',
      placeholder: 'Describe your project...',
      validation: {
        maxLength: 500,
      },
    },
    {
      name: 'planFile',
      label: 'Building Plans',
      type: 'file',
    },
  ];

  // Sample list items
  const sampleProjects = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      status: 'Active',
      budget: '$2,500,000',
      timeline: '18 months',
    },
    {
      id: 2,
      name: 'Residential Complex Phase 1',
      status: 'Bidding',
      budget: '$1,800,000',
      timeline: '12 months',
    },
    {
      id: 3,
      name: 'Warehouse Renovation',
      status: 'Draft',
      budget: '$850,000',
      timeline: '8 months',
    },
  ];

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    console.log('Form submitted:', data);
  };

  const renderProjectItem = (project: any) => (
    <CardWidget
      key={project.id}
      title={project.name}
      variant={project.status === 'Active' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Budget:</span>
            <span className="font-medium">{project.budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Timeline:</span>
            <span className="font-medium">{project.timeline}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge
              variant={
                project.status === 'Active'
                  ? 'success'
                  : project.status === 'Bidding'
                  ? 'warning'
                  : 'secondary'
              }
            >
              {project.status}
            </Badge>
          </div>
        </div>
      }
      actions={
        <Button size="sm" variant="outline">
          View Details
        </Button>
      }
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold">CityBuild Demo</span>
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Demo Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Widget Components Demo</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Widget Demo */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Form Widget</h2>
              <CardWidget
                title="Project Registration Form"
                content={
                  <FormWidget
                    fields={sampleFormFields}
                    onSubmit={handleFormSubmit}
                  />
                }
              />
              
              {formData && (
                <CardWidget
                  title="Form Submission Result"
                  variant="highlighted"
                  content={
                    <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                      {JSON.stringify(formData, null, 2)}
                    </pre>
                  }
                />
              )}
            </div>

            {/* List Widget Demo */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">List Widget</h2>
              <CardWidget
                title="Active Projects"
                content={
                  <ListWidget
                    items={sampleProjects}
                    renderItem={renderProjectItem}
                  />
                }
              />
              
              {/* Empty State Demo */}
              <CardWidget
                title="Empty State Example"
                content={
                  <ListWidget
                    items={[]}
                    renderItem={() => null}
                    emptyState={
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                          <span className="text-2xl">🏗️</span>
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start by creating your first construction project.
                        </p>
                        <Button>Create Project</Button>
                      </div>
                    }
                  />
                }
              />
            </div>
          </div>

          {/* Card Widget Variants */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Card Widget Variants</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <CardWidget
                title="Default Card"
                content={
                  <p className="text-muted-foreground">
                    This is a default card variant with standard styling.
                  </p>
                }
                actions={<Button size="sm">Action</Button>}
              />
              
              <CardWidget
                title="Highlighted Card"
                variant="highlighted"
                content={
                  <p className="text-muted-foreground">
                    This is a highlighted card variant for important content.
                  </p>
                }
                actions={<Button size="sm">Action</Button>}
              />
              
              <CardWidget
                title="Warning Card"
                variant="warning"
                content={
                  <p className="text-muted-foreground">
                    This is a warning card variant for alerts or errors.
                  </p>
                }
                actions={<Button size="sm" variant="destructive">Action</Button>}
              />
            </div>
          </div>

          {/* UI Components */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">UI Components</h2>
            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-medium mb-4">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-medium mb-4">Badges</h3>
                <div className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}