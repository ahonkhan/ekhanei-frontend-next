'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Store,
  TicketPercent,
  MapPin,
  Navigation,
  Edit3,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { StepProgressBar } from './StepProgressBar';

import { useCreateOrderMutation, useGetProfileQuery, useApplyCouponMutation } from '@/store/services/apiService';
import { useAppSelector } from '@/store/hooks';

// Haversine distance calculation in KM
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 3.0;
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
};

export default function CheckoutPageContent() {
  const router = useRouter();
  const { cart, increment, decrement, removeItem, clearCart } = useCart();
  const { selectedLocation, openLocationDrawer, userCoords } = useLocation();
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: profileApiData } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Auto-fill user profile info if logged in
  useEffect(() => {
    const activeUser = profileApiData?.user || user;
    if (activeUser) {
      if (activeUser.name && !fullName) {
        setFullName(activeUser.name);
      }
      if (activeUser.phone && !phone) {
        setPhone(activeUser.phone);
      }
    }
  }, [user, profileApiData]);

  const [deliveryOption, setDeliveryOption] = useState<'gps' | 'custom'>('gps');
  const [houseDetail, setHouseDetail] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_amount: number;
    discount_type: string;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(cart.map((i) => i.id)));

  const allSelected = cart.length > 0 && selectedIds.size === cart.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(cart.map((i) => i.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = cart.filter((item) => selectedIds.has(item.id));
  const productTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Per KM Delivery Charge (৳5 per KM, Minimum ৳15)
  const hubLat = 25.7439;
  const hubLng = 89.2752;
  const userLat = selectedLocation.lat ?? userCoords?.lat ?? hubLat;
  const userLng = selectedLocation.lng ?? userCoords?.lng ?? hubLng;

  const distanceKm = useMemo(() => {
    const dist = calculateDistanceKm(hubLat, hubLng, userLat, userLng);
    return dist <= 0 ? 3.0 : dist;
  }, [userLat, userLng]);

  const deliveryCharge = useMemo(() => {
    return Math.max(15, Math.ceil(distanceKm * 5));
  }, [distanceKm]);

  const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const totalPayable = Math.max(0, productTotal + deliveryCharge - discount);

  // Handle Coupon Apply
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');

    try {
      const res = await applyCoupon({
        code: couponInput.trim(),
        subtotal: productTotal,
        product_ids: selectedItems.map((item) => item.id),
      }).unwrap();

      if (res?.success && res?.coupon) {
        setAppliedCoupon({
          code: res.coupon.code,
          discount_amount: res.coupon.discount_amount,
          discount_type: res.coupon.discount_type,
          message: res.message || 'Coupon code applied successfully!',
        });
        setCouponError('');
      } else {
        setCouponError(res?.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setCouponError(err?.data?.message || 'Failed to apply coupon. Please check code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Group by store
  const storeGroups = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    const store = item.storeName || 'Default Store';
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {});

  const handlePlaceOrder = async () => {
    if (!fullName || !phone) return;
    if (deliveryOption === 'custom' && !customAddress.trim()) return;

    const deliveryAddress =
      deliveryOption === 'custom'
        ? customAddress
        : `${selectedLocation.title}, ${selectedLocation.address} ${houseDetail}`.trim();

    const lat = selectedLocation.lat ?? userCoords?.lat ?? 25.7439;
    const lng = selectedLocation.lng ?? userCoords?.lng ?? 89.2752;
    const plusCode =
      selectedLocation.plusCode ||
      (userCoords ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}` : 'F6W3+38 Rangpur');

    try {
      const res = await createOrder({
        customer_name: fullName,
        customer_phone: phone,
        delivery_address: deliveryAddress,
        latitude: lat,
        longitude: lng,
        google_plus_code: plusCode,
        distance_km: distanceKm,
        coupon_code: appliedCoupon?.code || undefined,
        items: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: productTotal,
        delivery_fee: deliveryCharge,
        total_amount: totalPayable,
        notes: additionalNote,
      }).unwrap();

      clearCart();
      if (res?.data?.order_number) {
        router.push(`/checkout-flow/success?order=${res.data.order_number}`);
      } else {
        router.push('/checkout-flow/success');
      }
    } catch (err) {
      console.error('Order API error, continuing flow:', err);
      clearCart();
      router.push('/checkout-flow/success');
    }
  };

  const isFormValid =
    fullName.trim() !== '' &&
    phone.trim() !== '' &&
    (deliveryOption === 'gps' || customAddress.trim() !== '') &&
    selectedItems.length > 0;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => router.back()} className="text-slate-600 hover:text-emerald-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
      </div>

      {/* Step Bar */}
      <StepProgressBar currentStep={3} />

      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-6">
          {/* ──── SHIPPING FORM ──── */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            {/* ──── DELIVERY LOCATION (GPS AUTO-DETECT VS MANUAL CUSTOM) ──── */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Delivery Location <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Option 1: Current GPS / Selected Header Location */}
                <div
                  onClick={() => setDeliveryOption('gps')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    deliveryOption === 'gps'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 block truncate leading-tight">
                          ডিভাইস লোকেশন
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block truncate">
                          {selectedLocation.title}
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="deliveryOption"
                      checked={deliveryOption === 'gps'}
                      onChange={() => setDeliveryOption('gps')}
                      className="accent-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5"
                    />
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-600 mt-2 line-clamp-1 sm:line-clamp-2 leading-tight">
                    {selectedLocation.address}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLocationDrawer();
                    }}
                    className="mt-2 text-[10px] sm:text-[11px] font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" /> ম্যাপ / জিপিএস
                  </button>
                </div>

                {/* Option 2: Custom Manual Address */}
                <div
                  onClick={() => setDeliveryOption('custom')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    deliveryOption === 'custom'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Edit3 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 block truncate leading-tight">
                          অন্য কোথাও পাঠাতে চাইলে
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium block truncate">
                          ম্যানুয়ালি লিখুন
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="deliveryOption"
                      checked={deliveryOption === 'custom'}
                      onChange={() => setDeliveryOption('custom')}
                      className="accent-emerald-600 w-3.5 h-3.5 shrink-0 mt-0.5"
                    />
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-2 line-clamp-1 sm:line-clamp-2 leading-tight">
                    ডেলিভারির জন্য সম্পূর্ণ ঠিকানা লিখুন।
                  </p>
                </div>
              </div>

              {/* Extra input field depending on selection */}
              {deliveryOption === 'custom' ? (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700">
                    যেখানে পাঠাবেন সেই জায়গার ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={e => setCustomAddress(e.target.value)}
                    placeholder="যেখানে পাঠাবেন সেই জায়গার ঠিকানা লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition"
                  />
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700">
                    আপনার ঠিকানা লিখুন (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={houseDetail}
                    onChange={e => setHouseDetail(e.target.value)}
                    placeholder="আপনার ঠিকানা লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition"
                  />
                </div>
              )}
            </div>

            {/* Additional Instruction */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Additional Instruction</label>
              <input
                type="text"
                value={additionalNote}
                onChange={e => setAdditionalNote(e.target.value)}
                placeholder="Enter additional instruction for the address (optional)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition"
              />
            </div>

            {/* Make Default */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={e => setMakeDefault(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span className="text-xs font-medium text-emerald-600">Make it default address</span>
            </label>
          </div>

          {/* ──── MOBILE ONLY: VOUCHER & SUMMARY CARD (ABOVE SELECT ALL ON MOBILE) ──── */}
          <div className="block lg:hidden space-y-4">
            {/* Voucher / Coupon */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4">
              <div className="flex items-center gap-2 mb-3">
                <TicketPercent className="w-4.5 h-4.5 text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">Apply a Voucher / Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-xs text-emerald-900 block uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        -৳{appliedCoupon.discount_amount} Discount Applied
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-rose-500 transition"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code (e.g. SUMMER50)"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold uppercase placeholder:normal-case placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {isApplyingCoupon && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] font-bold text-rose-500">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
              <h3 className="font-black text-base text-slate-900">Summary</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Product Price</span>
                  <span className="font-bold text-slate-800">৳{productTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Delivery Charge ({distanceKm} km @ ৳5/km)
                  </span>
                  <span className="font-bold text-slate-800">৳{deliveryCharge}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-semibold">Coupon Discount</span>
                    <span className="font-bold">-৳{discount}</span>
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              <div className="flex justify-between text-sm">
                <span className="font-black text-slate-900">Total Payable</span>
                <span className="font-black text-emerald-700 text-lg">৳{totalPayable.toLocaleString()}</span>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Payment Method</span>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-50">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Cash on Delivery</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isSubmitting}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Place Order
              </button>
            </div>
          </div>

          {/* ──── PRODUCT LIST ──── */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-xs">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            <span className="text-xs font-bold text-slate-700">
              Select All ({selectedIds.size}/{cart.length})
            </span>
          </div>

          {Object.entries(storeGroups).map(([storeName, items]) => (
            <div key={storeName} className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-sm text-slate-900">{storeName}</span>
              </div>

              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">৳{item.price} x {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-xs sm:text-sm text-slate-900">৳{item.price * item.quantity}</span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => decrement(item.id)} className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center text-xs font-bold">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold px-1.5">{item.quantity}</span>
                      <button onClick={() => increment(item.id)} className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* DESKTOP ONLY: RIGHT COLUMN SUMMARY */}
        <div className="hidden lg:block w-[360px] flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            {/* Voucher / Coupon */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-4">
              <div className="flex items-center gap-2 mb-3">
                <TicketPercent className="w-4.5 h-4.5 text-emerald-600" />
                <span className="font-bold text-sm text-slate-800">Apply a Voucher / Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-xs text-emerald-900 block uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        -৳{appliedCoupon.discount_amount} Discount Applied
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-rose-500 transition"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code (e.g. SUMMER50)"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold uppercase placeholder:normal-case placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {isApplyingCoupon && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] font-bold text-rose-500">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4">
              <h3 className="font-black text-base text-slate-900">Summary</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Product Price</span>
                  <span className="font-bold text-slate-800">৳{productTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Delivery Charge ({distanceKm} km @ ৳5/km)
                  </span>
                  <span className="font-bold text-slate-800">৳{deliveryCharge}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-semibold">Coupon Discount</span>
                    <span className="font-bold">-৳{discount}</span>
                  </div>
                )}
              </div>

              <hr className="border-slate-100" />

              <div className="flex justify-between text-sm">
                <span className="font-black text-slate-900">Total Payable</span>
                <span className="font-black text-emerald-700 text-lg">৳{totalPayable.toLocaleString()}</span>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">Payment Method</span>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-emerald-500 bg-emerald-50">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Cash on Delivery</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isSubmitting}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
