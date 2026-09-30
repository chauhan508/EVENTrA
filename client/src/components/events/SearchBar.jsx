import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search events, categories, venues...',
  className = ''
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8F9B94]">
        <Search className="w-4 h-4 text-[#8F9B94]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3 bg-[#0B1712] hover:bg-[#101D17] focus:bg-[#101D17] border border-white/10 focus:border-[#C8FF00]/50 rounded-lg text-sm text-[#F5F7F4] placeholder-[#8F9B94]/70 focus:outline-none focus:ring-1 focus:ring-[#C8FF00]/30 transition-all font-sans"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8F9B94] hover:text-[#F5F7F4] transition-colors"
          aria-label="Clear search query"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
