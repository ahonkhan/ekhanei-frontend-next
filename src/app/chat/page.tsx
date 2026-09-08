'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Check, 
  CheckCheck, 
  RefreshCw, 
  AlertCircle,
  ArrowLeft,
  Phone,
  Paperclip,
  Smile,
  ShieldCheck
} from 'lucide-react';
import Pusher from 'pusher-js';
import {
  useGetChatConversationQuery,
  useStartChatConversationMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
} from '@/store/services/apiService';
import { useAppSelector } from '@/store/hooks';

export default function CustomerChatPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const token = useAppSelector((state) => state.auth?.token) || (mounted && typeof window !== 'undefined' ? localStorage.getItem('shym_token') : null);
  const isAuthenticated = !!token;

  const { data: convResponse, refetch: refetchConv } = useGetChatConversationQuery(undefined, { skip: !isAuthenticated });
  const [startConversation, { isLoading: isStarting }] = useStartChatConversationMutation();
  const [sendMessageApi, { isLoading: isSending }] = useSendChatMessageMutation();

  const conversation = convResponse?.data;
  const conversationId = conversation?.id;

  const { data: messagesResponse, refetch: refetchMessages } = useGetChatMessagesQuery(
    { conversationId: conversationId! },
    { skip: !isAuthenticated || !conversationId }
  );

  useEffect(() => {
    if (messagesResponse?.data) {
      setMessages(messagesResponse.data);
    }
  }, [messagesResponse]);

  // Auto-poll messages every 3s as fallback for instant sync
  useEffect(() => {
    if (!isAuthenticated || !conversationId) return;

    const interval = setInterval(() => {
      refetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated, conversationId, refetchMessages]);

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

    const channel = pusher.subscribe(`private-chat.${conversationId}`);

    const handleNewMessage = (data: any) => {
      if (data && (Number(data.conversation_id) === Number(conversationId) || !data.conversation_id)) {
        setMessages((prev) => {
          if (prev.some((m) => Number(m.id) === Number(data.id))) return prev;
          return [...prev, data];
        });
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
  }, [isAuthenticated, conversationId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text || !conversationId || isSending) return;

    setInputMessage('');

    try {
      const result = await sendMessageApi({ conversationId, message: text }).unwrap();
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

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 h-[100dvh] sm:h-auto sm:static sm:inset-auto w-full sm:py-6 sm:px-4 bg-[#f0f2f5] sm:bg-slate-100 flex flex-col items-center justify-center z-[9999]">
      
      {/* WHATSAPP CONTAINER (Full-screen on Mobile, Card Dialog on Desktop) */}
      <div className="w-full h-full sm:h-[650px] sm:max-w-4xl bg-[#f0f2f5] sm:bg-[#efeae2] sm:rounded-3xl sm:shadow-2xl sm:border sm:border-slate-200 flex flex-col overflow-hidden">
        
        {/* WHATSAPP TOP HEADER */}
        <div className="bg-[#075e54] text-white px-3 py-3 sm:px-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Back Button */}
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/');
                }
              }}
              className="p-1.5 hover:bg-emerald-800 rounded-full transition text-white"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Support Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-emerald-400/60 shadow-xs overflow-hidden shrink-0">
                <img
                  src="/chat-logo.jpeg"
                  alt="Ekhanei Support Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <span className="w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full absolute bottom-0 right-0" />
            </div>

            {/* Title & Online Status */}
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-tight flex items-center gap-1.5">
                <span>Ekhanei Support</span>
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 inline-block shrink-0" viewBox="0 0 24 24" fill="none" aria-label="Verified Badge">
                  <path
                    d="M22.5 12c0-1.58-.8-2.97-2-3.79.44-1.54.15-3.23-.87-4.25-1.02-1.02-2.71-1.31-4.25-.87-.82-1.2-2.21-2-3.79-2s-2.97.8-3.79 2c-1.54-.44-3.23-.15-4.25.87-1.02 1.02-1.31 2.71-.87 4.25-1.2.82-2 2.21-2 3.79s.8 2.97 2 3.79c-.44 1.54-.15 3.23.87 4.25 1.02 1.02 2.71 1.31 4.25.87.82 1.2 2.21 2 3.79 2s2.97-.8 3.79-2c1.54.44 3.23.15 4.25-.87-1.02-1.02-1.31-2.71.87-4.25 1.2-.82 2-2.21 2-3.79z"
                    fill="#1D9BF0"
                  />
                  <path
                    d="M10.5 16.2L6.3 12l1.4-1.4 2.8 2.8 7.2-7.2 1.4 1.4-8.6 8.6z"
                    fill="#FFFFFF"
                  />
                </svg>
              </h1>
              <p className="text-[11px] text-emerald-100 font-medium">Online</p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2">
            <a
              href="tel:01907104920"
              className="p-2 hover:bg-emerald-800 rounded-full transition text-emerald-100"
              title="Call Customer Support"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {!conversationId && isAuthenticated && (
              <button
                onClick={() => startConversation()}
                disabled={isStarting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 shadow-xs"
              >
                {isStarting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Start Chat</span>}
              </button>
            )}
          </div>
        </div>

        {/* CHAT MESSAGES CANVAS (WhatsApp Beige/Sand Background) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 bg-[#efeae2] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-400/40 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {/* Encryption / Security Banner */}
          <div className="flex justify-center my-2">
            <span className="text-[11px] bg-[#ffeebd] text-[#544214] font-medium px-3 py-1.5 rounded-xl shadow-xs text-center max-w-xs border border-[#f0dfaa]/60">
              🔒 End-to-end support messaging with Ekhanei Care Team.
            </span>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-600 bg-white/80 rounded-3xl border border-slate-200/60 my-auto shadow-xs">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-2" />
              <h3 className="font-bold text-slate-800 text-base">Authentication Required</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Please log in to your account to access real-time live support with our customer care team.</p>
              <Link href="/profile" className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">
                Log In / Register
              </Link>
            </div>
          ) : isStarting ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-700 mb-2" />
              <span className="text-xs font-semibold">Connecting to support team...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-600 bg-white/80 rounded-3xl border border-slate-200/60 my-auto shadow-xs">
              <MessageSquare className="w-12 h-12 text-emerald-600 mb-2" />
              <h3 className="font-black text-slate-800 text-base">Welcome to Ekhanei Support</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">Have questions regarding your order, delivery time, or products? Send us a message below!</p>
            </div>
          ) : (
            messages.map((msg: any, idx: number) => {
              if (msg.message_type === 'system') {
                return (
                  <div key={msg.id || idx} className="text-center my-2">
                    <span className="text-[11px] bg-slate-200/90 text-slate-700 font-bold px-3 py-1 rounded-full inline-block shadow-xs">
                      {msg.message}
                    </span>
                  </div>
                );
              }

              const isCustomer = msg.sender_type === 'customer';
              const time = msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

              return (
                <div key={msg.id || idx} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm shadow-xs leading-relaxed ${
                      isCustomer
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none border border-[#c4f0bd]'
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/80'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <div
                      className={`flex items-center justify-end space-x-1 text-[10px] font-semibold mt-1 ${
                        isCustomer ? 'text-emerald-800' : 'text-slate-400'
                      }`}
                    >
                      <span>{time}</span>
                      {isCustomer && (
                        msg.read_at ? <CheckCheck className="w-3.5 h-3.5 text-emerald-700" /> : <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs text-slate-500 shadow-xs flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-slate-500 font-medium">Support is typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WHATSAPP BOTTOM COMPOSER */}
        {isAuthenticated && (
          <div className="p-2.5 sm:p-3 bg-[#f0f2f5] border-t border-slate-200/80 shrink-0">
            {conversation?.status === 'closed' ? (
              <div className="text-center py-2">
                <p className="text-xs text-slate-500 mb-2 font-medium">This conversation has been closed by support.</p>
                <button
                  onClick={async () => {
                    await startConversation().unwrap();
                    refetchConv();
                  }}
                  className="text-xs bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition inline-flex items-center space-x-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start New Support Chat</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-4 py-2 sm:py-2.5 border border-slate-200 flex items-center gap-2 shadow-inner">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none"
                    disabled={isSending || isStarting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending || isStarting}
                  className="w-10 h-10 rounded-full bg-[#075e54] hover:bg-[#064e46] disabled:bg-slate-300 text-white flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0"
                  title="Send Message"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
