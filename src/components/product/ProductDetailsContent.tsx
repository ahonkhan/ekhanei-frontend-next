'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetProductByIdQuery, useGetProductsQuery } from '@/store/services/apiService';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { QuickCheckoutModal } from '@/components/product/QuickCheckoutModal';
import { useCart } from '@/context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  ArrowLeft,
  ArrowLeftRight,
  Utensils,
  Star,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  Sparkles,
  Award,
  ThumbsUp,
  MessageSquare,
  MessageCircle,
  ZoomIn,
  RotateCw,
  Maximize2,
  Store as StoreIcon
} from 'lucide-react';

interface ProductDetailsContentProps {
  productId: string;
}

export const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({ productId }) => {
  const router = useRouter();
  const { addItem, increment, decrement, getItem, totalItemsCount, setIsCartOpen } = useCart();
  
  const { data: product, isLoading } = useGetProductByIdQuery(productId);
  const { data: categoryProducts = [] } = useGetProductsQuery(
    product?.categoryId ? { categoryId: product.categoryId } : {},
    { skip: !product?.categoryId }
  );

  const relatedProducts = React.useMemo(() => {
    return categoryProducts.filter((p) => String(p.id) !== String(product?.id)).slice(0, 12);
  }, [categoryProducts, product?.id]);

  const [isQuickCheckoutOpen, setIsQuickCheckoutOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedSize, setSelectedSize] = useState('37');

  // Image Viewer Modal state
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewerActiveIdx, setViewerActiveIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  // Tabs state for desktop view: 'description' | 'reviews'
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Sizes List
  const sizes = ['37', '38', '39', '40', '41', '42', '43', '44'];

  // Gallery Images List
  const galleryImages = [
    product?.image || '',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  ];

  // Keyboard navigation for Image Viewer Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isImageViewerOpen) return;
      if (e.key === 'ArrowLeft') {
        setViewerActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      } else if (e.key === 'ArrowRight') {
        setViewerActiveIdx((prev) => (prev + 1) % galleryImages.length);
      } else if (e.key === 'Escape') {
        setIsImageViewerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageViewerOpen, galleryImages.length]);

  if (isLoading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const cartItem = getItem(product.id);

  const handleBuyNow = () => {
    addItem(product);
    router.push('/checkout-flow/checkout');
  };

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 28;

  // Reviews List
  const mockReviews = [
    {
      id: 'r1',
      name: 'Saimon Hosen Rashed',
      size: '43',
      date: '06-02-2026',
      rating: 5,
      comment: 'Sneakers dam hishabe mane onk bhalo chilo. Discount e order korsilam tai delivery man daray thaka obosthay product khule check kore nisi. And I was satisfied.',
    },
    {
      id: 'r2',
      name: 'Eshita wahid',
      size: '38',
      date: '23-11-2025',
      rating: 5,
      comment: 'Ekhaneitheke juta kine ami sotijji khushi. Delivery ta somoymoto eseche, ar packaging eto sundor chil je khultei valo legeche. Got the delivery in time. Thank you Govaly!',
    },
    {
      id: 'r3',
      name: 'Azad hossain',
      size: '41',
      date: '12-04-2026',
      rating: 5,
      comment: 'Hate paoar por ami really surprised hoyechi. Quality khub e bhaio.. Design ta simple but amr onk valo legeche..',
    },
  ];

  const scrollToSimilar = () => {
    const el = document.getElementById('similar-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper component to render Description & Reviews Tabs (Used on desktop left column)
  const renderDescriptionAndReviewsTab = () => (
    <div className="space-y-3 pt-2">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-2 font-extrabold text-sm sm:text-base transition relative ${activeTab === 'description'
              ? 'text-slate-900 border-b-2 border-[#d81b60]'
              : 'text-slate-400 hover:text-slate-700'
            }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 font-extrabold text-sm sm:text-base transition relative flex items-center gap-1.5 ${activeTab === 'reviews'
              ? 'text-slate-900 border-b-2 border-[#d81b60]'
              : 'text-slate-400 hover:text-slate-700'
            }`}
        >
          <span>Product Reviews</span>
          <span className="text-[10px] font-black bg-pink-100 text-[#d81b60] px-1.5 py-0.5 rounded-full">
            9+
          </span>
        </button>
      </div>

      {/* Tab Content: Description */}
      {activeTab === 'description' && (
        <div className="bg-white border border-[#d81b60]/40 rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
          <ul className="space-y-1 font-semibold text-slate-800">
            <li className="flex items-center gap-1.5">• Made from durable material</li>
            <li className="flex items-center gap-1.5">• Lightweight for all-day wear</li>
            <li className="flex items-center gap-1.5">• Stylish, smart design</li>
          </ul>

          <p className="text-slate-600 leading-relaxed">
            Introducing the <em className="font-bold text-slate-800">Panda Comfortable School Shoes</em> – the perfect combination of comfort, style, and durability for students. Designed with lightweight artificial leather, these shoes are perfect for all-day wear, ensuring your feet stay comfortable throughout the school day. With a smart, standard design, they pair easily with school uniforms or casual outfits.
          </p>
        </div>
      )}

      {/* Tab Content: Product Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-3 pt-1">
          {mockReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 p-3.5 rounded-2xl space-y-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{rev.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Size: {rev.size} &nbsp; {rev.date}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 bg-[#d81b60] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-white text-white" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="max-w-[1680px] mx-auto px-0 sm:px-5 pt-0 sm:pt-4 pb-24 sm:pb-16 select-none">

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start">

        {/* =================================================================== */}
        {/* LEFT COLUMN: HERO PRODUCT IMAGE SHOWCASE (COMPACT WIDTH ON DESKTOP) */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 space-y-4">

          {/* Image & Thumbnails Container Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">

            {/* Desktop Vertical Thumbnail Selector Column (MAX 4 PHOTOS WITH OVERLAY ON 4TH) */}
            <div className="hidden sm:flex flex-col gap-2.5 shrink-0">
              {galleryImages.slice(0, 4).map((img, idx) => {
                const isFourthAndMore = idx === 3 && galleryImages.length > 4;
                const remainingCount = galleryImages.length - 3; // e.g. 5 - 3 = +2 (or +1)

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImgIdx(idx);
                      setIsImageViewerOpen(true);
                      setViewerActiveIdx(idx);
                    }}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 transition shrink-0 group ${selectedImgIdx === idx
                        ? 'border-[#d81b60] ring-2 ring-[#d81b60]/20 scale-102 shadow-sm'
                        : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />

                    {/* 4th Thumbnail Overlay showing +N remaining */}
                    {isFourthAndMore && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-base sm:text-lg">
                        +{remainingCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Image Box (Edge-to-Edge feel on mobile, Square 1:1 ratio container on desktop) */}
            <div
              onClick={() => {
                setIsImageViewerOpen(true);
                setViewerActiveIdx(selectedImgIdx);
              }}
              className="flex-1 w-full relative aspect-square max-h-[460px] rounded-none sm:rounded-3xl overflow-hidden bg-slate-100 border-0 sm:border border-slate-200/80 shadow-none sm:shadow-md group cursor-pointer"
            >

              {/* Top Left Floating Back Arrow Button (MOBILE ONLY) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.back();
                }}
                className="sm:hidden absolute top-3 left-3 z-30 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition active:scale-95"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-900" />
              </button>

              {/* Swiper Slider Component (Auto Slide Every 3 Seconds) */}
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                onSlideChange={(swiper) => setSelectedImgIdx(swiper.realIndex)}
                className="w-full h-full"
              >
                {galleryImages.map((img, idx) => (
                  <SwiperSlide key={idx} className="w-full h-full">
                    <img
                      src={img}
                      alt={`${product.name} slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Bottom Overlay Elements Container (MOBILE ONLY - Compact 1 line fit) */}
              <div className="sm:hidden absolute bottom-2 left-2 right-2 z-30 flex items-center justify-between gap-1 flex-nowrap pointer-events-none">

                {/* Bottom Left Rating & Sales Badge Pill */}
                <div className="pointer-events-auto shrink-0 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20 shadow-md flex items-center gap-1">
                  <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                    5.00 <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <span className="text-white/40">|</span>
                  <span>113 sold</span>
                </div>

                {/* Bottom Center Dot Pagination (Compact dots, Heart button removed) */}
                <div className="pointer-events-auto flex items-center shrink-0">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImgIdx(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all ${selectedImgIdx === idx ? 'w-3.5 bg-[#d81b60]' : 'w-1.5 bg-white/60'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom Right View Similar Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToSimilar();
                  }}
                  className="pointer-events-auto shrink-0 bg-white/90 hover:bg-white text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-md backdrop-blur-md transition flex items-center gap-1 border border-slate-200"
                >
                  <Utensils className="w-3 h-3 text-[#d81b60]" />
                  <span>View Similar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Only: Description & Reviews Tabs (Renders under main image on desktop) */}
          <div className="hidden lg:block">
            {renderDescriptionAndReviewsTab()}
          </div>

        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: COMPACT DETAILS, SIZES, ACTIONS & RATING HISTOGRAM */}
        {/* =================================================================== */}
        <div className="lg:col-span-7 space-y-3 px-4 sm:px-0">

          {/* 1. Title & Share Row */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition shrink-0" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Star Rating + Meta Sub Row */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold flex-wrap">
              <div className="flex items-center gap-0.5 text-[#d81b60]">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#d81b60] text-[#d81b60]" />
                ))}
                <Star className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-700 ml-1 font-bold">5 Reviews</span>
              </div>
              <span className="text-slate-300">|</span>
              <span>Sold 113</span>
              <span className="text-slate-300">|</span>
              <span>Stock 18</span>
            </div>
          </div>

          {/* 2. Price Strip */}
          <div className="flex items-baseline gap-2.5 pt-0.5">
            <span className="font-black text-2xl sm:text-3xl text-[#d81b60] tracking-tight">
              ৳{product.price}
            </span>
            <span className="line-through text-slate-400 text-sm sm:text-base font-bold">
              ৳{product.oldPrice || Math.round(product.price * 1.38)}
            </span>
            <span className="text-[#d81b60] text-xs font-black bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
              ({discountPercent}% OFF)
            </span>
          </div>

          {/* 3. Select Size Section */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-900 block">Select Size</label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-10 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 border ${selectedSize === sz
                      ? 'border-[#d81b60] bg-pink-50 text-[#d81b60] ring-2 ring-[#d81b60]/20 font-extrabold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Quantity Selector */}
          <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
            <span className="font-extrabold text-xs text-slate-900">Quantity</span>
            <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl p-1 border border-slate-200/80">
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

          {/* 5. Action Buttons Row (Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2 w-full">
            <button
              onClick={() => addItem(product)}
              className="flex-1 py-3 px-4 sm:px-6 rounded-2xl bg-[#d81b60] hover:bg-[#c2185b] active:bg-[#a8144b] text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 sm:px-6 rounded-2xl bg-[#ff9800] hover:bg-amber-600 active:bg-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* 6. Delivery Guarantees & Shop Card Box */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-pink-50/20 border border-pink-100 text-xs font-semibold text-slate-700 pt-2">
            <div className="space-y-1.5 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#d81b60]" />
                <span><strong>Return :</strong> 3 Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#d81b60]" />
                <span><strong>Exchange :</strong> 3 Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#d81b60]" />
                <span><strong>Delivery Time :</strong> 2 Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d81b60]" />
                <span><strong>Payment :</strong> COD Available</span>
              </div>
            </div>

            {/* Shop Badge Box */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-full bg-pink-100 text-[#d81b60] font-black text-xs flex items-center justify-center">
                <StoreIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block text-[8px] text-[#d81b60] font-bold uppercase tracking-wider">Shop</span>
                <span className="block text-[11px] font-extrabold text-slate-900 leading-tight">
                  Chittagong Shoes
                </span>
              </div>
            </div>
          </div>

          {/* 7. Rating & Reviews Breakdown (Histogram Chart) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Rating & Reviews</h3>

            <div className="flex items-center justify-between gap-4">
              {/* Big Score */}
              <div className="text-center pr-4 border-r border-slate-200">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center justify-center gap-1">
                  <span>4.8</span>
                  <Star className="w-6 h-6 fill-[#d81b60] text-[#d81b60]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                  By Verified Buyers
                </span>
              </div>

              {/* Progress Bars Breakdown */}
              <div className="flex-1 space-y-1 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span>5 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[80%] bg-[#d81b60] rounded-full" />
                  </div>
                  <span className="w-4 text-right">78</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[25%] bg-[#d81b60] rounded-full" />
                  </div>
                  <span className="w-4 text-right">26</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-[#d81b60] rounded-full" />
                  </div>
                  <span className="w-4 text-right">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-[#d81b60] rounded-full" />
                  </div>
                  <span className="w-4 text-right">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>1 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-[#d81b60] rounded-full" />
                  </div>
                  <span className="w-4 text-right">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Only: Description & Reviews Tabs (Renders below on mobile) */}
          <div className="block lg:hidden pt-3 border-t border-slate-200">
            {renderDescriptionAndReviewsTab()}
          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* SIMILAR PRODUCTS SECTION (BOTTOM GRID) */}
      {/* =================================================================== */}
      <section id="similar-products" className="space-y-3 pt-8 mt-8 border-t border-slate-200/80 px-4 sm:px-0">
        <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
          Similar Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 md:gap-2">
          {relatedProducts.map((rel) => (
            <PinkProductCard key={`sim-${rel.id}`} product={rel} isSlider={false} />
          ))}
        </div>
      </section>

      {/* Quick Checkout Modal */}
      <QuickCheckoutModal
        isOpen={isQuickCheckoutOpen}
        onClose={() => setIsQuickCheckoutOpen(false)}
        product={product}
        quantity={cartItem ? cartItem.quantity : 1}
      />

      {/* =================================================================== */}
      {/* IMAGE VIEWER LIGHTBOX MODAL (FIXED SIZE MODAL & NO IMAGE RADIUS) */}
      {/* =================================================================== */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl h-[560px] sm:h-[640px] bg-[#fff5f7] sm:bg-white rounded-3xl overflow-hidden shadow-2xl border border-pink-100/80 flex flex-col shrink-0">

            {/* Modal Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 bg-[#fff5f7] shrink-0 h-14">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-[#d81b60] text-sm sm:text-base">
                  {viewerActiveIdx + 1} / {galleryImages.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Use arrow keys to navigate
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 text-slate-600">
                <button
                  onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                  className="p-1.5 rounded-full hover:bg-pink-100 hover:text-[#d81b60] transition"
                  title="Zoom"
                >
                  <ZoomIn className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                  className="p-1.5 rounded-full hover:bg-pink-100 hover:text-[#d81b60] transition"
                  title="Rotate"
                >
                  <RotateCw className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setRotationAngle(0);
                  }}
                  className="p-1.5 rounded-full hover:bg-pink-100 hover:text-[#d81b60] transition"
                  title="Reset"
                >
                  <Maximize2 className="w-4.5 h-4.5" />
                </button>
                <div className="w-px h-5 bg-slate-200" />
                <button
                  onClick={() => setIsImageViewerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-pink-100 text-[#d81b60] transition"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Main Image Display Area (FIXED HEIGHT CONTAINER) */}
            <div className="relative flex-1 bg-[#fff5f7] p-4 sm:p-6 flex items-center justify-center overflow-hidden h-[360px] sm:h-[450px]">

              {/* Previous Image Arrow Button */}
              <button
                onClick={() => setViewerActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-3 sm:left-6 p-2.5 sm:p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition active:scale-95 z-20"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main Displayed Image (NO RADIUS / ROUNDED-NONE) */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={galleryImages[viewerActiveIdx]}
                  alt={`Product view ${viewerActiveIdx + 1}`}
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                  className="max-h-full max-w-full object-contain rounded-none"
                />
              </div>

              {/* Next Image Arrow Button */}
              <button
                onClick={() => setViewerActiveIdx((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-3 sm:right-6 p-2.5 sm:p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition active:scale-95 z-20"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Horizontal Thumbnails Navigation Strip */}
            <div className="flex items-center justify-center gap-3 p-3 sm:p-4 bg-[#fff5f7] border-t border-pink-100 overflow-x-auto no-scrollbar shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setViewerActiveIdx(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${viewerActiveIdx === idx
                      ? 'border-2 border-[#d81b60] ring-2 ring-[#d81b60]/20 scale-105 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MOBILE ONLY: BOTTOM FIXED STICKY ACTION BAR */}
      {/* =================================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 p-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center justify-between gap-2.5">

        {/* Left 1: Cart Icon Button with Count Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 relative text-slate-700 hover:text-[#d81b60] transition shrink-0"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#d81b60] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold">Cart</span>
        </button>

        {/* Left 2: Chat Button */}
        <button className="flex flex-col items-center gap-0.5 px-2 text-slate-700 hover:text-[#d81b60] transition shrink-0">
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Chat</span>
        </button>

        {/* Brand Pink Add to Cart Button */}
        <button
          onClick={() => addItem(product)}
          className="flex-1 bg-[#d81b60] hover:bg-[#c2185b] active:scale-98 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl shadow-md transition text-center cursor-pointer"
        >
          Add to Cart
        </button>

        {/* Orange Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-[#ff9800] hover:bg-amber-600 active:scale-98 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl shadow-md transition text-center cursor-pointer"
        >
          Buy Now
        </button>

      </div>

    </main>
  );
};
