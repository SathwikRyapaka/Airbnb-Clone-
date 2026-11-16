import React, { useRef } from 'react';
import {
  Sparkles,
  Waves,
  TreePine,
  Building,
  Crown,
  Sun,
  Compass,
  Flame,
  Tent,
  Snowflake,
  Palette,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'All', label: 'All Homes', icon: Home },
  { id: 'Trending', label: 'Trending', icon: Flame },
  { id: 'Beachfront', label: 'Beachfront', icon: Waves },
  { id: 'Cabins', label: 'Cabins', icon: TreePine },
  { id: 'Iconic Cities', label: 'Iconic Cities', icon: Building },
  { id: 'Mansions', label: 'Mansions', icon: Crown },
  { id: 'Countryside', label: 'Countryside', icon: Sun },
  { id: 'Lake', label: 'Lake', icon: Waves },
  { id: 'Islands', label: 'Islands', icon: Compass },
  { id: 'Luxury', label: 'Luxury', icon: Sparkles },
  { id: 'Camping', label: 'Camping', icon: Tent },
  { id: 'Skiing', label: 'Skiing', icon: Snowflake },
  { id: 'Design', label: 'Design', icon: Palette },
];

const CategoryBar = ({ selectedCategory, onSelectCategory, onOpenFilters, activeFilterCount }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-neutral-100 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex p-1.5 rounded-full border border-neutral-300 hover:shadow-md transition-shadow text-neutral-600 bg-white flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories List */}
        <div
          ref={scrollRef}
          className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
        >
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 pb-2 border-b-2 text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 group ${
                  isSelected
                    ? 'border-neutral-900 text-neutral-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <IconComponent
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-800'
                  }`}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex p-1.5 rounded-full border border-neutral-300 hover:shadow-md transition-shadow text-neutral-600 bg-white flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Filters Toggle Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:border-neutral-900 transition-colors flex-shrink-0 bg-white shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryBar;
