'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Palette, X, Check, Sparkles, Layers, Sun, Moon } from 'lucide-react';

export const ThemeSwitcherModal: React.FC = () => {
  const {
    currentTheme,
    setThemeById,
    themes,
    isThemeModalOpen,
    setIsThemeModalOpen,
    themeStyle,
    setThemeStyle,
    themeMode,
    setThemeMode,
  } = useTheme();

  if (!isThemeModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsThemeModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screenshot 3 */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
            Select Color Scheme
          </h3>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Solid vs Gradient Style & Light vs Dark Controls */}
        <div className="px-6 pb-3 space-y-3">
          {/* Finish Style (Solid vs Gradient) */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setThemeStyle('gradient')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                themeStyle === 'gradient'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gradient (গ্র্যাডিয়েন্ট)</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeStyle('solid')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                themeStyle === 'solid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Solid (সলিড)</span>
            </button>
          </div>

          {/* Theme Mode Toggle Pill Switch */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Theme Mode
            </span>

            <div className="inline-flex items-center bg-slate-200/80 dark:bg-slate-700/80 rounded-full p-0.5 border border-slate-300/60 dark:border-slate-600">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Theme List matching Screenshot 3 design */}
        <div className="px-6 py-2 overflow-y-auto space-y-2.5 flex-1 no-scrollbar">
          {themes.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setThemeById(theme.id)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Swatch Preview Thumbnail matching Screenshot 3 */}
                  <div
                    className="relative shrink-0 w-12 h-12 rounded-xl shadow-xs overflow-hidden border border-black/5"
                    style={{
                      background: themeStyle === 'solid' ? theme.primary : theme.gradient,
                    }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white drop-shadow-md stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="truncate">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {theme.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-full py-3 px-4 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-sm rounded-2xl transition shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

