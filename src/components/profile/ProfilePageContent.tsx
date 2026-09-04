'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout, setUser } from '@/store/slices/authSlice';
import {
  useGetUserOrdersQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
} from '@/store/services/apiService';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  ShoppingBag,
  Gift,
  MapPin,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronRight,
  Sparkles,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  KeyRound,
  Eye,
  EyeOff,
  Truck,
  Clock,
  ExternalLink,
  X,
  Loader2,
  CheckCircle2,
  Package,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';

const LOCATIONS = [
  {
    id: '1',
    title: 'Home',
    address: 'House 42, Road 7, Sector 3, Uttara, Dhaka',
    isSelected: true
  },
  {
    id: '2',
    title: 'Office',
    address: 'Level 5, Green Tower, Dhali Para, Rangpur Sadar, Rangpur',
    isSelected: false
  }
];

interface ProfilePageContentProps {
  initialTab?: string;
}

export const ProfilePageContent: React.FC<ProfilePageContentProps> = ({ initialTab = 'orders' }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // RTK Query Hooks
  const { data: profileApiData } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const { data: userOrders = [], isLoading: isOrdersLoading, refetch: refetchOrders } = useGetUserOrdersQuery(undefined, { skip: !isAuthenticated });
  const [updateProfileApi, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePasswordApi, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [orderStatusTab, setOrderStatusTab] = useState<string>('all');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Profile Edit Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Avatar Upload & Remove State
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ text: 'Image size should be less than 5MB', type: 'error' });
      return;
    }

    setIsUploadingAvatar(true);
    setProfileMsg(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = reader.result as string;
        const res = await updateProfileApi({ avatar: base64String }).unwrap();
        if (res.success && res.user) {
          dispatch(setUser(res.user));
          setProfileMsg({ text: 'Profile picture updated successfully!', type: 'success' });
        } else {
          setProfileMsg({ text: res.message || 'Failed to update profile picture', type: 'error' });
        }
      } catch (err: any) {
        setProfileMsg({ text: err?.data?.message || 'Error uploading profile picture', type: 'error' });
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    setProfileMsg(null);

    try {
      const res = await updateProfileApi({ remove_avatar: true, avatar: null }).unwrap();
      if (res.success && res.user) {
        dispatch(setUser(res.user));
        setProfileMsg({ text: 'Profile picture removed!', type: 'success' });
      } else {
        setProfileMsg({ text: res.message || 'Failed to remove profile picture', type: 'error' });
      }
    } catch (err: any) {
      setProfileMsg({ text: err?.data?.message || 'Error removing profile picture', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync profile data when user/profile state updates
  useEffect(() => {
    const activeUser = profileApiData?.user || user;
    if (activeUser) {
      setProfileName(activeUser.name || '');
      setProfilePhone(activeUser.phone || '');
      setProfileEmail(activeUser.email || '');
      if (profileApiData?.user) {
        dispatch(setUser(profileApiData.user));
      }
    }
  }, [profileApiData, user, dispatch]);

  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'account', label: 'Account Information', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'helpline', label: 'Helpline', icon: HelpCircle },
  ];

  const orderStatuses = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'delivering', label: 'Delivering' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  // Filtered Orders
  const filteredOrders = userOrders.filter((ord: any) => {
    if (orderStatusTab === 'all') return true;
    const st = (ord.status || ord.order_status || 'pending').toLowerCase();
    if (orderStatusTab === 'delivering') return st === 'delivering' || st === 'processing' || st === 'packed' || st === 'rider_assigned';
    return st === orderStatusTab;
  });

  // Handle Profile Update Submission
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    try {
      const res = await updateProfileApi({
        name: profileName,
        phone: profilePhone,
        email: profileEmail,
      }).unwrap();

      if (res.success && res.user) {
        dispatch(setUser(res.user));
        setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setProfileMsg({ text: res.message || 'Failed to update profile', type: 'error' });
      }
    } catch (err: any) {
      setProfileMsg({ text: err?.data?.message || 'Error updating profile. Please try again.', type: 'error' });
    }
  };

  // Handle Password Reset Submission
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    try {
      const res = await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
      }).unwrap();

      if (res.success) {
        setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ text: res.message || 'Failed to change password.', type: 'error' });
      }
    } catch (err: any) {
      setPasswordMsg({ text: err?.data?.message || 'Incorrect current password or server error.', type: 'error' });
    }
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
                  <div className="relative group shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center font-bold text-lg border-2 border-emerald-200/80 shadow-xs">
                        <User className="w-6 h-6 text-emerald-600" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition shadow-xs cursor-pointer border border-white"
                      title="Change Profile Photo"
                    >
                      {isUploadingAvatar ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                    </button>
                  </div>

                  <div>
                    {/* User Name & Verified Badge */}
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800 tracking-tight">
                        {mounted ? (user?.name || 'Guest User') : 'User Profile'}
                      </h3>
                      {mounted && user && (
                        <svg className="w-4 h-4 text-blue-500 shrink-0 inline-block" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.25 1.273 2.62 2.148 4.2 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.4 4.8l-4.2-4.2 1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {mounted ? (user?.phone || user?.email || 'Not logged in') : '...'}
                    </p>
                  </div>
                </div>

                {/* Bell Icon */}
                <button className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition border border-slate-200 flex-shrink-0 cursor-pointer">
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
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-left cursor-pointer ${
                        isActive
                          ? 'bg-emerald-50/90 text-emerald-600 border-l-4 border-emerald-600 shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-600'}`} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                    </button>
                  );
                })}

                {/* Log Out / Sign In */}
                {mounted && isAuthenticated ? (
                  <button
                    onClick={() => {
                      dispatch(logout());
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </nav>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT MAIN CONTENT AREA */}
          {/* ========================================================================= */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-5">
            
            {/* TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                {/* Header Title */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="w-6 h-6 text-emerald-600" />
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        My Orders
                      </h1>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                      Manage and track your live express orders
                    </p>
                  </div>

                  {mounted && !isAuthenticated && (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Login to View Orders
                    </button>
                  )}
                </div>

                {/* Status Tabs Rail */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200/80 pb-2">
                  {orderStatuses.map(status => {
                    const isSelected = orderStatusTab === status.id;
                    return (
                      <button
                        key={status.id}
                        onClick={() => setOrderStatusTab(status.id)}
                        className={`flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
                {isOrdersLoading ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 min-h-[320px] flex flex-col items-center justify-center text-center shadow-xs space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <p className="text-slate-500 font-semibold text-xs sm:text-sm">Fetching your orders...</p>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((ord: any) => {
                      const ordStatus = (ord.status || ord.order_status || 'pending').toLowerCase();
                      const itemCount = ord.items ? ord.items.length : 0;
                      return (
                        <div
                          key={ord.id}
                          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-black text-slate-900 text-sm sm:text-base">
                                  #{ord.order_number || ord.id}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                                  ordStatus === 'completed' || ordStatus === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ordStatus === 'delivering' || ordStatus === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {ordStatus}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Placed on {ord.created_at ? new Date(ord.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition cursor-pointer"
                              >
                                Order Details
                              </button>
                              <Link
                                href={`/track-order?id=${ord.order_number || ord.id}`}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track</span>
                              </Link>
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-slate-400" />
                              <span className="font-bold text-slate-700">
                                {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                              </span>
                              {ord.items && ord.items.length > 0 && (
                                <span className="text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                                  ({ord.items.map((i: any) => i.product_name || i.name).join(', ')})
                                </span>
                              )}
                            </div>

                            <div className="text-right">
                              <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Total Amount</span>
                              <span className="font-black text-sm text-emerald-700">
                                ৳{ord.total_amount || ord.subtotal || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-12 min-h-[320px] flex flex-col items-center justify-center text-center shadow-xs space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-slate-700 font-bold text-sm sm:text-base">
                      No orders found in this category
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      When you place an order, it will show up here with real-time updates and rider tracking.
                    </p>
                  </div>
                )}
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

                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer">
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
                  {/* Hidden File Input for Avatar */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Profile Picture Upload & Remove Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="relative group shrink-0">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xs"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center font-extrabold text-2xl border-4 border-white shadow-xs">
                          {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-10 h-10 text-emerald-600" />}
                        </div>
                      )}
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <h4 className="text-xs font-bold text-slate-800">Profile Picture</h4>
                      <p className="text-[11px] text-slate-500 font-medium">PNG, JPG, WEBP or GIF (Max 5MB)</p>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>

                        {user?.avatar && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            disabled={isUploadingAvatar}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {profileMsg && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{profileMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Phone Number</label>
                          {Boolean(user?.phone && user.phone.trim() !== '') && (
                            <span className="text-[10px] text-slate-400 font-semibold">(Cannot be changed)</span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          disabled={Boolean(user?.phone && user.phone.trim() !== '')}
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="Enter phone number"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition ${
                            Boolean(user?.phone && user.phone.trim() !== '')
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-50 border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Email Address</label>
                          <span className="text-[10px] text-slate-400 font-semibold">(Cannot be changed)</span>
                        </div>
                        <input
                          type="email"
                          disabled
                          value={profileEmail}
                          placeholder="customer@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </form>
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
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
                      <p className={`text-xs font-bold p-2.5 rounded-lg border ${
                        passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {passwordMsg.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
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

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Order Details</span>
                <h3 className="text-lg sm:text-xl font-black">#{selectedOrder.order_number || selectedOrder.id}</h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Order Status & Delivery Info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Status</span>
                  <span className="font-black text-emerald-700 uppercase">{selectedOrder.status || selectedOrder.order_status || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Payment</span>
                  <span className="font-bold text-slate-800 capitalize">{selectedOrder.payment_method || 'Cash on Delivery'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Date</span>
                  <span className="font-bold text-slate-800">
                    {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : 'Today'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Est. Delivery</span>
                  <span className="font-bold text-emerald-600">30 Mins</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                  Items ({selectedOrder.items?.length || 0})
                </h4>

                <div className="divide-y divide-slate-100">
                  {selectedOrder.items?.map((item: any) => {
                    const unitPrice = Number(item.price ?? item.unit_price ?? (item.total ? item.total / item.quantity : 0)) || 0;
                    const itemTotal = Number(item.total ?? item.subtotal ?? (unitPrice * (item.quantity || 1))) || 0;
                    return (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                            <Package className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs sm:text-sm">{item.product_name || item.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Qty: {item.quantity || 1} × ৳{unitPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 text-xs sm:text-sm">৳{itemTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address & Rider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Delivery Address</span>
                  <p className="font-bold text-slate-800 text-xs">{selectedOrder.delivery_address || selectedOrder.customer_address || 'Rangpur Sadar'}</p>
                  <p className="text-[11px] text-slate-500">Contact: {selectedOrder.customer_phone}</p>
                </div>

                {selectedOrder.rider && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Assigned Rider</span>
                    <p className="font-bold text-slate-800 text-xs">{selectedOrder.rider.name}</p>
                    <p className="text-[11px] text-slate-500">{selectedOrder.rider.phone} • {selectedOrder.rider.vehicle_type}</p>
                  </div>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>৳{(Number(selectedOrder.subtotal) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>৳{(Number(selectedOrder.delivery_charge ?? selectedOrder.delivery_fee) || 0).toLocaleString()}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-৳{Number(selectedOrder.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">৳{(Number(selectedOrder.total_amount ?? selectedOrder.subtotal) || 0).toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <Link
                href={`/track-order?id=${selectedOrder.order_number || selectedOrder.id}`}
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Open Live Tracking</span>
              </Link>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-extrabold cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
