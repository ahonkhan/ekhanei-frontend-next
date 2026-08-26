'use client';

import React from 'react';
import Link from 'next/link';
import { Store } from '@/types';
import { Tag, Clock, Star, MapPin } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  isGrid?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, isGrid = false }) => {
  const widthClass = isGrid ? 'w-full' : 'snap-start flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px]';

  return (
    <Link
      href={`/store/${store.id}`}
      className={`${widthClass} rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md overflow-hidden flex flex-col cursor-pointer transition-all duration-300 group touch-active select-none block`}
    >
      {/* Cover Image Box */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        <img
          src={store.coverImage}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/10" />

        {/* Offer Tag */}
        <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {store.offer}
        </span>

        {/* Delivery Time Badge */}
        <span className="absolute bottom-2.5 right-2.5 bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          {store.deliveryTime}
        </span>
      </div>

      {/* Info Body */}
      <div className="p-3 sm:p-3.5 space-y-2 bg-white flex-1 flex flex-col justify-between">
        <div className="flex items-start gap-2.5">
          <img
            src={store.logoImage}
            alt={store.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-xs flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            {/* Store Name + Verified SVG Checkmark Badge */}
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1 min-w-0">
              <span className="truncate group-hover:text-emerald-600 transition">{store.name}</span>
              <svg className="w-3.5 h-3.5 text-blue-500 shrink-0 inline-block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.25 1.273 2.62 2.148 4.2 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.4 4.8l-4.2-4.2 1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" />
              </svg>
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
              {store.category} {store.tags ? `• ${store.tags.join(', ')}` : ''}
            </p>
          </div>
        </div>

        {/* Footer Row (Rating & Distance) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-slate-900">{store.rating}</span>
            <span className="text-slate-400 font-normal text-[10px]">({store.reviewsCount})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>{store.distance}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
