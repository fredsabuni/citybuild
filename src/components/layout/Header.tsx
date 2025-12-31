'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp, useTheme } from '@/lib/context';
import { Button, CityBuildLogo } from '@/components/ui';

import { NotificationBell, Notification } from '@/components/notifications';
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { toggleSidebar, user } = useApp();
  const { theme, toggleTheme } = useTheme();


  // Mock notifications for demo
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'Bid Awarded',
      message: 'Your bid for Downtown Office Complex has been awarded!',
      type: 'success',
      priority: 'high',
      category: 'bid',
      isRead: false,
      createdAt: new Date('2024-12-18T10:30:00'),
    },
    {
      id: 'notif-2',
      title: 'New Project Available',
      message: 'Smart Home Electrical Installation is now accepting bids.',
      type: 'info',
      priority: 'medium',
      category: 'project',
      isRead: false,
      createdAt: new Date('2024-12-18T09:15:00'),
    },
    {
      id: 'notif-3',
      title: 'Payment Processed',
      message: 'Payment of $125,000 has been processed.',
      type: 'success',
      priority: 'medium',
      category: 'payment',
      isRead: true,
      createdAt: new Date('2024-12-17T16:45:00'),
    },
  ]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Track header height and expose as CSS variable for layout spacing
  const headerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const updateHeaderHeightVar = () => {
      const h = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    };

    updateHeaderHeightVar();
    window.addEventListener('resize', updateHeaderHeightVar);
    return () => window.removeEventListener('resize', updateHeaderHeightVar);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-30 bg-card border-b-2 border-border shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <CityBuildLogo size="md" showText={true} />
          </Link>
        </div>

        {/* Center - Search (Desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search projects, contractors..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          {user && (
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </Button>

          {/* User menu */}
          {user && (
            <Link href="/profile" className="flex items-center space-x-2 hover:bg-accent rounded-lg p-2 transition-colors">
              <Button variant="ghost" size="icon" aria-label="User menu">
                <UserCircleIcon className="w-5 h-5" />
              </Button>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
              </div>
            </Link>
          )}
        </div>
      </div>


    </header>
  );
};

export default Header;