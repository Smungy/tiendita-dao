// servicio CRUD para clientes
const clientesService = {
  async getAll() {
    return await api.get("/clientes");
  },

  async getById(id) {
    return await api.get(`/clientes/${id}`);
  },

  async create(cliente) {
    return await api.post("/clientes", cliente);
  },

  async update(id, cliente) {
    return await api.put(`/clientes/${id}`, cliente);
  },

  async delete(id) {
    return await api.delete(`/clientes/${id}`);
  },
};

window.clientesService = clientesService;
