'use client';

import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { mockProjects } from '@/data/mockProjects';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon,
  CalendarIcon,
  DocumentIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { ProjectDetailModal } from '@/components/projects/ProjectDetailModal';
import { BidSubmissionForm } from '@/components/bids';
import { useToast } from '@/lib/notificationContext';

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const toast = useToast();

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleCloseModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
  };

  const handleSubmitBid = (project?: any) => {
    const projectToUse = project || selectedProject;
    if (projectToUse) {
      setSelectedProject(projectToUse);
      setShowBidForm(true);
      setShowProjectModal(false);
    }
  };

  const handleBidSubmission = (bidData: any) => {
    // TODO: Save bid to backend/localStorage
    console.log('Bid submitted:', bidData);
    
    // Show success toast notification
    toast.success(
      'Bid Submitted Successfully!',
      `Your bid of ${formatCurrency(bidData.amount)} for ${selectedProject?.name} has been submitted and is now under review.`,
      {
        label: 'View My Bids',
        onClick: () => window.location.href = '/bids'
      }
    );
    
    setShowBidForm(false);
    setSelectedProject(null);
  };

  const handleCloseBidForm = () => {
    setShowBidForm(false);
    setSelectedProject(null);
  };

  // Filter projects available for bidding
  const availableProjects = mockProjects.filter(project => project.status === 'bidding');

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = availableProjects.filter(project => {
      // Search filter
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Trade filter
      let matchesTrade = true;
      if (tradeFilter !== 'all') {
        const tradeKeywords = {
          plumbing: ['plumbing', 'water', 'pipe', 'bathroom', 'kitchen'],
          electrical: ['electrical', 'wiring', 'power', 'lighting', 'smart'],
          hvac: ['hvac', 'heating', 'cooling', 'ventilation', 'air'],
          concrete: ['concrete', 'foundation', 'slab', 'structural'],
          roofing: ['roof', 'roofing', 'shingle', 'gutter'],
          flooring: ['floor', 'flooring', 'tile', 'carpet', 'hardwood'],
        };
        
        const keywords = tradeKeywords[tradeFilter as keyof typeof tradeKeywords] || [];
        matchesTrade = keywords.some(keyword => 
          project.name.toLowerCase().includes(keyword) || 
          project.description.toLowerCase().includes(keyword)
        );
      }

      // Budget filter
      let matchesBudget = true;
      if (budgetFilter !== 'all' && project.estimatedCost) {
        const cost = project.estimatedCost;
        switch (budgetFilter) {
          case 'under-500k':
            matchesBudget = cost < 500000;
            break;
          case '500k-1m':
            matchesBudget = cost >= 500000 && cost < 1000000;
            break;
          case '1m-5m':
            matchesBudget = cost >= 1000000 && cost < 5000000;
            break;
          case 'over-5m':
            matchesBudget = cost >= 5000000;
            break;
        }
      }

      // Date range filter
      let matchesDateRange = true;
      if (startDate || endDate) {
        // For demo purposes, we'll simulate project completion dates
        // In a real app, this would be based on actual project start/end dates
        const projectCreatedDate = new Date(project.createdAt);
        const projectEndDate = new Date(projectCreatedDate);
        
        // Simulate project end date based on timeline
        const timeline = project.timeline || '12 months'; // default timeline
        const timelineMonths = timeline.includes('month') 
          ? parseInt(timeline) 
          : timeline.includes('week') 
            ? Math.ceil(parseInt(timeline) / 4) 
            : 12; // default to 12 months
        
        projectEndDate.setMonth(projectEndDate.getMonth() + timelineMonths);
        
        if (startDate) {
          const filterStartDate = new Date(startDate);
          matchesDateRange = matchesDateRange && projectEndDate >= filterStartDate;
        }
        
        if (endDate) {
          const filterEndDate = new Date(endDate);
          matchesDateRange = matchesDateRange && projectCreatedDate <= filterEndDate;
        }
      }
      
      return matchesSearch && matchesTrade && matchesBudget && matchesDateRange;
    });

    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'budget-high':
        filtered.sort((a, b) => (b.estimatedCost || 0) - (a.estimatedCost || 0));
        break;
      case 'budget-low':
        filtered.sort((a, b) => (a.estimatedCost || 0) - (b.estimatedCost || 0));
        break;
    }

    return filtered;
  }, [availableProjects, searchTerm, tradeFilter, budgetFilter, startDate, endDate, sortBy]);

  const renderProjectCard = (project: any) => (
    <CardWidget
      key={project.id}
      title={project.name}
      variant="default"
      content={
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>
          
          {/* Key Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <CurrencyDollarIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Budget</div>
                <div className="font-medium">{formatCurrency(project.estimatedCost || 0)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Timeline</div>
                <div className="font-medium">{project.timeline}</div>
              </div>
            </div>
          </div>

          {/* Location (simulated) */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPinIcon className="w-4 h-4" />
            <span>Downtown District</span>
          </div>

          {/* Files Available */}
          {project.planFiles && project.planFiles.length > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <DocumentIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {project.planFiles.length} file{project.planFiles.length !== 1 ? 's' : ''} available
              </span>
              <div className="flex flex-wrap gap-1">
                {project.planFiles.slice(0, 2).map((file: any) => (
                  <Badge key={file.id} variant="outline" className="text-xs">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </Badge>
                ))}
                {project.planFiles.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.planFiles.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Status and Posted Time */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Posted {formatRelativeTime(project.createdAt)}
            </span>
            <Badge variant="warning">
              Accepting Bids
            </Badge>
          </div>
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Button size="sm" variant="info" onClick={() => handleViewDetails(project)}>
            View Details
          </Button>
          <Button size="sm" variant="success" onClick={() => handleSubmitBid(project)}>
            Submit Bid
          </Button>
        </div>
      }
    />
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Project Marketplace</h1>
          <p className="text-muted-foreground">
            Browse available projects and submit competitive bids
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects by name, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Filters</span>
                {(tradeFilter !== 'all' || budgetFilter !== 'all' || startDate || endDate) && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {[tradeFilter !== 'all', budgetFilter !== 'all', startDate, endDate].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Trade Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Trade Specialization</label>
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
                  </select>
                </div>

                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <select
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="all">Any Budget</option>
                    <option value="under-500k">Under $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m-5m">$1M - $5M</option>
                    <option value="over-5m">Over $5M</option>
                  </select>
                </div>

                {/* Start Date Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date (From)</label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                {/* End Date Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">End Date (To)</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(tradeFilter !== 'all' || budgetFilter !== 'all' || startDate || endDate) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTradeFilter('all');
                      setBudgetFilter('all');
                      setStartDate('');
                      setEndDate('');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">{filteredAndSortedProjects.length}</div>
            <div className="text-sm text-muted-foreground">
              {filteredAndSortedProjects.length === availableProjects.length ? 'Available Projects' : 'Filtered Results'}
            </div>
          </div>
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(filteredAndSortedProjects.reduce((sum, p) => sum + (p.estimatedCost || 0), 0)).replace('.00', '')}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-sm text-muted-foreground">My Active Bids</div>
          </div>
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">85%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredAndSortedProjects.length === availableProjects.length 
                ? 'All Available Projects' 
                : `${filteredAndSortedProjects.length} Project${filteredAndSortedProjects.length !== 1 ? 's' : ''} Found`
              }
            </h2>
            {filteredAndSortedProjects.length !== availableProjects.length && (
              <p className="text-sm text-muted-foreground">
                Showing filtered results from {availableProjects.length} total projects
              </p>
            )}
          </div>
        </div>

        {/* Projects List */}
        <ListWidget
          items={filteredAndSortedProjects}
          renderItem={renderProjectCard}
          emptyState={
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || tradeFilter !== 'all' || budgetFilter !== 'all' || startDate || endDate
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No projects are currently available for bidding.'
                }
              </p>
              {(searchTerm || tradeFilter !== 'all' || budgetFilter !== 'all' || startDate || endDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setTradeFilter('all');
                    setBudgetFilter('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          }
        />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={showProjectModal}
          onClose={handleCloseModal}
          onSubmitBid={() => handleSubmitBid()}
        />

        {/* Bid Submission Form */}
        <BidSubmissionForm
          project={selectedProject}
          isOpen={showBidForm}
          onClose={handleCloseBidForm}
          onSubmit={handleBidSubmission}
        />
      </div>
    </Layout>
  );
}