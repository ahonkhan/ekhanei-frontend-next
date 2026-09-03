import React from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { ServiceCategories } from '@/components/home/ServiceCategories';
import { TrustBadges } from '@/components/home/TrustBadges';
import { PopularStores } from '@/components/home/PopularStores';

export default function HomePage() {
  return (
    <main className="w-full space-y-4 sm:space-y-6 pt-0 pb-10">
      {/* HERO BANNER (Managed via Admin Panel) */}
      <HeroSlider />

      {/* INNER HOME CONTENT WRAPPER */}
      <div className="max-w-[1680px] mx-auto px-2 sm:px-5 space-y-4 sm:space-y-5">
        {/* SERVICE CATEGORIES */}
        <ServiceCategories />

        {/* TRUST BADGES & POPULAR STORES */}
        <div className="space-y-3 sm:space-y-4">
          <TrustBadges />
          <PopularStores />
        </div>
      </div>
    </main>
  );
}
