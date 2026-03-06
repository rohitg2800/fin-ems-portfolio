/* =========================================
   EMS Luxe Supply – Complete script.js
   All Pages Unified
   ========================================= */

const STORAGE_KEY = 'ems_store_cart_v1';
const THEME_KEY = 'ems_theme_preference';

const PRODUCTS = [
  {
    id: 'steth-littmann-classic',
    name: 'Classic Acoustic Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-CLASSIC',
    price: 109,
    badge: 'Best for Students',
    description: 'The Classic III delivers exceptional acoustic performance for general physical assessment. Trusted by medical students and professionals worldwide.',
    bullets: ['Dual-head chestpiece with tunable diaphragm', 'Latex-free tubing for allergy safety', 'Comfort seal soft-sealing ear tips', 'Next-generation tubing for longer life', '5-year manufacturer warranty included'],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'steth-electronic',
    name: 'Electronic Noise-Reducing Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-ELECTRO',
    price: 289,
    badge: 'Critical Care',
    description: 'Engineered for loud environments with active ambient noise reduction. Amplifies heart and lung sounds up to 40x.',
    bullets: ['Active ambient noise reduction technology', '4 adjustable volume settings', '50+ hours battery life on single charge', 'Field-ready protective case included', 'Audio recording and playback capable'],
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'pants-5in1-tactical',
    name: '5-in-1 Tactical EMS Pants',
    category: 'Apparel',
    sku: 'EMS-PANTS-5IN1',
    price: 79,
    badge: 'New Arrival',
    description: 'Professional-grade tactical pants designed specifically for EMS professionals. Features reinforced stress points.',
    bullets: ['Ripstop DWR water-resistant coating', 'Reinforced knees and seat panels', 'Dedicated shears and radio pockets', 'Articulated knee design for mobility', 'Machine washable, wrinkle-resistant'],
    img: 'https://images.unsplash.com/photo-1542272617-08f08630329e?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'kit-student-starter',
    name: 'EMT/Paramedic Student Starter Kit',
    category: 'Kits',
    sku: 'EMS-KIT-STUDENT',
    price: 59,
    badge: 'Student Bundle',
    description: 'Complete starter kit aligned with NREMT coursework requirements. Includes all essential tools needed.',
    bullets: ['Premium leather glove pouch', 'High-intensity LED penlight', 'Professional trauma shears', 'Quick-reference medical cards', 'Durable nylon carry bag included'],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'kit-low-sig-trauma',
    name: 'Low-Signature Trauma Pouch',
    category: 'Kits',
    sku: 'EMS-KIT-LOWSIG',
    price: 49,
    badge: 'Tactical Grade',
    description: 'Military-specification trauma pouch with silent operation hardware. Designed for tactical medical operations.',
    bullets: ['Low-profile stealth design', 'Silent zipper pulls and hardware', 'Internal elastic retention system', 'Easy to clean and decontaminate', 'MOLLE/PALS webbing compatible'],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  },
  {
    id: 'tool-shears-ballistic',
    name: 'Ballistic-Rated Trauma Shears',
    category: 'Tools',
    sku: 'EMS-TOOL-SHEARS',
    price: 19,
    badge: 'Essential Tool',
    description: 'Professional trauma shears with tungsten carbide cutting edge. Capable of cutting through denim and leather.',
    bullets: ['Tungsten carbide serrated edge', 'Blunt safety tip design', 'Rust-resistant titanium coating', 'Textured non-slip grip handles', 'Lifetime replacement warranty'],
    img: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop&q=80'
  }
];

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
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (themeText) themeText.textContent = theme === 'dark' ? 'Day Mode' : 'Night Mode';
  }
}

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

