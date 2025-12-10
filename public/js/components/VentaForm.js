// componente formulario de venta con shadow DOM
class VentaForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._venta = null;
    this._isEdit = false;
    this._clientes = [];
    this._productos = [];
    this._productosSeleccionados = [];
  }

  connectedCallback() {
    this.cargarDatos();
  }

  set venta(value) {
    this._venta = value;
    this._isEdit = !!value;
    if (value && value.productos) {
      this._productosSeleccionados = [...value.productos];
    }
    this.render();
  }

  async cargarDatos() {
    try {
      this._clientes = await clientesService.getAll();
      this._productos = await productosService.getAll();
      this.render();
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }

  agregarProducto() {
    const selectProducto = this.shadowRoot.getElementById("selectProducto");
    const inputCantidad = this.shadowRoot.getElementById("inputCantidad");

    if (!selectProducto || !inputCantidad) return;

    const productoId = parseInt(selectProducto.value);
    const cantidad = parseInt(inputCantidad.value);

    if (!productoId || !cantidad || cantidad <= 0) {
      alert("Selecciona un producto y una cantidad válida");
      return;
    }

    const producto = this._productos.find((p) => p.id === productoId);
    if (!producto) return;

    // Verificar si el producto ya está agregado
    const existe = this._productosSeleccionados.find(
      (p) => p.producto_id === productoId
    );
    if (existe) {
      existe.cantidad += cantidad;
      existe.subtotal = existe.precio_unitario * existe.cantidad;
    } else {
      this._productosSeleccionados.push({
        producto_id: productoId,
        nombre_producto: producto.nombre,
        precio_unitario: producto.precio,
        cantidad: cantidad,
        subtotal: producto.precio * cantidad,
      });
    }

    // Limpiar inputs
    selectProducto.value = "";
    inputCantidad.value = "1";

    this.render();
  }

  eliminarProducto(index) {
    this._productosSeleccionados.splice(index, 1);
    this.render();
  }

  calcularTotal() {
    return this._productosSeleccionados.reduce(
      (sum, p) => sum + (p.subtotal || 0),
      0
    );
  }

  formatearMoneda(cantidad) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad || 0);
  }

  render() {
    const v = this._venta || {};
    const total = this.calcularTotal();

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-weight: 600;
                    color: #333;
                    font-size: 0.9rem;
                }
                input, select, textarea {
                    padding: 0.75rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #1a1a1a;
                }
                .productos-section {
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 1rem;
                    background: #f8f9fa;
                }
                .productos-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .productos-header h3 {
                    margin: 0;
                    font-size: 1rem;
                }
                .agregar-producto {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                .agregar-producto select,
                .agregar-producto input {
                    flex: 1;
                }
                .agregar-producto input[type="number"] {
                    max-width: 100px;
                }
                .btn-add {
                    padding: 0.75rem 1rem;
                    background-color: #27ae60;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .productos-lista {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .producto-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                }
                .producto-info {
                    flex: 1;
                }
                .producto-info strong {
                    display: block;
                    margin-bottom: 0.25rem;
                }
                .producto-info span {
                    font-size: 0.85rem;
                    color: #666;
                }
                .producto-total {
                    font-weight: 600;
                    margin: 0 1rem;
                }
                .btn-remove {
                    padding: 0.5rem 1rem;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                }
                .total-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
                    color: white;
                    border-radius: 8px;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
                    color: white;
                    flex: 1;
                }
                .btn-secondary {
                    background-color: #e0e0e0;
                    color: #333;
                }
                .empty-products {
                    text-align: center;
                    padding: 2rem;
                    color: #666;
                }
            </style>

            <form id="ventaForm">
                <div class="form-group">
                    <label for="cliente_id">Cliente *</label>
                    <select id="cliente_id" name="cliente_id" required>
                        <option value="">Selecciona un cliente</option>
                        ${this._clientes
                          .map(
                            (c) => `
                            <option value="${c.id}" ${
                              v.cliente_id === c.id ? "selected" : ""
                            }>
                                ${c.nombre} - ${c.telefono}
                            </option>
                        `
                          )
                          .join("")}
                    </select>
                </div>

                <div class="form-group">
                    <label for="fecha">Fecha *</label>
                    <input 
                        type="datetime-local" 
                        id="fecha" 
                        name="fecha"
                        value="${v.fecha ? this.formatearFechaInput(v.fecha) : this.formatearFechaInput(new Date().toISOString())}"
                        required
                    >
                </div>

                <div class="productos-section">
                    <div class="productos-header">
                        <h3>Productos</h3>
                    </div>
                    
                    <div class="agregar-producto">
                        <select id="selectProducto">
                            <option value="">Selecciona un producto</option>
                            ${this._productos
                              .map(
                                (p) => `
                                <option value="${p.id}">
                                    ${p.nombre} - ${this.formatearMoneda(p.precio)} (Stock: ${p.stock || 0})
                                </option>
                            `
                              )
                              .join("")}
                        </select>
                        <input 
                            type="number" 
                            id="inputCantidad" 
                            placeholder="Cantidad" 
                            min="1" 
                            value="1"
                        >
                        <button type="button" class="btn-add" id="btnAgregarProducto">
                            + Agregar
                        </button>
                    </div>

                    <div class="productos-lista">
                        ${
                          this._productosSeleccionados.length > 0
                            ? this._productosSeleccionados
                                .map(
                                  (p, index) => `
                                <div class="producto-item">
                                    <div class="producto-info">
                                        <strong>${p.nombre_producto}</strong>
                                        <span>
                                            ${this.formatearMoneda(p.precio_unitario)} x ${p.cantidad}
                                        </span>
                                    </div>
                                    <div class="producto-total">
                                        ${this.formatearMoneda(p.subtotal)}
                                    </div>
                                    <button 
                                        type="button" 
                                        class="btn-remove" 
                                        data-index="${index}"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            `
                                )
                                .join("")
                            : '<div class="empty-products">No hay productos agregados</div>'
                        }
                    </div>
                </div>

                <div class="total-section">
                    <span>Total:</span>
                    <span>${this.formatearMoneda(total)}</span>
                </div>

                <div class="form-group">
                    <label for="metodo_pago">Método de Pago *</label>
                    <select id="metodo_pago" name="metodo_pago" required>
                        <option value="">Selecciona método de pago</option>
                        <option value="efectivo" ${
                          v.metodo_pago === "efectivo" ? "selected" : ""
                        }>Efectivo</option>
                        <option value="tarjeta" ${
                          v.metodo_pago === "tarjeta" ? "selected" : ""
                        }>Tarjeta</option>
                        <option value="transferencia" ${
                          v.metodo_pago === "transferencia" ? "selected" : ""
                        }>Transferencia</option>
                        <option value="otro" ${
                          v.metodo_pago === "otro" ? "selected" : ""
                        }>Otro</option>
                    </select>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
                    <button type="submit" class="btn btn-primary">
                        ${this._isEdit ? "Actualizar" : "Guardar Venta"}
                    </button>
                </div>
            </form>
        `;

    const form = this.shadowRoot.getElementById("ventaForm");
    const btnAgregar = this.shadowRoot.getElementById("btnAgregarProducto");

    if (btnAgregar) {
      btnAgregar.addEventListener("click", () => this.agregarProducto());
    }

    this.shadowRoot.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        this.eliminarProducto(index);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (this._productosSeleccionados.length === 0) {
        alert("Debes agregar al menos un producto");
        return;
      }

      const formData = new FormData(form);
      const venta = {
        fecha: new Date(formData.get("fecha")).toISOString(),
        total: total,
        metodo_pago: formData.get("metodo_pago"),
        cliente_id: formData.get("cliente_id")
          ? parseInt(formData.get("cliente_id"))
          : null,
        productos: this._productosSeleccionados,
      };

      if (this._isEdit) {
        venta.id = this._venta.id;
      }

      this.dispatchEvent(
        new CustomEvent("submit-venta", {
          detail: { venta, isEdit: this._isEdit },
        })
      );
    });

    this.shadowRoot
      .getElementById("btnCancel")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("cancel-form"));
      });
  }

  formatearFechaInput(fecha) {
    if (!fecha) return "";
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}

customElements.define("venta-form", VentaForm);

