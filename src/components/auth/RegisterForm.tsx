'use client';

import React, { useState } from 'react';
import { FormWidget } from '@/components/widgets';
import { Button } from '@/components/ui';
import { FormField, UserRole } from '@/types';
import { useApp } from '@/lib/context';
import { generateId } from '@/lib/utils';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'details' | 'verification'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const { setUser } = useApp();

  const roleOptions = [
    {
      value: 'gc',
      label: 'General Contractor',
      description: 'Submit building plans, receive bids, and manage construction projects',
      icon: '🏗️',
    },
    {
      value: 'subcontractor',
      label: 'Subcontractor',
      description: 'Browse projects, submit competitive bids, and grow your business',
      icon: '🔨',
    },
    {
      value: 'supplier',
      label: 'Supplier',
      description: 'Receive automated orders and manage receivables efficiently',
      icon: '🚛',
    },
    {
      value: 'bank',
      label: 'Bank',
      description: 'Process loan draws and payment approvals for construction projects',
      icon: '🏦',
    },
  ];

  const registrationFields: FormField[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      required: true,
      validation: {
        pattern: /^\+?[\d\s\-\(\)]+$/,
        minLength: 10,
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a secure password',
      required: true,
      validation: {
        minLength: 8,
        custom: (value: string) => {
          if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
          if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
          if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
          return null;
        },
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      validation: {
        custom: (value: string) => {
          // This would need access to the form data to compare
          return null; // We'll handle this in the form submission
        },
      },
    },
  ];

  const verificationFields: FormField[] = [
    {
      name: 'verificationCode',
      label: 'Verification Code',
      type: 'text',
      placeholder: 'Enter 6-digit code',
      required: true,
      validation: {
        pattern: /^\d{6}$/,
      },
    },
  ];

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleRegistration = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store form data and move to verification
      setFormData({ ...data, role: selectedRole });
      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any 6-digit code
      if (data.verificationCode.length !== 6) {
        throw new Error('Invalid verification code');
      }

      // Create new user
      const newUser = {
        id: generateId(),
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        name: formData.name,
        verified: true,
        createdAt: new Date(),
      };

      setUser(newUser);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">
          Choose your role to get started
        </p>
      </div>

      <div className="grid gap-3">
        {roleOptions.map((role) => (
          <button
            key={role.value}
            onClick={() => handleRoleSelection(role.value as UserRole)}
            className="p-3 border-2 border-border rounded-md text-left hover:bg-accent hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <div className="flex items-center space-x-3">
              <div className="text-xl">{role.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{role.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <span className="text-sm text-muted-foreground">Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-primary hover:underline font-medium"
        >
          Sign in
        </button>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">
          Creating account as: <span className="font-medium text-foreground capitalize">{selectedRole?.replace('_', ' ')}</span>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <FormWidget
        fields={registrationFields}
        onSubmit={handleRegistration}
        loading={loading}
      />

      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('role')}
          className="text-sm"
        >
          ← Change role
        </Button>
      </div>
    </div>
  );

  const renderVerificationForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-muted-foreground">
          Verification code sent to {formData?.phone}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <FormWidget
        fields={verificationFields}
        onSubmit={handleVerification}
        loading={loading}
      />

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('details')}
          className="text-sm"
        >
          ← Back
        </Button>
        
        <Button variant="ghost" size="sm" className="text-sm">
          Resend code
        </Button>
      </div>

      {/* Demo note */}
      <div className="p-3 bg-secondary/50 rounded-md border border-border">
        <p className="text-xs text-muted-foreground text-center">
          Demo: Enter any 6-digit code (e.g., 123456)
        </p>
      </div>
    </div>
  );

  switch (step) {
    case 'role':
      return renderRoleSelection();
    case 'details':
      return renderRegistrationForm();
    case 'verification':
      return renderVerificationForm();
    default:
      return renderRoleSelection();
  }
};

export default RegisterForm;