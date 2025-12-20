'use client';

import { useState } from 'react';
import { SlidePanel } from '@/components/layout';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  PlusIcon,
  TrashIcon,
  BuildingOfficeIcon,
  TruckIcon,
  XMarkIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface OrderFormData {
  projectId: string;
  projectName: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  deliveryAddress: string;
  expectedDelivery: string;
  notes: string;
}

interface CreateOrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
}

// Mock data for dropdowns
const mockProjects = [
  { id: 'proj-1', name: 'Downtown Office Complex' },
  { id: 'proj-2', name: 'Residential Complex Phase 1' },
  { id: 'proj-3', name: 'Warehouse Renovation' },
];

const mockSuppliers = [
  { id: 'sup-1', name: 'BuildMart Supply Co.' },
  { id: 'sup-2', name: 'Construction Supply Depot' },
  { id: 'sup-3', name: 'Premium Building Materials' },
];

const mockMaterials = [
  'Concrete Mix',
  'Rebar #4',
  'Lumber 2x4x8',
  'Plywood 4x8',
  'Steel Beams',
  'Welding Rods',
  'Glass Panels',
  'Aluminum Frames',
  'Insulation',
  'Drywall',
];

const units = ['pieces', 'bags', 'sheets', 'boxes', 'tons', 'yards', 'feet', 'panels'];

export const CreateOrderPanel: React.FC<CreateOrderPanelProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    projectId: '',
    projectName: '',
    supplierId: '',
    supplierName: '',
    items: [
      {
        id: '1',
        name: '',
        quantity: 1,
        unit: 'pieces',
        unitPrice: 0,
        total: 0,
      },
    ],
    deliveryAddress: '',
    expectedDelivery: '',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    const newId = (formData.items.length + 1).toString();
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          name: '',
          quantity: 1,
          unit: 'pieces',
          unitPrice: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
      }));
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    setFormData(prev => ({
      ...prev,
      projectId,
      projectName: project?.name || '',
    }));
  };

  const handleSupplierChange = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    setFormData(prev => ({
      ...prev,
      supplierId,
      supplierName: supplier?.name || '',
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.projectId || !formData.supplierId || !formData.deliveryAddress || !formData.expectedDelivery) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.items.some(item => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      alert('Please complete all item details');
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      projectId: '',
      projectName: '',
      supplierId: '',
      supplierName: '',
      items: [
        {
          id: '1',
          name: '',
          quantity: 1,
          unit: 'pieces',
          unitPrice: 0,
          total: 0,
        },
      ],
      deliveryAddress: '',
      expectedDelivery: '',
      notes: '',
    });
    onClose();
  };

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      direction="right"
      width="lg"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingCartIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Order</h2>
              <p className="text-sm text-muted-foreground">Place an order for materials and supplies</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Project and Supplier Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                Order Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center space-x-2 mb-2">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span>Project <span className="text-destructive">*</span></span>
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a project</option>
                    {mockProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center space-x-2 mb-2">
                    <TruckIcon className="w-4 h-4" />
                    <span>Supplier <span className="text-destructive">*</span></span>
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a supplier</option>
                    {mockSuppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
                Delivery Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Delivery Address <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={3}
                    placeholder="Enter delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Expected Delivery Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary border-b border-border pb-2 flex-1">
                  Order Items
                </h3>
                <Button type="button" onClick={addItem} size="sm" variant="outline">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="p-4 border border-border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Material</label>
                        <select
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="">Select material</option>
                          {mockMaterials.map(material => (
                            <option key={material} value={material}>
                              {material}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            min="1"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Unit</label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {units.map(unit => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Unit Price</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">Item Total: </span>
                        <span className="font-medium text-lg">{formatCurrency(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t border-border pt-4">
                <div className="text-right">
                  <span className="text-lg text-muted-foreground">Order Total: </span>
                  <span className="font-bold text-2xl text-primary">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
                placeholder="Additional notes or special instructions"
              />
            </div>
          </form>
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-border p-6 bg-card">
          <div className="flex space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isLoading}
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Creating Order...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SlidePanel>
  );
};