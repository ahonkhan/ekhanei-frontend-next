'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Heart } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface PinkProductCardProps {
  product: Product;
  isSlider?: boolean;
}

export const PinkProductCard: React.FC<PinkProductCardProps> = ({ product, isSlider = false }) => {
  const widthClass = isSlider ? 'snap-start flex-shrink-0 w-[calc(50%-0.25rem)] min-w-[calc(50%-0.25rem)] sm:w-[200px] sm:min-w-[200px]' : 'w-full';

  const fallbackImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  const cardImages = [
    getImageUrl(product.image) || fallbackImg,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80',
  ];

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Slide images on mouse hover
  const handleMouseEnter = () => {
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
    hoverIntervalRef.current = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % cardImages.length);
    }, 1200);
  };

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    setActiveImgIdx(0);
  };

  // Calculate discount percentage
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 22;

  return (
    <Link
      href={`/product/${product.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${widthClass} group relative bg-white md:rounded-lg shadow-md shadow-[#d81b60]/10 hover:shadow-lg transition-transform duration-300 overflow-hidden flex-col w-full block cursor-pointer rounded-none select-none touch-active p-0 m-0`}
      style={{ margin: 0, padding: 0 }}
    >
      <div>
        {/* 1. Relative Image Box (Aspect Square, Edge-to-Edge) */}
        <div className="relative overflow-hidden w-full aspect-square bg-slate-100">
          <img
            src={cardImages[activeImgIdx]}
            alt="EkhaneiProduct"
            loading="eager"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300 will-change-transform w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />



          {/* Bottom Center Dot Pagination (EkhaneiGlassmorphism pill style) */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1 py-0.5 rounded-full z-10 !border-none backdrop-blur-xl bg-white/30">
            {cardImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImgIdx(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`w-[5px] h-[5px] md:w-1.5 md:h-1.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${activeImgIdx === idx
                    ? 'bg-[#d81b60] border-[#d81b60] shadow scale-105'
                    : 'bg-[#C3C3C3]/70 hover:bg-black/40'
                  }`}
                style={{
                  boxShadow:
                    activeImgIdx === idx
                      ? 'rgba(216, 27, 96, 0.18) 0px 1px 4px 0px'
                      : 'rgba(31, 38, 135, 0.1) 0px 1px 2px 0px',
                  transition: '0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  backdropFilter: 'blur(3px)',
                }}
              />
            ))}
          </div>
        </div>

        {/* 2. Content Box (px-2 mt-2 mb-2 flex flex-col justify-between w-full min-w-0) */}
        <div className="px-2 mt-2 mb-2 flex flex-col justify-between w-full min-w-0 text-left">
          <div className="flex-shrink-0 mb-0.5 w-full min-w-0">
            <h3
              className="text-left font-medium truncate text-[12px] md:text-[17.23px] w-full text-slate-900"
              style={{ lineHeight: '20px' }}
              title={product.name}
            >
              {product.name}
            </h3>
          </div>

          {/* Price Strip: Current Price + Strikethrough Price + (% OFF) */}
          <div className="flex items-center flex-wrap space-x-0.5 text-left">
            <p className="text-[#d81b60] font-semibold text-[12px] md:text-[17.23px]">
              ৳{product.price}
            </p>
            <p className="line-through font-normal text-[12px] md:text-[13.8px] text-gray-500">
              ৳{product.oldPrice || Math.round(product.price * 1.25)}
            </p>
            <span className="text-[#ff9800] flex-shrink-0 text-[12px] md:text-[13.8px] font-medium">
              ({discountPercent}% OFF)
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
