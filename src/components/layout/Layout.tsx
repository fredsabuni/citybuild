'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/context';
import { setAuthModalCallback } from '@/lib/fetchWithAuth';
import { cn } from '@/lib/utils';
import { LayoutProps } from '@/types';
import SlidePanel from './SlidePanel';
import Navigation from './Navigation';
import Header from './Header';
import RoleSwitcher from '../auth/RoleSwitcher';
import { AuthModal } from '../auth';

const Layout: React.FC<LayoutProps> = ({ children, userRole, theme }) => {
  const { sidebarOpen, setSidebarOpen, user, showAuthModal, setShowAuthModal } = useApp();
  
  // Use the user role from context if not provided as prop
  const currentUserRole = userRole || user?.role;

  // Set up auth modal callback
  useEffect(() => {
    setAuthModalCallback(setShowAuthModal);
  }, [setShowAuthModal]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Mobile Navigation Slide Panel */}
      <SlidePanel
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        direction="left"
        width="md"
      >
        <Navigation
          userRole={currentUserRole}
          onItemClick={() => setSidebarOpen(false)}
        />
      </SlidePanel>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:border-r-2 lg:border-border lg:bg-card">
          <Navigation userRole={currentUserRole} />
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 min-h-screen',
            'lg:ml-64', // Offset for desktop sidebar
            'pt-16' // Offset for fixed header
          )}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Demo Role Switcher */}
      <RoleSwitcher />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default Layout;