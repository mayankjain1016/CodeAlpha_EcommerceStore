/**
 * ApexStore - index.js
 * Home Page Controller:
 * 1. Hero Carousel (5s auto-slide, arrows, dots, hover-pause)
 * 2. Deal of the Day Midnight Countdown Timer
 * 3. Horizontal Scroll Rows with Smooth Left/Right Arrow Buttons
 * 4. API Data Fetch (/api/products/home) for Deals, Top Rated, New Arrivals, Best Sellers, Category Quad Blocks, Brands
 * 5. Recently Viewed Products (localStorage apex_recently_viewed)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initDealCountdown();
  initHorizontalScrollArrows();
  loadHomePageData();
  loadRecentlyViewed();
});

// ==========================================================================
// 1. Hero Carousel Controller
// ==========================================================================
function initHeroCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const section = document.getElementById('hero-carousel');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;
  const slideCount = slides.length;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
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
      resetAutoTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetAutoTimer();
    });
  }

  function startAutoTimer() {
    stopAutoTimer();
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoTimer() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function resetAutoTimer() {
    stopAutoTimer();
    startAutoTimer();
  }

  if (section) {
    section.addEventListener('mouseenter', stopAutoTimer);
    section.addEventListener('mouseleave', startAutoTimer);
    section.addEventListener('focusin', stopAutoTimer);
    section.addEventListener('focusout', startAutoTimer);
  }

  startAutoTimer();
}

// ==========================================================================
// 2. Deal of the Day Midnight Countdown Timer
// ==========================================================================
function initDealCountdown() {
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next midnight local time

    const diffMs = midnight.getTime() - now.getTime();
    if (diffMs <= 0) {
      // Midnight reached: rolled over to next day
      hoursEl.textContent = '23';
      minutesEl.textContent = '59';
      secondsEl.textContent = '59';
      return;
    }

    const totalSecs = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    hoursEl.textContent = String(hrs).padStart(2, '0');
    minutesEl.textContent = String(mins).padStart(2, '0');
    secondsEl.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ==========================================================================
// 3. Horizontal Scroll Rows Controller
// ==========================================================================
function initHorizontalScrollArrows() {
  document.querySelectorAll('.row-scroll-arrow').forEach((arrow) => {
    arrow.addEventListener('click', () => {
      const targetId = arrow.getAttribute('data-target');
      const targetRow = document.getElementById(targetId);
      if (!targetRow) return;

      const isNext = arrow.classList.contains('next');
      const scrollStep = Math.max(300, Math.floor(targetRow.clientWidth * 0.7));
      const newScrollLeft = isNext
        ? targetRow.scrollLeft + scrollStep
        : targetRow.scrollLeft - scrollStep;

      targetRow.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    });
  });

  // Observe scroll position to optionally adjust arrow states
  const scrollRows = document.querySelectorAll('.products-scroll-row');
  scrollRows.forEach((row) => {
    const updateArrows = () => {
      const parent = row.closest('.home-scroll-wrapper');
      if (!parent) return;
      const prev = parent.querySelector('.row-scroll-arrow.prev');
      const next = parent.querySelector('.row-scroll-arrow.next');

      if (prev) {
        prev.style.opacity = row.scrollLeft <= 10 ? '0.3' : '1';
        prev.style.pointerEvents = row.scrollLeft <= 10 ? 'none' : 'auto';
      }
      if (next) {
        const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 10;
        next.style.opacity = atEnd ? '0.3' : '1';
        next.style.pointerEvents = atEnd ? 'none' : 'auto';
      }
    };

    row.addEventListener('scroll', updateArrows, { passive: true });
    // Run after render
    setTimeout(updateArrows, 300);
  });
}

// ==========================================================================
// 4. Load Home Page Data from API
// ==========================================================================
async function loadHomePageData() {
  try {
    const res = await fetch('/api/products/home');
    if (!res.ok) {
      throw new Error(`Failed to load home data (${res.status})`);
    }
    const data = await res.json();
    const collectedProducts = [];

    // A. Deal of the Day
    const dealsRow = document.getElementById('deals-products-row');
    if (dealsRow && Array.isArray(data.deals) && data.deals.length > 0) {
      dealsRow.innerHTML = data.deals
        .map((p) => window.Apex.renderProductCard(p, { showDiscountPill: true }))
        .join('');
      collectedProducts.push(...data.deals);
    } else if (dealsRow) {
      dealsRow.innerHTML = '<p class="empty-state-muted">No deals available right now.</p>';
    }

    // B. Shop by Category Quad Blocks
    const catBlocksContainer = document.getElementById('category-blocks-container');
    if (catBlocksContainer && Array.isArray(data.categoryBlocks) && data.categoryBlocks.length > 0) {
      catBlocksContainer.innerHTML = data.categoryBlocks
        .map((block) => {
          const quadItemsHtml = (block.products || [])
            .slice(0, 4)
            .map((item) => {
              const imgUrl = (Array.isArray(item.images) && item.images[0]) ? item.images[0] : (item.image || '');
              return `
                <a href="product.html?id=${item._id}" class="cat-quad-item">
                  <div class="cat-quad-img-wrap">
                    <img src="${imgUrl}" alt="${item.name}" loading="lazy" />
                  </div>
                  <span class="cat-quad-name" title="${item.name}">${item.name}</span>
                  <span class="cat-quad-price">From ${window.Apex.formatPrice(item.price)}</span>
                </a>
              `;
            })
            .join('');

          return `
            <div class="category-block-card">
              <div class="category-block-header">
                <h3 class="category-block-title">${block.category}</h3>
                <span class="category-block-subtitle">Top picks & essentials</span>
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
        })
        .join('');
    }

    // C. Top Rated
    const topRatedRow = document.getElementById('top-rated-products-row');
    if (topRatedRow && Array.isArray(data.topRated) && data.topRated.length > 0) {
      topRatedRow.innerHTML = data.topRated
        .map((p) => window.Apex.renderProductCard(p, { showDiscountPill: true }))
        .join('');
      collectedProducts.push(...data.topRated);
    } else if (topRatedRow) {
      topRatedRow.innerHTML = '<p class="empty-state-muted">No top-rated items currently found.</p>';
    }

    // D. New Arrivals
    const newArrivalsRow = document.getElementById('new-arrivals-products-row');
    if (newArrivalsRow && Array.isArray(data.newArrivals) && data.newArrivals.length > 0) {
      newArrivalsRow.innerHTML = data.newArrivals
        .map((p) => window.Apex.renderProductCard(p, { showDiscountPill: true }))
        .join('');
      collectedProducts.push(...data.newArrivals);
    } else if (newArrivalsRow) {
      newArrivalsRow.innerHTML = '<p class="empty-state-muted">No new arrivals at this moment.</p>';
    }

    // E. Best Sellers
    const bestSellersRow = document.getElementById('best-sellers-products-row');
    if (bestSellersRow && Array.isArray(data.bestSellers) && data.bestSellers.length > 0) {
      bestSellersRow.innerHTML = data.bestSellers
        .map((p) => window.Apex.renderProductCard(p, { showDiscountPill: true }))
        .join('');
      collectedProducts.push(...data.bestSellers);
    } else if (bestSellersRow) {
      bestSellersRow.innerHTML = '<p class="empty-state-muted">No best sellers available.</p>';
    }

    // F. Brand Chips
    const brandsContainer = document.getElementById('brand-chips-container');
    if (brandsContainer && Array.isArray(data.brands) && data.brands.length > 0) {
      brandsContainer.innerHTML = data.brands
        .map(
          (b) => `
          <a href="products.html?search=${encodeURIComponent(b)}" class="brand-chip">
            <span class="brand-chip-name">${b}</span>
            <span class="brand-chip-explore">Explore &rarr;</span>
          </a>
        `
        )
        .join('');
    }

    // Attach cart and wishlist listeners to all rendered product cards
    if (collectedProducts.length > 0) {
      window.Apex.attachCardEvents(collectedProducts, document);
    }

    // Re-check scroll arrows visibility
    setTimeout(() => {
      document.querySelectorAll('.products-scroll-row').forEach((row) => {
        row.dispatchEvent(new Event('scroll'));
      });
    }, 200);
  } catch (err) {
    console.error('Error loading home page sections:', err);
    // Remove skeleton loaders gracefully
    ['deals-products-row', 'top-rated-products-row', 'new-arrivals-products-row', 'best-sellers-products-row'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '<p class="empty-state-muted">Unable to load products. Please refresh the page.</p>';
    });
  }
}

// ==========================================================================
// 5. Recently Viewed Products (localStorage apex_recently_viewed)
// ==========================================================================
async function loadRecentlyViewed() {
  const section = document.getElementById('section-recently-viewed');
  const row = document.getElementById('recently-viewed-products-row');
  const clearBtn = document.getElementById('clear-recently-viewed');

  if (!section || !row) return;

  const ids = window.Apex.RecentlyViewed.getAll();
  if (!ids || ids.length === 0) {
    section.style.display = 'none';
    return;
  }

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

    // Sort to match recently viewed order
    const ordered = [];
    ids.forEach((id) => {
      const found = products.find((p) => p._id === id);
      if (found) ordered.push(found);
    });

    row.innerHTML = ordered
      .map((p) => window.Apex.renderProductCard(p, { showDiscountPill: true }))
      .join('');
    section.style.display = '';

    window.Apex.attachCardEvents(ordered, row);

    // Clear history handler
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.Apex.RecentlyViewed.clear();
        section.style.display = 'none';
        row.innerHTML = '';
        if (window.Apex.showToast) {
          window.Apex.showToast('Recently viewed history cleared');
        }
      });
    }

    setTimeout(() => {
      row.dispatchEvent(new Event('scroll'));
    }, 200);
  } catch (err) {
    console.error('Error fetching recently viewed products:', err);
    section.style.display = 'none';
  }
}
