'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CATEGORIES, CATEGORY_DETAILS_DATA, PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Star, Flame } from 'lucide-react';

interface SubCategoryPageContentProps {
  slug: string;
  subSlug: string;
}

export const SubCategoryPageContent: React.FC<SubCategoryPageContentProps> = ({ slug, subSlug }) => {
  const catInfo = CATEGORIES.find(c => c.id === slug) || CATEGORIES[0];
  const catMeta = CATEGORY_DETAILS_DATA[slug] || CATEGORY_DETAILS_DATA['fresh-fish'];
  const subObj = catMeta.subCategories.find(s => s.id === subSlug) || catMeta.subCategories[0];

  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const topRatedScrollRef = useRef<HTMLDivElement>(null);
  const topSoldScrollRef = useRef<HTMLDivElement>(null);

  // Filter products for this subcategory
  let subProducts = PRODUCTS.filter(p => p.categoryId === slug);
  if (subProducts.length === 0) subProducts = PRODUCTS;

  // Filter products by matching name/category if not 'all'
  if (subSlug !== 'all' && subObj) {
    const filtered = subProducts.filter(p =>
      p.name.toLowerCase().includes(subObj.name.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(subObj.name.toLowerCase())
    );
    if (filtered.length > 0) subProducts = filtered;
  }

  // Top Rated Products (Rating >= 4.7 or first subset)
  const topRatedProducts = subProducts.filter(p => p.rating >= 4.7).concat(subProducts).slice(0, 8);

  // Top Sold Products (Top sellers)
  const topSoldProducts = subProducts.slice().reverse().slice(0, 8);

  // Infinite Scroll Listener for "For You" section
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 500;

      if (scrollPos >= threshold) {
        if (displayedCount < subProducts.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount(prev => prev + 6);
            setIsLoadingMore(false);
          }, 400);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, displayedCount, subProducts.length]);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, offset: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12 pt-4 sm:pt-6 pb-12">
      {/* TOP PROMO HERO BANNER WITH OVERLAPPING CENTERED FLOATING TITLE CARD */}
      <div className="relative mb-10 sm:mb-14">
        <section className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] relative rounded-none overflow-hidden border-b border-slate-200/80 shadow-xs aspect-[21/8] sm:aspect-[24/7] group cursor-pointer touch-active">
          <img
            src={subObj.image || catMeta.specialOffers?.[0]?.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80'}
            alt={subObj.name}
            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
            loading="lazy"
          />
        </section>

        {/* Floating White Title Box Overlapping Bottom Edge of Banner — REDUCED RADIUS & FULL WIDTH */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-10 px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md px-5 py-3.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/90 w-full text-left">
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none text-left">
              {subObj.name}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. TOP RATED SECTION */}
      <section className="space-y-4 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-7 rounded-full bg-amber-500" />
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Top Rated</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(topRatedScrollRef, -320)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(topRatedScrollRef, 320)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={topRatedScrollRef}
          className="flex gap-1 sm:gap-1 overflow-x-auto no-scrollbar snap-x py-1"
        >
          {topRatedProducts.map((product, idx) => (
            <PinkProductCard key={`tr-${product.id}-${idx}`} product={product} isSlider={true} />
          ))}
        </div>
      </section>

      {/* 3. TOP SOLD SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-7 rounded-full bg-rose-500" />
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Top Sold</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollContainer(topSoldScrollRef, -320)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollContainer(topSoldScrollRef, 320)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={topSoldScrollRef}
          className="flex gap-1 sm:gap-1 overflow-x-auto no-scrollbar snap-x py-1"
        >
          {topSoldProducts.map((product, idx) => (
            <PinkProductCard key={`ts-${product.id}-${idx}`} product={product} isSlider={true} />
          ))}
        </div>
      </section>

      {/* 4. FOR YOU SECTION (LOAD ON SCROLL) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
              For You
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Showing {Math.min(displayedCount, subProducts.length)} of {subProducts.length} items
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {subProducts.slice(0, displayedCount).map((product, idx) => (
            <PinkProductCard key={`fy-${product.id}-${idx}`} product={product} isSlider={false} />
          ))}
        </div>

        {/* Load on Scroll Spinner */}
        {isLoadingMore && (
          <div className="py-8 text-center flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-md">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Loading more items for you...</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
