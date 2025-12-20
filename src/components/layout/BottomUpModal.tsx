'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BottomUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const BottomUpModal: React.FC<BottomUpModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'lg',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const heightClasses = {
    sm: 'max-h-[40vh]',
    md: 'max-h-[60vh]',
    lg: 'max-h-[80vh]',
    xl: 'max-h-[90vh]',
    full: 'max-h-[95vh]',
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Up Modal */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-border',
          'transition-transform duration-300 ease-out',
          'flex flex-col rounded-t-2xl',
          heightClasses[maxHeight],
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header with drag handle and close button */}
        <div className="flex-shrink-0">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            {title && (
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            )}
            <div className={cn("flex-1", !title && "flex justify-end")}>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomUpModal;