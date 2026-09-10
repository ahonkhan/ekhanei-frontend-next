'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useGetProductsQuery, useGetCategoryDetailQuery, useGetServiceCategoriesQuery } from '@/store/services/apiService';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import { ChevronLeft, ChevronRight, Loader2, Star, Flame, ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface SubCategoryPageContentProps {
  slug: string;
  subSlug: string;
  childSlug?: string;
}

export const SubCategoryPageContent: React.FC<SubCategoryPageContentProps> = ({ slug, subSlug, childSlug }) => {
  const activeSlug = childSlug || subSlug;

  const { data: serviceCategories = [] } = useGetServiceCategoriesQuery();
  const { data: categoryDetail, isLoading: isMetaLoading } = useGetCategoryDetailQuery(activeSlug);
  const { data: parentDetail } = useGetCategoryDetailQuery(subSlug);
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery({ categoryId: activeSlug });

  const catInfo = serviceCategories.find(c => c.id === slug || c.slug === slug) || {
    name: slug.replace(/-/g, ' ').toUpperCase(),
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
  };

  const parentSubCategories = parentDetail?.subCategories || [];
  const parentSubObj = parentSubCategories.find((s: any) => s.id === activeSlug || s.slug === activeSlug);

  const title = categoryDetail?.title || parentSubObj?.name || activeSlug.replace(/-/g, ' ');
  const bannerImage = categoryDetail?.heroSlides?.[0] || parentSubObj?.image || catInfo?.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80';

  const subCategories = categoryDetail?.subCategories || [];

  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Top Rated Products
  const topRatedProducts = products.filter(p => p.rating >= 4.7).concat(products).slice(0, 8);

  // Top Sold Products
  const topSoldProducts = products.slice().reverse().slice(0, 8);

  // Infinite Scroll Listener for Child Page Grid
  useEffect(() => {
    if (!childSlug) return;
    const handleScroll = () => {
      if (isLoadingMore) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 500;

      if (scrollPos >= threshold) {
        if (displayedCount < products.length) {
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
  }, [isLoadingMore, displayedCount, products.length, childSlug]);

  // Helper to filter products for each sub-category
  const getSubCategoryProducts = (sub: any) => {
    const targetIdStr = String(sub.id || '');
    const targetSlugStr = String(sub.slug || '');

    return products.filter((p: any) => {
      const subIdStr = String(p.subcategoryId || p.product_subcategory_id || '');
      const catIdStr = String(p.categoryId || p.product_category_id || '');

      if (subIdStr === targetIdStr || subIdStr === targetSlugStr || catIdStr === targetIdStr || catIdStr === targetSlugStr) {
        return true;
      }
      if (sub.name && p.name) {
        return p.name.toLowerCase().includes(sub.name.toLowerCase());
      }
      return false;
    });
  };

  // Find remaining products that don't match any defined sub-category
  const remainingProducts = React.useMemo(() => {
    if (subCategories.length === 0) return products;
    return products.filter((p: any) => {
      const subIdStr = String(p.subcategoryId || p.product_subcategory_id || '');
      const catIdStr = String(p.categoryId || p.product_category_id || '');

      const isMatched = subCategories.some((sub: any) => {
        const targetIdStr = String(sub.id || '');
        const targetSlugStr = String(sub.slug || '');
        if (subIdStr === targetIdStr || subIdStr === targetSlugStr || catIdStr === targetIdStr || catIdStr === targetSlugStr) {
          return true;
        }
        if (sub.name && p.name) {
          return p.name.toLowerCase().includes(sub.name.toLowerCase());
        }
        return false;
      });
      return !isMatched;
    });
  }, [products, subCategories]);

  return (
    <main className="max-w-[1680px] mx-auto px-2 sm:px-5 space-y-8 sm:space-y-12 pt-4 sm:pt-6 pb-12">
      {/* TOP PROMO HERO BANNER WITH OVERLAPPING CENTERED FLOATING TITLE CARD */}
      <div className="relative mb-10 sm:mb-14">
        <section className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] relative rounded-none overflow-hidden border-b border-slate-200/80 shadow-xs aspect-[21/8] sm:aspect-[24/7] group cursor-pointer touch-active">
          <img
            src={getImageUrl(bannerImage)}
            alt={title || 'Category Banner'}
            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
            loading="lazy"
          />
        </section>

        {/* Floating White Title Box Overlapping Bottom Edge of Banner */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-10 px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md px-5 py-3.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/90 w-full text-left flex items-center justify-between">
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none capitalize">
              {title}
            </h1>
            <span className="text-xs sm:text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {products.length} টি পণ্য
            </span>
          </div>
        </div>
      </div>

      {/* SUB-CATEGORIES CIRCULAR CARDS SLIDER (IF AVAILABLE AND NOT ON CHILD SLUG) */}
      {!childSlug && subCategories.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-6 rounded-full bg-emerald-500" />
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              সাব-ক্যাটাগরি
            </h2>
          </div>
          <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto no-scrollbar pb-1 pt-0.5 px-0.5 snap-x">
            {subCategories.map((sub: any) => (
              <Link
                key={sub.id}
                href={`/${slug}/${subSlug}/${sub.slug || sub.id}`}
                className="snap-start flex-shrink-0 w-[64px] sm:w-[76px] md:w-[88px] lg:w-[96px] group cursor-pointer touch-active flex flex-col items-center text-center select-none"
              >
                <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] md:w-[88px] md:h-[88px] lg:w-[96px] lg:h-[96px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 group-hover:shadow-md transition-all duration-300 relative border-2 border-transparent hover:border-emerald-400">
                  {sub.image ? (
                    <img
                      src={getImageUrl(sub.image)}
                      alt={sub.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-xs sm:text-sm">
                      {sub.name.slice(0, 2)}
                    </div>
                  )}
                </div>
                <span className="font-bold text-[10px] sm:text-xs text-slate-800 group-hover:text-emerald-600 transition leading-tight mt-1.5 line-clamp-2 px-0.5">
                  {sub.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* TOP RATED SECTION WITH SWIPER */}
      {topRatedProducts.length > 0 && (
        <section className="space-y-4 pt-2">
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
                className="tr-prev w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="tr-next w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.tr-prev',
              nextEl: '.tr-next',
            }}
            spaceBetween={8}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 12 },
              768: { slidesPerView: 4, spaceBetween: 12 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
              1280: { slidesPerView: 6, spaceBetween: 16 },
            }}
            className="w-full py-1"
          >
            {topRatedProducts.map((product, idx) => (
              <SwiperSlide key={`tr-${product.id}-${idx}`}>
                <PinkProductCard product={product} isSlider={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* TOP SOLD SECTION WITH SWIPER */}
      {topSoldProducts.length > 0 && (
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
                className="ts-prev w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="ts-next w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: '.ts-prev',
              nextEl: '.ts-next',
            }}
            spaceBetween={8}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 12 },
              768: { slidesPerView: 4, spaceBetween: 12 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
              1280: { slidesPerView: 6, spaceBetween: 16 },
            }}
            className="w-full py-1"
          >
            {topSoldProducts.map((product, idx) => (
              <SwiperSlide key={`ts-${product.id}-${idx}`}>
                <PinkProductCard product={product} isSlider={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* DEDICATED SUB-CATEGORY SECTIONS WITH SLIDERS (WHEN NOT ON CHILD SLUG) */}
      {!childSlug && subCategories.length > 0 ? (
        <div className="space-y-10 sm:space-y-14">
          {subCategories.map((sub: any, subIdx: number) => {
            const subProds = getSubCategoryProducts(sub);
            if (subProds.length === 0) return null;

            const prevBtnClass = `sub-prev-${sub.id || subIdx}`;
            const nextBtnClass = `sub-next-${sub.id || subIdx}`;

            return (
              <section key={sub.id || subIdx} className="space-y-4 pt-2">
                {/* Section Header: Subcategory Title + View All Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
                    <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {sub.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${slug}/${subSlug}/${sub.slug || sub.id}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline transition cursor-pointer"
                    >
                      <span>সবগুলো দেখুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Swiper Arrow Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        className={`${prevBtnClass} w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95 disabled:opacity-40`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        className={`${nextBtnClass} w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95 disabled:opacity-40`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategory Product Swiper Slider */}
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: `.${prevBtnClass}`,
                    nextEl: `.${nextBtnClass}`,
                  }}
                  spaceBetween={8}
                  slidesPerView={2}
                  breakpoints={{
                    640: { slidesPerView: 3, spaceBetween: 12 },
                    768: { slidesPerView: 4, spaceBetween: 12 },
                    1024: { slidesPerView: 5, spaceBetween: 16 },
                    1280: { slidesPerView: 6, spaceBetween: 16 },
                  }}
                  className="w-full py-1"
                >
                  {subProds.map((product: any, pIdx: number) => (
                    <SwiperSlide key={`subp-${product.id}-${pIdx}`}>
                      <PinkProductCard product={product} isSlider={false} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            );
          })}

          {/* Remaining Uncategorized Products Slider/Grid if any */}
          {remainingProducts.length > 0 && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-7 rounded-full bg-teal-500" />
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    অন্যান্য পণ্য
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 md:gap-2.5">
                {remainingProducts.map((product, idx) => (
                  <PinkProductCard key={`rem-${product.id}-${idx}`} product={product} isSlider={false} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* FULL PRODUCT GRID FOR DEDICATED CHILD SUBCATEGORY PAGE (e.g. /grocery/daily-essentials/oil) OR FALLBACK */
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                সকল পণ্য ({products.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Showing {Math.min(displayedCount, products.length)} of {products.length} items
            </span>
          </div>

          {isProductsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <p className="text-sm font-semibold">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 md:gap-2.5">
              {products.slice(0, displayedCount).map((product, idx) => (
                <PinkProductCard key={`grid-${product.id}-${idx}`} product={product} isSlider={false} />
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
      )}
    </main>
  );
};
