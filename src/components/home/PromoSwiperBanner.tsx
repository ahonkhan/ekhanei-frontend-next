'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  bgGradient: string;
  btnText: string;
  btnBg: string;
}

const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-1',
    title: 'STEP INTO COMFORT & STYLE',
    subtitle: 'Style Starts From Below — Premium Footwear & Fashion Deals',
    badge: 'NEW ARRIVALS',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-pink-600 via-rose-500 to-slate-900',
    btnText: 'Shop Footwear',
    btnBg: 'bg-white text-pink-600 hover:bg-slate-100'
  },
  {
    id: 'promo-2',
    title: 'FRESH RIVER FISH & SEAFOOD',
    subtitle: '100% Pure River Catch Delivered Daily in 20 Mins',
    badge: 'DAILY FRESH',
    image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-cyan-600 via-teal-500 to-slate-900',
    btnText: 'Order Fresh Fish',
    btnBg: 'bg-white text-cyan-700 hover:bg-slate-100'
  },
  {
    id: 'promo-3',
    title: 'TRENDY FASHION & LIFESTYLE',
    subtitle: 'Flat 50% Cashback on All Premium Fashion Apparel',
    badge: 'BIG DISCOUNT',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-indigo-600 via-purple-500 to-slate-900',
    btnText: 'Explore Fashion',
    btnBg: 'bg-white text-indigo-700 hover:bg-slate-100'
  },
  {
    id: 'promo-4',
    title: 'GADGETS & ELECTRONICS FEST',
    subtitle: 'Smart Watches, Wireless Earbuds & Gadgets at Wholesale Price',
    badge: 'BEST OFFERS',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-emerald-600 via-teal-600 to-slate-900',
    btnText: 'Shop Gadgets',
    btnBg: 'bg-white text-emerald-700 hover:bg-slate-100'
  }
];

const GAP = 16;
const LARGE = `calc(74% - ${GAP / 2}px)`;
const SMALL = `calc(26% - ${GAP / 2}px)`;
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

  // Always render 4 slides: [prev, current, next, next+1]
  const slides = [
    PROMO_BANNERS[(currentIndex - 1 + len) % len],
    PROMO_BANNERS[currentIndex],
    PROMO_BANNERS[(currentIndex + 1) % len],
    PROMO_BANNERS[(currentIndex + 2) % len],
  ];

  const transition = skipTransition
    ? 'none'
    : `width ${DURATION}ms ${EASING}, margin-right ${DURATION}ms ${EASING}`;

  /**
   * IDLE:  [0%, 74%, 26%, 0%] → current(LARGE) + next(SMALL)
   * NEXT:  [0%,  0%, 74%, 26%] → current exits, next expands, next+1 enters
   * PREV:  [74%, 26%, 0%, 0%] → prev enters, current shrinks, next exits
   */
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
    // prev
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

  // Re-enable CSS transitions after instant snap
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

  // Touch gestures
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
      className="relative w-full pt-1 pb-2 select-none overflow-hidden group"
    >
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-emerald-600 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md border border-white/80 opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-emerald-600 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md border border-white/80 opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slider Viewport */}
      <div className="relative w-full overflow-hidden">
        {/* Aspect-ratio container sets uniform height for all slots */}
        <div className="flex items-stretch aspect-[2.2/1] sm:aspect-[2.5/1] md:aspect-[2.7/1]">
          {slides.map((banner, i) => (
            <div
              key={`slot-${i}`}
              className="overflow-hidden rounded-2xl sm:rounded-3xl"
              style={{
                ...slotStyles[i],
                transition,
                flexShrink: 0,
                minWidth: 0,
              }}
            >
              {/* Banner Card — fills the slot entirely */}
              <div className="relative w-full h-full overflow-hidden group/card">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
