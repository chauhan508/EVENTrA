import React from 'react';

const categories = [
  { id: 'All', label: 'All' },
  { id: 'Coding Competition', label: 'Coding' },
  { id: 'Hackathon', label: 'Hackathon' },
  { id: 'Workshop', label: 'Workshop' },
  { id: 'Competition', label: 'Competition' },
  { id: 'Technical Session', label: 'Technical Session' }
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-[#FF4D2E] text-white border-[#FF4D2E] shadow-sm font-semibold'
                : 'bg-[#121216] text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
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
