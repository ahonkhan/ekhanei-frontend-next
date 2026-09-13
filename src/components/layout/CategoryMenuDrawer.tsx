'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  useGetServiceCategoriesQuery,
  useGetCategoryDetailQuery,
  useGetSiteSettingsQuery,
} from '@/store/services/apiService';
import { getImageUrl } from '@/utils/image';
import {
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones,
  Mail,
  Phone,
  Search,
  ChevronRight,
  Grid,
  Loader2,
} from 'lucide-react';

interface CategoryMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductCategoryAccordionItem: React.FC<{
  serviceSlug: string;
  pCat: any;
  onClose: () => void;
}> = ({ serviceSlug, pCat, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pCatSlug = pCat.slug || pCat.id;
  const pCatUrl = `/${serviceSlug}/${pCatSlug}`;

  const { data: pCatDetail, isLoading } = useGetCategoryDetailQuery(pCatSlug, {
    skip: !isExpanded || Boolean(pCat.subCategories || pCat.sub_categories),
  });

  const subCategories: any[] =
    pCat.subCategories || pCat.sub_categories || pCatDetail?.subCategories || [];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden my-1 shadow-2xs">
      <div className="flex items-center justify-between p-2">
        <Link
          href={pCatUrl}
          onClick={onClose}
          className="flex items-center gap-2.5 flex-1 hover:text-emerald-600 transition min-w-0"
        >
          {pCat.image || pCat.icon ? (
            <img
              src={getImageUrl(pCat.image || pCat.icon)}
              alt={pCat.name}
              className="w-6 h-6 rounded-lg object-cover shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-extrabold text-[10px] flex items-center justify-center shrink-0">
              {pCat.name.slice(0, 2)}
            </div>
          )}
          <span className="font-bold text-xs text-slate-800 truncate">{pCat.name}</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-slate-50/80 p-2 border-t border-slate-100 space-y-1 text-[11px]">
          <Link
            href={pCatUrl}
            onClick={onClose}
            className="flex items-center justify-between text-emerald-600 font-bold py-1 px-2 rounded hover:bg-emerald-50 transition"
          >
            <span>See All Products</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          {isLoading && subCategories.length === 0 ? (
            <div className="py-1 px-2 text-slate-400 flex items-center gap-1.5 font-medium">
              <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
              <span>Loading subcategories...</span>
            </div>
          ) : subCategories.length > 0 ? (
            subCategories.map((sub: any) => {
              const subSlug = sub.slug || sub.id;
              const subUrl = `/${serviceSlug}/${pCatSlug}/${subSlug}`;
              return (
                <Link
                  key={sub.id || subSlug}
                  href={subUrl}
                  onClick={onClose}
                  className="flex items-center justify-between py-1 px-2 rounded text-slate-700 hover:text-emerald-700 hover:bg-white transition font-semibold"
                >
                  <span className="truncate">{sub.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 ml-1" />
                </Link>
              );
            })
          ) : null}
        </div>
      )}
    </div>
  );
};

