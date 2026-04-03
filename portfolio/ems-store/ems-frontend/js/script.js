"use strict";

const STORAGE_KEY = "ems_store_cart_v1";
const THEME_KEY = "ems_theme_preference";
const DEFAULT_BULLETS = [
  "Field-ready construction",
  "Professional-grade materials",
  "Trusted by EMS teams"
];

let PRODUCTS = [];
let PRODUCT_MAP = {};
let activeCategory = "All";
let activeSearchQuery = "";
let lastChangedProductId = null;
let productsLoaded = false;
let productLoadFailed = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const money = (value) => (
  parseFloat(value) || 0
).toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const safeText = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

function rebuildProductMap() {
  PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((product) => [product.id, product]));
}

function normalizeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name || "Unnamed Product",
    category: product.category || "Uncategorized",
    sku: product.sku || `SKU-${product.id}`,
    price: Number(product.price) || 0,
    badge: product.badge || "",
    stock_level: Number(product.stock_level ?? 0),
    description: product.description || "Field-ready gear built for real-world EMS demands.",
    bullets: Array.isArray(product.bullets) && product.bullets.length ? product.bullets : DEFAULT_BULLETS,
    image: {
      src: product.image_url || "https://placehold.co/600x400/572403/ffd977?text=EMS+Gear",
      alt: product.name || "EMS product"
    }
  };
}

