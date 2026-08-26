/**
 * Category Details Page Engine
 * Handles rendering of Hero Image Slider, Today's Special Offers (আজকের বিশেষ অফার),
 * Top Brands, Popular Products, Category Stores, and Infinite Scroll All Products.
 */

class CategoryPageEngine {
  constructor() {
    this.cart = new CartManager();
    this.interactions = new MarketplaceInteractions(this.cart);
    
    // URL Query Parameter Parsing
    const urlParams = new URLSearchParams(window.location.search);
    this.categoryKey = urlParams.get('type') || 'fresh-fish';
    
    this.currentSubCategory = 'all';
    this.displayedProductsCount = 12;
    this.productsPerBatch = 6;
    this.isLoadingMore = false;
    this.heroSlideIndex = 0;

    this.init();
  }

  init() {
    this.categoryMeta = CATEGORY_DETAILS_DATA[this.categoryKey] || CATEGORY_DETAILS_DATA['fresh-fish'];
    this.catInfo = CATEGORIES.find(c => c.id === this.categoryKey) || CATEGORIES[0];

    this.renderHeaderTitle();
    this.renderHeroSlider();
    this.renderSubCategories();
    this.renderSpecialOffers();
    this.renderTopBrands();
    this.renderPopularProducts();
    this.renderCategoryStores();
    this.renderAllProducts();
    this.initInfiniteScroll();

    // Subscribe to cart updates
    this.cart.subscribe(() => {
      this.updateAllProductCardButtons();
    });
  }

  // =============================================
  // 1. PAGE HEADER TITLE
  // =============================================
  renderHeaderTitle() {
    const titleEl = document.getElementById('category-page-title');
    const subtitleEl = document.getElementById('category-page-subtitle');
    
    if (titleEl) {
      titleEl.textContent = this.catInfo ? this.catInfo.name : 'Category Details';
    }
    if (subtitleEl) {
      subtitleEl.textContent = `Explore 20-min delivery deals for ${this.catInfo ? this.catInfo.name : 'items'} in Rangpur`;
    }
    document.title = `${this.catInfo ? this.catInfo.name : 'Category'} — ShymMarket Express`;
  }

  // =============================================
  // 2. HERO SLIDER (IMAGES ONLY - NO OVERLAY TEXT)
  // =============================================
  renderHeroSlider() {
    const container = document.getElementById('category-hero-slider');
    if (!container) return;

    const slides = this.categoryMeta.heroSlides || [this.catInfo.image];
    
    container.innerHTML = `
      <div class="w-full h-full relative overflow-hidden group">
        ${slides.map((imgUrl, index) => `
          <div class="cat-slide-item absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}">
            <img src="${imgUrl}" alt="${this.catInfo.name} Banner" class="w-full h-full object-cover">
          </div>
        `).join('')}

        <!-- Dots Indicator -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          ${slides.map((_, idx) => `
            <button data-cat-slide-dot="${idx}" class="cat-dot-btn w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'w-6 bg-emerald-400' : 'bg-white/60 hover:bg-white'}"></button>
          `).join('')}
        </div>
      </div>
    `;

    // Setup auto slide
    if (slides.length > 1) {
      if (this.sliderInterval) clearInterval(this.sliderInterval);
      this.sliderInterval = setInterval(() => {
        this.nextSlide(slides.length);
      }, 3500);
    }
  }

  nextSlide(totalSlides) {
    this.heroSlideIndex = (this.heroSlideIndex + 1) % totalSlides;
    this.updateSlideState(totalSlides);
  }

