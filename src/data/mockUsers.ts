import { User } from '@/types';

export const mockUsers: User[] = [
  // General Contractors
  {
    id: 'gc-1',
    email: 'john.contractor@example.com',
    phone: '+1-555-0101',
    role: 'gc',
    name: 'John Contractor',
    verified: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'gc-2',
    email: 'maria.builder@example.com',
    phone: '+1-555-0201',
    role: 'gc',
    name: 'Maria Builder',
    verified: true,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'gc-3',
    email: 'david.construction@example.com',
    phone: '+1-555-0301',
    role: 'gc',
    name: 'David Construction LLC',
    verified: true,
    createdAt: new Date('2024-03-05'),
  },

  // Subcontractors - Plumbing
  {
    id: 'sub-1',
    email: 'mike.plumber@example.com',
    phone: '+1-555-0102',
    role: 'subcontractor',
    name: 'Mike Plumber',
    verified: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'sub-3',
    email: 'premium.plumbing@example.com',
    phone: '+1-555-0302',
    role: 'subcontractor',
    name: 'Premium Plumbing Solutions',
    verified: true,
    createdAt: new Date('2024-02-15'),
  },

  // Subcontractors - Electrical
  {
    id: 'sub-2',
    email: 'sarah.electrician@example.com',
    phone: '+1-555-0103',
    role: 'subcontractor',
    name: 'Sarah Electrician',
    verified: true,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'sub-4',
    email: 'smart.electrical@example.com',
    phone: '+1-555-0402',
    role: 'subcontractor',
    name: 'Smart Electrical Systems',
    verified: true,
    createdAt: new Date('2024-03-01'),
  },

  // Subcontractors - HVAC
  {
    id: 'sub-5',
    email: 'climate.control@example.com',
    phone: '+1-555-0502',
    role: 'subcontractor',
    name: 'Climate Control Experts',
    verified: true,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'sub-7',
    email: 'industrial.hvac@example.com',
    phone: '+1-555-0702',
    role: 'subcontractor',
    name: 'Industrial HVAC Solutions',
    verified: true,
    createdAt: new Date('2024-04-10'),
  },

  // Subcontractors - Other trades
  {
    id: 'sub-6',
    email: 'concrete.pros@example.com',
    phone: '+1-555-0602',
    role: 'subcontractor',
    name: 'Concrete Professionals',
    verified: true,
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'sub-8',
    email: 'roofing.masters@example.com',
    phone: '+1-555-0802',
    role: 'subcontractor',
    name: 'Roofing Masters Inc.',
    verified: true,
    createdAt: new Date('2024-04-20'),
  },

  // Suppliers
  {
    id: 'sup-1',
    email: 'supplies@buildmart.com',
    phone: '+1-555-0104',
    role: 'supplier',
    name: 'BuildMart Supply Co.',
    verified: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'sup-2',
    email: 'orders@constructionsupply.com',
    phone: '+1-555-0204',
    role: 'supplier',
    name: 'Construction Supply Depot',
    verified: true,
    createdAt: new Date('2024-02-05'),
  },
  {
    id: 'sup-3',
    email: 'sales@premiumbuilding.com',
    phone: '+1-555-0304',
    role: 'supplier',
    name: 'Premium Building Materials',
    verified: true,
    createdAt: new Date('2024-03-12'),
  },

  // Banks
  {
    id: 'bank-1',
    email: 'construction@firstbank.com',
    phone: '+1-555-0105',
    role: 'bank',
    name: 'First Construction Bank',
    verified: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'bank-2',
    email: 'commercial@buildersbank.com',
    phone: '+1-555-0205',
    role: 'bank',
    name: 'Builders Commercial Bank',
    verified: true,
    createdAt: new Date('2024-01-30'),
  },
];

export const getCurrentUser = (): User | null => {
  // For development, return a mock user
  // In production, this would check authentication state
  return mockUsers[0]; // Default to GC user for testing
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role);
};