'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import { Notification } from './NotificationCenter';
import {
  BellIcon,
  CheckIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-600`} />;
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-600`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-blue-600`} />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-secondary border border-transparent hover:border-border transition-all"
      >
        <BellIcon className="w-5 h-5" />
        {unreadNotifications.length > 0 && (
          <Badge 
            variant="default" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px] bg-primary text-primary-foreground"
          >
            {unreadNotifications.length > 99 ? '99+' : unreadNotifications.length}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border-2 border-border rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b-2 border-border bg-secondary">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadNotifications.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    onMarkAllAsRead();
                    setIsOpen(false);
                  }}
                  className="text-xs"
                >
                  <CheckIcon className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            {unreadNotifications.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-border">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-secondary cursor-pointer transition-colors border-l-4 ${
                      !notification.isRead ? 'bg-primary/5 border-l-primary' : 'border-l-transparent'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium line-clamp-1 ${
                              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatRelativeTime(notification.createdAt)}
                            </p>
                          </div>
                          
                          {/* Unread Indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-2 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <BellIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t-2 border-border bg-secondary">
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View all notifications
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};