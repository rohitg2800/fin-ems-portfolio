function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

function getUserFullName(user) {
  return String(
    user?.name ||
    user?.username ||
    user?.fullName ||
    ""
  ).trim().replace(/\s+/g, " ");
}

function getUserFirstName(user) {
  const fullName = getUserFullName(user);
  return fullName ? fullName.split(" ")[0] : "";
}

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

  getName() {
    return getUserFullName(this.getUser());
  },

  getFirstName() {
    return getUserFirstName(this.getUser());
  },

  logout() {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    window.location.reload();
  }
};

window.Auth = Auth;

let authGateLocked = false;

function renderAuthNav(authNav, user = Auth.getUser()) {
  if (!authNav) return;

  if (!user) {
    authNav.innerHTML = `
      <button class="btn secondary" type="button" onclick="openAuthModal('signup')">Login / Register</button>
    `;
    return;
  }

  const firstName = escapeHTML(getUserFirstName(user) || "Account");

  authNav.innerHTML = `
    <div class="auth-user-pill" aria-label="Signed in user">
      <i class="fa-solid fa-user" aria-hidden="true"></i>
      <span>${firstName}</span>
    </div>
    <button class="btn secondary" type="button" onclick="openOrderHistory()">My Orders</button>
    <button class="btn alt" type="button" onclick="Auth.logout()">Logout</button>
  `;
}

function renderHeroGreeting(user = Auth.getUser()) {
  const heroCard = document.querySelector("main .hero .hero-card");
  if (!heroCard) return;

  const existingGreeting = heroCard.querySelector("[data-user-greeting]");
  const firstName = getUserFirstName(user);

  if (!firstName) {
    existingGreeting?.remove();
    return;
  }

  const greetingMarkup = `
    <div class="hero-greeting" data-user-greeting="true">
      <i class="fa-solid fa-user" aria-hidden="true"></i>
      <span>Welcome back, ${escapeHTML(firstName)}.</span>
    </div>
  `;

  if (existingGreeting) {
    existingGreeting.outerHTML = greetingMarkup;
    return;
  }

  heroCard.insertAdjacentHTML("afterbegin", greetingMarkup);
}

