'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PinkProductCard } from '@/components/category/PinkProductCard';
import { Product } from '@/types';
import { SlidersHorizontal, ChevronDown, ArrowUpDown, Filter, X, Check } from 'lucide-react';

// Sample 20 Search Products matching Ekhaneilayout
const MOCK_SEARCH_PRODUCTS: Product[] = [
  {
    id: 'search-1',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://d62ipmwrm4ymk.cloudfront.net/medium/product/20251009/walkaroo-blue-strap-sandals-for-mens_1_cbe3.jpg',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.8,
    reviewsCount: 42,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-2',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.9,
    reviewsCount: 28,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-3',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.7,
    reviewsCount: 19,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-4',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.9,
    reviewsCount: 51,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-5',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.8,
    reviewsCount: 33,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-6',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.6,
    reviewsCount: 22,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-7',
    name: 'Manmode Printed Drop Shoulder Shirt',
    price: 1390,
    oldPrice: 1749,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.7,
    reviewsCount: 16,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-8',
    name: 'Manmode Regular Fit Zipper Polo',
    price: 1190,
    oldPrice: 1449,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.8,
    reviewsCount: 64,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-9',
    name: 'Manmode Regular Fit Zipper Polo',
    price: 1190,
    oldPrice: 1449,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.9,
    reviewsCount: 45,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-10',
    name: 'Manmode Regular Fit Zipper Polo',
    price: 1190,
    oldPrice: 1449,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.7,
    reviewsCount: 37,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-11',
    name: 'Manmode Loose Fit Stripe T-Shirt',
    price: 890,
    oldPrice: 1049,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.8,
    reviewsCount: 88,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-12',
    name: 'Manmode Regular Fit Zipper Polo',
    price: 1190,
    oldPrice: 1449,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.6,
    reviewsCount: 29,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-13',
    name: 'Manmode Loose Fit Stripe T-Shirt',
    price: 890,
    oldPrice: 1049,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.9,
    reviewsCount: 72,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-14',
    name: 'Manmode Loose Fit Stripe T-Shirt',
    price: 890,
    oldPrice: 1049,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.7,
    reviewsCount: 39,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-15',
    name: 'Manmode Loose Fit Stripe T-Shirt',
    price: 890,
    oldPrice: 1049,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.8,
    reviewsCount: 41,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-16',
    name: 'Manmode Loose Fit Stripe T-Shirt',
    price: 890,
    oldPrice: 1049,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.8,
    reviewsCount: 35,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-17',
    name: 'Stealth Mode Faux Leather Cap',
    price: 780,
    oldPrice: 1450,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.9,
    reviewsCount: 112,
    storeName: 'Manmode Store',
    unit: '1 pc'
  },
  {
    id: 'search-18',
    name: 'Dior Sauvage Eau De Parfum',
    price: 2600,
    oldPrice: 3500,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 5.0,
    reviewsCount: 230,
    storeName: 'Manmode Store',
    unit: '100 ml'
  },
  {
    id: 'search-19',
    name: 'Creed Aventus EDP for Men',
    price: 5100,
    oldPrice: 17000,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 5.0,
    reviewsCount: 195,
    storeName: 'Manmode Store',
    unit: '100 ml'
  },
  {
    id: 'search-20',
    name: 'Bleu De Chanel Eau De Parfum',
    price: 2600,
    oldPrice: 3500,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
    categoryId: 'fashion',
    categoryName: 'Fashion',
    rating: 4.9,
    reviewsCount: 178,
    storeName: 'Manmode Store',
    unit: '100 ml'
  }
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'manmode';

  // Mobile Drawers State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const categoriesList = [
    { id: 'caps', label: 'Men Caps & Hats' },
    { id: 'casual-shirts', label: 'Men Casual Shirts' },
    { id: 'polo', label: 'Men Polo Shirt' },
    { id: 'tshirts', label: 'Men T-Shirts & Tanks' },
    { id: 'perfume', label: 'Perfume' },
  ];

  const sizesList = ['6', '7', '8', '9', '10', '11-12', '12', '13-14', '14', '14-15'];

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange(20000);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = MOCK_SEARCH_PRODUCTS.filter((p) => p.price <= priceRange);

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#fbf9fa] text-[#191919]">
      <main className="max-w-[1680px] mx-auto px-2 sm:px-6 py-2 sm:py-4">
        {/* Mobile Fixed/Sticky Sort & Filter Bar (Shown only on Mobile < md) */}
        <div className="md:hidden sticky top-[50px] z-30 bg-white border-y border-slate-200 grid grid-cols-2 text-center text-xs font-semibold text-slate-800 shadow-xs mb-3">
          <button
            type="button"
            onClick={() => setIsSortDrawerOpen(true)}
            className="py-3 flex items-center justify-center gap-1.5 border-r border-slate-200 active:bg-slate-50 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-700" />
            <span>Sort by</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="py-3 flex items-center justify-center gap-1.5 active:bg-slate-50 cursor-pointer"
          >
            <span>Filters</span>
            <Filter className="w-3.5 h-3.5 text-slate-700" />
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="text-xs text-slate-500 mb-4 px-1 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-[#d81b60]">
            Category
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate">
            Search Results for "{query}"
          </span>
        </div>

        {/* Main Content Layout (Left Filter Sidebar + Right Product Grid) */}
        <div className="flex flex-col md:flex-row gap-5 items-start">

          {/* DESKTOP LEFT SIDEBAR FILTERS (Hidden on Mobile) */}
          <aside className="hidden md:block w-[260px] bg-white rounded-md p-4 shadow-sm border border-slate-100 shrink-0">
            {/* Header: Filters + Clear Filters */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#d81b60] hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>

            {/* Filter Section 1: Category */}
            <div className="mb-6">
              <h4 className="font-bold text-xs text-slate-900 mb-3">Category</h4>
              <div className="space-y-2 text-xs text-slate-700">
                {categoriesList.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-3.5 h-3.5 accent-[#d81b60] rounded border-slate-300 cursor-pointer"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Section 2: Brand */}
            <div className="mb-6 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 mb-3">Brand</h4>
              <div className="space-y-2 text-xs text-slate-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-[#d81b60] rounded border-slate-300 cursor-pointer"
                  />
                  <span>Manmode</span>
                </label>
              </div>
            </div>

            {/* Filter Section 3: Price Range (0 - 20000) */}
            <div className="mb-6 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 mb-3">
                Price (0 - 20000)
              </h4>
              <div className="px-1 space-y-2">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#d81b60] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>৳0</span>
                  <span>-</span>
                  <span>৳{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Filter Section 4: Size */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 mb-3">Size</h4>
              <div className="space-y-2 text-xs text-slate-700 max-h-48 overflow-y-auto pr-1">
                {sizesList.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="w-3.5 h-3.5 accent-[#d81b60] rounded border-slate-300 cursor-pointer"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="mt-3 text-xs font-semibold text-[#d81b60] underline cursor-pointer"
              >
                See More
              </button>
            </div>
          </aside>

          {/* RIGHT PRODUCT GRID AREA */}
          <div className="flex-1 w-full">
            {/* Desktop Top Bar: Title & Results count + Sort By Dropdown */}
            <div className="hidden md:flex flex-row items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-base font-bold text-slate-900 capitalize">
                  {query}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {filteredProducts.length} results
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:border-[#d81b60]"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Header Results Count Title */}
            <div className="md:hidden px-1 mb-2">
              <span className="text-sm font-bold text-slate-900 capitalize">{query}</span>
              <span className="text-xs text-slate-500 font-medium ml-2">({filteredProducts.length} results)</span>
            </div>

            {/* Product Grid (Responsive: 2 columns on mobile, 5 columns on desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {filteredProducts.map((prod) => (
                <PinkProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* MOBILE SORT BOTTOM DRAWER MODAL (With 300ms Smooth Slide Up Animation) */}
      <div
        className={`fixed inset-0 z-50 md:hidden flex items-end justify-center transition-opacity duration-300 ease-in-out ${isSortDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsSortDrawerOpen(false)}
        />
        <div
          className={`relative z-10 w-full bg-white rounded-t-2xl p-5 shadow-2xl space-y-4 max-h-[70vh] overflow-y-auto transition-transform duration-300 ease-in-out transform ${isSortDrawerOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Sort By</h3>
            <button
              type="button"
              onClick={() => setIsSortDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 py-1">
            {[
              { id: 'recommended', label: 'Recommended' },
              { id: 'price-low', label: 'Price: Low to High' },
              { id: 'price-high', label: 'Price: High to Low' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSortBy(option.id);
                  setIsSortDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-xs font-semibold transition cursor-pointer ${sortBy === option.id
                    ? 'bg-pink-50 text-[#d81b60]'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <span>{option.label}</span>
                {sortBy === option.id && <Check className="w-4 h-4 text-[#d81b60]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE RIGHT SLIDE-OVER FILTER DRAWER (With 300ms Smooth Slide-In Right Animation) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${isFilterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Dark Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsFilterDrawerOpen(false)}
        />

        {/* Right Drawer Panel */}
        <div
          className={`absolute inset-y-0 right-0 w-[300px] sm:w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              <span>Filters</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#d81b60] hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Filter Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Category */}
            <div>
              <h4 className="font-bold text-xs text-slate-900 mb-3">Category</h4>
              <div className="space-y-2.5 text-xs text-slate-700">
                {categoriesList.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 accent-[#d81b60] rounded border-slate-300 cursor-pointer"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 mb-3">Brand</h4>
              <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#d81b60] rounded border-slate-300 cursor-pointer"
                />
                <span>Manmode</span>
              </label>
            </div>

            {/* Price Range */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 mb-3">
                Price (0 - 20000)
              </h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#d81b60] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>৳0</span>
                  <span>-</span>
                  <span>৳{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="border-t border-slate-100 pt-4 pb-4">
              <h4 className="font-bold text-xs text-slate-900 mb-3">Size</h4>
              <div className="space-y-2 text-xs text-slate-700 max-h-52 overflow-y-auto pr-1">
                {sizesList.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-3 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="w-4 h-4 accent-[#d81b60] rounded border-slate-300 cursor-pointer"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="mt-3 text-xs font-semibold text-[#d81b60] underline cursor-pointer"
              >
                See More
              </button>
            </div>
          </div>

          {/* Footer Action Button */}
          <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-3 bg-[#d81b60] hover:bg-[#c2185b] text-white font-bold text-sm rounded-lg shadow-md cursor-pointer transition"
            >
              Apply Filters ({filteredProducts.length} results)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fbf9fa] p-8 text-center text-slate-500">Loading search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
