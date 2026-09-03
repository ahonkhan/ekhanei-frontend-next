import React from 'react';

export const BannerSkeleton = () => (
  <div className="w-full h-[180px] sm:h-[260px] md:h-[340px] bg-slate-200 animate-pulse rounded-2xl md:rounded-3xl" />
);

export const CategoryCardSkeleton = () => (
  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse space-y-2">
    <div className="w-12 h-12 rounded-full bg-slate-200" />
    <div className="w-16 h-3 bg-slate-200 rounded" />
    <div className="w-10 h-2 bg-slate-100 rounded" />
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm animate-pulse space-y-3 flex flex-col justify-between h-[280px]">
    <div className="w-full h-36 bg-slate-200 rounded-xl" />
    <div className="space-y-2">
      <div className="w-3/4 h-4 bg-slate-200 rounded" />
      <div className="w-1/2 h-3 bg-slate-100 rounded" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="w-16 h-5 bg-slate-200 rounded" />
      <div className="w-8 h-8 rounded-full bg-slate-200" />
    </div>
  </div>
);

export const StoreCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse space-y-3">
    <div className="w-full h-36 bg-slate-200" />
    <div className="p-4 space-y-2">
      <div className="w-3/4 h-5 bg-slate-200 rounded" />
      <div className="w-1/2 h-3 bg-slate-100 rounded" />
      <div className="flex items-center space-x-3 pt-2">
        <div className="w-12 h-3 bg-slate-200 rounded" />
        <div className="w-12 h-3 bg-slate-200 rounded" />
      </div>
    </div>
  </div>
);
