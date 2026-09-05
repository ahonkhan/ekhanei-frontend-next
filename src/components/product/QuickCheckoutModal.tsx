'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  CheckCircle2,
  CreditCard,
  Banknote,
  TicketPercent,
  Navigation,
  Edit3
} from 'lucide-react';
import { Product } from '@/types';
import { useLocation } from '@/context/LocationContext';
import { useAppSelector } from '@/store/hooks';
import { useGetProfileQuery } from '@/store/services/apiService';

interface QuickCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity?: number;
}

export const QuickCheckoutModal: React.FC<QuickCheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity = 1,
}) => {
  const router = useRouter();
  const { selectedLocation, openLocationDrawer } = useLocation();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: profileApiData } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const activeUser = profileApiData?.user || user;
    if (activeUser) {
      if (activeUser.name && !name) setName(activeUser.name);
      if (activeUser.phone && !phone) setPhone(activeUser.phone);
      if (activeUser.email && !email) setEmail(activeUser.email);
      if ((activeUser.whatsapp || activeUser.whatsapp_number) && !whatsappNumber) {
        setWhatsappNumber(activeUser.whatsapp || activeUser.whatsapp_number || '');
      } else if (activeUser.phone && !whatsappNumber) {
        setWhatsappNumber(activeUser.phone);
      }
    }
  }, [user, profileApiData]);

  const [deliveryOption, setDeliveryOption] = useState<'gps' | 'custom'>('gps');
  const [address, setAddress] = useState(selectedLocation.address);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  if (!isOpen) return null;

  const deliveryFee = 30;
  const productSubtotal = product.price * quantity;
  const totalCost = productSubtotal + deliveryFee - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SHYAM10' || couponCode.trim().toUpperCase() === 'WELCOME50') {
      setDiscountAmount(50);
      setIsCouponApplied(true);
    } else if (couponCode.trim().length > 0) {
      setDiscountAmount(20);
      setIsCouponApplied(true);
    }
  };

  const handleConfirmOrder = () => {
    onClose();
    router.push('/checkout-flow/success');
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal / Bottom Sheet Drawer Container */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[201] pointer-events-none">
        {/* Panel: Bottom Sheet on Mobile (slides up from bottom), Centered Dialog on Desktop */}
        <div className="pointer-events-auto relative w-full sm:max-w-2xl transform overflow-hidden rounded-t-[32px] sm:rounded-3xl bg-white p-5 sm:p-7 text-left shadow-2xl transition-all animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[88vh] sm:max-h-[90vh] flex flex-col">
          
          {/* Mobile Sheet Pull Handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3.5 shrink-0">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-900 leading-tight">
                Express Quick Order
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                Confirm order details to complete your purchase
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-5 custom-scrollbar pr-1">
            
            {/* Product Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white"
                />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs font-bold text-amber-600 mt-0.5">
                    TK {product.price} × {quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-base sm:text-lg text-slate-900">
                  TK {productSubtotal}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Form Field 1: Your Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>আপনার নাম <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Form Field 2: Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <span>ফোন নম্বর <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="আপনার ফোন নম্বর লিখুন"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Form Field 3: Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>ইমেইল এড্রেস (যদি থাকে)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল এড্রেস লিখুন"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              {/* Form Field 4: WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>হোয়াটসঅ্যাপ নম্বর (যদি থাকে)</span>
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="আপনার হোয়াটসঅ্যাপ নম্বর লিখুন"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Form Field 3: Delivery Address */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Delivery Address</span>
              </label>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Option 1: Current GPS / Header Location Card */}
                <div
                  onClick={() => setDeliveryOption('gps')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    deliveryOption === 'gps'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 block truncate leading-tight">
                          ডিভাইস লোকেশন
                        </span>
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block truncate">
                          {selectedLocation.title}
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="deliveryOptionModal"
                      checked={deliveryOption === 'gps'}
                      onChange={() => setDeliveryOption('gps')}
                      className="accent-blue-600 w-3.5 h-3.5 shrink-0 mt-0.5 cursor-pointer"
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
                    className="mt-2 text-[10px] sm:text-[11px] font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" /> ম্যাপ / জিপিএস
                  </button>
                </div>

                {/* Option 2: Custom Manual Address Card */}
                <div
                  onClick={() => setDeliveryOption('custom')}
                  className={`p-2.5 sm:p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    deliveryOption === 'custom'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
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
                      name="deliveryOptionModal"
                      checked={deliveryOption === 'custom'}
                      onChange={() => setDeliveryOption('custom')}
                      className="accent-blue-600 w-3.5 h-3.5 shrink-0 mt-0.5 cursor-pointer"
                    />
                  </div>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-2 line-clamp-1 sm:line-clamp-2 leading-tight">
                    ডেলিভারির জন্য সম্পূর্ণ ঠিকানা লিখুন।
                  </p>
                </div>
              </div>

              {/* Extra input field depending on selection */}
              {deliveryOption === 'custom' ? (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    যেখানে পাঠাবেন সেই জায়গার ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="যেখানে পাঠাবেন সেই জায়গার ঠিকানা লিখুন"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    আপনার ঠিকানা লিখুন (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="আপনার ঠিকানা লিখুন"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              )}
            </div>

            {/* Form Field 4: Payment Method */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                <span>Payment Method</span>
              </label>
              
              <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">Cash on Delivery</h5>
                  <p className="text-xs text-emerald-700 font-medium">Pay cash upon receiving your order</p>
                </div>
              </div>
            </div>

            {/* Form Field 5: Promo / Voucher Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <TicketPercent className="w-3.5 h-3.5 text-blue-500" />
                <span>Promo or Voucher Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="e.g. SHYAM10, WELCOME50"
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shrink-0 cursor-pointer"
                >
                  {isCouponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Product Subtotal</span>
                <span className="font-bold text-slate-900">TK {productSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Delivery Fee</span>
                <span className="font-bold text-slate-900">TK {deliveryFee}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-bold">- TK {discountAmount}</span>
                </div>
              )}
              <hr className="border-slate-200 my-1" />
              <div className="flex justify-between text-sm sm:text-base pt-1">
                <span className="font-black text-slate-900">Total Amount</span>
                <span className="font-black text-blue-600">TK {totalCost}</span>
              </div>
            </div>

          </div>

          {/* Modal Footer: Confirm Order Button */}
          <div className="pt-3 pb-2 sm:pb-0 border-t border-slate-100 shrink-0">
            <button
              onClick={handleConfirmOrder}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base shadow-md shadow-blue-500/20 flex items-center justify-center transition active:scale-[0.99] cursor-pointer"
            >
              <span>Confirm Order (TK {totalCost})</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
