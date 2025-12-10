// servicio CRUD para ventas
const ventasService = {
  async getAll() {
    return await api.get("/ventas");
  },

  async getById(id) {
    return await api.get(`/ventas/${id}`);
  },

  async create(venta) {
    return await api.post("/ventas", venta);
  },

  async update(id, venta) {
    return await api.put(`/ventas/${id}`, venta);
  },

  async delete(id) {
    return await api.delete(`/ventas/${id}`);
  },

  async getDetalles(id) {
    return await api.get(`/ventas/${id}/detalles`);
  },
};

window.ventasService = ventasService;