function renderGridState(container, message) {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-cart" style="grid-column: 1 / -1; min-height: 220px;">
      <i class="fa-solid fa-box-open"></i>
      <div class="empty-cart-title">${safeText(message.title)}</div>
      <div class="empty-cart-sub">${safeText(message.body)}</div>
    </div>
  `;
}

function matchesSearch(product, query) {
  if (!query) return true;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    product.name,
    product.category,
    product.sku,
    product.description
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function productCardHTML(product) {
  const isOutOfStock = product.stock_level <= 0;
  return `
    <article class="card">
      <div class="card-top">
        <img src="${product.image.src}" alt="${safeText(product.name)}" class="product-img" loading="lazy">
        <div class="tag">${safeText(product.category)}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${safeText(product.name)}</h3>
        <p class="card-text">${safeText(product.description.substring(0, 75))}...</p>
        <div class="price-row">
          <div class="price">${money(product.price)}</div>
          <div class="sku-small">${isOutOfStock ? "Out of stock" : `Stock: ${product.stock_level}`}</div>
        </div>
        <div class="card-actions">
          <button type="button" class="btn secondary" onclick="openProductModal('${product.id}')">Details</button>
          <button type="button" class="btn" onclick="addToCart('${product.id}', 1)" title="${isOutOfStock ? "Item unavailable" : "Add to cart"}">
            ${isOutOfStock ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderGrids(filter = "All") {
  activeCategory = filter;
  const unified = $("#unifiedShopGrid");
  const home = $("#productGrid");
  const steth = $("#stethGrid");

  if (!productsLoaded) {
    const message = productLoadFailed ? {
      title: "Catalog unavailable",
      body: "We couldn't load the latest emergency medical supply inventory right now."
    } : {
      title: "Loading catalog",
      body: "Pulling the latest product inventory from the backend."
    };

    renderGridState(unified, message);
    renderGridState(home, message);
    renderGridState(steth, message);
    return;
  }

  const filtered = PRODUCTS.filter((product) => {
    const categoryMatch = filter === "All" || product.category === filter;
    return categoryMatch && matchesSearch(product, activeSearchQuery);
  });
  const homeProducts = PRODUCTS.slice(0, 6);
  const stethProducts = PRODUCTS.filter((product) => product.category === "Stethoscopes");

  if (unified) {
    if (!filtered.length) {
      renderGridState(unified, {
        title: activeSearchQuery ? "No search matches" : "No matching gear",
        body: activeSearchQuery
          ? `No products matched "${activeSearchQuery}". Try another keyword or category.`
          : "Try another category to explore more products."
      });
    } else {
      unified.innerHTML = filtered.map(productCardHTML).join("");
    }
  }

  if (home) {
    if (!homeProducts.length) {
      renderGridState(home, {
        title: "No featured products",
        body: "Featured inventory will appear here once products are available."
      });
    } else {
      home.innerHTML = homeProducts.map(productCardHTML).join("");
    }
  }

  if (steth) {
    if (!stethProducts.length) {
      renderGridState(steth, {
        title: "No stethoscopes available",
        body: "This category will update as soon as inventory is available."
      });
    } else {
      steth.innerHTML = stethProducts.map(productCardHTML).join("");
    }
  }
}

async function loadProducts() {
  try {
    const products = await window.EMSApi.products.list();
    PRODUCTS = Array.isArray(products)
      ? products.map(normalizeProduct).filter(Boolean)
      : [];
    productsLoaded = true;
    productLoadFailed = false;
    rebuildProductMap();
  } catch (err) {
    console.error("Critical: Backend API unreachable.", err);
    PRODUCTS = [];
    productsLoaded = false;
    productLoadFailed = true;
  }

  renderGrids(activeCategory);
  updateCartBadge({ cleanUnknown: true });
  renderCart({ cleanUnknown: true });
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeUI(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeUI(next);
}

function updateThemeUI(theme) {
  const icon = $("#themeIcon");
  const text = $("#themeText");
  if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if (text) text.textContent = theme === "dark" ? "Light" : "Dark";
}

function normalizeCart(cart) {
  if (!cart || typeof cart !== "object" || Array.isArray(cart)) return {};

  return Object.fromEntries(
    Object.entries(cart)
      .map(([id, qty]) => [String(id), parseInt(qty, 10)])
      .filter(([id, qty]) => id && Number.isFinite(qty) && qty > 0)
  );
}

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const normalized = normalizeCart(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (err) {
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeCart(cart)));
}

function filterCartToKnownProducts(cart) {
  if (!productsLoaded) return cart;
  return Object.fromEntries(
    Object.entries(cart).filter(([id]) => Boolean(PRODUCT_MAP[id]))
  );
}

function getCartQuantity(productId) {
  const cart = loadCart();
  return parseInt(cart[productId], 10) || 0;
}

function getCartAvailability(productId, quantity = 1) {
  const product = PRODUCT_MAP[productId];

  if (!productsLoaded || !product) {
    return {
      allowed: false,
      message: "This item isn't available right now."
    };
  }

  if (product.stock_level <= 0) {
    return {
      allowed: false,
      message: "This item isn't available right now."
    };
  }

  const nextQuantity = getCartQuantity(productId) + quantity;
  if (nextQuantity > product.stock_level) {
    return {
      allowed: false,
      message: `Only ${product.stock_level} item${product.stock_level === 1 ? "" : "s"} available in stock.`
    };
  }

  return { allowed: true };
}

function updateCartBadge(options = {}) {
  const shouldClean = options.cleanUnknown && productsLoaded;
  const cart = shouldClean ? filterCartToKnownProducts(loadCart()) : loadCart();
  if (shouldClean) saveCart(cart);

  const count = Object.values(cart).reduce((sum, qty) => sum + (parseInt(qty, 10) || 0), 0);
  const badge = $("#cartBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function addToCart(productId, quantity = 1) {
  const availability = getCartAvailability(productId, quantity);
  if (!availability.allowed) {
    showNotification(availability.message, "danger");
    return;
  }

  const cart = loadCart();
  cart[productId] = (parseInt(cart[productId], 10) || 0) + quantity;
  saveCart(cart);
  updateCartBadge();
  renderCart();
  showNotification("Item added to cart", "success");
}

function renderCart(options = {}) {
  const body = $("#cartItems");
  const totalEl = $("#cartTotal");
  const checkoutBtn = $("#checkoutBtn");
  const modalTotal = $("#modalCartTotal");
  if (!body || !totalEl) return;

  const shouldClean = options.cleanUnknown && productsLoaded;
  const cart = shouldClean ? filterCartToKnownProducts(loadCart()) : loadCart();
  if (shouldClean) saveCart(cart);
  const entries = Object.entries(cart);

  if (!entries.length) {
    body.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-bag-shopping"></i>
        <div class="empty-cart-title">Your cart is empty</div>
        <div class="empty-cart-sub">Add field gear to start checkout.</div>
      </div>
    `;
    totalEl.textContent = money(0);
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.setAttribute("aria-disabled", "true");
    }
    if (modalTotal) modalTotal.textContent = "0.00";
    renderCheckoutReview();
    return;
  }

  if (!productsLoaded) {
    body.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <div class="empty-cart-title">Loading cart details</div>
        <div class="empty-cart-sub">Waiting for the latest product data from the backend.</div>
      </div>
    `;
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.setAttribute("aria-disabled", "true");
    }
    return;
  }

  let total = 0;
  body.innerHTML = entries.map(([id, qty]) => {
    const product = PRODUCT_MAP[id];
    if (!product) return "";

    total += product.price * qty;
    const lineTotal = product.price * qty;
    const highlightClass = id === lastChangedProductId ? " cart-item-pulse" : "";

    return `
      <div class="cart-item${highlightClass}" data-cart-id="${id}">
        <img src="${product.image?.src || "https://placehold.co/200x200/572403/ffd977?text=EMS"}" alt="${safeText(product.name)}" class="cart-item-img">
        <div class="cart-item-main">
          <div class="cart-item-top">
            <div class="cart-item-title">${safeText(product.name)}</div>
            <div class="cart-item-total">${money(lineTotal)}</div>
          </div>
          <div class="cart-item-meta">
            <span class="cart-item-price">${money(product.price)}</span>
            <span class="cart-item-sku">${safeText(product.sku)}</span>
          </div>
          <div class="cart-item-controls">
            <button onclick="changeCartQty('${product.id}', -1)" class="qty-btn" aria-label="Decrease quantity">−</button>
            <span class="qty-count">${qty}</span>
            <button onclick="changeCartQty('${product.id}', 1)" class="qty-btn" aria-label="Increase quantity">+</button>
            <button onclick="removeFromCart('${product.id}')" class="remove-btn" aria-label="Remove item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (lastChangedProductId) {
    const element = body.querySelector(`[data-cart-id="${lastChangedProductId}"]`);
    if (element) {
      setTimeout(() => {
        element.classList.remove("cart-item-pulse");
      }, 350);
    }
    lastChangedProductId = null;
  }

  totalEl.textContent = money(total);
  if (modalTotal) modalTotal.textContent = total.toFixed(2);
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.removeAttribute("aria-disabled");
  }
  renderCheckoutReview();
}

function changeCartQty(id, delta) {
  const cart = loadCart();
  if (delta > 0) {
    const availability = getCartAvailability(id, delta);
    if (!availability.allowed) {
      showNotification(availability.message, "danger");
      return;
    }
  }
  cart[id] = (parseInt(cart[id], 10) || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  lastChangedProductId = id;
  updateCartBadge();
  renderCart();
}

function removeFromCart(id) {
  const cart = loadCart();
  if (!cart[id]) return;
  delete cart[id];
  saveCart(cart);
  lastChangedProductId = id;
  updateCartBadge();
  renderCart();
}

function renderCheckoutReview() {
  const list = $("#checkoutReviewList");
  const totalEl = $("#checkoutReviewTotal");
  if (!list || !totalEl) return;

  const entries = Object.entries(loadCart());
  if (!entries.length) {
    list.innerHTML = `<li class="checkout-review-item" style="justify-content:center; color: var(--gray);">No items in cart.</li>`;
    totalEl.textContent = "0.00";
    return;
  }

  if (!productsLoaded) {
    list.innerHTML = `<li class="checkout-review-item" style="justify-content:center; color: var(--gray);">Loading live pricing...</li>`;
    totalEl.textContent = "0.00";
    return;
  }

  let total = 0;
  list.innerHTML = entries.map(([id, qty]) => {
    const product = PRODUCT_MAP[id];
    if (!product) return "";
    const line = Number(product.price || 0) * qty;
    total += line;
    return `<li class="checkout-review-item"><span>${safeText(product.name)} × ${qty}</span><span>${money(line)}</span></li>`;
  }).join("");
  totalEl.textContent = total.toFixed(2);
}

async function submitOrder(event) {
  if (event) event.preventDefault();

  const cart = filterCartToKnownProducts(loadCart());
  if (Object.keys(cart).length === 0) {
    showNotification("Cart is empty", "danger");
    return;
  }

  const button = $("#checkoutSubmitBtn");
  const errorEl = $("#checkoutError");
  const originalHtml = button?.innerHTML || "";

  if (button) {
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
  }

  const name = $("#checkoutName")?.value?.trim();
  const email = $("#checkoutEmail")?.value?.trim();
  const phone = $("#checkoutPhone")?.value?.trim();
  const address = $("#checkoutAddress")?.value?.trim();

  if (!name || !email || !phone || !address) {
    if (errorEl) errorEl.textContent = "Please complete all checkout fields.";
    if (button) {
      button.innerHTML = originalHtml;
      button.disabled = false;
    }
    return;
  }

  try {
    const token = window.Auth?.getToken?.();
    const data = await window.EMSApi.orders.create({
      name,
      email,
      phone,
      address,
      items: cart
    }, token);

    localStorage.removeItem(STORAGE_KEY);
    updateCartBadge();
    renderCart();
    $("#checkoutModal")?.classList.remove("active");
    if (errorEl) errorEl.textContent = "";

    showNotification("Stock confirmed. Order placed. Redirecting...", "success");
    localStorage.setItem("ems_last_order", JSON.stringify({
      orderId: data?.orderId || null,
      total: Number(data?.secureTotal || 0),
      email,
      status: "PENDING"
    }));

    const orderId = data?.orderId ? `?order_id=${encodeURIComponent(data.orderId)}` : "";
    window.location.href = `/html/thank-you.html${orderId}`;
  } catch (err) {
    if (errorEl) {
      if (err.status === 401 || err.status === 403) {
        errorEl.textContent = "Please log in to complete checkout.";
      } else {
        errorEl.textContent = err.message || "Order failed. Please try again.";
      }
    }
  } finally {
    if (button) {
      button.innerHTML = originalHtml;
      button.disabled = false;
    }
  }
}

function openProductModal(id) {
  const product = PRODUCT_MAP[id];
  if (!product) return;

  $("#modalProductName").textContent = product.name;
  $("#modalProductDescription").textContent = product.description;
  $("#modalProductPrice").textContent = money(product.price);
  $("#modalProductImage").src = product.image.src;
  $("#modalProductSku").textContent = product.stock_level > 0
    ? `${product.sku} • Stock: ${product.stock_level}`
    : `${product.sku} • Out of stock`;

  const badgeEl = $("#modalProductBadge");
  if (badgeEl) {
    badgeEl.textContent = product.badge || "";
    badgeEl.style.display = product.badge ? "inline-flex" : "none";
  }

  $("#modalProductFeatures").innerHTML = (product.bullets || [])
    .map((bullet) => `<li>${safeText(bullet)}</li>`)
    .join("");

  const modalAddButton = $("#modalAddToCart");
  if (modalAddButton) {
    const isOutOfStock = product.stock_level <= 0;
    modalAddButton.innerHTML = isOutOfStock
      ? '<i class="fa-solid fa-ban"></i> Item Unavailable'
      : '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
    modalAddButton.setAttribute("title", isOutOfStock ? "Item unavailable" : "Add to cart");
  }

  $("#productModal").dataset.productId = id;
  $("#modalBackdrop").classList.add("active");
  document.body.classList.add("no-scroll");
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.style.cssText = `position:fixed; bottom:20px; right:20px; background:var(--${type === "success" ? "success" : "danger"}); color:white; padding:12px 24px; border-radius:10px; z-index:9999; box-shadow:0 4px 12px rgba(0,0,0,0.15); font-weight:600;`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function closeMobileMenu() {
  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  if (!nav || !toggle) return;

  nav.classList.remove("nav-open");
  toggle.setAttribute("aria-expanded", "false");
}

function initMobileMenu() {
  const nav = $("#mainNav");
  const toggle = $("#menuToggle");
  if (!nav || !toggle) return;

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !nav.classList.contains("nav-open");
    nav.classList.toggle("nav-open", shouldOpen);
    toggle.setAttribute("aria-expanded", String(shouldOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 768 || !nav.classList.contains("nav-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeMobileMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

window.addToCart = addToCart;
window.changeCartQty = changeCartQty;
window.removeFromCart = removeFromCart;
window.openProductModal = openProductModal;

document.addEventListener("DOMContentLoaded", async () => {
  const needsCatalogData = Boolean($("#unifiedShopGrid") || $("#productGrid") || $("#stethGrid"));
  const needsCartUi = Boolean($("#cartItems") || $("#checkoutForm") || $("#cartBtn"));
  const shopSearchForm = $("#shopSearchForm");
  const shopSearchInput = $("#shopSearchInput");

  initTheme();
  initMobileMenu();

  if (needsCatalogData) {
    renderGrids(activeCategory);
  }

  if (needsCartUi) {
    updateCartBadge();
    renderCart();
  }

  if (needsCatalogData || needsCartUi) {
    await loadProducts();
  }

  $$(".cat-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      $$(".cat-btn").forEach((item) => item.classList.remove("active"));
      event.target.classList.add("active");
      renderGrids(event.target.dataset.category);
    });
  });

  shopSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    activeSearchQuery = shopSearchInput?.value?.trim() || "";
    renderGrids(activeCategory);
  });

  shopSearchInput?.addEventListener("search", () => {
    activeSearchQuery = shopSearchInput.value.trim();
    renderGrids(activeCategory);
  });

  $("#modalClose")?.addEventListener("click", () => {
    $("#modalBackdrop")?.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  $("#cartClose")?.addEventListener("click", () => {
    $("#cartDrawer")?.classList.remove("open");
    if ($("#cartOverlay")) $("#cartOverlay").style.display = "none";
  });

  $("#checkoutClose")?.addEventListener("click", () => {
    $("#checkoutModal")?.classList.remove("active");
  });

  $("#themeToggle")?.addEventListener("click", toggleTheme);
  $("#cartBtn")?.addEventListener("click", () => {
    $("#cartDrawer")?.classList.add("open");
    if ($("#cartOverlay")) $("#cartOverlay").style.display = "block";
  });
  $("#checkoutBtn")?.addEventListener("click", () => {
    $("#checkoutModal")?.classList.add("active");
  });
  $("#checkoutForm")?.addEventListener("submit", submitOrder);

  const checkoutBtn = $("#checkoutBtn");
  if (checkoutBtn) checkoutBtn.innerHTML = '<i class="fa-solid fa-clipboard-check"></i> Review Order';
  const checkoutSubmitBtn = $("#checkoutSubmitBtn");
  if (checkoutSubmitBtn) checkoutSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Place Order';

  $("#modalAddToCart")?.addEventListener("click", () => {
    const productId = $("#productModal")?.dataset.productId;
    const beforeCount = getCartQuantity(productId);
    addToCart(productId, 1);
    const afterCount = getCartQuantity(productId);
    if (afterCount === beforeCount) return;
    $("#modalBackdrop")?.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("status") === "cancel") {
    showNotification("Checkout canceled. Your order was not placed.", "danger");
    params.delete("status");
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }
});
