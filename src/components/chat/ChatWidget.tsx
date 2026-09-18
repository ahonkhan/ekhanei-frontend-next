'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, X, Send, Minus, Loader2, Check, CheckCheck, RefreshCw,
  ImagePlus, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, Maximize2,
} from 'lucide-react';
import Pusher from 'pusher-js';
import {
  useGetChatConversationQuery,
  useStartChatConversationMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatReadMutation,
} from '@/store/services/apiService';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useCart } from '@/context/CartContext';
import { ChatLoginRequired } from './ChatLoginRequired';

// ─────────────────────────────────────────────────────────────────────────────
// Full-Screen Photo Viewer Component
// ─────────────────────────────────────────────────────────────────────────────
interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

function PhotoViewer({ images, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const touchStartX = useRef<number>(0);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasMultiple) goNext();
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 0.5));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev, hasMultiple]);

  // Mouse drag for panning when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50 && hasMultiple) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentImage;
    a.download = `chat-image-${currentIndex + 1}`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-sm"
      style={{ animation: 'fadeInViewer 0.2s ease' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 shrink-0">
        <span className="text-white/60 text-sm font-medium">
          {hasMultiple ? `${currentIndex + 1} / ${images.length}` : 'Photo'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-red-500/80 rounded-lg transition-colors ml-2"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* Prev button */}
        {hasMultiple && (
          <button
            onClick={goPrev}
            className="absolute left-3 z-10 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          key={currentImage}
          src={currentImage}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            animation: 'fadeInImg 0.25s ease',
          }}
          draggable={false}
        />

        {/* Next button */}
        {hasMultiple && (
          <button
            onClick={goNext}
            className="absolute right-3 z-10 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip for multiple images */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 p-3 bg-black/60 overflow-x-auto shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setZoom(1); setOffset({ x: 0, y: 0 }); }}
              className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                i === currentIndex ? 'border-emerald-400 scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInViewer { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInImg { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Chat Widget
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo viewer state
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup preview object URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Read Customer Auth Token
  const token = useAppSelector((state) => state.auth?.token) || (mounted && typeof window !== 'undefined' ? localStorage.getItem('shym_token') : null);
  const isAuthenticated = !!token;

  // RTK Query Hooks
  const { data: convResponse, isLoading: isConvLoading, refetch: refetchConv } = useGetChatConversationQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [startConversation, { isLoading: isStarting }] = useStartChatConversationMutation();
  const [sendMessageApi, { isLoading: isSending }] = useSendChatMessageMutation();
  const [markReadApi] = useMarkChatReadMutation();

  const conversation = convResponse?.data;
  const conversationId = conversation?.id;

  const { data: messagesResponse, isLoading: isMessagesLoading, refetch: refetchMessages } = useGetChatMessagesQuery(
    { conversationId: conversationId! },
    { skip: !isAuthenticated || !conversationId }
  );

  // Sync RTK Query messages to local state
  useEffect(() => {
    if (messagesResponse?.data) {
      setMessages(messagesResponse.data);
    }
  }, [messagesResponse]);

  // Auto-poll messages every 3s when chat is open for real-time fallback
  useEffect(() => {
    if (!isAuthenticated || !conversationId || !isOpen || isMinimized) return;
    const interval = setInterval(() => { refetchMessages(); }, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, conversationId, isOpen, isMinimized, refetchMessages]);

  // Handle Pusher WebSockets
  useEffect(() => {
    if (!isAuthenticated || !conversationId) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY || '902a9259bb7eb5c5d39d';
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1';

    if (!pusherKey) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://admin.ekhanei.bd/api/v1';
    const authEndpoint = apiBaseUrl.replace(/\/+$/, '') + '/broadcasting/auth';

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    pusherRef.current = pusher;

    const checkConnection = () => {
      const state = pusher.connection.state;
      if (state === 'connected') setConnectionStatus('connected');
      else if (state === 'connecting') setConnectionStatus('connecting');
      else setConnectionStatus('disconnected');
    };

    checkConnection();
    pusher.connection.bind('state_change', checkConnection);
    pusher.connection.bind('connected', () => setConnectionStatus('connected'));
    pusher.connection.bind('disconnected', () => setConnectionStatus('disconnected'));

    const channel = pusher.subscribe(`private-chat.${conversationId}`);

    const handleNewMessage = (data: any) => {
      if (data && (Number(data.conversation_id) === Number(conversationId) || !data.conversation_id)) {
        setMessages((prev) => {
          if (prev.some((m) => Number(m.id) === Number(data.id))) return prev;
          return [...prev, data];
        });
        if (isOpen && !isMinimized) {
          markReadApi(conversationId);
        }
      }
    };

    channel.bind('MessageSent', handleNewMessage);
    channel.bind('.MessageSent', handleNewMessage);
    channel.bind('App\\Events\\MessageSent', handleNewMessage);
    channel.bind_global((eventName: string, data: any) => {
      if (eventName.includes('MessageSent') || (data && data.id && data.message)) {
        handleNewMessage(data);
      }
    });

    channel.bind('client-typing', (data: any) => {
      if (data && data.sender_type === 'admin') {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-chat.${conversationId}`);
      pusher.disconnect();
    };
  }, [isAuthenticated, conversationId, isOpen, isMinimized, token, markReadApi]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Open Chat Handler
  const handleOpenChat = async () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (isAuthenticated) {
      if (!conversationId) {
        try {
          await startConversation().unwrap();
          refetchConv();
        } catch (err) {
          console.error('Failed to start conversation:', err);
        }
      } else {
        markReadApi(conversationId);
      }
    }
  };

  // File picker handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Max 5 images total
    const remaining = 5 - selectedFiles.length;
    const newFiles = files.slice(0, remaining);

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if ((!text && selectedFiles.length === 0) || !conversationId || isSending) return;

    const filesToSend = [...selectedFiles];
    const messageText = text;

    // Optimistic UI: clear inputs immediately
    setInputMessage('');
    setSelectedFiles([]);
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    setPreviewUrls([]);

    try {
      const result = await sendMessageApi({
        conversationId,
        message: messageText || undefined,
        attachments: filesToSend.length > 0 ? filesToSend : undefined,
      }).unwrap();
      if (result?.data) {
        setMessages((prev) => {
          if (prev.some((m) => Number(m.id) === Number(result.data.id))) return prev;
          return [...prev, result.data];
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Open photo viewer
  const openViewer = (images: string[], startIndex: number) => {
    setViewerImages(images);
    setViewerIndex(startIndex);
    setViewerOpen(true);
  };

  const unreadCount = conversation?.unread_count || 0;
  const canSend = (inputMessage.trim() || selectedFiles.length > 0) && !isSending && !isStarting;

  if (!mounted || pathname === '/chat') return null;

  return (
    <>
      {/* Photo Viewer */}
      {viewerOpen && (
        <PhotoViewer
          images={viewerImages}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* FLOATING ACTION BUTTON (Desktop Only) */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="hidden sm:flex fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 items-center justify-center group"
          aria-label="Live Chat Support"
        >
          <MessageSquare className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium text-sm ml-0 group-hover:ml-2">
            Live Support
          </span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-4 right-4 w-72 h-14 bg-emerald-700 text-white rounded-xl shadow-xl flex items-center justify-between px-4 cursor-pointer'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[380px] h-[100dvh] sm:h-[560px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100'
          }`}
        >
          {/* MINIMIZED */}
          {isMinimized ? (
            <div className="flex items-center justify-between w-full" onClick={() => setIsMinimized(false)}>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold text-sm">Ekhanei Support</span>
                {unreadCount > 0 && <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>}
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1 hover:bg-emerald-800 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-emerald-400/60 shadow-xs overflow-hidden shrink-0">
                    <img
                      src="/chat-logo.jpeg"
                      alt="Ekhanei Support Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                      <span>Ekhanei Support</span>
                      <svg className="w-4 h-4 inline-block shrink-0" viewBox="0 0 24 24" fill="none" aria-label="Verified Badge">
                        <path d="M22.5 12c0-1.58-.8-2.97-2-3.79.44-1.54.15-3.23-.87-4.25-1.02-1.02-2.71-1.31-4.25-.87-.82-1.2-2.21-2-3.79-2s-2.97.8-3.79 2c-1.54-.44-3.23-.15-4.25.87-1.02 1.02-1.31 2.71-.87 4.25-1.2.82-2 2.21-2 3.79s.8 2.97 2 3.79c-.44 1.54-.15 3.23.87 4.25 1.02 1.02 2.71 1.31 4.25.87.82 1.2 2.21 2 3.79 2s2.97-.8 3.79-2c1.54.44 3.23.15 4.25-.87-1.02-1.02-1.31-2.71.87-4.25 1.2-.82 2-2.21 2-3.79z" fill="#1D9BF0" />
                        <path d="M10.5 16.2L6.3 12l1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z" fill="#FFFFFF" />
                      </svg>
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-200">
                      <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' || conversationId ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{connectionStatus === 'connected' || conversationId ? 'Online' : 'Connecting...'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-emerald-600/50 rounded-lg text-emerald-100 transition-colors" title="Minimize">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-emerald-600/50 rounded-lg text-emerald-100 transition-colors" title="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MESSAGES BODY / LOGIN REQUIRED */}
              {!isAuthenticated ? (
                <ChatLoginRequired />
              ) : (
                <>
                  {/* MESSAGES BODY */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {isConvLoading || (conversationId && isMessagesLoading && messages.length === 0) ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        <span className="text-xs">Loading messages...</span>
                      </div>
                    ) : isStarting ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        <span className="text-xs">Starting conversation...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4 text-slate-500">
                        <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="font-medium text-sm text-slate-700">Need Help?</p>
                        <p className="text-xs text-slate-500 mt-1">Send a message or photo below to start chatting with our support team.</p>
                      </div>
                    ) : (
                      messages.map((msg: any, idx: number) => {
                        // System messages
                        if (msg.message_type === 'system') {
                          return (
                            <div key={msg.id || idx} className="text-center my-2">
                              <span className="text-[11px] bg-slate-200 text-slate-600 px-3 py-1 rounded-full inline-block">
                                {msg.message}
                              </span>
                            </div>
                          );
                        }

                        const isCustomer = msg.sender_type === 'customer';
                        const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                        const attachments: string[] = msg.attachments || [];
                        const hasImages = attachments.length > 0;
                        const hasText = !!msg.message;

                        return (
                          <div key={msg.id || idx} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] ${hasImages && !hasText ? '' : 'rounded-2xl px-3.5 py-2 shadow-sm'} ${
                              isCustomer
                                ? hasImages && !hasText ? '' : 'bg-emerald-600 text-white rounded-br-none'
                                : hasImages && !hasText ? '' : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                            }`}>

                              {/* Image grid */}
                              {hasImages && (
                                <div className={`grid gap-1.5 mb-1 ${attachments.length === 1 ? 'grid-cols-1' : attachments.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                  {attachments.map((url, imgIdx) => (
                                    <button
                                      key={imgIdx}
                                      onClick={() => openViewer(attachments, imgIdx)}
                                      className="relative overflow-hidden rounded-xl group focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                      style={{ aspectRatio: attachments.length === 1 ? '4/3' : '1/1' }}
                                    >
                                      <img
                                        src={url}
                                        alt={`Photo ${imgIdx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                                      </div>
                                      {/* More overlay for 4th+ image */}
                                      {imgIdx === 2 && attachments.length > 3 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                                          <span className="text-white text-xl font-bold">+{attachments.length - 3}</span>
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Text (caption) */}
                              {hasText && (
                                <p className="whitespace-pre-wrap break-words leading-relaxed text-sm">
                                  {msg.message}
                                </p>
                              )}

                              {/* Timestamp & read receipt */}
                              <div className={`flex items-center justify-end space-x-1 text-[10px] mt-1 ${
                                isCustomer ? 'text-emerald-200' : 'text-slate-400'
                              }`}>
                                <span>{time}</span>
                                {isCustomer && (
                                  msg.read_at
                                    ? <CheckCheck className="w-3 h-3 text-emerald-200" />
                                    : <Check className="w-3 h-3 text-emerald-300" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* TYPING INDICATOR */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-none px-3.5 py-2 text-xs text-slate-500 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                          <span className="ml-1 text-slate-400">Support is typing...</span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* COMPOSER FOOTER */}
                  <div className="bg-white border-t border-slate-100 shrink-0">
                    {conversation?.status === 'closed' ? (
                      <div className="text-center p-3">
                        <p className="text-xs text-slate-500 mb-2">This conversation has been closed.</p>
                        <button
                          onClick={async () => { await startConversation().unwrap(); refetchConv(); }}
                          className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Start New Conversation</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage}>
                        {/* Image previews */}
                        {previewUrls.length > 0 && (
                          <div className="flex gap-2 px-3 pt-3 flex-wrap">
                            {previewUrls.map((url, i) => (
                              <div key={i} className="relative group">
                                <img
                                  src={url}
                                  alt=""
                                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 cursor-pointer"
                                  onClick={() => openViewer(previewUrls, i)}
                                />
                                <button
                                  type="button"
                                  onClick={() => removePreview(i)}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            {selectedFiles.length < 5 && (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                              >
                                <ImagePlus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Input row */}
                        <div className="flex items-center gap-2 p-3">
                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />

                          {/* Image picker button */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={selectedFiles.length >= 5}
                            className="shrink-0 p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            title={selectedFiles.length >= 5 ? 'Max 5 images' : 'Add photos'}
                          >
                            <ImagePlus className="w-5 h-5" />
                          </button>

                          <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={selectedFiles.length > 0 ? 'Add a caption... (optional)' : 'Type your message...'}
                            className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            disabled={isSending || isStarting}
                          />

                          <button
                            type="submit"
                            disabled={!canSend}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                          >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
