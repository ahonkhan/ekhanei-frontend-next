'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingCart, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAppSelector } from '@/store/hooks';
import { StepProgressBar } from './StepProgressBar';

export default function CartPageContent() {
  const router = useRouter();
  const { cart, increment, decrement, removeItem, totalAmount, totalItemsCount, openAuthModal } = useCart();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(cart.map(i => i.id)));

  const allSelected = cart.length > 0 && selectedIds.size === cart.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cart.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedItems = cart.filter(item => selectedIds.has(item.id));
  const selectedTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Group by store
  const storeGroups = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    const store = item.storeName || 'Default Store';
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {});

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    router.push('/checkout-flow/checkout');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => router.back()} className="text-slate-600 hover:text-emerald-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Cart</h1>
      </div>

      {/* Step Bar */}
      <StepProgressBar currentStep={2} />

      {cart.length === 0 ? (
        /* Empty Cart */
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <ShoppingCart className="w-16 h-16 text-slate-300" />
          <h2 className="text-lg font-bold text-slate-500">Your cart is empty</h2>
          <p className="text-sm text-slate-400">Add some products to get started!</p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-full hover:bg-emerald-700 transition shadow-md"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Cart Content */
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* LEFT: Product List */}
          <div className="flex-1 space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
              />
              <span className="font-bold text-sm text-slate-800">Select All</span>
              <span className="text-xs text-slate-400 ml-auto">({cart.length} items)</span>
            </div>

            {/* Store Groups */}
            {Object.entries(storeGroups).map(([storeName, items]) => (
              <div key={storeName} className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
                {/* Store Header */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm text-slate-800">{storeName}</span>
                </div>

                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                  <span>Product</span>
                  <span className="w-28 text-center">Price</span>
                  <span className="w-36 text-center">Actions</span>
                </div>

                {/* Product Rows */}
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                    />

                    {/* Product Image */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      {item.unit && (
                        <span className="text-[10px] text-slate-400 font-medium">Size: {item.unit}</span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="w-24 sm:w-28 text-center flex-shrink-0">
                      <span className="font-black text-sm sm:text-base text-emerald-700">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    {/* Actions: Delete + Quantity */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => decrement(item.id)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.id)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* RIGHT: Summary */}
          <div className="w-full lg:w-[360px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 sticky top-4 space-y-4">
              <h3 className="font-black text-base text-slate-900">Summary</h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Product Price</span>
                  <span className="font-bold text-slate-800">৳{selectedTotal.toLocaleString()}</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
