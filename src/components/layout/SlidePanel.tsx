'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
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

  const slideDirection = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
      position: 'left-0',
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      position: 'right-0',
    },
  };

  // Animation variants for overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Animation variants for panel
  const panelVariants = {
    hidden: slideDirection[direction].initial,
    visible: slideDirection[direction].animate,
    exit: slideDirection[direction].exit,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
              aria-hidden="true"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          )}

          {/* Slide Panel */}
          <motion.div
            className={cn(
              'fixed top-0 bottom-0 z-50 bg-card border-border',
              'flex flex-col shadow-xl',
              slideDirection[direction].position,
              widthClasses[width],
            )}
            role="dialog"
            aria-modal="true"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ 
              duration: 0.3, 
              ease: easeInOut
            }}
          >
            {/* Close button */}
            <motion.div 
              className="flex items-center justify-between p-4 border-b-2 border-border bg-secondary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex-1" />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-foreground"
                aria-label="Close panel"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Content */}
            <motion.div 
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlidePanel;