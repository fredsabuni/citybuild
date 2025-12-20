// Core user types
export type UserRole = 'gc' | 'subcontractor' | 'supplier' | 'bank';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  name: string;
  verified: boolean;
  createdAt: Date;
}

// Application state types
export interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentProject?: Project;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  gcId: string;
  status: 'draft' | 'active' | 'bidding' | 'awarded' | 'completed';
  planFiles: FileUpload[];
  estimatedCost?: number;
  timeline?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

// Bidding types
export interface Bid {
  id: string;
  projectId: string;
  subcontractorId: string;
  amount: number;
  timeline: string;
  description: string;
  status: 'pending' | 'awarded' | 'rejected';
  submittedAt: Date;
}

// UI Component types
export interface CardWidgetProps {
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'warning';
  className?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'select' | 'textarea' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

export interface FormWidgetProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  loading?: boolean;
  className?: string;
}

export interface ListWidgetProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  theme?: 'light' | 'dark';
}

export interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  direction: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  children: React.ReactNode;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles: UserRole[];
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  userId: string;
}