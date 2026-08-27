'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, X } from 'lucide-react';
import { PRODUCTS } from '@/data/mockData';
import { Product } from '@/types';

interface SearchInputProps {
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search products...',
  containerClassName = '',
  inputClassName = '',
  buttonClassName = '',
  iconClassName = '',
  buttonText = 'Search',
  autoFocus = false,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching products in real-time
  const matchingProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return PRODUCTS.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(trimmed);
      const catMatch = p.categoryName.toLowerCase().includes(trimmed);
      const storeMatch = p.storeName ? p.storeName.toLowerCase().includes(trimmed) : false;
      return nameMatch || catMatch || storeMatch;
    }).slice(0, 6);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${productId}`);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full z-[9999] overflow-visible ${containerClassName}`}>
      <form onSubmit={handleSubmit} className="w-full relative flex items-center">
        <div className="flex items-center bg-white rounded-full pr-1 py-1 shadow-md w-full h-8 md:h-10.5 transition-all">
          <Search className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ml-3 sm:ml-4 shrink-0 ${iconClassName}`} />
          
          <div className="grid gap-2 flex-1 min-w-0">
            <input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              autoFocus={autoFocus}
              className={`flex-1 text-gray-700 focus:outline-none w-full text-[13px] md:text-[16px] placeholder:text-left bg-transparent border-none px-2 ${inputClassName}`}
            />
          </div>

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className={`inline-flex items-center justify-center gap-2 shrink-0 font-medium shadow-xs cursor-pointer outline-none hover:scale-105 transition-transform duration-200 px-4 py-2 bg-[#d81b60] hover:bg-[#c2185b] rounded-full text-white h-full text-[10px] md:text-[16px] ${buttonClassName}`}
          >
            {buttonText}
          </button>
        </div>
      </form>

      {/* REAL-TIME MATCHING PRODUCTS DROPDOWN */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200/90 z-[9999] overflow-hidden divide-y divide-slate-100 max-h-[420px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {matchingProducts.length > 0 ? (
            <>
              <div className="px-3 py-1.5 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Matching Products
              </div>
              <div className="divide-y divide-slate-100">
                {matchingProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-pink-50/60 transition cursor-pointer group"
                  >
                    {/* Product Thumbnail Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-11 h-11 sm:w-12 sm:h-12 object-cover object-center rounded-lg bg-slate-100 shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
                    />

                    {/* Product Name & Price */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-[#d81b60] transition-colors truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#d81b60]">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ৳{product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Search Results Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-slate-50 hover:bg-pink-100/50 text-[#d81b60] text-xs font-bold text-center cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <span>See all results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
