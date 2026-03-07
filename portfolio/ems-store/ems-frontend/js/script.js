/* =========================================
   EMS Luxe Supply – Global script.js
   Works for: index, shop, stethoscopes, trust, etc.
   ========================================= */

"use strict";

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = "ems_store_cart_v1";
const THEME_KEY   = "ems_theme_preference";

/* ---------- PRODUCT DATA ---------- */
const PRODUCTS = [
  {
    id: "steth-littmann-classic",
    name: "Classic Acoustic Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-CLASSIC",
    price: 109,
    badge: "Best for Students",
    description:
      "Everyday acoustic performance for EMTs and students. Tunable diaphragm, reliable build, and field-ready comfort.",
    bullets: [
      "Dual-head chestpiece with tunable diaphragm",
      "Latex-free, durable tubing",
      "Soft-seal ear tips for comfort",
      "5-year manufacturer warranty"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1655313719493-16ebe4906441?auto=format&fit=crop&w=1200&q=80",
      alt: "Classic acoustic stethoscope on a clinical desk",
      title: "Classic acoustic stethoscope",
      keywords: ["stethoscope", "EMT gear", "student ready"]
    }
  },
  {
    id: "steth-electronic",
    name: "Electronic Noise-Reducing Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-ELECTRO",
    price: 289,
    badge: "Critical Care",
    description:
      "Electronic stethoscope with active noise reduction to cut through sirens and engine noise in the field.",
    bullets: [
      "Active ambient-noise suppression",
      "Up to 40× sound amplification",
      "4 volume profiles",
      "Protective field case included"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      alt: "Electronic stethoscope on a desk",
      title: "Electronic critical-care stethoscope",
      keywords: ["electronic stethoscope", "critical care", "noise cancel"]
    }
  },
  {
    id: "kit-student-starter",
    name: "EMT / Paramedic Student Starter Kit",
    category: "Kits",
    sku: "EMS-KIT-STUDENT",
    price: 59,
    badge: "Student Bundle",
    description:
      "Starter kit aligned with EMT / paramedic coursework: shears, penlight, tape, pupil gauge, and pocket tools.",
    bullets: [
      "Built around NREMT skills checklists",
      "Includes trauma shears and penlight",
      "Compact belt-ready pouch",
      "Ideal for labs and ride-alongs"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      alt: "Compact EMS student starter kit",
      title: "Student starter trauma kit",
      keywords: ["student kit", "emt starter", "training gear"]
    }
  },
  {
    id: "pants-5in1-tactical",
    name: "5-in-1 Tactical EMS Pants",
    category: "Apparel",
    sku: "EMS-PANTS-5IN1",
    price: 79,
    badge: "New Arrival",
    description:
      "Reinforced tactical pants with shears, radio, and glove pockets. Built for long shifts and rough calls.",
    bullets: [
      "Ripstop fabric with DWR coating",
      "Reinforced knees and seat",
      "Dedicated shears & radio pockets",
      "Wrinkle-resistant, machine washable"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
      alt: "Tactical EMS pants hanging on a rack",
      title: "5-in-1 tactical EMS pants",
      keywords: ["tactical pants", "ems apparel"]
    }
  },
  {
    id: "pack-response-backpack",
    name: "Rapid Response Jump Backpack",
    category: "Kits",
    sku: "EMS-PACK-JUMP",
    price: 189,
    badge: "Agency Favorite",
    description:
      "Modular EMS backpack with internal organizers for airways, IV, and trauma gear. Built for first-due rigs.",
    bullets: [
      "High-visibility reflective trim",
      "MOLLE webbing and side handles",
      "Internal color-coded dividers",
      "Abrasion-resistant base panel"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=1200&q=80",
      alt: "Red EMS trauma backpack on the floor",
      title: "Rapid response EMS backpack",
      keywords: ["jump bag", "trauma pack"]
    }
  },
  {
    id: "tool-shears-ballistic",
    name: "Ballistic-Rated Trauma Shears",
    category: "Tools",
    sku: "EMS-TOOL-SHEARS",
    price: 19,
    badge: "Essential Tool",
    description:
      "Hardened trauma shears designed to cut denim, leather, and seatbelts without losing edge.",
    bullets: [
      "Tungsten-carbide serrated edge",
      "Blunt safety tip for patient protection",
      "Non-slip grip handles",
      "Lifetime replacement warranty"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1668853060178-2d53667b7345?auto=format&fit=crop&w=1200&q=80",
      alt: "Black and teal trauma shears on an orange background",
      title: "Ballistic-rated trauma shears",
      keywords: ["trauma shears", "cut clothing", "field tool"]
    }
  }
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

/* ---------- HELPERS ---------- */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const money = (n) =>
  (parseFloat(n) || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

/* ---------- THEME (DAY / NIGHT) ---------- */
/* CSS uses same dark-gold palette for both states; this just flips icon/text + stores choice */

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
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
  if (text) text.textContent = theme === "dark" ? "Day Mode" : "Night Mode";
}

/* ---------- CART STORAGE ---------- */

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function cartCount(cart) {
  return Object.values(cart).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0);
}

