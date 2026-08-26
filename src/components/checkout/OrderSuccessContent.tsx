'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Clock, ShoppingBag } from 'lucide-react';
import { StepProgressBar } from './StepProgressBar';

export default function OrderSuccessContent() {
  const [orderId] = useState(() => `ORD-${Date.now().toString(36).toUpperCase()}`);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Step Bar — All complete */}
      <StepProgressBar currentStep={4} />

      <div className="max-w-lg mx-auto mt-8 sm:mt-12 text-center space-y-6">
        {/* Animated Checkmark */}
        <div className={`mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-50 flex items-center justify-center transition-all duration-700 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <CheckCircle className={`w-14 h-14 sm:w-16 sm:h-16 text-emerald-500 transition-all duration-500 delay-300 ${showCheck ? 'scale-100' : 'scale-0'}`} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Thank you for your order. We will contact you shortly for confirmation.
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
            <span className="text-sm font-black text-emerald-700">{orderId}</span>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Payment</span>
                <p className="text-xs font-bold text-slate-800">Cash on Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Delivery</span>
                <p className="text-xs font-bold text-slate-800">Standard Delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Time</span>
                <p className="text-xs font-bold text-slate-800">3-5 Business Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
