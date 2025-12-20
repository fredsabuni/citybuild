'use client';

import React, { useState } from 'react';
import { FormWidget } from '@/components/widgets';
import { Button } from '@/components/ui';
import FileUpload from '@/components/ui/FileUpload';
import { FormField } from '@/types';
import { generateId } from '@/lib/utils';

interface ProjectFormProps {
  onSubmit: (projectData: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  initialData?: any;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const projectFields: FormField[] = [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      placeholder: 'Enter project name',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100,
      },
    },
    {
      name: 'description',
      label: 'Project Description',
      type: 'textarea',
      placeholder: 'Describe the project scope, requirements, and objectives...',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 1000,
      },
    },
    {
      name: 'location',
      label: 'Project Location',
      type: 'text',
      placeholder: 'Enter project address or location',
      required: true,
    },
    {
      name: 'estimatedCost',
      label: 'Estimated Budget',
      type: 'text',
      placeholder: 'e.g., 2500000',
      validation: {
        pattern: /^\d+(\.\d{1,2})?$/,
        custom: (value: string) => {
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) {
            return 'Please enter a valid budget amount';
          }
          if (num > 100000000) {
            return 'Budget amount seems too large';
          }
          return null;
        },
      },
    },
    {
      name: 'timeline',
      label: 'Expected Timeline',
      type: 'text',
      placeholder: 'e.g., 18 months, 2 years',
      required: true,
    },
    {
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      required: true,
      options: [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'renovation', label: 'Renovation' },
      ],
    },
  ];

  const additionalFields: FormField[] = [
    {
      name: 'startDate',
      label: 'Planned Start Date',
      type: 'text',
      placeholder: 'MM/DD/YYYY',
      validation: {
        pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      },
    },
    {
      name: 'endDate',
      label: 'Planned End Date',
      type: 'text',
      placeholder: 'MM/DD/YYYY',
      validation: {
        pattern: /^\d{2}\/\d{2}\/\d{4}$/,
      },
    },
    {
      name: 'specialRequirements',
      label: 'Special Requirements',
      type: 'textarea',
      placeholder: 'Any special requirements, certifications, or considerations...',
      validation: {
        maxLength: 500,
      },
    },
    {
      name: 'contactPerson',
      label: 'Primary Contact',
      type: 'text',
      placeholder: 'Name of primary contact person',
    },
    {
      name: 'contactPhone',
      label: 'Contact Phone',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      validation: {
        pattern: /^\+?[\d\s\-\(\)]+$/,
      },
    },
  ];

  const handleBasicInfoSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const handleAdditionalInfoSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleFinalSubmit = () => {
    const projectData = {
      ...formData,
      id: generateId(),
      planFiles: uploadedFiles.map(file => ({
        id: generateId(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // In real app, this would be uploaded to server
        uploadedAt: new Date(),
      })),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSubmit(projectData);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? 'bg-primary text-primary-foreground'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Basic Project Information</h2>
              <p className="text-muted-foreground">
                Let's start with the essential details about your project
              </p>
            </div>

            <FormWidget
              fields={projectFields}
              onSubmit={handleBasicInfoSubmit}
              loading={loading}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div /> {/* Spacer */}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
              <p className="text-muted-foreground">
                Provide additional information to help contractors understand your project
              </p>
            </div>

            <FormWidget
              fields={additionalFields}
              onSubmit={handleAdditionalInfoSubmit}
              loading={loading}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <div /> {/* Spacer */}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Upload Building Plans</h2>
              <p className="text-muted-foreground">
                Upload your building plans, blueprints, and related documents
              </p>
            </div>

            <FileUpload
              onFilesChange={handleFilesChange}
              acceptedTypes={['pdf', 'dwg', 'dxf', 'jpg', 'png']}
              maxFiles={10}
              maxSize={25 * 1024 * 1024} // 25MB
            />

            {/* Project Summary */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Project Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <div className="font-medium">{formData.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <div className="font-medium capitalize">{formData.projectType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span>
                  <div className="font-medium">
                    {formData.estimatedCost ? `$${parseFloat(formData.estimatedCost).toLocaleString()}` : 'Not specified'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Timeline:</span>
                  <div className="font-medium">{formData.timeline}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Location:</span>
                  <div className="font-medium">{formData.location}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Files:</span>
                  <div className="font-medium">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleFinalSubmit} disabled={loading}>
                  Save as Draft
                </Button>
                <Button onClick={handleFinalSubmit} disabled={loading}>
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderStepIndicator()}
      {renderStepContent()}
    </div>
  );
};

export default ProjectForm;