'use client';

import React from 'react';
import { CardWidget, ListWidget } from '@/components/widgets';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
  TruckIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const SupplierDashboard: React.FC = () => {
  // Mock supplier data
  const mockOrders = [
    {
      id: 'ord-1',
      projectName: 'Downtown Office Complex',
      items: ['Concrete Mix', 'Rebar', 'Steel Beams'],
      quantity: '500 tons',
      value: 45000,
      status: 'pending',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ord-2',
      projectName: 'Residential Complex Phase 1',
      items: ['Lumber', 'Drywall', 'Insulation'],
      quantity: '200 units',
      value: 28000,
      status: 'shipped',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'ord-3',
      projectName: 'Warehouse Renovation',
      items: ['Electrical Components', 'Wiring', 'Fixtures'],
      quantity: '150 items',
      value: 15000,
      status: 'delivered',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const mockInventory = [
    { id: 1, name: 'Concrete Mix', stock: 1250, unit: 'tons', lowStock: false },
    { id: 2, name: 'Steel Rebar', stock: 45, unit: 'tons', lowStock: true },
    { id: 3, name: 'Lumber 2x4', stock: 890, unit: 'pieces', lowStock: false },
    { id: 4, name: 'Drywall Sheets', stock: 12, unit: 'sheets', lowStock: true },
    { id: 5, name: 'Electrical Wire', stock: 2500, unit: 'feet', lowStock: false },
  ];

  // Calculate statistics
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
  const shippedOrders = mockOrders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = mockOrders.filter(o => o.status === 'delivered').length;
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.value, 0);
  const lowStockItems = mockInventory.filter(i => i.lowStock).length;
  const totalItems = mockInventory.length;

  const renderOrderCard = (order: any) => (
    <CardWidget
      key={order.id}
      title={`Order #${order.id.slice(-4)}`}
      variant={order.status === 'pending' ? 'warning' : 'default'}
      content={
        <div className="space-y-2">
          <div className="font-medium text-sm">{order.projectName}</div>
          <div className="text-xs text-muted-foreground">
            {order.items.join(', ')} • {order.quantity}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">{formatCurrency(order.value)}</span>
            <Badge
              variant={
                order.status === 'delivered'
                  ? 'success'
                  : order.status === 'shipped'
                  ? 'default'
                  : 'warning'
              }
            >
              {order.status}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Due: {order.dueDate.toLocaleDateString()} • 
            Ordered {formatRelativeTime(order.createdAt)}
          </div>
        </div>
      }
      actions={
        <Button size="sm" variant="outline">
          View Details
        </Button>
      }
    />
  );

  const renderInventoryItem = (item: any) => (
    <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${item.lowStock ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          <CubeIcon className={`w-5 h-5 ${item.lowStock ? 'text-red-600' : 'text-green-600'}`} />
        </div>
        <div>
          <div className="font-medium text-sm">{item.name}</div>
          <div className="text-xs text-muted-foreground">
            {item.stock} {item.unit} in stock
          </div>
        </div>
      </div>
      {item.lowStock && (
        <Badge variant="warning">
          Low Stock
        </Badge>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardWidget
          title="Pending Orders"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <div className="text-xs text-muted-foreground">Need processing</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="In Transit"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{shippedOrders}</div>
                <div className="text-xs text-muted-foreground">Being delivered</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Monthly Revenue"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue).replace('.00', '')}</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
            </div>
          }
        />

        <CardWidget
          title="Inventory Status"
          content={
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CubeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalItems - lowStockItems}/{totalItems}</div>
                <div className="text-xs text-muted-foreground">Items in stock</div>
              </div>
            </div>
          }
        />
      </div>

      {/* Quick Actions */}
      <CardWidget
        title="Quick Actions"
        content={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="h-auto p-4 flex-col space-y-2">
              <TruckIcon className="w-6 h-6" />
              <span className="text-sm">Process Orders</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <CubeIcon className="w-6 h-6" />
              <span className="text-sm">Manage Inventory</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <ChartBarIcon className="w-6 h-6" />
              <span className="text-sm">Analytics</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <CurrencyDollarIcon className="w-6 h-6" />
              <span className="text-sm">Receivables</span>
            </Button>
          </div>
        }
      />

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <CardWidget
          title="Inventory Alerts"
          variant="warning"
          content={
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="font-medium">Low Stock Alert</div>
                <div className="text-sm text-muted-foreground">
                  {lowStockItems} item{lowStockItems > 1 ? 's' : ''} running low on stock
                </div>
              </div>
            </div>
          }
          actions={
            <Button size="sm">
              Reorder Items
            </Button>
          }
        />
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <CardWidget
          title="Recent Orders"
          content={
            <ListWidget
              items={mockOrders}
              renderItem={renderOrderCard}
              emptyState={
                <div className="text-center py-8">
                  <TruckIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              }
            />
          }
          actions={
            <Button size="sm" variant="outline">
              View All Orders
            </Button>
          }
        />

        {/* Inventory Overview */}
        <CardWidget
          title="Inventory Overview"
          content={
            <div className="space-y-3">
              {mockInventory.map(renderInventoryItem)}
            </div>
          }
          actions={
            <Button size="sm" variant="outline">
              Manage Inventory
            </Button>
          }
        />
      </div>

      {/* Performance Metrics */}
      <CardWidget
        title="Performance Metrics"
        content={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-lg font-bold">95%</div>
              <div className="text-xs text-muted-foreground">On-time delivery</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TruckIcon className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-lg font-bold">156</div>
              <div className="text-xs text-muted-foreground">Orders fulfilled</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CurrencyDollarIcon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-lg font-bold">$2.4M</div>
              <div className="text-xs text-muted-foreground">Total revenue</div>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <CubeIcon className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <div className="text-lg font-bold">1,247</div>
              <div className="text-xs text-muted-foreground">Items in catalog</div>
            </div>
          </div>
        }
      />

      {/* Recent Activity */}
      <CardWidget
        title="Recent Activity"
        content={
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Order Delivered</div>
                <div className="text-sm text-muted-foreground">
                  Warehouse Renovation materials delivered successfully
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 hour ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Order Shipped</div>
                <div className="text-sm text-muted-foreground">
                  Residential Complex materials en route to site
                </div>
              </div>
              <div className="text-sm text-muted-foreground">3 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">New Order Received</div>
                <div className="text-sm text-muted-foreground">
                  Downtown Office Complex - $45,000 order pending
                </div>
              </div>
              <div className="text-sm text-muted-foreground">1 day ago</div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SupplierDashboard;