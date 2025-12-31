'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { cn } from '@/lib/utils';
import { LayoutProps } from '@/types';
import SlidePanel from './SlidePanel';
import Navigation from './Navigation';
import Header from './Header';
import RoleSwitcher from '../auth/RoleSwitcher';

const Layout: React.FC<LayoutProps> = ({ children, userRole, theme }) => {
  const { sidebarOpen, setSidebarOpen, user } = useApp();
  
  // Use the user role from context if not provided as prop
  const currentUserRole = userRole || user?.role;

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
        <aside
          className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:bottom-0 lg:border-r-2 lg:border-border lg:bg-card overflow-y-auto"
          style={{ top: 'var(--header-height, 4.75rem)' }}
        >
          <div className="pt-6">
            <Navigation userRole={currentUserRole} />
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn('flex-1 min-h-screen', 'lg:ml-64')}
          style={{ paddingTop: 'calc(var(--header-height, 4.75rem) + 2rem)' }}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Demo Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};

export default Layout;