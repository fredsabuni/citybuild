'use client';

import React, { useState } from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TrophyIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Contractor {
  id: string;
  name: string;
  rating: number;
  completedProjects: number;
  onTimeRate: number;
  specializations: string[];
}

interface BidWithContractor {
  id: string;
  projectId: string;
  amount: number;
  timeline: string;
  description: string;
  status: 'pending' | 'awarded' | 'rejected';
  submittedAt: Date;
  tradeSpecialization: string;
  contractor: Contractor;
  laborCost?: number;
  materialCost?: number;
  equipmentCost?: number;
  warranty: number;
  startDate: string;
  completionDate: string;
  notes?: string;
}

interface BidReviewInterfaceProps {
  projectId: string;
  projectName: string;
  bids: BidWithContractor[];
  onAwardBid: (bidId: string) => void;
  onRejectBid: (bidId: string, feedback?: string) => void;
  onRequestClarification: (bidId: string, message: string) => void;
}

export const BidReviewInterface: React.FC<BidReviewInterfaceProps> = ({
  projectId,
  projectName,
  bids,
  onAwardBid,
  onRejectBid,
  onRequestClarification,
}) => {
  const [sortBy, setSortBy] = useState<string>('amount');
  const [selectedBid, setSelectedBid] = useState<BidWithContractor | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [showClarificationModal, setShowClarificationModal] = useState(false);

  // Sort bids based on selected criteria
  const sortedBids = [...bids].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return a.amount - b.amount;
      case 'rating':
        return b.contractor.rating - a.contractor.rating;
      case 'timeline':
        // Convert timeline to days for comparison
        const getDays = (timeline: string) => {
          const num = parseInt(timeline);
          if (timeline.includes('week')) return num * 7;
          if (timeline.includes('month')) return num * 30;
          return num;
        };
        return getDays(a.timeline) - getDays(b.timeline);
      case 'experience':
        return b.contractor.completedProjects - a.contractor.completedProjects;
      case 'submitted':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      i < Math.floor(rating) ? (
        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="w-4 h-4 text-gray-300" />
      )
    ));
  };

  const handleViewDetails = (bid: BidWithContractor) => {
    setSelectedBid(bid);
    setShowDetailModal(true);
  };

  const handleRequestClarification = (bid: BidWithContractor) => {
    setSelectedBid(bid);
    setShowClarificationModal(true);
  };

  const submitClarificationRequest = () => {
    if (selectedBid && clarificationMessage.trim()) {
      onRequestClarification(selectedBid.id, clarificationMessage);
      setClarificationMessage('');
      setShowClarificationModal(false);
      setSelectedBid(null);
    }
  };

  const renderBidCard = (bid: BidWithContractor) => {
    const index = sortedBids.findIndex(b => b.id === bid.id);
    return (
    <CardWidget
      key={bid.id}
      title={`${bid.contractor.name} - Bid #${index + 1}`}
      variant={bid.status === 'awarded' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-4">
          {/* Header with Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              {bid.status === 'awarded' && (
                <Badge variant="success">
                  <TrophyIcon className="w-3 h-3 mr-1" />
                  Awarded
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {bid.tradeSpecialization}
            </Badge>
          </div>

          {/* Contractor Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium">{bid.contractor.name}</div>
              <div className="flex items-center space-x-1">
                {renderStars(bid.contractor.rating)}
                <span className="text-sm text-muted-foreground ml-1">
                  ({bid.contractor.rating.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-2 bg-secondary rounded border border-border">
              <CurrencyDollarIcon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <div className="font-semibold">{formatCurrency(bid.amount)}</div>
              <div className="text-xs text-muted-foreground">Bid Amount</div>
            </div>
            <div className="text-center p-2 bg-secondary rounded border border-border">
              <CalendarIcon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <div className="font-semibold">{bid.timeline}</div>
              <div className="text-xs text-muted-foreground">Timeline</div>
            </div>
            <div className="text-center p-2 bg-secondary rounded border border-border">
              <TrophyIcon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
              <div className="font-semibold">{bid.contractor.completedProjects}</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </div>
          </div>

          {/* Experience Indicators */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-muted-foreground">On-time Rate:</span>
                <span className="ml-1 font-medium">{bid.contractor.onTimeRate}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Warranty:</span>
                <span className="ml-1 font-medium">{bid.warranty} months</span>
              </div>
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bid.description}
          </p>

          {/* Submission Time */}
          <div className="text-xs text-muted-foreground">
            Submitted {formatRelativeTime(bid.submittedAt)}
          </div>
        </div>
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(bid)}>
            <EyeIcon className="w-4 h-4 mr-1" />
            Details
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleRequestClarification(bid)}>
            <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
            Ask
          </Button>
          {bid.status === 'pending' && (
            <>
              <Button size="sm" onClick={() => onAwardBid(bid.id)}>
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Award
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onRejectBid(bid.id)}>
                <XCircleIcon className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      }
    />
    );
  };

  // Calculate statistics
  const averageBid = bids.length > 0 ? bids.reduce((sum, b) => sum + b.amount, 0) / bids.length : 0;
  const lowestBid = bids.length > 0 ? Math.min(...bids.map(b => b.amount)) : 0;
  const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0;
  const averageRating = bids.length > 0 ? bids.reduce((sum, b) => sum + b.contractor.rating, 0) / bids.length : 0;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div>
        <h1 className="text-2xl font-bold">{projectName}</h1>
        <p className="text-muted-foreground">Review and manage project bids</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary">{bids.length}</div>
          <div className="text-sm text-muted-foreground">Total Bids</div>
        </div>
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{formatCurrency(lowestBid).replace('.00', '')}</div>
          <div className="text-sm text-muted-foreground">Lowest Bid</div>
        </div>
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary">{formatCurrency(averageBid).replace('.00', '')}</div>
          <div className="text-sm text-muted-foreground">Average Bid</div>
        </div>
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}★</div>
          <div className="text-sm text-muted-foreground">Avg Rating</div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium mb-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="amount">Bid Amount (Low to High)</option>
            <option value="rating">Contractor Rating (High to Low)</option>
            <option value="timeline">Timeline (Shortest First)</option>
            <option value="experience">Experience (Most Projects)</option>
            <option value="submitted">Recently Submitted</option>
          </select>
        </div>
      </div>

      {/* Bids List */}
      <ListWidget
        items={sortedBids}
        renderItem={renderBidCard}
        emptyState={
          <div className="text-center py-12 bg-card border-2 border-border rounded-lg">
            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
              <DocumentTextIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Bids Received</h3>
            <p className="text-muted-foreground">
              No contractors have submitted bids for this project yet.
            </p>
          </div>
        }
      />

      {/* Bid Detail Modal */}
      {showDetailModal && selectedBid && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75" onClick={() => setShowDetailModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-xl border-2 border-border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Bid Details</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                    <XCircleIcon className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Contractor Info */}
                  <div className="p-4 bg-secondary rounded-lg border border-border">
                    <h3 className="font-semibold mb-3">Contractor Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <div className="font-medium">{selectedBid.contractor.name}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(selectedBid.contractor.rating)}
                          <span className="ml-1">({selectedBid.contractor.rating.toFixed(1)})</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completed Projects:</span>
                        <div className="font-medium">{selectedBid.contractor.completedProjects}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">On-time Rate:</span>
                        <div className="font-medium">{selectedBid.contractor.onTimeRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Bid Details */}
                  <div className="p-4 bg-secondary rounded-lg border border-border">
                    <h3 className="font-semibold mb-3">Bid Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      {selectedBid.laborCost && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Labor Cost:</span>
                          <span>{formatCurrency(selectedBid.laborCost)}</span>
                        </div>
                      )}
                      {selectedBid.materialCost && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Material Cost:</span>
                          <span>{formatCurrency(selectedBid.materialCost)}</span>
                        </div>
                      )}
                      {selectedBid.equipmentCost && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Equipment Cost:</span>
                          <span>{formatCurrency(selectedBid.equipmentCost)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border pt-2 font-semibold">
                        <span>Total Bid Amount:</span>
                        <span>{formatCurrency(selectedBid.amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-4 bg-secondary rounded-lg border border-border">
                    <h3 className="font-semibold mb-3">Project Timeline</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{selectedBid.timeline}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Start Date:</span>
                        <div className="font-medium">{new Date(selectedBid.startDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completion:</span>
                        <div className="font-medium">{new Date(selectedBid.completionDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-2">Bid Description</h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded border border-border">
                      {selectedBid.description}
                    </p>
                  </div>

                  {/* Notes */}
                  {selectedBid.notes && (
                    <div>
                      <h3 className="font-semibold mb-2">Additional Notes</h3>
                      <p className="text-sm text-muted-foreground bg-secondary p-3 rounded border border-border">
                        {selectedBid.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Modal */}
      {showClarificationModal && selectedBid && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75" onClick={() => setShowClarificationModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-card rounded-lg shadow-xl border-2 border-border">
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Request Clarification</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Send a message to {selectedBid.contractor.name} requesting clarification about their bid.
                </p>
                <textarea
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  placeholder="What would you like to clarify about this bid?"
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
                <div className="flex space-x-3 mt-4">
                  <Button variant="outline" onClick={() => setShowClarificationModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitClarificationRequest} disabled={!clarificationMessage.trim()}>
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};