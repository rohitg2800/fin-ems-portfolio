/* =========================================
   EMS Luxe Supply – Global script.js
   Production-ready: all pages
   ========================================= */

"use strict";

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = "ems_store_cart_v1";
const THEME_KEY = "ems_theme_preference";

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
      src: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80",
      alt: "Stethoscope lying beside medical textbooks and study materials",
      title: "Student-ready classic stethoscope",
      keywords: ["EMT student", "nursing textbooks", "study gear"]
    }
  },
  {
    id: "steth-electronic",
    name: "Electronic Noise-Reducing Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-ELECTRO",
    price: 289,
    badge: "Best in Loud Environments",
    description:
      "Electronic stethoscope with active noise reduction to cut through sirens and engine noise in the field.",
    bullets: [
      "Active ambient-noise suppression",
      "Up to 40× sound amplification",
      "Four volume profiles tuned for loud rigs",
      "Protective field case included"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
      alt: "Interior of an EMS helicopter with medical equipment",
      title: "Stethoscope tuned for loud EMS environments",
      keywords: ["ambulance", "helicopter EMS", "loud environment"]
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
      "Starter kit aligned with EMT and paramedic coursework: shears, penlight, tape, pupil gauge, and pocket tools.",
    bullets: [
      "Built around NREMT skills checklists",
      "Includes trauma shears and penlight",
      "Compact belt-ready pouch",
      "Ideal for labs and ride-alongs"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1200&q=80",
      alt: "Medical kit with stethoscope, scissors, and diagnostic tools",
      title: "Complete student starter kit for EMT training",
      keywords: ["student kit", "EMT training", "starter bundle"]
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
      alt: "Dark tactical pants hanging on a clothing rack",
      title: "5-in-1 tactical EMS pants",
      keywords: ["tactical pants", "ems uniform", "duty wear"]
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
      alt: "Red EMS trauma backpack on station floor",
      title: "Rapid response EMS backpack",
      keywords: ["jump bag", "trauma pack", "response bag"]
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
      alt: "Black and teal trauma shears on orange background",
      title: "Ballistic-rated trauma shears",
      keywords: ["trauma shears", "cut clothing", "field tool"]
    }
  }
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

/* ---------- HELPERS ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const money = (n) =>
  (parseFloat(n) || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

/* ---------- THEME (DAY / NIGHT) ---------- */

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeUI(theme);
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
  const toggle = $("#themeToggle");
  
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  if (text) {
    text.textContent = theme === "dark" ? "Light" : "Dark";
  }
  if (toggle) {
    toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  }
}

/* ---------- CART STORAGE ---------- */

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.warn("Cart load failed:", err);
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Cart save failed:", err);
    showNotification("Unable to save cart", "error");
  }
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
  // Remove existing notifications
  $$(".notification").forEach((n) => n.remove());

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle"
  };

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "polite");
  notification.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);

  // Auto-dismiss
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s forwards";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ---------- CART OPERATIONS ---------- */

function updateCartBadge() {
  const badge = $("#cartBadge");
  const cartBtn = $("#cartBtn");
  if (!badge) return;
  
  const count = cartCount(loadCart());
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
  
  if (cartBtn) {
    cartBtn.setAttribute("aria-label", `Shopping cart, ${count} item${count !== 1 ? "s" : ""}`);
  }
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCT_MAP[productId];
  if (!product) {
    showNotification("Product not found", "error");
    return;
  }
  
  const cart = loadCart();
  cart[productId] = (parseInt(cart[productId], 10) || 0) + quantity;
  saveCart(cart);
  updateCartBadge();
  showNotification(`${product.name} added to cart`, "success");
}

function removeFromCart(productId) {
  const cart = loadCart();
  const product = PRODUCT_MAP[productId];
  
  delete cart[productId];
  saveCart(cart);
  updateCartBadge();
  renderCart();
  
  if (product) {
    showNotification(`${product.name} removed`, "info");
  }
}

