/* =========================================
   EMS Luxe Supply – Premium script.js
   ========================================= */

const STORAGE_KEY = 'ems_store_cart_v1';
const THEME_KEY = 'ems_theme_preference';

/* -------- AUTHENTIC PRODUCT DATA -------- */
const PRODUCTS = [
  {
    id: 'steth-littmann-classic',
    name: 'Classic Acoustic Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-CLASSIC',
    price: 109,
    badge: 'Best for Students',
    description: 'The Classic III delivers exceptional acoustic performance for general physical assessment. Trusted by medical students and professionals worldwide for its reliability and durability during demanding shifts.',
    bullets: [
      'Dual-head chestpiece with tunable diaphragm',
      'Latex-free tubing for allergy safety',
      'Comfort seal soft-sealing ear tips',
      'Next-generation tubing for longer life',
      '5-year manufacturer warranty included'
    ],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'steth-electronic',
    name: 'Electronic Noise-Reducing Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-ELECTRO',
    price: 289,
    badge: 'Critical Care',
    description: 'Engineered for loud environments with active ambient noise reduction. Amplifies heart and lung sounds up to 40x while filtering out background noise. Perfect for emergency response and critical care units.',
    bullets: [
      'Active ambient noise reduction technology',
      '4 adjustable volume settings',
      '50+ hours battery life on single charge',
      'Field-ready protective case included',
      'Audio recording and playback capable'
    ],
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'pants-5in1-tactical',
    name: '5-in-1 Tactical EMS Pants',
    category: 'Apparel',
    sku: 'EMS-PANTS-5IN1',
    price: 79,
    badge: 'New Arrival',
    description: 'Professional-grade tactical pants designed specifically for EMS professionals. Features reinforced stress points, multiple utility pockets, and moisture-wicking fabric for all-day comfort during demanding shifts.',
    bullets: [
      'Ripstop DWR water-resistant coating',
      'Reinforced knees and seat panels',
      'Dedicated shears and radio pockets',
      'Articulated knee design for mobility',
      'Machine washable, wrinkle-resistant'
    ],
    img: 'https://images.unsplash.com/photo-1542272617-08f08630329e?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'kit-student-starter',
    name: 'EMT/Paramedic Student Starter Kit',
    category: 'Kits',
    sku: 'EMS-KIT-STUDENT',
    price: 59,
    badge: 'Student Bundle',
    description: 'Complete starter kit aligned with NREMT coursework requirements. Includes all essential tools needed for skills labs, clinical rotations, and certification exams. Perfect gift for aspiring medics.',
    bullets: [
      'Premium leather glove pouch',
      'High-intensity LED penlight',
      'Professional trauma shears',
      'Quick-reference medical cards',
      'Durable nylon carry bag included'
    ],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'kit-low-sig-trauma',
    name: 'Low-Signature Trauma Pouch',
    category: 'Kits',
    sku: 'EMS-KIT-LOWSIG',
    price: 49,
    badge: 'Tactical Grade',
    description: 'Military-specification trauma pouch with silent operation hardware. Designed for tactical medical operations where noise discipline is critical. MOLLE compatible for versatile attachment options.',
    bullets: [
      'Low-profile stealth design',
      'Silent zipper pulls and hardware',
      'Internal elastic retention system',
      'Easy to clean and decontaminate',
      'MOLLE/PALS webbing compatible'
    ],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'tool-shears-ballistic',
    name: 'Ballistic-Rated Trauma Shears',
    category: 'Tools',
    sku: 'EMS-TOOL-SHEARS',
    price: 19,
    badge: 'Essential Tool',
    description: 'Professional trauma shears with tungsten carbide cutting edge. Capable of cutting through denim, leather, seatbelts, and layered clothing. Safety blunt tip protects patients during emergency use.',
    bullets: [
      'Tungsten carbide serrated edge',
      'Blunt safety tip design',
      'Rust-resistant titanium coating',
      'Textured non-slip grip handles',
      'Lifetime replacement warranty'
    ],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  }
];

