'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { AddInventoryPanel, ImportItemsModal } from '@/components/inventory';
import { formatCurrency } from '@/lib/utils';
import {
  PlusIcon,
  FunnelIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

// Mock inventory data
const mockInventory = [
  {
    id: 'inv-1',
    sku: 'CON-MIX-001',
    name: 'Concrete Mix - Standard',
    category: 'Concrete & Cement',
    description: 'High-quality concrete mix for general construction',
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: 'bags',
    unitPrice: 12.50,
    totalValue: 1875.00,
    supplier: 'BuildMart Supply Co.',
    location: 'Warehouse A - Section 1',
    lastRestocked: new Date('2024-12-10'),
    status: 'in_stock',
  },
  {
    id: 'inv-2',
    sku: 'REB-004-001',
    name: 'Rebar #4 - 20ft',
    category: 'Steel & Metal',
    description: 'Grade 60 rebar, 20 feet length',
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unit: 'pieces',
    unitPrice: 8.75,
    totalValue: 218.75,
    supplier: 'Steel Solutions Inc.',
    location: 'Yard B - Section 3',
    lastRestocked: new Date('2024-12-05'),
    status: 'low_stock',
  },
  {
    id: 'inv-3',
    sku: 'LUM-2X4-008',
    name: 'Lumber 2x4x8 - Pine',
    category: 'Lumber & Wood',
    description: 'Kiln-dried pine lumber, construction grade',
    currentStock: 0,
    minStock: 100,
    maxStock: 1000,
    unit: 'pieces',
    unitPrice: 6.25,
    totalValue: 0,
    supplier: 'Forest Products Ltd.',
    location: 'Warehouse C - Section 2',
    lastRestocked: new Date('2024-11-28'),
    status: 'out_of_stock',
  },
  {
    id: 'inv-4',
    sku: 'PLY-4X8-001',
    name: 'Plywood 4x8 - 3/4 inch',
    category: 'Lumber & Wood',
    description: 'Exterior grade plywood sheets',
    currentStock: 75,
    minStock: 25,
    maxStock: 200,
    unit: 'sheets',
    unitPrice: 45.00,
    totalValue: 3375.00,
    supplier: 'Forest Products Ltd.',
    location: 'Warehouse C - Section 1',
    lastRestocked: new Date('2024-12-12'),
    status: 'in_stock',
  },
  {
    id: 'inv-5',
    sku: 'STL-BM-125',
    name: 'Steel Beam - I-Beam 12"',
    category: 'Steel & Metal',
    description: 'Structural steel I-beam, 20 feet length',
    currentStock: 8,
    minStock: 5,
    maxStock: 50,
    unit: 'pieces',
    unitPrice: 125.00,
    totalValue: 1000.00,
    supplier: 'Steel Solutions Inc.',
    location: 'Yard A - Section 1',
    lastRestocked: new Date('2024-12-08'),
    status: 'in_stock',
  },
  {
    id: 'inv-6',
    sku: 'GLS-PNL-180',
    name: 'Glass Panel - Tempered',
    category: 'Glass & Windows',
    description: 'Tempered glass panels for commercial use',
    currentStock: 12,
    minStock: 10,
    maxStock: 100,
    unit: 'panels',
    unitPrice: 180.00,
    totalValue: 2160.00,
    supplier: 'Premium Building Materials',
    location: 'Warehouse D - Climate Controlled',
    lastRestocked: new Date('2024-12-15'),
    status: 'in_stock',
  },
];

export default function InventoryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(mockInventory);
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'low_stock':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
      case 'out_of_stock':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <CubeIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'success';
      case 'low_stock':
        return 'warning';
      case 'out_of_stock':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStockLevel = (item: any) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (percentage <= 20) return 'critical';
    if (percentage <= 50) return 'low';
    return 'good';
  };

  const categories = [...new Set(mockInventory.map(item => item.category))];

  const handleAddItem = (newItem: any) => {
    setInventory(prev => [...prev, newItem]);
  };

  const handleImportItems = (newItems: any[]) => {
    setInventory(prev => [...prev, ...newItems]);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const renderInventoryCard = (item: any) => {
    const stockLevel = getStockLevel(item);
    const stockPercentage = (item.currentStock / item.maxStock) * 100;

    return (
      <CardWidget
        key={item.id}
        title={item.name}
        content={
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">SKU: {item.sku}</div>
                <div className="text-sm text-muted-foreground mb-2">{item.description}</div>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              <Badge variant={getStatusVariant(item.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(item.status)}
                  <span className="capitalize">{item.status.replace('_', ' ')}</span>
                </div>
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Stock:</span>
                <div className="font-bold text-lg">
                  {item.currentStock} {item.unit}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Value:</span>
                <div className="font-bold text-lg">
                  {formatCurrency(item.totalValue)}
                </div>
              </div>
            </div>

            {/* Stock Level Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Stock Level</span>
                <span>{Math.round(stockPercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    stockLevel === 'critical' 
                      ? 'bg-red-500' 
                      : stockLevel === 'low' 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {item.minStock}</span>
                <span>Max: {item.maxStock}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Supplier:</span>
                <div className="font-medium">{item.supplier}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <div className="font-medium">{item.location}</div>
              </div>
            </div>
          </div>
        }
        actions={
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            {item.status === 'low_stock' || item.status === 'out_of_stock' ? (
              <Button size="sm" variant="success">
                Restock
              </Button>
            ) : (
              <Button size="sm" variant="secondary">
                Adjust
              </Button>
            )}
          </div>
        }
      />
    );
  };

  // Calculate stats
  const totalItems = inventory.length;
  const inStockItems = inventory.filter(i => i.status === 'in_stock').length;
  const lowStockItems = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalValue = inventory.reduce((sum, i) => sum + i.totalValue, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage your construction materials</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => setImportModalOpen(true)}
            >
              <ArrowTrendingDownIcon className="w-4 h-4" />
              <span>Import</span>
            </Button>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setAddPanelOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Item</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CardWidget
            title="Total Items"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold">{totalItems}</div>
                <div className="text-xs text-muted-foreground">SKUs tracked</div>
              </div>
            }
          />
          <CardWidget
            title="In Stock"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{inStockItems}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            }
          />
          <CardWidget
            title="Low Stock"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                <div className="text-xs text-muted-foreground">Need restock</div>
              </div>
            }
          />
          <CardWidget
            title="Out of Stock"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
                <div className="text-xs text-muted-foreground">Urgent</div>
              </div>
            }
          />
          <CardWidget
            title="Total Value"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(totalValue).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">Inventory worth</div>
              </div>
            }
          />
        </div>

        {/* Filters and Search */}
        <CardWidget
          title="Filter Inventory"
          content={
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <CubeIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          }
        />

        {/* Inventory List */}
        <CardWidget
          title={`Inventory Items (${filteredInventory.length})`}
          content={
            <ListWidget
              items={filteredInventory}
              renderItem={renderInventoryCard}
              emptyState={
                <div className="text-center py-12">
                  <CubeIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No inventory items found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'all' 
                      ? "Start by adding your first inventory item." 
                      : `No items match the current filters.`}
                  </p>
                  <Button onClick={() => setAddPanelOpen(true)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              }
            />
          }
        />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <CardWidget
            title="Low Stock Alerts"
            content={
              <div className="space-y-3">
                {inventory
                  .filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')
                  .slice(0, 3)
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.currentStock} {item.unit} remaining
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="success">
                        Restock
                      </Button>
                    </div>
                  ))}
                {inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    All items are well stocked!
                  </div>
                )}
              </div>
            }
          />

          <CardWidget
            title="Recent Activity"
            content={
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">Glass Panels restocked</div>
                    <div className="text-xs text-muted-foreground">25 panels added • 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="font-medium text-sm">Lumber 2x4x8 depleted</div>
                    <div className="text-xs text-muted-foreground">Last 50 pieces used • 1 day ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Concrete Mix delivered</div>
                    <div className="text-xs text-muted-foreground">100 bags received • 3 days ago</div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Add Inventory Panel */}
      <AddInventoryPanel
        isOpen={addPanelOpen}
        onClose={() => setAddPanelOpen(false)}
        onAdd={handleAddItem}
      />
      
      <ImportItemsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportItems}
      />
    </Layout>
  );
}