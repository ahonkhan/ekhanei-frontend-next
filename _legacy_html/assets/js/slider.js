/**
 * Hero Promotional Slider Component (Vanilla JS)
 * Premium slider with auto-play, dots, controls, touch swipe, and desktop mouse drag.
 */

class HeroSlider {
  constructor(containerId, slidesData) {
    this.container = document.getElementById(containerId);
    this.slides = slidesData;
    this.currentIndex = 0;
    this.autoSlideInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    if (this.container && this.slides && this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    this.render();
    this.bindEvents();
    this.startAutoSlide();
  }

  render() {
    if (!this.container) return;
    const slideCount = this.slides.length;

    this.container.innerHTML = `
      <div class="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-slate-950 group">
        <!-- Track -->
        <div id="slider-track" class="flex transition-transform duration-500 ease-out" style="width: ${slideCount * 100}%;">
          ${this.slides.map((slide, index) => this.renderSlideMarkup(slide, index, slideCount)).join('')}
        </div>

        <!-- Prev / Next Controls (Desktop) -->
        <button id="slider-prev" type="button" aria-label="Previous Slide" class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white items-center justify-center transition-all duration-200 border border-white/20 shadow-xl z-30 cursor-pointer touch-active">
          <i class="fa-solid fa-chevron-left text-sm"></i>
        </button>
        <button id="slider-next" type="button" aria-label="Next Slide" class="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white items-center justify-center transition-all duration-200 border border-white/20 shadow-xl z-30 cursor-pointer touch-active">
          <i class="fa-solid fa-chevron-right text-sm"></i>
        </button>

        <!-- Dots -->
        <div id="slider-dots" class="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          ${this.slides.map((_, index) => `
            <button data-index="${index}" type="button" aria-label="Slide ${index + 1}" class="slider-dot h-2.5 rounded-full transition-all duration-300 ${index === 0 ? 'bg-emerald-400 w-7' : 'bg-white/40 hover:bg-white/70 w-2.5'}"></button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderSlideMarkup(slide, index, slideCount) {
    const slideWidthPct = 100 / slideCount;
    return `
      <div class="relative overflow-hidden bg-gradient-to-br ${slide.bgGradient} text-white" style="width: ${slideWidthPct}%;">
        <!-- Ambient Glow -->
        <div class="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-teal-500/8 blur-2xl pointer-events-none"></div>

        <div class="px-5 py-7 sm:px-10 sm:py-10 md:px-12 md:py-12 min-h-[280px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[460px] flex items-center">
          <div class="grid grid-cols-12 gap-4 sm:gap-6 items-center w-full relative z-10">
            <!-- Text Content -->
            <div class="col-span-12 md:col-span-7 space-y-3 sm:space-y-4">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur">
                <span>${slide.badge}</span>
              </div>
              
              <h2 class="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
                ${slide.title}
              </h2>
              
              <p class="text-xs sm:text-base text-slate-300 line-clamp-3 max-w-xl leading-relaxed">
                ${slide.subtitle}
              </p>

              <div class="pt-2 flex flex-wrap items-center gap-3">
                <a href="${slide.ctaLink}" class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm font-bold px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition touch-active">
                  <span>${slide.ctaText}</span>
                  <i class="fa-solid fa-arrow-right text-xs"></i>
                </a>

                <span class="inline-block px-3.5 py-2 rounded-lg bg-white/10 text-amber-300 text-xs font-extrabold border border-white/10 backdrop-blur">
                  ${slide.tag}
                </span>
              </div>
            </div>

            <!-- Hero Image -->
            <div class="hidden md:block md:col-span-5 relative">
              <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group/img">
                <img src="${slide.image}" alt="${slide.title}" class="w-full h-56 md:h-64 lg:h-76 object-cover transform group-hover/img:scale-105 transition duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('#slider-prev');
    const nextBtn = this.container.querySelector('#slider-next');
    const dots = this.container.querySelectorAll('.slider-dot');
    const track = this.container.querySelector('#slider-track');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.prev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.next();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        this.goTo(index);
      });
    });

    // Touch Swipe
    if (track) {
      track.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
        this.stopAutoSlide();
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
        this.startAutoSlide();
      }, { passive: true });

      this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
      this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) this.next();
      else this.prev();
    }
  }

  goTo(index) {
    this.currentIndex = index;
    if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;

    const track = this.container.querySelector('#slider-track');
    if (track) {
      const translatePct = (this.currentIndex * 100) / this.slides.length;
      track.style.transform = `translateX(-${translatePct}%)`;
    }

    const dots = this.container.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.className = idx === this.currentIndex
        ? 'slider-dot h-2.5 rounded-full transition-all duration-300 bg-emerald-400 w-7'
        : 'slider-dot h-2.5 rounded-full transition-all duration-300 bg-white/40 hover:bg-white/70 w-2.5';
    });
  }

  next() { this.goTo(this.currentIndex + 1); }
  prev() { this.goTo(this.currentIndex - 1); }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => this.next(), 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}
