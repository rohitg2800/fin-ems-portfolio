// EMAILJS CONFIG - PASTE YOUR SERVICE ID
const EMAILJS_CONFIG = {
  publicKey: "N5mzHg4TQmKz_T-1Z",
  serviceId: "service_gv3zi4q",  // ← GET THIS!
  templateId: "template_5lpqoc7"
};

function openCheckout() {
  if (!getCartCount()) {
    showToast('Cart is empty!', 'warning');
    return;
  }
  toggleCart(); // close cart first
  document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckout() {
  document.getElementById('checkoutModal').style.display = 'none';
}

async function submitOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('checkoutSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = 'Processing...';

  const order = {
    orderId: 'EMS-' + Date.now(),
    name: document.getElementById('checkoutName').value,
    email: document.getElementById('checkoutEmail').value,
    phone: document.getElementById('checkoutPhone').value,
    address: document.getElementById('checkoutAddress').value,
    items: getCart(),
    total: getCartTotal(),
    date: new Date().toISOString()
  };

  // Save order
  const orders = JSON.parse(localStorage.getItem('ems_orders') || '[]');
  orders.push(order);
  localStorage.setItem('ems_orders', JSON.stringify(orders));

  // Send email
  try {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
      customer_name: order.name,
      customer_email: order.email,
      customer_phone: order.phone,
      customer_address: order.address,
      order_id: order.orderId,
      order_date: new Date().toLocaleString('en-IN'),
      order_items: Object.entries(order.items).map(([id,qty]) => 
        `${PRODUCT_MAP[id]?.name || id} × ${qty}`).join('\n'),
      order_total: `$${order.total.toFixed(2)}`
    });
    showToast('✅ Order confirmed + Email sent!', 'success');
  } catch(e) {
    console.error('Email failed:', e);
    showToast('✅ Order saved (email failed)', 'info');
  }

  clearCart();
  closeCheckout();
  document.getElementById('checkoutForm').reset();
  btn.disabled = false;
  btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Place Order & Send Email';
}

function showToast(msg, type='success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;top:20px;right:20px;z-index:10001;
    padding:16px 20px;border-radius:8px;color:white;font-weight:600;
    background:${type=='success'?'#28a745':'#ffc107'};
    transform:translateX(400px);transition:all 0.3s;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(()=>toast.style.transform='translateX(0)', 100);
  setTimeout(()=>{
    toast.style.transform='translateX(400px)';
    setTimeout(()=>toast.remove(), 300);
  }, 3000);
}
