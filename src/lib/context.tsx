'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AppState } from '@/types';

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  updateUserRole: (role: User['role']) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null, // Will be loaded from localStorage
    theme: 'light',
    sidebarOpen: false,
  });

  // Initialize theme and user on mount
  useEffect(() => {
    // Helper function to safely access localStorage
    const getFromStorage = (key: string): string | null => {
      try {
        return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      } catch (error) {
        console.warn(`Failed to read from localStorage: ${error}`);
        return null;
      }
    };

    const setToStorage = (key: string, value: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn(`Failed to write to localStorage: ${error}`);
      }
    };

    // Load theme
    const savedTheme = getFromStorage('theme') as 'light' | 'dark' | null;
    const currentTheme = savedTheme || 'light'; // Default to light mode
    
    
    // Load user from localStorage or set default
    const savedUser = getFromStorage('citybuild-user');
    let currentUser: User;
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure createdAt is a Date object
        currentUser = {
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt)
        };
      } catch (error) {
        console.error('Error parsing saved user:', error);
        currentUser = getDefaultUser();
      }
    } else {
      currentUser = getDefaultUser();
    }
    
    setState(prev => ({ 
      ...prev, 
      theme: currentTheme,
      user: currentUser
    }));
    
    console.log('✅ User role loaded from storage:', currentUser.role, currentUser.name);
    
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    }
    
    // Save the user to localStorage if it wasn't already there
    if (!savedUser) {
      setToStorage('citybuild-user', JSON.stringify(currentUser));
    }
  }, []);

  // Helper function to get default user
  const getDefaultUser = (): User => ({
    id: 'demo-gc-1',
    name: 'Demo User',
    email: 'demo@citybuild.com',
    role: 'gc',
    phone: '+1 (555) 123-4567',
    verified: true,
    createdAt: new Date(),
  });

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
    
    // Persist user to localStorage
    try {
      if (user && typeof window !== 'undefined') {
        localStorage.setItem('citybuild-user', JSON.stringify(user));
        console.log('✅ User role persisted:', user.role, user.name);
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('citybuild-user');
        console.log('✅ User data cleared from storage');
      }
    } catch (error) {
      console.warn('Failed to persist user to localStorage:', error);
    }
  };

  // Helper function to update just the user role while keeping other properties
  const updateUserRole = (role: User['role']) => {
    if (state.user) {
      const updatedUser = { ...state.user, role };
      setUser(updatedUser);
    }
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme: newTheme }));
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    } catch (error) {
      console.warn('Failed to persist theme to localStorage:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const setSidebarOpen = (open: boolean) => {
    setState(prev => ({ ...prev, sidebarOpen: open }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  const value: AppContextType = {
    ...state,
    setUser,
    updateUserRole,
    setTheme,
    toggleTheme,
    setSidebarOpen,
    toggleSidebar,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Theme hook for easier theme management
export function useTheme() {
  const { theme, setTheme, toggleTheme } = useApp();
  return { theme, setTheme, toggleTheme };
}