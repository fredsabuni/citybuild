'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import {
  PlusIcon,
  FunnelIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

// Mock loan applications data
const mockLoanApplications = [
  {
    id: 'loan-1',
    applicationNumber: 'LA-2024-001',
    applicantName: 'Downtown Construction LLC',
    applicantType: 'gc',
    projectName: 'Downtown Office Complex',
    projectId: 'proj-1',
    loanAmount: 2500000,
    loanType: 'construction',
    interestRate: 6.5,
    termMonths: 24,
    status: 'under_review',
    applicationDate: new Date('2024-12-10'),
    expectedDecision: new Date('2024-12-25'),
    purpose: 'Construction financing for 15-story office building',
    collateral: 'Property deed and construction contract',
    creditScore: 750,
    annualRevenue: 5000000,
    yearsInBusiness: 8,
    documents: [
      { name: 'Financial Statements', status: 'approved' },
      { name: 'Tax Returns', status: 'approved' },
      { name: 'Construction Plans', status: 'pending' },
      { name: 'Insurance Certificate', status: 'approved' },
    ],
    assignedOfficer: 'Sarah Johnson',
    notes: 'Strong financial position, excellent credit history',
  },
  {
    id: 'loan-2',
    applicationNumber: 'LA-2024-002',
    applicantName: 'Residential Builders Inc.',
    applicantType: 'gc',
    projectName: 'Residential Complex Phase 1',
    projectId: 'proj-2',
    loanAmount: 1800000,
    loanType: 'development',
    interestRate: 7.0,
    termMonths: 36,
    status: 'approved',
    applicationDate: new Date('2024-11-28'),
    expectedDecision: new Date('2024-12-15'),
    approvedDate: new Date('2024-12-14'),
    purpose: 'Land development and infrastructure for residential project',
    collateral: 'Land title and development permits',
    creditScore: 720,
    annualRevenue: 3200000,
    yearsInBusiness: 12,
    documents: [
      { name: 'Financial Statements', status: 'approved' },
      { name: 'Tax Returns', status: 'approved' },
      { name: 'Development Plans', status: 'approved' },
      { name: 'Environmental Report', status: 'approved' },
    ],
    assignedOfficer: 'Michael Chen',
    notes: 'Approved with standard terms, disbursement scheduled',
  },
  {
    id: 'loan-3',
    applicationNumber: 'LA-2024-003',
    applicantName: 'Steel Works Contractors',
    applicantType: 'subcontractor',
    projectName: 'Warehouse Renovation',
    projectId: 'proj-3',
    loanAmount: 450000,
    loanType: 'equipment',
    interestRate: 8.5,
    termMonths: 60,
    status: 'rejected',
    applicationDate: new Date('2024-12-01'),
    expectedDecision: new Date('2024-12-20'),
    rejectedDate: new Date('2024-12-18'),
    purpose: 'Equipment financing for specialized steel fabrication machinery',
    collateral: 'Equipment and business assets',
    creditScore: 650,
    annualRevenue: 800000,
    yearsInBusiness: 5,
    documents: [
      { name: 'Financial Statements', status: 'approved' },
      { name: 'Tax Returns', status: 'rejected' },
      { name: 'Equipment Quotes', status: 'approved' },
      { name: 'Business License', status: 'approved' },
    ],
    assignedOfficer: 'Lisa Rodriguez',
    notes: 'Insufficient cash flow, recommend reapplication in 6 months',
    rejectionReason: 'Debt-to-income ratio exceeds acceptable limits',
  },
  {
    id: 'loan-4',
    applicationNumber: 'LA-2024-004',
    applicantName: 'Premium Building Materials',
    applicantType: 'supplier',
    projectName: 'Inventory Expansion',
    projectId: null,
    loanAmount: 750000,
    loanType: 'working_capital',
    interestRate: 5.5,
    termMonths: 18,
    status: 'pending_documents',
    applicationDate: new Date('2024-12-15'),
    expectedDecision: new Date('2024-12-30'),
    purpose: 'Working capital for inventory expansion and new warehouse',
    collateral: 'Inventory and accounts receivable',
    creditScore: 780,
    annualRevenue: 2500000,
    yearsInBusiness: 15,
    documents: [
      { name: 'Financial Statements', status: 'approved' },
      { name: 'Tax Returns', status: 'pending' },
      { name: 'Inventory Report', status: 'pending' },
      { name: 'Lease Agreement', status: 'approved' },
    ],
    assignedOfficer: 'David Kim',
    notes: 'Awaiting updated tax returns and inventory valuation',
  },
];

