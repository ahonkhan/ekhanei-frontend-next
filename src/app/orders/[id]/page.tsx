'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Truck, 
  ArrowLeft, 
  Package, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText,
  CreditCard,
  Star
} from 'lucide-react';
import { WriteReviewModal } from '@/components/product/WriteReviewModal';
import { useGetUserOrderDetailQuery, useTrackOrderQuery } from '@/store/services/apiService';
import { useAppSelector } from '@/store/hooks';

export default function OrderDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const orderIdParam = (rawId ? (Array.isArray(rawId) ? rawId[0] : rawId) : '') as string;

  const token = useAppSelector((state) => state.auth?.token) || (typeof window !== 'undefined' ? localStorage.getItem('shym_token') : null);

  const { data: userOrderData, isLoading: isUserOrderLoading } = useGetUserOrderDetailQuery(orderIdParam || '', {
    skip: !orderIdParam || !token,
  });

  const { data: publicTrackData, isLoading: isPublicTrackLoading } = useTrackOrderQuery(orderIdParam || '', {
    skip: !orderIdParam || !!userOrderData,
  });

  const isLoading = isUserOrderLoading || isPublicTrackLoading;
  const order = userOrderData || publicTrackData;
  const [reviewTarget, setReviewTarget] = React.useState<{ productId: string; productName: string; productImage?: string; orderId?: string } | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
        <p className="text-slate-600 font-bold text-sm">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center text-center py-20 min-h-[50vh]">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Order Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6">
          We couldn&apos;t find details for order <span className="font-bold text-slate-800">&quot;{orderIdParam}&quot;</span>.
        </p>
        <Link
          href="/profile"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold rounded-xl transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Profile</span>
        </Link>
      </div>
    );
  }

  const orderNumber = order.order_number || order.id || orderIdParam;
  const orderStatus = (order.status || order.order_status || 'pending').toLowerCase();
  const paymentMethod = order.payment_method ? String(order.payment_method).replace(/_/g, ' ') : 'Cash on Delivery';
  const paymentStatus = order.payment_status || 'Pending';
  const createdAt = order.created_at ? new Date(order.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today';
  const items = order.items || [];
  const subtotal = Number(order.subtotal || order.total_amount) || 0;
  const deliveryFee = Number(order.delivery_charge ?? order.delivery_fee) || 0;
  const discount = Number(order.discount_amount || 0);
  const grandTotal = Number(order.total_amount || (subtotal + deliveryFee - discount)) || 0;
  const customerName = order.customer?.name || order.customer_name || 'Customer';
  const customerPhone = order.customer?.phone || order.customer_phone || '';
  const customerAddress = order.customer?.address || order.delivery_address || order.customer_address || 'Rangpur Sadar';
  const rider = order.rider;

  return (
    <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 py-6">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Back to Profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Invoice Details</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">#{orderNumber}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Placed on {createdAt}</p>
          </div>
        </div>

        {/* Status & Live Track Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            orderStatus === 'completed' || orderStatus === 'delivered'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : orderStatus === 'delivering' || orderStatus === 'processing'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {orderStatus}
          </span>

          <Link
            href={`/track-order?id=${orderNumber}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Truck className="w-4 h-4" />
            <span>Live Track Order</span>
          </Link>
        </div>
      </div>

      {/* Delivery & Payment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Customer & Delivery Address Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Address
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">Customer Name & Address</span>
            <p className="font-extrabold text-slate-900 text-sm">{customerName}</p>
            <p className="font-semibold text-slate-700">{customerAddress}</p>
            {customerPhone && (
              <p className="text-slate-500 font-medium">Contact: <span className="font-bold text-slate-800">{customerPhone}</span></p>
            )}
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Summary
            </h3>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1.5">Payment Method</span>
              <p className="font-bold text-slate-800 capitalize">{paymentMethod}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1.5">Payment Status</span>
              <span className="inline-block font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg uppercase border border-amber-200 text-[11px]">
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Assigned Rider Info Card if Rider assigned */}
      {rider && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Assigned Delivery Rider
            </h3>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{rider.name}</p>
              <p className="text-slate-500 font-medium">{rider.vehicle_type || rider.vehicle || 'Motorbike Express'}</p>
            </div>
            {rider.phone && (
              <a
                href={`tel:${rider.phone}`}
                className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Ordered Items List Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-emerald-600" /> Purchased Products ({items.length})
        </h3>

        <div className="divide-y divide-slate-100">
          {items.map((item: any) => {
            const unitPrice = Number(item.price ?? item.unit_price ?? (item.total ? item.total / item.quantity : 0)) || 0;
            const itemTotal = Number(item.total ?? item.subtotal ?? (unitPrice * (item.quantity || 1))) || 0;
            return (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name || item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200/80"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.product_name || item.name}</h4>
                    {item.unit && <p className="text-[11px] text-slate-400 font-medium">Unit: {item.unit}</p>}
                    <p className="text-xs text-slate-500 font-semibold">Qty: {item.quantity || 1} × ৳{unitPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                    ৳{itemTotal.toLocaleString()}
                  </span>
                  {(orderStatus === 'completed' || orderStatus === 'delivered') && (
                    <button
                      type="button"
                      onClick={() =>
                        setReviewTarget({
                          productId: String(item.product_id || item.id),
                          productName: item.product_name || item.name,
                          productImage: item.image,
                          orderId: String(order?.id || orderIdParam),
                        })
                      }
                      className="mt-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-extrabold rounded-lg transition inline-flex items-center gap-1 cursor-pointer border border-amber-200 shadow-2xs"
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>Add Review</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Breakdown Footer */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 font-semibold">
            <span>Subtotal</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-semibold">
            <span>Delivery Fee</span>
            <span>৳{deliveryFee.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-extrabold">
              <span>Promo Discount</span>
              <span>-৳{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
            <span>Grand Total</span>
            <span className="text-emerald-700">৳{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {reviewTarget && (
        <WriteReviewModal
          isOpen={Boolean(reviewTarget)}
          onClose={() => setReviewTarget(null)}
          productId={reviewTarget.productId}
          productName={reviewTarget.productName}
          productImage={reviewTarget.productImage}
          orderId={reviewTarget.orderId}
        />
      )}

    </main>
  );
}
