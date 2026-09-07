'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Palette, X, Check, Sparkles } from 'lucide-react';

export const ThemeSwitcherModal: React.FC = () => {
  const { currentTheme, setThemeById, themes, isThemeModalOpen, setIsThemeModalOpen } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-theme-primary-light flex items-center justify-center text-theme-primary shadow-2xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                অ্যাপ থিম সিলেক্টর
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                পছন্দের থিম নির্বাচন করুন
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {themes.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setThemeById(theme.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/80 shadow-xs'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/40'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Swatch preview */}
                  <div className="relative shrink-0 w-12 h-12 rounded-xl shadow-xs overflow-hidden flex">
                    <div
                      className="w-1/2 h-full transition-transform group-hover:scale-105"
                      style={{ backgroundColor: theme.previewColors[0] }}
                    />
                    <div
                      className="w-1/2 h-full transition-transform group-hover:scale-105"
                      style={{ backgroundColor: theme.previewColors[1] }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-md stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {theme.nameBn}
                      </h4>
                      {theme.id === 'ekhanei-classic' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 shrink-0">
                          <Sparkles className="w-2.5 h-2.5" /> লোগো থিম
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Radio button style indicator */}
                <div className="ml-3 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-sm rounded-xl transition shadow-xs"
          >
            সম্পন্ন করুন
          </button>
        </div>
      </div>
    </div>
  );
};
