'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGetCategoryDetailQuery, useGetProductsQuery } from '@/store/services/apiService';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

export const CategoryPageContent: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: catMeta, isLoading: isMetaLoading } = useGetCategoryDetailQuery(slug);
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery({
    categoryId: catMeta?.id || slug,
    perPage: 200,
  });

  const [bottomFilterTab, setBottomFilterTab] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  const brandsScrollRef = useRef<HTMLDivElement>(null);

  const slides = catMeta?.heroSlides && catMeta.heroSlides.length > 0 ? catMeta.heroSlides : [];

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
  const promoAds = catMeta?.promoAds || [];
  const brands = catMeta?.brands || [];

  const filteredProducts = React.useMemo(() => {
    if (bottomFilterTab === 'all') return products;

    const targetStr = String(bottomFilterTab).toLowerCase();

    return products.filter((p: any) => {
      const subIdStr = String(p.subcategoryId || p.product_subcategory_id || '').toLowerCase();
      const catIdStr = String(p.categoryId || p.product_category_id || '').toLowerCase();
      const serviceCatIdStr = String(p.serviceCategoryId || p.service_category_id || '').toLowerCase();
      const subSlugStr = String(p.subcategorySlug || '').toLowerCase();
      const catSlugStr = String(p.categorySlug || '').toLowerCase();
      const subNameStr = String(p.subcategoryName || '').toLowerCase();
      const catNameStr = String(p.categoryName || '').toLowerCase();

      if (
        subIdStr === targetStr ||
        catIdStr === targetStr ||
        serviceCatIdStr === targetStr ||
        subSlugStr === targetStr ||
        catSlugStr === targetStr
      ) {
        return true;
      }

      const subObj = subCategories.find((s: any) =>
        String(s.id).toLowerCase() === targetStr || String(s.slug).toLowerCase() === targetStr
      );

      if (subObj) {
        const targetId = String(subObj.id || '').toLowerCase();
        const targetSlug = String(subObj.slug || '').toLowerCase();
        const targetName = String(subObj.name || '').toLowerCase();

        if (
          subIdStr === targetId ||
          catIdStr === targetId ||
          subIdStr === targetSlug ||
          catIdStr === targetSlug ||
          subSlugStr === targetSlug ||
          catSlugStr === targetSlug ||
          subNameStr === targetName ||
          catNameStr === targetName
        ) {
          return true;
        }

        if (p.name && targetName && p.name.toLowerCase().includes(targetName)) {
          return true;
        }
      }

      return false;
    });
  }, [products, bottomFilterTab, subCategories]);

  const specialOffers = catMeta?.specialOffers || [];

  return (
    <div className="w-full pb-12 pt-0 mt-0 space-y-6 sm:space-y-10">
      {/* 1. TOP PROMO ADS / FULL WIDTH HERO SLIDER - SKELETON WHILE LOADING */}
      {isMetaLoading ? (
        <div className="w-full aspect-[21/8] sm:aspect-[25/7] md:aspect-[28/7] bg-slate-200 animate-pulse rounded-none" />
      ) : slides.length > 0 ? (
        <section className="relative w-full overflow-hidden shadow-sm border-b border-slate-200/80 aspect-[21/8] sm:aspect-[25/7] md:aspect-[28/7] bg-slate-900 group rounded-none">
          {slides.map((slideUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                heroSlideIdx === idx ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={getImageUrl(slideUrl)}
                alt={`Category Hero Banner ${idx + 1}`}
                className="w-full h-full object-cover"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Slider Controls */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setHeroSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={() => setHeroSlideIdx((prev) => (prev + 1) % slides.length)}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Slider Dots Pagination */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-md">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setHeroSlideIdx(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      heroSlideIdx === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      ) : null}

      <main className="max-w-[1680px] mx-auto px-2 sm:px-5 space-y-8 sm:space-y-12">

        {/* 1. SUB-CATEGORIES CIRCULAR / SQUARE GRID (MAX 4 PER ROW ON MOBILE, LARGER ON DESKTOP) */}
        {subCategories.length > 0 && (
          <section className="space-y-3">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-6 py-0.5 px-0.5">
              {subCategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${slug}/${sub.slug || sub.id}`}
                  className="group cursor-pointer touch-active flex flex-col items-center text-center select-none"
                >
                  <div className="w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 group-hover:shadow-md transition-all duration-300 relative border border-slate-100">
                    {sub.image ? (
                      <img
                        src={getImageUrl(sub.image)}
                        alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-xs sm:text-base">
                        {sub.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-xs md:text-sm text-slate-800 group-hover:text-emerald-600 transition leading-tight mt-2 line-clamp-2 px-0.5">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. PROMO ADS (2 ITEMS PER ROW, BELOW SUB-CATEGORIES & ABOVE SPECIAL OFFERS) */}
        {promoAds.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promoAds.slice(0, 4).map((ad: any, idx: number) => (
              <Link
                key={ad.id || idx}
                href={ad.url || `/${slug}`}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[22/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(ad.image) || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80'}
                    alt={ad.title || `Promo Ad ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4 flex flex-col justify-center gap-0.5 bg-white text-left min-h-[56px]">
                  <span className="text-emerald-700 font-extrabold text-xs sm:text-sm md:text-base line-clamp-1 leading-tight">
                    {ad.title || 'প্রোমো অফার'}
                  </span>
                  {ad.subtitle ? (
                    <span className="text-slate-600 font-semibold text-[11px] sm:text-xs line-clamp-1 leading-tight mt-0.5">
                      {ad.subtitle}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        {/* 3. SPECIAL OFFERS / DISCOUNT CARDS GRID (COMPACT SMALL CARDS) */}
        {specialOffers.length > 0 ? (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {specialOffers.slice(0, 6).map((offer, idx) => (
              <Link
                key={offer.id || idx}
                href={offer.url || `/${slug}/${offer.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(offer.image) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2 sm:p-2.5 flex flex-col justify-center gap-0.5 bg-white text-left min-h-[50px]">
                  <span className="text-emerald-700 font-extrabold text-xs line-clamp-1 leading-tight">
                    {offer.title || 'বিশেষ অফার'}
                  </span>
                  {offer.subtitle ? (
                    <span className="text-slate-600 font-semibold text-[10px] sm:text-[11px] line-clamp-1 leading-tight">
                      {offer.subtitle}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </section>
        ) : null}

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
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollBrands(300)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={brandsScrollRef}
              className="flex gap-3 overflow-x-auto no-scrollbar snap-x py-2"
            >
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/search?q=${encodeURIComponent(brand.name)}&brandId=${brand.id}`}
                  className="snap-start flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 aspect-square rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all duration-300 cursor-pointer select-none relative group"
                  title={brand.name}
                >
                  <img
                    src={getImageUrl(brand.logo)}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold text-center py-1.5 px-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {brand.name}
                  </div>
                </Link>
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
                onClick={() => {
                  setBottomFilterTab('all');
                  setDisplayedCount(12);
                }}
                className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 select-none cursor-pointer ${
                  bottomFilterTab === 'all'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 transform scale-[1.02]'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80'
                }`}
              >
                সকল পণ্য
              </button>
              {subCategories.map((sub) => {
                const subId = String(sub.id || sub.slug);
                const isSelected =
                  String(bottomFilterTab).toLowerCase() === String(sub.id).toLowerCase() ||
                  String(bottomFilterTab).toLowerCase() === String(sub.slug).toLowerCase();
                return (
                  <button
                    key={sub.id || sub.slug}
                    onClick={() => {
                      setBottomFilterTab(subId);
                      setDisplayedCount(12);
                    }}
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
