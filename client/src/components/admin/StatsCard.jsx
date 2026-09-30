import React from 'react';

const StatsCard = ({ title, value, icon: Icon, subtitle }) => {
  return (
    <div className="bg-[#0B1712] border border-white/10 rounded-xl p-5 relative overflow-hidden transition-all hover:border-[#C8FF00]/30">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono font-medium uppercase tracking-wider text-[#8F9B94]">
          {title}
        </p>
        <div className="w-8 h-8 rounded-lg bg-[#06110D] border border-white/10 flex items-center justify-center text-[#C8FF00]">
          <Icon className="w-4 h-4 text-[#C8FF00]" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight font-mono">{value}</h3>
      </div>
      {subtitle && <p className="text-[11px] font-mono text-[#8F9B94] mt-1.5">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
