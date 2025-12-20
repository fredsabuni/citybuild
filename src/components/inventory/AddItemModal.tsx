'use client';

import React, { useState } from 'react';
import { BottomUpModal } from '@/components/layout';
import { Button } from '@/components/ui';
import { generateId } from '@/lib/utils';
import {
  CubeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    description: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    unitPrice: '',
    supplier: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Concrete & Cement',
    'Steel & Metal',
    'Lumber & Wood',
    'Glass & Windows',
    'Electrical',
    'Plumbing',
    'Roofing',
    'Insulation',
    'Hardware',
    'Tools & Equipment',
    'Other',
  ];

  const units = [
    'pieces',
    'bags',
    'sheets',
    'panels',
    'rolls',
    'boxes',
    'gallons',
    'pounds',
    'tons',
    'feet',
    'meters',
    'square feet',
    'square meters',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    
    const currentStock = parseFloat(formData.currentStock);
    const minStock = parseFloat(formData.minStock);
    const maxStock = parseFloat(formData.maxStock);
    const unitPrice = parseFloat(formData.unitPrice);

    if (isNaN(currentStock) || currentStock < 0) {
      newErrors.currentStock = 'Valid current stock is required';
    }
    if (isNaN(minStock) || minStock < 0) {
      newErrors.minStock = 'Valid minimum stock is required';
    }
    if (isNaN(maxStock) || maxStock <= 0) {
      newErrors.maxStock = 'Valid maximum stock is required';
    }
    if (isNaN(unitPrice) || unitPrice <= 0) {
      newErrors.unitPrice = 'Valid unit price is required';
    }

    if (!isNaN(minStock) && !isNaN(maxStock) && minStock >= maxStock) {
      newErrors.maxStock = 'Maximum stock must be greater than minimum stock';
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentStock = parseFloat(formData.currentStock);
      const minStock = parseFloat(formData.minStock);
      const unitPrice = parseFloat(formData.unitPrice);
      
      const newItem = {
        id: generateId(),
        sku: formData.sku.toUpperCase(),
        name: formData.name,
        category: formData.category,
        description: formData.description || `${formData.name} - ${formData.category}`,
        currentStock,
        minStock,
        maxStock: parseFloat(formData.maxStock),
        unit: formData.unit,
        unitPrice,
        totalValue: currentStock * unitPrice,
        supplier: formData.supplier || 'Unknown Supplier',
        location: formData.location || 'Warehouse - General',
        lastRestocked: new Date(),
        status: currentStock <= minStock ? (currentStock === 0 ? 'out_of_stock' : 'low_stock') : 'in_stock',
      };
      
      onAdd(newItem);
      
      // Reset form
      setFormData({
        sku: '',
        name: '',
        category: '',
        description: '',
        currentStock: '',
        minStock: '',
        maxStock: '',
        unit: '',
        unitPrice: '',
        supplier: '',
        location: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomUpModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Inventory Item"
      maxHeight="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <CubeIcon className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                SKU <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="e.g., CON-MIX-001"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.sku && <p className="text-destructive text-sm mt-1">{errors.sku}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Concrete Mix - Standard"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-destructive text-sm mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Unit <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select unit</option>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unit && <p className="text-destructive text-sm mt-1">{errors.unit}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description of the item..."
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        {/* Stock Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Stock Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Stock <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.currentStock && <p className="text-destructive text-sm mt-1">{errors.currentStock}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Stock <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minStock}
                onChange={(e) => handleInputChange('minStock', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.minStock && <p className="text-destructive text-sm mt-1">{errors.minStock}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Maximum Stock <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.maxStock}
                onChange={(e) => handleInputChange('maxStock', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.maxStock && <p className="text-destructive text-sm mt-1">{errors.maxStock}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Unit Price <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errors.unitPrice && <p className="text-destructive text-sm mt-1">{errors.unitPrice}</p>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                placeholder="e.g., BuildMart Supply Co."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Storage Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Warehouse A - Section 1"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Add Item
              </>
            )}
          </Button>
        </div>
      </form>
    </BottomUpModal>
  );
};