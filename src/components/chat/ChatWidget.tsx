'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minus, Loader2, Check, CheckCheck, RefreshCw } from 'lucide-react';
import Pusher from 'pusher-js';
import {
  useGetChatConversationQuery,
  useStartChatConversationMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatReadMutation,
} from '@/store/services/apiService';
import { useAppSelector } from '@/store/hooks';

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Read Customer Auth Token
  const token = useAppSelector((state) => state.auth?.token) || (mounted && typeof window !== 'undefined' ? localStorage.getItem('shym_token') : null);
  const isAuthenticated = !!token;

  // RTK Query Hooks
  const { data: convResponse, refetch: refetchConv } = useGetChatConversationQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [startConversation, { isLoading: isStarting }] = useStartChatConversationMutation();
  const [sendMessageApi, { isLoading: isSending }] = useSendChatMessageMutation();
  const [markReadApi] = useMarkChatReadMutation();

  const conversation = convResponse?.data;
  const conversationId = conversation?.id;

  const { data: messagesResponse, refetch: refetchMessages } = useGetChatMessagesQuery(
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

    const interval = setInterval(() => {
      refetchMessages();
    }, 3000);

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

    // Listen to MessageSent variations
    channel.bind('MessageSent', handleNewMessage);
    channel.bind('.MessageSent', handleNewMessage);
    channel.bind('App\\Events\\MessageSent', handleNewMessage);

    // Global event fallback
    channel.bind_global((eventName: string, data: any) => {
      if (eventName.includes('MessageSent') || (data && data.id && data.message)) {
        handleNewMessage(data);
      }
    });

    // Listen to typing
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
    if (!isAuthenticated) {
      alert('Please log in to chat with customer support.');
      return;
    }

    setIsOpen(true);
    setIsMinimized(false);

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
  };

  // Send Message Handler
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

  const unreadCount = conversation?.unread_count || 0;

  if (!mounted) return null;

  return (
    <>
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

      {/* CHAT WINDOW MODAL / DRAWER */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-4 right-4 w-72 h-14 bg-emerald-700 text-white rounded-xl shadow-xl flex items-center justify-between px-4 cursor-pointer'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[380px] h-[100dvh] sm:h-[550px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100'
          }`}
        >
          {/* MINIMIZED HEADER */}
          {isMinimized ? (
            <div className="flex items-center justify-between w-full" onClick={() => setIsMinimized(false)}>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold text-sm">Customer Support</span>
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
              {/* CHAT HEADER */}
              <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-500">
                    CS
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">Customer Support</h3>
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-200">
                      <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' || conversationId ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{connectionStatus === 'connected' || conversationId ? 'Online Support' : 'Connecting...'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 hover:bg-emerald-600/50 rounded-lg text-emerald-100 transition-colors"
                    title="Minimize"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-emerald-600/50 rounded-lg text-emerald-100 transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MESSAGES BODY */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {isStarting ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    <span className="text-xs">Starting conversation...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 text-slate-500">
                    <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="font-medium text-sm text-slate-700">Need Help?</p>
                    <p className="text-xs text-slate-500 mt-1">Send a message below to start chatting with our support team in real time.</p>
                  </div>
                ) : (
                  messages.map((msg: any, idx: number) => {
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

                    return (
                      <div key={msg.id || idx} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                            isCustomer
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                          <div
                            className={`flex items-center justify-end space-x-1 text-[10px] mt-1 ${
                              isCustomer ? 'text-emerald-200' : 'text-slate-400'
                            }`}
                          >
                            <span>{time}</span>
                            {isCustomer && (
                              msg.read_at ? <CheckCheck className="w-3 h-3 text-emerald-200" /> : <Check className="w-3 h-3 text-emerald-300" />
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
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                {conversation?.status === 'closed' ? (
                  <div className="text-center py-2">
                    <p className="text-xs text-slate-500 mb-2">This conversation has been closed.</p>
                    <button
                      onClick={async () => {
                        await startConversation().unwrap();
                        refetchConv();
                      }}
                      className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Start New Conversation</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      disabled={isSending || isStarting}
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isSending || isStarting}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
