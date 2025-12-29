'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useApp } from '@/lib/context';
import { useToast } from '@/lib/notificationContext';
import { api } from '@/lib/api';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

// Organization type mapping
const ORGANIZATION_TYPES = [
  { label: 'General Contractor', value: 'gc' },
  { label: 'Subcontractor', value: 'subcontractor' },
  { label: 'Supplier', value: 'supplier' },
  { label: 'Bank', value: 'bank' },
  { label: 'Admin', value: 'admin' },
];

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Organization, 2 = User
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>('');
  
  // Step 1: Organization data
  const [orgData, setOrgData] = useState({
    name: '',
    type: 'gc',
    registration_number: '',
    country: 'US',
    address: '',
    phone: '',
    email: '',
    website: '',
  });
  
  // Step 2: User data
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  
  const { setUser } = useApp();
  const toast = useToast();
  const router = useRouter();

  // Password validation function
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit';
    }
    return null;
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOrgData({
      ...orgData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    
    // Validate password on change
    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error || '');
    }
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast.success('Step 1 Complete', 'Now create your user account.');
    setStep(2);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate password
    const passwordValidationError = validatePassword(userData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error('Invalid Password', passwordValidationError);
      return;
    }
    
    // Validate password confirmation
    if (userData.password !== userData.confirmPassword) {
      toast.error('Password Mismatch', 'Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      // Prepare complete registration data
      const registrationData = {
        organization_name: orgData.name,
        organization_type: orgData.type.toUpperCase(),
        registration_number: orgData.registration_number,
        country: orgData.country,
        address: orgData.address,
        organization_phone: orgData.phone,
        organization_email: orgData.email,
        website: orgData.website || undefined,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        confirm_password: userData.confirmPassword,
      };
      
      // Submit complete registration
      const response = await api.registerComplete(registrationData);
      
      // Set user in context with data from response
      if (response.user) {
        setUser({
          id: response.user.id,
          name: response.user.full_name,
          email: response.user.email,
          role: response.user.role,
          authenticated: true,
          organizationId: response.user.organization_id,
          organizationName: response.user.organization_name,
          phone: userData.phone,
          isActive: response.user.is_active,
          isVerified: response.user.is_verified,
        });
      }
      
      // Show success message
      toast.success(
        'Registration Successful', 
        `Welcome to CityBuild, ${userData.first_name}!`
      );
      
      // Navigate to dashboard (user is already logged in)
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Determine error message
      let errorMessage = 'Registration failed';
      
      if (err.response) {
        errorMessage = err.response?.data?.detail 
          || err.response?.data?.message 
          || JSON.stringify(err.response?.data)
          || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your internet connection or API server.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      toast.error('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 1 ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'
          }`}>
            {step === 1 ? '1' : '✓'}
          </div>
          <span className="ml-2 text-sm font-medium">Organization</span>
        </div>
        <div className="w-12 h-0.5 bg-border"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">User Account</span>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleOrganizationSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Organization Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={orgData.name}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Premier Construction Group"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              Organization Type
            </label>
            <select
              id="type"
              name="type"
              value={orgData.type}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              {ORGANIZATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="registration_number" className="block text-sm font-medium mb-2">
              Registration Number
            </label>
            <input
              id="registration_number"
              name="registration_number"
              type="text"
              value={orgData.registration_number}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="GC001234"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={orgData.country}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="US">United States</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={orgData.address}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="789 Construction Ave, Builder City, TX 75001"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Organization Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={orgData.phone}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+1-214-555-0100"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Organization Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={orgData.email}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="info@premierconstruction.com"
              required
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-2">
              Website <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={orgData.website}
              onChange={handleOrgChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://premierconstruction.com"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Creating organization...' : 'Continue to User Account'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-2">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={userData.first_name}
              onChange={handleUserChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John"
              required
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-2">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={userData.last_name}
              onChange={handleUserChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="user_email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="user_email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleUserChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="user_phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              id="user_phone"
              name="phone"
              type="tel"
              value={userData.phone}
              onChange={handleUserChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+1-555-0199"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleUserChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                passwordError ? 'border-red-500' : 'border-border'
              } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter a secure password"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
            <p className="text-muted-foreground text-xs mt-1">
              Must contain uppercase, lowercase, digit, and be at least 8 characters
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={userData.confirmPassword}
              onChange={handleUserChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Complete Registration'}
            </Button>
          </div>
        </form>
      )}

      {onSwitchToLogin && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
