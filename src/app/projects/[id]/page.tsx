'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { mockProjects } from '@/data/mockProjects';
import { mockBids } from '@/data/mockBids';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useApp } from '@/lib/context';
import {
  DocumentIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function ProjectDetailsPage() {
  const params = useParams();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'files' | 'activity'>('overview');

  // Find the project by ID
  const project = mockProjects.find(p => p.id === params.id);
  const projectBids = mockBids.filter(b => b.projectId === params.id);

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  const renderBidCard = (bid: any) => (
    <CardWidget
      key={bid.id}
      title={`Bid #${bid.id.slice(-4)}`}
      variant={bid.status === 'awarded' ? 'highlighted' : 'default'}
      content={
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{bid.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Amount:</span>
              <div className="font-medium text-lg">{formatCurrency(bid.amount)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Timeline:</span>
              <div className="font-medium">{bid.timeline}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
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
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(bid.submittedAt)}
            </span>
          </div>
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            View Details
          </Button>
          {bid.status === 'pending' && user?.role === 'gc' && (
            <Button size="sm">
              Award Bid
            </Button>
          )}
        </div>
      }
    />
  );

  const renderFileItem = (file: any) => (
    <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
      <div className="flex items-center space-x-3">
        <DocumentIcon className="w-8 h-8 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            Uploaded {formatRelativeTime(file.uploadedAt)}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" variant="ghost">
          <EyeIcon className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <ArrowDownTrayIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bids', label: `Bids (${projectBids.length})` },
    { id: 'files', label: `Files (${project.planFiles?.length || 0})` },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Projects</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge
                variant={
                  project.status === 'active'
                    ? 'success'
                    : project.status === 'bidding'
                    ? 'warning'
                    : project.status === 'completed'
                    ? 'default'
                    : 'secondary'
                }
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          
          {user?.role === 'gc' && (
            <div className="flex space-x-2">
              <Button variant="outline">
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline">
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </Button>
              {projectBids.length > 0 && (
                <Link href={`/projects/${project.id}/bids`}>
                  <Button>
                    📋 Manage Bids ({projectBids.length})
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardWidget
            title="Budget"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {formatCurrency(project.estimatedCost || 0).replace('.00', '')}
                  </div>
                  <div className="text-xs text-muted-foreground">Estimated</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Timeline"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{project.timeline}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Created"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{formatDate(project.createdAt)}</div>
                  <div className="text-xs text-muted-foreground">Start date</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Bids"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <span className="text-orange-600 font-bold text-xl">📋</span>
                </div>
                <div>
                  <div className="text-xl font-bold">{projectBids.length}</div>
                  <div className="text-xs text-muted-foreground">Received</div>
                </div>
              </div>
            }
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <CardWidget
                title="Project Details"
                content={
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Description:</span>
                      <p className="mt-1">{project.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="font-medium capitalize">{project.status}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeline:</span>
                        <div className="font-medium">{project.timeline}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="font-medium">{formatDate(project.createdAt)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <div className="font-medium">{formatDate(project.updatedAt)}</div>
                      </div>
                    </div>
                  </div>
                }
              />

              <CardWidget
                title="Recent Activity"
                content={
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium">Project created</div>
                        <div className="text-muted-foreground text-xs">
                          {formatRelativeTime(project.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {projectBids.map((bid) => (
                      <div key={bid.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium">New bid received</div>
                          <div className="text-muted-foreground text-xs">
                            {formatCurrency(bid.amount)} • {formatRelativeTime(bid.submittedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />
            </div>
          )}

          {activeTab === 'bids' && (
            <ListWidget
              items={projectBids}
              renderItem={renderBidCard}
              emptyState={
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Bids Yet</h3>
                  <p className="text-muted-foreground">
                    Bids will appear here once contractors start submitting them.
                  </p>
                </div>
              }
            />
          )}

          {activeTab === 'files' && (
            <CardWidget
              title="Project Files"
              content={
                <div className="space-y-3">
                  {project.planFiles && project.planFiles.length > 0 ? (
                    project.planFiles.map(renderFileItem)
                  ) : (
                    <div className="text-center py-8">
                      <DocumentIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No files uploaded yet</p>
                    </div>
                  )}
                </div>
              }
              actions={
                user?.role === 'gc' && (
                  <Button size="sm">
                    Upload Files
                  </Button>
                )
              }
            />
          )}

          {activeTab === 'activity' && (
            <CardWidget
              title="Project Activity"
              content={
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Project Created</div>
                      <div className="text-sm text-muted-foreground">
                        {project.name} was created and is ready for bidding
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(project.createdAt)}
                      </div>
                    </div>
                  </div>

                  {projectBids.map((bid) => (
                    <div key={bid.id} className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">Bid Submitted</div>
                        <div className="text-sm text-muted-foreground">
                          New bid received for {formatCurrency(bid.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(bid.submittedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          )}
        </div>
      </div>
    </Layout>
  );
}