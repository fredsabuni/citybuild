'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { CardWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { useApp } from '@/lib/context';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user } = useApp();
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: {
      projectUpdates: true,
      bidNotifications: true,
      orderStatus: true,
      paymentReminders: true,
      systemUpdates: false,
    },
    push: {
      projectUpdates: true,
      bidNotifications: true,
      orderStatus: false,
      paymentReminders: true,
      systemUpdates: false,
    },
    sms: {
      projectUpdates: false,
      bidNotifications: true,
      orderStatus: true,
      paymentReminders: true,
      systemUpdates: false,
    },
  });

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@downtownconst.com',
    phone: '(555) 123-4567',
    jobTitle: 'Project Manager',
    company: 'Downtown Construction LLC',
    address: '123 Business Ave, Downtown City, ST 12345',
    website: 'https://downtownconst.com',
    bio: 'Experienced project manager with 10+ years in commercial construction.',
  });

  const [companySettings, setCompanySettings] = useState({
    companyName: 'Downtown Construction LLC',
    businessType: 'General Contractor',
    licenseNumber: 'GC-2024-001',
    taxId: '12-3456789',
    address: '123 Business Ave, Downtown City, ST 12345',
    phone: '(555) 123-4567',
    email: 'info@downtownconst.com',
    website: 'https://downtownconst.com',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    workingHours: {
      start: '08:00',
      end: '17:00',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    },
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordLastChanged: new Date('2024-11-15'),
  });

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'company', label: 'Company', icon: BuildingOfficeIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'preferences', label: 'Preferences', icon: Cog6ToothIcon },
  ];

  const handleNotificationChange = (type: string, setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompanySettings(prev => ({ ...prev, [field]: value }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <CardWidget
        title="Personal Information"
        content={
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-muted-foreground">{profileData.jobTitle}</p>
                <Button size="sm" variant="outline" className="mt-2">
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  value={profileData.jobTitle}
                  onChange={(e) => handleProfileChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        }
        actions={
          <Button>
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        }
      />
    </div>
  );

  const renderCompanySection = () => (
    <div className="space-y-6">
      <CardWidget
        title="Company Information"
        content={
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => handleCompanyChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <select
                  value={companySettings.businessType}
                  onChange={(e) => handleCompanyChange('businessType', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="General Contractor">General Contractor</option>
                  <option value="Subcontractor">Subcontractor</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Developer">Developer</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">License Number</label>
                <input
                  type="text"
                  value={companySettings.licenseNumber}
                  onChange={(e) => handleCompanyChange('licenseNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tax ID</label>
                <input
                  type="text"
                  value={companySettings.taxId}
                  onChange={(e) => handleCompanyChange('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Address</label>
              <textarea
                value={companySettings.address}
                onChange={(e) => handleCompanyChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={companySettings.phone}
                  onChange={(e) => handleCompanyChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => handleCompanyChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={companySettings.website}
                  onChange={(e) => handleCompanyChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        }
        actions={
          <Button>
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        }
      />

      <CardWidget
        title="Regional Settings"
        content={
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select
                  value={companySettings.timezone}
                  onChange={(e) => handleCompanyChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={companySettings.currency}
                  onChange={(e) => handleCompanyChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date Format</label>
                <select
                  value={companySettings.dateFormat}
                  onChange={(e) => handleCompanyChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        }
        actions={
          <Button>
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        }
      />
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {Object.entries(notifications).map(([type, settings]) => (
        <CardWidget
          key={type}
          title={`${type.charAt(0).toUpperCase() + type.slice(1)} Notifications`}
          content={
            <div className="space-y-4">
              {Object.entries(settings).map(([setting, enabled]) => (
                <div key={setting} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">
                      {setting.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {setting === 'projectUpdates' && 'Get notified about project status changes'}
                      {setting === 'bidNotifications' && 'Receive alerts for new bids and bid updates'}
                      {setting === 'orderStatus' && 'Track order confirmations and deliveries'}
                      {setting === 'paymentReminders' && 'Reminders for upcoming payments'}
                      {setting === 'systemUpdates' && 'System maintenance and feature updates'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => handleNotificationChange(type, setting, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          }
        />
      ))}
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <CardWidget
        title="Password & Authentication"
        content={
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <KeyIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-muted-foreground">
                    Last changed {securitySettings.passwordLastChanged.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <DevicePhoneMobileIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {securitySettings.twoFactorEnabled && (
                  <Badge variant="success">Enabled</Badge>
                )}
                <Button variant="outline" size="sm">
                  {securitySettings.twoFactorEnabled ? 'Manage' : 'Enable'}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Login Alerts</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified of new login attempts
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={securitySettings.loginAlerts}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-muted-foreground">{securitySettings.sessionTimeout} minutes</div>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>15 min</span>
                <span>120 min</span>
              </div>
            </div>
          </div>
        }
      />

      <CardWidget
        title="Active Sessions"
        content={
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Current Session</div>
                  <div className="text-sm text-muted-foreground">Chrome on macOS • New York, NY</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Active now</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div>
                  <div className="font-medium">Mobile App</div>
                  <div className="text-sm text-muted-foreground">iPhone • New York, NY</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">2 hours ago</div>
                <Button size="sm" variant="ghost">
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        }
        actions={
          <Button variant="outline">
            Sign Out All Devices
          </Button>
        }
      />
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <CardWidget
        title="Current Plan"
        content={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Professional Plan</h3>
                <p className="text-muted-foreground">Perfect for growing construction businesses</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$99</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Unlimited projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Advanced reporting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">API access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Custom integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Team collaboration</span>
                </div>
              </div>
            </div>
          </div>
        }
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        }
      />

      <CardWidget
        title="Payment Method"
        content={
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                </div>
              </div>
              <Badge variant="success">Primary</Badge>
            </div>
          </div>
        }
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Add Payment Method</Button>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        }
      />

      <CardWidget
        title="Billing History"
        content={
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div>
                <div className="font-medium">December 2024</div>
                <div className="text-sm text-muted-foreground">Professional Plan</div>
              </div>
              <div className="text-right">
                <div className="font-medium">$99.00</div>
                <Button variant="ghost" size="sm">
                  <DocumentTextIcon className="w-4 h-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div>
                <div className="font-medium">November 2024</div>
                <div className="text-sm text-muted-foreground">Professional Plan</div>
              </div>
              <div className="text-right">
                <div className="font-medium">$99.00</div>
                <Button variant="ghost" size="sm">
                  <DocumentTextIcon className="w-4 h-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>
          </div>
        }
        actions={
          <Button variant="outline">View All Invoices</Button>
        }
      />
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <CardWidget
        title="Display Preferences"
        content={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">Switch to dark theme</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compact View</div>
                <div className="text-sm text-muted-foreground">Show more items per page</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default Dashboard View</label>
              <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="overview">Overview</option>
                <option value="projects">Projects</option>
                <option value="orders">Orders</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
          </div>
        }
        actions={
          <Button>
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        }
      />

      <CardWidget
        title="Data & Privacy"
        content={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Analytics & Usage Data</div>
                <div className="text-sm text-muted-foreground">Help improve our service</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'company':
        return renderCompanySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'billing':
        return renderBillingSection();
      case 'preferences':
        return renderPreferencesSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <CardWidget
              title="Settings"
              content={
                <nav className="space-y-1">
                  {settingsSections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              }
            />
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}