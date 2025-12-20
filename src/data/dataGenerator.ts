import { User, Project, Bid, Notification, UserRole } from '@/types';

// Utility functions for generating realistic mock data
export class DataGenerator {
  private static projectNames = [
    'Downtown Office Complex',
    'Residential Complex Phase 1',
    'Warehouse Renovation',
    'Smart Home Electrical Installation',
    'Commercial HVAC System Installation',
    'Luxury Hotel Plumbing Infrastructure',
    'Shopping Mall Renovation',
    'Hospital Wing Construction',
    'School District Modernization',
    'Industrial Park Development',
    'Mixed-Use Development',
    'Senior Living Community',
    'Data Center Construction',
    'Restaurant Chain Buildout',
    'Retail Store Renovation',
  ];

  private static companyNames = [
    'Elite Construction',
    'Premier Builders',
    'Skyline Development',
    'Urban Construction Co.',
    'Metropolitan Builders',
    'Pinnacle Construction',
    'Apex Building Group',
    'Summit Contractors',
    'Horizon Construction',
    'Vertex Builders',
  ];

  private static tradeNames = {
    plumbing: ['Plumbing', 'Pipe Works', 'Water Systems', 'Drain Masters', 'Flow Solutions'],
    electrical: ['Electrical', 'Power Systems', 'Wiring Solutions', 'Current Contractors', 'Volt Masters'],
    hvac: ['HVAC', 'Climate Control', 'Air Systems', 'Comfort Solutions', 'Temperature Masters'],
    concrete: ['Concrete', 'Foundation Works', 'Solid Solutions', 'Pour Masters', 'Stone Works'],
    roofing: ['Roofing', 'Top Solutions', 'Cover Masters', 'Peak Contractors', 'Shield Systems'],
    flooring: ['Flooring', 'Surface Solutions', 'Ground Masters', 'Level Contractors', 'Base Systems'],
  };

  private static supplierNames = [
    'BuildMart Supply Co.',
    'Construction Supply Depot',
    'Premium Building Materials',
    'Industrial Supply Solutions',
    'Trade Materials Inc.',
    'Professional Building Supply',
    'Commercial Construction Materials',
    'Quality Building Products',
  ];

  private static bankNames = [
    'First Construction Bank',
    'Builders Commercial Bank',
    'Development Finance Corp',
    'Construction Capital Bank',
    'Trade Finance Solutions',
    'Building Industry Bank',
  ];

  static generateUser(role: UserRole, index: number = 1): User {
    const id = `${role}-${index}`;
    let name: string;
    let email: string;

    switch (role) {
      case 'gc':
        name = this.getRandomItem(this.companyNames);
        email = `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`;
        break;
      case 'subcontractor':
        const trade = this.getRandomItem(Object.keys(this.tradeNames));
        const tradeName = this.getRandomItem(this.tradeNames[trade as keyof typeof this.tradeNames]);
        name = `${tradeName} ${this.getRandomItem(['Inc.', 'LLC', 'Co.', 'Solutions', 'Services'])}`;
        email = `info@${tradeName.toLowerCase().replace(/\s+/g, '')}.com`;
        break;
      case 'supplier':
        name = this.getRandomItem(this.supplierNames);
        email = `orders@${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`;
        break;
      case 'bank':
        name = this.getRandomItem(this.bankNames);
        email = `commercial@${name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`;
        break;
    }

    return {
      id,
      email,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      role,
      name,
      verified: Math.random() > 0.1, // 90% verified
      createdAt: this.getRandomDate(new Date('2024-01-01'), new Date()),
    };
  }

  static generateProject(gcId: string, index: number = 1): Project {
    const id = `proj-${index}`;
    const name = this.getRandomItem(this.projectNames);
    const descriptions = [
      'Modern construction project with sustainable materials and energy-efficient systems',
      'Comprehensive renovation including structural improvements and modern amenities',
      'New construction featuring advanced technology integration and smart building systems',
      'Renovation project focusing on accessibility improvements and code compliance',
      'Commercial development with mixed-use spaces and community amenities',
    ];

    const statuses: Project['status'][] = ['draft', 'active', 'bidding', 'awarded', 'completed'];
    const status = this.getRandomItem(statuses);

    return {
      id,
      name,
      description: this.getRandomItem(descriptions),
      gcId,
      status,
      planFiles: this.generatePlanFiles(),
      estimatedCost: Math.floor(Math.random() * 5000000) + 100000, // $100k - $5M
      timeline: this.getRandomTimeline(),
      createdAt: this.getRandomDate(new Date('2024-01-01'), new Date()),
      updatedAt: this.getRandomDate(new Date('2024-01-01'), new Date()),
    };
  }

  static generateBid(projectId: string, subcontractorId: string, index: number = 1): Bid {
    const id = `bid-${index}`;
    const baseAmount = Math.floor(Math.random() * 500000) + 10000; // $10k - $500k
    const statuses: Bid['status'][] = ['pending', 'awarded', 'rejected'];
    const status = this.getRandomItem(statuses);

    const descriptions = [
      'Comprehensive installation including all materials, labor, and warranty coverage',
      'Professional service with premium materials and extended warranty options',
      'Complete system installation with energy-efficient components and smart controls',
      'Full-service solution including design, installation, and ongoing maintenance',
      'Expert installation with code compliance and quality assurance guarantees',
    ];

    return {
      id,
      projectId,
      subcontractorId,
      amount: baseAmount,
      timeline: this.getRandomTimeline(),
      description: this.getRandomItem(descriptions),
      status,
      submittedAt: this.getRandomDate(new Date('2024-11-01'), new Date()),
    };
  }

