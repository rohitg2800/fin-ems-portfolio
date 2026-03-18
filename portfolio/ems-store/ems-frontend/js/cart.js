// GLOBAL CART FUNCTIONS
let cart = JSON.parse(localStorage.getItem('ems_cart') || '{}');

function getCart() { return cart; }
function saveCart() { localStorage.setItem('ems_cart', JSON.stringify(cart)); }

function addToCart(id, qty=1) {
  cart[id] = (cart[id] || 0) + qty;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
  updateCartBadge();
  showToast('Added to cart!', 'success');
}

function updateQty(id, delta) { addToCart(id, delta); }
function clearCart() {
  cart = {};
  saveCart();
  renderCart();
  updateCartBadge();
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    return sum + (PRODUCT_MAP[id]?.price * qty || 0);
  }, 0);
}

function getCartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function renderCart() {
  const itemsDiv = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');
  const modalTotal = document.getElementById('modalCartTotal');
  
  if (!Object.keys(cart).length) {
    itemsDiv.innerHTML = '<div style="text-align:center;padding:40px;color:#6c757d;"><i class="fa-solid fa-cart-shopping" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i><p>Your cart is empty</p></div>';
  } else {
    itemsDiv.innerHTML = Object.entries(cart).map(([id, qty]) => {
      const p = PRODUCT_MAP[id];
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <div style="font-size:12px;color:#6c757d;">${p.sku}</div>
          </div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="updateQty('${id}', -1)">−</button>
            <span>${qty}</span>
            <button class="qty-btn" onclick="updateQty('${id}', 1)">+</button>
            <div style="font-weight:600;color:#572403;">$${(p.price*qty).toFixed(2)}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  const total = getCartTotal();
  totalEl.textContent = total.toFixed(2);
  countEl.textContent = getCartCount();
  modalTotal ? modalTotal.textContent = total.toFixed(2) : null;
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function updateCartBadge() {
  const count = getCartCount();
  document.getElementById('floatingCartBtn').style.display = count ? 'flex' : 'none';
  document.getElementById('floatingCartCount').textContent = count;
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();
});
