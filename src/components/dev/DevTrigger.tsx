'use client';

import React, { useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import DevPanel from './DevPanel';

export const DevTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only show in development mode
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev) return null;

  return (
    <>
      {/* Floating dev button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors border-2 border-primary"
        title="Open Development Panel"
      >
        <BeakerIcon className="w-5 h-5" />
      </button>

      {/* Dev panel */}
      <DevPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default DevTrigger;