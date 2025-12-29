'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationItem, UserRole } from '@/types';
import { Badge } from '@/components/ui';
import {
  HomeIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  TruckIcon,
  BanknotesIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface NavigationProps {
  userRole?: UserRole;
  onItemClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ userRole, onItemClick }) => {
  const pathname = usePathname();

  // Define navigation items based on user roles
  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      roles: ['gc', 'subcontractor', 'supplier', 'bank', 'admin'],
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: BuildingOfficeIcon,
      badge: 3,
      roles: ['gc', 'subcontractor', 'admin'],
    },
    {
      label: 'Marketplace',
      href: '/marketplace',
      icon: BriefcaseIcon,
      badge: 12,
      roles: ['subcontractor', 'admin'],
    },
    {
      label: 'My Bids',
      href: '/bids',
      icon: BriefcaseIcon,
      roles: ['subcontractor', 'admin'],
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: BellIcon,
      badge: 3,
      roles: ['gc', 'subcontractor', 'supplier', 'bank', 'admin'],
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: TruckIcon,
      badge: 5,
      roles: ['gc', 'supplier', 'admin'],
    },
    {
      label: 'Inventory',
      href: '/inventory',
      icon: TruckIcon,
      roles: ['supplier', 'admin'],
    },
    {
      label: 'Loan Applications',
      href: '/loans',
      icon: BanknotesIcon,
      badge: 2,
      roles: ['bank', 'admin'],
    },
    {
      label: 'Payments',
      href: '/payments',
      icon: BanknotesIcon,
      roles: ['gc', 'subcontractor', 'supplier', 'bank', 'admin'],
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: BellIcon,
      badge: 8,
      roles: ['gc', 'subcontractor', 'supplier', 'bank', 'admin'],
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: UserIcon,
      roles: ['gc', 'subcontractor', 'supplier', 'bank', 'admin'],
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      roles: ['gc', 'subcontractor', 'supplier', 'bank', 'admin'],
    },
  ];

  // Filter items based on user role
  const filteredItems = userRole
    ? navigationItems.filter(item => item.roles.includes(userRole))
    : navigationItems;

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className="p-4">
      <div className="space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleItemClick}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-secondary border border-transparent',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'bg-primary/10 text-primary hover:bg-primary/15 border-l-4 border-l-primary border-r-transparent border-t-transparent border-b-transparent shadow-sm font-semibold'
                  : 'text-foreground hover:border-border border-l-4 border-l-transparent'
              )}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge
                  variant={isActive ? 'default' : 'warning'}
                  className="ml-auto min-w-[20px] h-5 px-2 rounded-full text-xs font-bold flex items-center justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;