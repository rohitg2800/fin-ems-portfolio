/* =========================================
   EMS Luxe Supply — full script.js
   Refreshed March 2026
   ========================================= */

const STORAGE_KEY = 'ems_store_cart_v1';
const THEME_KEY   = 'ems_theme_preference';

/* ----------  PRODUCT DATA  ---------- */
const PRODUCTS = [
  {
    id: 'steth-littmann-classic',
    name: 'Classic Acoustic Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-CLASSIC',
    price: 109,
    badge: 'Best for Students',
    description:
      'The Classic III delivers exceptional acoustic performance for general physical assessment. Trusted worldwide.',
    bullets: [
      'Dual-head chestpiece with tunable diaphragm',
      'Latex-free, next-gen tubing',
      'Comfort-seal ear tips',
      '5-year manufacturer warranty'
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1655313719493-16ebe4906441?w=1200&auto=format&fit=crop&q=80',
      alt: 'Classic acoustic stethoscope for EMT students and paramedics',
      title: 'Professional EMS acoustic stethoscope',
      keywords: ['stethoscope', 'EMS equipment', 'paramedic gear', 'medical diagnostics']
    }
  },
  {
    id: 'steth-electronic',
    name: 'Electronic Noise-Reducing Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-ELECTRO',
    price: 289,
    badge: 'Critical Care',
    description:
      'Active noise reduction amplifies heart and lung sounds up to 40× — perfect for loud environments.',
    bullets: [
      'Active ambient-noise suppression',
      '4 volume settings',
      '50 h battery on one charge',
      'Field case included'
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&auto=format&fit=crop&q=80',
      alt: 'Electronic stethoscope for critical-care EMS diagnostics',
      title: 'Noise-reducing electronic stethoscope',
      keywords: ['electronic stethoscope', 'critical care tools', 'ems diagnostics']
    }
  },
  /* …additional products here (unchanged structure)… */
];

/* ----------  QUICK LOOKUP MAP  ---------- */
const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map(p => [p.id, p])
);

/* ----------  UTILITY  ---------- */
const $ = selector => document.querySelector(selector);
const money = n =>
  (parseFloat(n) || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

/* ----------  THEME  ---------- */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.dataset.theme = saved;
  updateThemeUI(saved);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  updateThemeUI(next);
}

function updateThemeUI(theme) {
  $('#themeIcon').className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  $('#themeText').textContent = theme === 'dark' ? 'Day Mode' : 'Night Mode';
}

/* ----------  CART HELPERS  ---------- */
const loadCart   = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
const saveCart   = cart => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
const cartCount  = cart => Object.values(cart).reduce((n, q) => n + q, 0);
const cartTotal  = cart =>
  Object.entries(cart).reduce((t, [id, q]) => t + (PRODUCT_MAP[id]?.price || 0) * q, 0);

function updateCartBadge() {
  const c = cartCount(loadCart());
  const badge = $('#cartBadge');
  badge.textContent = c;
  badge.style.display = c ? 'flex' : 'none';
}

/* ----------  NOTIFY  ---------- */
function notify(msg, type = 'success') {
  document.querySelectorAll('.notification').forEach(n => n.remove());
  const box = document.createElement('div');
  box.className = `notification ${type}`;
  box.innerHTML = `<i class="fa-solid ${{
    success: 'fa-check-circle',
    error:   'fa-exclamation-circle',
    info:    'fa-info-circle'
  }[type] || 'fa-info-circle'}"></i><span>${msg}</span>`;
  document.body.append(box);
  setTimeout(() => {
    box.style.animation = 'slideOut .3s forwards';
    setTimeout(() => box.remove(), 290);
  }, 2800);
}

/* ----------  CART ACTIONS  ---------- */
function addToCart(id, qty = 1) {
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  updateCartBadge();
  notify('Added to cart', 'success');
}

