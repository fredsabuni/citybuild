'use client';

import { useState } from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'bid' | 'project' | 'payment' | 'system' | 'message';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (notificationId: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadStatus = 
      filter === 'all' || 
      (filter === 'unread' && !notification.isRead) || 
      (filter === 'read' && notification.isRead);
    
    const matchesCategory = 
      categoryFilter === 'all' || notification.category === categoryFilter;
    
    const matchesPriority = 
      priorityFilter === 'all' || notification.priority === priorityFilter;
    
    return matchesReadStatus && matchesCategory && matchesPriority;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XMarkIcon className="w-5 h-5 text-red-600" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <div
      key={notification.id}
      className={`p-4 border rounded-lg transition-colors ${
        notification.isRead 
          ? 'bg-card border-border' 
          : 'bg-primary/5 border-primary border-2 shadow-sm'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Priority Indicator */}
        <div className={`w-1 h-full ${getPriorityColor(notification.priority)} rounded-full`} />
        
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span>{formatRelativeTime(notification.createdAt)}</span>
                <Badge variant="outline" className="text-xs">
                  {notification.category}
                </Badge>
                <Badge 
                  variant={notification.priority === 'urgent' ? 'warning' : 'secondary'} 
                  className="text-xs"
                >
                  {notification.priority}
                </Badge>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2">
              {!notification.isRead && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-8 w-8 p-0"
                >
                  <CheckIcon className="w-4 h-4" />
                </Button>
              )}
              
              {notification.actionUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <EyeIcon className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(notification.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BellIcon className="w-6 h-6 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Stay updated with project activities and important messages
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={onMarkAllAsRead}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline" onClick={onClearAll}>
            <TrashIcon className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary">{notifications.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
          <div className="text-sm text-muted-foreground">Unread</div>
        </div>
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {notifications.filter(n => n.priority === 'urgent').length}
          </div>
          <div className="text-sm text-muted-foreground">Urgent</div>
        </div>
        <div className="text-center p-4 bg-card border-2 border-border rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.type === 'success').length}
          </div>
          <div className="text-sm text-muted-foreground">Success</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filter by Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="bid">Bids</option>
            <option value="project">Projects</option>
            <option value="payment">Payments</option>
            <option value="system">System</option>
            <option value="message">Messages</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filter by Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {filteredNotifications.length === notifications.length 
              ? 'All Notifications' 
              : `${filteredNotifications.length} Filtered Notifications`
            }
          </h2>
          {filteredNotifications.length !== notifications.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilter('all');
                setCategoryFilter('all');
                setPriorityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map(renderNotificationCard)}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border-2 border-border rounded-lg">
            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
              <BellIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Notifications Found</h3>
            <p className="text-muted-foreground mb-4">
              {filter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filter criteria.'
                : 'You\'re all caught up! No notifications to display.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};