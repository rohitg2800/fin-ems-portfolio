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

function showOrdersMessage(list, message, color = "var(--muted)") {
  if (!list) return;
  list.innerHTML = `<p style="text-align:center; color: ${color};">${message}</p>`;
}

function setActiveAuthTab(mode) {
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const isLogin = mode === "login";

  if (tabLogin) {
    tabLogin.classList.toggle("active", isLogin);
    tabLogin.style.color = isLogin ? "var(--text)" : "var(--text-muted)";
    tabLogin.style.borderBottom = isLogin ? "2px solid var(--primary)" : "none";
  }

  if (tabSignup) {
    tabSignup.classList.toggle("active", !isLogin);
    tabSignup.style.color = !isLogin ? "var(--text)" : "var(--text-muted)";
    tabSignup.style.borderBottom = !isLogin ? "2px solid var(--primary)" : "none";
  }

  if (loginForm) loginForm.style.display = isLogin ? "block" : "none";
  if (signupForm) signupForm.style.display = isLogin ? "none" : "block";
}

window.openAuthModal = function openAuthModal() {
  document.getElementById("authModal")?.classList.add("active");
};

window.openOrderHistory = async function openOrderHistory() {
  const modal = document.getElementById("ordersModal");
  const list = document.getElementById("ordersList");
  const token = Auth.getToken();

  if (!modal || !list) return;

  if (!token) {
    showOrdersMessage(list, "Please log in to view your order history.");
    modal.classList.add("active");
    return;
  }

  modal.classList.add("active");
  list.innerHTML = '<p class="loading-text" style="text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your history...</p>';

  try {
    const orders = await window.EMSApi.orders.list(token);

    if (!orders.length) {
      showOrdersMessage(list, "No previous orders found.");
      return;
    }

    list.innerHTML = orders.map((order) => `
      <div style="border: 1px solid var(--border); padding: 15px; border-radius: 12px; margin-bottom: 10px; background: var(--bg-soft);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong>Order #${order.id || order.orderId}</strong>
          <span style="color: var(--primary); font-weight: bold;">$${parseFloat(order.total || 0).toFixed(2)}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--muted);">
          Placed on: ${new Date(order.created_at || order.date).toLocaleDateString()}
        </div>
      </div>
    `).join("");
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      showOrdersMessage(list, "Session expired. Please log in again.");
      return;
    }

    showOrdersMessage(list, "Failed to load history.", "red");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("authModal");
  const authClose = document.getElementById("authClose");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const authNav = document.getElementById("authNavSection");

  document.getElementById("tabLogin")?.addEventListener("click", () => {
    setActiveAuthTab("login");
  });

  document.getElementById("tabSignup")?.addEventListener("click", () => {
    setActiveAuthTab("signup");
  });

  authClose?.addEventListener("click", () => {
    authModal?.classList.remove("active");
  });

  if (authNav) {
    const user = Auth.getUser();
    authNav.innerHTML = user ? `
      <button class="btn secondary" type="button" onclick="openOrderHistory()">My Orders</button>
      <button class="btn alt" type="button" onclick="Auth.logout()">Logout</button>
    ` : `
      <button class="btn secondary" type="button" onclick="openAuthModal()">Login / Register</button>
    `;
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail")?.value;
      const password = document.getElementById("loginPassword")?.value;
      const button = loginForm.querySelector("button");
      const originalLabel = button?.innerHTML || "Sign In";
      if (button) button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

      try {
        const data = await window.EMSApi.auth.login({ email, password });
        if (data?.success) {
          Auth.setSession(data.token, data.user);
          window.location.reload();
          return;
        }

        alert(data?.message || "Login failed");
      } catch (err) {
        alert(err.message || "Server unreachable");
      } finally {
        if (button) button.innerHTML = originalLabel;
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("signupName")?.value;
      const email = document.getElementById("signupEmail")?.value;
      const password = document.getElementById("signupPassword")?.value;
      const button = signupForm.querySelector("button");
      const originalLabel = button?.innerHTML || "Create Account";
      if (button) button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';

      try {
        const data = await window.EMSApi.auth.register({ username, email, password });

        if (data?.success) {
          alert("Registered successfully. Please log in to continue.");
          setActiveAuthTab("login");
          const loginEmailInput = document.getElementById("loginEmail");
          const loginPasswordInput = document.getElementById("loginPassword");
          if (loginEmailInput) loginEmailInput.value = email;
          if (loginPasswordInput) loginPasswordInput.value = password;
          return;
        }

        alert(data?.message || "Registration failed");
      } catch (err) {
        alert(err.message || "Server unreachable");
      } finally {
        if (button) button.innerHTML = originalLabel;
      }
    });
  }

  document.getElementById("ordersClose")?.addEventListener("click", () => {
    document.getElementById("ordersModal")?.classList.remove("active");
  });
});
