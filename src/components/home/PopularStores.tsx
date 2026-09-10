'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useGetStoresQuery } from '@/store/services/apiService';
import { useLocation } from '@/context/LocationContext';
import { StoreCard } from '@/components/common/StoreCard';
import { StoreCardSkeleton, SectionTitleSkeleton } from '@/components/common/Skeletons';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const PopularStores: React.FC = () => {
  const { userCoords } = useLocation();
  const { data: stores = [], isLoading } = useGetStoresQuery({
    lat: userCoords?.lat,
    lng: userCoords?.lng,
  });

  const swiperRef = useRef<SwiperClass | null>(null);

  if (isLoading) {
    return (
      <section id="popular-stores" className="space-y-4 pt-1">
        <SectionTitleSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (stores.length === 0) return null;

  return (
    <section id="popular-stores" className="space-y-4 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Popular Stores Near You</span>
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
              Top rated verified partners delivering fast in Rangpur Sadar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-100/90 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200/80 text-xs shadow-xs touch-active cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-100/90 hover:bg-emerald-600 hover:text-white text-slate-700 flex items-center justify-center transition border border-slate-200/80 text-xs shadow-xs touch-active cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Link
            href="/store"
            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition ml-0.5 whitespace-nowrap"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Autoplay]}
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={{
          480: { slidesPerView: 1.8, spaceBetween: 16 },
          640: { slidesPerView: 2.3, spaceBetween: 18 },
          768: { slidesPerView: 3.1, spaceBetween: 20 },
          1024: { slidesPerView: 4.1, spaceBetween: 20 },
          1280: { slidesPerView: 4.8, spaceBetween: 20 },
        }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        className="w-full py-1.5"
      >
        {stores.map((store) => (
          <SwiperSlide key={store.id} className="h-auto">
            <StoreCard store={store} isGrid={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
