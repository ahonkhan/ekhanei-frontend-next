'use client';

import React from 'react';
import { Smartphone, Zap, MapPin, Gift, Play } from 'lucide-react';

export const AppPromoShowcase: React.FC = () => {
  return (
    <section className="hidden md:block rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-12 md:p-14 border border-emerald-500/20 relative overflow-hidden shadow-2xl glow-emerald">
      {/* Background Ambient Glow Effects */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur mx-auto">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>ShymMarket Mobile App</span>
        </div>

        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
          Order Faster, Track Live & Unlock <span className="text-emerald-400">App-Only Discounts</span>
        </h2>

        <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
          Download the native ShymMarket mobile app for 20-minute hyper-local delivery, real-time driver GPS tracking, and instant promo coupons right on your screen.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 text-emerald-200 text-xs font-semibold border border-white/10 backdrop-blur">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> 15-Min Express
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 text-emerald-200 text-xs font-semibold border border-white/10 backdrop-blur">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Live GPS Map
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 text-emerald-200 text-xs font-semibold border border-white/10 backdrop-blur">
            <Gift className="w-3.5 h-3.5 text-rose-400" /> App Deals
          </span>
        </div>

        {/* Store Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-slate-950 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 touch-active group"
          >
            <Play className="w-6 h-6 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition" />
            <div className="text-left">
              <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                GET IT ON
              </span>
              <span className="block text-sm font-extrabold text-white">
                Google Play
              </span>
            </div>
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-3 bg-slate-950 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 touch-active group"
          >
            <Smartphone className="w-6 h-6 text-white group-hover:scale-110 transition" />
            <div className="text-left">
              <span className="block text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                DOWNLOAD ON THE
              </span>
              <span className="block text-sm font-extrabold text-white">
                App Store
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
