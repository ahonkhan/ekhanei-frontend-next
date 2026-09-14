'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Pusher from 'pusher-js';
import { useAppSelector } from '@/store/hooks';
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from '@/store/services/apiService';
import { NotificationItem } from '@/types';

interface NotificationContextType {
  isNotificationOpen: boolean;
  openNotificationDrawer: () => void;
  closeNotificationDrawer: () => void;
  toggleNotificationDrawer: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  toastNotification: NotificationItem | null;
  clearToast: () => void;
  markAsRead: (id: number | string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState<NotificationItem[]>([]);
  const [toastNotification, setToastNotification] = useState<NotificationItem | null>(null);
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const {
    data: apiResponse,
    isLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(undefined, {
    skip: !mounted || !isAuthenticated,
    pollingInterval: 60000, // Poll every 60s as backup
  });

  const [markReadMutation] = useMarkNotificationAsReadMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Play subtle sound notification using Web Audio API Synth (no external audio file required)
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio playback blocked or not supported
    }
  }, []);

  // Handle incoming Pusher Notification Event
  const handleIncomingNotification = useCallback(
    (payload: any) => {
      const newNotif: NotificationItem = {
        id: payload.id || `rt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: payload.title || 'New Notification',
        body: payload.body || payload.message || '',
        type: payload.type || 'custom',
        image: payload.image || payload.image_url || null,
        data: payload.data || payload,
        read: false,
        created_at: payload.sent_at || payload.created_at || new Date().toISOString(),
      };

      setRealtimeNotifications((prev) => {
        // Prevent duplicate IDs
        if (prev.some((item) => String(item.id) === String(newNotif.id))) {
          return prev;
        }
        return [newNotif, ...prev];
      });

      // Show toast alert banner & play chime sound
      setToastNotification(newNotif);
      playNotificationSound();

      // Refresh API notifications list
      refetchNotifications();
    },
    [playNotificationSound, refetchNotifications]
  );

  // Initialize Pusher Real-time Subscriptions
  useEffect(() => {
    if (!mounted) return;

    const pusherKey =
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY ||
      process.env.NEXT_PUBLIC_PUSHER_KEY ||
      '902a9259bb7eb5c5d39d';
    const pusherCluster =
      process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ||
      process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
      'ap1';

    if (!pusherKey) return;

    const userId = user?.id;

    let pusher: Pusher | null = null;
    try {
      pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
      });

      // Subscribe to public channels
      const publicChannel = pusher.subscribe('public-notifications');
      publicChannel.bind('NewNotification', handleIncomingNotification);
      publicChannel.bind('notification', handleIncomingNotification);

      const customerChannel = pusher.subscribe('customers-channel');
      customerChannel.bind('NewNotification', handleIncomingNotification);
      customerChannel.bind('notification', handleIncomingNotification);

      // Subscribe to user-specific channel if logged in
      let userChannel: any = null;
      if (userId) {
        userChannel = pusher.subscribe(`user.${userId}`);
        userChannel.bind('NewNotification', handleIncomingNotification);
        userChannel.bind('notification', handleIncomingNotification);
        userChannel.bind('OrderUpdated', handleIncomingNotification);
      }

      return () => {
        try {
          publicChannel.unbind_all();
          pusher?.unsubscribe('public-notifications');

          customerChannel.unbind_all();
          pusher?.unsubscribe('customers-channel');

          if (userChannel && userId) {
            userChannel.unbind_all();
            pusher?.unsubscribe(`user.${userId}`);
          }

          pusher?.disconnect();
        } catch {
          // Cleanup error catch
        }
      };
    } catch (e) {
      console.warn('Pusher notification listener error:', e);
    }
  }, [mounted, user?.id, handleIncomingNotification]);

  // Merge API notifications & Real-time Notifications
  const apiNotifications: NotificationItem[] = apiResponse?.data || [];
  const mergedNotifications = React.useMemo(() => {
    const map = new Map<string, NotificationItem>();

    // Add API notifications
    apiNotifications.forEach((n) => {
      map.set(String(n.id), n);
    });

    // Add realtime notifications (overwriting or appending)
    realtimeNotifications.forEach((n) => {
      if (!map.has(String(n.id))) {
        map.set(String(n.id), n);
      }
    });

    // Sort by created_at descending
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [apiNotifications, realtimeNotifications]);

  const unreadCount = mergedNotifications.filter((n) => !n.read).length;

  const openNotificationDrawer = () => setIsNotificationOpen(true);
  const closeNotificationDrawer = () => setIsNotificationOpen(false);
  const toggleNotificationDrawer = () => setIsNotificationOpen((prev) => !prev);
  const clearToast = () => setToastNotification(null);

  const markAsRead = async (id: number | string) => {
    // Optimistic state update
    setRealtimeNotifications((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, read: true } : item))
    );

    if (isAuthenticated) {
      try {
        await markReadMutation({ id }).unwrap();
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
  };

  const markAllAsRead = async () => {
    // Optimistic state update
    setRealtimeNotifications((prev) => prev.map((item) => ({ ...item, read: true })));

    if (isAuthenticated) {
      try {
        await markReadMutation({ id: 'all' }).unwrap();
      } catch (err) {
        console.error('Failed to mark all notifications as read:', err);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        isNotificationOpen,
        openNotificationDrawer,
        closeNotificationDrawer,
        toggleNotificationDrawer,
        notifications: mergedNotifications,
        unreadCount,
        isLoading,
        toastNotification,
        clearToast,
        markAsRead,
        markAllAsRead,
        refetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
