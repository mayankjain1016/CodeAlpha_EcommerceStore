/**
 * ApexStore - product.js
 * Product Detail Controller:
 * Gallery with thumbnails & hover zoom, Price breakdown, Highlights list,
 * Pincode delivery estimator, Quantity stepper, Add to Cart & Buy Now,
 * Tabbed Description/Specs/Reviews, and Related Products carousel.
 */

let activeProduct = null;
let currentQuantity = 1;

async function loadProduct() {
  const container = document.getElementById('product-detail-view');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    container.innerHTML = `
      <div style="background: white; padding: 48px; border-radius: 4px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">No Product Specified</h2>
        <p style="color: var(--text-muted); margin-bottom: 16px;">Please choose a product from our catalog.</p>
        <a href="index.html" class="btn-buy-now" style="display: inline-block; max-width: 180px;">Go to Catalog</a>
      </div>
    `;
    return;
  }

  // Loading skeleton
  container.innerHTML = `
    <div style="background: white; padding: 24px; border-radius: 4px; display: grid; grid-template-columns: 460px 1fr; gap: 24px;">
      <div class="skeleton-box" style="height: 420px; width: 100%;"></div>
      <div>
        <div class="skeleton-box" style="height: 20px; width: 30%; margin-bottom: 12px;"></div>
        <div class="skeleton-box" style="height: 32px; width: 80%; margin-bottom: 16px;"></div>
        <div class="skeleton-box" style="height: 24px; width: 25%; margin-bottom: 24px;"></div>
        <div class="skeleton-box" style="height: 80px; width: 60%; margin-bottom: 24px;"></div>
        <div class="skeleton-box" style="height: 120px; width: 100%;"></div>
      </div>
    </div>
  `;

  try {
    const product = await api(`/api/products/${encodeURIComponent(productId)}`);
    activeProduct = product;
    document.title = `${product.name} | ApexStore`;
    renderProductPage(product);
  } catch (err) {
    console.error('Failed to load product:', err);
    container.innerHTML = `
      <div style="background: white; padding: 48px; border-radius: 4px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: 700; color: var(--danger); margin-bottom: 8px;">Product Not Found</h2>
        <p style="color: var(--text-muted); margin-bottom: 16px;">${escapeHTML(err.message)}</p>
        <a href="index.html" class="btn-add-cart" style="display: inline-block; max-width: 180px;">Back to Catalog</a>
      </div>
    `;
  }
}

