import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentStatusBadge({ status, size = 'md' }: PaymentStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: ClockIcon,
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
          iconColor: 'text-yellow-500'
        };
      case 'processing':
        return {
          icon: null,
          label: 'Processing',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          iconColor: 'text-blue-500'
        };
      case 'completed':
        return {
          icon: CheckCircleIcon,
          label: 'Completed',
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          iconColor: 'text-green-500'
        };
      case 'failed':
        return {
          icon: ExclamationTriangleIcon,
          label: 'Failed',
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          iconColor: 'text-red-500'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}>
      {status === 'processing' ? (
        <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${iconSizes[size]}`} />
      ) : IconComponent ? (
        <IconComponent className={`${iconSizes[size]} ${config.iconColor}`} />
      ) : null}
      <span>{config.label}</span>
    </div>
  );
}