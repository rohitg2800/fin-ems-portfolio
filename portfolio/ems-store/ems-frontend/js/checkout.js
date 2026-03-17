// js/checkout.js - Payment Processing Script
"use strict";

const STORAGE_KEY = "ems_store_cart_v1";
const STRIPE_PUBLIC_KEY = "pk_test_YOUR_STRIPE_PUBLIC_KEY"; // Replace with actual key
const API_ENDPOINT = "https://your-backend.com/api"; // Replace with your backend URL

let stripe, cardElement, paymentIntentId;

/* ---------- INITIALIZE STRIPE ---------- */
function initStripe() {
  try {
    stripe = Stripe(STRIPE_PUBLIC_KEY);
    const elements = stripe.elements();
    cardElement = elements.create("card", {
      style: {
        base: {
          fontSize: "14px",
          color: "var(--text-color)",
          fontFamily: "'Poppins', sans-serif"
        }
      }
    });
    cardElement.mount("#card-element");

    // Handle card errors
    cardElement.addEventListener("change", (event) => {
      const errorEl = document.getElementById("card-errors");
      if (event.error) {
        errorEl.textContent = event.error.message;
      } else {
        errorEl.textContent = "";
      }
    });
  } catch (err) {
    console.error("Stripe init failed:", err);
    showError("Failed to initialize payment processor");
  }
}

/* ---------- CART & THEME HELPERS ---------- */
function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function money(n) {
  return (parseFloat(n) || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
}

function initTheme() {
  try {
    const saved = localStorage.getItem("ems_theme_preference");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeUI(theme);
  } catch (err) {
    console.warn("Theme init failed:", err);
  }
}

function updateThemeUI(theme) {
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");
  if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if (text) text.textContent = theme === "dark" ? "Light" : "Dark";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("ems_theme_preference", next);
  updateThemeUI(next);
}

/* ---------- VALIDATION & ERRORS ---------- */
function showError(message) {
  const errorEl = document.getElementById("errorMessage");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
    errorEl.scrollIntoView({ behavior: "smooth" });
  }
}

function clearError() {
  const errorEl = document.getElementById("errorMessage");
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.textContent = "";
  }
}

function validateForm() {
  const fields = ["fullName", "email", "phone", "address", "city", "state", "zip", "country"];
  
  for (const field of fields) {
    const el = document.getElementById(field);
    if (!el || !el.value.trim()) {
      showError(`Please fill in all required fields`);
      return false;
    }
  }

  const agreeTerms = document.getElementById("agreeTerms");
  if (!agreeTerms || !agreeTerms.checked) {
    showError("Please agree to the terms and conditions");
    return false;
  }

  const email = document.getElementById("email").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("Please enter a valid email address");
    return false;
  }

  return true;
}

/* ---------- ORDER SUMMARY ---------- */
function renderOrderSummary() {
  try {
    const PRODUCTS = window.PRODUCTS || [];
    const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
    const cart = loadCart();
    const container = document.getElementById("orderItems");
    const totalEl = document.getElementById("orderTotal");

    if (!container) return;

    const entries = Object.entries(cart);
    let total = 0;

    if (!entries.length) {
      container.innerHTML = '<p style="color: var(--gray); text-align: center;">Your cart is empty</p>';
      if (totalEl) totalEl.textContent = money(0);
      return;
    }

    container.innerHTML = entries
      .map(([id, qty]) => {
        const p = PRODUCT_MAP[id];
        if (!p) return "";
        const itemTotal = p.price * parseInt(qty, 10);
        total += itemTotal;
        return `
          <div class="summary-item">
            <div class="summary-item-name">
              <strong>${p.name}</strong><br>
              <span style="font-size: 12px; color: var(--gray);">Qty: ${qty}</span>
            </div>
            <div class="summary-item-price">${money(itemTotal)}</div>
          </div>
        `;
      })
      .join("");

    if (totalEl) totalEl.textContent = money(total);
  } catch (err) {
    console.error("Render summary failed:", err);
  }
}

/* ---------- PAYMENT PROCESSING ---------- */
async function createPaymentIntent() {
  try {
    const cart = loadCart();
    const total = Object.entries(cart).reduce((sum, [id, qty]) => {
      // Get product from window.PRODUCTS
      const products = window.PRODUCTS || [];
      const product = products.find(p => p.id === id);
      return sum + (product ? product.price * parseInt(qty, 10) : 0);
    }, 0);

    const response = await fetch(`${API_ENDPOINT}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        billing_details: {
          name: document.getElementById("fullName").value,
          email: document.getElementById("email").value,
          phone: document.getElementById("phone").value,
          address: {
            line1: document.getElementById("address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            postal_code: document.getElementById("zip").value,
            country: document.getElementById("country").value
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
      amount: total
    };
  } catch (err) {
    console.error("Payment intent creation failed:", err);
    showError("Failed to initialize payment. Please try again.");
    throw err;
  }
}

async function processPayment(event) {
  event.preventDefault();
  clearError();

  // Validate form
  if (!validateForm()) return;

  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner-inline"></div> Processing...';

    // Create payment intent
    const { clientSecret, paymentIntentId, amount } = await createPaymentIntent();

    // Confirm payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: document.getElementById("fullName").value,
          email: document.getElementById("email").value
        }
      }
    });

    if (result.error) {
      showError(result.error.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Complete Purchase';
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      // Clear cart
      localStorage.removeItem(STORAGE_KEY);

      // Show success page
      showSuccessPage({
        orderId: paymentIntentId,
        amount: amount,
        email: document.getElementById("email").value
      });
    } else {
      showError("Payment failed. Please try again.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Complete Purchase';
    }
  } catch (err) {
    console.error("Payment processing failed:", err);
    showError("An error occurred. Please try again.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Complete Purchase';
  }
}

function showSuccessPage(orderData) {
  try {
    const checkoutPage = document.getElementById("checkoutPage");
    const successPage = document.getElementById("successPage");

    if (checkoutPage) checkoutPage.style.display = "none";
    if (successPage) {
      successPage.style.display = "block";
      document.getElementById("successOrderId").textContent = orderData.orderId;
      document.getElementById("successAmount").textContent = money(orderData.amount);
      document.getElementById("successEmail").textContent = orderData.email;
    }

    window.scrollTo(0, 0);
  } catch (err) {
    console.error("Show success page failed:", err);
  }
}

/* ---------- INITIALIZATION ---------- */
function init() {
  try {
    initTheme();
    initStripe();
    renderOrderSummary();

    // Event listeners
    const themeToggle = document.getElementById("themeToggle");
    const submitBtn = document.getElementById("submitBtn");
    const agreeTerms = document.getElementById("agreeTerms");

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", processPayment);
    }

    if (agreeTerms) {
      agreeTerms.addEventListener("change", () => {
        if (submitBtn) {
          submitBtn.disabled = !agreeTerms.checked;
        }
      });
    }

    // Mobile nav
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("nav-open");
      });
      mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mainNav.classList.remove("nav-open");
        });
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        mainNav?.classList.remove("nav-open");
      }
    });
  } catch (err) {
    console.error("Init failed:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
