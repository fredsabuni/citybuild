import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  // Recent notifications for GC
  {
    id: 'notif-1',
    title: 'New Bid Received',
    message: 'Mike Plumber submitted a bid of $125,000 for Downtown Office Complex plumbing work.',
    type: 'info',
    read: false,
    createdAt: new Date('2024-12-18T10:30:00'),
    userId: 'gc-1',
  },
  {
    id: 'notif-2',
    title: 'Bid Awarded',
    message: 'You successfully awarded the electrical contract for Smart Home project to Sarah Electrician.',
    type: 'success',
    read: false,
    createdAt: new Date('2024-12-18T09:15:00'),
    userId: 'gc-1',
  },
  {
    id: 'notif-3',
    title: 'Project File Updated',
    message: 'New electrical schematics have been uploaded to the Warehouse Renovation project.',
    type: 'info',
    read: true,
    createdAt: new Date('2024-12-17T16:45:00'),
    userId: 'gc-1',
  },
  {
    id: 'notif-4',
    title: 'Payment Approved',
    message: 'First Construction Bank approved the loan draw for Residential Complex Phase 1.',
    type: 'success',
    read: true,
    createdAt: new Date('2024-12-17T14:20:00'),
    userId: 'gc-1',
  },

  // Notifications for Subcontractors
  {
    id: 'notif-5',
    title: 'Bid Status Update',
    message: 'Your bid for Downtown Office Complex has been awarded! Contract details will be sent shortly.',
    type: 'success',
    read: false,
    createdAt: new Date('2024-12-18T11:00:00'),
    userId: 'sub-1',
  },
  {
    id: 'notif-6',
    title: 'New Project Available',
    message: 'A new plumbing project matching your specialization is now available for bidding.',
    type: 'info',
    read: false,
    createdAt: new Date('2024-12-18T08:30:00'),
    userId: 'sub-1',
  },
  {
    id: 'notif-7',
    title: 'Bid Rejected',
    message: 'Unfortunately, your bid for Warehouse Renovation was not selected. Thank you for your submission.',
    type: 'warning',
    read: true,
    createdAt: new Date('2024-12-17T13:15:00'),
    userId: 'sub-2',
  },
  {
    id: 'notif-8',
    title: 'Payment Received',
    message: 'Payment of $47,500 has been processed for completed work on Residential Complex Phase 1.',
    type: 'success',
    read: true,
    createdAt: new Date('2024-12-16T15:30:00'),
    userId: 'sub-1',
  },

  // Notifications for Suppliers
  {
    id: 'notif-9',
    title: 'New Material Order',
    message: 'Order #12345 for electrical supplies has been placed for Downtown Office Complex project.',
    type: 'info',
    read: false,
    createdAt: new Date('2024-12-18T12:15:00'),
    userId: 'sup-1',
  },
  {
    id: 'notif-10',
    title: 'Delivery Scheduled',
    message: 'Your material delivery for Residential Complex is scheduled for December 20th, 2024.',
    type: 'info',
    read: true,
    createdAt: new Date('2024-12-17T10:45:00'),
    userId: 'sup-1',
  },
  {
    id: 'notif-11',
    title: 'Invoice Approved',
    message: 'Invoice #INV-2024-456 for $15,750 has been approved and payment is being processed.',
    type: 'success',
    read: true,
    createdAt: new Date('2024-12-16T14:20:00'),
    userId: 'sup-1',
  },

  // Notifications for Banks
  {
    id: 'notif-12',
    title: 'Loan Draw Request',
    message: 'New loan draw request of $250,000 submitted for Downtown Office Complex project review.',
    type: 'info',
    read: false,
    createdAt: new Date('2024-12-18T13:45:00'),
    userId: 'bank-1',
  },
  {
    id: 'notif-13',
    title: 'Payment Authorization Required',
    message: 'Payment of $95,000 to Mike Plumber requires your authorization for Residential Complex project.',
    type: 'warning',
    read: false,
    createdAt: new Date('2024-12-18T11:30:00'),
    userId: 'bank-1',
  },
  {
    id: 'notif-14',
    title: 'Loan Approved',
    message: 'Construction loan for $2.5M has been approved for Downtown Office Complex project.',
    type: 'success',
    read: true,
    createdAt: new Date('2024-12-17T09:00:00'),
    userId: 'bank-1',
  },

  // System notifications
  {
    id: 'notif-15',
    title: 'Welcome to CityBuild',
    message: 'Welcome to the CityBuild platform! Complete your profile setup to start bidding on construction projects.',
    type: 'info',
    read: true,
    createdAt: new Date('2024-12-15T08:00:00'),
    userId: 'sub-2',
  },
];

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getUnreadNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => 
    notification.userId === userId && !notification.read
  );
};

export const getNotificationsByType = (userId: string, type: Notification['type']): Notification[] => {
  return mockNotifications.filter(notification => 
    notification.userId === userId && notification.type === type
  );
};

export const getRecentNotifications = (userId: string, limit: number = 10): Notification[] => {
  return mockNotifications
    .filter(notification => notification.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};