'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { 
  Menu, 
  MapPin, 
  Search, 
  ShoppingBag, 
  Heart, 
  Smartphone, 
  ChevronDown, 
  User, 
  Bell, 
  Truck 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { selectedLocation } = useLocation();

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Main Solid Pink/Magenta Header Bar */}
      <div className="bg-[#d81b60] text-white py-3 px-2 sm:px-3 md:px-5">
        <div className="w-full max-w-full mx-auto flex items-center justify-between gap-2.5 sm:gap-6 h-[58px]">
          
          {/* Left: Hamburger Menu + Govaly Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button
              type="button"
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-xl transition text-white cursor-pointer"
              title="Open Menu"
            >
              <Menu className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="Govaly Logo"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Static Location Display (Non-clickable) */}
            <div
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-transparent via-white/15 to-white/35 border border-white/40 backdrop-blur-md text-left shadow-xs cursor-default select-none"
            >
              <div className="w-6 h-6 rounded-full bg-white/25 text-white flex items-center justify-center text-xs shrink-0 font-black">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="block text-[9px] font-bold text-white/80 uppercase tracking-wider leading-none">
                  Deliver to
                </span>
                <span className="text-xs font-extrabold text-white truncate block mt-0.5 max-w-[130px] sm:max-w-[160px]">
                  {selectedLocation.title} — {selectedLocation.address}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-4 sm:gap-6 text-white select-none">
            
            {/* App Download Link */}
            <div className="hidden lg:flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition">
              <Smartphone className="w-6 h-6 text-white shrink-0" />
              <div className="text-left leading-none font-bold text-[11px]">
                <span className="block">Download the</span>
                <span className="block font-black text-xs mt-0.5">Govaly App</span>
              </div>
            </div>

            <div className="hidden lg:block w-[1px] h-6 bg-white/30" />

            {/* Track Order Link */}
            <Link href="/track-order" className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-90 transition">
              <Truck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-[11px] font-bold">Track</span>
            </Link>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-90 transition relative"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-[#d81b60] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold">Cart</span>
            </button>

            <div className="w-[1px] h-5 sm:h-6 bg-white/30" />

            {/* User Account Profile Link */}
            <Link href="/profile" className="flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:opacity-90 transition">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white/80 flex items-center justify-center font-black text-xs bg-white/20 uppercase">
                A
              </div>
              <div className="hidden xs:block text-left leading-none text-[11px] font-semibold">
                <span className="block text-white/80 text-[10px]">Hi, Customer</span>
                <div className="flex items-center gap-1 mt-0.5 font-extrabold text-white">
                  <span>Account</span>
                  <ChevronDown className="w-3 h-3 text-white" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
};
