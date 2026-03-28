// ems-frontend/js/auth.js
function resolveAuthBase() {
  if (window.EMS_API_BASE) return window.EMS_API_BASE;
  const origin = window.location?.origin;
  if (origin && origin.startsWith("http")) {
    const isLocal = /localhost|127\.0\.0\.1/.test(origin);
    const port = window.location?.port;
    if (isLocal && port && port !== "3000" && port !== "4000") {
      return "http://localhost:4000/api";
    }
    return `${origin}/api`;
  }
  return "http://localhost:4000/api";
}

const AUTH_BASE = resolveAuthBase();
const AUTH_URL = `${AUTH_BASE}/auth`;
const ORDERS_URL = `${AUTH_BASE}/orders`;

const Auth = {
  setSession(token, user) {
    localStorage.setItem("ems_token", token);
    localStorage.setItem("ems_user", JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem("ems_user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("ems_token");
  },

  logout() {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    window.location.reload();
  }
};

window.Auth = Auth;

// UI Handlers for Auth
document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("authModal");
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authClose = document.getElementById("authClose");

  // Tab Switching Logic
  if (tabLogin && tabSignup) {
    tabLogin.addEventListener("click", () => {
      tabLogin.classList.add("active");
      tabLogin.style.color = "var(--text)";
      tabLogin.style.borderBottom = "2px solid var(--primary)";
      
      tabSignup.classList.remove("active");
      tabSignup.style.color = "var(--text-muted)";
      tabSignup.style.borderBottom = "none";
      
      loginForm.style.display = "block";
      signupForm.style.display = "none";
    });

    tabSignup.addEventListener("click", () => {
      tabSignup.classList.add("active");
      tabSignup.style.color = "var(--text)";
      tabSignup.style.borderBottom = "2px solid var(--primary)";
      
      tabLogin.classList.remove("active");
      tabLogin.style.color = "var(--text-muted)";
      tabLogin.style.borderBottom = "none";
      
      signupForm.style.display = "block";
      loginForm.style.display = "none";
    });
  }

  // Close Modal
  if (authClose) {
    authClose.addEventListener("click", () => {
      authModal.classList.remove("active");
    });
  }

  // Render auth actions in the nav (if present)
  const authNav = document.getElementById("authNavSection");
  if (authNav) {
    const user = Auth.getUser();
    if (user) {
      authNav.innerHTML = `
        <button class="btn secondary" type="button" onclick="openOrderHistory()">My Orders</button>
        <button class="btn alt" type="button" onclick="Auth.logout()">Logout</button>
      `;
    } else {
      authNav.innerHTML = `
        <button class="btn secondary" type="button" onclick="openAuthModal()">Login / Register</button>
      `;
    }
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const btn = loginForm.querySelector("button");
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

      try {
        const res = await fetch(`${AUTH_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
          Auth.setSession(data.token, data.user);
          window.location.reload(); // Refresh to update Nav Bar
        } else {
          alert(data.message || "Login failed");
        }
      } catch (err) {
        alert("Server unreachable");
      } finally {
        btn.innerHTML = 'Sign In';
      }
    });
  }

  // Handle Signup Submit
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const btn = signupForm.querySelector("button");
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

      try {
        const res = await fetch(`${AUTH_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (data.success) {
          Auth.setSession(data.token, data.user);
          window.location.reload();
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (err) {
        alert("Server unreachable");
      } finally {
        btn.innerHTML = 'Create Account';
      }
    });
  }
});

// Global functions to open modals from HTML onclick attributes
window.openAuthModal = function() {
  document.getElementById("authModal").classList.add("active");
};

window.openOrderHistory = async function() {
  const modal = document.getElementById("ordersModal");
  const list = document.getElementById("ordersList");
  const token = Auth.getToken();

  if (!token) {
    list.innerHTML = '<p style="text-align:center; color: var(--muted);">Please log in to view your order history.</p>';
    modal.classList.add("active");
    return;
  }

  modal.classList.add("active");
  list.innerHTML = '<p class="loading-text" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your history...</p>';

  try {
    // Note: You must add JWT verification to this route in your backend later
    const res = await fetch(ORDERS_URL, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        list.innerHTML = '<p style="text-align:center; color: var(--muted);">Session expired. Please log in again.</p>';
        return;
      }
      throw new Error("Failed to fetch orders");
    }
    const orders = await res.json();

    if (orders.length === 0) {
      list.innerHTML = '<p style="text-align:center; color: var(--muted);">No previous orders found.</p>';
      return;
    }

    list.innerHTML = orders.map(o => `
      <div style="border: 1px solid var(--border); padding: 15px; border-radius: 12px; margin-bottom: 10px; background: var(--bg-soft);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong>Order #${o.id || o.orderId}</strong>
          <span style="color: var(--primary); font-weight: bold;">$${parseFloat(o.total).toFixed(2)}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--muted);">
          Placed on: ${new Date(o.created_at || o.date).toLocaleDateString()}
        </div>
      </div>
    `).join("");

  } catch (err) {
    list.innerHTML = '<p style="text-align:center; color: red;">Failed to load history.</p>';
  }
};

document.getElementById("ordersClose")?.addEventListener("click", () => {
  document.getElementById("ordersModal").classList.remove("active");
});
