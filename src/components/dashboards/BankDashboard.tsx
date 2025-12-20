'use client';

import React from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  BanknotesIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const BankDashboard: React.FC = () => {
  // Mock bank data
  const mockLoanApplications = [
    {
      id: 'loan-1',
      projectName: 'Downtown Office Complex',
      applicant: 'John Contractor',
      amount: 2500000,
      status: 'pending',
      riskLevel: 'low',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'loan-2',
      projectName: 'Residential Complex Phase 1',
      applicant: 'Sarah Builder',
      amount: 1800000,
      status: 'approved',
      riskLevel: 'low',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'loan-3',
      projectName: 'Warehouse Renovation',
      applicant: 'Mike Developer',
      amount: 850000,
      status: 'under_review',
      riskLevel: 'medium',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  const mockPayments = [
    {
      id: 'pay-1',
      projectName: 'Downtown Office Complex',
      type: 'draw',
      amount: 250000,
      status: 'pending',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'pay-2',
      projectName: 'Residential Complex Phase 1',
      type: 'inspection',
      amount: 180000,
      status: 'approved',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'pay-3',
      projectName: 'Warehouse Renovation',
      type: 'final',
      amount: 85000,
      status: 'processing',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  ];

  // Calculate statistics
  const pendingApplications = mockLoanApplications.filter(l => l.status === 'pending').length;
  const approvedLoans = mockLoanApplications.filter(l => l.status === 'approved').length;
  const totalDisbursed = mockLoanApplications
    .filter(l => l.status === 'approved')
    .reduce((sum, l) => sum + l.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;

  const renderLoanCard = (loan: any) => (
    <CardWidget
      key={loan.id}
      title={`Loan #${loan.id.slice(-4)}`}
      variant={loan.status === 'pending' ? 'warning' : 'default'}
      content={
        <div className="space-y-2">
          <div className="font-medium text-sm">{loan.projectName}</div>
          <div className="text-xs text-muted-foreground">Applicant: {loan.applicant}</div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{formatCurrency(loan.amount)}</span>
            <Badge
              variant={
                loan.status === 'approved'
                  ? 'success'
                  : loan.status === 'pending'
                  ? 'warning'
                  : 'default'
              }
            >
              {loan.status.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              Risk: <span className={loan.riskLevel === 'low' ? 'text-green-600' : 'text-yellow-600'}>
                {loan.riskLevel}
              </span>
            </span>
            <span className="text-muted-foreground">
              {formatRelativeTime(loan.submittedAt)}
            </span>
          </div>
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            Review
          </Button>
          {loan.status === 'pending' && (
            <Button size="sm">
              Approve
            </Button>
          )}
        </div>
      }
    />
  );

  const renderPaymentCard = (payment: any) => (
    <div key={payment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-sm">{payment.projectName}</div>
        <div className="text-xs text-muted-foreground capitalize">
          {payment.type} payment • {formatCurrency(payment.amount)}
        </div>
        <div className="text-xs text-muted-foreground">
          Due: {payment.dueDate.toLocaleDateString()}
        </div>
      </div>
      <Badge
        variant={
          payment.status === 'approved'
            ? 'success'
            : payment.status === 'pending'
            ? 'warning'
            : 'default'
        }
      >
        {payment.status}
      </Badge>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardWidget
          title="Pending Applications"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingApplications}</div>
                <div className="text-xs text-muted-foreground">Need review</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Active Loans"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{approvedLoans}</div>
                <div className="text-xs text-muted-foreground">Currently funded</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Total Disbursed"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalDisbursed).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">This quarter</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Pending Payments"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <DocumentCheckIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingPayments}</div>
                <div className="text-xs text-muted-foreground">Awaiting approval</div>
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
            <Button className="h-auto p-4 flex-col space-y-2">
              <DocumentCheckIcon className="w-6 h-6" />
              <span className="text-sm">Review Applications</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <BanknotesIcon className="w-6 h-6" />
              <span className="text-sm">Process Payments</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <ChartBarIcon className="w-6 h-6" />
              <span className="text-sm">Risk Analysis</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <ShieldCheckIcon className="w-6 h-6" />
              <span className="text-sm">Compliance</span>
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Loan Applications */}
        <CardWidget
          title="Recent Loan Applications"
          content={
            <ListWidget
              items={mockLoanApplications}
              renderItem={renderLoanCard}
              emptyState={
                <div className="text-center py-8">
                  <DocumentCheckIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No applications yet</p>
                </div>
              }
            />
          }
          actions={
            <Button size="sm" variant="outline">
              View All Applications
            </Button>
          }
        />

        {/* Payment Processing */}
        <CardWidget
          title="Payment Queue"
          content={
            <div className="space-y-3">
              {mockPayments.map(renderPaymentCard)}
            </div>
          }
          actions={
            <Button size="sm" variant="outline">
              View All Payments
            </Button>
          }
        />
      </div>

      {/* Risk Assessment */}
      <CardWidget
        title="Portfolio Risk Assessment"
        content={
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <ShieldCheckIcon className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-lg font-bold">85%</div>
              <div className="text-xs text-muted-foreground">Low Risk</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
              <ExclamationCircleIcon className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-lg font-bold">12%</div>
              <div className="text-xs text-muted-foreground">Medium Risk</div>
            </div>
            
            <div className="text-center p-4 bg-red-500/10 rounded-lg">
              <ExclamationCircleIcon className="w-8 h-8 mx-auto text-red-600 mb-2" />
              <div className="text-lg font-bold">3%</div>
              <div className="text-xs text-muted-foreground">High Risk</div>
            </div>
          </div>
        }
      />

      {/* Performance Metrics */}
      <CardWidget
        title="Performance Metrics"
        content={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-lg font-bold">98%</div>
              <div className="text-xs text-muted-foreground">Approval rate</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <BanknotesIcon className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-lg font-bold">$12.5M</div>
              <div className="text-xs text-muted-foreground">Total portfolio</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <DocumentCheckIcon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-lg font-bold">156</div>
              <div className="text-xs text-muted-foreground">Active loans</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <ClockIcon className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <div className="text-lg font-bold">2.3 days</div>
              <div className="text-xs text-muted-foreground">Avg. approval time</div>
            </div>
          </div>
        }
      />

      {/* Recent Activity */}
      <CardWidget
        title="Recent Activity"
        content={
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Loan Approved</div>
                <div className="text-sm text-muted-foreground">
                  Residential Complex Phase 1 - $1.8M approved
                </div>
              </div>
              <div className="text-sm text-muted-foreground">2 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Payment Processed</div>
                <div className="text-sm text-muted-foreground">
                  Draw payment of $250K disbursed to Downtown Office Complex
                </div>
              </div>
              <div className="text-sm text-muted-foreground">5 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">New Application</div>
                <div className="text-sm text-muted-foreground">
                  Warehouse Renovation - $850K loan application received
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 day ago</div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default BankDashboard;