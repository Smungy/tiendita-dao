// servicio de autenticacion
const authService = {
  async login(username, password) {
    const response = await api.post("/auth/login", { username, password });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  async register(username, password) {
    return await api.post("/auth/register", { username, password });
  },

  logout() {
    removeToken();
    window.location.hash = "#/login";
  },
};

window.authService = authService;
