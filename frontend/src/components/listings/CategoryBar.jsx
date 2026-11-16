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
    <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-lavender shadow-sm py-3 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex p-2 rounded-full border border-lavender hover:border-powder hover:bg-lavender/40 transition-all text-slate-600 bg-white shadow-soft flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories List */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
        >
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-powder to-peach text-white shadow-soft scale-105'
                    : 'bg-white border border-lavender text-slate-600 hover:text-powder-dark hover:border-powder/60 hover:bg-lavender/30'
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-white' : 'text-slate-400 group-hover:text-powder'
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
          className="hidden md:flex p-2 rounded-full border border-lavender hover:border-powder hover:bg-lavender/40 transition-all text-slate-600 bg-white shadow-soft flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Filters Toggle Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-lavender hover:border-powder text-xs font-bold text-slate-700 hover:bg-lavender/40 transition-all flex-shrink-0 bg-white shadow-soft"
        >
          <SlidersHorizontal className="w-4 h-4 text-powder-dark" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-powder to-peach text-white text-[10px] flex items-center justify-center font-extrabold shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryBar;
