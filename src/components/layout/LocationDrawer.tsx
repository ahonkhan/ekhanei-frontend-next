'use client';

import React from 'react';
import { useLocation } from '@/context/LocationContext';
import { LOCATIONS } from '@/data/mockData';
import { MapPin, X, Navigation, Home, Building, Bookmark, Check, Plus } from 'lucide-react';

export const LocationDrawer: React.FC = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    isLocationOpen,
    closeLocationDrawer,
    selectGPSLocation
  } = useLocation();

  if (!isLocationOpen) return null;

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div
        onClick={closeLocationDrawer}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Modal / Bottom Sheet Panel */}
      <div className="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl z-50 shadow-2xl p-6 space-y-5 animate-in slide-in-from-bottom duration-300">
        
        {/* Sheet Handle for Mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto md:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Select Delivery Location</h3>
              <p className="text-xs text-slate-500">Pick where you want your order delivered</p>
            </div>
          </div>
          <button
            onClick={closeLocationDrawer}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current GPS Button */}
        <button
          onClick={selectGPSLocation}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition touch-active"
        >
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-emerald-600" />
            <div className="text-left">
              <h4 className="font-bold text-xs sm:text-sm">Use Current GPS Location</h4>
              <p className="text-[11px] text-emerald-600/80">Rangpur Sadar • Auto detect</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg">
            Detect
          </span>
        </button>

        {/* Saved Addresses List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Saved Addresses
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
            {LOCATIONS.map(loc => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc);
                    closeLocationDrawer();
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  } cursor-pointer transition`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl ${
                        loc.type === 'home'
                          ? 'bg-amber-100 text-amber-600'
                          : loc.type === 'office'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-purple-100 text-purple-600'
                      } flex items-center justify-center text-xs font-bold`}
                    >
                      {loc.type === 'home' ? (
                        <Home className="w-4 h-4" />
                      ) : loc.type === 'office' ? (
                        <Building className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">{loc.title}</h5>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-[250px]">
                        {loc.address}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                    } flex items-center justify-center`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Address Button */}
        <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition">
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>
    </div>
  );
};
