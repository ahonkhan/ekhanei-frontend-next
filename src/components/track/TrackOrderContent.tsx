'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  PhoneCall, 
  UserCheck, 
  ShoppingBag, 
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Phone,
  FileCheck,
  ShieldCheck,
  Home
} from 'lucide-react';
import { LiveRiderMap } from '@/components/track/LiveRiderMap';

interface TrackedOrder {
  orderId: string;
  phone: string;
  customerName: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'placed' | 'confirmed' | 'rider_assigned' | 'packed' | 'on_the_way' | 'delivered';
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: string;
  rider: {
    name: string;
    phone: string;
    vehicle: string;
    rating: string;
    photo: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    unit?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
}

// Sample orders database for quick lookup by phone or order ID
const MOCK_ORDERS_DB: TrackedOrder[] = [
  {
    orderId: 'ORD-98241',
    phone: '01700000000',
    customerName: 'Tanvir Hossain',
    orderDate: '26 Aug 2026, 02:15 PM',
    estimatedDelivery: '15-20 Mins (02:40 PM)',
    status: 'on_the_way',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    deliveryAddress: 'House 42, Road 7, Sector 3, Uttara, Dhaka',
    rider: {
      name: 'Rahim Uddin',
      phone: '+880 1711-223344',
      vehicle: 'TVS Metro Plus (Dhaka Metro-HA-1234)',
      rating: '4.9 ★ (1,240 deliveries)',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    items: [
      {
        id: '1',
        name: 'Fresh Ruhi Fish (Cleaned & Cut)',
        quantity: 1,
        price: 380,
        image: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=300&q=80',
        unit: '1 kg'
      },
      {
        id: '2',
        name: 'Organic Green Chilies',
        quantity: 1,
        price: 45,
        image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=300&q=80',
        unit: '250 gm'
      }
    ],
    subtotal: 425,
    deliveryFee: 30,
    discount: 20,
    grandTotal: 435,
  },
  {
    orderId: 'ORD-77102',
    phone: '01812345678',
    customerName: 'Nusrat Jahan',
    orderDate: '26 Aug 2026, 01:30 PM',
    estimatedDelivery: 'Delivered at 02:05 PM',
    status: 'delivered',
    paymentMethod: 'bKash Digital Payment',
    paymentStatus: 'Paid',
    deliveryAddress: 'Flat 4B, Green Tower, Dhali Para, Rangpur',
    rider: {
      name: 'Kamal Pasha',
      phone: '+880 1819-998877',
      vehicle: 'Runner 100cc (Rangpur-HA-5678)',
      rating: '4.85 ★ (890 deliveries)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    items: [
      {
        id: '3',
        name: 'Kacchi Biryani Special Box',
        quantity: 2,
        price: 320,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
      }
    ],
    subtotal: 640,
    deliveryFee: 40,
    discount: 50,
    grandTotal: 630,
  }
];

export const TrackOrderContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [activeOrder, setActiveOrder] = useState<TrackedOrder | null>(null);

  // Default auto-search on mount with demo order for seamless UX
  useEffect(() => {
    setActiveOrder(MOCK_ORDERS_DB[0]);
    setSearchQuery(MOCK_ORDERS_DB[0].phone);
    setSearched(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase().replace(/\s+/g, '');
    if (!query) return;

    setSearched(true);

    // Exact match or fallback dynamic match
    const found = MOCK_ORDERS_DB.find(
      (o) => o.phone.includes(query) || o.orderId.toLowerCase().includes(query)
    );

    if (found) {
      setActiveOrder(found);
    } else if (query.length >= 6) {
      // Dynamic fallback order generator for any entered phone number
      const dynamicOrder: TrackedOrder = {
        orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        phone: searchQuery.trim(),
        customerName: 'Customer',
        orderDate: 'Just Now',
        estimatedDelivery: '20-25 Mins',
        status: 'rider_assigned',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        deliveryAddress: 'Rangpur Sadar, Delivery Location',
        rider: {
          name: 'Shakil Ahmed',
          phone: '+880 1700-112233',
          vehicle: 'Honda Livo (Express Rider)',
          rating: '4.9 ★ (520 deliveries)',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        items: [
          {
            id: '101',
            name: 'Fresh Farm Groceries & Essentials',
            quantity: 1,
            price: 520,
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
          }
        ],
        subtotal: 520,
        deliveryFee: 35,
        discount: 25,
        grandTotal: 530,
      };
      setActiveOrder(dynamicOrder);
    } else {
      setActiveOrder(null);
    }
  };

  const getStepStatus = (stepKey: TrackedOrder['status'], currentStatus: TrackedOrder['status']) => {
    const stepsOrder: TrackedOrder['status'][] = [
      'placed',
      'confirmed',
      'rider_assigned',
      'packed',
      'on_the_way',
      'delivered'
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
    { key: 'on_the_way', title: 'Out for Delivery', sub: 'Rider on the way', Icon: Truck },
    { key: 'delivered', title: 'Delivered', sub: 'Received by Customer', Icon: Home },
  ];

  const getStatusBadgeLabel = (status: TrackedOrder['status']) => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'rider_assigned': return 'Rider Assigned';
      case 'packed': return 'Order Packed';
      case 'on_the_way': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
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
            Track Your Order Instantly with <span className="text-emerald-400">Phone Number</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Enter your mobile number or order ID to see real-time updates, live driver position, and estimated delivery time.
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
                  placeholder="Enter Mobile Number (e.g. 01700000000)"
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
      {searched && (
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
                        activeOrder.status === 'delivered' 
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
                riderName={activeOrder.rider.name}
                vehicle={activeOrder.rider.vehicle}
                customerAddress={activeOrder.deliveryAddress}
                status={activeOrder.status}
              />

              {/* Rider & Address Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rider Card */}
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
                        <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
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
                We couldn&apos;t find any active order matching <span className="font-bold text-slate-800">&quot;{searchQuery}&quot;</span>. Please check your mobile number or try searching again.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
