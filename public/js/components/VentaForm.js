class VentaForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._venta = null;
  }

  static get observedAttributes() {
    return ["venta"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "venta" && oldValue !== newValue) {
      try {
        this._venta = newValue ? JSON.parse(newValue) : null;
        this.render();
      } catch (e) {
        console.error("Error parsing venta:", e);
      }
    }
  }

  set venta(value) {
    this._venta = value;
    this.render();
  }

  get venta() {
    return this._venta;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const venta = this._venta || {};
    const isEditing = !!this._venta;

    // Si no hay fecha, usar la fecha actual
    const fechaActual = venta.fecha 
      ? new Date(venta.fecha).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16);

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .form-container {
          background-color: white;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }

        .form-title {
          font-size: 24px;
          font-weight: 600;
          color: #18181b;
          margin-bottom: 24px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #18181b;
        }

        .required {
          color: #ef4444;
          margin-left: 4px;
        }

        input, select {
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #e4e4e7;
          border-radius: 6px;
          outline: none;
          transition: all 0.15s;
          font-family: inherit;
          background-color: white;
          color: #18181b;
        }

        input:focus, select:focus {
          border-color: #18181b;
          box-shadow: 0 0 0 3px rgba(24, 24, 27, 0.1);
        }

        input[type="datetime-local"] {
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-submit {
          background-color: #18181b;
          color: white;
          flex: 1;
        }

        .btn-submit:hover {
          background-color: #27272a;
        }

        .btn-cancel {
          background-color: #e5e7eb;
          color: #374151;
        }

        .btn-cancel:hover {
          background-color: #d1d5db;
        }

        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 24px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      </style>

      <div class="form-container">
        <h2 class="form-title">${
          isEditing ? "Editar Venta" : "Nueva Venta"
        }</h2>
        
        <form id="ventaForm">
          <div class="form-group">
            <label for="fecha">
              Fecha
              <span class="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="fecha"
              name="fecha"
              value="${fechaActual}"
              required
            />
          </div>

          <div class="form-group">
            <label for="cliente_id">
              ID Cliente
              <span class="required">*</span>
            </label>
            <input
              type="number"
              id="cliente_id"
              name="cliente_id"
              value="${venta.cliente_id || ""}"
              required
              min="1"
              placeholder="Ingresa el ID del cliente"
            />
          </div>

          <div class="form-group">
            <label for="metodo_pago">
              Método de Pago
              <span class="required">*</span>
            </label>
            <select
              id="metodo_pago"
              name="metodo_pago"
              required
            >
              <option value="">Selecciona un método</option>
              <option value="efectivo" ${venta.metodo_pago === 'efectivo' ? 'selected' : ''}>Efectivo</option>
              <option value="tarjeta" ${venta.metodo_pago === 'tarjeta' ? 'selected' : ''}>Tarjeta</option>
              <option value="transferencia" ${venta.metodo_pago === 'transferencia' ? 'selected' : ''}>Transferencia</option>
              <option value="otro" ${venta.metodo_pago === 'otro' ? 'selected' : ''}>Otro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="total">
              Total
              <span class="required">*</span>
            </label>
            <input
              type="number"
              id="total"
              name="total"
              value="${venta.total || ""}"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">
              Guardar
            </button>
            <button type="button" class="btn-cancel" id="cancelBtn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.getElementById("ventaForm");
    const cancelBtn = this.shadowRoot.getElementById("cancelBtn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      
      // Convertir fecha a formato ISO para el backend
      const fechaInput = formData.get("fecha");
      const fechaISO = new Date(fechaInput).toISOString();

      const venta = {
        fecha: fechaISO,
        cliente_id: parseInt(formData.get("cliente_id")),
        metodo_pago: formData.get("metodo_pago"),
        total: parseFloat(formData.get("total")),
      };

      // agregar id si estamos editando
      if (this._venta && this._venta.id) {
        venta.id = this._venta.id;
      }

      this.dispatchEvent(
        new CustomEvent("submit-venta", {
          bubbles: true,
          composed: true,
          detail: { venta },
        })
      );
    });

    cancelBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("cancel-form", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}

customElements.define("venta-form", VentaForm);

