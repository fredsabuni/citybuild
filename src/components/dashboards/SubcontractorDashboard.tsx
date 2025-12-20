'use client';

import React from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { mockProjects } from '@/data/mockProjects';
import { mockBids } from '@/data/mockBids';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  MagnifyingGlassIcon,
  BriefcaseIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const SubcontractorDashboard: React.FC = () => {
  // Calculate statistics
  const myBids = mockBids.length;
  const wonBids = mockBids.filter(b => b.status === 'awarded').length;
  const pendingBids = mockBids.filter(b => b.status === 'pending').length;
  const winRate = myBids > 0 ? Math.round((wonBids / myBids) * 100) : 0;
  const totalBidValue = mockBids.reduce((sum, b) => sum + b.amount, 0);
  const availableProjects = mockProjects.filter(p => p.status === 'bidding').length;

  const recentBids = mockBids.slice(0, 3);
  const availableProjectsList = mockProjects.filter(p => p.status === 'bidding').slice(0, 3);

  const renderBidCard = (bid: any) => {
    const project = mockProjects.find(p => p.id === bid.projectId);
    return (
      <CardWidget
        key={bid.id}
        title={`Bid #${bid.id.slice(-4)}`}
        variant={bid.status === 'awarded' ? 'highlighted' : 'default'}
        content={
          <div className="space-y-2">
            <div className="font-medium text-sm">{project?.name || 'Unknown Project'}</div>
            <p className="text-xs text-muted-foreground line-clamp-2">{bid.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium">{formatCurrency(bid.amount)}</span>
              <Badge
                variant={
                  bid.status === 'awarded'
                    ? 'success'
                    : bid.status === 'pending'
                    ? 'warning'
                    : 'destructive'
                }
              >
                {bid.status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Timeline: {bid.timeline} • {formatRelativeTime(bid.submittedAt)}
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
  };

  const renderAvailableProject = (project: any) => (
    <CardWidget
      key={project.id}
      title={project.name}
      content={
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-medium">{formatCurrency(project.estimatedCost || 0)}</span>
            <Badge variant="warning">Bidding Open</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Timeline: {project.timeline} • Posted {formatRelativeTime(project.createdAt)}
          </div>
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            View Details
          </Button>
          <Button size="sm" variant="success">
            Submit Bid
          </Button>
        </div>
      }
    />
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardWidget
          title="Available Projects"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{availableProjects}</div>
                <div className="text-xs text-muted-foreground">Open for bidding</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="My Bids"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingBids}</div>
                <div className="text-xs text-muted-foreground">Pending review</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Win Rate"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{winRate}%</div>
                <div className="text-xs text-muted-foreground">{wonBids} of {myBids} bids</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Total Bid Value"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalBidValue).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>
          }
        />
      </div>

      {/* Quick Actions */}
      <CardWidget
        title="Quick Actions"
        content={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="h-auto p-4 flex-col space-y-2" variant="info">
              <MagnifyingGlassIcon className="w-6 h-6" />
              <span className="text-sm">Browse Projects</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <BriefcaseIcon className="w-6 h-6" />
              <span className="text-sm">My Bids</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <TrophyIcon className="w-6 h-6" />
              <span className="text-sm">Performance</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <CurrencyDollarIcon className="w-6 h-6" />
              <span className="text-sm">Payments</span>
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Recent Bids */}
        <CardWidget
          title="My Recent Bids"
          content={
            <ListWidget
              items={recentBids}
              renderItem={renderBidCard}
              emptyState={
                <div className="text-center py-8">
                  <BriefcaseIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No bids submitted yet</p>
                  <Button className="mt-3" size="sm" variant="info">
                    Browse Projects
                  </Button>
                </div>
              }
            />
          }
          actions={
            <Button size="sm" variant="outline">
              View All Bids
            </Button>
          }
        />

        {/* Available Projects */}
        <CardWidget
          title="New Opportunities"
          content={
            <ListWidget
              items={availableProjectsList}
              renderItem={renderAvailableProject}
              emptyState={
                <div className="text-center py-8">
                  <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No projects available</p>
                </div>
              }
            />
          }
          actions={
            <Button size="sm" variant="outline">
              View Marketplace
            </Button>
          }
        />
      </div>

      {/* Recent Activity */}
      <CardWidget
        title="Recent Activity"
        content={
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Bid Awarded</div>
                <div className="text-sm text-muted-foreground">
                  Your bid for Residential Complex Phase 1 was accepted
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">New Project Available</div>
                <div className="text-sm text-muted-foreground">
                  Downtown Office Complex is now accepting electrical bids
                </div>
              </div>
              <div className="text-sm text-muted-foreground">5 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Bid Submitted</div>
                <div className="text-sm text-muted-foreground">
                  Your bid for Warehouse Renovation has been submitted
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 day ago</div>
            </div>
          </div>
        }
      />

      {/* Performance Metrics */}
      <CardWidget
        title="Performance Overview"
        content={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-lg font-bold">98%</div>
              <div className="text-xs text-muted-foreground">On-time completion</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TrophyIcon className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-lg font-bold">4.8</div>
              <div className="text-xs text-muted-foreground">Average rating</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <BriefcaseIcon className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-lg font-bold">24</div>
              <div className="text-xs text-muted-foreground">Projects completed</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CurrencyDollarIcon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-lg font-bold">$1.2M</div>
              <div className="text-xs text-muted-foreground">Total earnings</div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SubcontractorDashboard;