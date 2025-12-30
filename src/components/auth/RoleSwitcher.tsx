'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { Button } from '@/components/ui';
import { mockUsers } from '@/data/mockUsers';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import {
  UserGroupIcon,
  XMarkIcon,
  EyeSlashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const RoleSwitcher: React.FC = () => {
  const { user, setUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isOpen && !target.closest('[data-role-switcher]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const switchToRole = (role: UserRole) => {
    const mockUser = mockUsers.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
    }
    setIsOpen(false);
  };

  const signOut = () => {
    setUser(null);
    setIsOpen(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsOpen(false);
  };

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      gc: '🏗️',
      subcontractor: '🔨',
      supplier: '🚛',
      bank: '🏦',
    };
    return icons[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      gc: 'General Contractor',
      subcontractor: 'Subcontractor',
      supplier: 'Supplier',
      bank: 'Bank',
    };
    return labels[role];
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={toggleVisibility}
          className="w-12 h-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent"
          title="Show Demo Controls"
        >
          <EyeSlashIcon className="w-5 h-5 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50" data-role-switcher>
      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-xl p-4 min-w-[240px] animate-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-foreground">Demo Controls</div>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleVisibility}
                className="w-6 h-6 opacity-60 hover:opacity-100"
                title="Hide Demo Controls"
              >
                <EyeSlashIcon className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Current User */}
            {user && (
              <div className="mb-3 p-2 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground">Current User:</div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm">{user.role && getRoleIcon(user.role)}</span>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              </div>
            )}
            
            {/* Role Buttons */}
            <div className="space-y-1 mb-3">
              <div className="text-xs text-muted-foreground mb-2">Switch Role:</div>
              {(['gc', 'subcontractor', 'supplier', 'bank'] as UserRole[]).map((role) => (
                <Button
                  key={role}
                  size="sm"
                  variant={user?.role === role ? 'default' : 'ghost'}
                  onClick={() => switchToRole(role)}
                  className="w-full justify-start text-xs h-8"
                >
                  <span className="mr-2">{getRoleIcon(role)}</span>
                  {getRoleLabel(role)}
                </Button>
              ))}
            </div>
            
            {/* Actions */}
            <div className="border-t border-border pt-3 space-y-1">
              {user && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={signOut}
                  className="w-full justify-start text-xs h-8 text-muted-foreground"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        size="icon"
        variant="default"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg transition-all duration-200",
          "bg-primary hover:bg-primary/90 hover:scale-105",
          isOpen && "rotate-45"
        )}
        title="Demo Role Switcher"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <UserGroupIcon className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default RoleSwitcher;