function renderAuthGate(modal) {
  if (!modal || modal.dataset.authGateMounted === "true") return;

  modal.dataset.authGateMounted = "true";
  modal.classList.add("auth-gate");
  modal.innerHTML = `
    <div class="auth-gate-shell">
      <section class="auth-gate-brand-panel">
        <div class="auth-gate-brand-mark">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div class="auth-gate-brand-copy">
          <div class="auth-gate-kicker">EMS Luxe Supply</div>
          <h2>Secure Access for Emergency Medical Supply Orders</h2>
          <p>
            Create your customer account to unlock the storefront, then sign in to browse
            live stock, place orders, and review your receipt history.
          </p>
        </div>
        <div class="auth-gate-benefits">
          <div class="auth-gate-benefit">
            <strong>Live Inventory</strong>
            <span>See current stock availability before you order.</span>
          </div>
          <div class="auth-gate-benefit">
            <strong>Fast Reorders</strong>
            <span>Keep your customer profile and order history in one place.</span>
          </div>
          <div class="auth-gate-benefit">
            <strong>Storefront Access</strong>
            <span>Login is required before browsing the site.</span>
          </div>
        </div>
      </section>

      <section class="modal-card auth-card auth-gate-card">
        <div class="auth-gate-card-top">
          <div>
            <div class="auth-gate-kicker">Customer Access</div>
            <h3 class="auth-gate-title">Enter the Storefront</h3>
            <p class="auth-gate-subtitle">
              New visitor? Register first. Once your account is created, switch to login and continue.
            </p>
          </div>
          <div id="authLockNotice" class="auth-lock-notice">Access required</div>
        </div>

        <div class="auth-tabs">
          <button id="tabLogin" class="auth-tab active" type="button">Login</button>
          <button id="tabSignup" class="auth-tab" type="button">Register</button>
        </div>

        <div id="authStatusMessage" class="auth-status-message" hidden></div>

        <form id="loginForm" class="auth-form-content">
          <label class="auth-field">
            <i class="fa-solid fa-envelope"></i>
            <input type="email" id="loginEmail" placeholder="Email Address" required />
          </label>
          <label class="auth-field auth-field-password">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="loginPassword" placeholder="Password" required />
            <button
              type="button"
              class="auth-password-toggle"
              data-password-toggle="loginPassword"
              aria-label="Show password"
              aria-pressed="false"
              title="Show password"
            >
              <i class="fa-regular fa-eye"></i>
            </button>
          </label>
          <button type="submit" class="btn">Sign In</button>
          <button type="button" id="forgotCredentialsBtn" class="auth-recovery-btn">
            Forgot credentials?
          </button>
        </form>

        <form id="signupForm" class="auth-form-content" style="display: none;">
          <label class="auth-field">
            <i class="fa-solid fa-user"></i>
            <input type="text" id="signupName" placeholder="Full Name" required />
          </label>
          <label class="auth-field">
            <i class="fa-solid fa-envelope"></i>
            <input type="email" id="signupEmail" placeholder="Email Address" required />
          </label>
          <label class="auth-field auth-field-password">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="signupPassword" placeholder="Create Password (Min 8 chars)" required />
            <button
              type="button"
              class="auth-password-toggle"
              data-password-toggle="signupPassword"
              aria-label="Show password"
              aria-pressed="false"
              title="Show password"
            >
              <i class="fa-regular fa-eye"></i>
            </button>
          </label>
          <button type="submit" class="btn">Create Account</button>
        </form>

        <div class="auth-gate-footer">
          <span class="auth-gate-footer-dot"></span>
          <span>You must sign in before you can browse the emergency medical supply catalog.</span>
        </div>
      </section>
    </div>
  `;
}

function showOrdersMessage(list, message, color = "var(--muted)") {
  if (!list) return;
  list.innerHTML = `<p style="text-align:center; color: ${color};">${message}</p>`;
}

function setAuthMessage(message, tone = "info") {
  const messageEl = document.getElementById("authStatusMessage");
  if (!messageEl) return;

  if (!message) {
    messageEl.hidden = true;
    messageEl.textContent = "";
    messageEl.dataset.tone = "";
    return;
  }

  messageEl.hidden = false;
  messageEl.dataset.tone = tone;
  messageEl.textContent = message;
}

function setAuthGateLock(locked) {
  authGateLocked = locked;
  const modal = document.getElementById("authModal");
  const notice = document.getElementById("authLockNotice");

  if (modal) {
    modal.classList.toggle("auth-gate-locked", locked);
  }

  if (notice) {
    notice.textContent = locked ? "Access required" : "Customer account";
  }
}

function focusAuthField(mode) {
  const field = mode === "signup"
    ? document.getElementById("signupName")
    : document.getElementById("loginEmail");

  field?.focus();
}

