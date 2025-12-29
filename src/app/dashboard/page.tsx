'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { useApp } from '@/lib/context';
import {
  GCDashboard,
  SubcontractorDashboard,
  SupplierDashboard,
  BankDashboard,
} from '@/components/dashboards';

export default function DashboardPage() {
  const { user } = useApp();

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
      case 'admin':
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
      admin: 'Administrator',
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
              {getRoleDisplayName(user.role || '')} Dashboard
            </p>
          )}
        </div>

        {getDashboardContent()}
      </div>
    </Layout>
  );
}