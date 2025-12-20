'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { BidTrackingInterface } from '@/components/bids';

// Mock bid data - in a real app, this would come from an API
const mockBids = [
  {
    id: 'bid-1',
    projectId: 'proj-1',
    projectName: 'Downtown Office Complex',
    amount: 125000,
    timeline: '6 weeks',
    description: 'Complete plumbing installation including fixtures, connections, and testing for 5-story office building with underground parking.',
    status: 'pending' as const,
    submittedAt: new Date('2024-12-05'),
    tradeSpecialization: 'plumbing',
    competitorCount: 4,
    ranking: 2,
  },
  {
    id: 'bid-2',
    projectId: 'proj-4',
    projectName: 'Smart Home Electrical Installation',
    amount: 45000,
    timeline: '4 weeks',
    description: 'Complete electrical system upgrade with smart home integration including automated lighting, security systems, and energy management.',
    status: 'awarded' as const,
    submittedAt: new Date('2024-12-12'),
    tradeSpecialization: 'electrical',
    feedback: 'Excellent proposal with detailed smart home integration plan. Competitive pricing and strong portfolio.',
  },
  {
    id: 'bid-3',
    projectId: 'proj-5',
    projectName: 'Commercial HVAC System Installation',
    amount: 180000,
    timeline: '8 weeks',
    description: 'Industrial-grade HVAC system installation for manufacturing facility with specialized ventilation requirements.',
    status: 'rejected' as const,
    submittedAt: new Date('2024-12-14'),
    tradeSpecialization: 'hvac',
    feedback: 'Bid was competitive but timeline was longer than required. Consider faster completion options for future bids.',
  },
  {
    id: 'bid-4',
    projectId: 'proj-6',
    projectName: 'Luxury Hotel Plumbing Infrastructure',
    amount: 320000,
    timeline: '12 weeks',
    description: 'Complete plumbing system for 200-room luxury hotel including spa facilities, commercial kitchen, and advanced water management systems.',
    status: 'pending' as const,
    submittedAt: new Date('2024-12-16'),
    tradeSpecialization: 'plumbing',
    competitorCount: 6,
    ranking: 1,
  },
  {
    id: 'bid-5',
    projectId: 'proj-3',
    projectName: 'Warehouse Renovation',
    amount: 85000,
    timeline: '5 weeks',
    description: 'Electrical system upgrade for warehouse conversion including new distribution panels, LED lighting, and power outlets.',
    status: 'withdrawn' as const,
    submittedAt: new Date('2024-12-10'),
    tradeSpecialization: 'electrical',
  },
];

export default function BidsPage() {
  const handleViewBid = (bid: any) => {
    // TODO: Implement bid detail view
    console.log('View bid:', bid);
    alert(`Viewing details for bid on ${bid.projectName}`);
  };

  const handleWithdrawBid = (bidId: string) => {
    // TODO: Implement bid withdrawal
    const bid = mockBids.find(b => b.id === bidId);
    if (bid && confirm(`Are you sure you want to withdraw your bid for ${bid.projectName}?`)) {
      console.log('Withdraw bid:', bidId);
      alert('Bid withdrawn successfully');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Bids</h1>
          <p className="text-muted-foreground">
            Track and manage your submitted project bids
          </p>
        </div>

        {/* Bid Tracking Interface */}
        <BidTrackingInterface
          bids={mockBids}
          onViewBid={handleViewBid}
          onWithdrawBid={handleWithdrawBid}
        />
      </div>
    </Layout>
  );
}