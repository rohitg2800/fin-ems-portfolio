// ems-frontend/js/api.js

function resolveApiBase() {
  const PROD_API_BASE = "https://fin-ems-backend.onrender.com/api";
  const FRONTEND_HOSTS = new Set(["fin-ems-frontend.onrender.com"]);
  if (window.EMS_API_BASE) return window.EMS_API_BASE;
  const origin = window.location?.origin;
  if (origin && origin.startsWith("http")) {
    const host = window.location?.host;
    if (host && FRONTEND_HOSTS.has(host)) {
      return PROD_API_BASE;
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

const API_BASE_URL = resolveApiBase();
window.EMS_API_BASE = API_BASE_URL;

/**
 * Defensive Fetch: Wraps the native fetch to handle 
 * network errors and non-JSON responses.
 */
async function getProductsFromDB() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Critical: Backend API unreachable.", error);
    // Return null so the UI can show a 'Maintenance' message
    return null; 
  }
}

// Expose for other scripts
window.getProductsFromDB = getProductsFromDB;