function changeCartQty(productId, delta) {
  const cart = loadCart();
  if (!cart[productId]) return;
  
  cart[productId] = (parseInt(cart[productId], 10) || 0) + delta;
  
  if (cart[productId] <= 0) {
    delete cart[productId];
  }
  
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

/* ---------- CART DRAWER ---------- */

function renderCart() {
  const body = $("#cartItems");
  const totalEl = $("#cartTotal");
  if (!body || !totalEl) return;

  const cart = loadCart();
  const entries = Object.entries(cart);

  if (!entries.length) {
    body.innerHTML = `
      <div class="empty-cart">
        <i class="fa-solid fa-cart-arrow-down" aria-hidden="true"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    totalEl.textContent = money(0);
    return;
  }

  body.innerHTML = entries
    .map(([id, qty]) => {
      const p = PRODUCT_MAP[id];
      if (!p) return "";
      
      const img = p.image?.src || "https://placehold.co/100x100/572403/ffd977?text=EMS";
      const alt = p.image?.alt || p.name;
      
      return `
        <div class="cart-item">
          <img src="${img}" alt="${alt}" loading="lazy" width="80" height="80">
          <div class="cart-item-details">
            <div class="cart-item-title">${p.name}</div>
            <div class="cart-item-price">${money(p.price)}</div>
            <div class="cart-item-quantity">
              <button onclick="changeCartQty('${id}', -1)" aria-label="Decrease quantity">−</button>
              <span aria-label="Quantity">${qty}</span>
              <button onclick="changeCartQty('${id}', 1)" aria-label="Increase quantity">+</button>
              <button class="cart-item-remove" onclick="removeFromCart('${id}')" aria-label="Remove ${p.name}">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  totalEl.textContent = money(cartTotal(cart));
}

function openCart() {
  const backdrop = $("#cartBackdrop");
  const drawer = $("#cartDrawer");
  
  if (backdrop) backdrop.classList.add("active");
  if (drawer) {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
  }
  
  document.body.classList.add("no-scroll");
  renderCart();
  
  // Focus first interactive element
  setTimeout(() => {
    const firstBtn = drawer?.querySelector("button");
    if (firstBtn) firstBtn.focus();
  }, 100);
}

function closeCart() {
  const backdrop = $("#cartBackdrop");
  const drawer = $("#cartDrawer");
  
  if (backdrop) backdrop.classList.remove("active");
  if (drawer) {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
  }
  
  document.body.classList.remove("no-scroll");
  
  // Return focus to cart button
  const cartBtn = $("#cartBtn");
  if (cartBtn) cartBtn.focus();
}

/* ---------- PRODUCT MODAL ---------- */

function openProductModal(productId) {
  const p = PRODUCT_MAP[productId];
  if (!p) {
    showNotification("Product not found", "error");
    return;
  }

  const modal = $("#productModal");
  const backdrop = $("#modalBackdrop");

  if (!modal || !backdrop) {
    showNotification("Product details not available on this page", "info");
    return;
  }

  // Populate modal content
  const imgEl = $("#modalProductImage");
  const nameEl = $("#modalProductName");
  const priceEl = $("#modalProductPrice");
  const skuEl = $("#modalProductSku");
  const descEl = $("#modalProductDescription");
  const badgeEl = $("#modalProductBadge");
  const featsEl = $("#modalProductFeatures");

  const imgSrc = p.image?.src || "https://placehold.co/800x600/572403/ffd977?text=EMS";
  const imgAlt = p.image?.alt || p.name;
  const imgTitle = p.image?.title || p.name;

  if (imgEl) {
    imgEl.src = imgSrc;
    imgEl.alt = imgAlt;
    imgEl.title = imgTitle;
  }
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = money(p.price);
  if (skuEl) skuEl.textContent = p.sku;
  if (descEl) descEl.textContent = p.description;

  if (badgeEl) {
    if (p.badge) {
      badgeEl.textContent = p.badge;
      badgeEl.style.display = "inline-block";
    } else {
      badgeEl.style.display = "none";
    }
  }

  if (featsEl) {
    featsEl.innerHTML = p.bullets.map((b) => `<li>${b}</li>`).join("");
  }

  // Store product ID for add to cart
  modal.dataset.productId = productId;

  // Show modal
  backdrop.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  // Focus close button
  setTimeout(() => {
    const closeBtn = $("#modalClose");
    if (closeBtn) closeBtn.focus();
  }, 100);
}

function closeProductModal() {
  const backdrop = $("#modalBackdrop");
  const modal = $("#productModal");
  
  if (backdrop) backdrop.classList.remove("active");
  if (modal) modal.setAttribute("aria-hidden", "true");
  
  document.body.classList.remove("no-scroll");
}

/* Backward compatibility alias */
window.openModal = openProductModal;

/* ---------- PRODUCT GRID RENDERING ---------- */

function productCardHTML(p) {
  const shortDesc =
    p.description.length > 130 ? p.description.slice(0, 128) + "…" : p.description;

  const imgSrc = p.image?.src || "https://placehold.co/600x400/572403/ffd977?text=EMS";
  const imgAlt = p.image?.alt || p.name;
  const imgTitle = p.image?.title || p.name;
  const keywords = p.image?.keywords || [];

  return `
    <article class="card" role="listitem">
      <div class="card-top">
        <img src="${imgSrc}" alt="${imgAlt}" title="${imgTitle}"
             class="product-img" loading="lazy" width="600" height="400">
        <div class="tag">${p.category}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${shortDesc}</p>
        ${
          keywords.length
            ? `<div class="keyword-row">
                 ${keywords.map((k) => `<span class="keyword-chip">${k}</span>`).join("")}
               </div>`
            : ""
        }
        <ul class="small feature-list-compact">
          ${p.bullets.slice(0, 3).map((b) => `<li>${b}</li>`).join("")}
        </ul>
        <div class="price-row">
          <div>
            <div class="price">${money(p.price)}</div>
            <div class="small">${p.sku}</div>
          </div>
          ${p.badge ? `<div class="pill">${p.badge}</div>` : "<div></div>"}
        </div>
        <div class="card-actions">
          <button class="btn secondary" onclick="openProductModal('${p.id}')" aria-label="View ${p.name} details">
            <i class="fa-solid fa-eye" aria-hidden="true"></i> Details
          </button>
          <button class="btn" onclick="addToCart('${p.id}', 1)" aria-label="Add ${p.name} to cart">
            <i class="fa-solid fa-cart-plus" aria-hidden="true"></i> Add
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProductsInto(container, category = null) {
  if (!container) return;
  
  const list = category
    ? PRODUCTS.filter((p) => p.category === category)
    : PRODUCTS;
  
  container.innerHTML = list.map(productCardHTML).join("");
}

function renderAllGrids() {
  renderProductsInto($("#productGrid"));
  renderProductsInto($("#gridStethoscopes"), "Stethoscopes");
  renderProductsInto($("#gridKits"), "Kits");
  renderProductsInto($("#gridApparel"), "Apparel");
  renderProductsInto($("#gridTools"), "Tools");
}

/* ---------- MOBILE NAV ---------- */

function initMobileNav() {
  const toggle = $("#menuToggle");
  const nav = $(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.classList.toggle("active");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close on link click
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("nav-open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- INIT ---------- */

function main() {
  initTheme();
  renderAllGrids();
  updateCartBadge();
  initMobileNav();

  // Event listeners
  const themeToggle = $("#themeToggle");
  const cartBtn = $("#cartBtn");
  const cartClose = $("#cartClose");
  const cartBackdrop = $("#cartBackdrop");
  const checkoutBtn = $("#checkoutBtn");
  const modalBackdrop = $("#modalBackdrop");
  const modalClose = $("#modalClose");
  const modalAdd = $("#modalAddToCart");

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", (e) => {
      if (e.target === cartBackdrop) closeCart();
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = loadCart();
      const total = cartTotal(cart);
      
      if (total === 0) {
        showNotification("Your cart is empty", "error");
      } else {
        showNotification(`Proceeding to checkout — ${money(total)}`, "success");
        // In production: window.location.href = "/checkout";
      }
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeProductModal();
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeProductModal);
  
  if (modalAdd) {
    modalAdd.addEventListener("click", () => {
      const modal = $("#productModal");
      if (!modal) return;
      
      const productId = modal.dataset.productId;
      if (!productId) return;
      
      addToCart(productId, 1);
      closeProductModal();
      setTimeout(openCart, 250);
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductModal();
      closeCart();
    }
  });

  // Optional: Best stethoscopes pill buttons (if present on page)
  $$(".emt-steth-buttons .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      const productMap = {
        students: "steth-littmann-classic",
        loud: "steth-electronic",
        comfort: "steth-littmann-classic"
      };
      
      if (productMap[target]) {
        openProductModal(productMap[target]);
      }
    });
  });
}

// Initialize when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
