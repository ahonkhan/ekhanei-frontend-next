'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MessageSquare, Send, Loader2, Check, CheckCheck, RefreshCw, AlertCircle } from 'lucide-react';
import Pusher from 'pusher-js';
import {
  useGetChatConversationQuery,
  useStartChatConversationMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
} from '@/store/services/apiService';
import { useAppSelector } from '@/store/hooks';

export default function CustomerChatPage() {
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

  const { data: messagesResponse } = useGetChatMessagesQuery(
    { conversationId: conversationId! },
    { skip: !isAuthenticated || !conversationId }
  );

  useEffect(() => {
    if (messagesResponse?.data) {
      setMessages(messagesResponse.data);
    }
  }, [messagesResponse]);

  useEffect(() => {
    if (!isAuthenticated || !conversationId) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';
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

    channel.bind('MessageSent', (data: any) => {
      if (data.conversation_id === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => Number(m.id) === Number(data.id))) return prev;
          return [...prev, data];
        });
      }
    });

    channel.bind('client-typing', (data: any) => {
      if (data.sender_type === 'admin') {
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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden min-h-[500px] max-h-[750px]">
          {/* HEADER */}
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-base border border-emerald-500">
                CS
              </div>
              <div>
                <h1 className="font-semibold text-base">Ekhanei Customer Support</h1>
                <p className="text-xs text-emerald-200">Real-time Live Chat Assistant</p>
              </div>
            </div>
            {!conversationId && isAuthenticated && (
              <button
                onClick={() => startConversation()}
                disabled={isStarting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
              >
                {isStarting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Start Chat</span>}
              </button>
            )}
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                <AlertCircle className="w-12 h-12 text-amber-500 mb-2" />
                <h3 className="font-semibold text-slate-800 text-base">Authentication Required</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">Please log in to your account to access real-time live support with our customer care team.</p>
              </div>
            ) : isStarting ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
                <span className="text-xs">Connecting to support team...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
                <h3 className="font-semibold text-slate-800 text-base">Welcome to Ekhanei Support</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">Have any questions regarding orders, delivery, or products? Send us a message below!</p>
              </div>
            ) : (
              messages.map((msg: any, idx: number) => {
                if (msg.message_type === 'system') {
                  return (
                    <div key={msg.id || idx} className="text-center my-2">
                      <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full inline-block">
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
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
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
                          msg.read_at ? <CheckCheck className="w-3.5 h-3.5 text-emerald-200" /> : <Check className="w-3.5 h-3.5 text-emerald-300" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs text-slate-500 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-slate-400">Support is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* COMPOSER */}
          {isAuthenticated && (
            <div className="p-3.5 bg-white border-t border-slate-100">
              {conversation?.status === 'closed' ? (
                <div className="text-center py-2">
                  <p className="text-xs text-slate-500 mb-2">This conversation has been closed by support.</p>
                  <button
                    onClick={async () => {
                      await startConversation().unwrap();
                      refetchConv();
                    }}
                    className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Start New Support Chat</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Write a message to support..."
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    disabled={isSending || isStarting}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isSending || isStarting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl transition-colors font-medium text-sm flex items-center space-x-1.5"
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
