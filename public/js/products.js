/**
 * ApexStore - products.js
 * Dedicated Product Catalog Listing:
 * URL Query State Sync, Multi-Filter Sidebar, Mobile Filter Drawer,
 * Dynamic Sort, Skeletons, Pagination, and Shared Product Cards.
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
// 1. Fetch & Render Catalog
// ==========================================================================
async function fetchCatalog() {
  const grid = document.getElementById('products-grid');
  const countText = document.getElementById('results-count-display');
  const paginationContainer = document.getElementById('pagination-container');
  const breadcrumbCategory = document.getElementById('breadcrumb-category-title');

  if (!grid) return;

  // Update Breadcrumb Text
  if (breadcrumbCategory) {
    if (currentCatalogState.category && currentCatalogState.category !== 'All') {
      breadcrumbCategory.textContent = currentCatalogState.category;
    } else if (currentCatalogState.search) {
      breadcrumbCategory.textContent = `Search: "${currentCatalogState.search}"`;
    } else {
      breadcrumbCategory.textContent = 'All Products';
    }
  }

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

    // Keep Category Strip Highlighted
    if (typeof highlightActiveCategoryStrip === 'function') {
      highlightActiveCategoryStrip();
    }
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

  grid.innerHTML = products.map(p => renderProductCard(p)).join('');

  // Attach card event listeners (Wishlist, Add to Cart)
  attachCardEvents(products, grid);
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

  const searchInput = document.getElementById('header-search-input');
  if (searchInput) searchInput.value = '';

  // Update browser URL
  window.history.replaceState({}, '', 'products.html');

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
    cb.checked = (cb.value.toLowerCase() === (category || '').toLowerCase());
  });

  fetchCatalog();
  scrollToCatalog();
};

// ==========================================================================
// 2. Filters Sidebar & Drawer Listeners
// ==========================================================================
function initFilterControls() {
  // Category Checkboxes
  const catCheckboxes = document.querySelectorAll('.filter-category-checkbox');
  catCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
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
  const sortParam = urlParams.get('sort');
  const minPriceParam = urlParams.get('minPrice');
  const maxPriceParam = urlParams.get('maxPrice');
  const minRatingParam = urlParams.get('minRating');
  const inStockParam = urlParams.get('inStock');

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

  if (sortParam) {
    currentCatalogState.sort = sortParam;
    const sortSelect = document.getElementById('catalog-sort-select');
    if (sortSelect) sortSelect.value = sortParam;
  }

  if (minPriceParam) {
    currentCatalogState.minPrice = minPriceParam;
    const minInput = document.getElementById('filter-min-price');
    if (minInput) minInput.value = minPriceParam;
  }

  if (maxPriceParam) {
    currentCatalogState.maxPrice = maxPriceParam;
    const maxInput = document.getElementById('filter-max-price');
    if (maxInput) maxInput.value = maxPriceParam;
  }

  if (minRatingParam) {
    currentCatalogState.minRating = minRatingParam;
    const ratingRadio = document.querySelector(`input[name="filter-rating"][value="${minRatingParam}"]`);
    if (ratingRadio) ratingRadio.checked = true;
  }

  if (inStockParam === 'true') {
    currentCatalogState.inStock = true;
    const inStockCheckbox = document.getElementById('filter-instock-only');
    if (inStockCheckbox) inStockCheckbox.checked = true;
  }

  initFilterControls();
  fetchCatalog();
});