/* ---------- THEME MANAGEMENT ---------- */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon(newTheme);
  
  // Add animation effect
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.style.animation = 'none';
    themeBtn.offsetHeight; /* trigger reflow */
    themeBtn.style.animation = 'rotate 0.5s ease';
  }
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    if (theme === 'dark') {
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Day Mode';
    } else {
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Night Mode';
    }
  }
}

/* ---------- HELPERS ---------- */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

const cartCount = (cart) => Object.values(cart).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);

const cartTotal = (cart) => Object.entries(cart).reduce((total, [id, qty]) => {
  const product = PRODUCTS.find(p => p.id === id);
  return product ? total + (product.price * qty) : total;
}, 0);

const money = (n) => (parseFloat(n) || 0).toLocaleString('en-US', { 
  style: 'currency', 
  currency: 'USD',
  minimumFractionDigits: 2
});

/* ---------- NOTIFICATION BOX ---------- */
function showNotification(message, type = 'success') {
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fa-solid ${icons[type]}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.4s ease reverse';
    setTimeout(() => notification.remove(), 400);
  }, 3500);
}

/* ---------- CART FUNCTIONS ---------- */
function addToCart(productId, quantity = 1) {
  const cart = loadCart();
  cart[productId] = (parseInt(cart[productId]) || 0) + quantity;
  saveCart(cart);
  updateCartBadge();
  showNotification('✓ Added to cart successfully!', 'success');
}

function removeFromCart(productId) {
  const cart = loadCart();
  delete cart[productId];
  saveCart(cart);
  updateCartBadge();
  renderCart();
  showNotification('Item removed from cart', 'info');
}

function updateQuantity(productId, change) {
  const cart = loadCart();
  if (cart[productId]) {
    cart[productId] = Math.max(0, parseInt(cart[productId]) + change);
    if (cart[productId] === 0) {
      delete cart[productId];
    }
    saveCart(cart);
    updateCartBadge();
    renderCart();
  }
}

function updateCartBadge() {
  const cart = loadCart();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = cartCount(cart);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
    
    // Add pulse animation when items added
    if (count > 0) {
      badge.style.animation = 'none';
      badge.offsetHeight;
      badge.style.animation = 'pulse 0.5s ease';
    }
  }
}

/* ---------- CART DRAWER ---------- */
function openCart() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (backdrop && drawer) {
    backdrop.classList.add('active');
    drawer.classList.add('active');
    renderCart();
  }
}

function closeCart() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (backdrop && drawer) {
    backdrop.classList.remove('active');
    drawer.classList.remove('active');
  }
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cart = loadCart();
  
  if (!cartItems) return;
  
  const entries = Object.entries(cart);
  
  if (entries.length === 0) {
    cartItems.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--gray);">
        <i class="fa-solid fa-cart-arrow-down" style="font-size: 60px; margin-bottom: 20px; opacity: 0.5;"></i>
        <p style="font-size: 18px;">Your cart is empty</p>
        <p style="font-size: 14px; margin-top: 10px;">Add some premium gear to get started!</p>
      </div>
    `;
    if (cartTotalEl) cartTotalEl.textContent = money(0);
    return;
  }
  
  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return '';
    
    return `
      <div class="cart-item">
        <img src="${product.img}" alt="${product.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${product.name}</div>
          <div class="cart-item-price">${money(product.price)}</div>
          <div class="cart-item-quantity">
            <button onclick="updateQuantity('${product.id}', -1)">-</button>
            <span style="font-weight: 700; color: var(--text-color);">${qty}</span>
            <button onclick="updateQuantity('${product.id}', 1)">+</button>
            <button class="cart-item-remove" onclick="removeFromCart('${product.id}')" title="Remove">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  if (cartTotalEl) {
    cartTotalEl.textContent = money(cartTotal(cart));
  }
}

