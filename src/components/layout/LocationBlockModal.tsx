'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPinOff, Navigation, ShieldAlert, AlertCircle } from 'lucide-react';

export const LocationBlockModal: React.FC = () => {
  const { isPermissionDenied, selectGPSLocation, selectedLocation, isLocationDetected } = useLocation();

  if (!isPermissionDenied && selectedLocation.id !== 'blocked') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center border border-rose-100 animate-in fade-in zoom-in duration-300">
        
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner border border-rose-200">
          <MapPinOff className="w-8 h-8 animate-bounce" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Location Access Blocked
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            GPS লোকেশন পারমিশন দিন
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            আপনার এলাকায় সঠিক ও দ্রুত পন্য ডেলিভারি নিশ্চিত করতে ব্রাউজারের GPS লোকেশন পারমিশন অন করা বাধ্যতামূলক।
          </p>
        </div>

        {/* Enable GPS Button */}
        <button
          onClick={selectGPSLocation}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#d81b60] hover:bg-[#c2185b] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-pink-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Navigation className="w-5 h-5 fill-white" />
          <span>Allow GPS Access / এলাকা শনাক্ত করুন</span>
        </button>

        <p className="text-[11px] text-slate-400 italic">
          পারমিশন ব্লক করা থাকলে ব্রাউজারের এড্রেস বারের সাথে থাকা 🔒 Lock বা Location আইকনে ক্লিক করে Allow করুন।
        </p>

      </div>
    </div>
  );
};
