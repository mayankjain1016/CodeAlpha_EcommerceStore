/**
 * ApexStore - index.js
 * Home Page Controller:
 * 1. Hero Carousel (5s auto-slide, arrows, dots, hover/touch/visibility pause, reduced-motion check)
 * 2. Deal of the Day Midnight Countdown Timer (updates every second, resets at midnight)
 * 3. Modular Horizontal Auto-Sliders (3.5s per card, loop, hover/touch/visibility pause, reduced-motion check)
 * 4. Resilient per-section data rendering with isolated retry buttons
 * 5. Real Featured Brands with authentic product counts linking to ?brand=...
 * 6. Recently Viewed Products (localStorage apex_recently_viewed) with clean history toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initDealCountdown();
  loadHomePageData();
  loadRecentlyViewed();
});

// Helper: safe access to global / window.Apex methods
const getHelpers = () => ({
  renderCard: (typeof renderProductCard === 'function') ? renderProductCard : (window.Apex && window.Apex.renderProductCard),
  formatMoney: (typeof formatPrice === 'function') ? formatPrice : (window.Apex && window.Apex.formatPrice),
  attachEvents: (typeof attachCardEvents === 'function') ? attachCardEvents : (window.Apex && window.Apex.attachCardEvents),
  recentViewed: (typeof RecentlyViewed !== 'undefined') ? RecentlyViewed : (window.Apex && window.Apex.RecentlyViewed),
  toast: (typeof showToast === 'function') ? showToast : (window.Apex && window.Apex.showToast)
});

// ==========================================================================
// 1. Hero Carousel Controller (Auto 5s)
// ==========================================================================
function initHeroCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const section = document.getElementById('hero-carousel');

  if (!track || slides.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentIndex = 0;
  let autoTimer = null;
  let isPaused = false;
  const slideCount = slides.length;

  // Build Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slideCount - 1;
    } else if (index >= slideCount) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      restartTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      restartTimer();
    });
  }

  function startTimer() {
    if (prefersReduced || autoTimer || isPaused || document.hidden) return;
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  if (section) {
    section.addEventListener('mouseenter', () => {
      isPaused = true;
      stopTimer();
    });
    section.addEventListener('mouseleave', () => {
      isPaused = false;
      startTimer();
    });
    section.addEventListener('focusin', () => {
      isPaused = true;
      stopTimer();
    });
    section.addEventListener('focusout', () => {
      isPaused = false;
      startTimer();
    });
    section.addEventListener('touchstart', () => {
      isPaused = true;
      stopTimer();
    }, { passive: true });
    section.addEventListener('touchend', () => {
      setTimeout(() => {
        isPaused = false;
        startTimer();
      }, 3000);
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else if (!isPaused) {
      startTimer();
    }
  });

  startTimer();
}

// ==========================================================================
// 2. Deal Countdown Timer (Midnight Local Time)
// ==========================================================================
function initDealCountdown() {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diffMs = midnight.getTime() - now.getTime();
    if (diffMs <= 0) {
      hoursEl.textContent = '23';
      minsEl.textContent = '59';
      secsEl.textContent = '59';
      return;
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    hoursEl.textContent = String(hrs).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ==========================================================================
// 3. Auto-Sliding Horizontal Row Controller (3.5s per card, loop, pause)
// ==========================================================================
const registeredSliders = new Map();

function initAutoSlider(rowId) {
  const rowElement = document.getElementById(rowId);
  if (!rowElement) return;

  // Clean up any existing slider on this row
  if (registeredSliders.has(rowId)) {
    registeredSliders.get(rowId).stop();
  }

  const wrapper = rowElement.closest('.home-scroll-wrapper') || rowElement.parentElement;
  const arrowPrev = wrapper ? wrapper.querySelector('.row-scroll-arrow.prev') : null;
  const arrowNext = wrapper ? wrapper.querySelector('.row-scroll-arrow.next') : null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoTimer = null;
  let isInteracting = false;

  function getStep() {
    const firstCard = rowElement.querySelector('.product-card');
    if (firstCard) {
      return firstCard.offsetWidth + 16;
    }
    return 240;
  }

  function scrollOneCard(direction = 'next') {
    const step = getStep();
    const maxScroll = rowElement.scrollWidth - rowElement.clientWidth;

    if (direction === 'next') {
      if (rowElement.scrollLeft >= maxScroll - 8) {
        rowElement.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        rowElement.scrollBy({ left: step, behavior: 'smooth' });
      }
    } else {
      if (rowElement.scrollLeft <= 8) {
        rowElement.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        rowElement.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  }

  function startAuto() {
    if (prefersReduced || autoTimer || isInteracting || document.hidden) return;
    autoTimer = setInterval(() => {
      scrollOneCard('next');
    }, 3500);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function pause() {
    isInteracting = true;
    stopAuto();
  }

  function resume() {
    isInteracting = false;
    startAuto();
  }

  // Interactive events
  if (wrapper) {
    wrapper.addEventListener('mouseenter', pause);
    wrapper.addEventListener('mouseleave', resume);
    wrapper.addEventListener('focusin', pause);
    wrapper.addEventListener('focusout', resume);
  }

  rowElement.addEventListener('touchstart', pause, { passive: true });
  rowElement.addEventListener('touchend', () => {
    setTimeout(resume, 2500);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAuto();
    } else if (!isInteracting) {
      startAuto();
    }
  });

  if (arrowPrev) {
    arrowPrev.addEventListener('click', (e) => {
      e.preventDefault();
      scrollOneCard('prev');
      pause();
      setTimeout(resume, 4000);
    });
  }

  if (arrowNext) {
    arrowNext.addEventListener('click', (e) => {
      e.preventDefault();
      scrollOneCard('next');
      pause();
      setTimeout(resume, 4000);
    });
  }

  const updateArrows = () => {
    const maxScroll = rowElement.scrollWidth - rowElement.clientWidth;
    if (arrowPrev) {
      arrowPrev.style.opacity = rowElement.scrollLeft <= 8 ? '0.4' : '1';
    }
    if (arrowNext) {
      arrowNext.style.opacity = rowElement.scrollLeft >= maxScroll - 8 ? '0.4' : '1';
    }
  };

  rowElement.addEventListener('scroll', updateArrows, { passive: true });
  setTimeout(updateArrows, 300);

  startAuto();

  const controller = { stop: stopAuto, start: startAuto };
  registeredSliders.set(rowId, controller);
}

// ==========================================================================
// 4. Skeleton Helpers & Per-Section Error Handlers
// ==========================================================================
function renderSkeleton(containerId, count = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="product-card skeleton-card" style="flex: 0 0 230px; min-width: 230px;">
      <div class="skeleton-box" style="height: 180px; width: 100%; margin-bottom: 12px; background: #e8ebf0; border-radius: 4px;"></div>
      <div class="skeleton-box" style="height: 12px; width: 45%; margin-bottom: 8px; background: #e8ebf0; border-radius: 2px;"></div>
      <div class="skeleton-box" style="height: 15px; width: 85%; margin-bottom: 8px; background: #e8ebf0; border-radius: 2px;"></div>
      <div class="skeleton-box" style="height: 18px; width: 55%; background: #e8ebf0; border-radius: 2px;"></div>
    </div>
  `).join('');
}

function renderSectionError(containerId, sectionTitle, retryFn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="home-section-error-pill">
      <span>Failed to load ${sectionTitle}.</span>
      <button type="button" class="btn-section-retry">Retry</button>
    </div>
  `;

  const btn = container.querySelector('.btn-section-retry');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderSkeleton(containerId, 4);
      retryFn();
    });
  }
}

// ==========================================================================
// 5. Load Home Page Data & Populate Individual Sections
// ==========================================================================
let homeDataCache = null;

async function fetchHomeData(force = false) {
  if (homeDataCache && !force) return homeDataCache;
  const res = await fetch('/api/products/home');
  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}`);
  }
  homeDataCache = await res.json();
  return homeDataCache;
}

async function loadHomePageData() {
  // Set initial skeletons
  ['deals-products-row', 'budget-products-row', 'top-rated-products-row', 'premium-products-row', 'new-arrivals-products-row', 'best-sellers-products-row'].forEach(id => {
    renderSkeleton(id, 5);
  });

  try {
    const data = await fetchHomeData();
    populateAllSections(data);
  } catch (err) {
    console.error('Home Page Data Fetch failed:', err);
    // Render individual retry buttons for all sections
    renderSectionError('deals-products-row', 'Deals', () => loadIndividualSection('deals'));
    renderSectionError('budget-products-row', 'Budget Picks', () => loadIndividualSection('budget'));
    renderSectionError('top-rated-products-row', 'Top Rated', () => loadIndividualSection('topRated'));
    renderSectionError('premium-products-row', 'Premium Picks', () => loadIndividualSection('premium'));
    renderSectionError('new-arrivals-products-row', 'New Arrivals', () => loadIndividualSection('newArrivals'));
    renderSectionError('best-sellers-products-row', 'Best Sellers', () => loadIndividualSection('bestSellers'));
  }
}

async function loadIndividualSection(type) {
  try {
    const data = await fetchHomeData(true);
    populateAllSections(data);
  } catch (err) {
    console.error(`Retry failed for ${type}:`, err);
  }
}

function populateAllSections(data) {
  const { renderCard, formatMoney, attachEvents } = getHelpers();
  const allRenderedProducts = [];

  // A. Deal of the Day
  const dealsRow = document.getElementById('deals-products-row');
  if (dealsRow) {
    if (Array.isArray(data.deals) && data.deals.length > 0) {
      dealsRow.innerHTML = data.deals.map(p => renderCard(p, { showDiscountPill: true })).join('');
      allRenderedProducts.push(...data.deals);
      initAutoSlider('deals-products-row');
    } else {
      dealsRow.innerHTML = '<p class="empty-state-muted">No deals available right now.</p>';
    }
  }

  // B. Budget Picks (Under Rs 999)
  const budgetRow = document.getElementById('budget-products-row');
  if (budgetRow) {
    if (Array.isArray(data.budgetPicks) && data.budgetPicks.length > 0) {
      budgetRow.innerHTML = data.budgetPicks.map(p => renderCard(p, { showDiscountPill: true })).join('');
      allRenderedProducts.push(...data.budgetPicks);
      initAutoSlider('budget-products-row');
    } else {
      budgetRow.innerHTML = '<p class="empty-state-muted">No items under ₹999 at this time.</p>';
    }
  }

  // C. Shop by Category Quad Blocks (4 blocks, 2x2 grid each)
  const catBlocksContainer = document.getElementById('category-blocks-container');
  if (catBlocksContainer && Array.isArray(data.categoryBlocks) && data.categoryBlocks.length > 0) {
    catBlocksContainer.innerHTML = data.categoryBlocks.map(block => {
      const quadItemsHtml = (block.products || []).slice(0, 4).map(item => {
        const imgUrl = (Array.isArray(item.images) && item.images[0]) ? item.images[0] : (item.image || '');
        return `
          <a href="product.html?id=${item._id}" class="cat-quad-item">
            <div class="cat-quad-img-wrap">
              <img src="${imgUrl}" alt="${item.name}" loading="lazy" />
            </div>
            <span class="cat-quad-name" title="${item.name}">${item.name}</span>
            <span class="cat-quad-price">From ${formatMoney(item.price)}</span>
          </a>
        `;
      }).join('');

      return `
        <div class="category-block-card">
          <div class="category-block-header">
            <h3 class="category-block-title">${block.category}</h3>
            <span class="category-block-subtitle">${block.title || 'Top picks & essentials'}</span>
          </div>
          <div class="category-block-2x2">
            ${quadItemsHtml}
          </div>
          <a href="products.html?category=${encodeURIComponent(block.category)}" class="cat-block-see-all">
            See all in ${block.category}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
      `;
    }).join('');
  }

  // D. Top Rated Products
  const topRatedRow = document.getElementById('top-rated-products-row');
  if (topRatedRow) {
    if (Array.isArray(data.topRated) && data.topRated.length > 0) {
      topRatedRow.innerHTML = data.topRated.map(p => renderCard(p, { showDiscountPill: true })).join('');
      allRenderedProducts.push(...data.topRated);
      initAutoSlider('top-rated-products-row');
    } else {
      topRatedRow.innerHTML = '<p class="empty-state-muted">No top-rated items currently found.</p>';
    }
  }

  // E. Premium Picks (Above Rs 4,999)
  const premiumRow = document.getElementById('premium-products-row');
  if (premiumRow) {
    if (Array.isArray(data.premiumPicks) && data.premiumPicks.length > 0) {
      premiumRow.innerHTML = data.premiumPicks.map(p => renderCard(p, { showDiscountPill: true })).join('');
      allRenderedProducts.push(...data.premiumPicks);
      initAutoSlider('premium-products-row');
    } else {
      premiumRow.innerHTML = '<p class="empty-state-muted">No premium items found.</p>';
    }
  }

  // F. New Arrivals
  const newArrivalsRow = document.getElementById('new-arrivals-products-row');
  if (newArrivalsRow) {
    if (Array.isArray(data.newArrivals) && data.newArrivals.length > 0) {
      newArrivalsRow.innerHTML = data.newArrivals.map(p => renderCard(p, { showDiscountPill: true })).join('');
      allRenderedProducts.push(...data.newArrivals);
      initAutoSlider('new-arrivals-products-row');
    } else {
      newArrivalsRow.innerHTML = '<p class="empty-state-muted">No new arrivals at this moment.</p>';
    }
  }

  // G. Best Sellers
  const bestSellersRow = document.getElementById('best-sellers-products-row');
  if (bestSellersRow) {
    if (Array.isArray(data.bestSellers) && data.bestSellers.length > 0) {
      bestSellersRow.innerHTML = data.bestSellers.map(p => renderCard(p, { showDiscountPill: true })).join('');
      allRenderedProducts.push(...data.bestSellers);
      initAutoSlider('best-sellers-products-row');
    } else {
      bestSellersRow.innerHTML = '<p class="empty-state-muted">No best sellers available.</p>';
    }
  }

  // Attach card interaction listeners (Wishlist toggle & Add to Cart)
  if (allRenderedProducts.length > 0 && typeof attachEvents === 'function') {
    attachEvents(allRenderedProducts, document);
  }
}

// ==========================================================================
// 6. Recently Viewed Products (localStorage apex_recently_viewed)
// ==========================================================================
async function loadRecentlyViewed() {
  const section = document.getElementById('section-recently-viewed');
  const row = document.getElementById('recently-viewed-products-row');
  const clearBtn = document.getElementById('clear-recent-history-btn');

  if (!section || !row) return;

  const { renderCard, attachEvents, recentViewed, toast } = getHelpers();
  if (!recentViewed) {
    section.style.display = 'none';
    return;
  }

  const ids = recentViewed.getAll();
  if (!ids || ids.length === 0) {
    section.style.display = 'none';
    return;
  }

  renderSkeleton('recently-viewed-products-row', Math.min(ids.length, 4));
  section.style.display = '';

  try {
    const res = await fetch(`/api/products?ids=${encodeURIComponent(ids.join(','))}`);
    if (!res.ok) {
      section.style.display = 'none';
      return;
    }
    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      section.style.display = 'none';
      return;
    }

    // Preserve the order of recent viewing
    const ordered = [];
    ids.forEach(id => {
      const found = products.find(p => p._id === id);
      if (found) ordered.push(found);
    });

    row.innerHTML = ordered.map(p => renderCard(p, { showDiscountPill: true })).join('');
    section.style.display = '';

    if (typeof attachEvents === 'function') {
      attachEvents(ordered, row);
    }

    initAutoSlider('recently-viewed-products-row');

    if (clearBtn) {
      clearBtn.onclick = (e) => {
        e.preventDefault();
        recentViewed.clear();
        section.style.display = 'none';
        row.innerHTML = '';
        if (typeof toast === 'function') {
          toast('Browsing history cleared');
        }
      };
    }
  } catch (err) {
    console.error('Failed to load recently viewed:', err);
    section.style.display = 'none';
  }
}
