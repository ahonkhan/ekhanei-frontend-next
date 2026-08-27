'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full flex flex-col">
      {/* 1. Mobile App Top Banner (Hidden on Desktop) */}
      <div className="hidden max-lg:flex justify-between items-center bg-white p-2 border-b border-[#E7E7E7]">
        <div className="flex gap-2 items-center">
          <img
            alt="Govaly App"
            width="40"
            height="40"
            className="rounded-md object-cover"
            src="https://d62ipmwrm4ymk.cloudfront.net/product/3a1d87f5-8ec0-46cf-8ab0-c300a6fd4bfa.png"
          />
          <div className="space-y-0 leading-tight text-left">
            <p className="text-[18px] sm:text-[20px] font-bold text-slate-900">Govaly App</p>
            <p className="text-[11px] text-slate-500">Get exciting deals in app</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap text-sm shadow-sm cursor-pointer outline-none hover:scale-105 duration-200 h-8 px-4 py-2 bg-[#d81b60] text-white rounded-full font-semibold hover:bg-[#c01159] transition-colors"
        >
          Open App
        </button>
      </div>

      {/* 2. Mobile Seller Links Header Row */}
      <div className="bg-white text-slate-900 flex flex-col gap-6 rounded-sm shadow-xs p-1 lg:hidden border-b border-slate-100">
        <div className="flex justify-end items-center gap-1">
          <Link href="/become-a-seller">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap font-medium rounded cursor-pointer text-[#d81b60] hover:underline shadow-none h-8 px-3 py-1.5 text-xs sm:text-sm"
            >
              Become a Seller
            </button>
          </Link>
          <div className="h-5 bg-[#E7E7E7] w-[1px]" />
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap font-medium rounded cursor-pointer text-[#d81b60] hover:underline shadow-none h-8 px-3 py-1.5 text-xs sm:text-sm"
          >
            Login as Seller
          </button>
        </div>
      </div>

      {/* 3. Hero Main Banner & Search Overlay Section */}
      <section className="relative aspect-[5/2] lg:aspect-[5/1] w-full overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            alt="Govaly Home banner"
            loading="lazy"
            className="object-cover object-center w-full h-full"
            style={{ position: 'absolute', inset: 0 }}
            src="https://d62ipmwrm4ymk.cloudfront.net/home_banner/b2b489fb-a412-4532-b811-569cbbcd0468.jpg"
          />
        </div>

        {/* Search Bar Overlay Centered at Bottom of Hero Banner */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-[350px] md:w-[594px] xl:w-[694px]"
          >
            <div className="flex items-center bg-white rounded-full pr-1 py-1 w-full h-[36px] md:h-[44px] shadow-2xl border border-slate-100">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-3 sm:ml-4 shrink-0" />
              <div className="grid gap-2 flex-1 min-w-0">
                <input
                  autoComplete="off"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none w-full min-w-0 bg-transparent"
                  type="search"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap shadow-sm cursor-pointer outline-none hover:scale-105 transition-transform duration-200 bg-[#d81b60] hover:bg-[#c01159] rounded-full text-white h-full px-4 sm:px-6 text-xs sm:text-sm font-semibold shrink-0"
              >
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
