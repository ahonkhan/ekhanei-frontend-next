'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSliderProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ title, children, className = '' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Mouse drag states
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [wasDragged, setWasDragged] = useState(false);

  // Update arrow buttons visibility based on scroll position
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    const timer = setTimeout(checkScroll, 300);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, children]);

  // Scroll left/right by distance
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Mouse drag event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setWasDragged(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;

    if (Math.abs(walk) > 5) {
      setWasDragged(true);
      el.scrollLeft = scrollLeftPos - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  // Prevent click on children (Links/Cards) when user was dragging
  const handleClickCapture = (e: React.MouseEvent) => {
    if (wasDragged) {
      e.preventDefault();
      e.stopPropagation();
      setWasDragged(false);
    }
  };

  return (
    <div className={`space-y-3 relative group/slider ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          {typeof title === 'string' ? (
            <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h3>
          ) : (
            title
          )}

          {/* Controls Arrow Buttons (Header right) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Slider Container with side arrows & drag scrolling */}
      <div className="relative">
        {/* Left Floating Overlay Arrow (Desktop Hover) */}
        {showLeftArrow && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-md border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 -ml-3 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Floating Overlay Arrow (Desktop Hover) */}
        {showRightArrow && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-md border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 -mr-3 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClickCapture={handleClickCapture}
          className={`flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-0.5 touch-pan-x scroll-smooth select-none ${
            isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