function cartTotal(cart) {
  return Object.entries(cart).reduce((total, [id, qty]) => {
    const p = PRODUCT_MAP[id];
    return p ? total + p.price * (parseInt(qty, 10) || 0) : total;
  }, 0);
}

/* ---------- NOTIFICATIONS ---------- */

function showNotification(message, type = "success") {
  $$(".notification").forEach(n => n.remove());

  const icons = {
    success: "fa-check-circle",
    error:   "fa-exclamation-circle",
    info:    "fa-info-circle"
  };

  const n = document.createElement("div");
  n.className = `notification ${type}`;
  n.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
  document.body.appendChild(n);

  setTimeout(() => {
    n.style.animation = "slideOut 0.3s forwards";
    setTimeout(() => n.remove(), 260);
  }, 2800);
}

/* ---------- CART OPERATIONS ---------- */

function updateCartBadge() {
  const badge = $("#cartBadge");
  if (!badge) return;
  const count = cartCount(loadCart());
  badge.textContent = count;
  badge.style.display = count ? "flex" : "none";
}

function addToCart(productId, quantity = 1) {
  const cart = loadCart();
  cart[productId] = (parseInt(cart[productId], 10) || 0) + quantity;
  saveCart(cart);
  updateCartBadge();
  showNotification("Added to cart", "success");
}

function removeFromCart(productId) {
  const cart = loadCart();
  delete cart[productId];
  saveCart(cart);
  updateCartBadge();
  renderCart();
  showNotification("Item removed", "info");
}

function changeCartQty(productId, delta) {
  const cart = loadCart();
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] <= 0) delete cart[productId];
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

/* ---------- CART DRAWER ---------- */

