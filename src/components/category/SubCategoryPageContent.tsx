'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useGetProductsQuery, useGetCategoryDetailQuery, useGetServiceCategoriesQuery } from '@/store/services/apiService';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { ProductCardSkeleton } from '@/components/common/Skeletons';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface SubCategoryPageContentProps {
  slug: string;
  subSlug: string;
  childSlug?: string;
}

export const SubCategoryPageContent: React.FC<SubCategoryPageContentProps> = ({ slug, subSlug, childSlug }) => {
  const activeSlug = childSlug || subSlug;

  const { data: serviceCategories = [] } = useGetServiceCategoriesQuery();
  const { data: categoryDetail, isLoading: isMetaLoading } = useGetCategoryDetailQuery({
    slug: activeSlug,
    type: childSlug ? 'subcategory' : 'product_category'
  });
  const { data: parentDetail } = useGetCategoryDetailQuery(subSlug);
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery({ categoryId: activeSlug, perPage: 200 });

  const catInfo = serviceCategories.find(c => c.id === slug || c.slug === slug) || {
    name: slug.replace(/-/g, ' ').toUpperCase(),
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
  };

  const parentSubCategories = parentDetail?.subCategories || [];
  const parentSubObj = parentSubCategories.find((s: any) => s.id === activeSlug || s.slug === activeSlug);

  const title = categoryDetail?.title || parentSubObj?.name || activeSlug.replace(/-/g, ' ');
  const bannerImage = categoryDetail?.bannerImage || categoryDetail?.banner_image || parentSubObj?.bannerImage || parentSubObj?.banner_image || categoryDetail?.heroSlides?.[0] || parentSubObj?.image || null;

  const subCategories = categoryDetail?.subCategories || [];

  // Tab State & Infinite Scroll State
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [displayedCount, setDisplayedCount] = useState<number>(12);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Filter products by selected sub-category tab
  const filteredProducts = useMemo(() => {
    if (selectedTab === 'all') return products;

    const targetStr = String(selectedTab).toLowerCase().trim();

    const matches = products.filter((p: any) => {
      const subIdStr = String(p.subcategoryId || p.product_subcategory_id || p.sub_category_id || '').toLowerCase().trim();
      const catIdStr = String(p.categoryId || p.product_category_id || p.category_id || '').toLowerCase().trim();
      const serviceCatIdStr = String(p.serviceCategoryId || p.service_category_id || '').toLowerCase().trim();
      const catSlugStr = String(p.categorySlug || '').toLowerCase().trim();
      const subcatSlugStr = String(p.subcategorySlug || '').toLowerCase().trim();
      const catNameStr = String(p.categoryName || '').toLowerCase().trim();
      const subcatNameStr = String(p.subcategoryName || '').toLowerCase().trim();

      if (
        (subIdStr && subIdStr === targetStr) ||
        (catIdStr && catIdStr === targetStr) ||
        (serviceCatIdStr && serviceCatIdStr === targetStr) ||
        (catSlugStr && catSlugStr === targetStr) ||
        (subcatSlugStr && subcatSlugStr === targetStr) ||
        (catNameStr && catNameStr === targetStr) ||
        (subcatNameStr && subcatNameStr === targetStr)
      ) {
        return true;
      }

      const targetSub = subCategories.find((s: any) =>
        (s.id && String(s.id).toLowerCase().trim() === targetStr) ||
        (s.slug && String(s.slug).toLowerCase().trim() === targetStr) ||
        (s.name && String(s.name).toLowerCase().trim() === targetStr)
      );

      if (targetSub) {
        const targetSubId = String(targetSub.id || '').toLowerCase().trim();
        const targetSubSlug = String(targetSub.slug || '').toLowerCase().trim();
        const targetSubName = String(targetSub.name || '').toLowerCase().trim();

        if (
          (targetSubId && (subIdStr === targetSubId || catIdStr === targetSubId || serviceCatIdStr === targetSubId)) ||
          (targetSubSlug && (subIdStr === targetSubSlug || catIdStr === targetSubSlug || subcatSlugStr === targetSubSlug || catSlugStr === targetSubSlug)) ||
          (targetSubName && subcatNameStr && (subcatNameStr === targetSubName || subcatNameStr.includes(targetSubName) || targetSubName.includes(subcatNameStr))) ||
          (targetSubName && catNameStr && catNameStr === targetSubName)
        ) {
          return true;
        }

        if (p.name && targetSubName && p.name.toLowerCase().includes(targetSubName)) {
          return true;
        }
      }

      return false;
    });

    return matches.length > 0 ? matches : products;
  }, [products, selectedTab, subCategories]);

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setDisplayedCount(12);
  };

  // Infinite Scroll (Load on scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 500;

      if (scrollPos >= threshold) {
        if (displayedCount < filteredProducts.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount(prev => prev + 12);
            setIsLoadingMore(false);
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, displayedCount, filteredProducts.length]);

  return (
    <main className="max-w-[1680px] mx-auto px-2 sm:px-5 space-y-6 sm:space-y-8 pt-4 sm:pt-6 pb-12">
      {/* TOP HEADER / BANNER SECTION */}
      {childSlug ? (
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/${subSlug}`}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200 text-xs cursor-pointer active:scale-95"
              title="পিছনে যান"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight capitalize">
              {title}
            </h1>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            {filteredProducts.length} টি পণ্য
          </span>
        </div>
      ) : (
        <div className="relative mb-10 sm:mb-14">
          {isMetaLoading ? (
            <div className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] aspect-[21/8] sm:aspect-[24/7] bg-slate-200 animate-pulse" />
          ) : bannerImage ? (
            <section className="-mx-4 sm:-mx-6 -mt-4 sm:-mt-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] relative rounded-none overflow-hidden border-b border-slate-200/80 shadow-xs aspect-[21/8] sm:aspect-[24/7] group cursor-pointer touch-active">
              <img
                src={getImageUrl(bannerImage)}
                alt={title || 'Category Banner'}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                loading="lazy"
              />
            </section>
          ) : null}

          {/* Floating White Title Box Overlapping Bottom Edge of Banner */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-10 px-4 sm:px-6">
            <div className="bg-white/95 backdrop-blur-md px-5 py-3.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-lg border border-slate-100/90 w-full text-left flex items-center justify-between">
              <h1 className="text-base sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none capitalize">
                {title}
              </h1>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {filteredProducts.length} টি পণ্য
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-CATEGORY FILTER PILLS TAB BAR */}
      {subCategories.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTabChange('all')}
            className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 select-none cursor-pointer ${
              selectedTab === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 transform scale-[1.02]'
                : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/80'
            }`}
          >
            সকল পণ্য
          </button>
          {subCategories.map((sub: any) => {
            const subId = String(sub.id || sub.slug);
            const isSelected =
              String(selectedTab).toLowerCase() === String(sub.id).toLowerCase() ||
              String(selectedTab).toLowerCase() === String(sub.slug).toLowerCase();
            return (
              <button
                key={subId}
                onClick={() => handleTabChange(subId)}
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

      {/* PRODUCT GRID WITH INFINITE LOAD ON SCROLL */}
      <section className="space-y-4 pt-2">
        {isProductsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-sm sm:text-base font-semibold">এই সাব-ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 md:gap-2.5">
            {filteredProducts.slice(0, displayedCount).map((product, idx) => (
              <PinkProductCard key={`grid-${product.id}-${idx}`} product={product} isSlider={false} />
            ))}
          </div>
        )}

        {/* LOAD ON SCROLL LOADING SPINNER */}
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
  );
};
