'use client';

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { SlidePanel } from '@/components/layout';
import { formatCurrency } from '@/lib/utils';
import {
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface BidSubmissionFormProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bidData: any) => void;
}

export const BidSubmissionForm: React.FC<BidSubmissionFormProps> = ({
  project,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    timeline: '',
    description: '',
    tradeSpecialization: '',
    laborCost: '',
    materialCost: '',
    equipmentCost: '',
    contingency: '10',
    startDate: '',
    completionDate: '',
    warranty: '12',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate total amount when cost components change
    if (['laborCost', 'materialCost', 'equipmentCost', 'contingency'].includes(field)) {
      const labor = parseFloat(field === 'laborCost' ? value : formData.laborCost) || 0;
      const material = parseFloat(field === 'materialCost' ? value : formData.materialCost) || 0;
      const equipment = parseFloat(field === 'equipmentCost' ? value : formData.equipmentCost) || 0;
      const contingencyPercent = parseFloat(field === 'contingency' ? value : formData.contingency) || 0;
      
      const subtotal = labor + material + equipment;
      const contingencyAmount = subtotal * (contingencyPercent / 100);
      const total = subtotal + contingencyAmount;
      
      setFormData(prev => ({ ...prev, amount: total.toString() }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Bid amount is required and must be greater than 0';
    }

    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Bid description is required';
    }

    if (!formData.tradeSpecialization) {
      newErrors.tradeSpecialization = 'Trade specialization is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.completionDate) {
      newErrors.completionDate = 'Completion date is required';
    }

    if (formData.startDate && formData.completionDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.completionDate);
      if (end <= start) {
        newErrors.completionDate = 'Completion date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const bidData = {
        ...formData,
        projectId: project.id,
        amount: parseFloat(formData.amount),
        submittedAt: new Date(),
        status: 'pending',
      };
      
      onSubmit(bidData);
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCost = (
    (parseFloat(formData.laborCost) || 0) +
    (parseFloat(formData.materialCost) || 0) +
    (parseFloat(formData.equipmentCost) || 0)
  );

  const contingencyAmount = totalCost * ((parseFloat(formData.contingency) || 0) / 100);
  const grandTotal = totalCost + contingencyAmount;

  if (!project) return null;

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={onClose}
      direction="right"
      width="lg"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Submit Bid</h2>
            <p className="text-muted-foreground mt-1">{project.name}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline">
                Budget: {formatCurrency(project.estimatedCost || 0)}
              </Badge>
              <Badge variant="outline">
                Timeline: {project.timeline}
              </Badge>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-6">
              {/* Main Form */}
              <div className="space-y-6">
                {/* Trade Specialization */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Trade Specialization</h3>
                  <div>
                    <select
                      value={formData.tradeSpecialization}
                      onChange={(e) => handleInputChange('tradeSpecialization', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                    >
                      <option value="">Select your trade</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="concrete">Concrete</option>
                      <option value="roofing">Roofing</option>
                      <option value="flooring">Flooring</option>
                      <option value="general">General Construction</option>
                    </select>
                    {errors.tradeSpecialization && (
                      <p className="text-destructive text-sm mt-1">{errors.tradeSpecialization}</p>
                    )}
                  </div>
                </div>

                {/* Bid Description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Bid Description</h3>
                  <div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your approach, experience, and what's included..."
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Labor Cost</label>
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <input
                            type="number"
                            value={formData.laborCost}
                            onChange={(e) => handleInputChange('laborCost', e.target.value)}
                            placeholder="0"
                            className="w-full pl-8 pr-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Material Cost</label>
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <input
                            type="number"
                            value={formData.materialCost}
                            onChange={(e) => handleInputChange('materialCost', e.target.value)}
                            placeholder="0"
                            className="w-full pl-8 pr-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Equipment Cost</label>
                        <div className="relative">
                          <CurrencyDollarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                          <input
                            type="number"
                            value={formData.equipmentCost}
                            onChange={(e) => handleInputChange('equipmentCost', e.target.value)}
                            placeholder="0"
                            className="w-full pl-8 pr-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Contingency (%)</label>
                        <input
                          type="number"
                          value={formData.contingency}
                          onChange={(e) => handleInputChange('contingency', e.target.value)}
                          placeholder="10"
                          min="0"
                          max="50"
                          className="w-full px-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Project Timeline</h3>
                  <div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Timeline Description</label>
                        <input
                          type="text"
                          value={formData.timeline}
                          onChange={(e) => handleInputChange('timeline', e.target.value)}
                          placeholder="e.g., 8 weeks, 3 months"
                          className="w-full px-3 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                        />
                        {errors.timeline && (
                          <p className="text-destructive text-xs mt-1">{errors.timeline}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Start Date</label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                          />
                          {errors.startDate && (
                            <p className="text-destructive text-xs mt-1">{errors.startDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium mb-1">Completion Date</label>
                          <input
                            type="date"
                            value={formData.completionDate}
                            onChange={(e) => handleInputChange('completionDate', e.target.value)}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                          />
                          {errors.completionDate && (
                            <p className="text-destructive text-xs mt-1">{errors.completionDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Additional Details</h3>
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Warranty (months)</label>
                        <input
                          type="number"
                          value={formData.warranty}
                          onChange={(e) => handleInputChange('warranty', e.target.value)}
                          placeholder="12"
                          min="1"
                          max="120"
                          className="w-full px-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Notes</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Additional info..."
                          rows={2}
                          className="w-full px-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* Bid Summary */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center text-lg">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                    Bid Summary
                  </h3>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor:</span>
                      <span>{formatCurrency(parseFloat(formData.laborCost) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials:</span>
                      <span>{formatCurrency(parseFloat(formData.materialCost) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment:</span>
                      <span>{formatCurrency(parseFloat(formData.equipmentCost) || 0)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatCurrency(totalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contingency ({formData.contingency}%):</span>
                      <span>{formatCurrency(contingencyAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 font-semibold text-sm">
                      <span>Total Bid:</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Manual Override */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <label className="block text-xs font-medium mb-1">Final Bid Amount</label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0"
                        className="w-full pl-8 pr-2 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-destructive text-xs mt-1">{errors.amount}</p>
                    )}
                  </div>
                </div>

                {/* Competitive Analysis */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Budget Comparison</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project Budget:</span>
                      <span>{formatCurrency(project.estimatedCost || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your Bid:</span>
                      <span className={
                        grandTotal > (project.estimatedCost || 0) 
                          ? 'text-destructive' 
                          : 'text-green-600'
                      }>
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                  
                  {grandTotal > (project.estimatedCost || 0) && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded border border-destructive/20 flex items-start space-x-2">
                      <ExclamationTriangleIcon className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-destructive">
                        Bid exceeds project budget
                      </p>
                    </div>
                  )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col space-y-3 pt-6 border-t mt-6">
              <div className="text-sm text-muted-foreground text-center">
                By submitting this bid, you agree to the project terms and conditions.
              </div>
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="success" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Submit Bid
                    </>
                  )}
                </Button>
              </div>
            </div>
        </form>
        </div>
      </div>
    </SlidePanel>
  );
};