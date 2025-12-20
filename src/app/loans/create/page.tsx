'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget } from '@/components/widgets';
import { Button } from '@/components/ui';
import LoanApplicationForm from '@/components/loans/LoanApplicationForm';
import { useApp } from '@/lib/context';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateLoanApplicationPage() {
  const router = useRouter();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);

  const handleApplicationSubmit = async (applicationData: any) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Loan application submitted:', applicationData);
      
      // In a real app, you would save to backend here
      // For now, we'll just redirect back to loans
      router.push('/loans');
    } catch (error) {
      console.error('Error submitting loan application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/loans');
  };

  // Check if user is authorized to create loan applications
  if (!user || (user.role !== 'gc' && user.role !== 'subcontractor' && user.role !== 'supplier')) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <CardWidget
            title="Access Denied"
            content={
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                <p className="text-muted-foreground">
                  Only contractors and suppliers can submit loan applications.
                </p>
              </div>
            }
          />
        </div>
      </Layout>
    );
  }

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
        <div className="text-center">
          <h1 className="text-3xl font-bold">Apply for Construction Financing</h1>
          <p className="text-muted-foreground mt-2">
            Complete the application below to request financing for your construction project or business needs
          </p>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <CardWidget
            title=""
            content={
              <LoanApplicationForm
                onSubmit={handleApplicationSubmit}
                onCancel={handleCancel}
                loading={loading}
              />
            }
          />
        </div>
      </div>
    </Layout>
  );
}