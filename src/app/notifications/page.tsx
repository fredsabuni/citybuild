'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { NotificationCenter, Notification } from '@/components/notifications';

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Bid Awarded',
    message: 'Congratulations! Your bid for Downtown Office Complex has been awarded. The project is scheduled to start next week.',
    type: 'success',
    priority: 'high',
    category: 'bid',
    isRead: false,
    createdAt: new Date('2024-12-18T10:30:00'),
    actionUrl: '/projects/proj-1',
    metadata: { projectId: 'proj-1', bidId: 'bid-1' },
  },
  {
    id: 'notif-2',
    title: 'New Project Available',
    message: 'A new project matching your specialization has been posted: Smart Home Electrical Installation. Bidding closes in 3 days.',
    type: 'info',
    priority: 'medium',
    category: 'project',
    isRead: false,
    createdAt: new Date('2024-12-18T09:15:00'),
    actionUrl: '/marketplace',
    metadata: { projectId: 'proj-4' },
  },
  {
    id: 'notif-3',
    title: 'Payment Processed',
    message: 'Payment of $125,000 for Residential Complex Phase 1 has been processed and will be deposited within 2 business days.',
    type: 'success',
    priority: 'medium',
    category: 'payment',
    isRead: true,
    createdAt: new Date('2024-12-17T16:45:00'),
    metadata: { amount: 125000, projectId: 'proj-2' },
  },
  {
    id: 'notif-4',
    title: 'Bid Deadline Approaching',
    message: 'Reminder: The bidding deadline for Commercial HVAC System Installation is tomorrow at 5:00 PM.',
    type: 'warning',
    priority: 'high',
    category: 'bid',
    isRead: false,
    createdAt: new Date('2024-12-17T14:20:00'),
    actionUrl: '/marketplace',
    metadata: { projectId: 'proj-5', deadline: '2024-12-19T17:00:00' },
  },
  {
    id: 'notif-5',
    title: 'Message from BuildCorp LLC',
    message: 'John Smith has sent you a message regarding the Downtown Office Complex project. Please review the updated specifications.',
    type: 'info',
    priority: 'medium',
    category: 'message',
    isRead: false,
    createdAt: new Date('2024-12-17T11:30:00'),
    actionUrl: '/messages',
    metadata: { senderId: 'user-gc-1', conversationId: 'conv-1' },
  },
  {
    id: 'notif-6',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST. The platform may be temporarily unavailable.',
    type: 'warning',
    priority: 'low',
    category: 'system',
    isRead: true,
    createdAt: new Date('2024-12-16T18:00:00'),
  },
  {
    id: 'notif-7',
    title: 'Profile Verification Required',
    message: 'Your contractor license is expiring soon. Please update your credentials to continue bidding on projects.',
    type: 'error',
    priority: 'urgent',
    category: 'system',
    isRead: false,
    createdAt: new Date('2024-12-16T12:15:00'),
    actionUrl: '/profile',
  },
  {
    id: 'notif-8',
    title: 'New Bid Received',
    message: 'AquaFlow Plumbing Solutions has submitted a bid for your Luxury Hotel Plumbing Infrastructure project.',
    type: 'info',
    priority: 'medium',
    category: 'bid',
    isRead: true,
    createdAt: new Date('2024-12-15T13:45:00'),
    actionUrl: '/projects/proj-6/bids',
    metadata: { projectId: 'proj-6', bidId: 'bid-new-1' },
  },
  {
    id: 'notif-9',
    title: 'Project Milestone Completed',
    message: 'The foundation work for Residential Complex Phase 1 has been completed and approved. Next phase can begin.',
    type: 'success',
    priority: 'medium',
    category: 'project',
    isRead: true,
    createdAt: new Date('2024-12-14T10:20:00'),
    metadata: { projectId: 'proj-2', milestone: 'foundation' },
  },
  {
    id: 'notif-10',
    title: 'Welcome to CityBuild',
    message: 'Welcome to the CityBuild platform! Complete your profile setup to start bidding on construction projects.',
    type: 'info',
    priority: 'low',
    category: 'system',
    isRead: true,
    createdAt: new Date('2024-12-10T08:00:00'),
    actionUrl: '/profile',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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

  const handleDelete = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      setNotifications([]);
    }
  };

  return (
    <Layout>
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
    </Layout>
  );
}