'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { policiesData, Policy } from '@/data/policiesData';
import { 
  Shield, 
  FileText, 
  RefreshCw, 
  Truck, 
  XCircle, 
  CreditCard, 
  Store, 
  User, 
  Cookie, 
  Users, 
  Slash, 
  Lock, 
  Copyright, 
  AlertTriangle, 
  Info, 
  Mail, 
  MessageSquare, 
  UserX, 
  Database, 
  Scale, 
  ShieldAlert,
  Repeat,
  Search,
  ChevronRight,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  ArrowLeft
} from 'lucide-react';

// Icon map for policy icons
const iconMap: Record<string, React.ElementType> = {
  'shield': Shield,
  'file-text': FileText,
  'refresh-cw': RefreshCw,
  'truck': Truck,
  'x-circle': XCircle,
  'credit-card': CreditCard,
  'store': Store,
  'user': User,
  'cookie': Cookie,
  'users': Users,
  'slash': Slash,
  'lock': Lock,
  'copyright': Copyright,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'mail': Mail,
  'message-square': MessageSquare,
  'user-x': UserX,
  'database': Database,
  'scale': Scale,
  'shield-alert': ShieldAlert,
  'repeat': Repeat,
};

export const PolicyPageContent: React.FC<{ policy: Policy }> = ({ policy }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const IconComponent = iconMap[policy.icon] || FileText;

  // Filter sections by search term if user types in search
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return policy.sections;
    const term = searchTerm.toLowerCase();
    return policy.sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(term) ||
        sec.content.some((c) => c.toLowerCase().includes(term))
    );
  }, [policy.sections, searchTerm]);

  return (
    <div className="w-full bg-slate-50/50 min-h-screen pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-10 px-4 sm:px-6 shadow-md border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Policies</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400 font-semibold">{policy.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <IconComponent className="w-6.5 h-6.5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{policy.title}</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">EKHANEI Legal & Operating Framework • Last Updated 2026</p>
              </div>
            </div>

            {/* Quick Search inside Policy */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search policy topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 transition shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Directory (Sidebar) */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Mobile Back Link */}
            <div className="lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Store
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sticky top-20">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">EKHANEI Policies</h3>
              </div>

              {/* Mobile Horizontal Scrollable Pills */}
              <div className="flex lg:hidden overflow-x-auto gap-2 no-scrollbar pb-2">
                {policiesData
                  .filter((p) => [
                    'return-refund-policy',
                    'exchange-policy',
                    'shipping-delivery-policy',
                    'cancellation-policy',
                    'privacy-policy',
                    'terms-conditions'
                  ].includes(p.id))
                  .map((p) => {
                    const isActive = p.id === policy.id;
                    const PIcon = iconMap[p.icon] || FileText;
                    return (
                      <Link
                        key={p.id}
                        href={`/${p.id}`}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <PIcon className="w-3.5 h-3.5" />
                        <span>{p.title}</span>
                      </Link>
                    );
                  })}
              </div>

              {/* Desktop Vertical Menu */}
              <nav className="hidden lg:flex flex-col gap-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 no-scrollbar">
                {policiesData
                  .filter((p) => [
                    'return-refund-policy',
                    'exchange-policy',
                    'shipping-delivery-policy',
                    'cancellation-policy',
                    'privacy-policy',
                    'terms-conditions'
                  ].includes(p.id))
                  .map((p) => {
                    const isActive = p.id === policy.id;
                    const PIcon = iconMap[p.icon] || FileText;
                    return (
                      <Link
                        key={p.id}
                        href={`/${p.id}`}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <PIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className="truncate">{p.title}</span>
                        </div>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />}
                      </Link>
                    );
                  })}
              </nav>
            </div>
          </aside>

          {/* Right Policy Document View */}
          <main className="lg:col-span-9 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-8 space-y-8">
              
              {/* Intro Callout Box */}
              {policy.intro && policy.intro.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span>Policy Overview</span>
                  </div>
                  {policy.intro.map((text, idx) => (
                    <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {text}
                    </p>
                  ))}
                </div>
              )}

              {/* Policy Sections */}
              {filteredSections.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No sections found matching "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
                  >
                    Clear Search Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-8 divide-y divide-slate-100">
                  {filteredSections.map((sec, idx) => (
                    <div key={sec.index || idx} className={`${idx !== 0 ? 'pt-8' : ''} space-y-4`}>
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-extrabold text-xs flex-shrink-0 mt-0.5">
                          {sec.index}
                        </span>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                          {sec.title}
                        </h2>
                      </div>

                      <div className="space-y-2.5 pl-0 sm:pl-10">
                        {sec.content.map((paragraph, pIdx) => {
                          const isBullet = paragraph.trim().startsWith('•');
                          if (isBullet) {
                            return (
                              <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                                <span>{paragraph.replace(/^•\s*/, '')}</span>
                              </div>
                            );
                          }
                          return (
                            <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Customer Support Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-700">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 font-bold text-sm">
                  <HelpCircle className="w-5 h-5" />
                  <span>Have questions regarding this policy?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Our dedicated legal & customer care support team is here to clarify any questions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center">
                <a
                  href="mailto:ekhanei.support@gmail.com"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-sm"
                >
                  <Mail className="w-4 h-4" /> Email Support
                </a>
                <a
                  href="https://wa.me/8801312204962"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-extrabold px-4 py-2.5 rounded-xl transition"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" /> +8801312204962
                </a>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};
