'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn, validateFileType, formatFileSize } from '@/lib/utils';
import { Button, Badge } from '@/components/ui';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  error?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  acceptedTypes = ['pdf', 'dwg', 'dxf'],
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!validateFileType(file, acceptedTypes)) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      return `File size too large. Maximum size: ${formatFileSize(maxSize)}`;
    }
    
    return null;
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles: UploadedFile[] = [];
    
    fileArray.forEach((file) => {
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        return;
      }
      
      const error = validateFile(file);
      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substring(7),
        error,
      };
      
      // Create preview for images (though we're mainly dealing with PDFs/CAD files)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
      
      newFiles.push(uploadedFile);
    });
    
    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    
    // Only pass valid files to parent
    const validFiles = updatedFiles
      .filter(f => !f.error)
      .map(f => f.file);
    onFilesChange(validFiles);
  }, [uploadedFiles, maxFiles, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [disabled, processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(updatedFiles);
    
    const validFiles = updatedFiles
      .filter(f => !f.error)
      .map(f => f.file);
    onFilesChange(validFiles);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'dwg':
      case 'dxf':
        return '📐';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          'hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          isDragOver && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          !isDragOver && 'border-border'
        )}
      >
        <CloudArrowUpIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {isDragOver ? 'Drop files here' : 'Upload building plans'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: {acceptedTypes.join(', ').toUpperCase()} • 
            Max {maxFiles} files • Max {formatFileSize(maxSize)} each
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          Choose Files
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.map(type => `.${type}`).join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h4>
          
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className={cn(
                  'flex items-center space-x-3 p-3 border rounded-lg',
                  uploadedFile.error ? 'border-destructive bg-destructive/5' : 'border-border'
                )}
              >
                <div className="text-2xl">
                  {getFileIcon(uploadedFile.file)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </span>
                    {!uploadedFile.error && (
                      <Badge variant="success" className="text-xs">
                        Valid
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(uploadedFile.file.size)}</span>
                    <span>•</span>
                    <span>{uploadedFile.file.type || 'Unknown type'}</span>
                  </div>
                  
                  {uploadedFile.error && (
                    <div className="flex items-center space-x-1 text-xs text-destructive mt-1">
                      <ExclamationTriangleIcon className="w-3 h-3" />
                      <span>{uploadedFile.error}</span>
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(uploadedFile.id)}
                  className="w-8 h-8 text-muted-foreground hover:text-destructive"
                >
                  <XMarkIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading files...</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '75%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;