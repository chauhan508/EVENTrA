import React from 'react';
import { CalendarX, RefreshCw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No events found',
  description = 'Try adjusting your search query or changing selected filters.',
  actionLabel = 'Reset Filters',
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-[#0B1712]/50 my-6">
      <div className="w-12 h-12 rounded-xl bg-[#101D17] border border-white/10 flex items-center justify-center text-[#8F9B94] mb-4">
        <Icon className="w-6 h-6 text-[#8F9B94]" />
      </div>
      <h3 className="text-lg font-semibold text-[#F5F7F4] mb-1">{title}</h3>
      <p className="text-sm text-[#8F9B94] max-w-sm mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#101D17] hover:bg-white/10 text-[#F5F7F4] border border-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
