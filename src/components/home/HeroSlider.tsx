'use client';

import React from 'react';
import { SearchInput } from '@/components/common/SearchInput';
import { useLocation } from '@/context/LocationContext';
import { MapPin } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { selectedLocation, openLocationDrawer } = useLocation();

  return (
    <div className="w-full flex flex-col pt-0">
      {/* Hero Main Banner & Search Overlay Section */}
      <section className="relative aspect-[5/2] lg:aspect-[5/1] w-full overflow-visible z-30 bg-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt="Ekhanei Home banner"
            loading="lazy"
            className="object-cover object-center w-full h-full"
            style={{ position: 'absolute', inset: 0 }}
            src="/home_banner.jpg"
          />
        </div>

        {/* Mobile Top-Left Location Pill */}
        <div
          className="absolute top-2 left-2 z-20 flex lg:hidden items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-transparent via-white/15 to-white/35 border border-white/40 backdrop-blur-md text-left shadow-md cursor-default max-w-[180px]"
        >
          <div className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs shrink-0 font-black">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-extrabold text-white truncate block max-w-[130px]">
            {selectedLocation.title} 
          </span>
        </div>

        {/* Search Bar Overlay Centered at Bottom of Hero Banner */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6">
          <div className="w-full max-w-[350px] md:max-w-[594px] xl:max-w-[694px]">
            <SearchInput />
          </div>
        </div>
      </section>
    </div>
  );
};
