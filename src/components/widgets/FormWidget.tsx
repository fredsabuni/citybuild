import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FormWidgetProps, FormField } from '@/types';

const FormWidget: React.FC<FormWidgetProps> = ({
  fields,
  onSubmit,
  loading = false,
  className,
  initialData = {},
  submitText = 'Submit',
  onFieldChange,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { pattern, minLength, maxLength, custom } = field.validation;

      if (pattern && value && !pattern.test(value)) {
        return `${field.label} format is invalid`;
      }

      if (minLength && value && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }

      if (maxLength && value && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`;
      }

      if (custom && value) {
        const customError = custom(value);
        if (customError) return customError;
      }
    }

    return null;
  };

  const handleInputChange = (field: FormField, value: any) => {
    const newData = { ...formData, [field.name]: value };
    setFormData(newData);
    
    // Call parent's field change handler if provided
    if (onFieldChange) {
      onFieldChange(field.name, value, newData);
    }
    
    // Clear error when user starts typing
    if (errors[field.name]) {
      setErrors(prev => ({ ...prev, [field.name]: '' }));
    }
  };

  const handleBlur = (field: FormField) => {
    setTouched(prev => ({ ...prev, [field.name]: true }));
    
    const value = formData[field.name];
    const error = validateField(field, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    
    // Validate all fields
    fields.forEach(field => {
      newTouched[field.name] = true;
      const value = formData[field.name];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = touched[field.name] ? errors[field.name] : '';
    const hasError = !!error;

    const baseInputClasses = cn(
      'w-full px-3 py-2 border-2 rounded-md transition-colors bg-background',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      hasError
        ? 'border-destructive focus:ring-destructive/20'
        : 'border-input hover:border-border focus:ring-primary/20'
    );

    switch (field.type) {
      case 'select':
        return (
          <select
            className={baseInputClasses}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            disabled={loading}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            className={cn(baseInputClasses, 'min-h-[100px] resize-vertical')}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            disabled={loading}
            rows={4}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            className={cn(
              baseInputClasses,
              'file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0',
              'file:text-sm file:font-medium file:bg-primary file:text-primary-foreground',
              'hover:file:bg-primary/90'
            )}
            onChange={(e) => handleInputChange(field, e.target.files?.[0])}
            onBlur={() => handleBlur(field)}
            disabled={loading}
            accept={field.type === 'file' ? '.pdf,.dwg,.dxf' : undefined}
          />
        );

      default:
        return (
          <input
            type={field.type}
            className={baseInputClasses}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            disabled={loading}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="block text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          
          {renderField(field)}
          
          {touched[field.name] && errors[field.name] && (
            <p className="text-sm text-destructive">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full px-4 py-2 bg-primary text-primary-foreground rounded-2xl border-2 border-primary',
          'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring',
          'disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg',
          'transition-colors duration-200'
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          submitText
        )}
      </button>
    </form>
  );
};

export default FormWidget;