function setupPasswordToggles() {
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    if (button.dataset.toggleBound === "true") return;

    button.dataset.toggleBound = "true";
    button.addEventListener("click", () => {
      const inputId = button.dataset.passwordToggle;
      const input = inputId ? document.getElementById(inputId) : null;
      const icon = button.querySelector("i");

      if (!input) return;

      const revealPassword = input.type === "password";
      input.type = revealPassword ? "text" : "password";
      button.setAttribute("aria-pressed", String(revealPassword));
      button.setAttribute("aria-label", revealPassword ? "Hide password" : "Show password");
      button.setAttribute("title", revealPassword ? "Hide password" : "Show password");

      if (icon) {
        icon.classList.toggle("fa-eye", !revealPassword);
        icon.classList.toggle("fa-eye-slash", revealPassword);
      }

      input.focus({ preventScroll: true });

      if (typeof input.setSelectionRange === "function") {
        const cursorPosition = input.value.length;
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  });
}

function setActiveAuthTab(mode) {
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotCredentialsBtn = document.getElementById("forgotCredentialsBtn");
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

  if (loginForm) loginForm.style.display = isLogin ? "grid" : "none";
  if (signupForm) signupForm.style.display = isLogin ? "none" : "grid";

  setAuthMessage("");
  focusAuthField(mode);
}

function closeAuthModal() {
  if (authGateLocked && !Auth.getUser()) return;

  document.getElementById("authModal")?.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

function showAuthModal(mode = "login", options = {}) {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  setAuthGateLock(Boolean(options.locked));
  setActiveAuthTab(mode);
  modal.classList.add("active");
  document.body.classList.add("no-scroll");
}

window.openAuthModal = function openAuthModal(mode = "login") {
  showAuthModal(mode, { locked: !Auth.getUser() });
};

window.openOrderHistory = async function openOrderHistory() {
  const modal = document.getElementById("ordersModal");
  const list = document.getElementById("ordersList");
  const token = Auth.getToken();

  if (!modal || !list) return;

  if (!token) {
    showAuthModal("login", { locked: true });
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
      showAuthModal("login", { locked: true });
      return;
    }

    showOrdersMessage(list, "Failed to load history.", "red");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const authModal = document.getElementById("authModal");
  const authNav = document.getElementById("authNavSection");
  const user = Auth.getUser();

  if (authModal) {
    renderAuthGate(authModal);
    setupPasswordToggles();
  }

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  document.getElementById("tabLogin")?.addEventListener("click", () => {
    setActiveAuthTab("login");
  });

  document.getElementById("tabSignup")?.addEventListener("click", () => {
    setActiveAuthTab("signup");
  });

  renderAuthNav(authNav, user);
  renderHeroGreeting(user);

  if (authModal && !user) {
    showAuthModal("signup", { locked: true });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail")?.value;
      const password = document.getElementById("loginPassword")?.value;
      const button = loginForm.querySelector("button");
      const originalLabel = button?.innerHTML || "Sign In";
      setAuthMessage("");

      if (button) {
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
      }

      try {
        const data = await window.EMSApi.auth.login({ email, password });
        if (data?.success) {
          Auth.setSession(data.token, data.user);
          setAuthGateLock(false);
          setAuthMessage("Login successful. Opening the storefront...", "success");
          closeAuthModal();
          window.location.reload();
          return;
        }

        setAuthMessage(data?.message || "Login failed.", "error");
      } catch (err) {
        setAuthMessage(err.message || "Server unreachable", "error");
      } finally {
        if (button) {
          button.innerHTML = originalLabel;
        }
      }
    });
  }

  forgotCredentialsBtn?.addEventListener("click", () => {
    window.location.href = "mailto:support@emsluxe.com?subject=EMS%20Luxe%20Customer%20Support";
  });

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("signupName")?.value;
      const email = document.getElementById("signupEmail")?.value;
      const password = document.getElementById("signupPassword")?.value;
      const button = signupForm.querySelector("button");
      const originalLabel = button?.innerHTML || "Create Account";
      setAuthMessage("");

      if (button) {
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
      }

      try {
        const data = await window.EMSApi.auth.register({ username, email, password });

        if (data?.success) {
          setActiveAuthTab("login");
          setAuthMessage("Account created. Sign in now to unlock the storefront.", "success");

          const loginEmailInput = document.getElementById("loginEmail");
          const loginPasswordInput = document.getElementById("loginPassword");
          if (loginEmailInput) loginEmailInput.value = email;
          if (loginPasswordInput) loginPasswordInput.value = password;
          return;
        }

        setAuthMessage(data?.message || "Registration failed.", "error");
      } catch (err) {
        setAuthMessage(err.message || "Server unreachable", "error");
      } finally {
        if (button) {
          button.innerHTML = originalLabel;
        }
      }
    });
  }

  document.getElementById("ordersClose")?.addEventListener("click", () => {
    document.getElementById("ordersModal")?.classList.remove("active");
  });
});
