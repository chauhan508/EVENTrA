import React from 'react';

const StatsCard = ({ title, value, icon: Icon, subtitle, trendColor = 'text-emerald-400' }) => {
  return (
    <div className="bg-[#121216] border border-zinc-800 rounded-xl p-5 relative overflow-hidden transition-all hover:border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
          {title}
        </p>
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
          <Icon className="w-4 h-4 text-[#FF4D2E]" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
      </div>
      {subtitle && <p className="text-[11px] text-zinc-400 mt-1.5">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
