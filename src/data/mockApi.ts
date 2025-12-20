import { User, Project, Bid, Notification } from '@/types';
import { mockUsers } from './mockUsers';
import { mockProjects } from './mockProjects';
import { mockBids } from './mockBids';
import { mockNotifications } from './mockNotifications';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export class MockApi {
  // Authentication endpoints
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // In demo, any password works
    return {
      user,
      token: `mock-token-${user.id}-${Date.now()}`,
    };
  }

  static async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    await delay(1000);
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email!,
      phone: userData.phone,
      role: userData.role!,
      name: userData.name!,
      verified: false,
      createdAt: new Date(),
    };

    // In a real app, this would save to database
    mockUsers.push(newUser);

    return {
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
    };
  }

  static async verifyPhone(phone: string, code: string): Promise<{ success: boolean }> {
    await delay();
    
    // In demo, any 6-digit code works
    if (code.length === 6 && /^\d+$/.test(code)) {
      return { success: true };
    }
    
    throw new Error('Invalid verification code');
  }

  // User endpoints
  static async getUser(id: string): Promise<User> {
    await delay();
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await delay();
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  }

  // Project endpoints
  static async getProjects(filters?: {
    gcId?: string;
    status?: Project['status'];
    limit?: number;
  }): Promise<Project[]> {
    await delay();
    
    let projects = [...mockProjects];
    
    if (filters?.gcId) {
      projects = projects.filter(p => p.gcId === filters.gcId);
    }
    
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    
    if (filters?.limit) {
      projects = projects.slice(0, filters.limit);
    }
    
    return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async getProject(id: string): Promise<Project> {
    await delay();
    
    const project = mockProjects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  }

  static async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    await delay(1000);
    
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockProjects.push(newProject);
    return newProject;
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await delay();
    
    const projectIndex = mockProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    return mockProjects[projectIndex];
  }

  // Bid endpoints
  static async getBids(filters?: {
    projectId?: string;
    subcontractorId?: string;
    status?: Bid['status'];
    limit?: number;
  }): Promise<Bid[]> {
    await delay();
    
    let bids = [...mockBids];
    
    if (filters?.projectId) {
      bids = bids.filter(b => b.projectId === filters.projectId);
    }
    
    if (filters?.subcontractorId) {
      bids = bids.filter(b => b.subcontractorId === filters.subcontractorId);
    }
    
    if (filters?.status) {
      bids = bids.filter(b => b.status === filters.status);
    }
    
    if (filters?.limit) {
      bids = bids.slice(0, filters.limit);
    }
    
    return bids.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }

  static async getBid(id: string): Promise<Bid> {
    await delay();
    
    const bid = mockBids.find(b => b.id === id);
    if (!bid) {
      throw new Error('Bid not found');
    }
    
    return bid;
  }

  static async submitBid(bidData: Omit<Bid, 'id' | 'submittedAt'>): Promise<Bid> {
    await delay(1500);
    
    const newBid: Bid = {
      ...bidData,
      id: `bid-${Date.now()}`,
      submittedAt: new Date(),
    };
    
    mockBids.push(newBid);
    return newBid;
  }

  static async updateBid(id: string, updates: Partial<Bid>): Promise<Bid> {
    await delay();
    
    const bidIndex = mockBids.findIndex(b => b.id === id);
    if (bidIndex === -1) {
      throw new Error('Bid not found');
    }
    
    mockBids[bidIndex] = { ...mockBids[bidIndex], ...updates };
    return mockBids[bidIndex];
  }

  // Notification endpoints
  static async getNotifications(filters?: {
    userId?: string;
    read?: boolean;
    type?: Notification['type'];
    limit?: number;
  }): Promise<Notification[]> {
    await delay();
    
    let notifications = [...mockNotifications];
    
    if (filters?.userId) {
      notifications = notifications.filter(n => n.userId === filters.userId);
    }
    
    if (filters?.read !== undefined) {
      notifications = notifications.filter(n => n.read === filters.read);
    }
    
    if (filters?.type) {
      notifications = notifications.filter(n => n.type === filters.type);
    }
    
    if (filters?.limit) {
      notifications = notifications.slice(0, filters.limit);
    }
    
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  static async markNotificationAsRead(id: string): Promise<Notification> {
    await delay();
    
    const notificationIndex = mockNotifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      throw new Error('Notification not found');
    }
    
    mockNotifications[notificationIndex].read = true;
    return mockNotifications[notificationIndex];
  }

  static async markAllNotificationsAsRead(userId: string): Promise<{ count: number }> {
    await delay();
    
    let count = 0;
    mockNotifications.forEach(notification => {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        count++;
      }
    });
    
    return { count };
  }

  // File upload simulation
  static async uploadFile(file: File): Promise<{ id: string; url: string }> {
    await delay(2000); // Simulate longer upload time
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/dwg', 'application/dxf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF, DWG, and DXF files are allowed.');
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }
    
    return {
      id: `file-${Date.now()}`,
      url: `/mock/uploads/${file.name}`,
    };
  }

  // Dashboard data
  static async getDashboardData(userId: string, role: User['role']): Promise<any> {
    await delay();
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    switch (role) {
      case 'gc':
        const gcProjects = mockProjects.filter(p => p.gcId === userId);
        const totalBids = mockBids.filter(b => 
          gcProjects.some(p => p.id === b.projectId)
        );
        
        return {
          projects: gcProjects,
          totalProjects: gcProjects.length,
          activeProjects: gcProjects.filter(p => p.status === 'active').length,
          totalBids: totalBids.length,
          pendingBids: totalBids.filter(b => b.status === 'pending').length,
          recentActivity: totalBids.slice(0, 5),
        };
        
      case 'subcontractor':
        const subBids = mockBids.filter(b => b.subcontractorId === userId);
        const availableProjects = mockProjects.filter(p => p.status === 'bidding');
        
        return {
          bids: subBids,
          totalBids: subBids.length,
          awardedBids: subBids.filter(b => b.status === 'awarded').length,
          pendingBids: subBids.filter(b => b.status === 'pending').length,
          availableProjects: availableProjects.slice(0, 10),
          totalEarnings: subBids
            .filter(b => b.status === 'awarded')
            .reduce((sum, b) => sum + b.amount, 0),
        };
        
      case 'supplier':
        return {
          orders: [],
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalRevenue: 0,
        };
        
      case 'bank':
        return {
          loans: [],
          totalLoans: 0,
          activeLoans: 0,
          totalAmount: 0,
          pendingApprovals: 0,
        };
        
      default:
        return {};
    }
  }
}