const STORAGE_KEY = 'ems_store_cart_v1';

/** @typedef {{id:string, name:string, category:string, price:number, sku:string, description:string, bullets:string[], badge?:string}} Product */

/** @type {Product[]} */
const PRODUCTS = [
  {
    id: 'steth-littmann-classic',
    name: 'Classic Acoustic Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-CLASSIC',
    price: 109.0,
    badge: 'Best for students',
    description: 'Reliable everyday acoustics with durable tubing for academy rotations and busy shifts.',
    bullets: ['Dual-head chestpiece', 'Tunable diaphragm', 'Latex-free', 'Comfort ear tips'],
  },
  {
    id: 'steth-electronic',
    name: 'Electronic Noise-Reducing Stethoscope',
    category: 'Stethoscopes',
    sku: 'EMS-STETH-ELECTRO',
    price: 289.0,
    badge: 'Critical care',
    description: 'Built for loud rigs and critical assessments with amplified heart and lung sounds.',
    bullets: ['Noise reduction', 'Volume modes', 'Battery powered', 'Field-ready case'],
  },
  {
    id: 'pants-5in1-tactical',
    name: '5‑in‑1 Tactical EMS Pants',
    category: 'Apparel',
    sku: 'EMS-PANTS-5IN1',
    price: 79.0,
    badge: 'New',
    description: 'Reinforced knees/seat, low-noise hardware, and tool pockets designed for fast draws.',
    bullets: ['Ripstop DWR', 'Gusseted crotch', 'Shears + radio pocket', 'Articulated fit'],
  },
  {
    id: 'kit-student-starter',
    name: 'EMT/Paramedic Student Starter Kit',
    category: 'Kits',
    sku: 'EMS-KIT-STUDENT',
    price: 59.0,
    badge: 'Bundle',
    description: 'Essentials-only loadout aligned to coursework checklists and skills labs.',
    bullets: ['Glove pouch', 'Penlight', 'Trauma shears', 'Reference cards'],
  },
  {
    id: 'kit-low-sig-trauma',
    name: 'Low‑Signature Trauma Pouch',
    category: 'Kits',
    sku: 'EMS-KIT-LOWSIG',
    price: 49.0,
    badge: 'Tactical',
    description: 'Armor-compatible pouch layout with silent hardware and quick access organization.',
    bullets: ['Low-profile', 'Quiet pulls', 'Elastic retention', 'Easy cleaning'],
  },
  {
    id: 'tool-shears-ballistic',
    name: 'Ballistic‑Rated Trauma Shears',
    category: 'Tools',
    sku: 'EMS-TOOL-SHEARS',
    price: 19.0,
    description: 'Tough shears for denim, webbing, and layered clothing—built for the field.',
    bullets: ['Serrated edge', 'Blunt tip', 'Rust resistant', 'Grip texture'],
  },
];
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('active') && 
          !nav.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu when clicking nav links (for mobile)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});


/** @typedef {{[productId:string]: number}} Cart */

/** @returns {Cart} */
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

/** @param {Cart} cart */
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/** @param {Cart} cart */
function cartCount(cart) {
  return Object.values(cart).reduce((sum, n) => sum + (Number.isFinite(n) ? n : 0), 0);
}

/** @param {Cart} cart */
function cartTotal(cart) {
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) continue;
    total += p.price * qty;
  }
  return total;
}

function money(n) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, String(v));
  });
  for (const c of children) node.append(c);
  return node;
}

function getCategoryFilterFromPage() {
  const root = document.documentElement;
  const cat = root.getAttribute('data-category');
  return cat && cat.trim() ? cat.trim() : null;
}

