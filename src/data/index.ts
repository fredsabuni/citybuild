import { DataGenerator } from './dataGenerator';

// Mock data exports
export { mockUsers, getCurrentUser, getUserById, getUsersByRole } from './mockUsers';
export { mockProjects, getProjectsByGC, getProjectsForBidding, getProjectsByStatus, getRecentProjects } from './mockProjects';
export { mockBids, getBidsByProject, getBidsBySubcontractor, getBidsByStatus, getRecentBids } from './mockBids';
export { mockNotifications, getNotificationsByUser, getUnreadNotifications, getNotificationsByType, getRecentNotifications } from './mockNotifications';

// Data generation utilities
export { DataGenerator } from './dataGenerator';

// Mock API
export { MockApi } from './mockApi';

// LocalStorage utilities
export {
  LocalStorageManager,
  UserStorage,
  ProjectStorage,
  BidStorage,
  NotificationStorage,
  AppStorage,
  DataSeeder,
} from './localStorage';

// Development utilities
export const DevUtils = {
  // Generate test data
  generateTestData: (options?: Parameters<typeof DataGenerator.generateCompleteDataset>[0]) => {
    return DataGenerator.generateCompleteDataset(options);
  },

  // Reset to initial state
  resetToInitialData: async () => {
    const { DataSeeder } = await import('./localStorage');
    DataSeeder.clearAllData();
    await DataSeeder.seedInitialData();
  },

  // Clear all data
  clearAllData: async () => {
    const { DataSeeder } = await import('./localStorage');
    DataSeeder.clearAllData();
  },

  // Export current data
  exportData: () => {
    const { DataSeeder } = require('./localStorage');
    return DataSeeder.exportData();
  },

  // Import data
  importData: (jsonData: string) => {
    const { DataSeeder } = require('./localStorage');
    DataSeeder.importData(jsonData);
  },

  // Simulate API scenarios
  simulateApiError: (errorType: 'network' | 'auth' | 'validation' | 'server' = 'network') => {
    const errors = {
      network: new Error('Network connection failed'),
      auth: new Error('Authentication required'),
      validation: new Error('Validation failed'),
      server: new Error('Internal server error'),
    };
    throw errors[errorType];
  },

  // Performance testing
  measureApiCall: async <T>(apiCall: () => Promise<T>): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await apiCall();
    const duration = performance.now() - start;
    return { result, duration };
  },

  // Data validation
  validateDataIntegrity: async () => {
    const { UserStorage, ProjectStorage, BidStorage, NotificationStorage } = await import('./localStorage');
    
    const users = UserStorage.getUsers();
    const projects = ProjectStorage.getProjects();
    const bids = BidStorage.getBids();
    const notifications = NotificationStorage.getNotifications();

    const issues: string[] = [];

    // Check for orphaned projects
    projects.forEach(project => {
      if (!users.find(u => u.id === project.gcId)) {
        issues.push(`Project ${project.id} references non-existent GC ${project.gcId}`);
      }
    });

    // Check for orphaned bids
    bids.forEach(bid => {
      if (!projects.find(p => p.id === bid.projectId)) {
        issues.push(`Bid ${bid.id} references non-existent project ${bid.projectId}`);
      }
      if (!users.find(u => u.id === bid.subcontractorId)) {
        issues.push(`Bid ${bid.id} references non-existent subcontractor ${bid.subcontractorId}`);
      }
    });

    // Check for orphaned notifications
    notifications.forEach(notification => {
      if (!users.find(u => u.id === notification.userId)) {
        issues.push(`Notification ${notification.id} references non-existent user ${notification.userId}`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      stats: {
        users: users.length,
        projects: projects.length,
        bids: bids.length,
        notifications: notifications.length,
      },
    };
  },
};

// Development mode helpers (only available in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Expose utilities to window for debugging
  (window as any).CityBuildDevUtils = DevUtils;
  
  console.log('🏗️ CityBuild Development Utilities loaded');
  console.log('Access via window.CityBuildDevUtils in browser console');
  console.log('Available methods:', Object.keys(DevUtils));
}