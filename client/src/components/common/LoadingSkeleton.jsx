import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="bg-[#0B1712] border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full animate-pulse">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-24 bg-white/5 rounded" />
          <div className="h-4 w-16 bg-white/5 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded" />
        </div>
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="h-4 w-40 bg-white/5 rounded" />
          <div className="h-4 w-48 bg-white/5 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/10">
        <div className="h-9 flex-1 bg-white/5 rounded-lg" />
        <div className="h-9 w-24 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
};

export const FeaturedEventSkeleton = () => {
  return (
    <div className="bg-[#0B1712] border border-white/10 rounded-2xl p-6 sm:p-8 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-28 bg-white/10 rounded" />
        <div className="h-5 w-24 bg-white/5 rounded" />
      </div>
      <div className="h-9 w-2/3 bg-white/10 rounded mb-4" />
      <div className="h-4 w-full max-w-2xl bg-white/5 rounded mb-2" />
      <div className="h-4 w-4/5 max-w-xl bg-white/5 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#101D17]/60 mb-6">
        <div className="h-10 bg-white/5 rounded" />
        <div className="h-10 bg-white/5 rounded" />
        <div className="h-10 bg-white/5 rounded" />
      </div>
      <div className="h-11 w-44 bg-white/10 rounded-lg" />
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-white/5 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-white/5 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};
