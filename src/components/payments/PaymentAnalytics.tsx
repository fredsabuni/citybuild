'use client';

import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface PaymentAnalyticsProps {
  className?: string;
}

export function PaymentAnalytics({ className = '' }: PaymentAnalyticsProps) {
  // Mock analytics data
  const analytics = {
    monthlyVolume: {
      current: 156800,
      previous: 142300,
      change: 10.2
    },
    averagePaymentTime: {
      current: 2.3,
      previous: 3.1,
      change: -25.8
    },
    paymentMethods: [
      { method: 'ACH Transfer', percentage: 45, amount: 70560 },
      { method: 'Wire Transfer', percentage: 30, amount: 47040 },
      { method: 'Credit Card', percentage: 15, amount: 23520 },
      { method: 'Check', percentage: 10, amount: 15680 }
    ],
    monthlyTrend: [
      { month: 'Jul', amount: 125000 },
      { month: 'Aug', amount: 138000 },
      { month: 'Sep', amount: 142300 },
      { month: 'Oct', amount: 156800 },
      { month: 'Nov', amount: 148200 },
      { month: 'Dec', amount: 162500 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 border border-blue-200 dark:border-blue-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              analytics.monthlyVolume.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.monthlyVolume.change > 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span>{formatPercentage(analytics.monthlyVolume.change)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
            {formatCurrency(analytics.monthlyVolume.current)}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Monthly Payment Volume
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50 border border-green-200 dark:border-green-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              analytics.averagePaymentTime.change < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.averagePaymentTime.change < 0 ? (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              )}
              <span>{formatPercentage(Math.abs(analytics.averagePaymentTime.change))}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
            {analytics.averagePaymentTime.current} days
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">
            Average Payment Time
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-900/50 border border-purple-200 dark:border-purple-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">%</span>
            </div>
            <div className="text-sm font-medium text-green-600">
              <ArrowTrendingUpIcon className="w-4 h-4 inline mr-1" />
              +5.2%
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
            98.5%
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">
            Success Rate
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Payment Methods Distribution</h3>
        <div className="space-y-4">
          {analytics.paymentMethods.map((method, index) => (
            <div key={method.method} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' :
                  index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <span className="font-medium">{method.method}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(method.amount)}</div>
                  <div className="text-sm text-muted-foreground">{method.percentage}%</div>
                </div>
                <div className="w-24 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Payment Volume Trend</h3>
        <div className="flex items-end justify-between h-40 space-x-2">
          {analytics.monthlyTrend.map((data, index) => {
            const maxAmount = Math.max(...analytics.monthlyTrend.map(d => d.amount));
            const height = (data.amount / maxAmount) * 100;
            
            return (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-2">
                    {formatCurrency(data.amount / 1000)}k
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-purple-600"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="text-sm font-medium mt-2 text-muted-foreground">
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}