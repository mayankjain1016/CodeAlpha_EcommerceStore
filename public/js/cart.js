/**
 * ApexStore - cart.js
 * Shopping Cart View:
 * Two-column layout, item quantity controls, Save for Later section,
 * Sticky Price Details card with delivery threshold (Free above Rs 499, else Rs 40),
 * Savings banner, and Empty Cart State.
 */

const cartContainer = document.getElementById('cart-page-content');

function renderCartPage() {
  if (!cartContainer) return;

  const cart = Cart.getCart();
  const savedForLater = Cart.getSavedForLater();

  if (cart.length === 0 && savedForLater.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">
          ${Icons.cart(72)}
        </div>
        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
          Your Cart is Empty!
        </h2>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">
          Explore our top brands, hot deals, and popular categories to add items.
        </p>
        <a href="index.html" class="btn-buy-now" style="display: inline-block; max-width: 180px; text-decoration: none;">
          Shop Now
        </a>
      </div>
    `;
    return;
  }

  const priceDetails = Cart.getCartPriceDetails();

  cartContainer.innerHTML = `
    <div class="cart-grid-layout">
      <!-- Left Column: Active Cart Items + Saved For Later -->
      <div>
        <div class="cart-items-panel">
          <div class="cart-items-header">
            <span>My Cart (${priceDetails.totalItems})</span>
            <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">
              Deliver to: <strong>Standard Address</strong>
            </span>
          </div>

          <!-- Items List -->
          <div id="cart-active-items-list">
            ${cart.length === 0 ? `
              <div style="padding: 24px; text-align: center; color: var(--text-muted);">
                Your active cart has no items. You have items saved for later below.
              </div>
            ` : cart.map(item => {
              const mrp = Number(item.mrp) || Number(item.price);
              const discount = mrp > item.price ? Math.round(((mrp - item.price) / mrp) * 100) : 0;

              return `
                <div class="cart-item-card" data-id="${item._id}">
                  <div class="cart-thumb-box">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" />
                  </div>

                  <div class="cart-item-body">
                    <div class="cart-item-brand">${escapeHTML(item.brand || 'ApexStore')}</div>
                    <a href="product.html?id=${item._id}" class="cart-item-title">${escapeHTML(item.name)}</a>

                    <div class="cart-item-pricing">
                      <span style="font-size: 16px; font-weight: 700; color: var(--text-main);">${formatPrice(item.price)}</span>
                      ${mrp > item.price ? `<span style="font-size: 12px; color: var(--text-muted); text-decoration: line-through;">${formatPrice(mrp)}</span>` : ''}
                      ${discount > 0 ? `<span style="font-size: 12px; font-weight: 700; color: var(--success);">${discount}% Off</span>` : ''}
                    </div>

                    <!-- Quantity Stepper & Removal Links -->
                    <div style="display: flex; align-items: center; gap: 18px; margin-top: 10px; flex-wrap: wrap;">
                      <div class="qty-stepper-wrap" style="margin-bottom: 0;">
                        <button class="stepper-btn cart-dec-btn" data-id="${item._id}" aria-label="Decrease quantity">-</button>
                        <span class="stepper-val">${item.qty}</span>
                        <button class="stepper-btn cart-inc-btn" data-id="${item._id}" aria-label="Increase quantity" ${item.stock && item.qty >= item.stock ? 'disabled' : ''}>+</button>
                      </div>

                      <div class="cart-action-links">
                        <span class="cart-action-link save-later-btn" data-id="${item._id}">Save for later</span>
                        <span class="cart-action-link remove cart-remove-btn" data-id="${item._id}">Remove</span>
                      </div>
                    </div>
                  </div>

                  <div style="font-size: 12px; color: var(--text-secondary); text-align: right; min-width: 110px;">
                    <div>Delivery in <strong>3-4 Days</strong></div>
                    <div style="color: ${item.freeDelivery ? 'var(--success)' : 'var(--text-muted)'}; font-weight: 600;">
                      ${item.freeDelivery ? 'Free Delivery' : 'Standard Delivery'}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Saved For Later Section -->
        ${savedForLater.length > 0 ? `
          <div class="cart-items-panel" style="margin-top: 18px;">
            <div class="cart-items-header">
              <span>Saved For Later (${savedForLater.length})</span>
            </div>
            <div>
              ${savedForLater.map(item => `
                <div class="cart-item-card" data-id="${item._id}">
                  <div class="cart-thumb-box">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" />
                  </div>
                  <div class="cart-item-body">
                    <div class="cart-item-brand">${escapeHTML(item.brand || 'ApexStore')}</div>
                    <div class="cart-item-title">${escapeHTML(item.name)}</div>
                    <div class="cart-item-pricing">
                      <span style="font-size: 16px; font-weight: 700;">${formatPrice(item.price)}</span>
                    </div>
                    <div class="cart-action-links">
                      <span class="cart-action-link move-cart-btn" data-id="${item._id}" style="color: var(--primary);">Move to Cart</span>
                      <span class="cart-action-link remove remove-saved-btn" data-id="${item._id}">Remove</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Right Column: Sticky Price Details -->
      <aside class="price-details-card">
        <div class="price-details-header">Price Details</div>
        <div class="price-details-body">
          <div class="price-row">
            <span>Price (${priceDetails.totalItems} items)</span>
            <span>${formatPrice(priceDetails.totalMrp)}</span>
          </div>

          <div class="price-row">
            <span>Discount</span>
            <span style="color: var(--success); font-weight: 700;">-${formatPrice(priceDetails.discountAmount)}</span>
          </div>

          <div class="price-row">
            <span>Delivery Charges</span>
            <span>
              ${priceDetails.deliveryCharges === 0 
                ? `<span style="color: var(--success); font-weight: 700;">FREE</span>` 
                : `${formatPrice(priceDetails.deliveryCharges)}`}
            </span>
          </div>

          <div class="price-row total">
            <span>Total Amount</span>
            <span style="color: var(--text-main); font-size: 18px;">${formatPrice(priceDetails.grandTotal)}</span>
          </div>

          ${priceDetails.totalSavings > 0 ? `
            <div class="savings-banner">
              You will save ${formatPrice(priceDetails.totalSavings)} on this order
            </div>
          ` : ''}

          <button class="btn-place-order" id="cart-place-order-btn" ${cart.length === 0 ? 'disabled' : ''}>
            Place Order
          </button>
        </div>
      </aside>
    </div>
  `;

  attachCartEvents();
}

function attachCartEvents() {
  // Quantity decrement
  document.querySelectorAll('.cart-dec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = Cart.getCart().find(i => String(i._id) === id);
      if (item) {
        Cart.setQty(id, item.qty - 1);
        renderCartPage();
      }
    });
  });

  // Quantity increment
  document.querySelectorAll('.cart-inc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = Cart.getCart().find(i => String(i._id) === id);
      if (item) {
        Cart.setQty(id, item.qty + 1);
        renderCartPage();
      }
    });
  });

  // Remove from cart
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      Cart.removeFromCart(id);
      renderCartPage();
    });
  });

  // Save for later
  document.querySelectorAll('.save-later-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      Cart.saveForLater(id);
      renderCartPage();
    });
  });

  // Move to cart from saved
  document.querySelectorAll('.move-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      Cart.moveToCart(id);
      renderCartPage();
    });
  });

  // Remove from saved
  document.querySelectorAll('.remove-saved-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      Cart.removeSavedForLater(id);
      renderCartPage();
    });
  });

  // Place Order navigation
  const placeOrderBtn = document.getElementById('cart-place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
});
