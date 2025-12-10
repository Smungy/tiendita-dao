// servicio para peticiones HTTP con Fetch API y JWT
const API_BASE_URL = "/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

function isAuthenticated() {
  return !!getToken();
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeToken();
    window.location.hash = "#/login";
    throw new Error("Sesion expirada");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Error en la peticion");
  }

  return data;
}

const api = {
  get: (endpoint) => fetchAPI(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    fetchAPI(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    fetchAPI(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => fetchAPI(endpoint, { method: "DELETE" }),
};

window.api = api;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.isAuthenticated = isAuthenticated;
