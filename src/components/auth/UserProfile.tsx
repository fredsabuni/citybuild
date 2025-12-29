'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { Button, Badge } from '@/components/ui';
import { CardWidget } from '@/components/widgets';
import { api } from '@/lib/api';
import { useToast } from '@/lib/notificationContext';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckBadgeIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  onEditProfile?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onEditProfile }) => {
  const { user, setUser } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const toast = useToast();

  if (!user) {
    return (
      <div className="text-center py-12">
        <UserCircleIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Not Signed In</h3>
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // 1. Call logout API
      await api.logout();
      
      // 2. Preserve theme before clearing localStorage
      let savedTheme = null;
      if (typeof window !== 'undefined') {
        savedTheme = localStorage.getItem('theme');
        localStorage.clear();
        // Restore theme after clearing
        if (savedTheme) {
          localStorage.setItem('theme', savedTheme);
        }
      }
      
      // 3. Clear user context
      setUser(null);
      
      // Show success message
      toast.success('Logged Out', 'You have been successfully logged out.');
      
      // 4. Redirect to index page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still logout locally
      let savedTheme = null;
      if (typeof window !== 'undefined') {
        savedTheme = localStorage.getItem('theme');
        localStorage.clear();
        // Restore theme after clearing
        if (savedTheme) {
          localStorage.setItem('theme', savedTheme);
        }
      }
      setUser(null);
      router.push('/');
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const getRoleDisplayName = (role?: string) => {
    if (!role) return 'User';
    const roleNames = {
      gc: 'General Contractor',
      subcontractor: 'Subcontractor',
      supplier: 'Supplier',
      bank: 'Bank',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleIcon = (role?: string) => {
    if (!role) return '👤';
    const roleIcons = {
      gc: '🏗️',
      subcontractor: '🔨',
      supplier: '🚛',
      bank: '🏦',
    };
    return roleIcons[role as keyof typeof roleIcons] || '👤';
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <CardWidget
        title="Profile Information"
        content={
          <div className="space-y-4">
            {/* Avatar and Name */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">{getRoleIcon(user.role)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.name || 'User'}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                  {(user.verified || user.isVerified) && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckBadgeIcon className="w-4 h-4" />
                      <span className="text-xs">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}

              {user.organizationName && (
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{user.organizationName}</span>
                </div>
              )}
              
              {user.createdAt && (
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        }
        actions={
          onEditProfile && (
            <Button
              size="sm"
              variant="outline"
              onClick={onEditProfile}
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )
        }
      />

      {/* Account Statistics */}
      <CardWidget
        title="Account Statistics"
        content={
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {user.role === 'gc' ? '5' : user.role === 'subcontractor' ? '12' : '8'}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.role === 'gc' ? 'Active Projects' : 
                 user.role === 'subcontractor' ? 'Bids Submitted' : 
                 user.role === 'supplier' ? 'Orders Fulfilled' : 'Loans Processed'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {user.role === 'gc' ? '98%' : user.role === 'subcontractor' ? '85%' : '95%'}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.role === 'gc' ? 'Success Rate' : 
                 user.role === 'subcontractor' ? 'Win Rate' : 
                 user.role === 'supplier' ? 'On-Time Delivery' : 'Approval Rate'}
              </div>
            </div>
          </div>
        }
      />

      {/* Account Actions */}
      <CardWidget
        title="Account Actions"
        content={
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile Information
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <CheckBadgeIcon className="w-4 h-4 mr-2" />
              Verification Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Notification Preferences
            </Button>
          </div>
        }
      />

      {/* Logout Section */}
      <CardWidget
        title="Account Management"
        content={
          <div className="space-y-4">
            {!showLogoutConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full"
                disabled={loggingOut}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to sign out?
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex-1"
                    disabled={loggingOut}
                  >
                    {loggingOut ? 'Signing Out...' : 'Yes, Sign Out'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1"
                    disabled={loggingOut}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
};

export default UserProfile;