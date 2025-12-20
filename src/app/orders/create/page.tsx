'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { CardWidget } from '@/components/widgets';
import { Button } from '@/components/ui';
import OrderForm from '@/components/orders/OrderForm';
import { useApp } from '@/lib/context';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateOrderPage() {
  const router = useRouter();
  const { user } = useApp();
  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async (orderData: any) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Order created:', orderData);
      
      // In a real app, you would save to backend here
      // For now, we'll just redirect back to orders
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/orders');
  };

  // Check if user is authorized to create orders
  if (!user || (user.role !== 'gc' && user.role !== 'supplier')) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <CardWidget
            title="Access Denied"
            content={
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                <p className="text-muted-foreground">
                  Only General Contractors and Suppliers can create orders.
                </p>
              </div>
            }
          />
        </div>
      </Layout>
    );
  }

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
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create New Order</h1>
          <p className="text-muted-foreground mt-2">
            Place an order for materials and supplies for your construction project
          </p>
        </div>

        {/* Order Form */}
        <CardWidget
          title=""
          content={
            <OrderForm
              onSubmit={handleOrderSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          }
        />
      </div>
    </Layout>
  );
}