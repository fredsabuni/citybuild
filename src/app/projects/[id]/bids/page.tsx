'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { BidReviewInterface } from '@/components/bids';
import { useParams } from 'next/navigation';
import { useToast } from '@/lib/notificationContext';

// Mock data - in a real app, this would come from an API based on project ID
const mockBidsWithContractors = [
  {
    id: 'bid-1',
    projectId: 'proj-1',
    amount: 125000,
    timeline: '6 weeks',
    description: 'Complete plumbing installation including fixtures, connections, and testing. We will use high-quality materials and ensure all work meets local building codes. Our team has extensive experience with commercial plumbing systems.',
    status: 'pending' as const,
    submittedAt: new Date('2024-12-05'),
    tradeSpecialization: 'plumbing',
    laborCost: 75000,
    materialCost: 35000,
    equipmentCost: 15000,
    warranty: 24,
    startDate: '2024-12-20',
    completionDate: '2025-01-31',
    notes: 'We can start immediately and have all necessary permits ready.',
    contractor: {
      id: 'contractor-1',
      name: 'AquaFlow Plumbing Solutions',
      rating: 4.8,
      completedProjects: 47,
      onTimeRate: 96,
      specializations: ['commercial plumbing', 'industrial systems', 'green building'],
    },
  },
  {
    id: 'bid-2',
    projectId: 'proj-1',
    amount: 135000,
    timeline: '5 weeks',
    description: 'Premium plumbing installation with advanced water management systems. We specialize in commercial buildings and offer extended warranty coverage. All materials are sourced from certified suppliers.',
    status: 'pending' as const,
    submittedAt: new Date('2024-12-06'),
    tradeSpecialization: 'plumbing',
    laborCost: 80000,
    materialCost: 40000,
    equipmentCost: 15000,
    warranty: 36,
    startDate: '2024-12-18',
    completionDate: '2025-01-22',
    notes: 'We include smart water monitoring systems at no extra cost.',
    contractor: {
      id: 'contractor-2',
      name: 'Elite Plumbing & Mechanical',
      rating: 4.9,
      completedProjects: 62,
      onTimeRate: 98,
      specializations: ['luxury commercial', 'smart systems', 'sustainable plumbing'],
    },
  },
  {
    id: 'bid-3',
    projectId: 'proj-1',
    amount: 118000,
    timeline: '7 weeks',
    description: 'Comprehensive plumbing solution with focus on energy efficiency and sustainability. We use eco-friendly materials and implement water conservation measures throughout the installation.',
    status: 'pending' as const,
    submittedAt: new Date('2024-12-07'),
    tradeSpecialization: 'plumbing',
    laborCost: 70000,
    materialCost: 32000,
    equipmentCost: 16000,
    warranty: 18,
    startDate: '2024-12-23',
    completionDate: '2025-02-10',
    notes: 'LEED certified installation available. Green building expertise.',
    contractor: {
      id: 'contractor-3',
      name: 'GreenFlow Contractors',
      rating: 4.6,
      completedProjects: 34,
      onTimeRate: 92,
      specializations: ['sustainable plumbing', 'LEED certification', 'water conservation'],
    },
  },
  {
    id: 'bid-4',
    projectId: 'proj-1',
    amount: 142000,
    timeline: '4 weeks',
    description: 'Fast-track plumbing installation with premium materials and expedited timeline. Our experienced crew can work extended hours to meet tight deadlines while maintaining quality standards.',
    status: 'pending' as const,
    submittedAt: new Date('2024-12-08'),
    tradeSpecialization: 'plumbing',
    laborCost: 90000,
    materialCost: 38000,
    equipmentCost: 14000,
    warranty: 12,
    startDate: '2024-12-16',
    completionDate: '2025-01-13',
    notes: 'Rush job capability. Weekend and overtime work included in price.',
    contractor: {
      id: 'contractor-4',
      name: 'Rapid Response Plumbing',
      rating: 4.4,
      completedProjects: 28,
      onTimeRate: 89,
      specializations: ['emergency services', 'fast-track projects', 'commercial repair'],
    },
  },
];

const projectNames: Record<string, string> = {
  'proj-1': 'Downtown Office Complex',
  'proj-2': 'Residential Complex Phase 1',
  'proj-3': 'Warehouse Renovation',
  'proj-4': 'Smart Home Electrical Installation',
  'proj-5': 'Commercial HVAC System Installation',
  'proj-6': 'Luxury Hotel Plumbing Infrastructure',
};

export default function ProjectBidsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const projectName = projectNames[projectId] || 'Unknown Project';
  const toast = useToast();

  const handleAwardBid = (bidId: string) => {
    const bid = mockBidsWithContractors.find(b => b.id === bidId);
    if (bid && confirm(`Award this project to ${bid.contractor.name} for $${bid.amount.toLocaleString()}?`)) {
      console.log('Award bid:', bidId);
      
      toast.success(
        'Bid Awarded Successfully!',
        `Project has been awarded to ${bid.contractor.name}. All bidders will be notified of the decision.`,
        {
          label: 'View Project',
          onClick: () => window.location.href = `/projects/${projectId}`
        }
      );
    }
  };

  const handleRejectBid = (bidId: string, feedback?: string) => {
    const bid = mockBidsWithContractors.find(b => b.id === bidId);
    if (bid && confirm(`Reject bid from ${bid.contractor.name}?`)) {
      console.log('Reject bid:', bidId, 'Feedback:', feedback);
      
      toast.info(
        'Bid Rejected',
        `Bid from ${bid.contractor.name} has been rejected. The contractor will be notified with your feedback.`
      );
    }
  };

  const handleRequestClarification = (bidId: string, message: string) => {
    const bid = mockBidsWithContractors.find(b => b.id === bidId);
    if (bid) {
      console.log('Request clarification:', bidId, 'Message:', message);
      
      toast.success(
        'Clarification Request Sent',
        `Your message has been sent to ${bid.contractor.name}. They will respond via the messaging system.`,
        {
          label: 'View Messages',
          onClick: () => window.location.href = '/messages'
        }
      );
    }
  };

  return (
    <Layout>
      <BidReviewInterface
        projectId={projectId}
        projectName={projectName}
        bids={mockBidsWithContractors}
        onAwardBid={handleAwardBid}
        onRejectBid={handleRejectBid}
        onRequestClarification={handleRequestClarification}
      />
    </Layout>
  );
}