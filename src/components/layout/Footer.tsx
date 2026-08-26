'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Home, LayoutGrid, ShoppingBasket, User, Smartphone, Store, Headset, Mail, ChevronRight, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();

  return (
    <>
      {/* REDESIGNED HYPERLOCAL FOOTER (Desktop Only) */}
      <footer className="hidden md:block mt-16 bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12 relative z-10">
          
          {/* Top App Download Strip (Google Play Store Only) */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-md">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>Download Our Mobile App</span>
              </h3>
              <p className="text-xs text-slate-400">
                Get faster 20-minute delivery, live GPS tracking & exclusive app discounts
              </p>
            </div>

            {/* Google Play Store Button ONLY */}
            <a
              href="#"
              className="flex items-center gap-3.5 px-6 py-3 rounded-2xl bg-slate-950 border border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-900 text-white transition shadow-md group shrink-0"
            >
              <svg className="w-7 h-7 text-emerald-400 fill-current group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.373 2.373 0 0 1-.61-.397 2.33 2.33 0 0 1-.582-1.637V3.848c0-.624.208-1.18.582-1.637.18-.216.386-.35.609-.397zM15.206 13.414l2.457 2.457-12.756 7.365 10.299-9.822zm0-2.828L4.907.764l12.756 7.365-2.457 2.457zm1.414 1.414l3.586-2.071a1.5 1.5 0 0 1 0 2.598l-3.586-2.071z" />
              </svg>
              <div className="text-left leading-tight">
                <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">GET IT ON</span>
                <span className="block text-sm font-black text-white">Google Play</span>
              </div>
            </a>
          </div>

          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10 pb-8 border-b border-slate-800/80">
            
            {/* Column 1: Brand Info */}
            <div className="sm:col-span-2 space-y-4 text-center sm:text-left">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
                />
              </Link>
              
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto sm:mx-0">
                Rangpur premier hyperlocal express marketplace delivering fresh fish, food, groceries, pharmacy meds, and daily household essentials straight to your doorstep in 20 minutes.
              </p>

              {/* Contact Helpline */}
              <div className="pt-1 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Headset className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">24/7 Support: +880 1700-000000</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>support@shymmarket.com</span>
                </div>
              </div>
            </div>

            {/* Column 2: Popular Services */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" /> Services
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li>
                  <Link href="/fresh-fish" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-600" /> Fresh Fish & Seafood
                  </Link>
                </li>
                <li>
                  <Link href="/food" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-600" /> Restaurant Food
                  </Link>
                </li>
                <li>
                  <Link href="/grocery" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-600" /> Grocery & Essentials
                  </Link>
                </li>
                <li>
                  <Link href="/pharmacy" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-600" /> Pharmacy & Meds
                  </Link>
                </li>
                <li>
                  <Link href="/gas-cylinder" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-600" /> LPG Gas Refill
                  </Link>
                </li>
                <li>
                  <Link href="/cake-bakery" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3 text-slate-600" /> Cake & Bakery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Headset className="w-3.5 h-3.5 text-emerald-400" /> Customer Care
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/track-order" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Track Live Order</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Help & Support Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Refund & Return Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Delivery Coverage Map</a></li>
              </ul>
            </div>

            {/* Column 4: Partnerships & Legal */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400" /> Partner & Legal
              </h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Become a Merchant</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Join as Delivery Rider</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-slate-600" /> Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 ShymMarket Hyperlocal Express Inc. All rights reserved.</p>
            <p className="text-[10px] text-slate-400">Rangpur Sadar, Bangladesh 🇧🇩</p>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-emerald-600 font-bold text-[10px] py-1 touch-active">
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        
        <Link href="/#service-categories" className="flex flex-col items-center gap-0.5 text-slate-400 text-[10px] py-1 touch-active">
          <LayoutGrid className="w-5 h-5" />
          <span>Categories</span>
        </Link>

        <Link href="/track-order" className="flex flex-col items-center gap-0.5 text-slate-400 text-[10px] py-1 touch-active">
          <Truck className="w-5 h-5" />
          <span>Track Order</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-slate-400 text-[10px] py-1 touch-active"
        >
          <div className="relative">
            <ShoppingBasket className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1 rounded-full min-w-[14px] text-center">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <Link href="/profile" className="flex flex-col items-center gap-0.5 text-slate-400 text-[10px] py-1 touch-active">
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
};
