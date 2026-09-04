'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  PhoneCall, 
  ShoppingBag, 
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Phone,
  FileCheck,
  ShieldCheck,
  Home,
  Loader2
} from 'lucide-react';
import { LiveRiderMap } from '@/components/track/LiveRiderMap';
import { useTrackOrderQuery } from '@/store/services/apiService';

interface TrackedOrder {
  orderId: string;
  phone: string;
  customerName: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'placed' | 'confirmed' | 'rider_assigned' | 'packed' | 'delivering' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: string;
  customerLat?: number;
  customerLng?: number;
  rider?: {
    id?: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: string;
    photo?: string;
    current_latitude?: number;
    current_longitude?: number;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    unit?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
}

export const TrackOrderContent: React.FC = () => {
  const searchParams = useSearchParams();
  const initialParam = searchParams ? searchParams.get('id') : '';

  const [searchQuery, setSearchQuery] = useState(initialParam || '');
  const [activeQuery, setActiveQuery] = useState(initialParam || '');
  const [searched, setSearched] = useState(!!initialParam);

  const { data: apiTrackData, isLoading: isTrackingLoading, isError } = useTrackOrderQuery(activeQuery, {
    skip: !activeQuery,
  });

  useEffect(() => {
    if (initialParam) {
      setSearchQuery(initialParam);
      setActiveQuery(initialParam);
      setSearched(true);
    }
  }, [initialParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveQuery(searchQuery.trim());
    setSearched(true);
  };

  const activeOrder: TrackedOrder | null = apiTrackData
    ? {
        orderId: apiTrackData.order_number || activeQuery,
        phone: apiTrackData.customer?.phone || searchQuery,
        customerName: apiTrackData.customer?.name || 'Customer',
        orderDate: apiTrackData.created_at || 'Today',
        estimatedDelivery: apiTrackData.estimated_delivery || '৩০ মিনিট',
        status: (apiTrackData.status || 'delivering') as TrackedOrder['status'],
        paymentMethod: apiTrackData.payment_method || 'Cash on Delivery',
        paymentStatus: apiTrackData.payment_status || 'Pending',
        deliveryAddress: apiTrackData.customer?.address || 'Rangpur Sadar',
        customerLat: apiTrackData.customer?.latitude ? Number(apiTrackData.customer.latitude) : 25.7439,
        customerLng: apiTrackData.customer?.longitude ? Number(apiTrackData.customer.longitude) : 89.2752,
        rider: apiTrackData.rider ? {
          id: apiTrackData.rider.id,
          name: apiTrackData.rider.name,
          phone: apiTrackData.rider.phone,
          vehicle: apiTrackData.rider.vehicle || 'Motorbike Express',
          rating: `${apiTrackData.rider.rating || 4.9} ★`,
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          current_latitude: apiTrackData.rider.current_latitude ? Number(apiTrackData.rider.current_latitude) : 25.7410,
          current_longitude: apiTrackData.rider.current_longitude ? Number(apiTrackData.rider.current_longitude) : 89.2710,
        } : undefined,
        items: (apiTrackData.items || []).map((item: any) => ({
          id: String(item.id),
          name: item.product_name || item.name || 'Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
        })),
        subtotal: apiTrackData.subtotal || 0,
        deliveryFee: apiTrackData.delivery_fee || 0,
        discount: 0,
        grandTotal: apiTrackData.total_amount || 0,
      }
    : null;

  const getStepStatus = (stepKey: TrackedOrder['status'], currentStatus: TrackedOrder['status']) => {
    const stepsOrder: TrackedOrder['status'][] = [
      'placed',
      'confirmed',
      'rider_assigned',
      'packed',
      'delivering',
      'completed'
    ];
    const currentIndex = stepsOrder.indexOf(currentStatus);
    const stepIndex = stepsOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const stepsList: {
    key: TrackedOrder['status'];
    title: string;
    sub: string;
    Icon: React.ElementType;
  }[] = [
    { key: 'placed', title: 'Order Placed', sub: 'Received & Validated', Icon: CheckCircle2 },
    { key: 'confirmed', title: 'Confirmed', sub: 'Store Confirmed', Icon: FileCheck },
    { key: 'rider_assigned', title: 'Rider Assigned', sub: 'Driver Allocated', Icon: ShieldCheck },
    { key: 'packed', title: 'Order Packed', sub: 'Prepared at Store', Icon: Package },
    { key: 'delivering', title: 'Out for Delivery', sub: 'Rider on the way', Icon: Truck },
    { key: 'completed', title: 'Delivered', sub: 'Received by Customer', Icon: Home },
  ];

  const getStatusBadgeLabel = (status: TrackedOrder['status']) => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'rider_assigned': return 'Rider Assigned';
      case 'packed': return 'Order Packed';
      case 'delivering': return 'Out for Delivery';
      case 'completed': return 'Delivered';
      default: return 'In Progress';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb / Top Back */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-900 font-bold">Track Order</span>
      </div>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Truck className="w-3.5 h-3.5" /> Live Order Tracking
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Track Your Order Instantly with <span className="text-emerald-400">Order ID or Mobile</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Enter your order number (e.g. EKH-XXXXXX) or registered mobile number for real-time status and live rider GPS location.
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Order ID or Mobile (e.g. EKH-123456)"
                  className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-2xl border border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-7 py-3.5 rounded-2xl transition shadow-md hover:shadow-emerald-500/25 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Track Now</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TRACKING RESULTS CONTENT */}
      {isTrackingLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-xs flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-800">Fetching Live Order & Rider GPS...</h3>
        </div>
      ) : searched && (
        <>
          {activeOrder ? (
            <div className="space-y-6">
              {/* Order Status Summary Header Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Order #{activeOrder.orderId}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 ${
                        activeOrder.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {getStatusBadgeLabel(activeOrder.status)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Placed on {activeOrder.orderDate} • Customer Phone: <span className="font-bold text-slate-800">{activeOrder.phone}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200/70 text-right sm:text-left">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Estimated Arrival
                    </span>
                    <span className="text-sm font-black text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      {activeOrder.estimatedDelivery}
                    </span>
                  </div>
                </div>

                {/* 6-Step Progress Stepper Rail */}
                <div className="py-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-6">
                    Live Progress Status
                  </h3>

                  <div className="relative">
                    {/* Line connecting steps */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0 hidden md:block" />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 relative z-10">
                      {stepsList.map((step) => {
                        const st = getStepStatus(step.key, activeOrder.status);
                        const StepIcon = step.Icon;
                        return (
                          <div key={step.key} className="flex md:flex-col items-center md:items-start gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition shrink-0 ${
                              st === 'completed'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                : st === 'current'
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-extrabold text-slate-900">{step.title}</p>
                              <p className="text-[11px] font-medium text-slate-500">{step.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Live Geolocation Map Container */}
              <LiveRiderMap
                riderName={activeOrder.rider?.name || 'Assigned Express Rider'}
                vehicle={activeOrder.rider?.vehicle || 'Motorbike Express'}
                customerAddress={activeOrder.deliveryAddress}
                status={activeOrder.status}
                riderLat={activeOrder.rider?.current_latitude}
                riderLng={activeOrder.rider?.current_longitude}
                customerLat={activeOrder.customerLat}
                customerLng={activeOrder.customerLng}
              />

              {/* Rider & Address Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rider Card */}
                {activeOrder.rider ? (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600" /> Assigned Delivery Rider
                      </h3>
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Verified Express Driver
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <img
                        src={activeOrder.rider.photo}
                        alt={activeOrder.rider.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-xs"
                      />
                      <div className="flex-1">
                        <h4 className="font-extrabold text-base text-slate-900">{activeOrder.rider.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{activeOrder.rider.vehicle}</p>
                        <p className="text-xs text-amber-600 font-bold mt-0.5">{activeOrder.rider.rating}</p>
                      </div>
                      <a
                        href={`tel:${activeOrder.rider.phone}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Rider
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Rider Allocation</h3>
                      <p className="text-xs text-slate-500 mt-1">Assigning nearby express delivery driver...</p>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                )}

                {/* Delivery Address & Payment Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Destination & Payment
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Delivery Location</span>
                      <p className="font-bold text-slate-800 text-sm">{activeOrder.deliveryAddress}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <div>
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Payment Method</span>
                        <p className="font-bold text-slate-800">{activeOrder.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-400 uppercase text-[10px] block">Payment Status</span>
                        <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                          {activeOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
                <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" /> Ordered Items ({activeOrder.items.length})
                </h3>

                <div className="divide-y divide-slate-100">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200/80"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</h4>
                          {item.unit && <p className="text-[11px] text-slate-400 font-medium">Unit: {item.unit}</p>}
                          <p className="text-xs text-slate-500 font-semibold">Qty: {item.quantity} × ৳{item.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                          ৳{item.quantity * item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown Footer */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Subtotal</span>
                    <span>৳{activeOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Delivery Express Fee</span>
                    <span>৳{activeOrder.deliveryFee}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-extrabold">
                      <span>Promo Discount</span>
                      <span>-৳{activeOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="text-emerald-700">৳{activeOrder.grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">No Orders Found</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find any order matching <span className="font-bold text-slate-800">&quot;{searchQuery}&quot;</span>. Please check your order ID or mobile number.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
