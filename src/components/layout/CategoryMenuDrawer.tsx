'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetCategoriesQuery, useGetServiceCategoriesQuery, useGetCategoryDetailQuery } from '@/store/services/apiService';
import { getImageUrl } from '@/utils/image';
import {
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones,
  Mail,
  Phone,
  MessageSquare,
  Store,
  Search,
  ChevronRight,
  Grid,
  Loader2
} from 'lucide-react';

interface CategoryMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryAccordionItem: React.FC<{
  cat: any;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}> = ({ cat, isExpanded, onToggle, onClose }) => {
  const catSlug = cat.slug || cat.id;
  const catUrl = `/${catSlug}`;

  const { data: categoryDetail, isLoading: isDetailLoading } = useGetCategoryDetailQuery(catSlug, {
    skip: !isExpanded || Boolean((cat as any).subCategories || (cat as any).sub_categories || (cat as any).children),
  });

  const subCategories: any[] =
    (cat as any).subCategories ||
    (cat as any).sub_categories ||
    (cat as any).children ||
    categoryDetail?.subCategories ||
    [];

  return (
    <div className="rounded-2xl border border-slate-100 hover:border-emerald-200 transition overflow-hidden bg-white shadow-2xs">
      <div className="flex items-center justify-between p-2.5">
        <Link
          href={catUrl}
          onClick={onClose}
          className="flex items-center gap-3 flex-1 hover:text-emerald-600 transition min-w-0"
        >
          {cat.image || cat.icon ? (
            <img
              src={getImageUrl(cat.image || cat.icon)}
              alt={cat.name}
              className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
              {cat.name.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
              {cat.name}
            </h4>
            {cat.itemCount && (
              <span className="text-[10px] text-slate-400 font-semibold block">
                {cat.itemCount}
              </span>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Subcategories / See All */}
      {isExpanded && (
        <div className="bg-slate-50/90 p-2.5 border-t border-slate-100 space-y-1 text-xs font-semibold text-slate-700">
          {/* See All */}
          <Link
            href={catUrl}
            onClick={onClose}
            className="flex items-center justify-between text-[#d81b60] hover:text-[#b0144d] font-black italic py-1.5 px-3 rounded-lg hover:bg-pink-50/80 transition"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {isDetailLoading && subCategories.length === 0 ? (
            <div className="py-2 px-3 text-slate-400 text-xs flex items-center gap-2 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Loading subcategories...</span>
            </div>
          ) : subCategories.length > 0 ? (
            subCategories.map((sub: any) => {
              const subSlug = sub.slug || sub.id;
              const subUrl = `/${catSlug}/${subSlug}`;
              return (
                <Link
                  key={sub.id || sub.slug || sub.name}
                  href={subUrl}
                  onClick={onClose}
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 transition font-bold"
                >
                  <span className="truncate">{sub.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                </Link>
              );
            })
          ) : null}
        </div>
      )}
    </div>
  );
};

export const CategoryMenuDrawer: React.FC<CategoryMenuDrawerProps> = ({ isOpen, onClose }) => {
  // Fetch real categories & service categories from backend
  const { data: apiCategories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { data: serviceCategories = [] } = useGetServiceCategoriesQuery();

  // Search filter inside sidebar
  const [searchQuery, setSearchQuery] = useState('');
  // Expanded category IDs for accordion
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>([]);

  // Toggle category expansion
  const toggleCategory = (id: string) => {
    setExpandedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return apiCategories;
    const query = searchQuery.toLowerCase();
    return apiCategories.filter((cat) =>
      cat.name.toLowerCase().includes(query) || (cat.slug && cat.slug.toLowerCase().includes(query))
    );
  }, [apiCategories, searchQuery]);

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Left Drawer / Sidebar Panel */}
      <div
        className={`absolute inset-y-0 left-0 w-[300px] sm:w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Single Full Scrollable Container */}
        <div className="overflow-y-auto h-full flex flex-col">
          {/* Header (Sticky at top of drawer scroll container) */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-md sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <Grid className="w-5 h-5 text-amber-300" />
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">Categories</h2>
                <p className="text-[10px] text-emerald-100 font-medium">Explore all express departments</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box in Sidebar */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Categories Accordion Section */}
          <div className="flex-1 p-3 space-y-1.5">


            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 block">
              All Categories ({filteredCategories.length})
            </span>

            {isCategoriesLoading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">Loading categories...</p>
              </div>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <CategoryAccordionItem
                  key={cat.id}
                  cat={cat}
                  isExpanded={expandedCategoryIds.includes(cat.id)}
                  onToggle={() => toggleCategory(cat.id)}
                  onClose={onClose}
                />
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                No categories found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Bottom Contact & Seller Link Cards (Inside the same scrollable container) */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 space-y-2 mt-auto">
            {/* Card 1: EkhaneHelpline */}
            <a
              href="tel:+8801969901212"
              className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                <Headphones className="w-4 h-4 text-[#E2136E]" />
                <span>Govaly Helpline</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            {/* Card 2: Support Email */}
            <a
              href="mailto:support@govaly.com.bd"
              className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                <Mail className="w-4 h-4 text-[#E2136E]" />
                <span className="truncate">support@govaly.com.bd</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            {/* Card 3: Phone Number 1 */}
            <a
              href="tel:01969901212"
              className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                <Phone className="w-4 h-4 text-[#E2136E]" />
                <span>01969901212</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            {/* Card 4: Phone Number 2 */}
            <a
              href="tel:01907104920"
              className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                <MessageSquare className="w-4 h-4 text-[#E2136E]" />
                <span>01907104920</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
            </a>

            {/* Card 5: Become A Seller */}
            <Link
              href="/become-a-seller"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                <Store className="w-4 h-4 text-[#E2136E]" />
                <span>Become A Seller</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
