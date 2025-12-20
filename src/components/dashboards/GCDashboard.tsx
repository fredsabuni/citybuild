'use client';

import React from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { mockProjects } from '@/data/mockProjects';
import { mockBids } from '@/data/mockBids';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const GCDashboard: React.FC = () => {
  // Calculate statistics
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const biddingProjects = mockProjects.filter(p => p.status === 'bidding').length;
  const totalValue = mockProjects.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const pendingBids = mockBids.filter(b => b.status === 'pending').length;

  const recentProjects = mockProjects.slice(0, 3);
  const recentBids = mockBids.slice(0, 4);

  const renderProjectCard = (project: any) => (
    <CardWidget
      key={project.id}
      title={project.name}
      variant={project.status === 'active' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{formatCurrency(project.estimatedCost || 0)}</span>
            <Badge
              variant={
                project.status === 'active'
                  ? 'success'
                  : project.status === 'bidding'
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
          View
        </Button>
      }
    />
  );

  const renderBidCard = (bid: any) => {
    const project = mockProjects.find(p => p.id === bid.projectId);
    return (
      <div key={bid.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
        <div className="flex-1">
          <div className="font-medium text-sm">{project?.name || 'Unknown Project'}</div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(bid.amount)} • {formatRelativeTime(bid.submittedAt)}
          </div>
        </div>
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardWidget
          title="Active Projects"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <div className="text-xs text-muted-foreground">In progress</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Bidding"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <UsersIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{biddingProjects}</div>
                <div className="text-xs text-muted-foreground">Accepting bids</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Total Value"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalValue).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">Portfolio value</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Pending Bids"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingBids}</div>
                <div className="text-xs text-muted-foreground">Need review</div>
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
            <Button className="h-auto p-4 flex-col space-y-2" variant="success">
              <PlusIcon className="w-6 h-6" />
              <span className="text-sm">New Project</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <ChartBarIcon className="w-6 h-6" />
              <span className="text-sm">Analytics</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <UsersIcon className="w-6 h-6" />
              <span className="text-sm">Find Contractors</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <CurrencyDollarIcon className="w-6 h-6" />
              <span className="text-sm">Payments</span>
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <CardWidget
          title="Recent Projects"
          content={
            <ListWidget
              items={recentProjects}
              renderItem={renderProjectCard}
              emptyState={
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No projects yet</p>
                </div>
              }
            />
          }
          actions={
            <Button size="sm" variant="outline">
              View All
            </Button>
          }
        />

        {/* Recent Bids */}
        <CardWidget
          title="Recent Bids"
          content={
            <div className="space-y-3">
              {recentBids.map(renderBidCard)}
              {recentBids.length === 0 && (
                <div className="text-center py-8">
                  <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No bids received yet</p>
                </div>
              )}
            </div>
          }
          actions={
            <Button size="sm" variant="outline">
              View All
            </Button>
          }
        />
      </div>

      {/* Project Timeline */}
      <CardWidget
        title="Project Timeline"
        content={
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Downtown Office Complex</div>
                <div className="text-sm text-muted-foreground">Foundation work completed</div>
              </div>
              <div className="text-sm text-muted-foreground">2 days ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Residential Complex Phase 1</div>
                <div className="text-sm text-muted-foreground">Electrical bids due tomorrow</div>
              </div>
              <div className="text-sm text-muted-foreground">Due tomorrow</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Warehouse Renovation</div>
                <div className="text-sm text-muted-foreground">Plans under review</div>
              </div>
              <div className="text-sm text-muted-foreground">In progress</div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default GCDashboard;