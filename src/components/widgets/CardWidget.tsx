import React from 'react';
import { cn } from '@/lib/utils';
import { CardWidgetProps } from '@/types';

const CardWidget: React.FC<CardWidgetProps> = ({
  title,
  content,
  actions,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-card text-card-foreground border-border',
    highlighted: 'bg-card text-card-foreground border-primary/30 ring-2 ring-primary/20',
    warning: 'bg-card text-card-foreground border-destructive/30 ring-2 ring-destructive/20',
  };

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-6 shadow-sm transition-all duration-200',
        'hover:shadow-md hover:border-primary/40',
        variantStyles[variant],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>

      {/* Content */}
      <div className="text-card-foreground">{content}</div>
    </div>
  );
};

export default CardWidget;