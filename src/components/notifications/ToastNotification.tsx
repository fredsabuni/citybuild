'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-dismiss after duration
    if (toast.duration && toast.duration > 0) {
      const dismissTimer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(dismissTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-white" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-white" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-white" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-white" />;
    }
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500 border-green-600 text-white';
      case 'warning':
        return 'bg-orange-500 border-orange-600 text-white';
      case 'error':
        return 'bg-red-500 border-red-600 text-white';
      default:
        return 'bg-blue-500 border-blue-600 text-white';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className={`
        rounded-lg shadow-lg p-4 mb-3 border-2
        max-w-sm w-full
        ${getToastStyles()}
      `}>
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">
              {toast.title}
            </h4>
            <p className="text-sm text-white/90 mt-1">
              {toast.message}
            </p>
            
            {/* Action Button */}
            {toast.action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toast.action.onClick}
                  className="text-xs bg-white text-foreground hover:bg-white/90 border-white"
                >
                  {toast.action.label}
                </Button>
              </div>
            )}
          </div>
          
          {/* Close Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClose}
            className="h-6 w-6 p-0 text-white hover:text-white/80 hover:bg-white/20"
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};