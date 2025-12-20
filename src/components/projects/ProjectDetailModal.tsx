'use client';

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  XMarkIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  UserIcon,
  ClockIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface ProjectDetailModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onSubmitBid,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-card rounded-lg shadow-xl border-2 border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-border bg-card">
            <div>
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>Downtown District</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Posted {formatRelativeTime(project.createdAt)}</span>
                </div>
                <Badge variant="warning">Accepting Bids</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Project Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
                    <p className="text-sm">
                      This is a comprehensive construction project requiring multiple specialized trades. 
                      The project includes modern amenities, sustainable building practices, and adherence 
                      to local building codes. Contractors must have relevant experience and proper licensing.
                    </p>
                  </div>
                </div>

                {/* Scope of Work */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Scope of Work</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Site preparation and foundation work</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Structural framing and roofing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Electrical and plumbing systems</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>HVAC installation and testing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Interior finishing and fixtures</span>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Licensing & Insurance</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Valid contractor license</li>
                        <li>• General liability insurance</li>
                        <li>• Workers compensation</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Experience</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 5+ years in commercial construction</li>
                        <li>• Similar project portfolio</li>
                        <li>• Local references required</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Project Files */}
                {project.planFiles && project.planFiles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Available Documents</h3>
                    <div className="space-y-2">
                      {project.planFiles.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border">
                          <div className="flex items-center space-x-3">
                            <DocumentIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(1)} MB • 
                                Uploaded {formatRelativeTime(file.uploadedAt)}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Project Details */}
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CurrencyDollarIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Budget</div>
                        <div className="font-semibold text-lg">{formatCurrency(project.estimatedCost || 0)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Timeline</div>
                        <div className="font-medium">{project.timeline}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Project Type</div>
                        <div className="font-medium">Commercial Construction</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">General Contractor</div>
                        <div className="font-medium">BuildCorp LLC</div>
                        <div className="text-xs text-muted-foreground">4.8★ rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bidding Info */}
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Bidding Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bid Deadline:</span>
                      <span className="font-medium">Dec 25, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Bids:</span>
                      <span className="font-medium">3 submitted</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bid Range:</span>
                      <span className="font-medium">$2.1M - $2.8M</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Project Manager:</span>
                      <div className="font-medium">John Smith</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <div className="font-medium">j.smith@buildcorp.com</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <div className="font-medium">(555) 123-4567</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t-2 border-border bg-secondary">
            <div className="text-sm text-muted-foreground">
              Interested in this project? Submit your bid to get started.
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onSubmitBid}>
                Submit Bid
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};