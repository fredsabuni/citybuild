'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SlidePanelProps } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SlidePanel: React.FC<SlidePanelProps> = ({
  isOpen,
  onClose,
  direction,
  width = 'md',
  overlay = true,
  children,
}) => {
  // Lock body scroll when panel is open
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

  const widthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-[600px] max-w-[85vw]',
  };

  const slideClasses = {
    left: {
      panel: 'left-0',
      transform: isOpen ? 'translate-x-0' : '-translate-x-full',
    },
    right: {
      panel: 'right-0',
      transform: isOpen ? 'translate-x-0' : 'translate-x-full',
    },
  };

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className={cn(
            'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide Panel */}
      <div
        className={cn(
          'fixed top-0 bottom-0 z-50 bg-card border-border',
          'transition-transform duration-300 ease-in-out',
          'flex flex-col shadow-xl',
          widthClasses[width],
          slideClasses[direction].panel,
          slideClasses[direction].transform,
          direction === 'left' ? 'border-r-2' : 'border-l-2'
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border bg-secondary">
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-foreground"
            aria-label="Close panel"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default SlidePanel;