  static generateNotification(userId: string, index: number = 1): Notification {
    const id = `notif-${index}`;
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error'];
    const type = this.getRandomItem(types);

    const notifications = {
      info: [
        { title: 'New Project Available', message: 'A new project matching your specialization is now available for bidding.' },
        { title: 'File Updated', message: 'New project files have been uploaded and are ready for review.' },
        { title: 'System Maintenance', message: 'Scheduled maintenance will occur tonight from 2-4 AM EST.' },
      ],
      success: [
        { title: 'Bid Awarded', message: 'Congratulations! Your bid has been selected for the project.' },
        { title: 'Payment Processed', message: 'Your payment has been successfully processed and deposited.' },
        { title: 'Project Completed', message: 'Project has been marked as completed. Thank you for your work!' },
      ],
      warning: [
        { title: 'Bid Deadline Approaching', message: 'The bidding deadline for this project is in 24 hours.' },
        { title: 'Document Required', message: 'Additional documentation is required to complete your application.' },
        { title: 'Payment Pending', message: 'Your payment is pending approval and will be processed soon.' },
      ],
      error: [
        { title: 'Upload Failed', message: 'File upload failed. Please try again or contact support.' },
        { title: 'Connection Error', message: 'Unable to connect to server. Please check your internet connection.' },
        { title: 'Validation Error', message: 'There was an error validating your submission. Please review and resubmit.' },
      ],
    };

    const notification = this.getRandomItem(notifications[type]);

    return {
      id,
      title: notification.title,
      message: notification.message,
      type,
      read: Math.random() > 0.3, // 70% read
      createdAt: this.getRandomDate(new Date('2024-12-01'), new Date()),
      userId,
    };
  }

  private static generatePlanFiles() {
    const fileTypes = [
      { name: 'floor-plans.pdf', type: 'application/pdf' },
      { name: 'electrical-layout.dwg', type: 'application/dwg' },
      { name: 'site-plan.pdf', type: 'application/pdf' },
      { name: 'structural-drawings.dwg', type: 'application/dwg' },
      { name: 'specifications.pdf', type: 'application/pdf' },
    ];

    const numFiles = Math.floor(Math.random() * 3) + 1; // 1-3 files
    const selectedFiles = this.shuffleArray(fileTypes).slice(0, numFiles);

    return selectedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: Math.floor(Math.random() * 5000000) + 500000, // 500KB - 5MB
      url: `/mock/${file.name}`,
      uploadedAt: this.getRandomDate(new Date('2024-11-01'), new Date()),
    }));
  }

  private static getRandomTimeline(): string {
    const timeframes = [
      '2 weeks', '3 weeks', '4 weeks', '6 weeks', '8 weeks',
      '2 months', '3 months', '4 months', '6 months', '8 months',
      '10 months', '12 months', '14 months', '16 months', '18 months'
    ];
    return this.getRandomItem(timeframes);
  }

  private static getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Generate complete datasets
  static generateCompleteDataset(options: {
    numGCs?: number;
    numSubcontractors?: number;
    numSuppliers?: number;
    numBanks?: number;
    projectsPerGC?: number;
    bidsPerProject?: number;
    notificationsPerUser?: number;
  } = {}) {
    const {
      numGCs = 3,
      numSubcontractors = 8,
      numSuppliers = 3,
      numBanks = 2,
      projectsPerGC = 3,
      bidsPerProject = 3,
      notificationsPerUser = 5,
    } = options;

    // Generate users
    const gcs = Array.from({ length: numGCs }, (_, i) => this.generateUser('gc', i + 1));
    const subcontractors = Array.from({ length: numSubcontractors }, (_, i) => this.generateUser('subcontractor', i + 1));
    const suppliers = Array.from({ length: numSuppliers }, (_, i) => this.generateUser('supplier', i + 1));
    const banks = Array.from({ length: numBanks }, (_, i) => this.generateUser('bank', i + 1));

    const users = [...gcs, ...subcontractors, ...suppliers, ...banks];

    // Generate projects
    const projects: Project[] = [];
    let projectIndex = 1;
    gcs.forEach(gc => {
      for (let i = 0; i < projectsPerGC; i++) {
        projects.push(this.generateProject(gc.id, projectIndex++));
      }
    });

    // Generate bids
    const bids: Bid[] = [];
    let bidIndex = 1;
    projects.forEach(project => {
      if (project.status === 'bidding' || project.status === 'awarded') {
        const numBids = Math.floor(Math.random() * bidsPerProject) + 1;
        const selectedSubcontractors = this.shuffleArray(subcontractors).slice(0, numBids);
        
        selectedSubcontractors.forEach(sub => {
          bids.push(this.generateBid(project.id, sub.id, bidIndex++));
        });
      }
    });

    // Generate notifications
    const notifications: Notification[] = [];
    let notificationIndex = 1;
    users.forEach(user => {
      for (let i = 0; i < notificationsPerUser; i++) {
        notifications.push(this.generateNotification(user.id, notificationIndex++));
      }
    });

    return {
      users,
      projects,
      bids,
      notifications,
    };
  }
}