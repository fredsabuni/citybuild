'use client';

import React, { useState } from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface Bid {
  id: string;
  projectId: string;
  projectName: string;
  amount: number;
  timeline: string;
  description: string;
  status: 'pending' | 'awarded' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  tradeSpecialization: string;
  competitorCount?: number;
  ranking?: number;
  feedback?: string;
}

interface BidTrackingInterfaceProps {
  bids: Bid[];
  onViewBid: (bid: Bid) => void;
  onWithdrawBid: (bidId: string) => void;
}

export const BidTrackingInterface: React.FC<BidTrackingInterfaceProps> = ({
  bids,
  onViewBid,
  onWithdrawBid,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tradeFilter, setTradeFilter] = useState<string>('all');

  const filteredBids = bids.filter(bid => {
    const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
    const matchesTrade = tradeFilter === 'all' || bid.tradeSpecialization === tradeFilter;
    return matchesStatus && matchesTrade;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'awarded':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      case 'withdrawn':
        return <XCircleIcon className="w-4 h-4 text-gray-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'awarded':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'withdrawn':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const renderBidCard = (bid: Bid) => (
    <CardWidget
      key={bid.id}
      title={bid.projectName}
      variant={bid.status === 'awarded' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-4">
          {/* Bid Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Bid Amount</div>
                <div className="font-semibold">{formatCurrency(bid.amount)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Timeline</div>
                <div className="font-medium">{bid.timeline}</div>
              </div>
            </div>
          </div>

          {/* Status and Trade */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(bid.status)}
              <Badge variant={getStatusVariant(bid.status) as any}>
                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              {bid.tradeSpecialization}
            </Badge>
          </div>

          {/* Competitive Info */}
          {bid.status === 'pending' && bid.competitorCount && (
            <div className="p-2 bg-muted/50 rounded text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Competition:</span>
                <span>{bid.competitorCount} other bids</span>
              </div>
              {bid.ranking && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-muted-foreground">Current Rank:</span>
                  <div className="flex items-center space-x-1">
                    <TrophyIcon className="w-3 h-3" />
                    <span>#{bid.ranking}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {bid.feedback && (
            <div className="p-2 bg-muted/50 rounded text-sm">
              <div className="text-muted-foreground mb-1">Feedback:</div>
              <p className="text-xs">{bid.feedback}</p>
            </div>
          )}

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
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onViewBid(bid)}>
            <EyeIcon className="w-4 h-4 mr-1" />
            View
          </Button>
          {bid.status === 'pending' && (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onWithdrawBid(bid.id)}
            >
              Withdraw
            </Button>
          )}
        </div>
      }
    />
  );

  // Calculate statistics
  const totalBids = bids.length;
  const pendingBids = bids.filter(b => b.status === 'pending').length;
  const awardedBids = bids.filter(b => b.status === 'awarded').length;
  const winRate = totalBids > 0 ? Math.round((awardedBids / totalBids) * 100) : 0;
  const totalBidValue = bids.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">{totalBids}</div>
          <div className="text-sm text-muted-foreground">Total Bids</div>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{pendingBids}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-green-600">{awardedBids}</div>
          <div className="text-sm text-muted-foreground">Awarded</div>
        </div>
        <div className="text-center p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-bold text-primary">{winRate}%</div>
          <div className="text-sm text-muted-foreground">Win Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="awarded">Awarded</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filter by Trade</label>
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Trades</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="concrete">Concrete</option>
            <option value="roofing">Roofing</option>
            <option value="flooring">Flooring</option>
            <option value="general">General Construction</option>
          </select>
        </div>
      </div>

      {/* Bids List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {filteredBids.length === totalBids 
              ? 'All Bids' 
              : `${filteredBids.length} Filtered Bids`
            }
          </h2>
          {filteredBids.length !== totalBids && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setTradeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <ListWidget
          items={filteredBids}
          renderItem={renderBidCard}
          emptyState={
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Bids Found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter !== 'all' || tradeFilter !== 'all'
                  ? 'Try adjusting your filter criteria.'
                  : 'You haven\'t submitted any bids yet.'
                }
              </p>
              {statusFilter === 'all' && tradeFilter === 'all' && (
                <Button>
                  Browse Projects
                </Button>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};