'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface LoanApplicationFormData {
  // Applicant Information
  applicantName: string;
  applicantType: 'gc' | 'subcontractor' | 'supplier';
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
  yearsInBusiness: number;
  employeeCount: number;
  annualRevenue: number;
  
  // Loan Details
  loanAmount: number;
  loanType: 'construction' | 'development' | 'equipment' | 'working_capital';
  termMonths: number;
  purpose: string;
  
  // Project Information (optional)
  projectName: string;
  projectDescription: string;
  
  // Financial Information
  creditScore: number;
  collateral: string;
  bankReferences: string;
  
  // Additional Information
  notes: string;
}

interface LoanApplicationFormProps {
  onSubmit: (data: LoanApplicationFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

// Mock data for dropdowns
const loanTypes = [
  { value: 'construction', label: 'Construction Loan', description: 'Short-term financing for construction projects' },
  { value: 'development', label: 'Development Loan', description: 'Land development and infrastructure financing' },
  { value: 'equipment', label: 'Equipment Financing', description: 'Purchase or lease construction equipment' },
  { value: 'working_capital', label: 'Working Capital', description: 'General business operations and cash flow' },
];

const applicantTypes = [
  { value: 'gc', label: 'General Contractor' },
  { value: 'subcontractor', label: 'Subcontractor' },
  { value: 'supplier', label: 'Supplier' },
];

const termOptions = [
  { value: 12, label: '12 months' },
  { value: 18, label: '18 months' },
  { value: 24, label: '24 months' },
  { value: 36, label: '36 months' },
  { value: 48, label: '48 months' },
  { value: 60, label: '60 months' },
];

export default function LoanApplicationForm({ onSubmit, onCancel, loading = false }: LoanApplicationFormProps) {
  const [formData, setFormData] = useState<LoanApplicationFormData>({
    applicantName: '',
    applicantType: 'gc',
    contactEmail: '',
    contactPhone: '',
    businessAddress: '',
    yearsInBusiness: 1,
    employeeCount: 1,
    annualRevenue: 0,
    loanAmount: 0,
    loanType: 'construction',
    termMonths: 24,
    purpose: '',
    projectName: '',
    projectDescription: '',
    creditScore: 700,
    collateral: '',
    bankReferences: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof LoanApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.applicantName.trim()) newErrors.applicantName = 'Company name is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Phone number is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Loan purpose is required';
    if (!formData.collateral.trim()) newErrors.collateral = 'Collateral description is required';

    // Numeric validations
    if (formData.loanAmount <= 0) newErrors.loanAmount = 'Valid loan amount is required';
    if (formData.yearsInBusiness < 1) newErrors.yearsInBusiness = 'Years in business must be at least 1';
    if (formData.employeeCount < 1) newErrors.employeeCount = 'Employee count must be at least 1';
    if (formData.annualRevenue <= 0) newErrors.annualRevenue = 'Valid annual revenue is required';
    if (formData.creditScore < 300 || formData.creditScore > 850) {
      newErrors.creditScore = 'Credit score must be between 300 and 850';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Valid email address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateEstimatedPayment = () => {
    const principal = formData.loanAmount;
    const months = formData.termMonths;
    
    // Estimated interest rates based on loan type
    const interestRates = {
      construction: 6.5,
      development: 7.0,
      equipment: 8.5,
      working_capital: 5.5,
    };
    
    const annualRate = interestRates[formData.loanType] / 100;
    const monthlyRate = annualRate / 12;
    
    if (principal > 0 && months > 0) {
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                     (Math.pow(1 + monthlyRate, months) - 1);
      return payment;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  const estimatedPayment = calculateEstimatedPayment();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Applicant Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center text-primary border-b border-border pb-2">
          <UserIcon className="w-5 h-5 mr-2" />
          Applicant Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) => handleInputChange('applicantName', e.target.value)}
              placeholder="e.g., Downtown Construction LLC"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.applicantName && <p className="text-destructive text-sm mt-1">{errors.applicantName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Type <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.applicantType}
              onChange={(e) => handleInputChange('applicantType', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {applicantTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="contact@company.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.contactEmail && <p className="text-destructive text-sm mt-1">{errors.contactEmail}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.contactPhone && <p className="text-destructive text-sm mt-1">{errors.contactPhone}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Business Address <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            placeholder="123 Business Ave, City, State, ZIP"
            rows={2}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {errors.businessAddress && <p className="text-destructive text-sm mt-1">{errors.businessAddress}</p>}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Years in Business <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.yearsInBusiness}
              onChange={(e) => handleInputChange('yearsInBusiness', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.yearsInBusiness && <p className="text-destructive text-sm mt-1">{errors.yearsInBusiness}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Employees <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.employeeCount}
              onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {errors.employeeCount && <p className="text-destructive text-sm mt-1">{errors.employeeCount}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Annual Revenue <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                min="0"
                value={formData.annualRevenue}
                onChange={(e) => handleInputChange('annualRevenue', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errors.annualRevenue && <p className="text-destructive text-sm mt-1">{errors.annualRevenue}</p>}
          </div>
        </div>
      </div>

      {/* Loan Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center text-primary border-b border-border pb-2">
          <BanknotesIcon className="w-5 h-5 mr-2" />
          Loan Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Loan Amount <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                min="0"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errors.loanAmount && <p className="text-destructive text-sm mt-1">{errors.loanAmount}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Loan Term <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.termMonths}
              onChange={(e) => handleInputChange('termMonths', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {termOptions.map(term => (
                <option key={term.value} value={term.value}>{term.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Loan Type <span className="text-destructive">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {loanTypes.map(type => (
              <label key={type.value} className="flex items-start space-x-3 p-3 border border-input rounded-md cursor-pointer hover:bg-accent">
                <input
                  type="radio"
                  name="loanType"
                  value={type.value}
                  checked={formData.loanType === type.value}
                  onChange={(e) => handleInputChange('loanType', e.target.value)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-muted-foreground">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Loan Purpose <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => handleInputChange('purpose', e.target.value)}
            placeholder="Describe how you plan to use the loan funds..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {errors.purpose && <p className="text-destructive text-sm mt-1">{errors.purpose}</p>}
        </div>

        {/* Estimated Payment Display */}
        {formData.loanAmount > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(estimatedPayment)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on estimated {loanTypes.find(t => t.value === formData.loanType)?.label} rate
            </div>
          </div>
        )}
      </div>

      {/* Project Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center text-primary border-b border-border pb-2">
          <BuildingOfficeIcon className="w-5 h-5 mr-2" />
          Project Information (Optional)
        </h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Project Name</label>
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            placeholder="e.g., Downtown Office Complex"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Project Description</label>
          <textarea
            value={formData.projectDescription}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            placeholder="Brief description of the project..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center text-primary border-b border-border pb-2">
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          Financial Information
        </h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Credit Score (Estimated) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            min="300"
            max="850"
            value={formData.creditScore}
            onChange={(e) => handleInputChange('creditScore', parseInt(e.target.value) || 700)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.creditScore && <p className="text-destructive text-sm mt-1">{errors.creditScore}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Collateral Description <span className="text-destructive">*</span>
          </label>
          <textarea
            value={formData.collateral}
            onChange={(e) => handleInputChange('collateral', e.target.value)}
            placeholder="Describe the collateral you're offering to secure this loan..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {errors.collateral && <p className="text-destructive text-sm mt-1">{errors.collateral}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Bank References</label>
          <textarea
            value={formData.bankReferences}
            onChange={(e) => handleInputChange('bankReferences', e.target.value)}
            placeholder="List your current banking relationships and references..."
            rows={2}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
          Additional Information
        </h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any additional information you'd like to provide..."
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="sm:w-auto"
        >
          {loading ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}