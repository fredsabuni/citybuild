import React from 'react';
import { cn } from '@/lib/utils';
import { ListWidgetProps } from '@/types';

function ListWidget<T>({
  items,
  renderItem,
  emptyState,
  loading = false,
  className,
}: ListWidgetProps<T>) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Loading skeleton */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-card border-2 border-border rounded-lg p-4 space-y-3"
          >
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
            <div className="h-3 bg-muted-foreground/20 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn('text-center py-12 bg-card rounded-lg border-2 border-border', className)}>
        {emptyState || (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center border-2 border-border">
              <span className="text-2xl text-muted-foreground">📋</span>
            </div>
            <h3 className="text-lg font-medium text-foreground">No items found</h3>
            <p className="text-muted-foreground">
              There are no items to display at the moment.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="transition-all duration-200 hover:scale-[1.02]"
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default ListWidget;