'use client';

import React from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/common/SearchInput';
import { useLocation } from '@/context/LocationContext';
import { useGetHeroBannersQuery } from '@/store/services/apiService';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroBanner } from '@/types';
import { HeroHeaderSkeleton } from '@/components/common/Skeletons';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export const HeroSlider: React.FC = () => {
  const { selectedLocation } = useLocation();
  const { data: heroBanners, isLoading } = useGetHeroBannersQuery();

  const banners: HeroBanner[] = heroBanners || [];
  const total = banners.length;

  // Skeleton Loader while fetching backend banners
  if (isLoading || !heroBanners) {
    return <HeroHeaderSkeleton />;
  }

  // If backend returned no banners and not loading, show gradient container with search bar
  if (total === 0) {
    return (
      <div className="w-full flex flex-col pt-0 relative z-40">
        <section className="relative aspect-[5/2] lg:aspect-[5/1] min-h-[160px] sm:min-h-[220px] md:min-h-[280px] w-full z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 z-40 flex items-end justify-center pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6 pointer-events-none">
            <div className="w-full max-w-[350px] md:max-w-[594px] xl:max-w-[694px] pointer-events-auto relative z-50">
              <SearchInput />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pt-0 relative z-40">
      {/* Hero Main Banner & Search Overlay Section */}
      <section className="relative aspect-[5/2] lg:aspect-[5/1] min-h-[160px] sm:min-h-[220px] md:min-h-[280px] w-full bg-slate-900 group">
        
        {/* Banner Images Carousel using Swiper */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            effect="fade"
            navigation={{
              prevEl: '.hero-prev',
              nextEl: '.hero-next',
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={total > 1}
            className="w-full h-full"
          >
            {banners.map((banner, idx) => {
              const targetLink = banner.link || banner.url;

              const imageContent = (
                <img
                  src={banner.image}
                  alt={banner.title || 'Ekhanei Home banner'}
                  className="object-cover object-center w-full h-full"
                />
              );

              return (
                <SwiperSlide key={banner.id || idx}>
                  {targetLink && targetLink.trim() !== '' && targetLink !== '#' ? (
                    <Link href={targetLink} className="block w-full h-full">
                      {imageContent}
                    </Link>
                  ) : (
                    <div className="w-full h-full">{imageContent}</div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Mobile Top-Left Location Pill */}
        <div className="absolute top-2 left-2 z-20 flex lg:hidden items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-transparent via-white/15 to-white/35 border border-white/40 backdrop-blur-md text-left shadow-md cursor-default max-w-[180px]">
          <div className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs shrink-0 font-black">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-extrabold text-white truncate block max-w-[130px]">
            {selectedLocation.title}
          </span>
        </div>

        {/* Carousel Controls (Only if multiple banners) */}
        {total > 1 && (
          <>
            <button
              aria-label="Previous Slide"
              className="hero-prev absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next Slide"
              className="hero-next absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Search Bar Overlay Centered at Bottom of Hero Banner */}
        <div className="absolute inset-0 z-40 flex items-end justify-center pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6 pointer-events-none">
          <div className="w-full max-w-[350px] md:max-w-[594px] xl:max-w-[694px] pointer-events-auto relative z-50">
            <SearchInput />
          </div>
        </div>
      </section>
    </div>
  );
};


