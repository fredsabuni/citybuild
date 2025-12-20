'use client';

import React, { useState, useRef } from 'react';
import { BottomUpModal } from '@/components/layout';
import { Button } from '@/components/ui';
import { generateId } from '@/lib/utils';
import {
  ArrowDownTrayIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface ImportItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: any[]) => void;
}

export const ImportItemsModal: React.FC<ImportItemsModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleData = `SKU,Name,Category,Description,Current Stock,Min Stock,Max Stock,Unit,Unit Price,Supplier,Location
CON-MIX-001,Concrete Mix - Standard,Concrete & Cement,High-quality concrete mix for general construction,150,50,500,bags,12.50,BuildMart Supply Co.,Warehouse A - Section 1
REB-004-001,Rebar #4 - 20ft,Steel & Metal,Grade 60 rebar 20 feet length,25,30,200,pieces,8.75,Steel Solutions Inc.,Yard B - Section 3
LUM-2X4-008,Lumber 2x4x8 - Pine,Lumber & Wood,Kiln-dried pine lumber construction grade,0,100,1000,pieces,6.25,Forest Products Ltd.,Warehouse C - Section 2`;

  const downloadSample = () => {
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['SKU', 'Name', 'Category', 'Current Stock', 'Min Stock', 'Max Stock', 'Unit', 'Unit Price'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const data = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      // Validate required fields
      if (!row.SKU) errors.push(`Row ${i + 1}: SKU is required`);
      if (!row.Name) errors.push(`Row ${i + 1}: Name is required`);
      if (!row.Category) errors.push(`Row ${i + 1}: Category is required`);
      if (!row.Unit) errors.push(`Row ${i + 1}: Unit is required`);

      // Validate numeric fields
      const currentStock = parseFloat(row['Current Stock']);
      const minStock = parseFloat(row['Min Stock']);
      const maxStock = parseFloat(row['Max Stock']);
      const unitPrice = parseFloat(row['Unit Price']);

      if (isNaN(currentStock) || currentStock < 0) {
        errors.push(`Row ${i + 1}: Invalid Current Stock`);
      }
      if (isNaN(minStock) || minStock < 0) {
        errors.push(`Row ${i + 1}: Invalid Min Stock`);
      }
      if (isNaN(maxStock) || maxStock <= 0) {
        errors.push(`Row ${i + 1}: Invalid Max Stock`);
      }
      if (isNaN(unitPrice) || unitPrice <= 0) {
        errors.push(`Row ${i + 1}: Invalid Unit Price`);
      }

      if (minStock >= maxStock) {
        errors.push(`Row ${i + 1}: Min Stock must be less than Max Stock`);
      }

      if (errors.length === 0 || errors.length < 5) { // Don't add if too many errors
        data.push({
          id: generateId(),
          sku: row.SKU.toUpperCase(),
          name: row.Name,
          category: row.Category,
          description: row.Description || `${row.Name} - ${row.Category}`,
          currentStock,
          minStock,
          maxStock,
          unit: row.Unit,
          unitPrice,
          totalValue: currentStock * unitPrice,
          supplier: row.Supplier || 'Unknown Supplier',
          location: row.Location || 'Warehouse - General',
          lastRestocked: new Date(),
          status: currentStock <= minStock ? (currentStock === 0 ? 'out_of_stock' : 'low_stock') : 'in_stock',
        });
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.slice(0, 10).join('\n')); // Show first 10 errors
    }

    return data;
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error('No valid data found in the file');
      }

      setImportData(data);
      setStep('preview');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to process file']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onImport(importData);
      setStep('complete');
      
      setTimeout(() => {
        onClose();
        resetModal();
      }, 2000);
    } catch (error) {
      setErrors(['Failed to import items']);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setImportData([]);
    setErrors([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  return (
    <BottomUpModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Inventory Items"
      maxHeight="xl"
    >
      <div className="space-y-6">
        {step === 'upload' && (
          <>
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Import Instructions</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                    <li>• Upload a CSV file with inventory data</li>
                    <li>• Required columns: SKU, Name, Category, Current Stock, Min Stock, Max Stock, Unit, Unit Price</li>
                    <li>• Optional columns: Description, Supplier, Location</li>
                    <li>• Download the sample file below to see the correct format</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sample Download */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={downloadSample}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <DocumentArrowUpIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Upload CSV File</p>
                  <p className="text-sm text-muted-foreground">
                    Select a CSV file containing your inventory data
                  </p>
                </div>
                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </div>
                {file && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200">Import Errors</h4>
                      <div className="text-sm text-red-700 dark:text-red-300 mt-2">
                        {errors.map((error, index) => (
                          <div key={index} className="whitespace-pre-line">{error}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={processFile} 
                disabled={!file || isProcessing} 
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Process File'
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview Import Data</h3>
                <div className="text-sm text-muted-foreground">
                  {importData.length} items ready to import
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium">SKU</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-left p-3 font-medium">Stock</th>
                      <th className="text-left p-3 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importData.map((item, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-3 font-mono text-xs">{item.sku}</td>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-muted-foreground">{item.category}</td>
                        <td className="p-3">{item.currentStock} {item.unit}</td>
                        <td className="p-3">${item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setStep('upload')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleImport} disabled={isProcessing} className="flex-1">
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Import {importData.length} Items
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Import Successful!</h3>
            <p className="text-muted-foreground">
              {importData.length} items have been added to your inventory.
            </p>
          </div>
        )}
      </div>
    </BottomUpModal>
  );
};