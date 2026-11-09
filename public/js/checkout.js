/**
 * ApexStore - checkout.js
 * 3-Step Checkout Flow:
 * 1. Login verification (enforced)
 * 2. Delivery Address with inline real-time validation (10-digit phone, 6-digit pin)
 * 3. Payment Mode (Cash on Delivery) & Server-calculated order totals
 * Post-order receipt screen with estimated delivery date.
 */

const checkoutContainer = document.getElementById('checkout-page-content');

const SAVED_ADDRESS_KEY = 'apex_saved_checkout_address';

function getSavedAddress() {
  try {
    const raw = sessionStorage.getItem(SAVED_ADDRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveCurrentAddress() {
  try {
    const addressData = {
      fullName: document.getElementById('ship-fullName')?.value || '',
      phone: document.getElementById('ship-phone')?.value || '',
      pincode: document.getElementById('ship-pincode')?.value || '',
      address: document.getElementById('ship-address')?.value || '',
      city: document.getElementById('ship-city')?.value || '',
      state: document.getElementById('ship-state')?.value || ''
    };
    sessionStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(addressData));
  } catch (e) {}
}

function clearSavedAddress() {
  try {
    sessionStorage.removeItem(SAVED_ADDRESS_KEY);
  } catch (e) {}
}

function initCheckout() {
  if (!checkoutContainer) return;

  // 1. Require Login
  if (!Auth.requireAuth('checkout.html')) {
    return;
  }

  // 2. Require Cart items
  const cart = Cart.getCart();
  if (cart.length === 0) {
    checkoutContainer.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">${Icons.cart(64)}</div>
        <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">No Items to Checkout</h2>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">Your shopping cart is empty.</p>
        <a href="products.html" class="btn-buy-now" style="display: inline-block; max-width: 180px;">Browse Catalog</a>
      </div>
    `;
    return;
  }

  const currentUser = Auth.getUser();
  const savedAddress = getSavedAddress() || {};
  const priceDetails = (typeof Cart.calculateTotals === 'function') 
    ? Cart.calculateTotals() 
    : (typeof Cart.getCartPriceDetails === 'function' ? Cart.getCartPriceDetails() : { totalItems: cart.length, totalMrp: 0, subtotal: 0, discountAmount: 0, deliveryCharges: 0, grandTotal: 0, totalSavings: 0 });

  checkoutContainer.innerHTML = `
    <!-- 3-Step Progress Bar -->
    <div class="checkout-steps-bar" role="progressbar" aria-label="Checkout Progress">
      <div class="checkout-step completed">
        <span class="step-num-badge">${Icons.check(12)}</span>
        <span>1. LOGIN (${escapeHTML(currentUser?.name ? currentUser.name.split(' ')[0] : 'User')})</span>
      </div>
      <div class="checkout-step active" id="step-tab-address">
        <span class="step-num-badge">2</span>
        <span>2. DELIVERY ADDRESS</span>
      </div>
      <div class="checkout-step" id="step-tab-payment">
        <span class="step-num-badge">3</span>
        <span>3. ORDER SUMMARY & COD</span>
      </div>
    </div>

    <!-- Main Checkout 2-Column Grid -->
    <div class="cart-grid-layout">
      <!-- Left Column: Address Form & COD Details -->
      <div class="cart-items-panel" style="padding: 24px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          ${Icons.truck(18)}
          <span>Shipping & Delivery Information</span>
        </h2>

        <form id="shipping-form" novalidate>
          <div class="form-field-group">
            <label for="ship-fullName" class="form-label">Full Name *</label>
            <input 
              type="text" 
              id="ship-fullName" 
              class="form-input" 
              placeholder="e.g. Rahul Sharma" 
              value="${escapeHTML(savedAddress.fullName || currentUser?.name || '')}" 
              required 
            />
            <div class="field-error-msg" id="err-ship-fullName">Please enter your full name</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-field-group">
              <label for="ship-phone" class="form-label">Mobile Number (10 Digits) *</label>
              <input 
                type="tel" 
                id="ship-phone" 
                class="form-input" 
                placeholder="10-digit mobile number" 
                maxlength="10" 
                value="${escapeHTML(savedAddress.phone || '')}" 
                required 
              />
              <div class="field-error-msg" id="err-ship-phone">Please enter a valid 10-digit mobile number</div>
            </div>

            <div class="form-field-group">
              <label for="ship-pincode" class="form-label">Pincode (6 Digits) *</label>
              <input 
                type="text" 
                id="ship-pincode" 
                class="form-input" 
                placeholder="6-digit postal code" 
                maxlength="6" 
                value="${escapeHTML(savedAddress.pincode || '')}" 
                required 
              />
              <div class="field-error-msg" id="err-ship-pincode">Please enter a valid 6-digit postal pincode</div>
            </div>
          </div>

          <div class="form-field-group">
            <label for="ship-address" class="form-label">Flat / House No. / Street Address *</label>
            <textarea 
              id="ship-address" 
              class="form-input" 
              rows="2" 
              placeholder="e.g. Flat 302, Palm Grove Apts, 100 Feet Road" 
              required
            >${escapeHTML(savedAddress.address || '')}</textarea>
            <div class="field-error-msg" id="err-ship-address">Please enter complete street address</div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-field-group">
              <label for="ship-city" class="form-label">City / District *</label>
              <input type="text" id="ship-city" class="form-input" placeholder="e.g. Bengaluru" value="${escapeHTML(savedAddress.city || '')}" required />
              <div class="field-error-msg" id="err-ship-city">City is required</div>
            </div>

            <div class="form-field-group">
              <label for="ship-state" class="form-label">State *</label>
              <input type="text" id="ship-state" class="form-input" placeholder="e.g. Karnataka" value="${escapeHTML(savedAddress.state || 'Karnataka')}" required />
              <div class="field-error-msg" id="err-ship-state">State is required</div>
            </div>
          </div>

          <!-- Payment Mode -->
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-light);">
            <div style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
              Payment Method
            </div>
            <div class="payment-option-card">
              <input type="radio" id="pay-cod" name="payment" value="cod" checked style="accent-color: var(--primary); width: 16px; height: 16px;" />
              <label for="pay-cod" style="font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text-main);">
                💵 Cash on Delivery (Pay cash or UPI to courier upon package delivery)
              </label>
            </div>
          </div>

          <button type="submit" class="btn-place-order" id="submit-order-btn" style="margin-top: 20px;">
            Confirm & Place Order (${formatPrice(priceDetails.grandTotal)})
          </button>
        </form>
      </div>

      <!-- Right Column: Price Details & Cart Snapshot -->
      <aside class="price-details-card">
        <div class="price-details-header">Order Summary (${priceDetails.totalItems} Items)</div>
        <div class="price-details-body">
          <!-- Item list snapshot -->
          <div style="max-height: 220px; overflow-y: auto; margin-bottom: 12px; border-bottom: 1px solid var(--border-light); padding-bottom: 8px;">
            ${cart.map(item => `
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px; font-size: 12px;">
                <img src="${escapeHTML(item.image)}" alt="" style="width: 36px; height: 36px; object-fit: contain; border: 1px solid var(--border-light); border-radius: 2px;" />
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(item.name)}</div>
                  <div style="color: var(--text-muted);">Qty: ${item.qty} &times; ${formatPrice(item.price)}</div>
                </div>
                <div style="font-weight: 700;">${formatPrice(item.price * item.qty)}</div>
              </div>
            `).join('')}
          </div>

          <div class="price-row">
            <span>Items Subtotal</span>
            <span>${formatPrice(priceDetails.subtotal)}</span>
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
            <span>Total Payable</span>
            <span style="font-size: 18px; color: var(--text-main);">${formatPrice(priceDetails.grandTotal)}</span>
          </div>

          ${priceDetails.totalSavings > 0 ? `
            <div class="savings-banner">
              Your Total Savings on this order: ${formatPrice(priceDetails.totalSavings)}
            </div>
          ` : ''}
        </div>
      </aside>
    </div>
  `;

  attachCheckoutFormEvents();
}

function attachCheckoutFormEvents() {
  const form = document.getElementById('shipping-form');
  const submitBtn = document.getElementById('submit-order-btn');

  if (!form) return;

  const fields = ['fullName', 'phone', 'pincode', 'address', 'city', 'state'];

  // Input event clear errors and auto-save form state to sessionStorage
  fields.forEach(field => {
    const input = document.getElementById(`ship-${field}`);
    const err = document.getElementById(`err-ship-${field}`);
    if (input) {
      input.addEventListener('input', () => {
        if (err) {
          input.classList.remove('error');
          err.classList.remove('visible');
        }
        saveCurrentAddress();
      });
      input.addEventListener('change', () => {
        saveCurrentAddress();
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const values = {};
    const validateFields = ['fullName', 'phone', 'pincode', 'address', 'city'];

    validateFields.forEach(field => {
      const input = document.getElementById(`ship-${field}`);
      const err = document.getElementById(`err-ship-${field}`);
      const val = input ? input.value.trim() : '';
      values[field] = val;

      if (!val) {
        if (input) input.classList.add('error');
        if (err) err.classList.add('visible');
        isValid = false;
      } else if (field === 'phone' && !/^\d{10}$/.test(val)) {
        if (input) input.classList.add('error');
        if (err) {
          err.textContent = 'Enter a valid 10-digit mobile number';
          err.classList.add('visible');
        }
        isValid = false;
      } else if (field === 'pincode' && !/^\d{6}$/.test(val)) {
        if (input) input.classList.add('error');
        if (err) {
          err.textContent = 'Enter a valid 6-digit pincode';
          err.classList.add('visible');
        }
        isValid = false;
      }
    });

    if (!isValid) {
      showToast('Please fix all highlighted errors in the address form', 'error');
      return;
    }

    const cart = Cart.getCart();
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Placing Order with Seller...';

    const orderPayload = {
      items: cart.map(item => ({
        productId: item._id,
        qty: item.qty
      })),
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        city: values.city,
        pincode: values.pincode
      }
    };

    try {
      const response = await api('/api/orders', {
        method: 'POST',
        body: orderPayload
      });

      // Clear saved address from session
      clearSavedAddress();

      // Clear shopping cart
      Cart.clearCart();

      // Render Order Success Screen
      renderSuccessScreen(response.order);
    } catch (err) {
      console.error('Order error:', err);
      if (err.status === 401) {
        saveCurrentAddress();
        showToast('Your session has expired. Redirecting to login...', 'error');
        setTimeout(() => {
          window.location.href = 'login.html?next=checkout.html';
        }, 1200);
        return;
      }
      showToast(err.message || 'Failed to place order. Check product stock.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function renderSuccessScreen(order) {
  // Estimated delivery date in 3 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const dateStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  checkoutContainer.innerHTML = `
    <div class="order-success-panel">
      <div class="success-check-svg">
        ${Icons.check(56)}
      </div>

      <h1 style="font-size: 22px; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">
        Order Placed Successfully!
      </h1>
      <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 20px;">
        An order confirmation receipt has been generated. You will pay cash or UPI when the package arrives.
      </p>

      <div style="background: #fafafa; border: 1px solid var(--border-light); border-radius: 4px; padding: 18px; text-align: left; margin-bottom: 24px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Order ID:</span>
          <span style="font-family: monospace; font-weight: 700; color: var(--text-main);">${escapeHTML(order._id)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Estimated Delivery:</span>
          <span style="font-weight: 700; color: var(--success);">${escapeHTML(dateStr)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Payment Method:</span>
          <span style="font-weight: 700;">Cash on Delivery (COD)</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">Total Order Amount:</span>
          <span style="font-weight: 800; font-size: 15px; color: var(--text-main);">${formatPrice(order.total)}</span>
        </div>
        <div style="border-top: 1px solid var(--border-light); padding-top: 8px; margin-top: 8px; color: var(--text-secondary);">
          <strong>Deliver to:</strong> ${escapeHTML(order.shippingAddress.fullName)}, ${escapeHTML(order.shippingAddress.address)}, ${escapeHTML(order.shippingAddress.city)} - ${escapeHTML(order.shippingAddress.pincode)} (Ph: ${escapeHTML(order.shippingAddress.phone)})
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="orders.html" class="btn-buy-now" style="display: inline-block; max-width: 170px;">
          View My Orders
        </a>
        <a href="products.html" class="btn-add-cart" style="display: inline-block; max-width: 170px;">
          Continue Shopping
        </a>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initCheckout();
});
