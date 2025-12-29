'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { useApp } from '@/lib/context';
import { useToast } from '@/lib/notificationContext';
import { api } from '@/lib/api';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const { setUser } = useApp();
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Login and get tokens
      const loginResponse = await api.login(email, password);
      
      console.log('Login successful, tokens stored');
      
      // Fetch user details from the API
      const userData = await api.getCurrentUser();
      console.log('User data:', userData);
      
      // Map organization_type to role (lowercase for consistency)
      const userRole = userData.organization_type?.toLowerCase() || 'gc';
      
      // Set user data in context
      setUser({
        id: userData.id,
        name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        role: userRole,
        authenticated: true,
        organizationId: userData.organization_id,
        organizationName: userData.organization_name,
        isActive: userData.is_active,
        isVerified: userData.is_verified,
      });
      
      // Show success message
      toast.success('Login Successful', `Welcome back, ${userData.first_name || userData.full_name}!`);
      
      // Navigate to dashboard
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Login failed';
      console.log('Error message:', errorMessage);
      toast.error('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <button type="button" className="text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {onSwitchToRegister && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;