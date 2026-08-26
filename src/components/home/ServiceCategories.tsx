'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/mockData';

export const ServiceCategories: React.FC = () => {
  return (
    <section id="service-categories" className="space-y-4 sm:space-y-5 pt-0">
      {/* Section Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-6 sm:h-7 rounded-full bg-emerald-500 shrink-0" />
        <div>
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
            Service Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Explore daily services & doorstep deliveries available in your area
          </p>
        </div>
      </div>

      {/* GRID: 3 ITEMS ON MOBILE, 6 ITEMS ON DESKTOP */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-5 lg:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.id}`}
            className="group cursor-pointer flex flex-col items-center text-center select-none"
          >
            <div className="w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xs group-hover:shadow-xl transition-all duration-300 relative border border-slate-100">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition leading-snug mt-2 line-clamp-2">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};
