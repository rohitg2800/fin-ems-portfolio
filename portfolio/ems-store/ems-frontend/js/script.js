/* =========================================
   EMS Luxe Supply – Global script.js
   Shop + Stethoscopes + Trust
   ========================================= */

"use strict";

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = "ems_store_cart_v1";
const THEME_KEY = "ems_theme_preference";

/* ---------- PRODUCT DATA ---------- */
const PRODUCTS = [
  // ====== STETHOSCOPES ======
  {
    id: "steth-littmann-classic",
    name: "Classic Acoustic Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-CLASSIC",
    price: 109,
    badge: "Best for Students",
    filters: ["all", "students", "comfort"],
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
      title: "Student-ready classic stethoscope"
    }
  },
  {
    id: "steth-electronic",
    name: "Electronic Noise-Reducing Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-ELECTRO",
    price: 289,
    badge: "Best in Loud Environments",
    filters: ["all", "loud"],
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
      title: "Stethoscope tuned for loud EMS environments"
    }
  },
  {
    id: "steth-cardiology-pro",
    name: "Cardiology Pro Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-CARDIO",
    price: 199,
    badge: "Premium",
    filters: ["all", "comfort"],
    description:
      "Advanced stethoscope designed for detailed cardiac assessment. Superior acoustics with lightweight, ergonomic design.",
    bullets: [
      "Advanced dual-frequency tuning system",
      "Precision crafted diaphragm for clear heart sounds",
      "Extra-soft silicone ear tips",
      "Lifetime quality guarantee"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      alt: "Premium stethoscope on medical surface",
      title: "Cardiology professional stethoscope"
    }
  },
  {
    id: "steth-universal-pro",
    name: "Universal Pro Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-UNIVERSAL",
    price: 149,
    badge: "Versatile",
    filters: ["all", "students", "loud", "comfort"],
    description:
      "All-purpose stethoscope for any environment. Balanced acoustics, durability, and comfort for extended use.",
    bullets: [
      "Universal diaphragm compatible",
      "Reinforced Y-tube construction",
      "Color-coded tubing for organization",
      "10-year manufacturer warranty"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1631217314831-e489b5cfd246?auto=format&fit=crop&w=1200&q=80",
      alt: "Professional multi-use stethoscope",
      title: "Universal pro stethoscope"
    }
  },
  {
    id: "steth-lightweight-student",
    name: "Lightweight Student Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-STUDENT",
    price: 69,
    badge: "Budget Pick",
    filters: ["all", "students"],
    description:
      "Affordable, lightweight stethoscope ideal for skills labs, clinicals, and early ride-alongs.",
    bullets: [
      "Lightweight aluminum chestpiece",
      "Comfortable PVC tubing",
      "Color options for student cohorts",
      "1-year limited warranty"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1613141411232-0f5e1e93a3e7?auto=format&fit=crop&w=1200&q=80",
      alt: "Blue lightweight stethoscope on clipboard",
      title: "Lightweight student stethoscope"
    }
  },
  {
    id: "steth-rig-duty",
    name: "Rig-Duty Hybrid Stethoscope",
    category: "Stethoscopes",
    sku: "EMS-STETH-RIG",
    price: 159,
    badge: "Rig Favorite",
    filters: ["all", "loud", "comfort"],
    description:
      "Hybrid acoustic design tuned for use in ambulances and helicopters with improved isolation.",
    bullets: [
      "Angled headset for secure fit while moving",
      "Thicker acoustic tubing to block exterior noise",
      "Reinforced yoke for long-term durability",
      "Includes spare ear tips and ID tag"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      alt: "Stethoscope hanging in an ambulance",
      title: "Rig-duty hybrid stethoscope"
    }
  },

  // ====== KITS ======
  {
    id: "kit-student-starter",
    name: "EMT / Paramedic Student Starter Kit",
    category: "Kits",
    sku: "EMS-KIT-STUDENT",
    price: 59,
    badge: "Student Bundle",
    filters: ["all"],
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
      title: "Complete student starter kit for EMT training"
    }
  },
  {
    id: "pack-response-backpack",
    name: "Rapid Response Jump Backpack",
    category: "Kits",
    sku: "EMS-PACK-JUMP",
    price: 189,
    badge: "Agency Favorite",
    filters: ["all"],
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
      title: "Rapid response EMS backpack"
    }
  },

  // ====== APPAREL ======
  {
    id: "pants-5in1-tactical",
    name: "5-in-1 Tactical EMS Pants",
    category: "Apparel",
    sku: "EMS-PANTS-5IN1",
    price: 79,
    badge: "New Arrival",
    filters: ["all"],
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
      title: "5-in-1 tactical EMS pants"
    }
  },

  // ====== TOOLS ======
  {
    id: "tool-shears-ballistic",
    name: "Ballistic-Rated Trauma Shears",
    category: "Tools",
    sku: "EMS-TOOL-SHEARS",
    price: 19,
    badge: "Essential Tool",
    filters: ["all"],
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
      title: "Ballistic-rated trauma shears"
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
  try {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeUI(theme);
  } catch (err) {
    console.warn("Theme init failed:", err);
  }
}

