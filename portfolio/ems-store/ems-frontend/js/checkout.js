// ================== CONFIG ==================
const EMAILJS_CONFIG = {
  publicKey:  "N5mzHg4TQmKz_T-1Z",
  serviceId:  "service_gv3zi4q",
  templateId: "template_5lpqoc7"
};

const CART_STORAGE_KEY = "ems_cart";
let emailInitialized = false;

// ================== CART STATE ==================
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

let cart = loadCart();

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCart() {
  return cart;
}

function getCartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCT_MAP[id];
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

// ================== CART OPERATIONS ==================
function addToCartInternal(id, qty = 1) {
  if (!PRODUCT_MAP[id]) {
    console.warn("Unknown product id:", id);
    return;
  }
  cart[id] = (cart[id] || 0) + qty;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCartUI();
  showToast("Added to cart!", "success");
}

function clearCartInternal() {
  cart = {};
  saveCart();
  renderCartUI();
}

// expose for HTML onclick
window.addToCart = addToCartInternal;
window.clearCart   = clearCartInternal;

// ================== UI CREATION ==================
function injectCartAndCheckoutUI() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div id="cartOverlay" class="ems-cart-overlay"></div>
    <div id="cartDrawer" class="ems-cart-drawer">
      <div class="ems-cart-header">
        <h3>🛒 Cart (<span id="cartCount">0</span>)</h3>
        <button id="cartCloseBtn" class="ems-icon-btn">×</button>
      </div>
      <div id="cartItems" class="ems-cart-items"></div>
      <div class="ems-cart-footer">
        <div class="ems-cart-total-row">
          <span>Total:</span>
          <span>$<span id="cartTotal">0.00</span></span>
        </div>
        <button id="cartCheckoutBtn" class="ems-btn-primary">
          <i class="fa-solid fa-credit-card"></i> Proceed to Checkout
        </button>
        <button id="cartClearBtn" class="ems-btn-danger">
          <i class="fa-solid fa-trash"></i> Clear Cart
        </button>
      </div>
    </div>

    <div id="checkoutModal" class="ems-modal-backdrop">
      <div class="ems-modal">
        <div class="ems-modal-header">
          <h3><i class="fa-solid fa-credit-card"></i> Checkout</h3>
          <button id="checkoutCloseBtn" class="ems-icon-btn">×</button>
        </div>
        <form id="checkoutForm" class="ems-modal-body">
          <div class="ems-field">
            <label>Full Name *</label>
            <input id="checkoutName" type="text" required placeholder="John Doe">
          </div>
          <div class="ems-field">
            <label>Email *</label>
            <input id="checkoutEmail" type="email" required placeholder="you@example.com">
          </div>
          <div class="ems-field">
            <label>Phone *</label>
            <input id="checkoutPhone" type="tel" required placeholder="+91 9999999999">
          </div>
          <div class="ems-field">
            <label>Delivery Address *</label>
            <textarea id="checkoutAddress" rows="3" required placeholder="Street, City, State, PIN"></textarea>
          </div>

          <div id="checkoutError" class="ems-error" style="display:none;"></div>

          <div class="ems-summary-row">
            <span>Order Total:</span>
            <span>$<span id="modalCartTotal">0.00</span></span>
          </div>

          <button id="checkoutSubmitBtn" type="submit" class="ems-btn-primary ems-btn-block">
            <i class="fa-solid fa-paper-plane"></i> Place Order & Send Email
          </button>
        </form>
      </div>
    </div>

    <div id="floatingCartBtn" class="ems-floating-cart">
      <i class="fa-solid fa-bag-shopping"></i>
      <span id="floatingCartCount">0</span>
    </div>
  `;
  document.body.appendChild(wrapper);

  injectCartStyles();
  wireEvents();
  renderCartUI();
}

function injectCartStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .ems-cart-overlay {
      position:fixed;inset:0;background:rgba(0,0,0,0.5);
      z-index:9998;display:none;
    }
    .ems-cart-drawer {
      position:fixed;top:0;right:-420px;width:400px;height:100vh;
      background:#fff;border-left:1px solid #e9ecef;
      box-shadow:-5px 0 20px rgba(0,0,0,0.15);
      z-index:9999;transition:right 0.3s ease;
      display:flex;flex-direction:column;font-family:Poppins,system-ui,sans-serif;
    }
    .ems-cart-drawer.open { right:0; }
    .ems-cart-header {
      padding:18px 20px;border-bottom:1px solid #e9ecef;
      display:flex;justify-content:space-between;align-items:center;
    }
    .ems-cart-items { flex:1;overflow-y:auto;padding:16px; }
    .ems-cart-item {
      display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #e9ecef;
      align-items:center;
    }
    .ems-cart-item img {
      width:56px;height:56px;object-fit:cover;border-radius:8px;
    }
    .ems-cart-info h4 {
      margin:0 0 4px;font-size:14px;font-weight:600;
    }
    .ems-cart-info small { color:#6c757d;font-size:11px; }
    .ems-cart-qty {
      display:flex;flex-direction:column;align-items:flex-end;gap:4px;
      font-size:13px;font-weight:600;color:#572403;
    }
    .ems-qty-row {
      display:flex;align-items:center;gap:6px;
    }
    .ems-qty-btn {
      width:26px;height:26px;border:1px solid #e9ecef;
      background:#f8f9fa;border-radius:4px;cursor:pointer;
      font-weight:600;
    }
    .ems-cart-footer { padding:16px 20px;border-top:1px solid #e9ecef; }
    .ems-cart-total-row {
      display:flex;justify-content:space-between;align-items:center;
      font-size:17px;font-weight:700;margin-bottom:12px;
    }
    .ems-btn-primary, .ems-btn-danger {
      width:100%;padding:12px 14px;border:none;border-radius:8px;
      font-weight:600;cursor:pointer;font-family:inherit;
      display:inline-flex;align-items:center;justify-content:center;gap:8px;
    }
    .ems-btn-primary { background:#572403;color:#fff; }
    .ems-btn-danger  { background:#dc3545;color:#fff;margin-top:6px;font-size:14px; }
    .ems-icon-btn {
      border:none;background:none;font-size:22px;cursor:pointer;color:#6c757d;
    }
    .ems-modal-backdrop {
      position:fixed;inset:0;background:rgba(0,0,0,0.6);
      display:none;align-items:center;justify-content:center;
      z-index:10000;
    }
    .ems-modal-backdrop.active { display:flex; }
    .ems-modal {
      background:#fff;border-radius:12px;width:90%;max-width:500px;
      max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.35);
      font-family:Poppins,system-ui,sans-serif;
    }
    .ems-modal-header {
      padding:18px 20px;border-bottom:1px solid #e9ecef;
      display:flex;justify-content:space-between;align-items:center;
    }
    .ems-modal-body {
      padding:18px 20px;display:flex;flex-direction:column;gap:12px;
    }
    .ems-field label {
      display:block;font-size:13px;font-weight:600;margin-bottom:4px;
    }
    .ems-field input, .ems-field textarea {
      width:100%;padding:10px 12px;border-radius:8px;
      border:1px solid #e9ecef;font-size:14px;font-family:inherit;
      box-sizing:border-box;
    }
    .ems-field input:focus, .ems-field textarea:focus {
      outline:none;border-color:#572403;
    }
    .ems-summary-row {
      display:flex;justify-content:space-between;align-items:center;
      padding:10px 12px;border-radius:8px;background:#f8f9fa;
      font-weight:700;margin-top:4px;margin-bottom:4px;
    }
    .ems-btn-block { width:100%;margin-top:4px; }
    .ems-floating-cart {
      position:fixed;bottom:24px;right:24px;width:56px;height:56px;
      background:#572403;color:#fff;border-radius:50%;
      display:none;flex-direction:column;align-items:center;justify-content:center;
      box-shadow:0 8px 25px rgba(87,36,3,0.45);cursor:pointer;z-index:9999;
      font-family:Poppins,system-ui,sans-serif;
    }
    .ems-floating-cart span {
      font-size:11px;background:#dc3545;border-radius:10px;
      padding:1px 6px;margin-top:1px;min-width:18px;text-align:center;
    }
    .ems-error {
      font-size:13px;color:#c62828;background:#ffebee;
      padding:8px 10px;border-radius:8px;
    }
    @media (max-width:768px) {
      .ems-cart-drawer { width:100vw;right:-100vw; }
    }
  `;
  document.head.appendChild(style);
}