const saveCart = (cart) => localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
const cartCount = (cart) => Object.values(cart).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
const cartTotal = (cart) => Object.entries(cart).reduce((total, [id, qty]) => {
  const product = PRODUCTS.find(p => p.id === id);
  return product ? total + (product.price * qty) : total;
}, 0);
const money = (n) => (parseFloat(n) || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

function showNotification(message, type = 'success') {
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<i class="fa-solid ${icons[type]}"></i><span>${message}</span>`;
  notification.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:10px;z-index:1000;animation:slideIn 0.4s ease;display:flex;align-items:center;gap:12px;box-shadow:0 5px 20px rgba(0,0,0,0.3);font-weight:600;border:2px solid var(--accent);background:${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : 'var(--primary)'};color:white;`;
  document.body.appendChild(notification);
  setTimeout(() => { notification.style.animation = 'slideIn 0.4s ease reverse'; setTimeout(() => notification.remove(), 400); }, 3500);
}

function addToCart(productId, quantity = 1) {
  const cart = loadCart();
  cart[productId] = (parseInt(cart[productId]) || 0) + quantity;
  saveCart(cart);
  updateCartBadge();
  showNotification('✓ Added to cart!', 'success');
}

function removeFromCart(productId) {
  const cart = loadCart();
  delete cart[productId];
  saveCart(cart);
  updateCartBadge();
  renderCart();
  showNotification('Item removed', 'info');
}

function updateQuantity(productId, change) {
  const cart = loadCart();
  if (cart[productId]) {
    cart[productId] = Math.max(0, parseInt(cart[productId]) + change);
    if (cart[productId] === 0) delete cart[productId];
    saveCart(cart);
    updateCartBadge();
    renderCart();
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = cartCount(loadCart());
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

function openCart() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (backdrop && drawer) { backdrop.classList.add('active'); drawer.classList.add('active'); renderCart(); }
}

function closeCart() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (backdrop && drawer) { backdrop.classList.remove('active'); drawer.classList.remove('active'); }
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cart = loadCart();
  if (!cartItems) return;
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    cartItems.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--gray);"><i class="fa-solid fa-cart-arrow-down" style="font-size:60px;margin-bottom:20px;opacity:0.5;"></i><p>Your cart is empty</p></div>';
    if (cartTotalEl) cartTotalEl.textContent = money(0);
    return;
  }
  cartItems.innerHTML = entries.map(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return '';
    return `<div class="cart-item"><img src="${product.img}" alt="${product.name}"><div class="cart-item-details"><div class="cart-item-title">${product.name}</div><div class="cart-item-price">${money(product.price)}</div><div class="cart-item-quantity"><button onclick="updateQuantity('${product.id}',-1)">-</button><span>${qty}</span><button onclick="updateQuantity('${product.id}',1)">+</button><button class="cart-item-remove" onclick="removeFromCart('${product.id}')"><i class="fa-solid fa-trash"></i></button></div></div></div>`;
  }).join('');
  if (cartTotalEl) cartTotalEl.textContent = money(cartTotal(cart));
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('productModal');
  if (!backdrop || !modal) return;
  document.getElementById('modalProductImage').src = product.img;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = money(product.price);
  document.getElementById('modalProductSku').textContent = `SKU: ${product.sku}`;
  document.getElementById('modalProductDescription').textContent = product.description;
  const badge = document.getElementById('modalProductBadge');
  if (badge) { badge.textContent = product.badge || ''; badge.style.display = product.badge ? 'inline-block' : 'none'; }
  const featuresList = document.getElementById('modalProductFeatures');
  if (featuresList) {
    if (product.bullets && product.bullets.length > 0) {
      featuresList.innerHTML = product.bullets.map(f => `<li>${f}</li>`).join('');
      featuresList.parentElement.style.display = 'block';
    } else { featuresList.parentElement.style.display = 'none'; }
  }
  modal.dataset.productId = productId;
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const backdrop = document.getElementById('modalBackdrop');
  if (backdrop) { backdrop.classList.remove('active'); document.body.style.overflow = 'auto'; }
}

function addProductFromModal() {
  const modal = document.getElementById('productModal');
  const productId = modal.dataset.productId;
  if (productId) { addToCart(productId, 1); closeProductModal(); setTimeout(() => openCart(), 500); }
}

function renderProductsInto(mount, category) {
  if (!mount) return;
  const list = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;
  mount.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-top"><img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy"><div class="tag">${p.category}</div></div>
      <div class="card-inner">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-text">${p.description.substring(0, 120)}...</p>
        <ul class="small" style="margin:15px 0;padding-left:20px;">${p.bullets ? p.bullets.slice(0,3).map(b => `<li>${b}</li>`).join('') : ''}</ul>
        <div class="price-row"><div><div class="price">${money(p.price)}</div><div class="small">${p.sku}</div></div>${p.badge ? `<div class="pill">${p.badge}</div>` : '<div></div>'}</div>
        <div class="card-actions"><button class="btn secondary" onclick="openProductModal('${p.id}')"><i class="fa-solid fa-eye"></i> Details</button><button class="btn" onclick="addToCart('${p.id}',1)"><i class="fa-solid fa-cart-plus"></i> Add</button></div>
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
  if (productGrid) renderProductsInto(productGrid, null);
  if (gridStethoscopes) renderProductsInto(gridStethoscopes, 'Stethoscopes');
  if (gridKits) renderProductsInto(gridKits, 'Kits');
  if (gridApparel) renderProductsInto(gridApparel, 'Apparel');
  if (gridTools) renderProductsInto(gridTools, 'Tools');
}

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
      nav.style.zIndex = '99';
    });
  }
}

function main() {
  console.log('🏥 EMS Luxe Store initializing...');
  initTheme();
  renderAll();
  updateCartBadge();
  initMobileNav();
  
  const cartBtn = document.getElementById('cartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    const cart = loadCart();
    if (Object.keys(cart).length === 0) { showNotification('⚠ Cart is empty!', 'error'); }
    else { showNotification(`✓ Checkout - ${money(cartTotal(cart))}`, 'success'); }
  });
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalAddToCart = document.getElementById('modalAddToCart');
  
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductModal);
  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  if (modalAddToCart) modalAddToCart.addEventListener('click', addProductFromModal);
  
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeProductModal(); closeCart(); } });
  
  console.log('✅ EMS Luxe Store initialized!');
  console.log('🌙 Theme:', localStorage.getItem(THEME_KEY) || 'light');
  console.log('🛒 Cart items:', cartCount(loadCart()));
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', main); }
else { main(); }
