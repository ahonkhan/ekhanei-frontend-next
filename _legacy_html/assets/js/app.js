/**
 * Core Application Engine (Vanilla JS)
 * Premium marketplace renderer with scroll reveal, redesigned cards, and polished UI.
 */

class MarketplaceApp {
  constructor() {
    this.cart = new CartManager();
    this.interactions = new MarketplaceInteractions(this.cart);
    this.heroSlider = new HeroSlider('hero-slider-container', HERO_SLIDES);
    this.activePopularTab = 'all';

    this.init();
  }

  init() {
    window.appInstance = this;
    this.renderCategories();
    this.renderPopularStores();

    // Subscribe to cart changes
    this.cart.subscribe(() => {
      this.updateAllProductCardButtons();
    });

    // Scroll reveal animation
    this.initScrollReveal();
  }

  // =============================================
  // SCROLL REVEAL ANIMATION (DISABLED)
  // =============================================
  initScrollReveal() {
    // Disabled fade animation as requested
  }

  // =============================================
  // 1. SERVICE CATEGORIES — Image Top, Text Underneath
  // =============================================
  renderCategories() {
    const container = document.getElementById('categories-rail');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
      <div data-category="${cat.id}" class="service-category-item snap-item flex-shrink-0 w-[110px] sm:w-[132px] md:w-[145px] group cursor-pointer touch-active flex flex-col items-center text-center select-none">
        
        <!-- Image Box Container (1:1 Square Ratio) -->
        <div class="category-img-box w-full aspect-square rounded-2xl sm:rounded-3xl bg-gradient-to-b from-sky-50 via-sky-100/40 to-blue-100/60 border border-sky-100/90 p-2 sm:p-2.5 overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-emerald-400/60 transition-all duration-300 flex items-center justify-center relative">
          <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-300" loading="lazy">
        </div>

        <!-- Category Text Below Image -->
        <h4 class="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-600 transition leading-snug mt-2 line-clamp-2 px-1">
          ${cat.name}
        </h4>
      </div>
    `).join('');

    container.querySelectorAll('.service-category-item').forEach(card => {
      card.addEventListener('click', () => {
        const catId = card.getAttribute('data-category');
        if (catId) {
          window.location.href = `category.html?type=${catId}`;
        }
      });
    });
  }

  // =============================================
  // 2. QUICK ACTIONS — Compact Horizontal Tags
  // =============================================
  renderQuickActions() {
    const container = document.getElementById('quick-actions-rail');
    if (!container) return;

    container.innerHTML = QUICK_ACTIONS.map(action => `
      <div class="snap-item flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm card-lift cursor-pointer group touch-active">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition">
          <i class="fa-solid ${action.icon}"></i>
        </div>
        <div>
          <h4 class="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition">${action.label}</h4>
          <p class="text-[10px] text-slate-400 font-medium">${action.badge}</p>
        </div>
      </div>
    `).join('');
  }

  // =============================================
  // 3. POPULAR ITEMS + FILTER TABS
  // =============================================
  renderPopularSection() {
    this.renderCategoryFilterTabs();
    this.renderPopularProducts('all');
  }

  renderCategoryFilterTabs() {
    const container = document.getElementById('category-filter-tabs');
    if (!container) return;

    const tabs = [
      { id: 'all', label: 'All Items', icon: 'fa-fire' },
      ...CATEGORIES.map(c => ({ id: c.id, label: c.name, icon: c.icon }))
    ];

    container.innerHTML = tabs.map(tab => `
      <button data-tab="${tab.id}" class="filter-tab-btn snap-item flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap ${tab.id === this.activePopularTab ? 'bg-slate-900 text-white shadow-md' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-100'}">
        <i class="fa-solid ${tab.icon} text-[10px] ${tab.id === this.activePopularTab ? 'text-emerald-400' : 'text-slate-400'}"></i>
        ${tab.label}
      </button>
    `).join('');

    container.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        this.activePopularTab = tabId;

        container.querySelectorAll('.filter-tab-btn').forEach(b => {
          b.className = 'filter-tab-btn snap-item flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap bg-white hover:bg-slate-100 text-slate-600 border border-slate-100';
          const icon = b.querySelector('i');
          if (icon) icon.className = icon.className.replace('text-emerald-400', 'text-slate-400');
        });
        btn.className = 'filter-tab-btn snap-item flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap bg-slate-900 text-white shadow-md';
        const activeIcon = btn.querySelector('i');
        if (activeIcon) {
          activeIcon.className = activeIcon.className.replace('text-slate-400', 'text-emerald-400');
        }

        // Highlight matching category card
        const catContainer = document.getElementById('categories-rail');
        if (catContainer) {
          catContainer.querySelectorAll('.service-category-card').forEach(c => {
            if (c.getAttribute('data-category') === tabId) {
              c.classList.add('ring-2', 'ring-emerald-500', 'border-emerald-500', 'bg-emerald-50/40');
            } else {
              c.classList.remove('ring-2', 'ring-emerald-500', 'border-emerald-500', 'bg-emerald-50/40');
            }
          });
        }

        this.renderPopularProducts(tabId);
      });
    });
  }

  renderPopularProducts(category = 'all') {
    const container = document.getElementById('popular-products-grid');
    if (!container) return;

    let filtered = PRODUCTS;
    if (category !== 'all') {
      filtered = PRODUCTS.filter(p => p.category === category);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400 space-y-3">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
            <i class="fa-solid fa-box-open text-2xl"></i>
          </div>
          <p class="text-sm font-semibold text-slate-500">No items found in this category.</p>
          <p class="text-xs text-slate-400">Try exploring other categories above.</p>
        </div>
      `;
      return;
    }

