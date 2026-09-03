'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBasket, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    increment,
    decrement,
    removeItem,
    totalItemsCount,
    totalAmount
  } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout-flow/cart');
  };

  return (
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[99999] transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Right Drawer Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-white z-[99999] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBasket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>Your Shopping Cart</span>
                {totalItemsCount > 0 && (
                  <span className="text-xs bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                    {totalItemsCount}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">Review items before checkout</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body (Cart Items List or Empty State) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Looks like you haven't added any items to your shopping cart yet.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 shadow-2xs transition"
              >
                {/* Item Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {item.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ৳{item.price} x {item.quantity}
                  </p>
                  <p className="font-extrabold text-xs text-emerald-600 mt-1">
                    ৳{item.price * item.quantity}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition p-1"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => decrement(item.id)}
                      className="w-5 h-5 rounded-lg bg-white text-slate-700 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-slate-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-extrabold min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item.id)}
                      className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-emerald-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer (Total & Checkout Action) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
            {/* Subtotal row */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-600">Subtotal</span>
              <span className="font-black text-slate-900 text-base">৳{totalAmount}</span>
            </div>


            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
