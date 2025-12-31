'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout';
import { useApp } from '@/lib/context';
import {
  GCDashboard,
  SubcontractorDashboard,
  SupplierDashboard,
  BankDashboard,
} from '@/components/dashboards';
import { mockUsers } from '@/data/mockUsers';
import { UserRole } from '@/types';

function DashboardContent() {
  const { user, setUser } = useApp();
  const searchParams = useSearchParams();

  // Check for role parameter in URL and update user accordingly
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      // Map URL role parameters to user roles
      const roleMapping: Record<string, UserRole> = {
        'bank': 'bank',
        'owner': 'gc', // Owners see GC dashboard for now
        'contractor': 'gc',
        'subcontractor': 'subcontractor',
        'supplier': 'supplier',
      };

      const userRole = roleMapping[roleParam];
      // Only update if the user doesn't exist or has a different role
      if (userRole && (!user || user.role !== userRole)) {
        // Find the mock user with this role
        const mockUser = mockUsers.find(u => u.role === userRole);
        if (mockUser) {
          setUser(mockUser);
          console.log('✅ User role set from URL parameter:', roleParam, '→', userRole);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getDashboardContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Welcome to CityBuild</h2>
          <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
        </div>
      );
    }

    switch (user.role) {
      case 'gc':
        return <GCDashboard />;
      case 'subcontractor':
        return <SubcontractorDashboard />;
      case 'supplier':
        return <SupplierDashboard />;
      case 'bank':
        return <BankDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Unknown Role</h2>
            <p className="text-muted-foreground">Please contact support for assistance.</p>
          </div>
        );
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      gc: 'General Contractor',
      subcontractor: 'Subcontractor',
      supplier: 'Supplier',
      bank: 'Bank',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {user ? `Welcome back, ${user.name}` : 'Dashboard'}
          </h1>
          {user && (
            <p className="text-muted-foreground">
              {getRoleDisplayName(user.role)} Dashboard
            </p>
          )}
        </div>

        {getDashboardContent()}
      </div>
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    }>
      <DashboardContent />
    </Suspense>
  );
}