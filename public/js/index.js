/**
 * ApexStore - index.js
 * Catalog Home: Hero Carousel (auto 5s, arrows, dots, hover pause),
 * Top Deals Horizontal Scroll, Category Tiles, Filter Sidebar & Drawer,
 * Sort Dropdown, Product Cards with Wishlist & Hover Add-to-Cart, Pagination.
 */

// State Management
let currentCatalogState = {
  page: 1,
  limit: 12,
  category: 'All',
  search: '',
  sort: 'relevance',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  inStock: false,
  total: 0,
  pages: 1
};

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

  // Create dot buttons
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
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Auto-play every 5 seconds
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  startAuto();

  // Pause on hover
  if (section) {
    section.addEventListener('mouseenter', stopAuto);
    section.addEventListener('mouseleave', startAuto);
  }
}

// ==========================================================================
// 2. "Top Deals" Strip Loader
// ==========================================================================
async function loadTopDeals() {
  const dealsContainer = document.getElementById('top-deals-container');
  if (!dealsContainer) return;

  try {
    const res = await api('/api/products?limit=8&sort=newest');
    const products = res.products || [];

    // Filter products with good discount
    const discounted = products.filter(p => p.mrp > p.price);

    if (discounted.length === 0) {
      dealsContainer.parentElement.style.display = 'none';
      return;
    }

    dealsContainer.innerHTML = discounted.map(p => {
      const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return `
        <a href="product.html?id=${p._id}" class="deal-item-card" aria-label="${escapeHTML(p.name)}">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="deal-item-img" loading="lazy" />
          <div class="deal-item-brand">${escapeHTML(p.brand)}</div>
          <div class="deal-item-name">${escapeHTML(p.name)}</div>
          <div class="deal-item-offer">${discountPct}% OFF</div>
          <div class="deal-item-price">${formatPrice(p.price)}</div>
        </a>
      `;
    }).join('');
  } catch (err) {
    console.warn('Error loading top deals:', err);
  }
}

// ==========================================================================
// 3. Product Catalog Listing, Filters & Pagination
// ==========================================================================
async function fetchCatalog() {
  const grid = document.getElementById('products-grid');
  const countText = document.getElementById('results-count-display');
  const paginationContainer = document.getElementById('pagination-container');

  if (!grid) return;

  // Render skeleton loading cards
  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="product-card">
      <div class="skeleton-box" style="height: 190px; width: 100%; margin-bottom: 12px;"></div>
      <div class="skeleton-box" style="height: 12px; width: 40%; margin-bottom: 8px;"></div>
      <div class="skeleton-box" style="height: 16px; width: 85%; margin-bottom: 8px;"></div>
      <div class="skeleton-box" style="height: 14px; width: 50%; margin-bottom: 12px;"></div>
      <div class="skeleton-box" style="height: 22px; width: 60%;"></div>
    </div>
  `).join('');

  try {
    const params = new URLSearchParams();
    params.append('page', currentCatalogState.page);
    params.append('limit', currentCatalogState.limit);

    if (currentCatalogState.category && currentCatalogState.category !== 'All') {
      params.append('category', currentCatalogState.category);
    }
    if (currentCatalogState.search) {
      params.append('search', currentCatalogState.search);
    }
    if (currentCatalogState.sort) {
      params.append('sort', currentCatalogState.sort);
    }
    if (currentCatalogState.minPrice) {
      params.append('minPrice', currentCatalogState.minPrice);
    }
    if (currentCatalogState.maxPrice) {
      params.append('maxPrice', currentCatalogState.maxPrice);
    }
    if (currentCatalogState.minRating) {
      params.append('minRating', currentCatalogState.minRating);
    }
    if (currentCatalogState.inStock) {
      params.append('inStock', 'true');
    }

    const data = await api(`/api/products?${params.toString()}`);
    const products = data.products || [];
    currentCatalogState.total = data.total || 0;
    currentCatalogState.pages = data.pages || 1;

    // Update Result Count text
    if (countText) {
      const startItem = currentCatalogState.total === 0 ? 0 : (currentCatalogState.page - 1) * currentCatalogState.limit + 1;
      const endItem = Math.min(currentCatalogState.total, currentCatalogState.page * currentCatalogState.limit);
      countText.innerHTML = `Showing <strong>${startItem}–${endItem}</strong> of <strong>${currentCatalogState.total}</strong> products`;
    }

    renderProductCards(products);
    renderPagination(paginationContainer);
  } catch (error) {
    console.error('Failed to load catalog:', error);
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center;">
        <p style="color: var(--danger); font-size: 15px; font-weight: 600; margin-bottom: 12px;">
          Failed to load products: ${escapeHTML(error.message)}
        </p>
        <button class="btn-add-cart" style="max-width: 180px; margin: 0 auto;" onclick="fetchCatalog()">
          Retry Loading
        </button>
      </div>
    `;
  }
}

