/**
 * Cart Manager & UI Sync (Vanilla JS)
 * Manages shopping cart state, drawer slide-over, sticky cart bar, badges, and feedback toasts.
 */

class CartManager {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('hypermarket_cart')) || [];
    this.appliedCoupon = null;
    this.discountAmount = 0;
    this.listeners = [];

    this.initUI();
  }

  save() {
    localStorage.setItem('hypermarket_cart', JSON.stringify(this.items));
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getState()));
    this.updateBadgesAndBar();
  }

  addItem(product) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.save();
    this.showToast(`Added "${product.name}" to cart`, 'success');
  }

  removeItem(productId) {
    const existing = this.items.find(item => item.product.id === productId);
    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        this.items = this.items.filter(item => item.product.id !== productId);
      }
      this.save();
    }
  }

  deleteProduct(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.save();
  }

  getItemQuantity(productId) {
    const existing = this.items.find(item => item.product.id === productId);
    return existing ? existing.quantity : 0;
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getDeliveryFee() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 350 ? 0 : 40;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee();
    return Math.max(0, subtotal + delivery - this.discountAmount);
  }

  applyCoupon(code) {
    if (code.toUpperCase() === 'FIRST20') {
      const subtotal = this.getSubtotal();
      this.discountAmount = Math.round(subtotal * 0.20);
      this.appliedCoupon = 'FIRST20 (20% OFF)';
      this.notify();
      this.showToast('Coupon FIRST20 applied! 20% discount added.', 'success');
      return true;
    } else {
      this.showToast('Invalid promo code. Try "FIRST20"', 'error');
      return false;
    }
  }

  getState() {
    return {
      items: this.items,
      totalCount: this.getTotalCount(),
      subtotal: this.getSubtotal(),
      deliveryFee: this.getDeliveryFee(),
      discountAmount: this.discountAmount,
      total: this.getTotal(),
      appliedCoupon: this.appliedCoupon
    };
  }

  initUI() {
    this.updateBadgesAndBar();
    this.renderCartDrawer();
  }

  updateBadgesAndBar() {
    const count = this.getTotalCount();
    const total = this.getTotal();

    // Desktop Cart Count Badges
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = count;
      if (count > 0) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    // Sticky Mobile Cart Bar
    const cartBar = document.getElementById('mobile-sticky-cart-bar');
    if (cartBar) {
      if (count > 0) {
        cartBar.classList.remove('hidden');
        cartBar.querySelector('.cart-bar-items').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
        cartBar.querySelector('.cart-bar-total').textContent = `৳${total}`;
      } else {
        cartBar.classList.add('hidden');
      }
    }

    // Re-render open cart drawer if visible
    this.renderCartDrawerContent();
  }

  renderCartDrawer() {
    let drawer = document.getElementById('cart-drawer-container');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'cart-drawer-container';
      document.body.appendChild(drawer);
    }

    drawer.innerHTML = `
      <!-- Backdrop -->
      <div id="cart-drawer-backdrop" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 backdrop-blur-overlay hidden opacity-0"></div>

      <!-- Slide-over Panel -->
      <aside id="cart-drawer-panel" class="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl cart-drawer closed flex flex-col">
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <h3 class="font-bold text-base">Your Cart</h3>
              <p class="text-xs text-slate-400 font-medium cart-header-subtitle">0 items added</p>
            </div>
          </div>
          <button id="close-cart-drawer" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Cart Content Body -->
        <div id="cart-drawer-items" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <!-- Item list rendered dynamically -->
        </div>

        <!-- Footer / Pricing Summary -->
        <div id="cart-drawer-footer" class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3">
          <!-- Promo Code Input -->
          <div class="flex items-center gap-2">
            <input type="text" id="promo-code-input" placeholder="Promo code (e.g. FIRST20)" class="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 uppercase font-mono">
            <button id="apply-promo-btn" class="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition">Apply</button>
          </div>

          <div class="space-y-1.5 text-xs sm:text-sm text-slate-600 border-t border-slate-200/60 pt-3">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span id="cart-drawer-subtotal" class="font-semibold text-slate-900">৳0</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span id="cart-drawer-delivery" class="font-semibold text-slate-900">৳0</span>
            </div>
            <div id="cart-drawer-discount-row" class="flex justify-between text-emerald-600 hidden">
              <span>Discount (FIRST20)</span>
              <span id="cart-drawer-discount" class="font-semibold">-৳0</span>
            </div>
            <div class="flex justify-between text-sm sm:text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Payable</span>
              <span id="cart-drawer-total" class="text-emerald-600 font-extrabold">৳0</span>
            </div>
          </div>

          <button id="checkout-btn" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition touch-active">
            <span>Proceed to Checkout</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </aside>
    `;

    this.bindDrawerEvents();
  }

  bindDrawerEvents() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const closeBtn = document.getElementById('close-cart-drawer');
    const applyBtn = document.getElementById('apply-promo-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.closeDrawer());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const input = document.getElementById('promo-code-input');
        if (input && input.value.trim()) {
          this.applyCoupon(input.value.trim());
        }
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.getTotalCount() === 0) {
          this.showToast('Your cart is empty. Add items first!', 'error');
          return;
        }
        this.showToast('🎉 Mock Order Placed Successfully!', 'success');
        this.items = [];
        this.discountAmount = 0;
        this.save();
        this.closeDrawer();
      });
    }

    // Open Cart Triggers across app
    document.addEventListener('click', (e) => {
      if (e.target.closest('.open-cart-trigger')) {
        this.openDrawer();
      }
    });
  }

  openDrawer() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const panel = document.getElementById('cart-drawer-panel');

    if (backdrop && panel) {
      backdrop.classList.remove('hidden');
      setTimeout(() => backdrop.classList.add('visible'), 10);
      panel.classList.remove('closed');
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const panel = document.getElementById('cart-drawer-panel');

    if (backdrop && panel) {
      backdrop.classList.remove('visible');
      panel.classList.remove('open');
      panel.classList.add('closed');
      setTimeout(() => {
        backdrop.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }
  }

  renderCartDrawerContent() {
    const container = document.getElementById('cart-drawer-items');
    const subtitle = document.querySelector('.cart-header-subtitle');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const deliveryEl = document.getElementById('cart-drawer-delivery');
    const totalEl = document.getElementById('cart-drawer-total');
    const discountRow = document.getElementById('cart-drawer-discount-row');
    const discountEl = document.getElementById('cart-drawer-discount');

    if (!container) return;

    const state = this.getState();

    if (subtitle) {
      subtitle.textContent = `${state.totalCount} ${state.totalCount === 1 ? 'item' : 'items'} added`;
    }

    if (state.items.length === 0) {
      container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-2xl">
            <i class="fa-solid fa-basket-shopping"></i>
          </div>
          <h4 class="font-bold text-slate-700 text-base">Your cart is empty</h4>
          <p class="text-xs text-slate-500">Explore our delicious food & groceries to fill your basket.</p>
        </div>
      `;
    } else {
      container.innerHTML = state.items.map(item => `
        <div class="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow transition">
          <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-xs sm:text-sm text-slate-900 truncate">${item.product.name}</h4>
            <p class="text-[11px] text-slate-500">${item.product.unit} • ${item.product.storeName}</p>
            <div class="flex items-center justify-between mt-1.5">
              <span class="font-bold text-xs sm:text-sm text-emerald-600">৳${item.product.price * item.quantity}</span>
              
              <!-- Quantity Controls -->
              <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button data-cart-action="minus" data-id="${item.product.id}" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs transition">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="w-7 text-center text-xs font-bold text-slate-900">${item.quantity}</span>
                <button data-cart-action="plus" data-id="${item.product.id}" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs transition">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      // Bind quantity buttons inside drawer
      container.querySelectorAll('[data-cart-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = btn.getAttribute('data-cart-action');
          const productId = btn.getAttribute('data-id');
          if (action === 'plus') {
            const product = PRODUCTS.find(p => p.id === productId);
            if (product) this.addItem(product);
          } else if (action === 'minus') {
            this.removeItem(productId);
          }
        });
      });
    }

    if (subtotalEl) subtotalEl.textContent = `৳${state.subtotal}`;
    if (deliveryEl) deliveryEl.textContent = state.deliveryFee === 0 ? 'FREE' : `৳${state.deliveryFee}`;
    if (totalEl) totalEl.textContent = `৳${state.total}`;

    if (discountRow && discountEl) {
      if (state.discountAmount > 0) {
        discountRow.classList.remove('hidden');
        discountEl.textContent = `-৳${state.discountAmount}`;
      } else {
        discountRow.classList.add('hidden');
      }
    }
  }

  showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 space-y-2 pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-slate-900 text-white border-emerald-500' : 'bg-rose-900 text-white border-rose-500';
    const icon = type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-exclamation text-rose-400';

    toast.className = `pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border-l-4 shadow-xl ${bgColor} text-xs sm:text-sm font-semibold transform translate-y-4 opacity-0 transition-all duration-300`;
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-base"></i>
      <span class="flex-1">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
