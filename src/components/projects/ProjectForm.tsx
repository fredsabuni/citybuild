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

  // Auto-calculate timeline when dates change
  const calculateTimeline = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const months = Math.round(diffDays / 30);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  const allFields: FormField[] = [
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
      name: 'projectType',
      label: 'Project Type',
      type: 'select',
      required: true,
      options: [
        { value: 'commercial', label: 'Commercial' },
        { value: 'residential', label: 'Residential' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'renovation', label: 'Renovation' },
        { value: 'mixed_use', label: 'Mixed Use' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'startDate',
      label: 'Planned Start Date',
      type: 'date',
      placeholder: 'Select start date',
    },
    {
      name: 'endDate',
      label: 'Planned End Date',
      type: 'date',
      placeholder: 'Select end date',
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
  ];

  const handleFormSubmit = (data: any) => {
    const estimatedCostNumber = data.estimatedCost
      ? parseFloat(data.estimatedCost)
      : undefined;

    // Auto-calculate timeline from dates
    const timeline = (data.startDate && data.endDate) 
      ? calculateTimeline(data.startDate, data.endDate)
      : '';

    const payload: any = {
      name: data.name,
      description: data.description,
      location: data.location || '',
      project_type: data.projectType || '',
      estimated_cost: Number.isFinite(estimatedCostNumber) ? estimatedCostNumber : null,
      timeline: timeline,
      start_date: data.startDate || '',
      end_date: data.endDate || '',
      special_requirements: data.specialRequirements || '',
    };

    // Only include contact fields if they have values
    if (data.contactPerson) {
      payload.contact_person = data.contactPerson;
    }
    if (data.contactPhone) {
      payload.contact_phone = data.contactPhone;
    }
    if (data.contactEmail) {
      payload.contact_email = data.contactEmail;
    }

    onSubmit(payload);
  };

  const handleFieldChange = (fieldName: string, value: any, allData: any) => {
    setFormData({ ...allData, [fieldName]: value });
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Create New Project</h2>
          <p className="text-muted-foreground">
            Fill in the project details below
          </p>
        </div>

        <FormWidget
          fields={allFields}
          onSubmit={handleFormSubmit}
          loading={loading}
          initialData={formData}
          submitText="Create Project"
          onFieldChange={handleFieldChange}
        />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div /> {/* Spacer */}
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