    this.renderProductCards(container, filtered);
  }

  // =============================================
  // 4. FLASH DEALS
  // =============================================
  renderFlashDeals() {
    const container = document.getElementById('flash-deals-rail');
    if (!container) return;

    const flashProducts = PRODUCTS.filter(p => p.isFlashDeal);

    container.innerHTML = flashProducts.map(product => `
      <div class="snap-item w-60 sm:w-72 rounded-2xl bg-white/95 backdrop-blur border border-amber-200/60 p-3 shadow-sm card-lift group relative flex flex-col justify-between">
        <div class="space-y-2.5">
          <div class="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover product-img-zoom" loading="lazy">
            <span class="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-600 gradient-animate text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <i class="fa-solid fa-bolt text-[9px]"></i> ${product.discount}
            </span>
            <button data-fav-id="${product.id}" class="fav-btn absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white backdrop-blur text-slate-400 hover:text-rose-500 flex items-center justify-center shadow transition">
              <i class="fa-regular fa-heart text-xs"></i>
            </button>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">${product.storeName}</span>
            <h4 class="font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">${product.name}</h4>
            <div class="flex items-center gap-1.5 text-xs text-amber-500 mt-1">
              <i class="fa-solid fa-star text-[10px]"></i>
              <span class="font-bold text-slate-800">${product.rating}</span>
              <span class="text-slate-400 text-[10px]">(${product.reviewsCount})</span>
            </div>
          </div>
        </div>

        <div class="pt-2.5 border-t border-slate-100 mt-2.5 space-y-2">
          <!-- Stock Bar -->
          <div class="space-y-1">
            <div class="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Sold: ${product.flashStock || 70}%</span>
              <span class="text-amber-600">Limited</span>
            </div>
            <div class="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden flash-stock-bar">
              <div class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style="width: ${product.flashStock || 70}%"></div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <span class="font-extrabold text-sm text-slate-900">৳${product.price}</span>
              <span class="text-[11px] text-slate-400 line-through ml-1">৳${product.oldPrice}</span>
            </div>
            ${this.renderCartButtonMarkup(product)}
          </div>
        </div>
      </div>
    `).join('');

    this.bindCardButtonEvents(container);
  }

  // =============================================
  // 5. POPULAR STORES — Redesigned Cards
  // =============================================
  renderPopularStores() {
    const container = document.getElementById('popular-stores-rail');
    if (!container) return;

    container.innerHTML = STORES.filter(s => s.isPopular).map(store => `
      <div class="snap-item w-[280px] sm:w-auto rounded-2xl bg-white border border-slate-200/80 shadow-sm card-hover store-card-hover overflow-hidden flex flex-col cursor-pointer">
        <!-- Cover -->
        <div class="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
          <img src="${store.coverImage}" alt="${store.name}" class="store-cover-img w-full h-full object-cover" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/10"></div>
          
          <span class="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
            <i class="fa-solid fa-tag text-[9px]"></i>
            ${store.offer}
          </span>

          <button data-fav-id="${store.id}" class="fav-btn absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-950/40 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition shadow">
            <i class="fa-regular fa-heart text-xs"></i>
          </button>

          <span class="absolute bottom-2.5 right-2.5 bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
            <i class="fa-regular fa-clock text-amber-400 text-[10px]"></i>
            ${store.deliveryTime}
          </span>
        </div>

        <!-- Info -->
        <div class="p-3 sm:p-3.5 space-y-2 bg-white flex-1 flex flex-col justify-between">
          <div class="flex items-start gap-2.5">
            <img src="${store.logoImage}" alt="${store.name}" class="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0">
            <div class="min-w-0 flex-1">
              <h4 class="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1 min-w-0">
                <span class="truncate">${store.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" class="inline-block select-none shrink-0" style="vertical-align: middle;"><path fill="#1877F2" d="M12 2.6 C13.2 2.6 13.8 3.6 14.7 4 C15.8 4.4 17.1 4 18 4.9 C18.9 5.8 18.5 7.1 18.9 8.2 C19.7 9 20.8 9.7 20.8 12 C20.8 14.3 19.7 15 18.9 15.8 C18.5 16.9 18.9 18.2 18 19.1 C17.1 20 15.8 19.6 14.7 20 C13.8 20.4 13.2 21.4 12 21.4 C10.8 21.4 10.2 20.4 9.3 20 C8.2 19.6 6.9 20 6 19.1 C5.1 18.2 5.5 16.9 5.1 15.8 C4.3 15 3.2 14.3 3.2 12 C3.2 9.7 4.3 9 5.1 8.2 C5.5 7.1 5.1 5.8 6 4.9 C6.9 4 8.2 4.4 9.3 4 C10.2 3.6 10.8 2.6 12 2.6Z"></path><path d="M9.3 12.2L11.2 14.1L15.2 9.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </h4>
              <p class="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">${store.category} • ${store.tags ? store.tags.join(', ') : ''}</p>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div class="flex items-center gap-1 text-amber-500 font-bold">
              <i class="fa-solid fa-star text-[11px]"></i>
              <span class="text-slate-900">${store.rating}</span>
              <span class="text-slate-400 font-normal text-[10px]">(${store.reviewsCount})</span>
            </div>
            <div class="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
              <i class="fa-solid fa-location-arrow text-emerald-600 text-[10px]"></i>
              <span>${store.distance}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // =============================================
  // 6. RECOMMENDED PRODUCTS
  // =============================================
  renderRecommendedProducts() {
    const container = document.getElementById('recommended-products-grid');
    if (!container) return;

    const recommended = PRODUCTS.filter(p => p.isRecommended);
    this.renderProductCards(container, recommended);
  }

  // =============================================
  // 7. BEST SELLERS
  // =============================================
  renderBestSellers() {
    const container = document.getElementById('best-sellers-grid');
    if (!container) return;

    const bestSellers = PRODUCTS.filter(p => p.isBestSeller);
    this.renderProductCards(container, bestSellers);
  }

  // =============================================
  // 8. NEW STORES
  // =============================================
  renderNewStores() {
    const container = document.getElementById('new-stores-rail');
    if (!container) return;

    const newStores = STORES.filter(s => s.isNew);
    container.innerHTML = newStores.map(store => `
      <div class="snap-item w-72 rounded-2xl bg-white border border-purple-100/80 shadow-sm card-lift overflow-hidden space-y-0 cursor-pointer group">
        <div class="relative h-32 overflow-hidden">
          <img src="${store.coverImage}" alt="${store.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
          <span class="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
            <i class="fa-solid fa-sparkles text-[9px] mr-1"></i>New
          </span>
        </div>
        <div class="p-3 flex items-center gap-3">
          <img src="${store.logoImage}" alt="${store.name}" class="w-10 h-10 rounded-xl object-cover border border-slate-100">
          <div>
            <h4 class="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition flex items-center gap-1">
              <span>${store.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" class="inline-block select-none shrink-0" style="vertical-align: middle;"><path fill="#1877F2" d="M12 2.6 C13.2 2.6 13.8 3.6 14.7 4 C15.8 4.4 17.1 4 18 4.9 C18.9 5.8 18.5 7.1 18.9 8.2 C19.7 9 20.8 9.7 20.8 12 C20.8 14.3 19.7 15 18.9 15.8 C18.5 16.9 18.9 18.2 18 19.1 C17.1 20 15.8 19.6 14.7 20 C13.8 20.4 13.2 21.4 12 21.4 C10.8 21.4 10.2 20.4 9.3 20 C8.2 19.6 6.9 20 6 19.1 C5.1 18.2 5.5 16.9 5.1 15.8 C4.3 15 3.2 14.3 3.2 12 C3.2 9.7 4.3 9 5.1 8.2 C5.5 7.1 5.1 5.8 6 4.9 C6.9 4 8.2 4.4 9.3 4 C10.2 3.6 10.8 2.6 12 2.6Z"></path><path d="M9.3 12.2L11.2 14.1L15.2 9.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </h4>
            <p class="text-[10px] text-slate-500">${store.category} • ${store.deliveryTime}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // =============================================
  // REUSABLE PRODUCT CARD RENDERER — Premium Design
  // =============================================
  renderProductCards(container, products) {
    container.innerHTML = products.map(product => `
      <div class="product-card-item rounded-2xl bg-white border border-slate-100 shadow-sm card-hover group flex flex-col justify-between relative overflow-hidden">
        <div>
          <!-- Image + Badges -->
          <div class="relative overflow-hidden aspect-[4/3] bg-slate-100">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover product-img-zoom" loading="lazy">
            
            ${product.discount ? `
              <span class="absolute top-2 left-2 bg-slate-900/85 backdrop-blur text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow">
                ${product.discount}
              </span>
            ` : ''}

            ${product.badge ? `
              <span class="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                ${product.badge}
              </span>
            ` : ''}

            <button data-fav-id="${product.id}" class="fav-btn absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white backdrop-blur text-slate-400 hover:text-rose-500 flex items-center justify-center shadow transition">
              <i class="fa-regular fa-heart text-xs"></i>
            </button>
          </div>

          <!-- Product Details -->
          <div class="p-3 sm:p-3.5 space-y-1.5">
            <div class="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-medium">
              <span class="truncate max-w-[110px]">${product.storeName}</span>
              <div class="flex items-center gap-1 text-amber-500">
                <i class="fa-solid fa-star text-[10px]"></i>
                <span class="font-bold text-slate-800">${product.rating}</span>
              </div>
            </div>

            <h4 class="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition">${product.name}</h4>
            <span class="text-[10px] text-slate-400">${product.unit}</span>
          </div>
        </div>

        <!-- Pricing & Cart Button -->
        <div class="px-3 sm:px-3.5 pb-3 sm:pb-3.5 pt-2 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span class="font-extrabold text-sm sm:text-base text-slate-900">৳${product.price}</span>
            ${product.oldPrice ? `<span class="text-[10px] sm:text-[11px] text-slate-400 line-through ml-1">৳${product.oldPrice}</span>` : ''}
          </div>

          <div class="cart-btn-wrapper" data-product-id="${product.id}">
            ${this.renderCartButtonMarkup(product)}
          </div>
        </div>
      </div>
    `).join('');

    this.bindCardButtonEvents(container);
  }

  // =============================================
  // CART BUTTON MARKUP
  // =============================================
  renderCartButtonMarkup(product) {
    const qty = this.cart.getItemQuantity(product.id);
    if (qty > 0) {
      return `
        <div class="flex items-center border border-emerald-500 bg-emerald-50 rounded-xl overflow-hidden shadow-sm">
          <button data-action="minus" data-id="${product.id}" class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition">
            <i class="fa-solid fa-minus text-[10px]"></i>
          </button>
          <span class="w-6 text-center text-xs font-extrabold text-emerald-800">${qty}</span>
          <button data-action="plus" data-id="${product.id}" class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition">
            <i class="fa-solid fa-plus text-[10px]"></i>
          </button>
        </div>
      `;
    }

    return `
      <button data-action="add" data-id="${product.id}" class="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow touch-active">
        <i class="fa-solid fa-plus text-[9px]"></i>
        <span>Add</span>
      </button>
    `;
  }

  // =============================================
  // CART BUTTON EVENT BINDING
  // =============================================
  bindCardButtonEvents(container) {
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        const productId = btn.getAttribute('data-id');
        const product = PRODUCTS.find(p => p.id === productId);

        if (!product) return;

        if (action === 'add' || action === 'plus') {
          this.cart.addItem(product);
        } else if (action === 'minus') {
          this.cart.removeItem(productId);
        }
      });
    });
  }

  updateAllProductCardButtons() {
    document.querySelectorAll('.cart-btn-wrapper').forEach(wrapper => {
      const productId = wrapper.getAttribute('data-product-id');
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        wrapper.innerHTML = this.renderCartButtonMarkup(product);
        this.bindCardButtonEvents(wrapper);
      }
    });
  }
}

// =============================================
// INSTANTIATE ON DOM LOAD
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  new MarketplaceApp();
});
