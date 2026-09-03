'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/common/SearchInput';
import { useLocation } from '@/context/LocationContext';
import { useGetHeroBannersQuery } from '@/store/services/apiService';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroBanner } from '@/types';

export const HeroSlider: React.FC = () => {
  const { selectedLocation } = useLocation();
  const { data: heroBanners } = useGetHeroBannersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);

  const banners: HeroBanner[] = heroBanners && heroBanners.length > 0
    ? heroBanners
    : [
        {
          id: 'default-hero',
          title: 'Ekhanei Home Banner',
          image: '/home_banner.jpg',
          link: ''
        }
      ];

  const total = banners.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [total, isHovered, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (total <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <div className="w-full flex flex-col pt-0">
      {/* Hero Main Banner & Search Overlay Section */}
      <section
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[5/2] lg:aspect-[5/1] min-h-[160px] sm:min-h-[220px] md:min-h-[280px] w-full overflow-hidden z-30 bg-slate-900 group"
      >
        {/* Banner Images Carousel */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {banners.map((banner, idx) => {
            const isActive = idx === currentIndex;
            const targetLink = banner.link || banner.url;

            const imageContent = (
              <img
                src={banner.image}
                alt={banner.title || 'Ekhanei Home banner'}
                className={`object-cover object-center w-full h-full transition-opacity duration-700 ease-in-out absolute inset-0 ${
                  isActive ? 'opacity-100 scale-100 z-0' : 'opacity-0 scale-105 z-[-1] pointer-events-none'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/home_banner.jpg';
                }}
              />
            );

            if (!isActive) return null;

            if (targetLink && targetLink.trim() !== '' && targetLink !== '#') {
              return (
                <Link key={banner.id || idx} href={targetLink} className="block w-full h-full absolute inset-0">
                  {imageContent}
                </Link>
              );
            }

            return <div key={banner.id || idx} className="w-full h-full absolute inset-0">{imageContent}</div>;
          })}
        </div>

        {/* Mobile Top-Left Location Pill */}
        <div
          className="absolute top-2 left-2 z-20 flex lg:hidden items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-transparent via-white/15 to-white/35 border border-white/40 backdrop-blur-md text-left shadow-md cursor-default max-w-[180px]"
        >
          <div className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs shrink-0 font-black">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-extrabold text-white truncate block max-w-[130px]">
            {selectedLocation.title}
          </span>
        </div>

        {/* Carousel Controls & Indicators (Only if multiple banners) */}
        {total > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Dot Indicators */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {banners.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === currentIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Search Bar Overlay Centered at Bottom of Hero Banner */}
        <div className="absolute inset-0 z-20 flex items-end justify-center pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6 pointer-events-none">
          <div className="w-full max-w-[350px] md:max-w-[594px] xl:max-w-[694px] pointer-events-auto">
            <SearchInput />
          </div>
        </div>
      </section>
    </div>
  );
};

