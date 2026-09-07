'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';
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
  Loader2,
  Radio,
  User,
  Star,
  Sparkles,
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

  const { data: apiTrackData, isLoading: isTrackingLoading } = useTrackOrderQuery(activeQuery, {
    skip: !activeQuery,
  });

  const [liveRider, setLiveRider] = useState<any>(null);
  const [liveStatus, setLiveStatus] = useState<TrackedOrder['status'] | null>(null);
  const [isPusherConnected, setIsPusherConnected] = useState(false);

  useEffect(() => {
    if (initialParam) {
      setSearchQuery(initialParam);
      setActiveQuery(initialParam);
      setSearched(true);
    }
  }, [initialParam]);

  // Sync state when initial API track data returns
  useEffect(() => {
    if (apiTrackData) {
      if (apiTrackData.rider) {
        setLiveRider({
          id: apiTrackData.rider.id,
          name: apiTrackData.rider.name,
          phone: apiTrackData.rider.phone,
          vehicle: apiTrackData.rider.vehicle || 'Motorbike Express',
          rating: `${apiTrackData.rider.rating || 4.9} ★`,
          photo: apiTrackData.rider.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          current_latitude: apiTrackData.rider.current_latitude ? Number(apiTrackData.rider.current_latitude) : 25.7410,
          current_longitude: apiTrackData.rider.current_longitude ? Number(apiTrackData.rider.current_longitude) : 89.2710,
        });
      }
      if (apiTrackData.status) {
        setLiveStatus((apiTrackData.status || 'delivering') as TrackedOrder['status']);
      }
    }
  }, [apiTrackData]);

  // Real-time Pusher WebSockets Listener
  useEffect(() => {
    const orderNum = apiTrackData?.order_number || activeQuery;
    if (!orderNum || !searched) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '902a9259bb7eb5c5d39d';
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'ap1';

    try {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });

      pusher.connection.bind('connected', () => {
        setIsPusherConnected(true);
      });

      pusher.connection.bind('disconnected', () => {
        setIsPusherConnected(false);
      });

      const channel = pusher.subscribe(`order.${orderNum}`);

      channel.bind('OrderUpdated', (data: any) => {
        if (data.status) {
          setLiveStatus(data.status as TrackedOrder['status']);
        }
        if (data.rider) {
          setLiveRider((prev: any) => ({
            ...(prev || {}),
            ...data.rider,
            photo: data.rider.photo || prev?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          }));
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect();
      };
    } catch (e) {
      console.warn('Pusher client subscription error:', e);
    }
  }, [apiTrackData?.order_number, activeQuery, searched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveQuery(searchQuery.trim());
    setSearched(true);
  };

  const effectiveStatus = liveStatus || (apiTrackData?.status as TrackedOrder['status']) || 'delivering';
  const effectiveRider = liveRider || (apiTrackData?.rider ? {
    id: apiTrackData.rider.id,
    name: apiTrackData.rider.name,
    phone: apiTrackData.rider.phone,
    vehicle: apiTrackData.rider.vehicle || 'Motorbike Express',
    rating: `${apiTrackData.rider.rating || 4.9} ★`,
    photo: apiTrackData.rider.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    current_latitude: apiTrackData.rider.current_latitude ? Number(apiTrackData.rider.current_latitude) : 25.7410,
    current_longitude: apiTrackData.rider.current_longitude ? Number(apiTrackData.rider.current_longitude) : 89.2710,
  } : undefined);

  const activeOrder: TrackedOrder | null = apiTrackData
    ? {
        orderId: apiTrackData.order_number || activeQuery,
        phone: apiTrackData.customer?.phone || searchQuery,
        customerName: apiTrackData.customer?.name || 'Customer',
        orderDate: apiTrackData.created_at ? new Date(apiTrackData.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today',
        estimatedDelivery: apiTrackData.estimated_delivery || '৩০ মিনিট',
        status: effectiveStatus,
        paymentMethod: apiTrackData.payment_method || 'Cash on Delivery',
        paymentStatus: apiTrackData.payment_status || 'Pending',
        deliveryAddress: apiTrackData.customer?.address || 'Rangpur Sadar',
        customerLat: apiTrackData.customer?.latitude ? Number(apiTrackData.customer.latitude) : 25.7439,
        customerLng: apiTrackData.customer?.longitude ? Number(apiTrackData.customer.longitude) : 89.2752,
        rider: effectiveRider,
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

  const stepsOrder: TrackedOrder['status'][] = [
    'placed',
    'confirmed',
    'rider_assigned',
    'packed',
    'delivering',
    'completed'
  ];

  const getStepStatus = (stepKey: TrackedOrder['status'], currentStatus: TrackedOrder['status']) => {
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
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {getStatusBadgeLabel(activeOrder.status)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Placed on {activeOrder.orderDate} • Customer Phone: <span className="font-bold text-slate-800">{activeOrder.phone}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">


                    <div className="bg-emerald-50 rounded-2xl px-4 py-2.5 border border-emerald-200 text-right sm:text-left">
                      <span className="block text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                        Estimated Arrival
                      </span>
                      <span className="text-sm font-black text-emerald-700 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        {activeOrder.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                </div>



                {/* ========================================================================= */}
                {/* DETAILED ORDER TIMELINE WITH EMBEDDED RIDER PROFILE CARD */}
                {/* ========================================================================= */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Order Timeline & Delivery Stages
                    </h3>
                    <span className="text-xs font-bold text-slate-400">Step-by-Step Live Tracking</span>
                  </div>

                  <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 ml-3 py-2">
                    {/* Stage 1: Order Placed */}
                    <div className="relative group">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 flex items-center justify-center text-white">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">1. Order Placed (অর্ডার গ্রহণ করা হয়েছে)</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Your order has been submitted successfully and sent to store.</p>
                      </div>
                    </div>

                    {/* Stage 2: Confirmed */}
                    <div className="relative group">
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        stepsOrder.indexOf(activeOrder.status) >= 1 ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-300'
                      }`}>
                        <FileCheck className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">2. Order Confirmed (অর্ডার কনফার্মড)</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Store accepted order items and started item verification.</p>
                      </div>
                    </div>

                    {/* Stage 3: Rider Assigned - EMBEDDED RIDER PROFILE CARD */}
                    <div className="relative group space-y-3">
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        stepsOrder.indexOf(activeOrder.status) >= 2 ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-slate-300'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                          3. Rider Assigned (রাইডার অ্যাসাইন করা হয়েছে)
                          {activeOrder.rider && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              Rider Ready
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">Assigned express delivery driver to collect and deliver your order.</p>
                      </div>

                      {/* EMBEDDED RIDER PROFILE CARD IN TIMELINE */}
                      {activeOrder.rider ? (
                        <div className="mt-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-700 space-y-3 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Assigned Rider Profile</span>
                            </div>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                              Verified Express Driver
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={activeOrder.rider.photo}
                                alt={activeOrder.rider.name}
                                className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
                              />
                              <div>
                                <h5 className="font-black text-base text-white">{activeOrder.rider.name}</h5>
                                <p className="text-xs text-slate-300 font-medium mt-0.5">{activeOrder.rider.vehicle}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {activeOrder.rider.rating}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-semibold">• 500+ Express Deliveries</span>
                                </div>
                              </div>
                            </div>

                            <a
                              href={`tel:${activeOrder.rider.phone}`}
                              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                            >
                              <PhoneCall className="w-4 h-4" />
                              <span>Call Rider ({activeOrder.rider.phone})</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
                          Assigning nearby driver to your order...
                        </div>
                      )}
                    </div>

                    {/* Stage 4: Order Packed */}
                    <div className="relative group">
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        stepsOrder.indexOf(activeOrder.status) >= 3 ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-300'
                      }`}>
                        <Package className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">4. Order Packed (প্রস্তুতি সম্পন্ন)</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Order items packed safely and handed over to rider.</p>
                      </div>
                    </div>

                    {/* Stage 5: Out for Delivery */}
                    <div className="relative group">
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        stepsOrder.indexOf(activeOrder.status) >= 4 ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-300'
                      }`}>
                        <Truck className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">5. Out for Delivery (রাইডার রওনা দিয়েছে)</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Rider is moving live towards your location on Google Maps.</p>
                      </div>
                    </div>

                    {/* Stage 6: Delivered */}
                    <div className="relative group">
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                        stepsOrder.indexOf(activeOrder.status) >= 5 ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-300'
                      }`}>
                        <Home className="w-3 h-3" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">6. Delivered (ডেলিভারি সম্পন্ন)</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Order received by customer with cash collection.</p>
                      </div>
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

              {/* Delivery Address & Payment Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Destination Address
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Customer Location</span>
                    <p className="font-bold text-slate-800 text-sm">{activeOrder.deliveryAddress}</p>
                    <p className="text-slate-500 font-medium">Customer Phone: <span className="font-bold text-slate-800">{activeOrder.phone}</span></p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" /> Payment Overview
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Payment Method</span>
                      <p className="font-bold text-slate-800">{activeOrder.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Payment Status</span>
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg uppercase border border-amber-200">
                        {activeOrder.paymentStatus}
                      </span>
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
