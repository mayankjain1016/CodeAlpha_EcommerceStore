/**
 * ApexStore - orders.js
 * My Orders Controller:
 * Enforces authentication, fetches user's past orders,
 * renders visual tracking timeline (Placed -> Shipped -> Delivered),
 * product thumbnails, and order breakdown.
 */

const ordersContainer = document.getElementById('orders-page-content');

async function loadOrders() {
  if (!ordersContainer) return;

  // 1. Enforce Authentication
  if (!Auth.requireAuth('orders.html')) {
    return;
  }

  ordersContainer.innerHTML = `
    <div style="background: white; border-radius: 4px; padding: 24px;">
      <div class="skeleton-box" style="height: 24px; width: 200px; margin-bottom: 20px;"></div>
      <div class="skeleton-box" style="height: 140px; width: 100%; margin-bottom: 16px;"></div>
      <div class="skeleton-box" style="height: 140px; width: 100%;"></div>
    </div>
  `;

  try {
    const orders = await api('/api/orders/my');
    renderOrdersList(orders);
  } catch (err) {
    console.error('Failed to load orders:', err);
    ordersContainer.innerHTML = `
      <div class="empty-cart-state">
        <h2 style="font-size: 18px; font-weight: 700; color: var(--danger); margin-bottom: 8px;">
          Failed to load orders
        </h2>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">
          ${escapeHTML(err.message)}
        </p>
        <button class="btn-buy-now" style="max-width: 160px; margin: 0 auto;" onclick="loadOrders()">
          Try Again
        </button>
      </div>
    `;
  }
}

function renderOrdersList(orders) {
  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">${Icons.package(64)}</div>
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 6px;">No Orders Placed Yet</h2>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">
          You haven't purchased anything yet. Browse our top electronics, fashion, and home deals!
        </p>
        <a href="index.html" class="btn-buy-now" style="display: inline-block; max-width: 170px;">
          Explore Store
        </a>
      </div>
    `;
    return;
  }

  ordersContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
      <h1 style="font-size: 20px; font-weight: 700; color: var(--text-main);">My Orders (${orders.length})</h1>
      <a href="index.html" class="btn-add-cart" style="font-size: 12px; padding: 6px 14px; max-width: 140px;">Shop More</a>
    </div>

    <div>
      ${orders.map(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

        const status = order.status || 'Placed';
        const isPlaced = true;
        const isShipped = status === 'Shipped' || status === 'Delivered';
        const isDelivered = status === 'Delivered';

        return `
          <div class="order-history-card">
            <!-- Order Header -->
            <div class="order-history-header">
              <div>
                <span style="font-size: 12px; color: var(--text-muted);">ORDER #</span>
                <span style="font-family: monospace; font-weight: 700; font-size: 13px; color: var(--text-main); margin-left: 4px;">
                  ${escapeHTML(order._id)}
                </span>
                <span style="font-size: 12px; color: var(--text-muted); margin-left: 12px;">Placed on: ${escapeHTML(orderDate)}</span>
              </div>
              <div>
                <span style="font-size: 12px; color: var(--text-muted); margin-right: 6px;">Total Amount:</span>
                <span style="font-size: 16px; font-weight: 800; color: var(--text-main);">${formatPrice(order.total)}</span>
              </div>
            </div>

            <!-- Visual Tracking Timeline -->
            <div class="order-tracking-timeline">
              <div class="timeline-bar-bg"></div>

              <div class="timeline-step ${isPlaced ? (isShipped ? 'completed' : 'active') : ''}">
                <div class="timeline-dot"></div>
                <span class="timeline-label">Order Placed</span>
              </div>

              <div class="timeline-step ${isShipped ? (isDelivered ? 'completed' : 'active') : ''}">
                <div class="timeline-dot"></div>
                <span class="timeline-label">Shipped</span>
              </div>

              <div class="timeline-step ${isDelivered ? 'completed' : ''}">
                <div class="timeline-dot"></div>
                <span class="timeline-label">Delivered</span>
              </div>
            </div>

            <!-- Shipping Summary -->
            <div style="background-color: #fafafa; border: 1px solid var(--border-light); border-radius: 4px; padding: 10px 14px; margin-bottom: 14px; font-size: 12px; color: var(--text-secondary);">
              <strong>Deliver to:</strong> ${escapeHTML(order.shippingAddress.fullName)} &bull; ${escapeHTML(order.shippingAddress.address)}, ${escapeHTML(order.shippingAddress.city)} - ${escapeHTML(order.shippingAddress.pincode)} (Ph: ${escapeHTML(order.shippingAddress.phone)}) &bull; <em>Cash on Delivery</em>
            </div>

            <!-- Ordered Items List -->
            <div>
              ${order.items.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-light);">
                  <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                    ${item.image ? `
                      <img src="${escapeHTML(item.image)}" alt="" style="width: 48px; height: 48px; object-fit: contain; border: 1px solid var(--border-light); border-radius: 2px;" />
                    ` : `
                      <div style="width: 48px; height: 48px; background: #eee; display: flex; align-items: center; justify-content: center;">${Icons.package(20)}</div>
                    `}
                    <div>
                      <div style="font-size: 13px; font-weight: 600; color: var(--text-main);">${escapeHTML(item.name)}</div>
                      <div style="font-size: 12px; color: var(--text-muted);">Qty: ${item.qty} &bull; Unit Price: ${formatPrice(item.price)}</div>
                    </div>
                  </div>
                  <div style="font-size: 14px; font-weight: 700; color: var(--text-main); white-space: nowrap;">
                    ${formatPrice(item.price * item.qty)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
});
