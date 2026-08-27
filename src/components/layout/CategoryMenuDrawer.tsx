'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp, ExternalLink, Headphones, Mail, Phone, MessageSquare, Store } from 'lucide-react';

interface CategoryMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubCategory {
  id: string;
  name: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  seeAllLink?: string;
  subCategories?: SubCategory[];
}

const MENU_CATEGORIES: CategoryGroup[] = [
  {
    id: 'for-you',
    name: 'For You',
    subCategories: [
      { id: 'trending', name: 'Trending Deals' },
      { id: 'new-arrivals', name: 'New Arrivals' },
    ]
  },
  {
    id: 'men',
    name: 'Men',
    seeAllLink: '/category/men',
    subCategories: [
      { id: 'accessories', name: 'Men Fashion Accessories' },
      { id: 'bottomwear', name: 'Men Bottomwear' },
      { id: 'footwear', name: 'Men Footwear' },
      { id: 'topwear', name: 'Men Topwear' },
    ]
  },
  {
    id: 'women',
    name: 'Women',
    seeAllLink: '/category/women',
    subCategories: [
      { id: 'w-clothing', name: 'Women Clothing' },
      { id: 'w-footwear', name: 'Women Footwear' },
      { id: 'w-jewellery', name: 'Jewellery & Watches' },
    ]
  },
  {
    id: 'kids',
    name: 'Kids',
    subCategories: [
      { id: 'boys-fashion', name: 'Boys Fashion' },
      { id: 'girls-fashion', name: 'Girls Fashion' },
      { id: 'toys', name: 'Toys & Games' },
    ]
  },
  {
    id: 'baby',
    name: 'Baby',
    subCategories: [
      { id: 'diapering', name: 'Diapering & Care' },
      { id: 'baby-clothing', name: 'Baby Clothing' },
    ]
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    subCategories: [
      { id: 'skincare', name: 'Skincare' },
      { id: 'haircare', name: 'Haircare' },
      { id: 'makeup', name: 'Makeup' },
    ]
  }
];

export const CategoryMenuDrawer: React.FC<CategoryMenuDrawerProps> = ({ isOpen, onClose }) => {
  // Track open accordion section IDs
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['men']);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Left Drawer Panel */}
      <div
        className={`absolute inset-y-0 left-0 w-[300px] sm:w-[350px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-[#d81b60]">Categories</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Categories Accordion Body */}
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-slate-100">
          {MENU_CATEGORIES.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            return (
              <div key={cat.id} className="py-2">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between py-1.5 text-left font-bold text-sm text-slate-900 hover:text-[#d81b60] transition cursor-pointer"
                >
                  <span>{cat.name}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* Expanded Subcategories */}
                {isExpanded && cat.subCategories && (
                  <div className="pl-3 pt-1 pb-1 space-y-1.5 text-xs font-semibold text-slate-800">
                    {cat.seeAllLink && (
                      <Link
                        href={cat.seeAllLink}
                        onClick={onClose}
                        className="block text-[#d81b60] italic font-bold hover:underline py-0.5"
                      >
                        See All
                      </Link>
                    )}
                    {cat.subCategories.map((sub) => (
                      <div key={sub.id} className="py-1">
                        <Link
                          href={`/search?q=${encodeURIComponent(sub.name)}`}
                          onClick={onClose}
                          className="flex items-center justify-between hover:text-[#d81b60] transition"
                        >
                          <span>{sub.name}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Cards Section */}
        <div className="p-3.5 bg-pink-50/40 border-t border-pink-100 shrink-0 space-y-2">
          {/* Card 1: Helpline */}
          <a
            href="tel:01969901212"
            className="flex items-center justify-between px-3.5 py-2 bg-white border border-pink-100 rounded-xl shadow-2xs hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
              <Headphones className="w-4 h-4 text-[#d81b60]" />
              <span>EkhaneiHelpline</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d81b60] transition" />
          </a>

          {/* Card 2: Email */}
          <a
            href="mailto:support@govaly.com.bd"
            className="flex items-center justify-between px-3.5 py-2 bg-white border border-pink-100 rounded-xl shadow-2xs hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold truncate">
              <Mail className="w-4 h-4 text-[#d81b60] shrink-0" />
              <span className="truncate">support@govaly.com.bd</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d81b60] shrink-0 transition" />
          </a>

          {/* Card 3: Phone */}
          <a
            href="tel:01969901212"
            className="flex items-center justify-between px-3.5 py-2 bg-white border border-pink-100 rounded-xl shadow-2xs hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
              <Phone className="w-4 h-4 text-[#d81b60]" />
              <span>01969901212</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d81b60] transition" />
          </a>

          {/* Card 4: WhatsApp */}
          <a
            href="https://wa.me/8801907104920"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 bg-white border border-pink-100 rounded-xl shadow-2xs hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
              <MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span>01907104920</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d81b60] transition" />
          </a>

          {/* Card 5: Become A Seller */}
          <Link
            href="/store"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2 bg-white border border-pink-100 rounded-xl shadow-2xs hover:shadow-sm transition group"
          >
            <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
              <Store className="w-4 h-4 text-[#d81b60]" />
              <span>Become A Seller</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#d81b60] transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};
