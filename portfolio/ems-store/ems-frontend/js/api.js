(function initEMSApi() {
  function resolveApiBase() {
    const prodApiBase = "https://fin-ems-backend.onrender.com/api";
    const frontendHosts = new Set(["fin-ems-frontend.onrender.com"]);

    if (window.EMS_API_BASE) return window.EMS_API_BASE;

    const origin = window.location?.origin;
    if (origin && origin.startsWith("http")) {
      const host = window.location?.host;
      if (host && frontendHosts.has(host)) {
        return prodApiBase;
      }

      const isLocal = /localhost|127\.0\.0\.1/.test(origin);
      const port = window.location?.port;
      if (isLocal && port && port !== "3000" && port !== "4000") {
        return "http://localhost:4000/api";
      }

      return `${origin}/api`;
    }

    return "http://localhost:4000/api";
  }

  const API_BASE = resolveApiBase();

  async function request(path, options = {}) {
    const {
      method = "GET",
      body,
      token,
      headers = {},
      parse = "json"
    } = options;

    const finalHeaders = { ...headers };
    if (body !== undefined && !finalHeaders["Content-Type"]) {
      finalHeaders["Content-Type"] = "application/json";
    }
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    let data = null;
    if (parse === "json") {
      data = await response.json().catch(() => null);
    } else if (parse === "text") {
      data = await response.text().catch(() => "");
    }

    if (!response.ok) {
      const error = new Error(
        data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  const EMSApi = {
    baseUrl: API_BASE,
    request,
    auth: {
      login(credentials) {
        return request("/auth/login", {
          method: "POST",
          body: credentials
        });
      },
      register(payload) {
        return request("/auth/register", {
          method: "POST",
          body: payload
        });
      }
    },
    products: {
      list() {
        return request("/products");
      }
    },
    orders: {
      create(payload, token) {
        return request("/orders", {
          method: "POST",
          body: payload,
          token
        });
      },
      list(token) {
        return request("/orders", { token });
      },
      receipt(orderId, options = {}) {
        const params = new URLSearchParams();
        if (options.email) params.set("email", options.email);
        const suffix = params.toString() ? `?${params.toString()}` : "";
        return request(`/orders/${encodeURIComponent(orderId)}/receipt${suffix}`, {
          token: options.token
        });
      }
    },
    admin: {
      listOrders(token) {
        return request("/admin/orders", { token });
      },
      stats(token) {
        return request("/admin/stats", { token });
      }
    },
    checkout: {
      createSession(payload, token) {
        return request("/checkout/session", {
          method: "POST",
          body: payload,
          token
        });
      },
      getSession(sessionId, token) {
        return request(`/checkout/session/${encodeURIComponent(sessionId)}`, {
          token
        });
      }
    }
  };

  window.EMS_API_BASE = API_BASE;
  window.EMSApi = EMSApi;
})();
