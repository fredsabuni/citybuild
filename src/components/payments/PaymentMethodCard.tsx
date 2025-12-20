import { 
  BanknotesIcon, 
  CreditCardIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
  lastUsed?: string;
  status?: 'active' | 'expired' | 'pending';
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit?: (method: PaymentMethod) => void;
  onRemove?: (method: PaymentMethod) => void;
  onSetDefault?: (method: PaymentMethod) => void;
}

export function PaymentMethodCard({ 
  method, 
  onEdit, 
  onRemove, 
  onSetDefault 
}: PaymentMethodCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
            method.type === 'bank' 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-purple-500 to-pink-600'
          }`}>
            {method.type === 'bank' ? (
              <BanknotesIcon className="w-6 h-6 text-white" />
            ) : (
              <CreditCardIcon className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-foreground">{method.name}</h3>
              {method.isDefault && (
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full font-medium">
                  Default
                </span>
              )}
              {method.status && (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(method.status)}`}>
                  {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{method.details}</p>
            {method.lastUsed && (
              <p className="text-xs text-muted-foreground mt-1">
                Last used: {new Date(method.lastUsed).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-muted-foreground" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-10">
              <div className="py-2">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(method);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    Edit Details
                  </button>
                )}
                {onSetDefault && !method.isDefault && (
                  <button
                    onClick={() => {
                      onSetDefault(method);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  View Transactions
                </button>
                <hr className="my-2 border-border" />
                {onRemove && (
                  <button
                    onClick={() => {
                      onRemove(method);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Remove Method
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-border">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
          Use for Payment
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}