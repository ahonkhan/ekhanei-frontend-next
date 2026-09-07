import React from 'react';

/**
 * Section Title & Subtitle Skeleton (Hides static text during load)
 */
export const SectionTitleSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 animate-pulse py-1">
    <div className="w-2.5 h-6 sm:h-7 rounded-full bg-slate-200 shrink-0" />
    <div className="space-y-2 flex-1">
      <div className="w-40 sm:w-56 h-5 sm:h-6 bg-slate-200/90 rounded-full" />
      <div className="w-56 sm:w-80 h-3 sm:h-3.5 bg-slate-100 rounded-full" />
    </div>
  </div>
);

/**
 * Hero Top Header Skeleton (Magenta / Deep Pink Header with Pill & Search bar as in user screenshot)
 */
export const HeroHeaderSkeleton: React.FC = () => (
  <div className="w-full flex flex-col pt-0">
    <section className="relative aspect-[5/2] lg:aspect-[5/1] min-h-[180px] sm:min-h-[220px] md:min-h-[280px] w-full overflow-hidden z-30 bg-brand-gradient flex flex-col items-center justify-center px-4 pb-4 sm:pb-6 pt-3 animate-pulse">
      {/* Top Thin Rounded Pill */}
      <div className="w-48 sm:w-64 h-3 sm:h-4 bg-white/25 rounded-full mb-2 sm:mb-3" />
      
      {/* Middle Title Rounded Pill */}
      <div className="w-64 sm:w-96 h-7 sm:h-10 bg-white/35 rounded-xl sm:rounded-2xl mb-4 sm:mb-6" />
      
      {/* Search Bar Overlay Centered at Bottom */}
      <div className="w-full max-w-[350px] md:max-w-[594px] xl:max-w-[694px] h-11 sm:h-13 bg-white/90 rounded-full shadow-md border border-white/50" />
    </section>
  </div>
);

/**
 * Category Card Skeleton matching user screenshot (Square card + 2 small pill lines underneath)
 */
export const CategoryCardSkeleton: React.FC = () => (
  <div className="flex flex-col items-center text-center select-none animate-pulse">
    <div className="w-full aspect-square rounded-2xl sm:rounded-3xl bg-slate-200/80 shadow-xs border border-slate-100" />
    <div className="w-3/4 h-2.5 bg-slate-200/90 rounded-full mt-2.5" />
    <div className="w-1/2 h-2 bg-slate-100 rounded-full mt-1.5" />
  </div>
);

/**
 * Promo / Hero Banner Skeleton
 */
export const BannerSkeleton: React.FC = () => (
  <div className="w-full h-[160px] sm:h-[240px] md:h-[300px] bg-slate-200 animate-pulse rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xs" />
);

/**
 * Product Card Skeleton
 */
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-xs animate-pulse space-y-3 flex flex-col justify-between h-[270px] sm:h-[300px]">
    <div className="w-full aspect-square bg-slate-200/80 rounded-xl" />
    <div className="space-y-2">
      <div className="w-3/4 h-4 bg-slate-200 rounded-full" />
      <div className="w-1/2 h-3 bg-slate-100 rounded-full" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <div className="w-16 h-5 bg-slate-200 rounded-full" />
      <div className="w-8 h-8 rounded-full bg-slate-200" />
    </div>
  </div>
);

/**
 * Store Card Skeleton
 */
export const StoreCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs animate-pulse space-y-3">
    <div className="w-full h-36 bg-slate-200/80" />
    <div className="p-4 space-y-2.5">
      <div className="w-3/4 h-5 bg-slate-200 rounded-full" />
      <div className="w-1/2 h-3 bg-slate-100 rounded-full" />
      <div className="flex items-center space-x-3 pt-2">
        <div className="w-12 h-3 bg-slate-200 rounded-full" />
        <div className="w-12 h-3 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * Trust Badges Skeleton
 */
export const TrustBadgesSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-14 sm:h-16 bg-white border border-slate-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-200/80 shrink-0" />
        <div className="w-24 h-3 bg-slate-200 rounded-full" />
      </div>
    ))}
  </div>
);

/**
 * Full Home Page Skeleton Screen matching user screenshot
 */
export const HomePageSkeleton: React.FC = () => (
  <main className="w-full space-y-4 sm:space-y-6 pt-0 pb-10 select-none">
    {/* Top Pink/Magenta Hero Header Skeleton */}
    <HeroHeaderSkeleton />

    {/* Content Wrapper */}
    <div className="max-w-[1680px] mx-auto px-3 sm:px-5 space-y-5 sm:space-y-6">
      {/* Service Categories Section Skeleton */}
      <section className="space-y-4">
        <SectionTitleSkeleton />
        {/* 5 items per row grid (2 rows = 10 cards) matching screenshot */}
        <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Main Large Promo Banner Skeleton */}
      <section className="pt-2">
        <BannerSkeleton />
      </section>

      {/* Popular Stores Section Skeleton */}
      <section className="space-y-4 pt-1">
        <SectionTitleSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  </main>
);