function renderProductPage(product) {
  const container = document.getElementById('product-detail-view');
  if (!container) return;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const isWishlisted = Wishlist.has(product._id);

  container.innerHTML = `
    <!-- Breadcrumbs -->
    <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
      <a href="index.html">Home</a> &gt;
      <a href="index.html?category=${encodeURIComponent(product.category)}">${escapeHTML(product.category)}</a> &gt;
      <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(product.brand)}</span>
    </nav>

    <!-- Main Detail Layout -->
    <div class="detail-main-layout">
      <!-- Left: Gallery & Action Buttons -->
      <div class="gallery-section">
        <div class="gallery-container">
          <!-- Thumbnails -->
          <div class="gallery-thumbs" id="gallery-thumbs-list">
            ${images.map((img, idx) => `
              <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Thumbnail ${idx + 1}">
                <img src="${escapeHTML(img)}" alt="${escapeHTML(product.name)}" />
              </button>
            `).join('')}
          </div>

          <!-- Main Zoom Preview -->
          <div class="gallery-preview-wrap" id="gallery-preview-wrap">
            <img src="${escapeHTML(images[0])}" alt="${escapeHTML(product.name)}" class="gallery-preview-img" id="main-preview-img" />
          </div>
        </div>

        <!-- Action Buttons (Desktop) -->
        <div class="detail-actions-row">
          <button class="btn-add-cart" id="detail-add-cart-btn" ${isOutOfStock ? 'disabled' : ''}>
            ${Icons.cart(18)}
            <span>${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          <button class="btn-buy-now" id="detail-buy-now-btn" ${isOutOfStock ? 'disabled' : ''}>
            ${Icons.truck(18)}
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      <!-- Right: Product Info & Buy Options -->
      <div class="detail-info-section">
        <div class="detail-brand">${escapeHTML(product.brand)}</div>
        <h1 class="detail-title">${escapeHTML(product.name)}</h1>

        <!-- Rating Pill -->
        <div class="detail-rating-row">
          <span class="rating-pill" style="font-size: 13px; padding: 4px 8px;">
            <span>${product.rating ? product.rating.toFixed(1) : '4.2'}</span>
            ${Icons.star(12, true)}
          </span>
          <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">
            ${product.reviewCount ? product.reviewCount.toLocaleString('en-IN') : '120'} Ratings & Reviews
          </span>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" id="detail-wishlist-toggle" data-id="${product._id}" style="position: static; margin-left: auto;" aria-label="Wishlist">
            ${Icons.heart(18, isWishlisted)}
          </button>
        </div>

        <!-- Price Block -->
        <div class="detail-price-box">
          <div style="display: flex; align-items: baseline;">
            <span class="detail-price-selling">${formatPrice(product.price)}</span>
            ${product.mrp > product.price ? `
              <span class="detail-price-mrp">${formatPrice(product.mrp)}</span>
              <span class="detail-price-discount">${discount}% off</span>
            ` : ''}
          </div>
          <div class="tax-text">Inclusive of all taxes</div>
          ${isLowStock ? `<div class="stock-warning-text" style="font-size: 13px; margin-top: 6px;">Hurry, only ${product.stock} units left in stock!</div>` : ''}
        </div>

        <!-- Highlights -->
        <div class="highlights-box">
          <h3 class="highlights-title">Product Highlights</h3>
          <ul class="highlights-list">
            ${(product.highlights && product.highlights.length > 0) ? product.highlights.map(h => `
              <li class="highlights-item">
                ${Icons.check(14)}
                <span>${escapeHTML(h)}</span>
              </li>
            `).join('') : `
              <li class="highlights-item">${Icons.check(14)} 100% Genuine and authentic product</li>
              <li class="highlights-item">${Icons.check(14)} 7-day replacement guarantee</li>
            `}
          </ul>
        </div>

        <!-- Pincode Delivery Checker -->
        <div class="pincode-checker-box">
          <div style="font-size: 13px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
            ${Icons.truck(16)}
            <span>Check Delivery Availability & Estimated Date</span>
          </div>
          <div class="pincode-input-row">
            <input type="text" id="pincode-input" class="pincode-input" placeholder="Enter 6-digit Pincode" maxlength="6" />
            <button class="pincode-check-btn" id="pincode-check-btn">Check</button>
          </div>
          <div id="pincode-result-msg" class="pincode-result"></div>
        </div>

        <!-- Quantity Picker -->
        ${!isOutOfStock ? `
          <div class="qty-stepper-wrap">
            <span style="font-size: 13px; font-weight: 700; color: var(--text-main);">Quantity:</span>
            <button class="stepper-btn" id="qty-dec-btn" aria-label="Decrease quantity">-</button>
            <span class="stepper-val" id="qty-val-display">1</span>
            <button class="stepper-btn" id="qty-inc-btn" aria-label="Increase quantity">+</button>
            <span style="font-size: 12px; color: var(--text-muted);">(Stock: ${product.stock})</span>
          </div>
        ` : ''}

        <!-- Service Badges Row -->
        <div style="display: flex; gap: 18px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-light); font-size: 12px; color: var(--text-secondary);">
          <div style="display: flex; align-items: center; gap: 6px;">
            ${Icons.shield(15)}
            <span>Secure Transaction</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${Icons.rotateCcw(15)}
            <span>7 Days Returnable</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${Icons.truck(15)}
            <span>ApexStore Delivered</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Section: Description, Specifications, Reviews -->
    <section class="detail-tabs-section" aria-label="Product Information Tabs">
      <div class="tabs-nav" role="tablist">
        <button class="tab-nav-btn active" data-tab="tab-desc" role="tab">Description</button>
        <button class="tab-nav-btn" data-tab="tab-specs" role="tab">Specifications</button>
        <button class="tab-nav-btn" data-tab="tab-reviews" role="tab">Ratings & Reviews</button>
      </div>

      <!-- Description Tab -->
      <div class="tab-content-pane active" id="tab-desc" role="tabpanel">
        <p style="font-size: 14px; line-height: 1.8; color: var(--text-main); margin-bottom: 12px;">
          ${escapeHTML(product.description)}
        </p>
      </div>

      <!-- Specifications Tab -->
      <div class="tab-content-pane" id="tab-specs" role="tabpanel">
        <table class="specs-table">
          <tbody>
            <tr>
              <th>Brand</th>
              <td>${escapeHTML(product.brand)}</td>
            </tr>
            <tr>
              <th>Model Name</th>
              <td>${escapeHTML(product.name)}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>${escapeHTML(product.category)}</td>
            </tr>
            ${product.specifications ? Object.entries(product.specifications).map(([k, v]) => `
              <tr>
                <th>${escapeHTML(k)}</th>
                <td>${escapeHTML(String(v))}</td>
              </tr>
            `).join('') : ''}
          </tbody>
        </table>
      </div>

      <!-- Reviews Summary Tab -->
      <div class="tab-content-pane" id="tab-reviews" role="tabpanel">
        <div class="reviews-breakdown">
          <div class="rating-overall-score">
            <div class="rating-huge-number">${product.rating ? product.rating.toFixed(1) : '4.2'}</div>
            <div style="color: var(--star-color); margin: 6px 0;">
              ${Array(5).fill(0).map((_, i) => Icons.star(16, i < Math.round(product.rating || 4))).join('')}
            </div>
            <div style="font-size: 12px; color: var(--text-muted);">
              Based on ${product.reviewCount ? product.reviewCount.toLocaleString('en-IN') : '120'} verified buyer reviews
            </div>
          </div>

          <!-- Progress Bars -->
          <div>
            <div class="rating-bar-row">
              <span>5★</span>
              <div class="rating-progress-bg"><div class="rating-progress-fill" style="width: 72%;"></div></div>
              <span>72%</span>
            </div>
            <div class="rating-bar-row">
              <span>4★</span>
              <div class="rating-progress-bg"><div class="rating-progress-fill" style="width: 18%;"></div></div>
              <span>18%</span>
            </div>
            <div class="rating-bar-row">
              <span>3★</span>
              <div class="rating-progress-bg"><div class="rating-progress-fill" style="width: 6%;"></div></div>
              <span>6%</span>
            </div>
            <div class="rating-bar-row">
              <span>2★</span>
              <div class="rating-progress-bg"><div class="rating-progress-fill" style="width: 3%;"></div></div>
              <span>3%</span>
            </div>
            <div class="rating-bar-row">
              <span>1★</span>
              <div class="rating-progress-bg"><div class="rating-progress-fill" style="width: 1%;"></div></div>
              <span>1%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Products Strip -->
    ${(product.relatedProducts && product.relatedProducts.length > 0) ? `
      <section class="deals-section" style="margin-top: 24px;">
        <div class="deals-header">
          <div class="deals-title">Similar Products You May Like</div>
        </div>
        <div class="deals-scroll-row">
          ${product.relatedProducts.map(rp => `
            <a href="product.html?id=${rp._id}" class="deal-item-card" aria-label="${escapeHTML(rp.name)}">
              <img src="${escapeHTML(rp.image)}" alt="${escapeHTML(rp.name)}" class="deal-item-img" loading="lazy" />
              <div class="deal-item-brand">${escapeHTML(rp.brand)}</div>
              <div class="deal-item-name">${escapeHTML(rp.name)}</div>
              <div class="deal-item-price">${formatPrice(rp.price)}</div>
            </a>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Mobile Sticky Bottom Bar -->
    <div class="mobile-sticky-bottom-bar">
      <button class="btn-add-cart" id="mobile-add-cart-btn" style="padding: 10px;" ${isOutOfStock ? 'disabled' : ''}>
        ${Icons.cart(16)}
        <span>${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
      </button>
      <button class="btn-buy-now" id="mobile-buy-now-btn" style="padding: 10px;" ${isOutOfStock ? 'disabled' : ''}>
        <span>Buy Now</span>
      </button>
    </div>
  `;

  attachDetailEventListeners(product, images);
}

function attachDetailEventListeners(product, images) {
  // Gallery thumbnails switch
  const thumbButtons = document.querySelectorAll('.thumb-btn');
  const mainPreviewImg = document.getElementById('main-preview-img');

  thumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (mainPreviewImg && images[idx]) {
        mainPreviewImg.src = images[idx];
      }
    });
  });

  // Wishlist toggle
  const wishlistBtn = document.getElementById('detail-wishlist-toggle');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      const added = Wishlist.toggle(product._id);
      wishlistBtn.classList.toggle('active', added);
      wishlistBtn.innerHTML = Icons.heart(18, added);
    });
  }

  // Quantity Stepper
  const decBtn = document.getElementById('qty-dec-btn');
  const incBtn = document.getElementById('qty-inc-btn');
  const valDisplay = document.getElementById('qty-val-display');

  if (decBtn && incBtn && valDisplay) {
    decBtn.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity -= 1;
        valDisplay.textContent = currentQuantity;
      }
    });

    incBtn.addEventListener('click', () => {
      if (currentQuantity < product.stock) {
        currentQuantity += 1;
        valDisplay.textContent = currentQuantity;
      } else {
        showToast(`Maximum stock limit is ${product.stock}`, 'error');
      }
    });
  }

  // Add to Cart
  const addCartHandler = () => {
    Cart.addToCart(product, currentQuantity);
  };

  const desktopAddBtn = document.getElementById('detail-add-cart-btn');
  const mobileAddBtn = document.getElementById('mobile-add-cart-btn');
  if (desktopAddBtn) desktopAddBtn.addEventListener('click', addCartHandler);
  if (mobileAddBtn) mobileAddBtn.addEventListener('click', addCartHandler);

  // Buy Now -> Adds to cart and redirects straight to checkout
  const buyNowHandler = () => {
    const success = Cart.addToCart(product, currentQuantity);
    if (success) {
      window.location.href = 'checkout.html';
    }
  };

  const desktopBuyBtn = document.getElementById('detail-buy-now-btn');
  const mobileBuyBtn = document.getElementById('mobile-buy-now-btn');
  if (desktopBuyBtn) desktopBuyBtn.addEventListener('click', buyNowHandler);
  if (mobileBuyBtn) mobileBuyBtn.addEventListener('click', buyNowHandler);

  // Pincode Delivery Checker
  const pincodeBtn = document.getElementById('pincode-check-btn');
  const pincodeInput = document.getElementById('pincode-input');
  const pincodeMsg = document.getElementById('pincode-result-msg');

  if (pincodeBtn && pincodeInput && pincodeMsg) {
    pincodeBtn.addEventListener('click', () => {
      const pin = pincodeInput.value.trim();
      if (!/^\d{6}$/.test(pin)) {
        pincodeMsg.className = 'pincode-result';
        pincodeMsg.style.color = 'var(--danger)';
        pincodeMsg.textContent = 'Please enter a valid 6-digit postal pincode.';
        return;
      }

      // Calculate delivery in 3 days
      const d = new Date();
      d.setDate(d.getDate() + 3);
      const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

      pincodeMsg.className = 'pincode-result available';
      pincodeMsg.innerHTML = `✓ Delivery by <strong>${dateStr}</strong> | <span style="color: var(--success); font-weight:700;">FREE</span> &bull; Cash on Delivery available`;
    });
  }

  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-nav-btn');
  const tabPanes = document.querySelectorAll('.tab-content-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
});
