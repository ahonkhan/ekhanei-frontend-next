'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/mockData';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { QuickCheckoutModal } from '@/components/product/QuickCheckoutModal';
import { useCart } from '@/context/CartContext';
import {
  Star,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeftRight,
  Share2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Zap,
  Store as StoreIcon
} from 'lucide-react';

interface ProductDetailsContentProps {
  productId: string;
}

export const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({ productId }) => {
  const { addItem, increment, decrement, getItem } = useCart();
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const cartItem = getItem(product.id);

  const [isQuickCheckoutOpen, setIsQuickCheckoutOpen] = useState(false);

  // Gallery Thumbnails
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  ];
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const selectedImg = galleryImages[selectedImgIdx] || product.image;

  // Active Tab State: 'description' | 'reviews'
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Related Products
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 6);

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 28;

  // Mock Reviews List
  const mockReviews = [
    {
      id: 'r1',
      name: 'Azad hossain',
      date: '12-04-2026',
      rating: 5,
      comment: 'hate paoar por ami really surprised hoyechi. Quality khub e bhaio.. Design ta simple but amr onk valo legeche..',
    },
    {
      id: 'r2',
      name: 'Deeba Farhana',
      date: '16-04-2026',
      rating: 5,
      comment: 'onk sundor shari ta ..overall Govaly er service amr kache valoi legeche ..',
    },
    {
      id: 'r3',
      name: 'Md.Habibur Rahman HaBiB',
      date: '23-04-2026',
      rating: 5,
      comment: 'Overall experience positive, recommend kora jai jodi budget er moddhe kichu khujen.',
    },
    {
      id: 'r4',
      name: 'Emon',
      date: '09-05-2026',
      rating: 5,
      comment: 'Sharir quality valo, Customer support and packaging were also excellent..',
    },
  ];

  // Helper renderer for Description & Reviews Tabs
  const renderDescriptionAndReviews = () => (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-3 font-extrabold text-sm sm:text-base transition relative ${activeTab === 'description'
              ? 'text-slate-900 border-b-2 border-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
            }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 font-extrabold text-sm sm:text-base transition relative flex items-center gap-1.5 ${activeTab === 'reviews'
              ? 'text-slate-900 border-b-2 border-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
            }`}
        >
          <span>Product Reviews</span>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
            9+
          </span>
        </button>
      </div>

      {/* Tab 1: Description Box */}
      {activeTab === 'description' && (
        <div className="bg-emerald-50/30 border border-emerald-100/80 p-5 rounded-3xl space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
          <p className="font-medium">
            This exquisite Kanchipuram saree radiates timeless royalty, featuring intricate gold zari work that shimmers with every movement. Its rich texture and opulent sheen make it a quintessential masterpiece for those who desire a look of profound elegance and heritage.
          </p>

          <div className="space-y-2 pt-1">
            <h4 className="font-extrabold text-slate-900 text-sm">Product Specifications:</h4>
            <ul className="space-y-1.5 text-slate-600 font-medium pl-1">
              <li>
                <span className="font-bold text-slate-900">• Length:</span> The saree measures <strong className="text-slate-900">12 haat</strong> in length and <strong className="text-slate-900">46 inches</strong> in width, ensuring a perfect and comfortable drape.
              </li>
              <li>
                <span className="font-bold text-slate-900">• Blouse:</span> This ensemble includes a <strong className="text-slate-900">matching blouse piece</strong>. The cohesive design enhances the regal aesthetic, providing a complete look.
              </li>
              <li>
                <span className="font-bold text-slate-900">• Tassel:</span> The <em className="italic">pallu (anchel)</em> is adorned with attractive tassels, adding a modern and stylish touch to this traditional attire.
              </li>
              {isDescExpanded && (
                <>
                  <li>
                    <span className="font-bold text-slate-900">• Fabric:</span> Premium Silk Blend with authentic Zari weaving.
                  </li>
                  <li>
                    <span className="font-bold text-slate-900">• Care Instructions:</span> Dry Clean Only to preserve shine and fabric strength.
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              <span>{isDescExpanded ? 'Show Less' : 'See More'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDescExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Reviews List */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            Product Reviews (9)
          </h3>

          <div className="space-y-3">
            {mockReviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{rev.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-normal pt-1">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>

          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition">
            View More Reviews
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12 pt-4 sm:pt-6 pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${product.categoryId || 'fashion'}`} className="hover:text-emerald-600 transition">
            {product.categoryName || 'Fashion'}
          </Link>
          <span>/</span>
          <span className="text-emerald-600 font-extrabold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <Link
          href={`/${product.categoryId || 'fashion'}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold text-xs shadow-xs transition touch-active"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* =================================================================== */}
        {/* LEFT COLUMN: GALLERY SHOWCASE (PLUS DESKTOP DESCRIPTION & REVIEWS) */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 space-y-8">

          {/* Gallery Showcase (Thumbnails below on mobile, vertical stack on left on sm/desktop) */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Thumbnails Stack (Horizontal on mobile below main image, Vertical on desktop) */}
            <div className="flex flex-row sm:flex-col gap-3 shrink-0 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${selectedImgIdx === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-102 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 opacity-80'
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Display Image Container with Left & Right Arrow Controls */}
            <div className="flex-1 w-full aspect-[3/4] sm:aspect-[4/5] max-h-[560px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md relative group">
              <img
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
              />

              {product.discountBadge && (
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md z-10">
                  {product.discountBadge}
                </span>
              )}

              {/* Left Arrow Button */}
              <button
                onClick={() => setSelectedImgIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-emerald-600 hover:text-white text-slate-800 shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 z-20 touch-active opacity-90 hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={() => setSelectedImgIdx((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-emerald-600 hover:text-white text-slate-800 shadow-md backdrop-blur-xs flex items-center justify-center transition-all duration-300 z-20 touch-active opacity-90 hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Only: Description & Reviews (Renders in left column on desktop) */}
          <div className="hidden lg:block">
            {renderDescriptionAndReviews()}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: PURCHASE PANEL, RATING HISTOGRAM & MOBILE DESCRIPTION */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 space-y-6">

          {/* Main Title & Share Button */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition shrink-0">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Rating, Sold & Stock Line */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-bold flex-wrap">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-slate-800 ml-1">5 Reviews</span>
              </div>
              <span className="text-slate-300">|</span>
              <span>Sold 12</span>
              <span className="text-slate-300">|</span>
              <span>Stock 50</span>
            </div>
          </div>

          {/* Price Strip */}
          <div className="flex items-center gap-3 pt-1">
            <span className="font-black text-3xl sm:text-4xl text-emerald-600 tracking-tight">
              ৳{product.price}
            </span>
            <span className="line-through text-slate-400 text-base font-bold">
              ৳{product.oldPrice || Math.round(product.price * 1.38)}
            </span>
            <span className="text-emerald-600 text-xs sm:text-sm font-black bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ({discountPercent}% OFF)
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="font-bold text-xs sm:text-sm text-slate-800">Quantity</span>
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-1 border border-slate-200/80">
              <button
                onClick={() => decrement(product.id)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-extrabold transition shadow-xs text-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-xs px-2 text-slate-900">
                {cartItem ? cartItem.quantity : 1}
              </span>
              <button
                onClick={() => {
                  if (!cartItem) addItem(product);
                  else increment(product.id);
                }}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-extrabold transition shadow-xs text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons Row (FIRST Add to Cart, SECOND Buy Now, THIRD Wishlist) */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => addItem(product)}
              className="flex-1 py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 touch-active"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => setIsQuickCheckoutOpen(true)}
              className="flex-1 py-3.5 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 touch-active cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Service Guarantees Box + Store Info */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Return : 3 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exchange : 3 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Time : 2 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment : COD Available</span>
              </div>
            </div>

            {/* Shop Avatar Card Box */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-2.5 text-left shrink-0">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center uppercase">
                TF
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase">Shop</span>
                <span className="block text-xs font-extrabold text-slate-900 leading-tight">
                  Tawhid Fashion<br />House
                </span>
              </div>
            </div>
          </div>

          {/* Rating & Reviews Breakdown (Histogram) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Rating & Reviews</h3>

            <div className="flex items-center justify-between gap-6">
              {/* Big Score */}
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-6 h-6 fill-emerald-500 text-emerald-500" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                  By Verified Buyers
                </span>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 space-y-1.5 text-[11px] font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <span>5 ⭐</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[85%] bg-emerald-500 rounded-full" />
                  </div>
                  <span className="w-3 text-right">8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4 ⭐</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[15%] bg-emerald-500 rounded-full" />
                  </div>
                  <span className="w-3 text-right">1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3 ⭐</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-emerald-500 rounded-full" />
                  </div>
                  <span className="w-3 text-right">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2 ⭐</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-emerald-500 rounded-full" />
                  </div>
                  <span className="w-3 text-right">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>1 ⭐</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-emerald-500 rounded-full" />
                  </div>
                  <span className="w-3 text-right">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Only: Description & Reviews Tabs (Renders below purchase panel on mobile) */}
          <div className="block lg:hidden pt-4 border-t border-slate-200">
            {renderDescriptionAndReviews()}
          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* SIMILAR PRODUCTS SECTION (BOTTOM FULL-WIDTH GRID) */}
      {/* =================================================================== */}
      <section className="space-y-4 pt-6 border-t border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-7 rounded-full bg-emerald-500" />
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Similar Products
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-1">
          {relatedProducts.map(rel => (
            <PinkProductCard key={`sim-${rel.id}`} product={rel} isSlider={false} />
          ))}
        </div>
      </section>

      {/* Quick Checkout Modal / Mobile Drawer */}
      <QuickCheckoutModal
        isOpen={isQuickCheckoutOpen}
        onClose={() => setIsQuickCheckoutOpen(false)}
        product={product}
        quantity={cartItem ? cartItem.quantity : 1}
      />
    </main>
  );
};