// ================== RENDERING ==================
function renderCartUI() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const modalTotalEl = document.getElementById("modalCartTotal");
  const floatingCountEl = document.getElementById("floatingCartCount");
  const floatingBtn = document.getElementById("floatingCartBtn");

  if (!cartItemsEl) return; // UI not mounted yet

  if (!Object.keys(cart).length) {
    cartItemsEl.innerHTML = `
      <div style="text-align:center;padding:40px 0;color:#6c757d;">
        <i class="fa-solid fa-cart-shopping" style="font-size:40px;margin-bottom:10px;opacity:0.6;"></i>
        <div>Your cart is empty</div>
      </div>
    `;
  } else {
    cartItemsEl.innerHTML = Object.entries(cart).map(([id, qty]) => {
      const p = PRODUCT_MAP[id];
      if (!p) return "";
      return `
        <div class="ems-cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="ems-cart-info">
            <h4>${p.name}</h4>
            <small>${p.sku}</small>
          </div>
          <div class="ems-cart-qty">
            <div class="ems-qty-row">
              <button class="ems-qty-btn" onclick="window.__updateQty('${id}', -1)">−</button>
              <span>${qty}</span>
              <button class="ems-qty-btn" onclick="window.__updateQty('${id}', 1)">+</button>
            </div>
            <div>$${(p.price * qty).toFixed(2)}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  const count = getCartCount();
  const total = getCartTotal();

  if (cartCountEl) cartCountEl.textContent = count;
  if (cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
  if (modalTotalEl) modalTotalEl.textContent = total.toFixed(2);
  if (floatingCountEl) floatingCountEl.textContent = count;
  if (floatingBtn) floatingBtn.style.display = count ? "flex" : "none";
}

// helper for +/- buttons
window.__updateQty = function (id, delta) {
  addToCartInternal(id, delta);
};

// ================== OPEN/CLOSE ==================
function toggleCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (!drawer || !overlay) return;
  const open = drawer.classList.contains("open");
  if (open) {
    drawer.classList.remove("open");
    overlay.style.display = "none";
  } else {
    drawer.classList.add("open");
    overlay.style.display = "block";
  }
}

window.toggleCart = toggleCartDrawer;

function openCheckout() {
  if (!getCartCount()) {
    showToast("Cart is empty!", "warning");
    return;
  }
  toggleCartDrawer(); // close drawer
  const modal = document.getElementById("checkoutModal");
  const modalTotalEl = document.getElementById("modalCartTotal");
  if (modal) {
    modal.classList.add("active");
    if (modalTotalEl) modalTotalEl.textContent = getCartTotal().toFixed(2);
  }
}

function closeCheckout() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("active");
}

window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;

// ================== EMAIL / ORDER ==================
function ensureEmailInitialized() {
  if (!emailInitialized) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    emailInitialized = true;
  }
}

function setCheckoutError(msg) {
  const box = document.getElementById("checkoutError");
  if (!box) {
    if (msg) showToast(msg, "warning");
    return;
  }
  if (!msg) {
    box.style.display = "none";
    box.textContent = "";
  } else {
    box.style.display = "block";
    box.textContent = msg;
  }
}

function validateOrder(order) {
  const errs = [];
  if (!order.name.trim()) errs.push("Full name is required.");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(order.email.trim())) errs.push("Enter a valid email address.");
  const phoneDigits = order.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) errs.push("Enter a valid phone number (10+ digits).");
  if (!order.address.trim() || order.address.trim().length < 10) errs.push("Enter a complete delivery address.");
  if (!Object.keys(order.items).length || order.total <= 0) errs.push("Your cart is empty.");
  return errs;
}

async function submitOrder(e) {
  if (e && e.preventDefault) e.preventDefault();

  const btn = document.getElementById("checkoutSubmitBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "Processing...";
  }

  const order = {
    orderId: "EMS-" + Date.now(),
    name: document.getElementById("checkoutName")?.value || "",
    email: document.getElementById("checkoutEmail")?.value || "",
    phone: document.getElementById("checkoutPhone")?.value || "",
    address: document.getElementById("checkoutAddress")?.value || "",
    items: { ...cart },
    total: getCartTotal(),
    date: new Date().toISOString()
  };

  const errors = validateOrder(order);
  if (errors.length) {
    setCheckoutError(errors[0]);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Place Order & Send Email';
    }
    return;
  }
  setCheckoutError("");

  // Save order for admin panel
  try {
    const existing = JSON.parse(localStorage.getItem("ems_orders") || "[]");
    existing.push(order);
    localStorage.setItem("ems_orders", JSON.stringify(existing));
  } catch (err) {
    console.error("Failed to save order:", err);
  }

  // Send email
  try {
    ensureEmailInitialized();
    const itemsText = Object.entries(order.items)
      .map(([id, qty]) => `${PRODUCT_MAP[id]?.name || id} × ${qty}`)
      .join("\n");

    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        customer_name: order.name,
        customer_email: order.email,
        customer_phone: order.phone,
        customer_address: order.address,
        order_id: order.orderId,
        order_date: new Date(order.date).toLocaleString("en-IN"),
        order_items: itemsText || "No item details",
        order_total: `$${order.total.toFixed(2)}`
      }
    );

    showToast("✅ Order confirmed + email sent!", "success");
  } catch (err) {
    console.error("EmailJS error:", err);
    showToast("✅ Order saved, email failed", "info");
    setCheckoutError("Order saved, but email could not be sent.");
  }

  clearCartInternal();
  closeCheckout();
  document.getElementById("checkoutForm")?.reset();

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Place Order & Send Email';
  }
}

window.submitOrder = submitOrder;

// ================== TOAST ==================
function showToast(msg, type = "success") {
  const colors = { success: "#28a745", warning: "#ffc107", info: "#17a2b8", error: "#dc3545" };
  const toast = document.createElement("div");
  toast.style.cssText = `
    position:fixed;top:20px;right:20px;z-index:10001;
    padding:14px 18px;border-radius:8px;color:white;font-weight:600;
    background:${colors[type] || colors.success};
    transform:translateX(400px);transition:all 0.3s;
    box-shadow:0 6px 18px rgba(0,0,0,0.25);
    font-family:Poppins,system-ui,sans-serif;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.transform = "translateX(0)"), 50);
  setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// ================== EVENT WIRING ==================
function wireEvents() {
  const overlay = document.getElementById("cartOverlay");
  const drawer  = document.getElementById("cartDrawer");
  const closeBtn= document.getElementById("cartCloseBtn");
  const clearBtn= document.getElementById("cartClearBtn");
  const checkoutBtn = document.getElementById("cartCheckoutBtn");
  const floatingBtn = document.getElementById("floatingCartBtn");
  const checkoutCloseBtn = document.getElementById("checkoutCloseBtn");
  const checkoutForm = document.getElementById("checkoutForm");

  overlay?.addEventListener("click", toggleCartDrawer);
  closeBtn?.addEventListener("click", toggleCartDrawer);
  clearBtn?.addEventListener("click", clearCartInternal);
  checkoutBtn?.addEventListener("click", openCheckout);
  floatingBtn?.addEventListener("click", toggleCartDrawer);
  checkoutCloseBtn?.addEventListener("click", closeCheckout);
  checkoutForm?.addEventListener("submit", submitOrder);
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  injectCartAndCheckoutUI();
});
