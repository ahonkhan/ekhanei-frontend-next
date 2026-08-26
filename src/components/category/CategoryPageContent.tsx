'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CATEGORIES, CATEGORY_DETAILS_DATA, PRODUCTS, STORES } from '@/data/mockData';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { Search, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const CategoryPageContent: React.FC<{ slug: string }> = ({ slug }) => {
  const catInfo = CATEGORIES.find(c => c.id === slug) || CATEGORIES[0];
  const activeSlug = slug || catInfo.id;
  const catMeta = CATEGORY_DETAILS_DATA[activeSlug] || CATEGORY_DETAILS_DATA['fresh-fish'];

  // Independent state for Top Sub-categories grid vs Bottom Product Filter Tabs
  const [topGridCategory, setTopGridCategory] = useState('all');
  const [bottomFilterTab, setBottomFilterTab] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  const brandsScrollRef = useRef<HTMLDivElement>(null);

  const slides = catMeta.heroSlides || [catInfo.image];

  // Auto-play hero slider (images only)
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setHeroSlideIdx(prev => (prev + 1) % slides.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [slides]);

  const scrollBrands = (offset: number) => {
    if (brandsScrollRef.current) {
      brandsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Infinite Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 500;

      if (scrollPos >= threshold) {
        let allProds = PRODUCTS.filter(p => p.categoryId === slug);
        if (allProds.length === 0) allProds = PRODUCTS;

        if (displayedCount < allProds.length) {
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
  }, [isLoadingMore, displayedCount, slug]);

  // Filter products by category & bottom product filter tab
  let catProducts = PRODUCTS.filter(p => p.categoryId === slug);
  if (catProducts.length === 0) catProducts = PRODUCTS;

  if (bottomFilterTab !== 'all') {
    const subObj = catMeta.subCategories.find(s => s.id === bottomFilterTab);
    if (subObj) {
      const filtered = catProducts.filter(p =>
        p.name.toLowerCase().includes(subObj.name.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(subObj.name.toLowerCase())
      );
      if (filtered.length > 0) catProducts = filtered;
    }
  }

  return (
    <div className="w-full space-y-6 sm:space-y-10 pb-12">
      {/* 1. FULL WIDTH HERO BANNER SLIDER (IMAGES ONLY - NO TEXT OVERLAY) */}
      <section className="relative w-full aspect-[21/9] sm:aspect-[24/8] max-h-[420px] overflow-hidden bg-slate-900 shadow-md">
        <div className="w-full h-full relative">
          {slides.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${idx === heroSlideIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              <img
                src={imgUrl}
                alt={`${catInfo.name} Banner ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/50 backdrop-blur-xs px-3 py-1.5 rounded-full">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroSlideIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === heroSlideIdx ? 'w-6 bg-emerald-500' : 'w-2 bg-white/70 hover:bg-white'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14">

        {/* 2. SUB-CATEGORIES (2 SEPARATE INDEPENDENT SLIDERS) */}
        <section className="space-y-3">
          {(() => {
            const halfLen = Math.ceil(catMeta.subCategories.length / 2);
            const row1 = catMeta.subCategories.slice(0, halfLen);
            const row2 = catMeta.subCategories.slice(halfLen);

            return (
              <div className="space-y-3">
                {/* Row 1 Slider */}
                <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-1 pt-0.5 px-0.5 snap-x">
                  {row1.map(sub => (
                    <Link
                      key={sub.id}
                      href={`/${activeSlug}/${sub.id}`}
                      className="snap-start flex-shrink-0 w-[85px] sm:w-[105px] md:w-[130px] lg:w-[145px] group cursor-pointer touch-active flex flex-col items-center text-center select-none"
                    >
                      <div className="w-[85px] h-[85px] sm:w-[105px] sm:h-[105px] md:w-[130px] md:h-[130px] lg:w-[145px] lg:h-[145px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 group-hover:shadow-md transition-all duration-300 relative">
                        {sub.image ? (
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-xs">
                            {sub.name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-[11px] sm:text-xs md:text-sm text-slate-800 group-hover:text-emerald-600 transition leading-snug mt-2 line-clamp-2 px-0.5">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Row 2 Slider */}
                {row2.length > 0 && (
                  <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-1 pt-0.5 px-0.5 snap-x">
                    {row2.map(sub => (
                      <Link
                        key={sub.id}
                        href={`/${activeSlug}/${sub.id}`}
                        className="snap-start flex-shrink-0 w-[85px] sm:w-[105px] md:w-[130px] lg:w-[145px] group cursor-pointer touch-active flex flex-col items-center text-center select-none"
                      >
                        <div className="w-[85px] h-[85px] sm:w-[105px] sm:h-[105px] md:w-[130px] md:h-[130px] lg:w-[145px] lg:h-[145px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 group-hover:shadow-md transition-all duration-300 relative">
                          {sub.image ? (
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-xs">
                              {sub.name.slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-[11px] sm:text-xs md:text-sm text-slate-800 group-hover:text-emerald-600 transition leading-snug mt-2 line-clamp-2 px-0.5">
                          {sub.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </section>

        {/* 2.5 DUAL PROMO BANNERS (SIDE-BY-SIDE ON MOBILE WITH SLIMMER HEIGHT) */}
        {activeSlug === 'fashion' && catMeta.specialOffers && catMeta.specialOffers.length > 0 && (
          <section className="grid grid-cols-2 gap-2 sm:gap-4">
            {catMeta.specialOffers.slice(0, 2).map((off, idx) => (
              <div
                key={off.id || idx}
                className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 aspect-[2.6/1] sm:aspect-[2.8/1] group cursor-pointer touch-active"
              >
                <img
                  src={off.image}
                  alt={off.title || `Promo Banner ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </section>
        )}

        {/* 2.6 PROMO OFFER TILES RAIL (ONLY FOR FASHION CATEGORY FOR NOW) */}
        {activeSlug === 'fashion' && (
          <section className="pt-1">
            <div className="flex gap-1 sm:gap-1 overflow-x-auto no-scrollbar snap-x py-1">
              {catMeta.subCategories.map((sub, idx) => {
                const discounts = ['15% OFF', '20% OFF', '25% OFF', '30% OFF', '10% OFF'];
                const disc = discounts[idx % discounts.length];
                return (
                  <Link
                    key={`offer-${sub.id}-${idx}`}
                    href={`/${activeSlug}/${sub.id}`}
                    className="snap-start flex-shrink-0 w-[180px] sm:w-[220px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-emerald-500 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group touch-active select-none"
                  >
                    {/* Top Image Container — LANDSCAPE (ASPECT-[16/10], WIDTH > HEIGHT) */}
                    <div className="w-full aspect-[16/10] relative overflow-hidden bg-slate-100">
                      {sub.image ? (
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-sm">
                          {sub.name.slice(0, 2)}
                        </div>
                      )}
                    </div>

                    {/* Bottom White Strip — LARGER FONTS */}
                    <div className="bg-white p-3 flex items-center gap-2.5 border-t border-slate-100">
                      <div className="text-left leading-none flex-shrink-0">
                        <span className="block font-black text-sm sm:text-base text-emerald-600">
                          {disc.split(' ')[0]}
                        </span>
                        <span className="block font-black text-[10px] sm:text-xs text-emerald-600 uppercase mt-0.5">
                          {disc.split(' ')[1]}
                        </span>
                      </div>
                      <div className="w-[1.5px] h-7 bg-slate-200 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-tight">
                        {sub.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. TOP BRANDS SECTION (PREVIOUS DESIGN WITH LEFT IMAGE, VERIFIED BADGE & SCROLL BUTTONS) */}
        <section className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Top Brands</span>
            
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBrands(-300)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBrands(300)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Brands Rail (1:1 Square Box, Transparent Logo, Hover Brand Name) */}
          <div
            ref={brandsScrollRef}
            className="flex gap-1 sm:gap-1 overflow-x-auto no-scrollbar snap-x py-2"
          >
            {catMeta.brands.map(brand => (
              <div
                key={brand.id}
                className="snap-start flex-shrink-0 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] aspect-square rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all duration-300 group touch-active select-none relative flex flex-col items-center justify-center p-3 overflow-hidden"
              >
                {/* Brand Logo Container (Fixed in center, transparent background) */}
                <div className="w-full h-full flex items-center justify-center p-2.5">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Brand Name Text (Appears at bottom on hover) */}
                <div className="absolute bottom-2 left-0 right-0 text-center px-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block leading-tight">
                    {brand.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CATEGORY TABS & CATEGORY-WISE PRODUCTS GRID (INDEPENDENT BOTTOM TAB STATE) */}
        <section className="space-y-6">
          {/* Redesigned Category Filter Bar / Tabs */}
          <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {catMeta.subCategories.map(sub => {
              const isSelected = sub.id === bottomFilterTab;
              return (
                <button
                  key={sub.id}
                  onClick={() => setBottomFilterTab(sub.id)}
                  className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 select-none cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 transform scale-[1.02]'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>

          {/* Product Grid (Category Wise) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-1">
            {catProducts.slice(0, displayedCount).map(product => (
              <PinkProductCard key={product.id} product={product} isSlider={false} />
            ))}
          </div>

          {/* Infinite Scroll Spinner */}
          {isLoadingMore && (
            <div className="py-8 text-center flex justify-center">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-md">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Loading more items...</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