function renderProductCards(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center;">
        <div style="color: var(--text-muted); margin-bottom: 12px;">${Icons.search(48)}</div>
        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">No products found</h3>
        <p style="color: var(--text-muted); font-size: 13px; max-width: 360px; margin: 0 auto 16px auto;">
          Try adjusting or clearing your filters to discover matching items across our collections.
        </p>
        <button class="btn-buy-now" style="max-width: 160px; margin: 0 auto;" onclick="clearAllFilters()">
          Clear All Filters
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const isOutOfStock = p.stock <= 0;
    const isLowStock = p.stock > 0 && p.stock < 5;
    const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    const isWishlisted = Wishlist.has(p._id);

    return `
      <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-id="${p._id}">
        <!-- Wishlist Toggle -->
        <button 
          class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
          data-id="${p._id}" 
          aria-label="Save to Wishlist"
        >
          ${Icons.heart(18, isWishlisted)}
        </button>

        <!-- Product Image -->
        <a href="product.html?id=${p._id}" class="product-card-img-wrap" aria-label="View ${escapeHTML(p.name)}">
          <img 
            src="${escapeHTML(p.image)}" 
            alt="${escapeHTML(p.name)}" 
            class="product-card-img" 
            loading="lazy"
          />
        </a>

        <!-- Brand & Title -->
        <div class="product-brand">${escapeHTML(p.brand || 'ApexStore')}</div>
        <h3 class="product-title">
          <a href="product.html?id=${p._id}" title="${escapeHTML(p.name)}">${escapeHTML(p.name)}</a>
        </h3>

        <!-- Rating Pill -->
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span class="rating-pill">
            <span>${p.rating ? p.rating.toFixed(1) : '4.2'}</span>
            ${Icons.star(10, true)}
          </span>
          <span class="rating-count">(${p.reviewCount ? p.reviewCount.toLocaleString('en-IN') : '120'})</span>
        </div>

        <!-- Price Block -->
        <div class="product-price-block">
          <span class="price-selling">${formatPrice(p.price)}</span>
          ${p.mrp > p.price ? `<span class="price-mrp">${formatPrice(p.mrp)}</span>` : ''}
          ${discount > 0 ? `<span class="price-discount">${discount}% off</span>` : ''}
        </div>

        <!-- Badges -->
        ${p.freeDelivery ? `<div class="delivery-badge free">Free delivery</div>` : `<div class="delivery-badge">Standard Delivery</div>`}
        ${isLowStock ? `<div class="stock-warning-text">Only ${p.stock} left in stock!</div>` : ''}
        ${isOutOfStock ? `<div class="out-of-stock-label">Out of stock</div>` : ''}

        <!-- Add to Cart Button -->
        <div class="card-action-wrap">
          <button 
            class="card-add-cart-btn btn-add-card-action" 
            data-id="${p._id}"
            ${isOutOfStock ? 'disabled' : ''}
          >
            ${Icons.cart(15)}
            <span>${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach Event Handlers on Cards
  attachCardEvents(products);
}

function attachCardEvents(products) {
  // Wishlist heart buttons
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (id) {
        Wishlist.toggle(id);
      }
    });
  });

  // Add to cart buttons
  const addButtons = document.querySelectorAll('.btn-add-card-action');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prod = products.find(p => String(p._id) === id);
      if (prod) {
        Cart.addToCart(prod, 1);
      }
    });
  });
}

function renderPagination(container) {
  if (!container) return;

  const { page, pages } = currentCatalogState;
  if (pages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button class="page-btn" id="page-prev-btn" ${page <= 1 ? 'disabled' : ''}>
      ${Icons.chevronLeft(14)} Prev
    </button>
  `;

  for (let i = 1; i <= pages; i++) {
    html += `
      <button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn" id="page-next-btn" ${page >= pages ? 'disabled' : ''}>
      Next ${Icons.chevronRight(14)}
    </button>
  `;

  container.innerHTML = html;

  // Attach Pagination Clicks
  const prevBtn = container.querySelector('#page-prev-btn');
  const nextBtn = container.querySelector('#page-next-btn');
  const numButtons = container.querySelectorAll('.page-btn[data-page]');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentCatalogState.page > 1) {
        currentCatalogState.page -= 1;
        fetchCatalog();
        scrollToCatalog();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentCatalogState.page < currentCatalogState.pages) {
        currentCatalogState.page += 1;
        fetchCatalog();
        scrollToCatalog();
      }
    });
  }

  numButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.getAttribute('data-page'), 10);
      if (p !== currentCatalogState.page) {
        currentCatalogState.page = p;
        fetchCatalog();
        scrollToCatalog();
      }
    });
  });
}

