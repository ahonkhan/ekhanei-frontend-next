'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Gift,
  MapPin,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { LOCATIONS } from '@/data/mockData';

interface ProfilePageContentProps {
  initialTab?: string;
}

export const ProfilePageContent: React.FC<ProfilePageContentProps> = ({ initialTab = 'orders' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orderStatusTab, setOrderStatusTab] = useState<string>('all');

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'vouchers', label: 'Vouchers', icon: Gift },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'helpline', label: 'Helpline', icon: HelpCircle },
  ];

  const orderStatuses = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'review', label: 'To Review' },
    { id: 'returned', label: 'Returned' },
    { id: 'exchanged', label: 'Exchanged' },
    { id: 'refunded', label: 'Refunded' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50/80 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR NAVIGATION */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* User Profile Card Header */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
              {/* Top Row: User Avatar, Name, Notification */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-emerald-200/80 shadow-xs flex-shrink-0">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>

                  <div>
                    {/* User Name & Verified Badge */}
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight">
                        Md Aohinuzzaman
                      </h3>
                      <svg className="w-4 h-4 text-blue-500 shrink-0 inline-block" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.25 1.273 2.62 2.148 4.2 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.4 4.8l-4.2-4.2 1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bell Icon */}
                <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition border border-slate-200 flex-shrink-0">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Menu Box */}
            <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200/80">
              <nav className="space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/profile/${item.id}`}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 relative ${
                        isActive
                          ? 'bg-emerald-50/90 text-emerald-600 border-l-4 border-emerald-600 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-600'}`} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                    </Link>
                  );
                })}

                {/* Log Out */}
                <button
                  onClick={() => alert('Logged out successfully.')}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT MAIN CONTENT AREA */}
          {/* ========================================================================= */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            
            {/* TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                {/* Header Title */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      My Orders
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    Manage and track your orders easily
                  </p>
                </div>

                {/* Status Tabs Rail */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200/80 pb-2">
                  {orderStatuses.map(status => {
                    const isSelected = orderStatusTab === status.id;
                    return (
                      <button
                        key={status.id}
                        onClick={() => setOrderStatusTab(status.id)}
                        className={`flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-bold transition-all relative ${
                          isSelected
                            ? 'text-slate-900 border-b-2 border-emerald-600 pb-1.5'
                            : 'text-slate-600 hover:text-emerald-600'
                        }`}
                      >
                        {status.label}
                      </button>
                    );
                  })}
                </div>

                {/* Content Box */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 min-h-[320px] flex items-center justify-center text-center shadow-xs">
                  <div className="space-y-2">
                    <p className="text-slate-600 font-semibold text-sm sm:text-base">
                      No data is available
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VOUCHERS */}
            {activeTab === 'vouchers' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Vouchers & Coupons
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    Available discount codes and reward vouchers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                        Welcome Offer
                      </span>
                      <Sparkles className="w-5 h-5 opacity-80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">20% OFF FIRST ORDER</h3>
                      <p className="text-xs opacity-90">Use code WELCOME20 on checkout</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-white/20">
                      <span>Expires in 7 days</span>
                      <button
                        onClick={() => alert('Coupon code WELCOME20 copied!')}
                        className="bg-white text-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-50 transition"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MY ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        My Addresses
                      </h1>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                      Manage your saved delivery locations
                    </p>
                  </div>

                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition">
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LOCATIONS.map(loc => (
                    <div
                      key={loc.id}
                      className={`bg-white rounded-2xl p-4 border transition ${
                        loc.isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-sm text-slate-800 capitalize">
                          {loc.title}
                        </span>
                        {loc.isSelected && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {loc.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ACCOUNT INFORMATION */}
            {activeTab === 'account' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Account Information
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    Update your personal profile details
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Md Aohinuzzaman"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number</label>
                      <input
                        type="text"
                        defaultValue="+880 1700-000000"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        defaultValue="aohinuzzaman@example.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Settings
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    Manage app preferences and reset your account password
                  </p>
                </div>

                {/* Password Reset Section */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 max-w-2xl">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <KeyRound className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800">Password Reset</h3>
                      <p className="text-[11px] text-slate-500">Update your password to keep your account secure</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordReset} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 pr-10 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 pr-10 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>

                    {passwordMsg && (
                      <p className={`text-xs font-bold p-2 rounded-lg ${
                        passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {passwordMsg.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Notifications & Preferences */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 max-w-2xl">
                  <h3 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-2">Notifications</h3>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Order Notifications</h4>
                      <p className="text-[11px] text-slate-500">Receive SMS and push updates for your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4" />
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Promotional Emails</h4>
                      <p className="text-[11px] text-slate-500">Get informed about exclusive daily discounts</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HELPLINE */}
            {activeTab === 'helpline' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-6 h-6 text-emerald-600" />
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Helpline
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                    Need support? Contact our customer service 24/7
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-2">
                    <Phone className="w-6 h-6 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-xs text-slate-800">Call Us</h4>
                    <p className="text-xs text-slate-500 font-medium">+880 1700-000000</p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-2">
                    <MessageSquare className="w-6 h-6 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-xs text-slate-800">Live Chat</h4>
                    <p className="text-xs text-slate-500 font-medium">Available 24/7</p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-center space-y-2">
                    <Mail className="w-6 h-6 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-xs text-slate-800">Email Support</h4>
                    <p className="text-xs text-slate-500 font-medium">support@shymmarket.com</p>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};
