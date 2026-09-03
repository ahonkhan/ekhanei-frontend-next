'use client';

import React, { useRef, useState } from 'react';
import { useGetStoresQuery } from '@/store/services/apiService';
import { useLocation } from '@/context/LocationContext';
import { StoreCard } from '@/components/common/StoreCard';
import { StoreCardSkeleton } from '@/components/common/Skeletons';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const PopularStores: React.FC = () => {
  const { userCoords } = useLocation();
  const { data: stores = [], isLoading } = useGetStoresQuery({
    lat: userCoords?.lat,
    lng: userCoords?.lng,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const scroll = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section id="popular-stores" className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Popular Stores Near You</span>
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
              Top rated verified partners delivering fast in Rangpur Sadar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll(-360)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-100/90 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200/80 text-xs shadow-xs touch-active"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll(360)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-100/90 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200/80 text-xs shadow-xs touch-active"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition ml-0.5 whitespace-nowrap"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* SKELETON LOADING OR STORES LIST */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      ) : stores.length === 0 ? null : (
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-x py-1.5 select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </section>
  );
};
