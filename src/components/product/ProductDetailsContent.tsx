'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductReviewsQuery,
  useSubmitProductReviewMutation,
  useGetAdminReviewsQuery,
  useCreateAdminReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteAdminReviewMutation,
  useGetProfileQuery,
} from '@/store/services/apiService';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { QuickCheckoutModal } from '@/components/product/QuickCheckoutModal';
import { useCart } from '@/context/CartContext';
import { useAppSelector } from '@/store/hooks';
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
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
  ZoomIn,
  RotateCw,
  Maximize2,
  Store as StoreIcon,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Clock,
  Check,
  Trash2,
  User,
  Edit3,
  AlertCircle,
  Filter
} from 'lucide-react';

interface ProductDetailsContentProps {
  productId: string;
}

export const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({ productId }) => {
  const router = useRouter();
  const { addItem, increment, decrement, getItem, totalItemsCount, setIsCartOpen, openAuthModal } = useCart();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const { data: product, isLoading } = useGetProductByIdQuery(productId);
  const { data: categoryProducts = [] } = useGetProductsQuery(
    product?.categoryId ? { categoryId: product.categoryId } : {},
    { skip: !product?.categoryId }
  );

  const relatedProducts = useMemo(() => {
    return categoryProducts.filter((p) => String(p.id) !== String(product?.id)).slice(0, 12);
  }, [categoryProducts, product?.id]);

  const [isQuickCheckoutOpen, setIsQuickCheckoutOpen] = useState(false);

  // Dynamic Variation Attributes & Variations Selection
  const variationAttributes = useMemo(() => {
    if (product?.variationAttributes && product.variationAttributes.length > 0) {
      return product.variationAttributes;
    }
    return [];
  }, [product]);

  const [selectedVariationVal, setSelectedVariationVal] = useState<string>('');

  // Set default selected variation
  useEffect(() => {
    if (variationAttributes.length > 0 && variationAttributes[0].options.length > 0) {
      setSelectedVariationVal(variationAttributes[0].options[0]);
    }
  }, [variationAttributes]);

  // Selected variation object matching selection
  const activeVariation = useMemo(() => {
    if (!product?.variations || product.variations.length === 0) return null;
    return product.variations.find(v => v.value === selectedVariationVal || v.name === selectedVariationVal) || null;
  }, [product, selectedVariationVal]);

  // Active Price & Old Price
  const activePrice = activeVariation?.price || product?.price || 0;
  const activeOldPrice = activeVariation?.oldPrice || product?.oldPrice || Math.round(activePrice * 1.28);

  // Gallery Images
  const galleryImages = useMemo(() => {
    if (product?.galleryImages && product.galleryImages.length > 0) {
      return product.galleryImages;
    }
    if (product?.image) {
      return [
        product.image,
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      ];
    }
    return [];
  }, [product]);

  // Image Viewer Modal state
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewerActiveIdx, setViewerActiveIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  // Tabs state for desktop view: 'description' | 'reviews'
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

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

  // Reviews data & RTK Query
  const targetProdId = product?.id || productId;
  const { data: reviewsData } = useGetProductReviewsQuery(targetProdId, {
    skip: !targetProdId,
  });
  const [submitReview, { isLoading: isSubmittingReview }] = useSubmitProductReviewMutation();
  const { data: userProfile } = useGetProfileQuery();

  // Review Form States
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState('');
  const [reviewSubmitError, setReviewSubmitError] = useState('');

  // Admin Review Tools State
  const [isAdminToolsOpen, setIsAdminToolsOpen] = useState(false);
  const [adminFilterStatus, setAdminFilterStatus] = useState<'pending' | 'approved' | 'all'>('pending');
  const { data: adminReviewsList = [] } = useGetAdminReviewsQuery(adminFilterStatus === 'all' ? undefined : adminFilterStatus, {
    skip: !isAdminToolsOpen,
  });
  const [updateReviewStatus, { isLoading: isUpdatingStatus }] = useUpdateReviewStatusMutation();
  const [deleteAdminReview] = useDeleteAdminReviewMutation();
  const [createAdminReview, { isLoading: isCreatingAdminReview }] = useCreateAdminReviewMutation();

  // Admin Direct Review Form State
  const [adminRating, setAdminRating] = useState(5);
  const [adminComment, setAdminComment] = useState('');
  const [adminCustomerName, setAdminCustomerName] = useState('');
  const [adminVariant, setAdminVariant] = useState('');
  const [adminReviewStatus, setAdminReviewStatus] = useState<'approved' | 'pending'>('approved');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  if (isLoading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  const cartItem = getItem(product.id);

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    addItem({
      ...product,
      price: activePrice,
    });
    router.push('/checkout-flow/checkout');
  };

  const discountPercent =
    activeOldPrice && activeOldPrice > activePrice
      ? Math.round(((activeOldPrice - activePrice) / activeOldPrice) * 100)
      : 28;

  // Store details object
  const storeObj = product.store || {
    id: product.storeId || '1',
    name: product.storeName || 'ShymMarket Partner Store',
    logoImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    reviewsCount: 45,
    deliveryTime: '২০-৩০ মিনিট',
    address: 'Rangpur Sadar',
    verified: true,
  };

  // Dynamic Approved Reviews List from API or Product
  const reviewsList = reviewsData?.reviews || product?.reviews || [
    {
      id: 'r1',
      name: 'Saimon Hosen Rashed',
      size: selectedVariationVal || 'Standard',
      date: '06-02-2026',
      rating: 5,
      comment: 'Dam hishabe mane onk bhalo chilo. High quality and express delivery. Very satisfied with ShymMarket!',
    },
    {
      id: 'r2',
      name: 'Eshita Wahid',
      size: selectedVariationVal || 'Standard',
      date: '23-11-2025',
      rating: 5,
      comment: 'Somoymoto delivery eseche. Quality khub e bhalo, packaging chilo chomotkar!',
    },
  ];

  const handleCustomerSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitError('');
    setReviewSubmitSuccess('');

    if (!newComment.trim()) {
      setReviewSubmitError('Please enter a review comment.');
      return;
    }

    try {
      const res = await submitReview({
        productId: targetProdId,
        rating: newRating,
        comment: newComment,
        customerName: reviewerName || userProfile?.name || 'Customer',
        variantName: selectedVariationVal || 'Standard',
      }).unwrap();

      setReviewSubmitSuccess(res.message || 'Review submitted successfully!');
      setNewComment('');
      setIsReviewFormOpen(false);
    } catch (err: any) {
      setReviewSubmitError(err?.data?.message || 'Failed to submit review.');
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await updateReviewStatus({ id: reviewId, status: 'approved' }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      await updateReviewStatus({ id: reviewId, status: 'rejected' }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteAdminReview(reviewId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg('');
    if (!adminCustomerName.trim() || !adminComment.trim()) return;

    try {
      await createAdminReview({
        product_id: targetProdId,
        customer_name: adminCustomerName,
        rating: adminRating,
        comment: adminComment,
        variant_name: adminVariant || selectedVariationVal || 'Standard',
        status: adminReviewStatus,
      }).unwrap();

      setAdminSuccessMsg('Review created successfully by Admin!');
      setAdminComment('');
      setAdminCustomerName('');
    } catch (err: any) {
      console.error(err);
    }
  };

  const scrollToSimilar = () => {
    const el = document.getElementById('similar-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper component to render Description & Reviews Tabs
  const renderDescriptionAndReviewsTab = () => (
    <div className="space-y-3 pt-2">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-2 font-extrabold text-sm sm:text-base transition relative cursor-pointer ${activeTab === 'description'
              ? 'text-slate-900 border-b-2 border-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
            }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2 font-extrabold text-sm sm:text-base transition relative flex items-center gap-1.5 cursor-pointer ${activeTab === 'reviews'
              ? 'text-slate-900 border-b-2 border-emerald-600'
              : 'text-slate-400 hover:text-slate-700'
            }`}
        >
          <span>Product Reviews</span>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
            {reviewsList.length}
          </span>
        </button>
      </div>

      {/* Tab Content: Description */}
      {activeTab === 'description' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
          {product.shortDescription && (
            <p className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              {product.shortDescription}
            </p>
          )}

          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description || `The premium ${product.name} offers high quality, durability, and comfort. Carefully curated for daily usage with 100% freshness & satisfaction guarantee.`}
          </p>

          <ul className="space-y-1.5 font-semibold text-slate-800 pt-1">
            <li className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Quality Guaranteed</span>
            </li>
            <li className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Express 20-30 Min Hyperlocal Delivery</span>
            </li>
            <li className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cash on Delivery & Easy 3 Days Return</span>
            </li>
          </ul>
        </div>
      )}

      {/* Tab Content: Product Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 pt-1">

          {/* Success Banner Notice */}
          {reviewSubmitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{reviewSubmitSuccess}</span>
              </div>
              <button onClick={() => setReviewSubmitSuccess('')} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Review Action Bar: Write Review Button */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Customer Ratings & Reviews</h4>
              <p className="text-[10px] text-slate-500 font-medium">All reviews are verified and moderated by Admin</p>
            </div>
            <button
              type="button"
              onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Customer Write Review Form Collapsible */}
          {isReviewFormOpen && (
            <form onSubmit={handleCustomerSubmitReview} className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Write Customer Review
                </h4>
                <button type="button" onClick={() => setIsReviewFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reviewSubmitError && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{reviewSubmitError}</span>
                </div>
              )}

              {/* Star Picker */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Select Rating:</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setNewRating(starVal)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${starVal <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{newRating} / 5 Stars</span>
                </div>
              </div>

              {/* Reviewer Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Your Name:</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder={userProfile?.name || 'Enter your name'}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Your Review Experience:</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us about the quality, packaging and delivery experience..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review (Pending Admin Approval)'}
                </button>
              </div>
            </form>
          )}

          {/* Admin Panel Review Tools (Approval & Manual Creation) */}
          {isAdminToolsOpen && (
            <div className="bg-amber-50/70 border border-amber-300 p-4 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <h4 className="font-extrabold text-xs text-amber-900">Admin Review Moderation & Creation Tool</h4>
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1 bg-amber-100 p-1 rounded-xl">
                  {(['pending', 'approved', 'all'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAdminFilterStatus(st)}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold capitalize transition cursor-pointer ${
                        adminFilterStatus === st ? 'bg-amber-700 text-white shadow-2xs' : 'text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {adminSuccessMsg && (
                <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg">
                  {adminSuccessMsg}
                </div>
              )}

              {/* Admin Direct Add Review Form */}
              <form onSubmit={handleAdminAddReview} className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  Add Review directly as Admin
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={adminCustomerName}
                    onChange={(e) => setAdminCustomerName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Variant (e.g. 1 kg / Standard)"
                    value={adminVariant}
                    onChange={(e) => setAdminVariant(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-700 text-[11px]">Rating:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setAdminRating(s)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${s <= adminRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-700 text-[11px]">Status:</label>
                    <select
                      value={adminReviewStatus}
                      onChange={(e) => setAdminReviewStatus(e.target.value as any)}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      <option value="approved">Approved (Immediate Public Show)</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Review Comment by Admin / Customer..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  required
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreatingAdminReview}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {isCreatingAdminReview ? 'Posting...' : 'Post Admin Review'}
                  </button>
                </div>
              </form>

              {/* Pending / Filtered Reviews Table for Moderation */}
              <div className="space-y-2">
                <h5 className="font-bold text-amber-900 text-xs">
                  Reviews Moderation Queue ({adminReviewsList.length})
                </h5>

                {adminReviewsList.length === 0 ? (
                  <p className="text-xs text-amber-700 italic">No reviews found in this status queue.</p>
                ) : (
                  adminReviewsList.map((adminRev: any) => (
                    <div key={adminRev.id} className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{adminRev.name}</span>
                          <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-extrabold uppercase ${
                            adminRev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : adminRev.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {adminRev.status}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs italic">&quot;{adminRev.comment}&quot;</p>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          Product: {adminRev.productName} • Variant: {adminRev.size} • {adminRev.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {adminRev.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleApproveReview(adminRev.id)}
                            disabled={isUpdatingStatus}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {adminRev.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleRejectReview(adminRev.id)}
                            disabled={isUpdatingStatus}
                            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(adminRev.id)}
                          className="p-1 rounded-lg hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Approved Reviews List Render */}
          {reviewsList.length === 0 ? (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-1">
              <MessageSquare className="w-6 h-6 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No public reviews yet for this product.</p>
              <p className="text-[10px] text-slate-400">Be the first customer to write a review above!</p>
            </div>
          ) : (
            reviewsList.map((rev: any) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-200 p-3.5 rounded-2xl space-y-1.5 shadow-xs hover:border-emerald-200 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{rev.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      Variant: {rev.size} &nbsp; • &nbsp; {rev.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-white text-white" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <main className="max-w-[1680px] mx-auto px-0 sm:px-5 pt-0 sm:pt-4 pb-24 sm:pb-16 select-none">

      {/* 2-COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start">

        {/* =================================================================== */}
        {/* LEFT COLUMN: HERO PRODUCT IMAGE SHOWCASE */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 space-y-4">

          {/* Image & Thumbnails Container Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start">

            {/* Desktop Vertical Thumbnail Selector Column */}
            <div className="hidden sm:flex flex-col gap-2.5 shrink-0">
              {galleryImages.slice(0, 4).map((img, idx) => {
                const isFourthAndMore = idx === 3 && galleryImages.length > 4;
                const remainingCount = galleryImages.length - 3;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImgIdx(idx);
                      setIsImageViewerOpen(true);
                      setViewerActiveIdx(idx);
                    }}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 transition shrink-0 group cursor-pointer ${selectedImgIdx === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-102 shadow-sm'
                        : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />

                    {isFourthAndMore && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-base sm:text-lg">
                        +{remainingCount}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Image Box */}
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
                className="sm:hidden absolute top-3 left-3 z-30 p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition active:scale-95 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-900" />
              </button>

              {/* Swiper Slider Component */}
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                autoplay={{
                  delay: 3500,
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

              {/* Bottom Overlay Elements Container (MOBILE ONLY) */}
              <div className="sm:hidden absolute bottom-2 left-2 right-2 z-30 flex items-center justify-between gap-1 flex-nowrap pointer-events-none">

                <div className="pointer-events-auto shrink-0 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/20 shadow-md flex items-center gap-1">
                  <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                    {product.rating || 4.9} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <span className="text-white/40">|</span>
                  <span>{product.soldCount || 113} sold</span>
                </div>

                <div className="pointer-events-auto flex items-center shrink-0">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImgIdx(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${selectedImgIdx === idx ? 'w-3.5 bg-emerald-500' : 'w-1.5 bg-white/60'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToSimilar();
                  }}
                  className="pointer-events-auto shrink-0 bg-white/90 hover:bg-white text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-md backdrop-blur-md transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                >
                  <Utensils className="w-3 h-3 text-emerald-600" />
                  <span>View Similar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Only: Description & Reviews Tabs */}
          <div className="hidden lg:block">
            {renderDescriptionAndReviewsTab()}
          </div>

        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: DYNAMIC DETAILS, DYNAMIC VARIATIONS & STORE CARD */}
        {/* =================================================================== */}
        <div className="lg:col-span-7 space-y-3.5 px-4 sm:px-0">

          {/* 1. Title & Share Row */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-base sm:text-2xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition shrink-0 cursor-pointer" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Star Rating + Meta Sub Row */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold flex-wrap">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-slate-700 ml-1 font-bold">
                  {product.rating || 4.9} ({product.reviewsCount || 5} Reviews)
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span>Sold {product.soldCount || 113}</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-bold">In Stock ({product.stockQuantity || 18})</span>
            </div>
          </div>

          {/* 2. Price Strip */}
          <div className="flex items-baseline gap-2.5 pt-0.5">
            <span className="font-black text-2xl sm:text-3xl text-emerald-700 tracking-tight">
              ৳{activePrice}
            </span>
            <span className="line-through text-slate-400 text-sm sm:text-base font-bold">
              ৳{activeOldPrice}
            </span>
            <span className="text-emerald-700 text-xs font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ({discountPercent}% OFF)
            </span>
            <span className="text-xs text-slate-400 font-bold">/ {product.unit}</span>
          </div>

          {/* 3. DYNAMIC PRODUCT VARIATIONS SECTION */}
          {variationAttributes.map((attr, aIdx) => (
            <div key={aIdx} className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-900 block">
                  {attr.name}
                </label>
                {selectedVariationVal && (
                  <span className="text-[11px] font-bold text-emerald-700">
                    Selected: {selectedVariationVal}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-wrap">
                {attr.options.map((opt) => {
                  const isSelected = selectedVariationVal === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariationVal(opt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 border cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 font-extrabold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* 4. Quantity Selector */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <span className="font-extrabold text-xs text-slate-900">Quantity</span>
            <div className="flex items-center gap-2.5 bg-slate-100 rounded-xl p-1 border border-slate-200/80">
              <button
                onClick={() => decrement(product.id)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-extrabold transition shadow-xs text-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-xs px-2 text-slate-900">
                {cartItem ? cartItem.quantity : 1}
              </span>
              <button
                onClick={() => {
                  if (!cartItem) addItem({ ...product, price: activePrice });
                  else increment(product.id);
                }}
                className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-extrabold transition shadow-xs text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 5. Action Buttons Row */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2 w-full">
            <button
              onClick={() => addItem({ ...product, price: activePrice })}
              className="flex-1 py-3.5 px-4 sm:px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-4 sm:px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* 6. Delivery Guarantees & DYNAMIC STORE CARD BOX */}
          <div className="flex flex-row items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-xs font-semibold text-slate-700">
            <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs min-w-0">
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>Return :</strong> {product.returnPolicy || '3 Days Easy Return'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>Exchange :</strong> {product.exchangePolicy || '3 Days Exchange'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>Delivery :</strong> {product.deliveryTime || '20-30 Mins Express'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>Payment :</strong> {product.paymentMethod || 'COD & Digital Payment'}</span>
              </div>
            </div>

            {/* DYNAMIC STORE CARD (Right-aligned in mobile & desktop) */}
            <Link
              href={storeObj.id ? `/store/${storeObj.id}` : '#'}
              className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-1 shrink-0 hover:border-emerald-400 transition cursor-pointer group max-w-[150px] sm:max-w-[200px]"
            >
              <div className="flex items-center gap-1 text-pink-600">
                <StoreIcon className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">Shop</span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                {storeObj.logoImage ? (
                  <img
                    src={storeObj.logoImage}
                    alt={storeObj.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-emerald-200 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] flex items-center justify-center shrink-0">
                    <StoreIcon className="w-4 h-4" />
                  </div>
                )}

                <div className="flex items-center gap-0.5 min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-600 transition truncate leading-tight">
                    {storeObj.name}
                  </h4>
                  <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <title>Verified Store</title>
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.25 1.273 2.62 2.148 4.2 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.4 4.8l-4.2-4.2 1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* 7. Rating & Reviews Breakdown (Histogram Chart) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Rating & Reviews</h3>

            <div className="flex items-center justify-between gap-4">
              <div className="text-center pr-4 border-r border-slate-200">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center justify-center gap-1">
                  <span>{product.rating || 4.9}</span>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                  By Verified Buyers
                </span>
              </div>

              <div className="flex-1 space-y-1 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span>5 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[85%] bg-emerald-600 rounded-full" />
                  </div>
                  <span className="w-4 text-right">85</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[15%] bg-emerald-600 rounded-full" />
                  </div>
                  <span className="w-4 text-right">15</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-emerald-600 rounded-full" />
                  </div>
                  <span className="w-4 text-right">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-emerald-600 rounded-full" />
                  </div>
                  <span className="w-4 text-right">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>1 ★</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[0%] bg-emerald-600 rounded-full" />
                  </div>
                  <span className="w-4 text-right">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Only: Description & Reviews Tabs */}
          <div className="block lg:hidden pt-3 border-t border-slate-200">
            {renderDescriptionAndReviewsTab()}
          </div>

        </div>
      </div>

      {/* SIMILAR PRODUCTS SECTION */}
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
        product={{ ...product, price: activePrice }}
        quantity={cartItem ? cartItem.quantity : 1}
      />

      {/* IMAGE VIEWER LIGHTBOX MODAL */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl h-[560px] sm:h-[640px] bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col shrink-0">

            {/* Modal Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0 h-14">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-emerald-400 text-sm sm:text-base">
                  {viewerActiveIdx + 1} / {galleryImages.length}
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Use arrow keys to navigate
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 text-slate-300">
                <button
                  onClick={() => setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
                  className="p-1.5 rounded-full hover:bg-slate-800 hover:text-emerald-400 transition cursor-pointer"
                  title="Zoom"
                >
                  <ZoomIn className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                  className="p-1.5 rounded-full hover:bg-slate-800 hover:text-emerald-400 transition cursor-pointer"
                  title="Rotate"
                >
                  <RotateCw className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setRotationAngle(0);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-800 hover:text-emerald-400 transition cursor-pointer"
                  title="Reset"
                >
                  <Maximize2 className="w-4.5 h-4.5" />
                </button>
                <div className="w-px h-5 bg-slate-800" />
                <button
                  onClick={() => setIsImageViewerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Main Image Display Area */}
            <div className="relative flex-1 bg-slate-950 p-4 sm:p-6 flex items-center justify-center overflow-hidden h-[360px] sm:h-[450px]">
              <button
                onClick={() => setViewerActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-3 sm:left-6 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white shadow-md backdrop-blur-md transition active:scale-95 z-20 cursor-pointer"
                title="Previous Image"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

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

              <button
                onClick={() => setViewerActiveIdx((prev) => (prev + 1) % galleryImages.length)}
                className="absolute right-3 sm:right-6 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white shadow-md backdrop-blur-md transition active:scale-95 z-20 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Horizontal Thumbnails Navigation Strip */}
            <div className="flex items-center justify-center gap-3 p-3 sm:p-4 bg-slate-950 border-t border-slate-800 overflow-x-auto no-scrollbar shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setViewerActiveIdx(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${viewerActiveIdx === idx
                      ? 'border-2 border-emerald-500 scale-105 shadow-sm'
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

      {/* MOBILE ONLY: BOTTOM FIXED STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 p-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center justify-between gap-2.5">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 relative text-slate-700 hover:text-emerald-600 transition shrink-0 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold">Cart</span>
        </button>

        <button
          onClick={() => addItem({ ...product, price: activePrice })}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm py-3 rounded-2xl shadow-md transition text-center cursor-pointer"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black text-xs sm:text-sm py-3 rounded-2xl shadow-md transition text-center cursor-pointer"
        >
          Buy Now
        </button>
      </div>

    </main>
  );
};
