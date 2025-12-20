'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useApp } from '@/lib/context';
import {
  ArrowLeftIcon,
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
  PrinterIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';

// Mock loan applications data (same as in main page)
const mockLoanApplications = [
  {
    id: 'loan-1',
    applicationNumber: 'LA-2024-001',
    applicantName: 'Downtown Construction LLC',
    applicantType: 'gc',
    applicantContact: {
      email: 'info@downtownconst.com',
      phone: '(555) 123-4567',
      address: '123 Business Ave, Downtown City, ST 12345',
    },
    projectName: 'Downtown Office Complex',
    projectId: 'proj-1',
    loanAmount: 2500000,
    loanType: 'construction',
    interestRate: 6.5,
    termMonths: 24,
    monthlyPayment: 115000,
    status: 'under_review',
    applicationDate: new Date('2024-12-10'),
    expectedDecision: new Date('2024-12-25'),
    purpose: 'Construction financing for 15-story office building with retail space on ground floor',
    collateral: 'Property deed and construction contract',
    creditScore: 750,
    annualRevenue: 5000000,
    yearsInBusiness: 8,
    employeeCount: 45,
    documents: [
      { id: 1, name: 'Financial Statements', status: 'approved', uploadDate: new Date('2024-12-10') },
      { id: 2, name: 'Tax Returns (3 years)', status: 'approved', uploadDate: new Date('2024-12-10') },
      { id: 3, name: 'Construction Plans', status: 'pending', uploadDate: new Date('2024-12-12') },
      { id: 4, name: 'Insurance Certificate', status: 'approved', uploadDate: new Date('2024-12-11') },
      { id: 5, name: 'Property Appraisal', status: 'approved', uploadDate: new Date('2024-12-09') },
    ],
    assignedOfficer: 'Sarah Johnson',
    assignedOfficerContact: {
      email: 'sarah.johnson@citybank.com',
      phone: '(555) 987-6543',
      extension: '1234',
    },
    notes: 'Strong financial position, excellent credit history. Project has good market potential.',
    riskAssessment: 'Low Risk',
    loanToValue: 75,
    debtToIncome: 35,
  },
  {
    id: 'loan-2',
    applicationNumber: 'LA-2024-002',
    applicantName: 'Residential Builders Inc.',
    applicantType: 'gc',
    applicantContact: {
      email: 'loans@resbuilders.com',
      phone: '(555) 234-5678',
      address: '456 Construction Blvd, Suburb City, ST 23456',
    },
    projectName: 'Residential Complex Phase 1',
    projectId: 'proj-2',
    loanAmount: 1800000,
    loanType: 'development',
    interestRate: 7.0,
    termMonths: 36,
    monthlyPayment: 55000,
    status: 'approved',
    applicationDate: new Date('2024-11-28'),
    expectedDecision: new Date('2024-12-15'),
    approvedDate: new Date('2024-12-14'),
    purpose: 'Land development and infrastructure for 50-unit residential project',
    collateral: 'Land title and development permits',
    creditScore: 720,
    annualRevenue: 3200000,
    yearsInBusiness: 12,
    employeeCount: 28,
    documents: [
      { id: 1, name: 'Financial Statements', status: 'approved', uploadDate: new Date('2024-11-28') },
      { id: 2, name: 'Tax Returns (3 years)', status: 'approved', uploadDate: new Date('2024-11-28') },
      { id: 3, name: 'Development Plans', status: 'approved', uploadDate: new Date('2024-11-29') },
      { id: 4, name: 'Environmental Report', status: 'approved', uploadDate: new Date('2024-11-30') },
      { id: 5, name: 'Market Analysis', status: 'approved', uploadDate: new Date('2024-12-01') },
    ],
    assignedOfficer: 'Michael Chen',
    assignedOfficerContact: {
      email: 'michael.chen@citybank.com',
      phone: '(555) 876-5432',
      extension: '2345',
    },
    notes: 'Approved with standard terms, disbursement scheduled for January 2025',
    riskAssessment: 'Low Risk',
    loanToValue: 80,
    debtToIncome: 42,
  },
];

export default function LoanDetailsPage() {
  const params = useParams();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'financials' | 'activity'>('details');

  // Find the loan application by ID
  const application = mockLoanApplications.find(a => a.id === params.id);

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Loan Application Not Found</h2>
          <p className="text-muted-foreground">The loan application you're looking for doesn't exist.</p>
          <Link href="/loans" className="mt-4 inline-block">
            <Button>Back to Loan Applications</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_documents':
        return <DocumentTextIcon className="w-5 h-5 text-blue-600" />;
      case 'under_review':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
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

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <DocumentCheckIcon className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <DocumentTextIcon className="w-4 h-4 text-gray-600" />;
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

  const tabs = [
    { id: 'details', label: 'Application Details' },
    { id: 'documents', label: `Documents (${application.documents.length})` },
    { id: 'financials', label: 'Financial Analysis' },
    { id: 'activity', label: 'Activity Log' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/loans">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Loan Applications</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold">{application.applicationNumber}</h1>
              <Badge variant={getStatusVariant(application.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(application.status)}
                  <span className="capitalize">{application.status.replace('_', ' ')}</span>
                </div>
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {application.applicantName} • {getLoanTypeLabel(application.loanType)} • {formatDate(application.applicationDate)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            {application.status === 'under_review' && user?.role === 'bank' && (
              <>
                <Button variant="outline">
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="success">
                  Approve
                </Button>
                <Button variant="destructive">
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Application Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardWidget
            title="Loan Amount"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {formatCurrency(application.loanAmount)}
                  </div>
                  <div className="text-xs text-muted-foreground">Requested</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Interest Rate"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BanknotesIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{application.interestRate}%</div>
                  <div className="text-xs text-muted-foreground">APR</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Term"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{application.termMonths}</div>
                  <div className="text-xs text-muted-foreground">Months</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Credit Score"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <UserIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{application.creditScore}</div>
                  <div className="text-xs text-muted-foreground">FICO Score</div>
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
          {activeTab === 'details' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <CardWidget
                title="Applicant Information"
                content={
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground">Company Name:</span>
                      <div className="font-medium text-lg">{application.applicantName}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium">{getApplicantTypeLabel(application.applicantType)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Years in Business:</span>
                        <div className="font-medium">{application.yearsInBusiness} years</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Annual Revenue:</span>
                        <div className="font-medium">{formatCurrency(application.annualRevenue)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Employees:</span>
                        <div className="font-medium">{application.employeeCount}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Contact Information:</span>
                      <div className="mt-2 space-y-1 text-sm">
                        <div>{application.applicantContact.email}</div>
                        <div>{application.applicantContact.phone}</div>
                        <div>{application.applicantContact.address}</div>
                      </div>
                    </div>
                  </div>
                }
              />

              <CardWidget
                title="Loan Details"
                content={
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Loan Type:</span>
                        <div className="font-medium">{getLoanTypeLabel(application.loanType)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Application Date:</span>
                        <div className="font-medium">{formatDate(application.applicationDate)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Decision:</span>
                        <div className="font-medium">{formatDate(application.expectedDecision)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Payment:</span>
                        <div className="font-medium">{formatCurrency(application.monthlyPayment)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Purpose:</span>
                      <div className="font-medium mt-1">{application.purpose}</div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Collateral:</span>
                      <div className="font-medium mt-1">{application.collateral}</div>
                    </div>

                    {application.projectName && (
                      <div>
                        <span className="text-muted-foreground">Related Project:</span>
                        <div className="font-medium mt-1">{application.projectName}</div>
                      </div>
                    )}
                  </div>
                }
              />

              <CardWidget
                title="Assigned Loan Officer"
                content={
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground">Officer:</span>
                      <div className="font-medium text-lg">{application.assignedOfficer}</div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <div className="font-medium">{application.assignedOfficerContact.email}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <div className="font-medium">
                          {application.assignedOfficerContact.phone} ext. {application.assignedOfficerContact.extension}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Notes:</span>
                      <div className="font-medium mt-1">{application.notes}</div>
                    </div>
                  </div>
                }
                actions={
                  <Button size="sm" variant="outline">
                    Contact Officer
                  </Button>
                }
              />

              <CardWidget
                title="Risk Assessment"
                content={
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Risk Level:</span>
                        <div className="font-medium text-green-600">{application.riskAssessment}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Credit Score:</span>
                        <div className="font-medium">{application.creditScore}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loan-to-Value:</span>
                        <div className="font-medium">{application.loanToValue}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Debt-to-Income:</span>
                        <div className="font-medium">{application.debtToIncome}%</div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          )}

          {activeTab === 'documents' && (
            <CardWidget
              title="Required Documents"
              content={
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {application.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getDocumentStatusIcon(doc.status)}
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Uploaded {formatRelativeTime(doc.uploadDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'secondary'}>
                            {doc.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <DocumentArrowDownIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              }
              actions={
                application.status === 'pending_documents' && (
                  <Button size="sm">
                    Upload Documents
                  </Button>
                )
              }
            />
          )}

          {activeTab === 'financials' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <CardWidget
                title="Financial Summary"
                content={
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Annual Revenue:</span>
                        <div className="font-bold text-lg">{formatCurrency(application.annualRevenue)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Credit Score:</span>
                        <div className="font-bold text-lg">{application.creditScore}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Loan-to-Value Ratio:</span>
                        <div className="font-bold text-lg">{application.loanToValue}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Debt-to-Income Ratio:</span>
                        <div className="font-bold text-lg">{application.debtToIncome}%</div>
                      </div>
                    </div>
                  </div>
                }
              />

              <CardWidget
                title="Loan Terms"
                content={
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Principal Amount:</span>
                        <div className="font-bold text-lg">{formatCurrency(application.loanAmount)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Interest Rate:</span>
                        <div className="font-bold text-lg">{application.interestRate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Term Length:</span>
                        <div className="font-bold text-lg">{application.termMonths} months</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Payment:</span>
                        <div className="font-bold text-lg">{formatCurrency(application.monthlyPayment)}</div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          )}

          {activeTab === 'activity' && (
            <CardWidget
              title="Application Activity"
              content={
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Application Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {application.applicantName} submitted loan application for {formatCurrency(application.loanAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(application.applicationDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Documents Uploaded</div>
                      <div className="text-sm text-muted-foreground">
                        Initial documentation package received and under review
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(application.applicationDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Assigned to Loan Officer</div>
                      <div className="text-sm text-muted-foreground">
                        Application assigned to {application.assignedOfficer} for review
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(new Date(application.applicationDate.getTime() + 24 * 60 * 60 * 1000))}
                      </div>
                    </div>
                  </div>

                  {application.status === 'approved' && application.approvedDate && (
                    <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">Application Approved</div>
                        <div className="text-sm text-muted-foreground">
                          Loan approved for {formatCurrency(application.loanAmount)} at {application.interestRate}% APR
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(application.approvedDate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )}
        </div>
      </div>
    </Layout>
  );
}