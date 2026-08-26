/**
 * Interactive Controls & Handlers (Vanilla JS)
 * Location selector bottom-sheet/modal, countdown timer, search filter, favorites, and bottom-nav sync.
 */

class MarketplaceInteractions {
  constructor(cartManager) {
    this.cart = cartManager;
    this.selectedLocation = LOCATIONS.find(l => l.isSelected) || LOCATIONS[0];
    this.favorites = new Set(JSON.parse(localStorage.getItem('hypermarket_favs')) || []);

    this.initLocationModal();
    this.initFlashCountdown();
    this.initSearch();
    this.initFavoriteHandlers();
    this.initBottomNav();
    this.initBackToTop();
    this.initRailControls();
  }

  // 1. LOCATION SELECTOR MODAL / BOTTOM SHEET
  initLocationModal() {
    this.renderLocationModalMarkup();
    this.bindLocationEvents();
    this.updateLocationHeaderUI();
  }

  renderLocationModalMarkup() {
    let container = document.getElementById('location-modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'location-modal-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <!-- Backdrop -->
      <div id="location-backdrop" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 backdrop-blur-overlay hidden opacity-0"></div>

      <!-- Modal / Bottom Sheet Panel -->
      <div id="location-panel" class="fixed bottom-0 md:bottom-auto md:top-1/2 left-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl z-50 shadow-2xl bottom-sheet closed p-6 space-y-5">
        
        <!-- Sheet Handle for Mobile -->
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto md:hidden"></div>

        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div>
              <h3 class="font-bold text-base text-slate-900">Select Delivery Location</h3>
              <p class="text-xs text-slate-500">Pick where you want your order delivered</p>
            </div>
          </div>
          <button id="close-location-modal" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Current GPS Simulation Button -->
        <button id="use-gps-btn" class="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition touch-active">
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-crosshairs text-base text-emerald-600"></i>
            <div class="text-left">
              <h4 class="font-bold text-xs sm:text-sm">Use Current GPS Location</h4>
              <p class="text-[11px] text-emerald-600/80">Rangpur Sadar • Auto detect</p>
            </div>
          </div>
          <span class="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-lg">Detect</span>
        </button>

        <!-- Saved Locations List -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Addresses</label>
          <div class="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
            ${LOCATIONS.map(loc => `
              <div data-location-id="${loc.id}" class="location-item flex items-center justify-between p-3.5 rounded-2xl border ${loc.id === this.selectedLocation.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:bg-slate-50'} cursor-pointer transition">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl ${loc.type === 'home' ? 'bg-amber-100 text-amber-600' : loc.type === 'office' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid ${loc.type === 'home' ? 'fa-house' : loc.type === 'office' ? 'fa-building' : 'fa-bookmark'}"></i>
                  </div>
                  <div>
                    <h5 class="font-bold text-xs sm:text-sm text-slate-900">${loc.title}</h5>
                    <p class="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-[250px]">${loc.address}</p>
                  </div>
                </div>
                <div class="w-5 h-5 rounded-full border-2 ${loc.id === this.selectedLocation.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'} flex items-center justify-center">
                  ${loc.id === this.selectedLocation.id ? '<i class="fa-solid fa-check text-[10px] text-white"></i>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <button id="add-new-address-btn" class="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition">
          <i class="fa-solid fa-plus"></i>
          <span>Add New Address</span>
        </button>
      </div>
    `;
  }

  bindLocationEvents() {
    const backdrop = document.getElementById('location-backdrop');
    const panel = document.getElementById('location-panel');
    const closeBtn = document.getElementById('close-location-modal');
    const gpsBtn = document.getElementById('use-gps-btn');
    const addBtn = document.getElementById('add-new-address-btn');

    if (backdrop) backdrop.addEventListener('click', () => this.closeLocationModal());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLocationModal());

    document.querySelectorAll('.open-location-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => this.openLocationModal());
    });

    if (gpsBtn) {
      gpsBtn.addEventListener('click', () => {
        this.selectedLocation = {
          id: 'gps',
          title: 'Current Location',
          address: 'Rangpur Sadar, Bangladesh',
          type: 'current'
        };
        this.updateLocationHeaderUI();
        this.cart.showToast('Updated location to current GPS!', 'success');
        this.closeLocationModal();
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.cart.showToast('Address form coming soon!', 'success');
      });
    }

    document.querySelectorAll('.location-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const id = item.getAttribute('data-location-id');
        const found = LOCATIONS.find(l => l.id === id);
        if (found) {
          this.selectedLocation = found;
          this.renderLocationModalMarkup();
          this.bindLocationEvents();
          this.updateLocationHeaderUI();
          this.cart.showToast(`Delivering to "${found.title}"`, 'success');
          this.closeLocationModal();
        }
      });
    });
  }

  openLocationModal() {
    const backdrop = document.getElementById('location-backdrop');
    const panel = document.getElementById('location-panel');

    if (backdrop && panel) {
      backdrop.classList.remove('hidden');
      setTimeout(() => backdrop.classList.add('visible'), 10);
      panel.classList.remove('closed');
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLocationModal() {
    const backdrop = document.getElementById('location-backdrop');
    const panel = document.getElementById('location-panel');

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

  updateLocationHeaderUI() {
    document.querySelectorAll('.current-location-title').forEach(el => {
      el.textContent = `${this.selectedLocation.title} — ${this.selectedLocation.address.split(',')[0]}`;
    });
  }

  // 2. FLASH DEALS COUNTDOWN TIMER
  initFlashCountdown() {
    let targetTime = new Date().getTime() + (2 * 3600 * 1000 + 35 * 60 * 1000 + 18 * 1000);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        targetTime = new Date().getTime() + (3 * 3600 * 1000); // Reset timer loop
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const pad = (n) => n.toString().padStart(2, '0');

      document.querySelectorAll('.flash-hours').forEach(el => el.textContent = pad(hours));
      document.querySelectorAll('.flash-minutes').forEach(el => el.textContent = pad(minutes));
      document.querySelectorAll('.flash-seconds').forEach(el => el.textContent = pad(seconds));
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // 3. FAVORITE HANDLERS
  initFavoriteHandlers() {
    document.addEventListener('click', (e) => {
      const favBtn = e.target.closest('.fav-btn');
      if (favBtn) {
        const id = favBtn.getAttribute('data-fav-id');
        const icon = favBtn.querySelector('i');
        
        if (this.favorites.has(id)) {
          this.favorites.delete(id);
          favBtn.classList.remove('text-rose-500');
          favBtn.classList.add('text-slate-400');
          if (icon) {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
          }
          this.cart.showToast('Removed from favorites', 'error');
        } else {
          this.favorites.add(id);
          favBtn.classList.remove('text-slate-400');
          favBtn.classList.add('text-rose-500');
          if (icon) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
          }
          this.cart.showToast('Added to your favorites!', 'success');
        }

        localStorage.setItem('hypermarket_favs', JSON.stringify(Array.from(this.favorites)));
      }
    });
  }

  // 4. SEARCH FILTER ENGINE
  initSearch() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchInputs.forEach(other => { if (other !== input) other.value = query; });
        this.filterProductsAndStores(query);
      });
    });
  }

  filterProductsAndStores(query) {
    const popularGrid = document.getElementById('popular-products-grid');
    if (!popularGrid) return;

    if (!query) {
      // Reset filter to All
      if (window.appInstance) window.appInstance.renderPopularProducts('all');
      return;
    }

    const matchedProducts = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.storeName.toLowerCase().includes(query)
    );

    if (window.appInstance) {
      window.appInstance.renderProductCards(popularGrid, matchedProducts);
    }
  }

  // 5. MOBILE BOTTOM NAV HIGHLIGHT (with active indicator bar)
  initBottomNav() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        navItems.forEach(n => {
          n.classList.remove('text-emerald-600', 'font-bold', 'active');
          n.classList.add('text-slate-400');
        });
        item.classList.remove('text-slate-400');
        item.classList.add('text-emerald-600', 'font-bold', 'active');
      });
    });
  }

  // 6. BACK TO TOP BUTTON
  initBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
        btn.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
      } else {
        btn.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        btn.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. DESKTOP RAIL CONTROLS & DRAG SCROLL
  initRailControls() {
    // Arrow button click handling
    document.querySelectorAll('.rail-scroll-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-scroll-target');
        const dir = parseInt(btn.getAttribute('data-scroll-dir') || '320', 10);
        const rail = document.getElementById(targetId);
        if (rail) {
          rail.scrollBy({ left: dir, behavior: 'smooth' });
        }
      });
    });

    // Mouse drag-to-scroll on rails
    document.querySelectorAll('.snap-x-rail').forEach(rail => {
      let isDown = false;
      let startX;
      let scrollLeft;

      rail.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - rail.offsetLeft;
        scrollLeft = rail.scrollLeft;
      });

      rail.addEventListener('mouseleave', () => {
        isDown = false;
      });

      rail.addEventListener('mouseup', () => {
        isDown = false;
      });

      rail.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - rail.offsetLeft;
        const walk = (x - startX) * 1.8;
        rail.scrollLeft = scrollLeft - walk;
      });
    });
  }
}
