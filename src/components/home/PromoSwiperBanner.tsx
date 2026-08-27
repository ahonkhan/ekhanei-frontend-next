'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoBanner {
  id: string;
  image: string;
  link: string;
}

const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-1',
    image: 'https://d62ipmwrm4ymk.cloudfront.net/home_hero_banner/8ef18da1-57f4-4e3b-a11a-a7962913dde3.jpeg',
    link: '/category/men-footwear'
  },
  {
    id: 'promo-2',
    image: 'https://d62ipmwrm4ymk.cloudfront.net/home_hero_banner/9cbf903f-c171-44c2-834a-4cfcaa0c6ce7.jpg',
    link: '/category/men-bottomwear'
  },
  {
    id: 'promo-3',
    image: 'https://d62ipmwrm4ymk.cloudfront.net/home_hero_banner/724388c5-aec6-40cf-9ce9-ea3382f3d5d0.jpeg',
    link: '/category/women'
  }
];

const GAP = 12;
const LARGE = `calc(80% - ${GAP / 2}px)`;
const SMALL = `calc(20% - ${GAP / 2}px)`;
const ZERO = '0px';
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 850;

export const PromoSwiperBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'animating'>('idle');
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [skipTransition, setSkipTransition] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);

  const len = PROMO_BANNERS.length;

  // Render 4 slots for continuous sliding loop: [prev, current, next, next+1]
  const slides = [
    PROMO_BANNERS[(currentIndex - 1 + len) % len],
    PROMO_BANNERS[currentIndex],
    PROMO_BANNERS[(currentIndex + 1) % len],
    PROMO_BANNERS[(currentIndex + 2) % len],
  ];

  const transition = skipTransition
    ? 'none'
    : `width ${DURATION}ms ${EASING}, margin-right ${DURATION}ms ${EASING}`;

  const getSlotStyles = (): React.CSSProperties[] => {
    if (phase === 'idle') {
      return [
        { width: ZERO, marginRight: '0px', opacity: 1 },
        { width: LARGE, marginRight: `${GAP}px`, opacity: 1 },
        { width: SMALL, marginRight: '0px', opacity: 1 },
        { width: ZERO, marginRight: '0px', opacity: 1 },
      ];
    }
    if (direction === 'next') {
      return [
        { width: ZERO, marginRight: '0px', opacity: 1 },
        { width: ZERO, marginRight: '0px', opacity: 1 },
        { width: LARGE, marginRight: `${GAP}px`, opacity: 1 },
        { width: SMALL, marginRight: '0px', opacity: 1 },
      ];
    }
    return [
      { width: LARGE, marginRight: `${GAP}px`, opacity: 1 },
      { width: SMALL, marginRight: '0px', opacity: 1 },
      { width: ZERO, marginRight: '0px', opacity: 1 },
      { width: ZERO, marginRight: '0px', opacity: 1 },
    ];
  };

  const nextSlide = useCallback(() => {
    if (phase === 'animating') return;
    setDirection('next');
    setPhase('animating');
    setTimeout(() => {
      setSkipTransition(true);
      setCurrentIndex((prev) => (prev + 1) % len);
      setPhase('idle');
    }, DURATION);
  }, [phase, len]);

  const prevSlide = useCallback(() => {
    if (phase === 'animating') return;
    setDirection('prev');
    setPhase('animating');
    setTimeout(() => {
      setSkipTransition(true);
      setCurrentIndex((prev) => (prev - 1 + len) % len);
      setPhase('idle');
    }, DURATION);
  }, [phase, len]);

  useEffect(() => {
    if (skipTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSkipTransition(false);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [skipTransition]);

  // Autoplay
  useEffect(() => {
    if (isHovered || phase === 'animating') return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered, phase, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  };

  const slotStyles = getSlotStyles();

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full pt-0 mt-0 select-none overflow-hidden group"
    >
      {/* Slider Viewport */}
      <div className="relative w-full overflow-hidden">
        <div className="flex items-stretch h-44 sm:h-72 md:h-[420px] lg:h-[450px]">
          {slides.map((banner, i) => {
            const isNextPreview = i === 2 && phase === 'idle';
            const isMainSlide = i === 1;

            const cardContent = (
              <div className="w-full h-full relative">
                <img
                  src={banner.image}
                  alt="EkhaneiHome hero banner"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl sm:rounded-3xl group-hover/card:scale-102 transition-transform duration-500"
                />

                {/* Active Slide Dark Hover Overlay */}
                {isMainSlide && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl" />
                )}

                {/* Next Preview Slide Floating Chevron Right Button (Only visible on hover over 20% right preview card) */}
                {isNextPreview && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-white/90 rounded-full p-2.5 sm:p-3.5 shadow-xl backdrop-blur-md">
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            );

            return (
              <div
                key={`slot-${i}`}
                onClick={(e) => {
                  if (!isMainSlide) {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                  }
                }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/60 cursor-pointer group/card shrink-0"
                style={{
                  ...slotStyles[i],
                  transition,
                  flexShrink: 0,
                  minWidth: 0,
                }}
              >
                {isMainSlide ? (
                  <Link href={banner.link} className="block w-full h-full">
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
