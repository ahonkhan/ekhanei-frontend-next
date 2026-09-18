'use client';

import React from 'react';
import { MessageSquare, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useGetSiteSettingsQuery } from '@/store/services/apiService';

interface ChatLoginRequiredProps {
  onLoginClick?: () => void;
  className?: string;
}

export function ChatLoginRequired({ onLoginClick, className = '' }: ChatLoginRequiredProps) {
  const cartContext = useCart();
  const openAuthModal = cartContext?.openAuthModal;
  const { data: siteSettings } = useGetSiteSettingsQuery();

  const rawWhatsapp = siteSettings?.whatsapp_number || '01907104920';
  const whatsappUrl = rawWhatsapp.startsWith('http')
    ? rawWhatsapp
    : `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else if (openAuthModal) {
      openAuthModal('/chat');
    } else {
      window.location.href = '/profile';
    }
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 bg-[#fff2f5] text-center h-full min-h-[380px] w-full ${className}`}>
      {/* Icon Circle */}
      <div className="w-20 h-20 rounded-full bg-[#fde2ea] flex items-center justify-center mb-5 shadow-xs shrink-0">
        <div className="relative text-[#e6006e]">
          <MessageSquare className="w-10 h-10 fill-[#e6006e]/10 stroke-[#e6006e] stroke-[2]" />
          <div className="absolute -bottom-1 -right-1 bg-[#e6006e] text-white p-1 rounded-full shadow-xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
        Login Required
      </h3>

      {/* Description */}
      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-6 font-medium">
        You must be logged in to access live chat and communicate with our support team.
      </p>

      {/* Login Button */}
      <button
        type="button"
        onClick={handleLogin}
        className="w-full max-w-xs py-3 px-4 bg-[#e6006e] hover:bg-[#c90060] active:scale-[0.98] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md shadow-pink-500/20 transition-all flex items-center justify-center cursor-pointer"
      >
        Login to Account
      </button>

      {/* Divider */}
      <div className="flex items-center justify-center w-full max-w-xs my-5">
        <div className="flex-1 h-[1px] bg-[#f7b7cb]"></div>
        <span className="px-3 text-[11px] font-extrabold text-[#e6006e] tracking-wider">OR</span>
        <div className="flex-1 h-[1px] bg-[#f7b7cb]"></div>
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-xs py-2.5 px-4 bg-[#e8faf0] border border-[#25d366]/60 hover:bg-[#d2f6df] active:scale-[0.98] text-[#075e54] font-extrabold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs"
      >
        <svg className="w-5 h-5 text-[#25d366] fill-current shrink-0" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span>Chat via WhatsApp</span>
      </a>
    </div>
  );
}
