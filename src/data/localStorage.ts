import { User, Project, Bid, Notification } from '@/types';

// Keys for localStorage
const STORAGE_KEYS = {
  USERS: 'citybuild_users',
  PROJECTS: 'citybuild_projects',
  BIDS: 'citybuild_bids',
  NOTIFICATIONS: 'citybuild_notifications',
  CURRENT_USER: 'citybuild_current_user',
  AUTH_TOKEN: 'citybuild_auth_token',
  THEME: 'citybuild_theme',
  SIDEBAR_STATE: 'citybuild_sidebar_open',
} as const;

// Generic localStorage utilities
export class LocalStorageManager {
  private static isClient = typeof window !== 'undefined';

  static get<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      return JSON.parse(item, (key, value) => {
        // Parse dates
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    if (!this.isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  static clear(): void {
    if (!this.isClient) return;
    
    try {
      // Only clear CityBuild-related keys
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Check if data exists in localStorage
  static hasData(): boolean {
    if (!this.isClient) return false;
    
    return Object.values(STORAGE_KEYS).some(key => 
      localStorage.getItem(key) !== null
    );
  }
}

// Specific data managers
export class UserStorage {
  static getUsers(): User[] {
    return LocalStorageManager.get<User[]>(STORAGE_KEYS.USERS, []);
  }

  static setUsers(users: User[]): void {
    LocalStorageManager.set(STORAGE_KEYS.USERS, users);
  }

  static addUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    this.setUsers(users);
  }

  static getCurrentUser(): User | null {
    return LocalStorageManager.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: User | null): void {
    LocalStorageManager.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  static getAuthToken(): string | null {
    return LocalStorageManager.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
  }

  static setAuthToken(token: string | null): void {
    LocalStorageManager.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static logout(): void {
    this.setCurrentUser(null);
    this.setAuthToken(null);
  }
}

export class ProjectStorage {
  static getProjects(): Project[] {
    return LocalStorageManager.get<Project[]>(STORAGE_KEYS.PROJECTS, []);
  }

  static setProjects(projects: Project[]): void {
    LocalStorageManager.set(STORAGE_KEYS.PROJECTS, projects);
  }

  static addProject(project: Project): void {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    this.setProjects(projects);
  }

  static getProjectsByGC(gcId: string): Project[] {
    return this.getProjects().filter(project => project.gcId === gcId);
  }

  static getProjectsForBidding(): Project[] {
    return this.getProjects().filter(project => project.status === 'bidding');
  }
}

export class BidStorage {
  static getBids(): Bid[] {
    return LocalStorageManager.get<Bid[]>(STORAGE_KEYS.BIDS, []);
  }

  static setBids(bids: Bid[]): void {
    LocalStorageManager.set(STORAGE_KEYS.BIDS, bids);
  }

  static addBid(bid: Bid): void {
    const bids = this.getBids();
    const existingIndex = bids.findIndex(b => b.id === bid.id);
    
    if (existingIndex >= 0) {
      bids[existingIndex] = bid;
    } else {
      bids.push(bid);
    }
    
    this.setBids(bids);
  }

  static getBidsByProject(projectId: string): Bid[] {
    return this.getBids().filter(bid => bid.projectId === projectId);
  }

  static getBidsBySubcontractor(subcontractorId: string): Bid[] {
    return this.getBids().filter(bid => bid.subcontractorId === subcontractorId);
  }
}

export class NotificationStorage {
  static getNotifications(): Notification[] {
    return LocalStorageManager.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  static setNotifications(notifications: Notification[]): void {
    LocalStorageManager.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  static addNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification); // Add to beginning
    
    // Keep only the latest 100 notifications per user
    const userNotifications = notifications.filter(n => n.userId === notification.userId);
    if (userNotifications.length > 100) {
      const otherNotifications = notifications.filter(n => n.userId !== notification.userId);
      const trimmedUserNotifications = userNotifications.slice(0, 100);
      this.setNotifications([...trimmedUserNotifications, ...otherNotifications]);
    } else {
      this.setNotifications(notifications);
    }
  }

  static getNotificationsByUser(userId: string): Notification[] {
    return this.getNotifications().filter(notification => notification.userId === userId);
  }

  static markAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      this.setNotifications(notifications);
    }
  }

  static markAllAsRead(userId: string): void {
    const notifications = this.getNotifications();
    notifications.forEach(notification => {
      if (notification.userId === userId) {
        notification.read = true;
      }
    });
    this.setNotifications(notifications);
  }
}

// App state management
export class AppStorage {
  static getTheme(): 'light' | 'dark' {
    return LocalStorageManager.get<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
  }

  static setTheme(theme: 'light' | 'dark'): void {
    LocalStorageManager.set(STORAGE_KEYS.THEME, theme);
  }

  static getSidebarState(): boolean {
    return LocalStorageManager.get<boolean>(STORAGE_KEYS.SIDEBAR_STATE, false);
  }

  static setSidebarState(isOpen: boolean): void {
    LocalStorageManager.set(STORAGE_KEYS.SIDEBAR_STATE, isOpen);
  }
}

// Data initialization and seeding
export class DataSeeder {
  static async seedInitialData(): Promise<void> {
    // Only seed if no data exists
    if (LocalStorageManager.hasData()) {
      return;
    }

    try {
      // Import initial data
      const { mockUsers } = await import('./mockUsers');
      const { mockProjects } = await import('./mockProjects');
      const { mockBids } = await import('./mockBids');
      const { mockNotifications } = await import('./mockNotifications');

      // Seed data
      UserStorage.setUsers(mockUsers);
      ProjectStorage.setProjects(mockProjects);
      BidStorage.setBids(mockBids);
      NotificationStorage.setNotifications(mockNotifications);

      console.log('Initial data seeded to localStorage');
    } catch (error) {
      console.error('Error seeding initial data:', error);
    }
  }

  static clearAllData(): void {
    LocalStorageManager.clear();
    console.log('All CityBuild data cleared from localStorage');
  }

  static exportData(): string {
    const data = {
      users: UserStorage.getUsers(),
      projects: ProjectStorage.getProjects(),
      bids: BidStorage.getBids(),
      notifications: NotificationStorage.getNotifications(),
      currentUser: UserStorage.getCurrentUser(),
      theme: AppStorage.getTheme(),
      sidebarState: AppStorage.getSidebarState(),
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);

      if (data.users) UserStorage.setUsers(data.users);
      if (data.projects) ProjectStorage.setProjects(data.projects);
      if (data.bids) BidStorage.setBids(data.bids);
      if (data.notifications) NotificationStorage.setNotifications(data.notifications);
      if (data.currentUser) UserStorage.setCurrentUser(data.currentUser);
      if (data.theme) AppStorage.setTheme(data.theme);
      if (data.sidebarState !== undefined) AppStorage.setSidebarState(data.sidebarState);

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }
}