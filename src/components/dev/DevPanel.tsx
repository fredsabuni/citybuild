'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { DevUtils, DataGenerator } from '@/data';
import {
  CogIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BeakerIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface DevPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevPanel: React.FC<DevPanelProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [importData, setImportData] = useState('');

  if (!isOpen) return null;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGenerateData = async () => {
    setLoading(true);
    try {
      const data = DataGenerator.generateCompleteDataset({
        numGCs: 5,
        numSubcontractors: 15,
        numSuppliers: 5,
        numBanks: 3,
        projectsPerGC: 4,
        bidsPerProject: 4,
        notificationsPerUser: 8,
      });
      
      // Save to localStorage
      const { UserStorage, ProjectStorage, BidStorage, NotificationStorage } = await import('@/data/localStorage');
      UserStorage.setUsers(data.users);
      ProjectStorage.setProjects(data.projects);
      BidStorage.setBids(data.bids);
      NotificationStorage.setNotifications(data.notifications);
      
      showMessage(`Generated ${data.users.length} users, ${data.projects.length} projects, ${data.bids.length} bids, ${data.notifications.length} notifications`);
    } catch (error) {
      showMessage('Error generating data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    setLoading(true);
    try {
      await DevUtils.resetToInitialData();
      showMessage('Data reset to initial state');
    } catch (error) {
      showMessage('Error resetting data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      await DevUtils.clearAllData();
      showMessage('All data cleared');
    } catch (error) {
      showMessage('Error clearing data: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = DevUtils.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `citybuild-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('Data exported successfully');
    } catch (error) {
      showMessage('Error exporting data: ' + (error as Error).message);
    }
  };

  const handleImportData = () => {
    try {
      DevUtils.importData(importData);
      setImportData('');
      showMessage('Data imported successfully');
    } catch (error) {
      showMessage('Error importing data: ' + (error as Error).message);
    }
  };

  const handleValidateData = async () => {
    try {
      const validation = await DevUtils.validateDataIntegrity();
      if (validation.isValid) {
        showMessage(`Data is valid. Stats: ${JSON.stringify(validation.stats)}`);
      } else {
        showMessage(`Data validation failed: ${validation.issues.length} issues found`);
        console.log('Validation issues:', validation.issues);
      }
    } catch (error) {
      showMessage('Error validating data: ' + (error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-card rounded-lg border-2 border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <BeakerIcon className="w-6 h-6 mr-2" />
                Development Panel
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Data Generation */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <CogIcon className="w-5 h-5 mr-2" />
                  Data Management
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleGenerateData}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Generate Test Data
                  </Button>
                  <Button
                    onClick={handleResetData}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Reset to Initial
                  </Button>
                  <Button
                    onClick={handleClearData}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Clear All Data
                  </Button>
                  <Button
                    onClick={handleValidateData}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <ChartBarIcon className="w-4 h-4 mr-1" />
                    Validate Data
                  </Button>
                </div>
              </div>

              {/* Import/Export */}
              <div className="space-y-3">
                <h3 className="font-semibold">Import/Export</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  
                  <div className="space-y-2">
                    <textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Paste JSON data to import..."
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                    />
                    <Button
                      onClick={handleImportData}
                      disabled={!importData.trim()}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>

              {/* Development Info */}
              <div className="space-y-3">
                <h3 className="font-semibold">Development Info</h3>
                <div className="p-3 bg-secondary rounded-md text-sm">
                  <p className="mb-2">
                    <strong>Environment:</strong> {process.env.NODE_ENV}
                  </p>
                  <p className="mb-2">
                    <strong>Console Access:</strong> window.CityBuildDevUtils
                  </p>
                  <p>
                    <strong>Storage:</strong> Data persisted in localStorage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevPanel;