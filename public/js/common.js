/**
 * ApexStore - common.js
 * Professional Marketplace Core: Inline SVG Library, Safe Storage,
 * Wishlist Manager, Cart Manager, Delivery Fee Logic, Live Autocomplete,
 * Toasts, and Global Header & Footer Renderers.
 */

// ==========================================================================
// 1. Inline SVG Icon Library (Lucide/Feather Style - Zero Emojis)
// ==========================================================================
const Icons = {
  cart: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  search: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  user: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  heart: (size = 18, filled = false) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  star: (size = 14, filled = true) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  truck: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  shield: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  rotateCcw: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  chevronLeft: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevronDown: (size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  check: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  eye: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  arrowUp: (size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  package: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  percent: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
  filter: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`
};

// ==========================================================================
// 2. Safe LocalStorage Wrapper
// ==========================================================================
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.warn(`Error reading "${key}":`, err);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving "${key}":`, err);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing "${key}":`, err);
    }
  }
};

// ==========================================================================
// 3. Wishlist Manager
// ==========================================================================
const WISHLIST_KEY = 'apex_wishlist';

const Wishlist = {
  getAll() {
    return storage.get(WISHLIST_KEY, []);
  },
  has(productId) {
    const list = this.getAll();
    return list.includes(String(productId));
  },
  toggle(productId) {
    let list = this.getAll();
    const idStr = String(productId);
    const index = list.indexOf(idStr);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
      showToast('Removed from your Wishlist', 'info');
    } else {
      list.push(idStr);
      added = true;
      showToast('Added to your Wishlist', 'success');
    }
    storage.set(WISHLIST_KEY, list);
    this.updateUI();
    return added;
  },
  updateUI() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    buttons.forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (id && this.has(id)) {
        btn.classList.add('active');
        btn.innerHTML = Icons.heart(18, true);
      } else if (id) {
        btn.classList.remove('active');
        btn.innerHTML = Icons.heart(18, false);
      }
    });
  }
};

// ==========================================================================
// 4. Authentication State Helper
// ==========================================================================
const AUTH_TOKEN_KEY = 'apex_auth_token';
const AUTH_USER_KEY = 'apex_auth_user';

const Auth = {
  getToken() {
    return storage.get(AUTH_TOKEN_KEY, null);
  },
  getUser() {
    return storage.get(AUTH_USER_KEY, null);
  },
  isLoggedIn() {
    return Boolean(this.getToken());
  },
  setAuth(token, user) {
    storage.set(AUTH_TOKEN_KEY, token);
    storage.set(AUTH_USER_KEY, user);
  },
  clearAuth() {
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(AUTH_USER_KEY);
  },
  logout() {
    this.clearAuth();
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  },
  requireAuth(nextUrl = null) {
    if (!this.isLoggedIn()) {
      const target = nextUrl || window.location.pathname.split('/').pop() || 'index.html';
      window.location.href = `login.html?next=${encodeURIComponent(target)}`;
      return false;
    }
    return true;
  }
};

// ==========================================================================
// 5. Cart & Saved For Later Manager
// ==========================================================================
const CART_KEY = 'apex_shopping_cart';
const SAVED_LATER_KEY = 'apex_saved_for_later';

const Cart = {
  getCart() {
    return storage.get(CART_KEY, []);
  },
  saveCart(cart) {
    storage.set(CART_KEY, cart);
    this.updateCartBadge();
  },
  getSavedForLater() {
    return storage.get(SAVED_LATER_KEY, []);
  },
  saveSavedForLater(list) {
    storage.set(SAVED_LATER_KEY, list);
  },
  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const productId = String(product._id || product.id);
    const existingIndex = cart.findIndex(item => String(item._id) === productId);

    const availableStock = product.stock !== undefined ? product.stock : 999;
    const addedQty = Math.max(1, parseInt(qty, 10) || 1);

    if (availableStock <= 0) {
      showToast('This product is currently out of stock', 'error');
      return false;
    }

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].qty;
      const targetQty = currentQty + addedQty;
      if (targetQty > availableStock) {
        showToast(`Only ${availableStock} unit(s) available in stock`, 'error');
        cart[existingIndex].qty = availableStock;
      } else {
        cart[existingIndex].qty = targetQty;
      }
    } else {
      if (addedQty > availableStock) {
        showToast(`Only ${availableStock} unit(s) available in stock`, 'error');
        return false;
      }
      cart.push({
        _id: productId,
        brand: product.brand || '',
        name: product.name,
        price: product.price,
        mrp: product.mrp || product.price,
        image: product.image || (product.images && product.images[0]) || '',
        category: product.category,
        stock: product.stock,
        freeDelivery: Boolean(product.freeDelivery),
        qty: addedQty
      });
    }

    this.saveCart(cart);
    showToast(`Added to cart: ${product.name.substring(0, 28)}...`, 'success');
    return true;
  },
  setQty(productId, qty) {
    const cart = this.getCart();
    const idStr = String(productId);
    const item = cart.find(i => String(i._id) === idStr);
    if (!item) return;

    const parsedQty = parseInt(qty, 10);
    if (parsedQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    if (item.stock !== undefined && parsedQty > item.stock) {
      showToast(`Only ${item.stock} unit(s) available in stock`, 'error');
      item.qty = item.stock;
    } else {
      item.qty = parsedQty;
    }

    this.saveCart(cart);
  },
  removeFromCart(productId) {
    let cart = this.getCart();
    const idStr = String(productId);
    cart = cart.filter(item => String(item._id) !== idStr);
    this.saveCart(cart);
    showToast('Item removed from cart', 'info');
  },
  saveForLater(productId) {
    const cart = this.getCart();
    const idStr = String(productId);
    const item = cart.find(i => String(i._id) === idStr);
    if (!item) return;

    // Remove from cart
    this.removeFromCart(productId);

    // Add to saved for later
    const saved = this.getSavedForLater();
    if (!saved.some(i => String(i._id) === idStr)) {
      saved.push(item);
      this.saveSavedForLater(saved);
      showToast('Item moved to Saved For Later', 'info');
    }
  },
  moveToCart(productId) {
    let saved = this.getSavedForLater();
    const idStr = String(productId);
    const item = saved.find(i => String(i._id) === idStr);
    if (!item) return;

    saved = saved.filter(i => String(i._id) !== idStr);
    this.saveSavedForLater(saved);

    this.addToCart(item, item.qty || 1);
  },
  removeSavedForLater(productId) {
    let saved = this.getSavedForLater();
    const idStr = String(productId);
    saved = saved.filter(i => String(i._id) !== idStr);
    this.saveSavedForLater(saved);
    showToast('Item removed from Saved For Later', 'info');
  },
  clearCart() {
    storage.remove(CART_KEY);
    this.updateCartBadge();
  },
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.qty || 0), 0);
  },
  getCartPriceDetails() {
    const cart = this.getCart();
    const totalItems = this.getCartCount();

    const totalMrp = cart.reduce((acc, item) => {
      const mrp = Number(item.mrp) || Number(item.price);
      return acc + (mrp * item.qty);
    }, 0);

    const subtotal = cart.reduce((acc, item) => {
      return acc + (Number(item.price) * item.qty);
    }, 0);

    const discountAmount = Math.max(0, totalMrp - subtotal);
    // Free delivery on orders above Rs 499, else Rs 40
    const deliveryCharges = (subtotal === 0 || subtotal >= 499) ? 0 : 40;
    const grandTotal = subtotal + deliveryCharges;
    const totalSavings = discountAmount + (deliveryCharges === 0 && subtotal > 0 ? 40 : 0);

    return {
      totalItems,
      totalMrp,
      subtotal,
      discountAmount,
      deliveryCharges,
      grandTotal,
      totalSavings
    };
  },
  updateCartBadge() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('.header-cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }
};

// ==========================================================================
// 6. API Client Helper
// ==========================================================================
async function api(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `/api/${endpoint}`;
  const headers = { ...options.headers };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  const token = Auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    let data = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (data && (data.error || data.message)) || `Server returned status ${response.status}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

// ==========================================================================
// 7. Utility Formatters (Price, XSS Sanitizer, Toast)
// ==========================================================================
function formatPrice(amount) {
  const num = Math.round(Number(amount) || 0);
  return '₹' + num.toLocaleString('en-IN');
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = Icons.shield(18);
  if (type === 'success') iconSvg = Icons.check(18);
  if (type === 'error') iconSvg = Icons.x(18);

  toast.innerHTML = `
    <span style="display: flex; align-items: center;">${iconSvg}</span>
    <span style="flex: 1;">${escapeHTML(message)}</span>
    <button class="toast-close" style="color: #a0a0a0; padding: 2px;" aria-label="Close">${Icons.x(14)}</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }
  }, 3200);
}

// ==========================================================================
// 8. Global Header, Navbar & Footer Renderers
// ==========================================================================
function renderGlobalHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();
  const cartCount = Cart.getCartCount();

  header.innerHTML = `
    <!-- Top Utility Bar -->
    <div class="top-utility-bar">
      <div class="container top-utility-content">
        <div class="top-utility-perks">
          <span class="top-utility-item">${Icons.truck(13)} Free delivery on orders above ₹499</span>
          <span class="top-utility-item">${Icons.shield(13)} Cash on Delivery Available</span>
          <span class="top-utility-item">${Icons.rotateCcw(13)} 7-Day Easy Returns</span>
        </div>
        <div class="top-utility-links">
          <span>24x7 Customer Support: support@apexstore.com</span>
        </div>
      </div>
    </div>

    <!-- Main Sticky Navbar -->
    <div class="container">
      <nav class="navbar" aria-label="Primary Navigation">
        <!-- Logo -->
        <a href="index.html" class="brand-logo" aria-label="ApexStore Home">
          <span class="brand-title">ApexStore</span>
          <span class="brand-sub">Explore <em>Plus</em></span>
        </a>

        <!-- Search with Category Dropdown & Autocomplete -->
        <div class="header-search-wrap">
          <form class="search-form" id="header-search-form" role="search" onsubmit="return false;">
            <select class="search-category-select" id="header-category-select" aria-label="Select Category">
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Kitchen</option>
              <option value="Sports">Sports & Fitness</option>
            </select>
            <input 
              type="text" 
              class="search-input" 
              id="header-search-input" 
              placeholder="Search for products, brands and more..." 
              autocomplete="off"
              aria-label="Search Catalog"
            />
            <button type="submit" class="search-btn" id="header-search-submit" aria-label="Submit Search">
              ${Icons.search(18)}
            </button>
          </form>

          <!-- Autocomplete Dropdown -->
          <div class="search-suggestions-dropdown" id="search-suggestions-box"></div>
        </div>

        <!-- Right Header Actions -->
        <div class="header-actions">
          <!-- Account Menu -->
          <div class="account-menu-wrap">
            ${isLoggedIn ? `
              <button class="header-user-btn" aria-haspopup="true">
                ${Icons.user(16)}
                <span>${escapeHTML((user && user.name) ? user.name.split(' ')[0] : 'My Account')}</span>
                ${Icons.chevronDown(12)}
              </button>
              <div class="account-dropdown-panel">
                <a href="orders.html" class="account-dropdown-item">
                  ${Icons.package(16)}
                  <span>My Orders</span>
                </a>
                <button id="logout-menu-btn" class="account-dropdown-item" style="width: 100%; border: none; text-align: left; background: none; cursor: pointer;">
                  ${Icons.user(16)}
                  <span>Logout</span>
                </button>
              </div>
            ` : `
              <a href="login.html" class="header-account-btn">
                <span>Login</span>
              </a>
              <div class="account-dropdown-panel">
                <a href="login.html" class="account-dropdown-item">
                  <span>Sign In</span>
                </a>
                <a href="register.html" class="account-dropdown-item">
                  <span>New Customer? Sign Up</span>
                </a>
                <a href="orders.html" class="account-dropdown-item">
                  ${Icons.package(16)}
                  <span>My Orders</span>
                </a>
              </div>
            `}
          </div>

          <!-- Cart Button -->
          <a href="cart.html" class="header-cart-btn" aria-label="Shopping Cart">
            ${Icons.cart(19)}
            <span>Cart</span>
            <span class="header-cart-badge" style="display: ${cartCount > 0 ? 'inline-flex' : 'none'};">${cartCount}</span>
          </a>
        </div>
      </nav>
    </div>

    <!-- Category Strip -->
    <div class="category-strip">
      <div class="container category-strip-inner" id="category-strip-links">
        <a href="index.html" class="category-strip-item" data-category="All">All Categories</a>
        <a href="index.html?category=Electronics" class="category-strip-item" data-category="Electronics">Electronics</a>
        <a href="index.html?category=Fashion" class="category-strip-item" data-category="Fashion">Fashion</a>
        <a href="index.html?category=Home" class="category-strip-item" data-category="Home">Home & Kitchen</a>
        <a href="index.html?category=Sports" class="category-strip-item" data-category="Sports">Sports & Fitness</a>
      </div>
    </div>
  `;

  // Attach Header Events
  initHeaderSearch();

  const logoutBtn = header.querySelector('#logout-menu-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => Auth.logout());
  }
}

// Live Autocomplete Suggestions
function initHeaderSearch() {
  const searchInput = document.getElementById('header-search-input');
  const categorySelect = document.getElementById('header-category-select');
  const suggestionsBox = document.getElementById('search-suggestions-box');
  const searchForm = document.getElementById('header-search-form');

  if (!searchInput || !suggestionsBox) return;

  let debounceTimer = null;

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();
    if (query.length < 2) {
      suggestionsBox.style.display = 'none';
      suggestionsBox.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const cat = categorySelect ? categorySelect.value : 'All';
        const params = new URLSearchParams({ search: query, limit: 5 });
        if (cat && cat !== 'All') params.append('category', cat);

        const res = await api(`/api/products?${params.toString()}`);
        const products = res.products || [];

        if (products.length === 0) {
          suggestionsBox.innerHTML = `
            <div style="padding: 12px 16px; font-size: 12px; color: var(--text-muted);">
              No products found for "${escapeHTML(query)}"
            </div>
          `;
          suggestionsBox.style.display = 'block';
          return;
        }

        suggestionsBox.innerHTML = products.map(p => `
          <div class="suggestion-item" data-id="${p._id}">
            <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" class="suggestion-thumb" />
            <div class="suggestion-info">
              <div class="suggestion-title">${escapeHTML(p.brand)} ${escapeHTML(p.name)}</div>
              <div class="suggestion-price">${formatPrice(p.price)}</div>
            </div>
          </div>
        `).join('');

        suggestionsBox.style.display = 'block';

        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            window.location.href = `product.html?id=${id}`;
          });
        });
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 250);
  });

  // Submit search query to index.html listing
  const executeSearch = () => {
    const q = searchInput.value.trim();
    const cat = categorySelect ? categorySelect.value : 'All';
    const params = new URLSearchParams();
    if (q) params.append('search', q);
    if (cat && cat !== 'All') params.append('category', cat);

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
      if (typeof window.triggerCatalogFilter === 'function') {
        window.triggerCatalogFilter(q, cat);
        suggestionsBox.style.display = 'none';
        return;
      }
    }
    window.location.href = `index.html?${params.toString()}`;
  };

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch();
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-wrap')) {
      suggestionsBox.style.display = 'none';
    }
  });
}

function renderGlobalFooter() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;

  footer.innerHTML = `
    <!-- Guarantee Badges Strip -->
    <div class="footer-top-strip">
      <div class="container footer-guarantees-grid">
        <div class="footer-guarantee-item">
          ${Icons.shield(24)}
          <div>
            <strong style="color: white; display: block; font-size: 13px;">100% Authentic Products</strong>
            <span>Directly sourced from verified brands</span>
          </div>
        </div>
        <div class="footer-guarantee-item">
          ${Icons.rotateCcw(24)}
          <div>
            <strong style="color: white; display: block; font-size: 13px;">7-Day Easy Returns</strong>
            <span>Hassle-free pickups & instant refund</span>
          </div>
        </div>
        <div class="footer-guarantee-item">
          ${Icons.truck(24)}
          <div>
            <strong style="color: white; display: block; font-size: 13px;">Express Free Delivery</strong>
            <span>On all eligible prepaid & COD orders</span>
          </div>
        </div>
        <div class="footer-guarantee-item">
          ${Icons.percent(24)}
          <div>
            <strong style="color: white; display: block; font-size: 13px;">Best Online Deals</strong>
            <span>Guaranteed low prices everyday</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Directory Links -->
    <div class="container">
      <div class="footer-links-grid">
        <div>
          <h4 class="footer-col-title">About ApexStore</h4>
          <p style="color: #9aa8bd; line-height: 1.6; margin-bottom: 12px;">
            ApexStore is India's premier online marketplace destination for genuine electronics, high-street fashion, home living essentials, and athletic fitness gear with transparent pricing and Cash on Delivery.
          </p>
          <div style="font-size: 11px; color: #878787;">
            Registered Office: ApexStore Retail Pvt Ltd, Embassy TechVillage, Outer Ring Road, Bengaluru, Karnataka, 560103.
          </div>
        </div>
        <div>
          <h4 class="footer-col-title">Customer Care</h4>
          <ul class="footer-links-list">
            <li><a href="orders.html">Track Orders</a></li>
            <li><a href="cart.html">View Cart</a></li>
            <li><a href="index.html">Product Catalog</a></li>
            <li><a href="login.html">My Account</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Categories</h4>
          <ul class="footer-links-list">
            <li><a href="index.html?category=Electronics">Electronics & Audio</a></li>
            <li><a href="index.html?category=Fashion">Fashion & Apparel</a></li>
            <li><a href="index.html?category=Home">Home & Kitchenware</a></li>
            <li><a href="index.html?category=Sports">Sports & Fitness</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Safe & Secure Payments</h4>
          <p style="color: #9aa8bd; line-height: 1.5; margin-bottom: 10px;">
            We support Cash on Delivery, all major RuPay, Visa, Mastercard credit/debit cards, Net Banking, and UPI gateways with 256-bit SSL encryption.
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span style="background: #28354a; color: white; padding: 4px 8px; border-radius: 2px; font-weight: 700; font-size: 10px;">CASH ON DELIVERY</span>
            <span style="background: #28354a; color: white; padding: 4px 8px; border-radius: 2px; font-weight: 700; font-size: 10px;">100% SECURE</span>
            <span style="background: #28354a; color: white; padding: 4px 8px; border-radius: 2px; font-weight: 700; font-size: 10px;">SSL ENCRYPTED</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar with Back to Top -->
      <div class="footer-bottom-bar">
        <span>&copy; ${new Date().getFullYear()} ApexStore. All rights reserved. Built with Node.js, Express, MongoDB & Vanilla JavaScript.</span>
        <button class="back-to-top-btn" id="back-to-top-button">
          ${Icons.arrowUp(14)}
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  `;

  const topBtn = footer.querySelector('#back-to-top-button');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Global DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderGlobalHeader();
  renderGlobalFooter();
  Cart.updateCartBadge();
  Wishlist.updateUI();
});