function renderCart() {
  const body    = $("#cartItems");
  const totalEl = $("#cartTotal");
  if (!body || !totalEl) return;

  const cart    = loadCart();
  const entries = Object.entries(cart);

  if (!entries.length) {
    body.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-arrow-down"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    totalEl.textContent = money(0);
    return;
  }

  body.innerHTML = entries.map(([id, qty]) => {
    const p = PRODUCT_MAP[id];
    if (!p) return "";
    const img = p.image?.src || "";
    const alt = p.image?.alt || p.name;
    return `
      <div class="cart-item">
        <img src="${img}" alt="${alt}" loading="lazy">
        <div class="cart-item-details">
          <div class="cart-item-title">${p.name}</div>
          <div class="cart-item-price">${money(p.price)}</div>
          <div class="cart-item-quantity">
            <button onclick="changeCartQty('${id}', -1)">−</button>
            <span>${qty}</span>
            <button onclick="changeCartQty('${id}', 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart('${id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = money(cartTotal(cart));
}

function openCart() {
  $("#cartBackdrop")?.classList.add("active");
  $("#cartDrawer")?.classList.add("active");
  document.body.classList.add("no-scroll");
  renderCart();
}

function closeCart() {
  $("#cartBackdrop")?.classList.remove("active");
  $("#cartDrawer")?.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

/* ---------- PRODUCT MODAL ---------- */

function openProductModal(productId) {
  const p = PRODUCT_MAP[productId];
  if (!p) return;

  const imgEl   = $("#modalProductImage");
  const nameEl  = $("#modalProductName");
  const priceEl = $("#modalProductPrice");
  const skuEl   = $("#modalProductSku");
  const descEl  = $("#modalProductDescription");
  const badgeEl = $("#modalProductBadge");
  const featsEl = $("#modalProductFeatures");
  const kwEl    = $("#modalProductKeywords");

  const imgSrc   = p.image?.src || "";
  const imgAlt   = p.image?.alt || p.name;
  const imgTitle = p.image?.title || p.name;

  if (imgEl) {
    imgEl.src   = imgSrc;
    imgEl.alt   = imgAlt;
    imgEl.title = imgTitle;
  }
  if (nameEl)  nameEl.textContent  = p.name;
  if (priceEl) priceEl.textContent = money(p.price);
  if (skuEl)   skuEl.textContent   = `SKU: ${p.sku}`;
  if (descEl)  descEl.textContent  = p.description;

  if (badgeEl) {
    if (p.badge) {
      badgeEl.textContent = p.badge;
      badgeEl.style.display = "inline-block";
    } else {
      badgeEl.style.display = "none";
    }
  }

  if (featsEl) {
    featsEl.innerHTML = p.bullets.map(b => `<li>${b}</li>`).join("");
  }

  if (kwEl && p.image?.keywords) {
    kwEl.innerHTML = p.image.keywords
      .map(k => `<span class="keyword-chip">${k}</span>`)
      .join("");
  }

  const modal = $("#productModal");
  if (modal) modal.dataset.productId = productId;

  $("#modalBackdrop")?.classList.add("active");
  document.body.classList.add("no-scroll");
}

/* Backwards compatibility if some old HTML calls openModal(id) */
function openModal(productId) {
  openProductModal(productId);
}

function closeProductModal() {
  $("#modalBackdrop")?.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

/* ---------- PRODUCT GRID RENDERING ---------- */

function productCardHTML(p) {
  const shortDesc =
    p.description.length > 130
      ? p.description.slice(0, 128) + "…"
      : p.description;

  const imgSrc   = p.image?.src || "";
  const imgAlt   = p.image?.alt || p.name;
  const imgTitle = p.image?.title || p.name;
  const keywords = p.image?.keywords || [];

  return `
    <article class="card">
      <div class="card-top">
        <img src="${imgSrc}" alt="${imgAlt}" title="${imgTitle}"
             class="product-img" loading="lazy">
        <div class="tag">${p.category}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${shortDesc}</p>
        ${
          keywords.length
            ? `<div class="keyword-row">
                 ${keywords.map(k => `<span class="keyword-chip">${k}</span>`).join("")}
               </div>`
            : ""
        }
        <ul class="small feature-list-compact">
          ${p.bullets.slice(0, 3).map(b => `<li>${b}</li>`).join("")}
        </ul>
        <div class="price-row">
          <div>
            <div class="price">${money(p.price)}</div>
            <div class="small">${p.sku}</div>
          </div>
          ${p.badge ? `<div class="pill">${p.badge}</div>` : "<div></div>"}
        </div>
        <div class="card-actions">
          <button class="btn secondary" onclick="openProductModal('${p.id}')">
            <i class="fa-solid fa-eye"></i> Details
          </button>
          <button class="btn" onclick="addToCart('${p.id}', 1)">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProductsInto(container, category = null) {
  if (!container) return;
  const list = category
    ? PRODUCTS.filter(p => p.category === category)
    : PRODUCTS;
  container.innerHTML = list.map(productCardHTML).join("");
}

function renderAllGrids() {
  // Safe to call even if some containers don't exist on a page
  renderProductsInto($("#productGrid"));
  renderProductsInto($("#gridStethoscopes"), "Stethoscopes");
  renderProductsInto($("#gridKits"),          "Kits");
  renderProductsInto($("#gridApparel"),       "Apparel");
  renderProductsInto($("#gridTools"),         "Tools");
}

/* ---------- MOBILE NAV ---------- */

function initMobileNav() {
  const toggle = $("#menuToggle");
  const nav    = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("nav-open");
    toggle.classList.toggle("active");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.classList.remove("active");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("nav-open");
      toggle.classList.remove("active");
    }
  });
}

/* ---------- INIT ---------- */

function main() {
  initTheme();
  renderAllGrids();        // harmless if page has no product grid
  updateCartBadge();
  initMobileNav();

  const themeToggle  = $("#themeToggle");
  const cartBtn      = $("#cartBtn");
  const cartClose    = $("#cartClose");
  const cartBackdrop = $("#cartBackdrop");
  const checkoutBtn  = $("#checkoutBtn");
  const modalBackdrop = $("#modalBackdrop");
  const modalClose    = $("#modalClose");
  const modalAdd      = $("#modalAddToCart");

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  if (cartBtn)      cartBtn.addEventListener("click", openCart);
  if (cartClose)    cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", (e) => {
    if (e.target === cartBackdrop) closeCart();
  });
  if (checkoutBtn)  checkoutBtn.addEventListener("click", () => {
    const cart = loadCart();
    if (!Object.keys(cart).length) {
      showNotification("Cart is empty", "error");
    } else {
      showNotification(`Checkout — ${money(cartTotal(cart))}`, "success");
    }
  });

  if (modalBackdrop) modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeProductModal();
  });
  if (modalClose)   modalClose.addEventListener("click", closeProductModal);
  if (modalAdd)     modalAdd.addEventListener("click", () => {
    const modal = $("#productModal");
    if (!modal) return;
    const id = modal.dataset.productId;
    if (!id) return;
    addToCart(id, 1);
    closeProductModal();
    setTimeout(openCart, 220);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductModal();
      closeCart();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}