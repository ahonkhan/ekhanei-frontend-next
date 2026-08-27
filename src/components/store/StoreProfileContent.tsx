'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Store, Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Share2,
  Heart,
  MessageSquare,
  ShoppingBag,
  Camera,
  CheckCircle2,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Award,
  ShieldCheck,
  Calendar,
  ThumbsUp,
  Image as ImageIcon,
  Info,
  X,
  Copy,
  ExternalLink,
  ChefHat
} from 'lucide-react';

interface StoreProfileContentProps {
  store: Store;
  products: Product[];
}

// Reusable Store Intro Widget Component (Matching Facebook Profile Intro Box)
const StoreIntroWidget: React.FC<{ store: Store; onSeeAllPhotos?: () => void }> = ({ store, onSeeAllPhotos }) => {
  return (
    <div className="space-y-4">
      {/* Store Intro Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ChefHat className="w-5 h-5 text-emerald-600" />
          <span>Store Intro</span>
        </h3>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
          {/* Status & Hours */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open Now
              </span>
              <p className="text-slate-500 text-xs mt-0.5">{store.openingHours || 'Open Daily • 10:30 AM – 11:30 PM'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Store Address</span>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{store.address || 'Plot #14, Station Road, Rangpur Sadar, Rangpur'}</p>
            </div>
          </div>

          {/* Phone */}
          {store.phone && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Phone Support</span>
                <p className="text-slate-500 text-xs mt-0.5">{store.phone}</p>
              </div>
            </div>
          )}

          {/* Delivery Details */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Delivery Details</span>
              <p className="text-slate-500 text-xs mt-0.5">
                Fee: ৳{store.deliveryFee ?? 30} • Min Order: ৳{store.minOrder ?? 150}
              </p>
            </div>
          </div>

          {/* Verified Partner */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Verified Partner</span>
              <p className="text-slate-500 text-xs mt-0.5">{store.joinedDate || 'Member since Jan 2021'}</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {store.socialLinks && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-around text-slate-500">
            {store.socialLinks.facebook && (
              <a href={store.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {store.socialLinks.instagram && (
              <a href={store.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-600 transition p-2 hover:bg-pink-50 rounded-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {store.socialLinks.whatsapp && (
              <a href={store.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition p-2 hover:bg-emerald-50 rounded-lg">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Special Store Offer Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md space-y-2 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Exclusive Deal</span>
        </div>
        <h4 className="font-extrabold text-base leading-tight">
          {store.offer || '20% Instant Discount'}
        </h4>
        <p className="text-xs text-emerald-100 leading-relaxed">
          Use code <span className="font-mono font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">EKHANE20</span> at checkout to get flat discount!
        </p>
      </div>

      {/* Mini Photo Preview Widget */}
      {store.gallery && store.gallery.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900">Store Photos</h4>
            <button
              onClick={onSeeAllPhotos}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
            {store.gallery.slice(0, 4).map((img, i) => (
              <img key={i} src={img} alt="Store visual" className="w-full h-24 object-cover hover:scale-105 transition duration-300 cursor-pointer" onClick={onSeeAllPhotos} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const StoreProfileContent: React.FC<StoreProfileContentProps> = ({ store, products }) => {
  const { addItem, getItem, increment, decrement } = useCart();

  // State management
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular' | 'discount'>('all');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [reviewsList, setReviewsList] = useState(store.reviews || []);

  // Category Tabs Drag-To-Scroll State & Handlers
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isTabsDragging, setIsTabsDragging] = useState(false);
  const [tabsStartX, setTabsStartX] = useState(0);
  const [tabsScrollLeft, setTabsScrollLeft] = useState(0);

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!tabsContainerRef.current) return;
    setIsTabsDragging(true);
    setTabsStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setTabsScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleTabsMouseLeave = () => {
    setIsTabsDragging(false);
  };

  const handleTabsMouseUp = () => {
    setIsTabsDragging(false);
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isTabsDragging || !tabsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - tabsStartX) * 1.6; // Scroll speed multiplier
    tabsContainerRef.current.scrollLeft = tabsScrollLeft - walk;
  };

  // Filter products by selected tab & search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category tab filter
      let matchesTab = true;
      if (activeTab !== 'all' && activeTab !== 'about' && activeTab !== 'reviews' && activeTab !== 'photos') {
        const catKey = activeTab.toLowerCase();
        matchesTab = product.name.toLowerCase().includes(catKey) ||
          product.categoryName?.toLowerCase().includes(catKey) ||
          product.categoryId?.toLowerCase().includes(catKey);
      }

      // Quick sub-filter
      let matchesSubFilter = true;
      if (selectedFilter === 'popular') matchesSubFilter = !!product.isPopular;
      if (selectedFilter === 'discount') matchesSubFilter = !!product.discountBadge || (product.oldPrice > product.price);

      return matchesSearch && matchesTab && matchesSubFilter;
    });
  }, [products, searchQuery, activeTab, selectedFilter]);

  // Handle Share Copy
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Handle Review Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev = {
      id: `r-${Date.now()}`,
      userName: 'Current User',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment,
      likesCount: 0
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewComment('');
    setShowReviewModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* ========================================================================= */}
      {/* 1. FULL WIDTH COVER PHOTO & HEADER (NON-STICKY) */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200/80 shadow-xs">
        
        {/* Full-Bleed 100% Edge-to-Edge Cover Photo */}
        <div className="relative w-full aspect-[3.2/1] sm:aspect-[3.6/1] min-h-[200px] sm:min-h-[280px] md:min-h-[360px] lg:min-h-[400px] bg-slate-900 overflow-hidden shadow-inner group">
          <img
            src={store.coverImage}
            alt={`${store.name} Cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Offer Tag Badge on Cover */}
          {store.offer && (
            <div className="absolute top-4 left-4 sm:left-8 bg-emerald-600/90 backdrop-blur-md text-white text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{store.offer}</span>
            </div>
          )}

          {/* Top Right Quick Actions (Share & Save) */}
          <div className="absolute top-4 right-4 sm:right-8 flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 text-xs font-bold ${
                isSaved
                  ? 'bg-rose-600 text-white border border-rose-500'
                  : 'bg-slate-900/60 text-white hover:bg-slate-900/80 border border-white/20'
              }`}
              title="Save Store"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md transition shadow-md border border-white/20 flex items-center gap-1.5 text-xs font-bold"
              title="Share Store"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Profile Avatar & Metadata Container */}
        <div className="max-w-6xl mx-auto relative px-4">
          
          {/* Centered Profile Avatar Section */}
          <div className="flex flex-col items-center justify-center -mt-14 sm:-mt-20 md:-mt-24 relative z-10 text-center">
            {/* Logo Avatar Box */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full ring-4 ring-white shadow-xl overflow-hidden border-4 border-white bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  src={store.logoImage}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Verified Blue Badge Checkmark Overlay */}
              {store.verified && (
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white rounded-full p-0.5 shadow-sm border border-slate-100" title="Verified Partner">
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.25 1.273 2.62 2.148 4.2 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.4 4.8l-4.2-4.2 1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Store Name + Verification */}
            <div className="mt-3 space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>{store.name}</span>
                <svg className="w-5 h-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.25 1.273 2.62 2.148 4.2 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.4 4.8l-4.2-4.2 1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" />
                </svg>
              </h1>
            </div>

            {/* Quick Stats Pill Row */}
            <div className="mt-3.5 mb-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200/70">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="font-extrabold">{store.rating}</span>
                <span className="text-amber-700 text-[11px]">({store.reviewsCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-xl border border-blue-200/70">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{store.deliveryTime}</span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200/70">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{store.distance}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STORE CATEGORY & PROFILE NAVIGATION TABS (STICKY BAR ONLY) */}
      {/* ========================================================================= */}
      <div className="sticky top-[82px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4">
          <div
            ref={tabsContainerRef}
            onMouseDown={handleTabsMouseDown}
            onMouseLeave={handleTabsMouseLeave}
            onMouseUp={handleTabsMouseUp}
            onMouseMove={handleTabsMouseMove}
            className={`flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs sm:text-sm font-semibold text-slate-600 select-none touch-pan-x ${
              isTabsDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
              
              {/* Category Tabs */}
              {store.storeCategories && store.storeCategories.length > 0 ? (
                store.storeCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      activeTab === cat.id
                        ? 'border-emerald-600 text-emerald-600 font-extrabold'
                        : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === 'all'
                        ? 'border-emerald-600 text-emerald-600 font-extrabold'
                        : 'border-transparent hover:text-slate-900'
                    }`}
                  >
                    All Products
                  </button>
                </>
              )}

              {/* Divider */}
              <div className="h-5 w-px bg-slate-200 mx-1 shrink-0" />

              {/* About Store Tab */}
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'about'
                    ? 'border-emerald-600 text-emerald-600 font-extrabold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>About Store</span>
              </button>

              {/* Reviews Tab */}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-600 text-emerald-600 font-extrabold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Reviews ({reviewsList.length})</span>
              </button>

              {/* Photos Tab */}
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === 'photos'
                    ? 'border-emerald-600 text-emerald-600 font-extrabold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>Photos</span>
              </button>

            </div>
          </div>
        </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT LAYOUT (FULL WIDTH CONTAINER WITHOUT LEFT SIDEBAR) */}
      {/* ========================================================================= */}
      <div id="store-products-section" className="max-w-6xl mx-auto px-4 mt-6 space-y-5">
        
        {/* VIEW 1: ABOUT STORE TAB (ONLY SHOWN WHEN ABOUT STORE TAB IS CLICKED) */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* 1. Store Intro Cards Stack (Address, Hours, Phone, Delivery, Deal, Photos) */}
            <StoreIntroWidget store={store} onSeeAllPhotos={() => setActiveTab('photos')} />

            {/* 2. Detailed Hygiene & Operating Hours Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-600" />
                  <span>About {store.name}</span>
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {store.bio || `${store.name} is a premier vendor partner providing top quality products delivered fresh & fast across Rangpur.`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase">Hygiene & Quality</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    100% Halal & Quality Inspected
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-xs text-slate-500 font-bold uppercase">Average Delivery</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {store.deliveryTime} Doorstep Delivery
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">Operating Schedule</h4>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Saturday – Thursday</span>
                    <span className="font-bold text-slate-900">{store.openingHours || '10:00 AM – 11:00 PM'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Friday</span>
                    <span className="font-bold text-slate-900">02:00 PM – 11:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200/60">
                  <span className="text-3xl font-black text-amber-900">{store.rating}</span>
                  <div className="flex items-center gap-0.5 text-amber-400 mt-0.5 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">{store.reviewsCount} Reviews</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Customer Feedback</h4>
                  <p className="text-xs text-slate-500">Based on verified orders delivered by {store.name}</p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              {reviewsList.map(rev => (
                <div key={rev.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{rev.userName}</h5>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-900 ml-1">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-11">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <span>Store Photo Gallery</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(store.gallery && store.gallery.length > 0 ? store.gallery : [store.coverImage, store.logoImage]).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group cursor-pointer relative">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PRODUCTS LIST / GRID (CLEAN FULL-WIDTH GRID USING PinkProductCard) */}
        {activeTab !== 'about' && activeTab !== 'reviews' && activeTab !== 'photos' && (
          <div className="space-y-4">

            {/* Product Grid using PinkProductCard (Clean 2 to 4 column responsive layout) */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2.5">
                {filteredProducts.map(product => (
                  <PinkProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">No items found matching your criteria</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Try clearing search filters or switching categories.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveTab('all'); setSelectedFilter('all'); }}
                  className="text-xs font-bold text-emerald-600 hover:underline pt-1 inline-block"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. MODALS (SHARE STORE & WRITE REVIEW) */}
      {/* ========================================================================= */}
      
      {/* Share Store Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                <span>Share {store.name}</span>
              </h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">Copy link or share directly with your friends and family:</p>
              
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="bg-transparent text-xs text-slate-700 w-full outline-none px-2 font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddReview} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Write Review for {store.name}</span>
              </h3>
              <button type="button" onClick={() => setShowReviewModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rating Selector */}
            <div className="space-y-1 text-center py-2">
              <label className="text-xs font-bold text-slate-700 block">Select Rating</label>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 hover:scale-125 transition"
                  >
                    <Star className={`w-7 h-7 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Your Review Experience</label>
              <textarea
                rows={4}
                required
                placeholder="Share your experience with food quality, packaging, and delivery speed..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
