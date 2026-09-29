import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between h-full animate-pulse">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-24 bg-zinc-800 rounded" />
          <div className="h-4 w-16 bg-zinc-800/80 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-zinc-800 rounded mb-3" />
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-zinc-800/60 rounded" />
          <div className="h-4 w-5/6 bg-zinc-800/60 rounded" />
        </div>
        <div className="space-y-2 pt-2 border-t border-zinc-800/60">
          <div className="h-4 w-40 bg-zinc-800/40 rounded" />
          <div className="h-4 w-48 bg-zinc-800/40 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-6 mt-4 border-t border-zinc-800/60">
        <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
        <div className="h-9 w-24 bg-zinc-800 rounded-lg" />
      </div>
    </div>
  );
};

export const FeaturedEventSkeleton = () => {
  return (
    <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 sm:p-8 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-28 bg-zinc-800 rounded" />
        <div className="h-5 w-24 bg-zinc-800 rounded" />
      </div>
      <div className="h-9 w-2/3 bg-zinc-800 rounded mb-4" />
      <div className="h-4 w-full max-w-2xl bg-zinc-800/70 rounded mb-2" />
      <div className="h-4 w-4/5 max-w-xl bg-zinc-800/70 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-900/50 mb-6">
        <div className="h-10 bg-zinc-800/50 rounded" />
        <div className="h-10 bg-zinc-800/50 rounded" />
        <div className="h-10 bg-zinc-800/50 rounded" />
      </div>
      <div className="h-11 w-44 bg-zinc-800 rounded-lg" />
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-zinc-800/60 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-zinc-800/70 rounded w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};