function updateQty(id, delta) {
  const cart = loadCart();
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

function removeItem(id) {
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

/* ----------  RENDER CART  ---------- */
function renderCart() {
  const el  = $('#cartItems');
  const tot = $('#cartTotal');
  const cart = loadCart();
  const list = Object.entries(cart);

  if (!list.length) {
    el.innerHTML = `<div class="empty-cart">
      <i class="fa-solid fa-cart-arrow-down"></i><p>Your cart is empty</p>
    </div>`;
    tot.textContent = money(0);
    return;
  }

  el.innerHTML = list.map(([id, q]) => {
    const p = PRODUCT_MAP[id];
    return `<div class="cart-item">
      <img src="${p.image.src}" alt="${p.image.alt}" loading="lazy">
      <div class="cart-item-details">
        <div class="cart-item-title">${p.name}</div>
        <div class="cart-item-price">${money(p.price)}</div>
        <div class="cart-item-quantity">
          <button onclick="updateQty('${id}',-1)">−</button>
          <span>${q}</span>
          <button onclick="updateQty('${id}',1)">+</button>
          <button class="cart-item-remove" onclick="removeItem('${id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  tot.textContent = money(cartTotal(cart));
}

/* ----------  CART DRAWER  ---------- */
function openCart() {
  $('#cartBackdrop').classList.add('active');
  $('#cartDrawer').classList.add('active');
  document.body.classList.add('no-scroll');
  renderCart();
}
function closeCart() {
  $('#cartBackdrop').classList.remove('active');
  $('#cartDrawer').classList.remove('active');
  document.body.classList.remove('no-scroll');
}

/* ----------  PRODUCT MODAL  ---------- */
function openModal(id) {
  const p   = PRODUCT_MAP[id];
  const mod = $('#productModal');
  mod.dataset.productId = id;

  $('#modalProductImage').src   = p.image.src;
  $('#modalProductImage').alt   = p.image.alt;
  $('#modalProductImage').title = p.image.title;
  $('#modalProductName').textContent  = p.name;
  $('#modalProductPrice').textContent = money(p.price);
  $('#modalProductSku').textContent   = `SKU: ${p.sku}`;
  $('#modalProductDescription').textContent = p.description;
  $('#modalProductBadge').textContent = p.badge || '';
  $('#modalProductBadge').style.display = p.badge ? 'inline-block' : 'none';
  $('#modalProductFeatures').innerHTML =
    p.bullets.map(b => `<li>${b}</li>`).join('');
  $('#modalProductKeywords').innerHTML =
    p.image.keywords.map(k => `<span class="keyword-chip">${k}</span>`).join('');

  $('#modalBackdrop').classList.add('active');
  document.body.classList.add('no-scroll');
}
function closeModal() {
  $('#modalBackdrop').classList.remove('active');
  document.body.classList.remove('no-scroll');
}

/* ----------  RENDER PRODUCTS  ---------- */
function productCard(p) {
  const short = p.description.length > 120 ? p.description.slice(0,118) + '…' : p.description;
  return `<article class="card">
    <div class="card-top">
      <img src="${p.image.src}" alt="${p.image.alt}" title="${p.image.title}"
           class="product-img" loading="lazy">
      <div class="tag">${p.category}</div>
    </div>
    <div class="card-inner">
      <h3 class="card-title">${p.name}</h3>
      <p class="card-text">${short}</p>
      <div class="keyword-row">
        ${p.image.keywords.map(k => `<span class="keyword-chip">${k}</span>`).join('')}
      </div>
      <ul class="small feature-list-compact">
        ${p.bullets.slice(0,3).map(b => `<li>${b}</li>`).join('')}
      </ul>
      <div class="price-row">
        <div>
          <div class="price">${money(p.price)}</div>
          <div class="small">${p.sku}</div>
        </div>
        ${p.badge ? `<div class="pill">${p.badge}</div>` : '<div></div>'}
      </div>
      <div class="card-actions">
        <button class="btn secondary" onclick="openModal('${p.id}')">
          <i class="fa-solid fa-eye"></i> Details
        </button>
        <button class="btn" onclick="addToCart('${p.id}',1)">
          <i class="fa-solid fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  </article>`;
}

function renderInto(mount, cat = null) {
  if (!mount) return;
  const list = cat ? PRODUCTS.filter(p => p.category === cat) : PRODUCTS;
  mount.innerHTML = list.map(productCard).join('');
}

function renderAll() {
  renderInto($('#productGrid'));
  renderInto($('#gridStethoscopes'), 'Stethoscopes');
  renderInto($('#gridKits'),        'Kits');
  renderInto($('#gridApparel'),     'Apparel');
  renderInto($('#gridTools'),       'Tools');
}

/* ----------  NAV MOBILE  ---------- */
function initNav() {
  const navBtn = $('#menuToggle');
  const nav    = $('.nav');
  if (!navBtn || !nav) return;

  navBtn.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    navBtn.classList.toggle('active');
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      navBtn.classList.remove('active');
    })
  );
  window.addEventListener('resize', () => {
    if (innerWidth > 768) {
      nav.classList.remove('nav-open');
      navBtn.classList.remove('active');
    }
  });
}

/* ----------  INIT  ---------- */
function init() {
  initTheme();
  renderAll();
  updateCartBadge();
  initNav();

  /* bind buttons */
  $('#cartBtn')     ?.addEventListener('click', openCart);
  $('#cartClose')   ?.addEventListener('click', closeCart);
  $('#cartBackdrop')?.addEventListener('click', e => e.target.id === 'cartBackdrop' && closeCart());
  $('#checkoutBtn') ?.addEventListener('click', () => {
    const cart = loadCart();
    notify(Object.keys(cart).length ? `Checkout – ${money(cartTotal(cart))}` : 'Cart is empty', Object.keys(cart).length ? 'success' : 'error');
  });

  $('#themeToggle') ?.addEventListener('click', toggleTheme);

  $('#modalBackdrop')?.addEventListener('click', e => e.target.id === 'modalBackdrop' && closeModal());
  $('#modalClose')   ?.addEventListener('click', closeModal);
  $('#modalAddToCart')?.addEventListener('click', () => {
    addToCart($('#productModal').dataset.productId,1);
    closeModal();
    setTimeout(openCart, 250);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeCart(); }
  });
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();