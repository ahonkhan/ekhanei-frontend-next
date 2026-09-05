'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { useGetProfileQuery } from '@/store/services/apiService';
import { SearchInput } from '@/components/common/SearchInput';
import { CategoryMenuDrawer } from '@/components/layout/CategoryMenuDrawer';
import { Menu, Heart, ShoppingCart, ChevronDown, MapPin, User as UserIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { totalItemsCount, setIsCartOpen, openAuthModal } = useCart();
  const { selectedLocation, selectGPSLocation, openLocationDrawer } = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Global Profile Fetch
  const { data: profileApiData, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !mounted || !isAuthenticated,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (profileApiData?.user) {
      dispatch(setUser(profileApiData.user));
    }
  }, [profileApiData, dispatch]);

  return (
    <>
      {/* Mobile App Download Banner (Positioned ABOVE Header) */}
      <div className="lg:hidden flex items-center justify-between bg-white px-3.5 py-2 border-b border-slate-100 shadow-2xs shrink-0 w-full z-[1001] relative">
        <div className="flex items-center gap-3">
          <img
            src="/app-icon.png"
            alt="App Icon"
            className="w-10 h-10 rounded-xl object-contain shrink-0 shadow-2xs"
          />
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 leading-snug">App Download</h4>
            <p className="text-[10px] font-medium text-slate-500 leading-tight">Get exciting deals in app</p>
          </div>
        </div>

        <a
          href="https://play.google.com/store/apps/details?id=com.ekhanei.customer.app&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          className="py-1.5 px-4 rounded-full bg-[#d81b60] hover:bg-[#c2185b] active:bg-[#a8144b] text-white font-extrabold text-xs shadow-xs transition active:scale-95 cursor-pointer inline-flex items-center justify-center"
        >
          Open App
        </a>
      </div>

      <header className="w-full transition-all ease-in-out duration-500 sticky top-0 left-0 right-0 z-[1000] overflow-visible h-[50px] md:h-18 text-white bg-[#d81b60] backdrop-blur-md shadow-md">
        <div className="h-13 md:h-full w-full flex justify-between items-center pr-4 sm:pr-7 pl-3.5 max-w-[1680px] mx-auto">

          {/* Left: Hamburger Menu & Logo */}
          <div className="w-fit flex items-center gap-3 sm:gap-4 shrink-0">
            <Menu
              onClick={() => setIsMenuDrawerOpen(true)}
              className="w-6 h-6 cursor-pointer text-white hover:opacity-80 transition"
            />
            <Link href="/">
              <img
                alt="Logo"
                width="130"
                height="33"
                className="w-22.5 h-5.75 md:w-32.5 md:h-8.25 object-contain brightness-0 invert"
                src="/logo.png"
              />
            </Link>

            {/* Location Pill (Desktop Header) */}
            <div
              onClick={selectGPSLocation}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-transparent via-white/15 to-white/35 border border-white/40 hover:border-white/60 hover:bg-white/20 backdrop-blur-md text-left shadow-xs cursor-pointer select-none shrink-0 max-w-[200px] transition"
            >
              <div className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs shrink-0 font-black">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-extrabold text-white truncate block max-w-[150px]" title={selectedLocation.title || selectedLocation.address}>
                {selectedLocation.title || selectedLocation.address || 'Locating...'} 
              </span>
            </div>
          </div>

          {!isHomePage ? (
            <div className="w-full max-w-173.5 flex-1 flex ml-3 md:mx-7 lg:px-0">
              <SearchInput />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right: Actions */}
          <div className="min-w-fit hidden gap-3 md:flex justify-between items-center">

            {/* Download App Tooltip */}
            <a
              href="https://play.google.com/store/apps/details?id=com.ekhanei.customer.app&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center hover:opacity-85 transition cursor-pointer"
            >
              <svg width="35" height="35" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7493 2.33398H12.2493C9.49949 2.33398 8.12456 2.33398 7.27028 3.18825C6.41602 4.04253 6.41602 5.41746 6.41602 8.16732V19.834C6.41602 22.5838 6.41602 23.9587 7.27028 24.8131C8.12456 25.6673 9.49949 25.6673 12.2493 25.6673H15.7493C18.4992 25.6673 19.8741 25.6673 20.7284 24.8131C21.5827 23.9587 21.5827 22.5838 21.5827 19.834V8.16732C21.5827 5.41746 21.5827 4.04253 20.7284 3.18825C19.8741 2.33398 18.4992 2.33398 15.7493 2.33398Z" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.3327 2.33398H11.666L12.2493 3.50065H15.7493L16.3327 2.33398Z" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs font-semibold leading-tight mr-2 ml-1 text-white">
                Download the <br />EkhaneiApp
              </p>
            </a>

            <div className="hidden lg:block h-9 border-l border-white/40" />

            {/* Wishlist Link */}
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="shrink-0 text-sm font-medium rounded hover:scale-105 transition-transform duration-200 text-white h-8 px-4 py-2 flex flex-col items-center justify-center cursor-pointer gap-0"
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[11px]">Wishlist</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('/profile')}
                className="shrink-0 text-sm font-medium rounded hover:scale-105 transition-transform duration-200 text-white h-8 px-4 py-2 flex flex-col items-center justify-center cursor-pointer gap-0 bg-transparent border-none"
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-[11px]">Wishlist</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="shrink-0 text-sm font-medium rounded hover:scale-105 transition-transform duration-200 text-white h-8 px-4 py-2 flex flex-col items-center justify-center cursor-pointer gap-0 relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute flex items-center justify-center -top-2.5 -right-3 h-4.5 w-4.5 rounded-full bg-white text-[#d81b60] text-[11px] font-bold shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px]">Cart</span>
            </button>

            <div className="h-9 border-l border-white/40" />

            {/* Account Profile Trigger */}
            {!mounted || (isAuthenticated && isProfileLoading && !user?.name) ? (
              <div className="flex h-full min-w-[130px] items-center gap-2 px-1">
                <div className="size-9 rounded-full bg-white/25 animate-pulse shrink-0 border border-white/40" />
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="w-16 h-3 bg-white/25 animate-pulse rounded-sm" />
                  <div className="w-10 h-2 bg-white/25 animate-pulse rounded-sm" />
                </div>
              </div>
            ) : isAuthenticated ? (
              <Link
                href="/profile"
                className="flex h-full min-w-[130px] items-center gap-2 rounded-sm px-1 text-left text-white outline-none hover:opacity-90 transition cursor-pointer"
              >
                <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white/20 text-xs font-bold text-white uppercase shadow-xs shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0) : 'U'}</span>
                  )}
                </div>
                <span className="flex min-w-0 flex-col text-xs font-medium leading-tight text-white">
                  <span className="truncate font-bold">{user?.name || 'Customer'}</span>
                  <span className="flex items-center gap-1 text-[10px] opacity-80">My Account <ChevronDown className="w-3 h-3" /></span>
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('/profile')}
                className="flex h-full items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-left text-white outline-none transition cursor-pointer border border-white/20 shadow-2xs"
              >
                <UserIcon className="w-4 h-4 text-white" />
                <span className="text-xs font-extrabold text-white whitespace-nowrap">
                  Sign In / Register
                </span>
              </button>
            )}

          </div>
        </div>
      </header>

      <CategoryMenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
      />
    </>
  );
};
