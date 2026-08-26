'use client';

import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="w-full py-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Badge 1: Cash On Delivery */}
        <div className="bg-white rounded-xl py-2 px-3 sm:py-2.5 sm:px-4 shadow-2xs border border-slate-100/90 flex items-center justify-center gap-2 sm:gap-2.5 group hover:border-[#d81b60]/30 hover:shadow-xs transition-all duration-300">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#d81b60]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d81b60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" d="M6 12h.01M18 12h.01" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight whitespace-nowrap">
            Cash On Delivery
          </span>
        </div>

        {/* Badge 2: Instant Return */}
        <div className="bg-white rounded-xl py-2 px-3 sm:py-2.5 sm:px-4 shadow-2xs border border-slate-100/90 flex items-center justify-center gap-2 sm:gap-2.5 group hover:border-[#d81b60]/30 hover:shadow-xs transition-all duration-300">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#d81b60]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d81b60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight whitespace-nowrap">
            Instant Return
          </span>
        </div>

        {/* Badge 3: Delivery Within 48hrs */}
        <div className="bg-white rounded-xl py-2 px-3 sm:py-2.5 sm:px-4 shadow-2xs border border-slate-100/90 flex items-center justify-center gap-2 sm:gap-2.5 group hover:border-[#d81b60]/30 hover:shadow-xs transition-all duration-300">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#d81b60]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d81b60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight whitespace-nowrap">
            Delivery Within <span className="text-[#d81b60] font-bold">48hrs</span>
          </span>
        </div>

        {/* Badge 4: Best Price Deal */}
        <div className="bg-white rounded-xl py-2 px-3 sm:py-2.5 sm:px-4 shadow-2xs border border-slate-100/90 flex items-center justify-center gap-2 sm:gap-2.5 group hover:border-[#d81b60]/30 hover:shadow-xs transition-all duration-300">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#d81b60]/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d81b60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight whitespace-nowrap">
            Best Price Deal
          </span>
        </div>
      </div>
    </section>
  );
};