export default function LoansPage() {
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_documents':
        return <DocumentTextIcon className="w-4 h-4 text-blue-600" />;
      case 'under_review':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending_documents':
        return 'default';
      case 'under_review':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getLoanTypeLabel = (type: string) => {
    switch (type) {
      case 'construction':
        return 'Construction Loan';
      case 'development':
        return 'Development Loan';
      case 'equipment':
        return 'Equipment Financing';
      case 'working_capital':
        return 'Working Capital';
      default:
        return type;
    }
  };

  const getApplicantTypeLabel = (type: string) => {
    switch (type) {
      case 'gc':
        return 'General Contractor';
      case 'subcontractor':
        return 'Subcontractor';
      case 'supplier':
        return 'Supplier';
      default:
        return type;
    }
  };

  const filteredApplications = mockLoanApplications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesType = typeFilter === 'all' || app.loanType === typeFilter;
    const matchesSearch = searchTerm === '' || 
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.projectName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesType && matchesSearch;
  });

  const renderLoanCard = (application: any) => (
    <CardWidget
      key={application.id}
      title={application.applicationNumber}
      content={
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-lg mb-1">{application.applicantName}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {getApplicantTypeLabel(application.applicantType)}
              </div>
              <Badge variant="outline" className="text-xs">
                {getLoanTypeLabel(application.loanType)}
              </Badge>
            </div>
            <Badge variant={getStatusVariant(application.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(application.status)}
                <span className="capitalize">{application.status.replace('_', ' ')}</span>
              </div>
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Loan Amount:</span>
              <div className="font-bold text-lg text-green-600">
                {formatCurrency(application.loanAmount)}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Interest Rate:</span>
              <div className="font-medium">{application.interestRate}% APR</div>
            </div>
          </div>

          {application.projectName && (
            <div>
              <span className="text-muted-foreground text-sm">Project:</span>
              <div className="font-medium">{application.projectName}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Applied:</span>
              <div className="font-medium">{formatDate(application.applicationDate)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Decision By:</span>
              <div className="font-medium">{formatDate(application.expectedDecision)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="text-sm">
              <span className="text-muted-foreground">Officer: </span>
              <span className="font-medium">{application.assignedOfficer}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Term: </span>
              <span className="font-medium">{application.termMonths} months</span>
            </div>
          </div>
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Link href={`/loans/${application.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          {application.status === 'pending_documents' && (
            <Button size="sm" variant="default">
              Upload Docs
            </Button>
          )}
          {application.status === 'under_review' && (
            <Button size="sm" variant="success">
              Process
            </Button>
          )}
        </div>
      }
    />
  );

  // Calculate stats
  const totalApplications = mockLoanApplications.length;
  const pendingApplications = mockLoanApplications.filter(a => a.status === 'pending_documents' || a.status === 'under_review').length;
  const approvedApplications = mockLoanApplications.filter(a => a.status === 'approved').length;
  const rejectedApplications = mockLoanApplications.filter(a => a.status === 'rejected').length;
  const totalLoanValue = mockLoanApplications.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.loanAmount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Loan Applications</h1>
            <p className="text-muted-foreground">Manage construction and business loan applications</p>
          </div>
          <Link href="/loans/create">
            <Button className="flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>New Application</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CardWidget
            title="Total Applications"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold">{totalApplications}</div>
                <div className="text-xs text-muted-foreground">All time</div>
              </div>
            }
          />
          <CardWidget
            title="Pending Review"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingApplications}</div>
                <div className="text-xs text-muted-foreground">Awaiting decision</div>
              </div>
            }
          />
          <CardWidget
            title="Approved"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{approvedApplications}</div>
                <div className="text-xs text-muted-foreground">Funded</div>
              </div>
            }
          />
          <CardWidget
            title="Rejected"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{rejectedApplications}</div>
                <div className="text-xs text-muted-foreground">Declined</div>
              </div>
            }
          />
          <CardWidget
            title="Total Funded"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(totalLoanValue).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">Approved loans</div>
              </div>
            }
          />
        </div>

        {/* Filters and Search */}
        <CardWidget
          title="Filter Applications"
          content={
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="pending_documents">Pending Documents</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Types</option>
                  <option value="construction">Construction Loan</option>
                  <option value="development">Development Loan</option>
                  <option value="equipment">Equipment Financing</option>
                  <option value="working_capital">Working Capital</option>
                </select>
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search applications, applicants, or projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          }
        />

        {/* Applications List */}
        <CardWidget
          title={`Loan Applications (${filteredApplications.length})`}
          content={
            <ListWidget
              items={filteredApplications}
              renderItem={renderLoanCard}
              emptyState={
                <div className="text-center py-12">
                  <BanknotesIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No loan applications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'all' 
                      ? "Start by creating your first loan application." 
                      : `No applications match the current filters.`}
                  </p>
                  <Link href="/loans/create">
                    <Button>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Application
                    </Button>
                  </Link>
                </div>
              }
            />
          }
        />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <CardWidget
            title="Pending Actions"
            content={
              <div className="space-y-3">
                {mockLoanApplications
                  .filter(app => app.status === 'pending_documents' || app.status === 'under_review')
                  .slice(0, 3)
                  .map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(app.status)}
                        <div>
                          <div className="font-medium text-sm">{app.applicantName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(app.loanAmount)} • {app.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <Link href={`/loans/${app.id}`}>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
                {mockLoanApplications.filter(app => app.status === 'pending_documents' || app.status === 'under_review').length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    No pending actions!
                  </div>
                )}
              </div>
            }
          />

          <CardWidget
            title="Recent Activity"
            content={
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">Residential Builders Inc. approved</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(1800000)} • 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <XCircleIcon className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="font-medium text-sm">Steel Works Contractors rejected</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(450000)} • 1 day ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Premium Building Materials submitted</div>
                    <div className="text-xs text-muted-foreground">{formatCurrency(750000)} • 3 days ago</div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </Layout>
  );
}