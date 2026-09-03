'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGetCategoryDetailQuery, useGetProductsQuery } from '@/store/services/apiService';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryPageContent: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: catMeta, isLoading: isMetaLoading } = useGetCategoryDetailQuery(slug);
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery({
    categoryId: catMeta?.id || slug,
  });

  const [bottomFilterTab, setBottomFilterTab] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  const brandsScrollRef = useRef<HTMLDivElement>(null);

  const slides = catMeta?.heroSlides && catMeta.heroSlides.length > 0
    ? catMeta.heroSlides
    : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'];

  // Auto-play hero slider
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setHeroSlideIdx((prev) => (prev + 1) % slides.length);
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
        if (displayedCount < products.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }, 400);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, displayedCount, products]);

  const subCategories = catMeta?.subCategories || [];
  const brands = catMeta?.brands || [];

  const filteredProducts = React.useMemo(() => {
    if (bottomFilterTab === 'all') return products;
    return products.filter((p: any) => {
      const subIdStr = String(p.subcategoryId || p.categoryId || '');
      const selectedSubStr = String(bottomFilterTab);
      if (subIdStr === selectedSubStr) return true;

      const subObj = subCategories.find((s: any) => String(s.id) === selectedSubStr);
      if (subObj && subObj.name && p.name) {
        return p.name.toLowerCase().includes(subObj.name.toLowerCase());
      }
      return false;
    });
  }, [products, bottomFilterTab, subCategories]);

  const specialOffers = catMeta?.specialOffers || [];

  return (
    <div className="w-full space-y-6 sm:space-y-10 pb-12 pt-3">
      <main className="max-w-[1680px] mx-auto px-2 sm:px-5 space-y-8 sm:space-y-12">
        {/* 1. TOP PROMO ADS BANNER GRID (2 Side-by-Side Rounded Banners matching screenshot) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl overflow-hidden aspect-[22/9] bg-slate-100 shadow-sm border border-slate-200/80 group cursor-pointer">
            <img
              src={slides[0] || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80'}
              alt="Category Banner 1"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="rounded-3xl overflow-hidden aspect-[22/9] bg-slate-100 shadow-sm border border-slate-200/80 group cursor-pointer">
            <img
              src={slides[1] || slides[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80'}
              alt="Category Banner 2"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        </section>

        {/* 2. SPECIAL OFFERS / DISCOUNT CARDS STRIP (Matching user screenshot) */}
        {specialOffers.length > 0 ? (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {specialOffers.slice(0, 6).map((offer, idx) => (
              <Link
                key={offer.id || idx}
                href={`/${slug}/${offer.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={offer.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2.5 flex items-center gap-2 text-[11px] font-bold">
                  {offer.subtitle ? (
                    <span className="text-emerald-600 font-extrabold text-xs shrink-0">{offer.subtitle}</span>
                  ) : null}
                  <span className="text-slate-900 font-extrabold truncate">{offer.title}</span>
                </div>
              </Link>
            ))}
          </section>
        ) : subCategories.length > 0 ? (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {subCategories.slice(0, 6).map((sub) => (
              <Link
                key={sub.id}
                href={`/${slug}/${sub.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={sub.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2.5 flex items-center justify-between gap-1 text-[11px] font-bold">
                  <span className="text-slate-900 font-extrabold truncate">{sub.name}</span>
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        {/* SUB-CATEGORIES CIRCULAR / SQUARE SLIDER */}
        {subCategories.length > 0 && (
          <section className="space-y-3">
            <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-1 pt-0.5 px-0.5 snap-x">
              {subCategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${slug}/${sub.id}`}
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
          </section>
        )}

        {/* BRANDS SECTION */}
        {brands.length > 0 && (
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

            <div
              ref={brandsScrollRef}
              className="flex gap-1 sm:gap-1 overflow-x-auto no-scrollbar snap-x py-2"
            >
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="snap-start flex-shrink-0 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] aspect-square rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all duration-300 group touch-active select-none relative flex flex-col items-center justify-center p-3 overflow-hidden"
                >
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center px-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block leading-tight">
                      {brand.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTS GRID SECTION */}
        <section className="space-y-6">
          {/* Subcategory Tabs */}
          {subCategories.length > 0 && (
            <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setBottomFilterTab('all')}
                className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 select-none cursor-pointer ${
                  bottomFilterTab === 'all'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 transform scale-[1.02]'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80'
                }`}
              >
                সকল পণ্য
              </button>
              {subCategories.map((sub) => {
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
          )}

          {/* Product Grid / Skeleton */}
          {isProductsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-sm font-semibold">এই সাব-ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-1">
              {filteredProducts.slice(0, displayedCount).map((product) => (
                <PinkProductCard key={product.id} product={product} isSlider={false} />
              ))}
            </div>
          )}

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