function renderProductsInto(mount, category) {
  if (!mount) return;
  const list = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;

  mount.replaceChildren(
    ...list.map(p => {
      const top = el('div', { class: 'card-top' }, [
        el('div', { class: 'tag', text: p.category }),
      ]);
      const title = el('h3', { class: 'card-title', text: p.name });
      const text = el('p', { class: 'card-text', text: p.description });
      const bullets = el('ul', { class: 'small' }, p.bullets.map(b => el('li', { text: b })));
      const priceRow = el('div', { class: 'price-row' }, [
        el('div', {}, [
          el('div', { class: 'price', text: money(p.price) }),
          el('div', { class: 'small', text: p.sku }),
        ]),
        p.badge ? el('div', { class: 'pill', text: p.badge }) : el('div'),
      ]);
      const actions = el('div', { class: 'card-actions' }, [
        el('button', { class: 'btn secondary', type: 'button', onClick: () => quickView(p.id) }, [document.createTextNode('Details')]),
        el('button', { class: 'btn', type: 'button', onClick: () => addToCart(p.id, 1) }, [document.createTextNode('Add')]),
      ]);

      return el('article', { class: 'card' }, [
        top,
        el('div', { class: 'card-inner' }, [title, text, bullets, priceRow, actions]),
      ]);
    })
  );
}

function renderProducts() {
  const pageFilter = getCategoryFilterFromPage();
  const mainGrid = document.getElementById('productGrid');
  if (mainGrid) renderProductsInto(mainGrid, pageFilter);

  // Optional category mounts (shop page)
  renderProductsInto(document.getElementById('gridStethoscopes'), 'Stethoscopes');
  renderProductsInto(document.getElementById('gridKits'), 'Kits');
  renderProductsInto(document.getElementById('gridApparel'), 'Apparel');
  renderProductsInto(document.getElementById('gridTools'), 'Tools');
}

function updateCartUI() {
  const cart = loadCart();
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = String(cartCount(cart));

  const list = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = money(cartTotal(cart));

  if (!list) return;
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  if (ids.length === 0) {
    list.replaceChildren(el('div', { class: 'empty', text: 'Your cart is empty. Add a few field-tested essentials.' }));
    return;
  }

  list.replaceChildren(
    ...ids.map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return el('div');
      const qty = cart[id];

      return el('div', { class: 'line-item' }, [
        el('div', {}, [
          el('div', { class: 'line-name', text: p.name }),
          el('div', { class: 'line-meta', text: `${p.category} • ${money(p.price)} each` }),
        ]),
        el('div', { class: 'qty' }, [
          el('button', { type: 'button', 'aria-label': `Decrease ${p.name}`, onClick: () => addToCart(p.id, -1) }, [document.createTextNode('−')]),
          el('div', { class: 'line-name', text: String(qty) }),
          el('button', { type: 'button', 'aria-label': `Increase ${p.name}`, onClick: () => addToCart(p.id, 1) }, [document.createTextNode('+')]),
        ]),
      ]);
    }).filter(Boolean)
  );
}

function addToCart(productId, delta) {
  const cart = loadCart();
  const next = Math.max(0, (cart[productId] || 0) + delta);
  if (next === 0) delete cart[productId];
  else cart[productId] = next;
  saveCart(cart);
  updateCartUI();
}

function openCart() {
  document.getElementById('cartBackdrop')?.classList.add('open');
  document.getElementById('cartDrawer')?.classList.add('open');
  updateCartUI();
}
function closeCart() {
  document.getElementById('cartBackdrop')?.classList.remove('open');
  document.getElementById('cartDrawer')?.classList.remove('open');
}

function quickView(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const lines = [
    p.name,
    '',
    p.description,
    '',
    ...p.bullets.map(b => `• ${b}`),
    '',
    `Price: ${money(p.price)}`,
    `SKU: ${p.sku}`,
  ];
  alert(lines.join('\n'));
}

function wireCheckout() {
  const btn = document.getElementById('checkoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cart = loadCart();
    const count = cartCount(cart);
    if (count === 0) {
      alert('Your cart is empty.');
      return;
    }
    alert('Checkout demo: In a real store, this would go to Stripe/Shopify.\n\nFor now, your cart is saved locally so you can keep browsing.');
    closeCart();
  });
}

function wireNewsletter() {
  const form = document.getElementById('newsletterForm');
  const out = document.getElementById('newsletterOut');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (out) out.textContent = 'You’re in. We’ll send launch updates and field guides.';
    form.reset();
  });
}

function main() {
  renderProducts();
  updateCartUI();
  wireCheckout();
  wireNewsletter();

  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
else main();

