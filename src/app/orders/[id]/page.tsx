'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import { useApp } from '@/lib/context';
import {
  ArrowLeftIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PencilIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';

// Mock orders data (same as in main page)
const mockOrders = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    supplierId: 'sup-1',
    supplierName: 'BuildMart Supply Co.',
    supplierContact: {
      phone: '(555) 123-4567',
      email: 'orders@buildmart.com',
      address: '789 Supply St, Industrial District',
    },
    projectId: 'proj-1',
    projectName: 'Downtown Office Complex',
    items: [
      { id: 1, name: 'Concrete Mix', quantity: 50, unit: 'bags', unitPrice: 12.50, total: 625.00 },
      { id: 2, name: 'Rebar #4', quantity: 100, unit: 'pieces', unitPrice: 8.75, total: 875.00 },
    ],
    totalAmount: 1500.00,
    status: 'pending',
    orderDate: new Date('2024-12-15'),
    expectedDelivery: new Date('2024-12-20'),
    deliveryAddress: '123 Main St, Downtown',
    notes: 'Deliver to construction site entrance',
    createdBy: 'John Smith',
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-002',
    supplierId: 'sup-2',
    supplierName: 'Construction Supply Depot',
    supplierContact: {
      phone: '(555) 987-6543',
      email: 'sales@constructionsupply.com',
      address: '456 Builder Ave, Supply District',
    },
    projectId: 'proj-2',
    projectName: 'Residential Complex Phase 1',
    items: [
      { id: 1, name: 'Lumber 2x4x8', quantity: 200, unit: 'pieces', unitPrice: 6.25, total: 1250.00 },
      { id: 2, name: 'Plywood 4x8', quantity: 50, unit: 'sheets', unitPrice: 45.00, total: 2250.00 },
    ],
    totalAmount: 3500.00,
    status: 'confirmed',
    orderDate: new Date('2024-12-12'),
    expectedDelivery: new Date('2024-12-18'),
    deliveryAddress: '456 Oak Ave, Residential District',
    notes: 'Stack lumber in designated area',
    createdBy: 'Jane Doe',
    updatedAt: new Date('2024-12-13'),
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-003',
    supplierId: 'sup-1',
    supplierName: 'BuildMart Supply Co.',
    supplierContact: {
      phone: '(555) 123-4567',
      email: 'orders@buildmart.com',
      address: '789 Supply St, Industrial District',
    },
    projectId: 'proj-3',
    projectName: 'Warehouse Renovation',
    items: [
      { id: 1, name: 'Steel Beams', quantity: 20, unit: 'pieces', unitPrice: 125.00, total: 2500.00 },
      { id: 2, name: 'Welding Rods', quantity: 10, unit: 'boxes', unitPrice: 35.00, total: 350.00 },
    ],
    totalAmount: 2850.00,
    status: 'delivered',
    orderDate: new Date('2024-12-08'),
    expectedDelivery: new Date('2024-12-14'),
    deliveryAddress: '789 Industrial Blvd, Warehouse District',
    notes: 'Delivered and signed for',
    createdBy: 'Mike Johnson',
    updatedAt: new Date('2024-12-14'),
  },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'activity'>('details');

  // Find the order by ID
  const order = mockOrders.find(o => o.id === params.id);

  if (!order) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
          <Link href="/orders" className="mt-4 inline-block">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircleIcon className="w-5 h-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
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

  const tabs = [
    { id: 'details', label: 'Order Details' },
    { id: 'items', label: `Items (${order.items.length})` },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back to Orders</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
              <Badge variant={getStatusVariant(order.status)}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Order for {order.projectName} • {formatDate(order.orderDate)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Print
            </Button>
            {order.status === 'pending' && (
              <>
                <Button variant="outline">
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button>
                  Confirm Order
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardWidget
            title="Total Amount"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {formatCurrency(order.totalAmount)}
                  </div>
                  <div className="text-xs text-muted-foreground">Order value</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Expected Delivery"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{formatDate(order.expectedDelivery)}</div>
                  <div className="text-xs text-muted-foreground">Delivery date</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Items"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <DocumentIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{order.items.length}</div>
                  <div className="text-xs text-muted-foreground">Line items</div>
                </div>
              </div>
            }
          />

          <CardWidget
            title="Supplier"
            content={
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <TruckIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-bold">{order.supplierName}</div>
                  <div className="text-xs text-muted-foreground">Supplier</div>
                </div>
              </div>
            }
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'details' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <CardWidget
                title="Order Information"
                content={
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Order Number:</span>
                        <div className="font-medium">{order.orderNumber}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="font-medium capitalize">{order.status}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order Date:</span>
                        <div className="font-medium">{formatDate(order.orderDate)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Delivery:</span>
                        <div className="font-medium">{formatDate(order.expectedDelivery)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created By:</span>
                        <div className="font-medium">{order.createdBy}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated:</span>
                        <div className="font-medium">{formatDate(order.updatedAt)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Project:</span>
                      <div className="font-medium">{order.projectName}</div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <div className="font-medium flex items-start space-x-2">
                        <MapPinIcon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    </div>
                    
                    {order.notes && (
                      <div>
                        <span className="text-muted-foreground">Notes:</span>
                        <div className="font-medium">{order.notes}</div>
                      </div>
                    )}
                  </div>
                }
              />

              <CardWidget
                title="Supplier Information"
                content={
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground">Company:</span>
                      <div className="font-medium text-lg">{order.supplierName}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>
                        <div className="font-medium">{order.supplierContact.phone}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <div className="font-medium">{order.supplierContact.email}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Address:</span>
                        <div className="font-medium">{order.supplierContact.address}</div>
                      </div>
                    </div>
                  </div>
                }
                actions={
                  <Button size="sm" variant="outline">
                    Contact Supplier
                  </Button>
                }
              />
            </div>
          )}

          {activeTab === 'items' && (
            <CardWidget
              title="Order Items"
              content={
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Item</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Quantity</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Unit Price</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b border-border/50">
                            <td className="py-3 px-2">
                              <div className="font-medium">{item.name}</div>
                            </td>
                            <td className="py-3 px-2 text-right">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="py-3 px-2 text-right font-medium">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-border">
                          <td colSpan={3} className="py-3 px-2 text-right font-medium">
                            Total Amount:
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-lg">
                            {formatCurrency(order.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              }
            />
          )}

          {activeTab === 'activity' && (
            <CardWidget
              title="Order Activity"
              content={
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium">Order Created</div>
                      <div className="text-sm text-muted-foreground">
                        Order {order.orderNumber} was created by {order.createdBy}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(order.orderDate)}
                      </div>
                    </div>
                  </div>

                  {order.status !== 'pending' && (
                    <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Confirmed</div>
                        <div className="text-sm text-muted-foreground">
                          Order was confirmed by supplier
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(order.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <div className="flex items-start space-x-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">Order Delivered</div>
                        <div className="text-sm text-muted-foreground">
                          Order was successfully delivered to the site
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(order.expectedDelivery)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )}
        </div>
      </div>
    </Layout>
  );
}