function scrollToCatalog() {
  const target = document.getElementById('catalog-listing-section');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Clear all filters
function clearAllFilters() {
  currentCatalogState.category = 'All';
  currentCatalogState.search = '';
  currentCatalogState.minPrice = '';
  currentCatalogState.maxPrice = '';
  currentCatalogState.minRating = '';
  currentCatalogState.inStock = false;
  currentCatalogState.sort = 'relevance';
  currentCatalogState.page = 1;

  // Reset inputs
  const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
  catCheckboxes.forEach(cb => cb.checked = false);

  const minPriceInput = document.getElementById('filter-min-price');
  if (minPriceInput) minPriceInput.value = '';

  const maxPriceInput = document.getElementById('filter-max-price');
  if (maxPriceInput) maxPriceInput.value = '';

  const ratingRadios = document.querySelectorAll('input[name="filter-rating"]');
  ratingRadios.forEach(r => r.checked = false);

  const inStockCheckbox = document.getElementById('filter-instock-only');
  if (inStockCheckbox) inStockCheckbox.checked = false;

  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) sortSelect.value = 'relevance';

  fetchCatalog();
}

// Global Trigger used by header search bar
window.triggerCatalogFilter = function(searchQuery, category) {
  currentCatalogState.search = searchQuery || '';
  currentCatalogState.category = category || 'All';
  currentCatalogState.page = 1;

  // Sync category checkboxes
  const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
  catCheckboxes.forEach(cb => {
    cb.checked = (cb.value === category);
  });

  fetchCatalog();
  scrollToCatalog();
};

// ==========================================================================
// 4. Filters Sidebar & Drawer Listeners Initialization
// ==========================================================================
function initFilterControls() {
  // Category Checkboxes
  const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
  catCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      // Find selected category
      const checkedBoxes = Array.from(catCheckboxes).filter(c => c.checked);
      if (checkedBoxes.length === 1) {
        currentCatalogState.category = checkedBoxes[0].value;
      } else {
        currentCatalogState.category = 'All';
      }
      currentCatalogState.page = 1;
      fetchCatalog();
    });
  });

  // Price Apply
  const applyPriceBtn = document.getElementById('price-filter-apply-btn');
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      const minVal = document.getElementById('filter-min-price').value.trim();
      const maxVal = document.getElementById('filter-max-price').value.trim();
      currentCatalogState.minPrice = minVal;
      currentCatalogState.maxPrice = maxVal;
      currentCatalogState.page = 1;
      fetchCatalog();
    });
  }

  // Minimum Rating Radios
  const ratingRadios = document.querySelectorAll('input[name="filter-rating"]');
  ratingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentCatalogState.minRating = e.target.value;
      currentCatalogState.page = 1;
      fetchCatalog();
    });
  });

  // In-Stock Only
  const inStockCheckbox = document.getElementById('filter-instock-only');
  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', (e) => {
      currentCatalogState.inStock = e.target.checked;
      currentCatalogState.page = 1;
      fetchCatalog();
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentCatalogState.sort = e.target.value;
      currentCatalogState.page = 1;
      fetchCatalog();
    });
  }

  // Clear Filters
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllFilters);
  }

  // Mobile Filter Drawer Toggle
  const openDrawerBtn = document.getElementById('open-mobile-filters');
  const sidebar = document.getElementById('filters-sidebar');
  const closeDrawerBtn = document.getElementById('close-mobile-filters');

  if (openDrawerBtn && sidebar) {
    openDrawerBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (closeDrawerBtn && sidebar) {
    closeDrawerBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
}

// Initial Page Load
document.addEventListener('DOMContentLoaded', () => {
  // Read URL parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  const searchParam = urlParams.get('search');

  if (catParam) {
    currentCatalogState.category = catParam;
    const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
    catCheckboxes.forEach(cb => {
      if (cb.value.toLowerCase() === catParam.toLowerCase()) cb.checked = true;
    });
  }

  if (searchParam) {
    currentCatalogState.search = searchParam;
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) searchInput.value = searchParam;
  }

  initHeroCarousel();
  loadTopDeals();
  initFilterControls();
  fetchCatalog();
});
