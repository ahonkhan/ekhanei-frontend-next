'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';
import { NotificationItem } from '@/types';
import {
  Bell,
  X,
  CheckCheck,
  Package,
  Sparkles,
  Megaphone,
  Clock,
  ChevronRight,
  Inbox,
  Image as ImageIcon,
  ExternalLink,
  Volume2,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    closeNotificationDrawer,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    toastNotification,
    clearToast,
  } = useNotification();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'order' | 'custom'>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  if (!isNotificationOpen && !toastNotification && !previewImage) return null;

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return !item.read;
    if (activeTab === 'order') return item.type === 'order' || item.type === 'order_status';
    if (activeTab === 'custom') return item.type === 'custom' || item.type === 'promo' || item.type === 'general';
    return true;
  });

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.read) {
      await markAsRead(item.id);
    }

    // Check if notification contains order redirect or custom url
    if (item.data?.order_id || item.data?.order_number || item.type === 'order') {
      closeNotificationDrawer();
      router.push('/profile?tab=orders');
    } else if (item.data?.url) {
      closeNotificationDrawer();
      window.location.href = item.data.url;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getItemIcon = (type?: string) => {
    switch (type) {
      case 'order':
      case 'order_status':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'custom':
      case 'general':
      default:
        return <Megaphone className="w-4 h-4 text-amber-600" />;
    }
  };

  const getItemBg = (type?: string) => {
    switch (type) {
      case 'order':
      case 'order_status':
        return 'bg-emerald-100/70 border-emerald-200';
      case 'promo':
        return 'bg-purple-100/70 border-purple-200';
      case 'custom':
      case 'general':
      default:
        return 'bg-amber-100/70 border-amber-200';
    }
  };

  return (
    <>
      {/* Toast Alert Banner for Live Real-time Pusher Notification */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-[2100] max-w-sm w-full bg-slate-900/95 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 backdrop-blur-lg animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-extrabold text-xs text-white truncate">{toastNotification.title}</h5>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium line-clamp-2 mt-1 leading-snug">
                {toastNotification.body}
              </p>
            </div>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer Overlay Backdrop */}
      {isNotificationOpen && (
        <div
          onClick={closeNotificationDrawer}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[2000] transition-opacity duration-300"
        />
      )}

      {/* Notification Sliding Drawer */}
      {isNotificationOpen && (
        <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white z-[2001] shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-white/10 border border-white/15">
                <Bell className="w-5 h-5 text-emerald-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-black">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-300 font-medium">
                  Real-time updates & custom announcements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-white/10"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read all</span>
                </button>
              )}
              <button
                onClick={closeNotificationDrawer}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'order', label: 'Orders' },
              { id: 'custom', label: 'Promos & Announcements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold text-slate-500">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3 shadow-xs">
                  <Inbox className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800">No notifications found</h4>
                <p className="text-xs text-slate-500 font-medium max-w-[240px] mt-1">
                  {activeTab === 'unread'
                    ? 'You have read all your notifications!'
                    : 'Any order status updates or system alerts will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = !item.read;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isUnread
                        ? 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-200/90 shadow-2xs'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${getItemBg(
                          item.type
                        )}`}
                      >
                        {getItemIcon(item.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-xs sm:text-sm tracking-tight line-clamp-1 ${
                              isUnread ? 'font-black text-slate-900' : 'font-extrabold text-slate-700'
                            }`}
                          >
                            {item.title}
                          </h4>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            )}
                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {formatTimeAgo(item.created_at)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1 leading-snug">
                          {item.body}
                        </p>

                        {/* Attached Image Thumbnail */}
                        {item.image && (
                          <div className="mt-2.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(item.image!);
                              }}
                              className="relative group/img rounded-xl overflow-hidden border border-slate-200 max-h-32 w-full max-w-[240px] bg-slate-100 flex items-center justify-center cursor-zoom-in"
                            >
                              <img
                                src={item.image}
                                alt="Notification attachment"
                                className="w-full h-full object-cover transition group-hover/img:scale-105"
                              />
                              <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold gap-1">
                                <ImageIcon className="w-3.5 h-3.5" /> View Photo
                              </div>
                            </button>
                          </div>
                        )}

                        {/* Metadata Footer Action */}
                        {(item.data?.order_id || item.data?.url) && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 group-hover:underline">
                            <span>
                              {item.data?.order_id ? 'View Order Details' : 'Open Link'}
                            </span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center shrink-0">
            <p className="text-[11px] font-semibold text-slate-400">
              Pusher Realtime Active • Powered by Ekhanei
            </p>
          </div>
        </aside>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[2200] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-2xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition cursor-pointer z-10 border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain max-h-[85vh] mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};
