import { Project, Bid } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Downtown Office Complex',
    description: 'Modern 5-story office building with underground parking',
    gcId: 'gc-1',
    status: 'bidding',
    planFiles: [
      {
        id: 'file-1',
        name: 'floor-plans.pdf',
        type: 'application/pdf',
        size: 2048000,
        url: '/mock/floor-plans.pdf',
        uploadedAt: new Date('2024-12-01'),
      },
      {
        id: 'file-2',
        name: 'electrical-layout.dwg',
        type: 'application/dwg',
        size: 1024000,
        url: '/mock/electrical-layout.dwg',
        uploadedAt: new Date('2024-12-01'),
      },
    ],
    estimatedCost: 2500000,
    timeline: '18 months',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'proj-2',
    name: 'Residential Complex Phase 1',
    description: '24-unit residential building with amenities',
    gcId: 'gc-1',
    status: 'active',
    planFiles: [
      {
        id: 'file-3',
        name: 'site-plan.pdf',
        type: 'application/pdf',
        size: 1536000,
        url: '/mock/site-plan.pdf',
        uploadedAt: new Date('2024-11-15'),
      },
    ],
    estimatedCost: 1800000,
    timeline: '12 months',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'proj-3',
    name: 'Warehouse Renovation',
    description: 'Converting old warehouse to modern distribution center',
    gcId: 'gc-1',
    status: 'bidding',
    planFiles: [
      {
        id: 'file-4',
        name: 'renovation-plans.pdf',
        type: 'application/pdf',
        size: 3072000,
        url: '/mock/renovation-plans.pdf',
        uploadedAt: new Date('2024-12-08'),
      },
    ],
    estimatedCost: 850000,
    timeline: '8 months',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'proj-4',
    name: 'Smart Home Electrical Installation',
    description: 'Complete electrical system upgrade with smart home integration for luxury residential property',
    gcId: 'gc-2',
    status: 'bidding',
    planFiles: [
      {
        id: 'file-5',
        name: 'electrical-schematics.dwg',
        type: 'application/dwg',
        size: 1800000,
        url: '/mock/electrical-schematics.dwg',
        uploadedAt: new Date('2024-12-12'),
      },
      {
        id: 'file-6',
        name: 'smart-home-specs.pdf',
        type: 'application/pdf',
        size: 2200000,
        url: '/mock/smart-home-specs.pdf',
        uploadedAt: new Date('2024-12-12'),
      },
    ],
    estimatedCost: 450000,
    timeline: '6 weeks',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-16'),
  },
  {
    id: 'proj-5',
    name: 'Commercial HVAC System Installation',
    description: 'Industrial-grade HVAC system for new manufacturing facility with specialized ventilation requirements',
    gcId: 'gc-3',
    status: 'bidding',
    planFiles: [
      {
        id: 'file-7',
        name: 'hvac-layout.pdf',
        type: 'application/pdf',
        size: 4096000,
        url: '/mock/hvac-layout.pdf',
        uploadedAt: new Date('2024-12-14'),
      },
    ],
    estimatedCost: 1200000,
    timeline: '4 months',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-17'),
  },
  {
    id: 'proj-6',
    name: 'Luxury Hotel Plumbing Infrastructure',
    description: 'Complete plumbing system for 200-room luxury hotel including spa facilities and commercial kitchen',
    gcId: 'gc-1',
    status: 'bidding',
    planFiles: [
      {
        id: 'file-8',
        name: 'plumbing-blueprints.pdf',
        type: 'application/pdf',
        size: 5120000,
        url: '/mock/plumbing-blueprints.pdf',
        uploadedAt: new Date('2024-12-13'),
      },
      {
        id: 'file-9',
        name: 'spa-plumbing-details.dwg',
        type: 'application/dwg',
        size: 2800000,
        url: '/mock/spa-plumbing-details.dwg',
        uploadedAt: new Date('2024-12-13'),
      },
    ],
    estimatedCost: 3200000,
    timeline: '14 months',
    createdAt: new Date('2024-12-13'),
    updatedAt: new Date('2024-12-18'),
  },
];

export const getProjectsByGC = (gcId: string): Project[] => {
  return mockProjects.filter(project => project.gcId === gcId);
};

export const getProjectsForBidding = (): Project[] => {
  return mockProjects.filter(project => project.status === 'bidding');
};

export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

export const getRecentProjects = (limit: number = 10): Project[] => {
  return mockProjects
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};