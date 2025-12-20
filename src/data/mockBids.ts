import { Bid } from '@/types';

export const mockBids: Bid[] = [
  // Downtown Office Complex bids
  {
    id: 'bid-1',
    projectId: 'proj-1',
    subcontractorId: 'sub-1',
    amount: 125000,
    timeline: '6 weeks',
    description: 'Complete plumbing installation including fixtures, connections, and water management systems for all floors',
    status: 'pending',
    submittedAt: new Date('2024-12-05'),
  },
  {
    id: 'bid-2',
    projectId: 'proj-1',
    subcontractorId: 'sub-2',
    amount: 180000,
    timeline: '8 weeks',
    description: 'Full electrical system installation with smart building integration, emergency systems, and energy-efficient lighting',
    status: 'pending',
    submittedAt: new Date('2024-12-06'),
  },
  {
    id: 'bid-3',
    projectId: 'proj-1',
    subcontractorId: 'sub-3',
    amount: 135000,
    timeline: '5 weeks',
    description: 'Premium plumbing installation with advanced water management systems and sustainable fixtures',
    status: 'awarded',
    submittedAt: new Date('2024-12-07'),
  },
  {
    id: 'bid-4',
    projectId: 'proj-1',
    subcontractorId: 'sub-4',
    amount: 165000,
    timeline: '7 weeks',
    description: 'Comprehensive electrical work including data cabling, security systems, and backup power solutions',
    status: 'rejected',
    submittedAt: new Date('2024-12-08'),
  },

  // Residential Complex bids
  {
    id: 'bid-5',
    projectId: 'proj-2',
    subcontractorId: 'sub-1',
    amount: 95000,
    timeline: '4 weeks',
    description: 'Residential plumbing for all 24 units including bathrooms, kitchens, and utility connections',
    status: 'awarded',
    submittedAt: new Date('2024-11-20'),
  },
  {
    id: 'bid-6',
    projectId: 'proj-2',
    subcontractorId: 'sub-5',
    amount: 220000,
    timeline: '10 weeks',
    description: 'HVAC system installation for entire residential complex with individual unit controls',
    status: 'pending',
    submittedAt: new Date('2024-11-22'),
  },

  // Warehouse Renovation bids
  {
    id: 'bid-7',
    projectId: 'proj-3',
    subcontractorId: 'sub-2',
    amount: 85000,
    timeline: '6 weeks',
    description: 'Industrial electrical upgrade with high-capacity power distribution and LED lighting conversion',
    status: 'pending',
    submittedAt: new Date('2024-12-12'),
  },
  {
    id: 'bid-8',
    projectId: 'proj-3',
    subcontractorId: 'sub-6',
    amount: 45000,
    timeline: '3 weeks',
    description: 'Concrete floor restoration and polishing for warehouse distribution area',
    status: 'pending',
    submittedAt: new Date('2024-12-13'),
  },

  // Smart Home Electrical bids
  {
    id: 'bid-9',
    projectId: 'proj-4',
    subcontractorId: 'sub-2',
    amount: 45000,
    timeline: '4 weeks',
    description: 'Smart home electrical installation with automation systems, security integration, and energy monitoring',
    status: 'pending',
    submittedAt: new Date('2024-12-12'),
  },
  {
    id: 'bid-10',
    projectId: 'proj-4',
    subcontractorId: 'sub-4',
    amount: 52000,
    timeline: '5 weeks',
    description: 'Premium smart electrical system with voice control, advanced automation, and renewable energy integration',
    status: 'pending',
    submittedAt: new Date('2024-12-14'),
  },

  // Commercial HVAC bids
  {
    id: 'bid-11',
    projectId: 'proj-5',
    subcontractorId: 'sub-5',
    amount: 120000,
    timeline: '3 months',
    description: 'Commercial HVAC system with specialized ventilation for manufacturing environment and air quality monitoring',
    status: 'pending',
    submittedAt: new Date('2024-12-14'),
  },
  {
    id: 'bid-12',
    projectId: 'proj-5',
    subcontractorId: 'sub-7',
    amount: 135000,
    timeline: '4 months',
    description: 'Industrial-grade HVAC with redundant systems, energy recovery, and predictive maintenance capabilities',
    status: 'pending',
    submittedAt: new Date('2024-12-15'),
  },

  // Luxury Hotel Plumbing bids
  {
    id: 'bid-13',
    projectId: 'proj-6',
    subcontractorId: 'sub-1',
    amount: 285000,
    timeline: '12 months',
    description: 'Luxury hotel plumbing including spa facilities, commercial kitchen, and high-end guest room fixtures',
    status: 'pending',
    submittedAt: new Date('2024-12-16'),
  },
  {
    id: 'bid-14',
    projectId: 'proj-6',
    subcontractorId: 'sub-3',
    amount: 310000,
    timeline: '14 months',
    description: 'Premium plumbing system with water recycling, luxury spa features, and commercial-grade kitchen infrastructure',
    status: 'pending',
    submittedAt: new Date('2024-12-17'),
  },
];

export const getBidsByProject = (projectId: string): Bid[] => {
  return mockBids.filter(bid => bid.projectId === projectId);
};

export const getBidsBySubcontractor = (subcontractorId: string): Bid[] => {
  return mockBids.filter(bid => bid.subcontractorId === subcontractorId);
};

export const getBidsByStatus = (status: Bid['status']): Bid[] => {
  return mockBids.filter(bid => bid.status === status);
};

export const getRecentBids = (limit: number = 10): Bid[] => {
  return mockBids
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, limit);
};