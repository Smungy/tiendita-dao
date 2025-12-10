// servicio CRUD para proveedores
const proveedoresService = {
  async getAll() {
    return await api.get("/proveedores");
  },

  async getById(id) {
    return await api.get(`/proveedores/${id}`);
  },

  async create(proveedor) {
    return await api.post("/proveedores", proveedor);
  },

  async update(id, proveedor) {
    return await api.put(`/proveedores/${id}`, proveedor);
  },

  async delete(id) {
    return await api.delete(`/proveedores/${id}`);
  },
};

window.proveedoresService = proveedoresService;
