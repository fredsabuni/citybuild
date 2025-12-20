'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { PaymentStatusBadge } from '@/components/payments/PaymentStatusBadge';
import { PaymentMethodCard } from '@/components/payments/PaymentMethodCard';
import { CreatePaymentPanel } from '@/components/payments/CreatePaymentPanel';
import { PaymentAnalytics } from '@/components/payments/PaymentAnalytics';

interface Payment {
  id: string;
  projectName: string;
  recipient: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  dueDate: string;
  paymentMethod: 'ach' | 'wire' | 'check' | 'credit_card';
  description: string;
  invoiceNumber?: string;
}

interface PaymentMethod {
  id: string;
  type: 'bank' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
  lastUsed?: string;
  status?: 'active' | 'expired' | 'pending';
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'history' | 'methods' | 'analytics'>('overview');
  const [showNewPayment, setShowNewPayment] = useState(false);

  // Mock data
  const payments: Payment[] = [
    {
      id: '1',
      projectName: 'Downtown Office Complex',
      recipient: 'ABC Steel Supply',
      amount: 45000,
      status: 'pending',
      dueDate: '2024-12-25',
      paymentMethod: 'ach',
      description: 'Steel beams and structural materials',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: '2',
      projectName: 'Residential Tower A',
      recipient: 'Metro Concrete Co.',
      amount: 28500,
      status: 'processing',
      dueDate: '2024-12-22',
      paymentMethod: 'wire',
      description: 'Ready-mix concrete delivery',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: '3',
      projectName: 'Shopping Center Phase 2',
      recipient: 'Elite Electrical',
      amount: 67200,
      status: 'completed',
      dueDate: '2024-12-20',
      paymentMethod: 'ach',
      description: 'Electrical installation and wiring',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: '4',
      projectName: 'Industrial Warehouse',
      recipient: 'ProBuild Materials',
      amount: 15800,
      status: 'failed',
      dueDate: '2024-12-18',
      paymentMethod: 'credit_card',
      description: 'Lumber and framing materials',
      invoiceNumber: 'INV-2024-004'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'bank',
      name: 'Business Checking',
      details: 'Wells Fargo ****1234',
      isDefault: true,
      lastUsed: '2024-12-18',
      status: 'active'
    },
    {
      id: '2',
      type: 'bank',
      name: 'Construction Account',
      details: 'Chase Bank ****5678',
      isDefault: false,
      lastUsed: '2024-12-15',
      status: 'active'
    },
    {
      id: '3',
      type: 'card',
      name: 'Business Credit Card',
      details: 'Visa ****9012',
      isDefault: false,
      lastUsed: '2024-12-10',
      status: 'active'
    }
  ];

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <div className="w-5 h-5 text-red-500">⚠</div>;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalProcessing = payments.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Payment Processing
            </h1>
            <p className="text-muted-foreground">
              Manage payments, track transactions, and handle financial operations
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-xl hover:bg-accent transition-colors">
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-border rounded-xl hover:bg-accent transition-colors">
              <FunnelIcon className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button 
              onClick={() => setShowNewPayment(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Payment</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/50 dark:to-orange-900/50 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-1">
              {formatCurrency(totalPending)}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              {payments.filter(p => p.status === 'pending').length} payments
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 border border-blue-200 dark:border-blue-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Processing</span>
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
              {formatCurrency(totalProcessing)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {payments.filter(p => p.status === 'processing').length} payments
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 border border-green-200 dark:border-green-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
              {formatCurrency(totalCompleted)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {payments.filter(p => p.status === 'completed').length} payments
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-900/50 border border-purple-200 dark:border-purple-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Volume</span>
            </div>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
              {formatCurrency(totalPending + totalProcessing + totalCompleted)}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              This month
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BanknotesIcon },
            { id: 'pending', label: 'Pending', icon: ClockIcon },
            { id: 'history', label: 'History', icon: CheckCircleIcon },
            { id: 'methods', label: 'Payment Methods', icon: CreditCardIcon },
            { id: 'analytics', label: 'Analytics', icon: () => <span className="w-4 h-4 flex items-center justify-center">📊</span> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {(activeTab === 'overview' || activeTab === 'pending' || activeTab === 'history') && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Project / Recipient</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Due Date</th>
                    <th className="text-left p-4 font-semibold">Method</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments
                    .filter(payment => {
                      if (activeTab === 'pending') return payment.status === 'pending';
                      if (activeTab === 'history') return payment.status === 'completed' || payment.status === 'failed';
                      return true;
                    })
                    .map((payment) => (
                    <tr key={payment.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-foreground">{payment.projectName}</div>
                          <div className="text-sm text-muted-foreground">{payment.recipient}</div>
                          <div className="text-xs text-muted-foreground mt-1">{payment.description}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{formatCurrency(payment.amount)}</div>
                        {payment.invoiceNumber && (
                          <div className="text-xs text-muted-foreground">{payment.invoiceNumber}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">{formatDate(payment.dueDate)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground capitalize">{payment.paymentMethod.replace('_', ' ')}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View
                          </button>
                          {payment.status === 'pending' && (
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              Process
                            </button>
                          )}
                          {payment.status === 'failed' && (
                            <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <PaymentAnalytics />
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onEdit={(method) => console.log('Edit method:', method)}
                  onRemove={(method) => console.log('Remove method:', method)}
                  onSetDefault={(method) => console.log('Set default:', method)}
                />
              ))}
            </div>
            
            <button className="w-full border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors">
              <PlusIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-muted-foreground">Add New Payment Method</div>
            </button>
          </div>
        )}
      </div>

      {/* Create Payment Panel */}
      <CreatePaymentPanel
        isOpen={showNewPayment}
        onClose={() => setShowNewPayment(false)}
        onSubmit={(paymentData) => {
          console.log('New payment:', paymentData);
          // Handle payment creation
        }}
      />
    </Layout>
  );
}