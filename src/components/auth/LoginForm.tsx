'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { useApp } from '@/lib/context';
import { mockUsers } from '@/data/mockUsers';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useApp();



  const handleLogin = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Demo mode - accept any email/password combination
      // Try to find existing user by email, otherwise create a demo user
      let user = mockUsers.find(u => u.email === formData.email);
      
      if (!user) {
        // Create a demo user for any email not in mockUsers
        user = {
          id: `demo-${Date.now()}`,
          name: formData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          email: formData.email,
          role: 'gc', // Default to General Contractor
          phone: '+1 (555) 123-4567',
          verified: true,
          createdAt: new Date(),
        };
      }
      
      setUser(user!);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Demo Login */}
      <div className="space-y-3">
        <Button
          onClick={() => {
            setUser(mockUsers[0]); // John Contractor (GC)
            if (onSuccess) onSuccess();
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          🚀 LOGIN AS GENERAL CONTRACTOR
        </Button>
        
        <Button
          onClick={() => {
            setUser(mockUsers[3]); // Mike Plumber (Subcontractor)
            if (onSuccess) onSuccess();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          🔨 LOGIN AS SUBCONTRACTOR
        </Button>
        
        <Button
          onClick={() => {
            setUser(mockUsers[11]); // BuildMart Supply (Supplier)
            if (onSuccess) onSuccess();
          }}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          size="lg"
        >
          🚛 LOGIN AS SUPPLIER
        </Button>
        
        <Button
          onClick={() => {
            setUser(mockUsers[14]); // First Construction Bank
            if (onSuccess) onSuccess();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          🏦 LOGIN AS BANK
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Choose a role to instantly access the dashboard
        </p>
      </div>
    </div>
  );
};

export default LoginForm;