'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { CreateOrderPanel } from '@/components/orders';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  PlusIcon,
  FunnelIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Mock orders data
const mockOrders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    supplierId: 'sup-1',
    supplierName: 'BuildMart Supply Co.',
    projectId: 'proj-1',
    projectName: 'Downtown Office Complex',
    items: [
      { name: 'Concrete Mix', quantity: 50, unit: 'bags', unitPrice: 12.50 },
      { name: 'Rebar #4', quantity: 100, unit: 'pieces', unitPrice: 8.75 },
    ],
    totalAmount: 1500.00,
    status: 'pending',
    orderDate: new Date('2024-12-15'),
    expectedDelivery: new Date('2024-12-20'),
    deliveryAddress: '123 Main St, Downtown',
    notes: 'Deliver to construction site entrance',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-002',
    supplierId: 'sup-2',
    supplierName: 'Construction Supply Depot',
    projectId: 'proj-2',
    projectName: 'Residential Complex Phase 1',
    items: [
      { name: 'Lumber 2x4x8', quantity: 200, unit: 'pieces', unitPrice: 6.25 },
      { name: 'Plywood 4x8', quantity: 50, unit: 'sheets', unitPrice: 45.00 },
    ],
    totalAmount: 3500.00,
    status: 'confirmed',
    orderDate: new Date('2024-12-12'),
    expectedDelivery: new Date('2024-12-18'),
    deliveryAddress: '456 Oak Ave, Residential District',
    notes: 'Stack lumber in designated area',
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-003',
    supplierId: 'sup-1',
    supplierName: 'BuildMart Supply Co.',
    projectId: 'proj-3',
    projectName: 'Warehouse Renovation',
    items: [
      { name: 'Steel Beams', quantity: 20, unit: 'pieces', unitPrice: 125.00 },
      { name: 'Welding Rods', quantity: 10, unit: 'boxes', unitPrice: 35.00 },
    ],
    totalAmount: 2850.00,
    status: 'delivered',
    orderDate: new Date('2024-12-08'),
    expectedDelivery: new Date('2024-12-14'),
    deliveryAddress: '789 Industrial Blvd, Warehouse District',
    notes: 'Delivered and signed for',
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-2024-004',
    supplierId: 'sup-3',
    supplierName: 'Premium Building Materials',
    projectId: 'proj-1',
    projectName: 'Downtown Office Complex',
    items: [
      { name: 'Glass Panels', quantity: 25, unit: 'panels', unitPrice: 180.00 },
      { name: 'Aluminum Frames', quantity: 25, unit: 'pieces', unitPrice: 95.00 },
    ],
    totalAmount: 6875.00,
    status: 'cancelled',
    orderDate: new Date('2024-12-10'),
    expectedDelivery: new Date('2024-12-16'),
    deliveryAddress: '123 Main St, Downtown',
    notes: 'Cancelled due to design changes',
  },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4 text-blue-600" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ExclamationTriangleIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'default';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const renderOrderCard = (order: any) => (
    <CardWidget
      key={order.id}
      title={order.orderNumber}
      content={
        <div className="space-y-3">
          <div className="flex justify-end mb-3">
            <Badge variant={getStatusVariant(order.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Supplier:</span>
              <div className="font-medium">{order.supplierName}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Project:</span>
              <div className="font-medium">{order.projectName}</div>
            </div>
          </div>
          
          <div className="border-t border-border pt-3">
            <div className="text-sm text-muted-foreground mb-2">Items:</div>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.quantity} {item.unit}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{order.items.length - 2} more items
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <div>
              <span className="text-muted-foreground text-sm">Total:</span>
              <div className="font-bold text-lg">{formatCurrency(order.totalAmount)}</div>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground text-sm">Expected:</span>
              <div className="font-medium">{formatDate(order.expectedDelivery)}</div>
            </div>
          </div>
        </div>
      }
      actions={
        <div className="flex space-x-2">
          <Link href={`/orders/${order.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          {order.status === 'pending' && (
            <Button size="sm" variant="success">
              Confirm
            </Button>
          )}
        </div>
      }
    />
  );

  // Calculate stats
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
  const confirmedOrders = mockOrders.filter(o => o.status === 'confirmed').length;
  const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length;
  const totalValue = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage material orders and deliveries</p>
          </div>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setCreateOrderOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Order</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CardWidget
            title="Total Orders"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold">{totalOrders}</div>
                <div className="text-xs text-muted-foreground">All time</div>
              </div>
            }
          />
          <CardWidget
            title="Pending"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
                <div className="text-xs text-muted-foreground">Awaiting confirmation</div>
              </div>
            }
          />
          <CardWidget
            title="Confirmed"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{confirmedOrders}</div>
                <div className="text-xs text-muted-foreground">In progress</div>
              </div>
            }
          />
          <CardWidget
            title="Delivered"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{deliveredOrders}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            }
          />
          <CardWidget
            title="Total Value"
            content={
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(totalValue).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            }
          />
        </div>

        {/* Filters and Search */}
        <CardWidget
          title="Filter Orders"
          content={
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search orders, suppliers, or projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          }
        />

        {/* Orders List */}
        <CardWidget
          title={`Orders (${filteredOrders.length})`}
          content={
            <ListWidget
              items={filteredOrders}
              renderItem={renderOrderCard}
              emptyState={
                <div className="text-center py-12">
                  <TruckIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'all' 
                      ? "You haven't placed any orders yet." 
                      : `No ${filter} orders found.`}
                  </p>
                  <Button onClick={() => setCreateOrderOpen(true)}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create First Order
                  </Button>
                </div>
              }
            />
          }
        />

        {/* Create Order Panel */}
        <CreateOrderPanel
          isOpen={createOrderOpen}
          onClose={() => setCreateOrderOpen(false)}
          onSubmit={(orderData) => {
            console.log('Order created:', orderData);
            // In a real app, you would save to backend here
            // For now, we'll just close the panel
            setCreateOrderOpen(false);
          }}
        />
      </div>
    </Layout>
  );
}