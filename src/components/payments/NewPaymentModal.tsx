'use client';

import { useState } from 'react';
import { 
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (paymentData: any) => void;
}

interface PaymentFormData {
  projectId: string;
  recipient: string;
  amount: string;
  dueDate: string;
  paymentMethod: string;
  description: string;
  invoiceNumber: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export function NewPaymentModal({ isOpen, onClose, onSubmit }: NewPaymentModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    projectId: '',
    recipient: '',
    amount: '',
    dueDate: '',
    paymentMethod: 'ach',
    description: '',
    invoiceNumber: '',
    priority: 'medium',
    category: 'materials'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const projects = [
    { id: '1', name: 'Downtown Office Complex' },
    { id: '2', name: 'Residential Tower A' },
    { id: '3', name: 'Shopping Center Phase 2' },
    { id: '4', name: 'Industrial Warehouse' }
  ];

  const paymentMethods = [
    { id: 'ach', name: 'ACH Transfer', icon: BanknotesIcon, description: '1-3 business days' },
    { id: 'wire', name: 'Wire Transfer', icon: BanknotesIcon, description: 'Same day' },
    { id: 'check', name: 'Check', icon: DocumentTextIcon, description: '5-7 business days' },
    { id: 'credit_card', name: 'Credit Card', icon: CreditCardIcon, description: 'Instant' }
  ];

  const categories = [
    'Materials',
    'Labor',
    'Equipment',
    'Subcontractor',
    'Permits',
    'Utilities',
    'Other'
  ];

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
    // Reset form
    setFormData({
      projectId: '',
      recipient: '',
      amount: '',
      dueDate: '',
      paymentMethod: 'ach',
      description: '',
      invoiceNumber: '',
      priority: 'medium',
      category: 'materials'
    });
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.projectId && formData.recipient && formData.amount;
      case 2:
        return formData.paymentMethod && formData.dueDate;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              New Payment
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-12 h-1 mx-2 rounded-full ${
                    i + 1 < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Project *</label>
                  <select 
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient *</label>
                  <input 
                    type="text" 
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    placeholder="Enter recipient name or company"
                    className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                      <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-3 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category.toLowerCase()}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method & Timing */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Payment Method & Schedule</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Payment Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map(method => {
                      const IconComponent = method.icon;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => handleInputChange('paymentMethod', method.id)}
                          className={`p-4 border rounded-xl text-left transition-all ${
                            formData.paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-xs text-muted-foreground">{method.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date *</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input 
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value as any)}
                      className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Invoice Number</label>
                  <input 
                    type="text" 
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    placeholder="INV-2024-001"
                    className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Payment description or notes..."
                    rows={4}
                    className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-xl p-4 mt-6">
                  <h4 className="font-semibold mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span>{formData.recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">${formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="capitalize">{formData.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span>{formData.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <button 
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-border rounded-xl hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < totalSteps ? (
                <button 
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                >
                  Create Payment
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}