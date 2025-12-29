'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastContainer } from '@/components/notifications';

interface NotificationContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Convenience hooks for different toast types
export const useToast = () => {
  const { showToast } = useNotifications();

  return {
    success: (title: string, message: string, action?: Toast['action']) =>
      showToast({ title, message, type: 'success', duration: 6000, action }),
    
    error: (title: string, message: string, action?: Toast['action']) =>
      showToast({ title, message, type: 'error', duration: 10000, action }),
    
    warning: (title: string, message: string, action?: Toast['action']) =>
      showToast({ title, message, type: 'warning', duration: 8000, action }),
    
    info: (title: string, message: string, action?: Toast['action']) =>
      showToast({ title, message, type: 'info', duration: 6000, action }),
  };
};