/* ---------- PRODUCT DETAILS MODAL ---------- */
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('productModal');
  
  if (!backdrop || !modal) return;
  
  // Populate modal content
  document.getElementById('modalProductImage').src = product.img;
  document.getElementById('modalProductImage').alt = product.name;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = money(product.price);
  document.getElementById('modalProductSku').textContent = `SKU: ${product.sku}`;
  document.getElementById('modalProductDescription').textContent = product.description;
  document.getElementById('modalProductBadge').textContent = product.badge || '';
  document.getElementById('modalProductBadge').style.display = product.badge ? 'inline-block' : 'none';
  
  // Features list
  const featuresList = document.getElementById('modalProductFeatures');
  if (product.bullets && product.bullets.length > 0) {
    featuresList.innerHTML = product.bullets.map(f => `<li>${f}</li>`).join('');
    featuresList.parentElement.style.display = 'block';
  } else {
    featuresList.parentElement.style.display = 'none';
  }
  
  // Store current product ID for add to cart
  modal.dataset.productId = productId;
  
  // Show modal with animation
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  showNotification('Product details loaded', 'info');
}

function closeProductModal() {
  const backdrop = document.getElementById('modalBackdrop');
  
  if (backdrop) {
    backdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function addProductFromModal() {
  const modal = document.getElementById('productModal');
  const productId = modal.dataset.productId;
  
  if (productId) {
    addToCart(productId, 1);
    closeProductModal();
    setTimeout(() => openCart(), 500);
  }
}

/* ---------- PRODUCT RENDERER ---------- */
function renderProductsInto(mount, category) {
  if (!mount) return;
  
  const list = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;
  
  mount.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-top">
        <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
        <div class="tag">${p.category}</div>
      </div>
      <div class="card-inner">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${p.description.substring(0, 120)}...</p>
        <ul class="small" style="margin: 15px 0; padding-left: 20px;">
          ${p.bullets ? p.bullets.slice(0, 3).map(b => `<li>${b}</li>`).join('') : ''}
        </ul>
        <div class="price-row">
          <div>
            <div class="price">${money(p.price)}</div>
            <div class="small">${p.sku}</div>
          </div>
          ${p.badge ? `<div class="pill">${p.badge}</div>` : '<div></div>'}
        </div>
        <div class="card-actions">
          <button class="btn secondary" onclick="openProductModal('${p.id}')" title="View Details">
            <i class="fa-solid fa-eye"></i> Details
          </button>
          <button class="btn" onclick="addToCart('${p.id}', 1)" title="Add to Cart">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderAll() {
  const productGrid = document.getElementById('productGrid');
  const gridStethoscopes = document.getElementById('gridStethoscopes');
  const gridKits = document.getElementById('gridKits');
  const gridApparel = document.getElementById('gridApparel');
  const gridTools = document.getElementById('gridTools');
  
  renderProductsInto(productGrid, null);
  renderProductsInto(gridStethoscopes, 'Stethoscopes');
  renderProductsInto(gridKits, 'Kits');
  renderProductsInto(gridApparel, 'Apparel');
  renderProductsInto(gridTools, 'Tools');
}

/* ---------- MOBILE NAV ---------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isHidden = nav.style.display === 'none' || nav.style.display === '';
      nav.style.display = isHidden ? 'flex' : 'none';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'var(--header-bg)';
      nav.style.padding = '20px';
      nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    });
  }
}

/* ---------- INITIALIZATION ---------- */
function main() {
  // Initialize theme
  initTheme();
  
  // Render products
  renderAll();
  updateCartBadge();
  initMobileNav();
  
  // Cart button events
  const cartBtn = document.getElementById('cartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    const cart = loadCart();
    if (Object.keys(cart).length === 0) {
      showNotification('⚠ Your cart is empty!', 'error');
    } else {
      showNotification(`✓ Proceeding to checkout - ${money(cartTotal(cart))}`, 'success');
    }
  });
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Modal close events
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalAddToCart = document.getElementById('modalAddToCart');
  
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);
  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  if (modalAddToCart) modalAddToCart.addEventListener('click', addProductFromModal);
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCart();
    }
  });
  
  // Add pulse animation keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
  
  console.log('🏥 EMS Luxe Store initialized successfully!');
  console.log('🌙 Theme:', localStorage.getItem(THEME_KEY) || 'light');
  console.log('🛒 Cart items:', cartCount(loadCart()));
}

/* Bootstrap */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