const ServiceCategoryAccordionItem: React.FC<{
  service: any;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}> = ({ service, isExpanded, onToggle, onClose }) => {
  const serviceSlug = service.slug || service.id;
  const serviceUrl = `/${serviceSlug}`;

  const { data: serviceDetail, isLoading: isDetailLoading } = useGetCategoryDetailQuery(serviceSlug, {
    skip: !isExpanded || Boolean(service.categories && service.categories.length > 0),
  });

  const productCategories: any[] =
    service.categories && service.categories.length > 0
      ? service.categories
      : serviceDetail?.subCategories || [];

  return (
    <div className="rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition overflow-hidden bg-white shadow-2xs">
      <div className="flex items-center justify-between p-2.5">
        <Link
          href={serviceUrl}
          onClick={onClose}
          className="flex items-center gap-3 flex-1 hover:text-emerald-600 transition min-w-0"
        >
          {service.image || service.icon ? (
            <img
              src={getImageUrl(service.image || service.icon)}
              alt={service.name}
              className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center shrink-0">
              {service.name.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
              {service.name}
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              {productCategories.length > 0
                ? `${productCategories.length} product categories`
                : 'Service Category'}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Product Categories */}
      {isExpanded && (
        <div className="bg-slate-50/90 p-2.5 border-t border-slate-100 space-y-1">
          <Link
            href={serviceUrl}
            onClick={onClose}
            className="flex items-center justify-between text-emerald-700 hover:text-emerald-800 font-black text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-100/60 transition"
          >
            <span>See All in {service.name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {isDetailLoading && productCategories.length === 0 ? (
            <div className="py-2 px-3 text-slate-400 text-xs flex items-center gap-2 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Loading product categories...</span>
            </div>
          ) : productCategories.length > 0 ? (
            productCategories.map((pCat: any) => (
              <ProductCategoryAccordionItem
                key={pCat.id || pCat.slug}
                serviceSlug={serviceSlug}
                pCat={pCat}
                onClose={onClose}
              />
            ))
          ) : (
            <div className="py-2 px-3 text-slate-400 text-xs font-medium italic">
              No product categories found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CategoryMenuDrawer: React.FC<CategoryMenuDrawerProps> = ({ isOpen, onClose }) => {
  const { data: serviceCategories = [], isLoading: isServicesLoading } = useGetServiceCategoriesQuery();
  const { data: siteSettings } = useGetSiteSettingsQuery();

  const helplineTitle = siteSettings?.helpline_title || 'Govaly Helpline';
  const helplinePhone = siteSettings?.helpline_phone || '+8801969901212';
  const supportEmail = siteSettings?.support_email || 'support@govaly.com.bd';
  const contactPhone = siteSettings?.contact_phone || '01969901212';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedServiceIds, setExpandedServiceIds] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setExpandedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return serviceCategories;
    const query = searchQuery.toLowerCase();
    return serviceCategories.filter(
      (sc: any) =>
        sc.name.toLowerCase().includes(query) ||
        (sc.slug && sc.slug.toLowerCase().includes(query)) ||
        (sc.categories && sc.categories.some((c: any) => c.name.toLowerCase().includes(query)))
    );
  }, [serviceCategories, searchQuery]);

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Left Drawer / Sidebar Panel */}
      <div
        className={`absolute inset-y-0 left-0 w-[300px] sm:w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Single Full Scrollable Container */}
        <div className="overflow-y-auto h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-md sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <Grid className="w-5 h-5 text-amber-300" />
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">Categories</h2>
                <p className="text-[10px] text-emerald-100 font-medium">Explore all service departments</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service category..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Categories Accordion Section */}
          <div className="flex-1 p-3 space-y-2">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Service Categories ({filteredServices.length})
              </span>
              <Link
                href="/search"
                onClick={onClose}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>See All</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {isServicesLoading ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-semibold">Loading service categories...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service: any) => (
                <ServiceCategoryAccordionItem
                  key={service.id || service.slug}
                  service={service}
                  isExpanded={expandedServiceIds.includes(service.id)}
                  onToggle={() => toggleService(service.id)}
                  onClose={onClose}
                />
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                No categories found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Bottom Contact Cards */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 space-y-2 mt-auto">
            {helplinePhone && (
              <a
                href={`tel:${helplinePhone}`}
                className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                  <Headphones className="w-4 h-4 text-[#E2136E]" />
                  <span>{helplineTitle}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
              </a>
            )}

            {supportEmail && (
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                  <Mail className="w-4 h-4 text-[#E2136E]" />
                  <span className="truncate">{supportEmail}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
              </a>
            )}

            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-emerald-300 transition group"
              >
                <div className="flex items-center gap-2.5 text-slate-800 text-xs font-semibold">
                  <Phone className="w-4 h-4 text-[#E2136E]" />
                  <span>{contactPhone}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
