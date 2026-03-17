// Global Cart Functions — Include on ALL pages
let PRODUCT_MAP = {}; // Your products object

function getCart() {
  try { return JSON.parse(localStorage.getItem("ems_cart") || "{}"); }
  catch { return {}; }
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  if (cart[productId] <= 0) delete cart[productId];
  localStorage.setItem("ems_cart", JSON.stringify(cart));
  updateCartDisplay();
  showNotification("Added to cart!", "success");
}

function updateQty(id, delta) {
  addToCart(id, delta);
}

function clearCart() {
  localStorage.removeItem("ems_cart");
  updateCartDisplay();
  showNotification("Cart cleared!", "info");
}

// Your existing showNotification function (if not exists)
function showNotification(msg, type = "success") {
  // Simple toast notification
  const toast = document.createElement("div");
  toast.style.cssText = `
    position:fixed;top:20px;right:20px;padding:16px 20px;border-radius:8px;
    color:white;font-weight:600;z-index:10000;transform:translateX(400px);
    transition:all 0.3s;background:${type==="success"?"#28a745":"#6c757d"};
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.style.transform = "translateX(0)", 100);
  setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
