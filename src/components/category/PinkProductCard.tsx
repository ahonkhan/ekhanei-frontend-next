'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';

interface PinkProductCardProps {
  product: Product;
  isSlider?: boolean;
}

export const PinkProductCard: React.FC<PinkProductCardProps> = ({ product, isSlider = false }) => {
  const widthClass = isSlider ? 'snap-start flex-shrink-0 w-[155px] sm:w-[190px]' : 'w-full';

  // Calculate discount percentage if old price exists
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 15;

  return (
    <Link
      href={`/product/${product.id}`}
      className={`${widthClass} group cursor-pointer select-none touch-active flex flex-col justify-between bg-white rounded-[3px] overflow-hidden border border-slate-100 hover:border-emerald-400 hover:shadow-md transition-all duration-300`}
    >
      <div>
        {/* 1. Edge-to-Edge Full-Bleed Top Image (Strict 1:1 Square Ratio) */}
        <div
          className="relative w-full aspect-square bg-slate-100 overflow-hidden shrink-0"
          style={{ aspectRatio: '1 / 1' }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* 2. Product Info Container (Title in 2 lines, Price Row, Next-line % OFF) */}
        <div className="p-2 sm:p-2.5 space-y-1 text-left">
          {/* Product Title (2 Lines allowed + Bigger Font) */}
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.4rem]">
            {product.name}
          </h4>

          {/* Price Row (Current Price + Old Price) */}
          <div className="flex items-center gap-1.5 leading-none pt-1">
            <span className="font-black text-sm sm:text-base text-emerald-600">
              ৳{product.price}
            </span>
            <span className="line-through text-slate-400 text-xs sm:text-xs font-semibold">
              ৳{product.oldPrice || Math.round(product.price * 1.2)}
            </span>
          </div>

          {/* Discount % OFF (On Next Line) */}
          <div className="pt-0.5">
            <span className="text-orange-500 text-[11px] sm:text-xs font-black block">
              ({discountPercent}% OFF)
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
