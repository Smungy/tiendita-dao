// servicio CRUD para productos
const productosService = {
  async getAll() {
    return await api.get("/productos");
  },

  async getById(id) {
    return await api.get(`/productos/${id}`);
  },

  async create(producto) {
    return await api.post("/productos", producto);
  },

  async update(id, producto) {
    return await api.put(`/productos/${id}`, producto);
  },

  async delete(id) {
    return await api.delete(`/productos/${id}`);
  },
};

window.productosService = productosService;