function toggleTheme() {
  try {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeUI(next);
  } catch (err) {
    console.error("Theme toggle failed:", err);
  }
}

function updateThemeUI(theme) {
  const icon = $("#themeIcon");
  const text = $("#themeText");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  if (text) {
    text.textContent = theme === "dark" ? "Light" : "Dark";
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
  try {
    $$(".notification").forEach((n) => n.remove());

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");
    notification.innerHTML = `
      <i class="fa-solid ${
        type === "success"
          ? "fa-check-circle"
          : type === "error"
          ? "fa-exclamation-circle"
          : "fa-info-circle"
      }" aria-hidden="true"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  } catch (err) {
    console.error("Notification failed:", err);
  }
}

/* ---------- CART OPERATIONS ---------- */

function updateCartBadge() {
  try {
    const badge = $("#cartBadge");
    if (!badge) return;
    const count = cartCount(loadCart());
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  } catch (err) {
    console.warn("Cart badge update failed:", err);
  }
}

function addToCart(productId, quantity = 1) {
  try {
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
  } catch (err) {
    console.error("Add to cart failed:", err);
    showNotification("Error adding to cart", "error");
  }
}

function removeFromCart(productId) {
  try {
    const cart = loadCart();
    const product = PRODUCT_MAP[productId];
    delete cart[productId];
    saveCart(cart);
    updateCartBadge();
    renderCart();
    if (product) {
      showNotification(`${product.name} removed`, "info");
    }
  } catch (err) {
    console.error("Remove from cart failed:", err);
  }
}

function changeCartQty(productId, delta) {
  try {
    const cart = loadCart();
    if (!cart[productId]) return;
    cart[productId] = (parseInt(cart[productId], 10) || 0) + delta;
    if (cart[productId] <= 0) delete cart[productId];
    saveCart(cart);
    updateCartBadge();
    renderCart();
  } catch (err) {
    console.error("Change cart quantity failed:", err);
  }
}

/* ---------- CART RENDERING ---------- */

function renderCart() {
  try {
    const body = $("#cartItems");
    const totalEl = $("#cartTotal");
    if (!body || !totalEl) return;

    const cart = loadCart();
    const entries = Object.entries(cart);

    if (!entries.length) {
      body.innerHTML = `
        <div class="empty-cart">
          <i class="fa-solid fa-cart-shopping"></i>
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
            <img src="${img}" alt="${alt}" loading="lazy" width="90" height="90">
            <div style="flex: 1;">
              <div class="cart-item-title">${p.name}</div>
              <div class="cart-item-price">${money(p.price)}</div>
              <div class="cart-item-quantity">
                <button onclick="changeCartQty('${id}', -1)" aria-label="Decrease quantity">−</button>
                <span>${qty}</span>
                <button onclick="changeCartQty('${id}', 1)" aria-label="Increase quantity">+</button>
                <button class="cart-item-remove" onclick="removeFromCart('${id}')" aria-label="Remove ${p.name}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    totalEl.textContent = money(cartTotal(cart));
  } catch (err) {
    console.error("Render cart failed:", err);
  }
}

function openCart() {
  try {
    const backdrop = $("#cartBackdrop");
    const drawer = $("#cartDrawer");
    if (backdrop) backdrop.classList.add("active");
    if (drawer) drawer.classList.add("active");
    document.body.classList.add("no-scroll");
    renderCart();
  } catch (err) {
    console.error("Open cart failed:", err);
  }
}

function closeCart() {
  try {
    const backdrop = $("#cartBackdrop");
    const drawer = $("#cartDrawer");
    if (backdrop) backdrop.classList.remove("active");
    if (drawer) drawer.classList.remove("active");
    document.body.classList.remove("no-scroll");
  } catch (err) {
    console.error("Close cart failed:", err);
  }
}

/* ---------- PRODUCT MODAL ---------- */

function openProductModal(productId) {
  try {
    const p = PRODUCT_MAP[productId];
    if (!p) {
      showNotification("Product not found", "error");
      return;
    }

    const modal = $("#productModal");
    const backdrop = $("#modalBackdrop");
    if (!modal || !backdrop) return;

    const imgEl = $("#modalProductImage");
    const nameEl = $("#modalProductName");
    const priceEl = $("#modalProductPrice");
    const skuWrapper = $("#modalProductSku");
    const descEl = $("#modalProductDescription");
    const badgeEl = $("#modalProductBadge");
    const featsEl = $("#modalProductFeatures");

    const imgSrc = p.image?.src || "https://placehold.co/800x600/572403/ffd977?text=EMS";
    const imgAlt = p.image?.alt || p.name;

    if (imgEl) {
      imgEl.src = imgSrc;
      imgEl.alt = imgAlt;
      if (p.image?.title) imgEl.title = p.image.title;
    }
    if (nameEl) nameEl.textContent = p.name;
    if (priceEl) priceEl.textContent = money(p.price);

    if (skuWrapper) {
      if (skuWrapper.tagName === "SPAN") {
        skuWrapper.textContent = p.sku;
      } else {
        skuWrapper.textContent = `SKU: ${p.sku}`;
      }
    }

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

    modal.dataset.productId = productId;
    backdrop.classList.add("active");
    document.body.classList.add("no-scroll");
  } catch (err) {
    console.error("Open modal failed:", err);
  }
}

function closeProductModal() {
  try {
    const backdrop = $("#modalBackdrop");
    if (backdrop) backdrop.classList.remove("active");
    document.body.classList.remove("no-scroll");
  } catch (err) {
    console.error("Close modal failed:", err);
  }
}

/* ---------- FILTERING (Stethoscopes page) ---------- */

let currentFilter = "all";

function filterProducts(filterName) {
  try {
    currentFilter = filterName;
    $$(".filter-btn").forEach((btn) => {
      const isActive = btn.dataset.filter === filterName;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });
    renderProducts();
  } catch (err) {
    console.error("Filter products failed:", err);
  }
}

/* ---------- PRODUCT CARD HTML ---------- */

function productCardHTML(p) {
  const shortDesc =
    p.description.length > 130 ? p.description.slice(0, 128) + "…" : p.description;
  const imgSrc = p.image?.src || "https://placehold.co/600x400/572403/ffd977?text=EMS";
  const imgAlt = p.image?.alt || p.name;

  return `
    <article class="card" role="listitem">
      <div class="card-top">
        <img src="${imgSrc}" alt="${imgAlt}" class="product-img" loading="lazy" width="600" height="400">
        <div class="tag">${p.category}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${shortDesc}</p>
        <ul class="feature-list-compact">
          ${p.bullets.slice(0, 3).map((b) => `<li>${b}</li>`).join("")}
        </ul>
        <div class="price-row">
          <div>
            <div class="price">${money(p.price)}</div>
            <div class="sku-small">${p.sku}</div>
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

/* ---------- PRODUCT RENDERING FOR ALL PAGES ---------- */

function renderProducts() {
  try {
    const homeGrid = $("#productGrid");
    const stethPageGrid = $("#stethGrid");

    const gridStethoscopes = $("#gridStethoscopes");
    const gridKits = $("#gridKits");
    const gridApparel = $("#gridApparel");
    const gridTools = $("#gridTools");

    // SHOP PAGE: category grids
    if (gridStethoscopes || gridKits || gridApparel || gridTools) {
      if (gridStethoscopes) {
        const items = PRODUCTS.filter((p) => p.category === "Stethoscopes");
        gridStethoscopes.innerHTML = items.map(productCardHTML).join("");
      }
      if (gridKits) {
        const items = PRODUCTS.filter((p) => p.category === "Kits");
        gridKits.innerHTML = items.map(productCardHTML).join("");
      }
      if (gridApparel) {
        const items = PRODUCTS.filter((p) => p.category === "Apparel");
        gridApparel.innerHTML = items.map(productCardHTML).join("");
      }
      if (gridTools) {
        const items = PRODUCTS.filter((p) => p.category === "Tools");
        gridTools.innerHTML = items.map(productCardHTML).join("");
      }
      return;
    }

    // STETHOSCOPES PAGE: only stethoscopes + filters
    if (stethPageGrid) {
      const items = PRODUCTS.filter((p) => {
        if (p.category !== "Stethoscopes") return false;
        if (currentFilter === "all") return true;
        return p.filters && p.filters.includes(currentFilter);
      });
      stethPageGrid.innerHTML = items.map(productCardHTML).join("");
      return;
    }

    // HOME PAGE: generic Featured grid
    if (homeGrid) {
      // show a subset (first 4) as "featured"
      const featured = PRODUCTS.slice(0, 4);
      homeGrid.innerHTML = featured.map(productCardHTML).join("");
    }
  } catch (err) {
    console.error("Render products failed:", err);
  }
}

/* ---------- MOBILE NAV ---------- */

function initMobileNav() {
  try {
    const toggle = $("#menuToggle");
    const nav = $("#mainNav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  } catch (err) {
    console.warn("Mobile nav init failed:", err);
  }
}

/* ---------- INIT ---------- */

function main() {
  try {
    initTheme();
    initMobileNav();
    renderProducts();
    updateCartBadge();

    const themeToggle   = $("#themeToggle");
    const cartBtn       = $("#cartBtn");
    const cartClose     = $("#cartClose");
    const cartBackdrop  = $("#cartBackdrop");
    const modalBackdrop = $("#modalBackdrop");
    const modalClose    = $("#modalClose");
    const modalAdd      = $("#modalAddToCart");
    const checkoutBtn   = $("#checkoutBtn");

    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
    if (cartBtn)      cartBtn.addEventListener("click", openCart);
    if (cartClose)    cartClose.addEventListener("click", closeCart);
    if (cartBackdrop) {
      cartBackdrop.addEventListener("click", (e) => {
        if (e.target === cartBackdrop) closeCart();
      });
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeProductModal();
      });
    }
    if (modalClose)   modalClose.addEventListener("click", closeProductModal);
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
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const cart = loadCart();
        const total = cartTotal(cart);
        if (total === 0) {
          showNotification("Your cart is empty", "error");
        } else {
          showNotification(`Proceeding to checkout — ${money(total)}`, "success");
        }
      });
    }

    // Stethoscope filter buttons
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterProducts(btn.dataset.filter);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeProductModal();
        closeCart();
      }
    });
  } catch (err) {
    console.error("Main init failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
