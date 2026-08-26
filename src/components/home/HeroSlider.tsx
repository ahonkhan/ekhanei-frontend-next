'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

export const HeroSlider: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedLocation } = useLocation();

  return (
    <section className="w-full relative overflow-hidden select-none bg-[#c2185b]">
      <div className="relative w-full aspect-[1.9/1] sm:aspect-[3.2/1] md:aspect-[4.2/1] min-h-[210px] sm:min-h-[180px] overflow-hidden">
        <img
          src="/home_banner.jpg"
          alt="Bangladesh's Favorite Online Fashion Mall"
          className="w-full h-full object-cover object-center"
        />

        {/* Location pill overlay on small devices (top-left over banner, non-clickable display) */}
        <div className="absolute z-10 top-3 left-3 sm:top-4 sm:left-4 md:hidden">
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/25 border border-white/40 backdrop-blur-md text-left shadow-md cursor-default select-none max-w-[240px] xs:max-w-[280px]"
          >
            <div className="w-6 h-6 rounded-full bg-white/25 text-white flex items-center justify-center text-xs shrink-0 font-black">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[9px] font-bold text-white/80 uppercase tracking-wider leading-none">
                DELIVER TO
              </span>
              <span className="text-xs font-extrabold text-white truncate block mt-0.5">
                {selectedLocation.title} — {selectedLocation.address}
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar overlay centered at the bottom of the banner image */}
        <div className="absolute z-10 bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[85%] sm:w-[88%] max-w-sm sm:max-w-xl">
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <div className="relative bg-white rounded-full p-0.5 sm:p-1 shadow-2xl flex items-center gap-1.5 sm:gap-2 border border-slate-100">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-normal placeholder-slate-400 focus:outline-none px-1"
              />
              <button
                type="submit"
                className="bg-[#d81b60] hover:bg-[#c2185b] text-white font-medium text-xs sm:text-sm px-4 sm:px-6 py-1 sm:py-1.5 rounded-full transition shadow-md shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
