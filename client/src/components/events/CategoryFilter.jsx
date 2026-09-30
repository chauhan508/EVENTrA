import React from 'react';

const DEFAULT_CATEGORIES = [
  { id: 'All', label: 'All Events' },
  { id: 'Coding Competition', label: 'Coding' },
  { id: 'Hackathon', label: 'Hackathons' },
  { id: 'Workshop', label: 'Workshops' },
  { id: 'Competition', label: 'Competitions' },
  { id: 'Technical Session', label: 'Tech Sessions' }
];

const CategoryFilter = ({ 
  selectedCategory = 'All', 
  onSelectCategory,
  categories = DEFAULT_CATEGORIES,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full ${className}`}>
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-[#C8FF00] text-[#06110D] border-[#C8FF00] font-bold shadow-sm'
                : 'bg-[#0B1712] text-[#8F9B94] hover:text-[#F5F7F4] hover:bg-[#101D17] border-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