  updateSlideState(totalSlides) {
    const container = document.getElementById('category-hero-slider');
    if (!container) return;

    const items = container.querySelectorAll('.cat-slide-item');
    const dots = container.querySelectorAll('.cat-dot-btn');

    items.forEach((item, index) => {
      if (index === this.heroSlideIndex) {
        item.classList.remove('opacity-0', 'z-0');
        item.classList.add('opacity-100', 'z-10');
      } else {
        item.classList.remove('opacity-100', 'z-10');
        item.classList.add('opacity-0', 'z-0');
      }
    });

    dots.forEach((dot, index) => {
      if (index === this.heroSlideIndex) {
        dot.className = 'cat-dot-btn w-6 h-2 rounded-full bg-emerald-400 transition-all duration-300';
      } else {
        dot.className = 'cat-dot-btn w-2 h-2 rounded-full bg-white/60 hover:bg-white transition-all duration-300';
      }
    });
  }

  // =============================================
  // 3. SUB-CATEGORIES RAIL
  // =============================================
  renderSubCategories() {
    const container = document.getElementById('category-subcategories-rail');
    if (!container) return;

    const subCats = this.categoryMeta.subCategories || [{ id: 'all', name: 'All Items' }];

    container.innerHTML = subCats.map(sub => `
      <button data-sub-id="${sub.id}" class="sub-cat-pill flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shadow-xs select-none touch-active ${sub.id === this.currentSubCategory ? 'bg-slate-900 text-white border border-slate-900 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'}">
        ${sub.name}
      </button>
    `).join('');

    container.querySelectorAll('.sub-cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentSubCategory = btn.getAttribute('data-sub-id');
        this.renderSubCategories();
        this.renderAllProducts(true);
      });
    });
  }

  // =============================================
  // 4. আজকের বিশেষ অফার (TODAY'S SPECIAL OFFERS)
  // =============================================
  renderSpecialOffers() {
    const container = document.getElementById('category-special-offers-grid');
    if (!container) return;

    const offers = this.categoryMeta.specialOffers || [
      {
        id: "off-def",
        title: "আজকের বিশেষ অফার",
        subtitle: "সেরা মূল্যে তাজা পন্যের হোম ডেলিভারি",
        image: this.catInfo.image
      }
    ];

    container.innerHTML = offers.map(off => `
      <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200/80 aspect-[21/9] sm:aspect-[24/8] group cursor-pointer touch-active">
        <img src="${off.image}" alt="${off.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-transparent p-4 sm:p-6 flex flex-col justify-center text-white">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-1.5 h-4 bg-orange-500 rounded-full"></span>
            <span class="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest">Special Deal</span>
          </div>
          <h4 class="font-extrabold text-base sm:text-xl text-white tracking-tight leading-snug drop-shadow-sm">${off.title}</h4>
          <p class="text-xs sm:text-sm text-slate-200 font-medium mt-1">${off.subtitle}</p>
        </div>
      </div>
    `).join('');
  }

  // =============================================
  // 5. TOP BRANDS
  // =============================================
  renderTopBrands() {
    const container = document.getElementById('category-brands-rail');
    if (!container) return;

    const brands = this.categoryMeta.brands || [
      { id: "b-1", name: "Premium Partner", logo: this.catInfo.image }
    ];

    container.innerHTML = brands.map(brand => `
      <div class="snap-item flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/40 cursor-pointer transition group touch-active select-none">
        <img src="${brand.logo}" alt="${brand.name}" class="w-8 h-8 rounded-xl object-cover border border-slate-100 flex-shrink-0 group-hover:scale-105 transition">
        <span class="font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition whitespace-nowrap">${brand.name}</span>
      </div>
    `).join('');
  }

  // =============================================
  // 6. POPULAR PRODUCTS (SLIDER - PINK GRADIENT CARD)
  // =============================================
  renderPopularProducts() {
    const container = document.getElementById('category-popular-products-rail');
    if (!container) return;

    let products = PRODUCTS.filter(p => p.categoryId === this.categoryKey);
    if (products.length === 0) products = PRODUCTS;

    container.innerHTML = products.map(product => this.renderPinkProductCardMarkup(product, true)).join('');
    this.bindCardButtonEvents(container);
  }

  // =============================================
  // 7. POPULAR STORES
  // =============================================
  renderCategoryStores() {
    const container = document.getElementById('category-stores-grid');
    if (!container) return;

    let stores = STORES.filter(s => s.category.toLowerCase().includes(this.catInfo.name.toLowerCase()));
    if (stores.length === 0) stores = STORES.slice(0, 4);

    container.innerHTML = stores.map(store => `
      <div class="snap-item rounded-2xl bg-white border border-slate-200/80 shadow-sm card-hover overflow-hidden flex flex-col cursor-pointer">
        <div class="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
          <img src="${store.coverImage}" alt="${store.name}" class="w-full h-full object-cover" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/10"></div>
          
          <span class="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md">
            ${store.offer}
          </span>
          <span class="absolute bottom-2.5 right-2.5 bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10">
            ${store.deliveryTime}
          </span>
        </div>

        <div class="p-3 space-y-2 bg-white flex-1 flex flex-col justify-between">
          <div class="flex items-start gap-2.5">
            <img src="${store.logoImage}" alt="${store.name}" class="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0">
            <div class="min-w-0 flex-1">
              <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1 min-w-0">
                <span class="truncate">${store.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" class="inline-block select-none shrink-0" style="vertical-align: middle;"><path fill="#1877F2" d="M12 2.6 C13.2 2.6 13.8 3.6 14.7 4 C15.8 4.4 17.1 4 18 4.9 C18.9 5.8 18.5 7.1 18.9 8.2 C20.8 12 20.8 14.3 19.7 15 18.9 15.8 C18.5 16.9 18.9 18.2 18 19.1 C17.1 20 15.8 19.6 14.7 20 C13.8 20.4 13.2 21.4 12 21.4 C10.8 21.4 10.2 20.4 9.3 20 C8.2 19.6 6.9 20 6 19.1 C5.1 18.2 5.5 16.9 5.1 15.8 C4.3 15 3.2 14.3 3.2 12 C3.2 9.7 4.3 9 5.1 8.2 C5.5 7.1 5.1 5.8 6 4.9 C6.9 4 8.2 4.4 9.3 4 C10.2 3.6 10.8 2.6 12 2.6Z"></path><path d="M9.3 12.2L11.2 14.1L15.2 9.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </h4>
              <p class="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">${store.category}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // =============================================
  // 8. ALL PRODUCTS (LOAD ON SCROLL / INFINITE SCROLL)
  // =============================================
  renderAllProducts(reset = false) {
    const container = document.getElementById('category-all-products-grid');
    const countEl = document.getElementById('all-products-count');
    if (!container) return;

    if (reset) {
      this.displayedProductsCount = 12;
    }

    let allItems = PRODUCTS.filter(p => p.categoryId === this.categoryKey);
    if (allItems.length === 0) allItems = PRODUCTS;

    const visibleItems = allItems.slice(0, this.displayedProductsCount);

    if (countEl) {
      countEl.textContent = `Showing ${visibleItems.length} of ${allItems.length} items`;
    }

    container.innerHTML = visibleItems.map(product => this.renderPinkProductCardMarkup(product, false)).join('');
    this.bindCardButtonEvents(container);
  }

  initInfiniteScroll() {
    window.addEventListener('scroll', () => {
      if (this.isLoadingMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 600;

      if (scrollPosition >= threshold) {
        let allItems = PRODUCTS.filter(p => p.categoryId === this.categoryKey);
        if (allItems.length === 0) allItems = PRODUCTS;

        if (this.displayedProductsCount < allItems.length) {
          this.isLoadingMore = true;
          const spinner = document.getElementById('scroll-loading-indicator');
          if (spinner) spinner.classList.remove('hidden');

          setTimeout(() => {
            this.displayedProductsCount += this.productsPerBatch;
            this.renderAllProducts(false);
            this.isLoadingMore = false;
            if (spinner) spinner.classList.add('hidden');
          }, 400);
        }
      }
    });
  }

  // =============================================
  // 9. PINK PASTEL GRADIENT PRODUCT CARD RENDERER
  // (Matches Image 2 Reference: "Shop Under", Price in Magenta ৳999, Title Below)
  // =============================================
  renderPinkProductCardMarkup(product, isSlider = false) {
    const widthClass = isSlider ? 'snap-item flex-shrink-0 w-[145px] sm:w-[170px]' : 'w-full';
    
    return `
      <div data-product-id="${product.id}" class="${widthClass} rounded-2xl bg-gradient-to-b from-white via-rose-50/20 to-pink-50/40 border border-rose-100/70 p-2.5 sm:p-3 overflow-hidden shadow-xs hover:shadow-md hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group touch-active select-none">
        <div>
          <!-- Product Image Box -->
          <div class="relative w-full aspect-square rounded-xl bg-gradient-to-b from-slate-50 to-rose-50/50 p-2 overflow-hidden mb-2.5 flex items-center justify-center">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy">
            ${product.discountBadge ? `
              <span class="absolute top-1.5 left-1.5 bg-pink-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                ${product.discountBadge}
              </span>
            ` : ''}
          </div>

          <!-- Content (Shop Under, Price, Title) -->
          <div class="space-y-0.5 text-left">
            <span class="block text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Shop Under
            </span>
            <div class="font-extrabold text-sm sm:text-base text-pink-600 tracking-tight leading-none">
              ৳${product.price}
            </div>
            <h4 class="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-pink-600 transition leading-snug line-clamp-1 mt-1">
              ${product.name}
            </h4>
          </div>
        </div>

        <!-- Add Button -->
        <div class="pt-2 mt-2 border-t border-rose-100/60">
          ${this.renderCartButtonMarkup(product)}
        </div>
      </div>
    `;
  }

  renderCartButtonMarkup(product) {
    const itemInCart = this.cart.getItem(product.id);

    if (itemInCart) {
      return `
        <div class="cart-control-btn-group flex items-center justify-between bg-pink-600 text-white rounded-xl p-1 shadow-sm">
          <button data-action="decrement" data-id="${product.id}" class="w-6 h-6 rounded-lg bg-pink-700 hover:bg-pink-800 flex items-center justify-center text-xs font-extrabold transition">
            <i class="fa-solid fa-minus text-[9px]"></i>
          </button>
          <span class="font-extrabold text-xs px-2">${itemInCart.quantity}</span>
          <button data-action="increment" data-id="${product.id}" class="w-6 h-6 rounded-lg bg-pink-700 hover:bg-pink-800 flex items-center justify-center text-xs font-extrabold transition">
            <i class="fa-solid fa-plus text-[9px]"></i>
          </button>
        </div>
      `;
    }

    return `
      <button data-action="add-to-cart" data-id="${product.id}" class="w-full bg-slate-900 hover:bg-pink-600 text-white font-bold text-xs py-1.5 sm:py-2 px-3 rounded-xl transition-all duration-300 shadow-xs flex items-center justify-center gap-1.5 touch-active">
        <i class="fa-solid fa-cart-plus text-[11px]"></i>
        <span>Add</span>
      </button>
    `;
  }

  bindCardButtonEvents(container) {
    container.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const product = PRODUCTS.find(p => p.id === id);
        if (product) {
          this.cart.addItem(product);
        }
      });
    });

    container.querySelectorAll('[data-action="increment"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.cart.increment(id);
      });
    });

    container.querySelectorAll('[data-action="decrement"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.cart.decrement(id);
      });
    });
  }

  updateAllProductCardButtons() {
    ['category-popular-products-rail', 'category-all-products-grid'].forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.querySelectorAll('[data-product-id]').forEach(card => {
          const id = card.getAttribute('data-product-id');
          const product = PRODUCTS.find(p => p.id === id);
          if (product) {
            const btnBox = card.querySelector('.border-t');
            if (btnBox) {
              btnBox.innerHTML = this.renderCartButtonMarkup(product);
            }
          }
        });
        this.bindCardButtonEvents(container);
      }
    });
  }
}

// Initialize Category Page Engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.categoryApp = new CategoryPageEngine();
});
