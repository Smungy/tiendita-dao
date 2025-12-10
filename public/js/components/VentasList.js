class VentasList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ventas = [];
  }

  static get observedAttributes() {
    return ["ventas"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "ventas" && oldValue !== newValue) {
      try {
        this._ventas = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error("Error parsing ventas:", e);
      }
    }
  }

  set ventas(value) {
    this._ventas = value;
    this.render();
  }

  get ventas() {
    return this._ventas;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        thead {
          background-color: #18181b;
          color: white;
        }

        th {
          padding: 16px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.15s;
        }

        tbody tr:hover {
          background-color: #f9fafb;
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        td {
          padding: 16px;
          font-size: 14px;
          color: #374151;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-edit {
          background-color: #3b82f6;
          color: white;
        }

        .btn-edit:hover {
          background-color: #2563eb;
        }

        .btn-delete {
          background-color: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background-color: #dc2626;
        }

        .btn-view {
          background-color: #10b981;
          color: white;
        }

        .btn-view:hover {
          background-color: #059669;
        }

        .empty-message {
          padding: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        .total {
          font-weight: 600;
          color: #059669;
        }

        .fecha {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          th, td {
            padding: 12px 8px;
            font-size: 13px;
          }

          button {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      </style>

      <div class="container">
        ${
          this._ventas.length === 0
            ? this.renderEmpty()
            : this.renderTable()
        }
      </div>
    `;

    this.setupEventListeners();
  }

  renderEmpty() {
    return `
      <div class="empty-message">
        No hay ventas registradas
      </div>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount) {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  renderTable() {
    return `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente ID</th>
            <th>Método de Pago</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${this._ventas
            .map(
              (venta) => `
            <tr>
              <td>${venta.id}</td>
              <td class="fecha">${this.formatDate(venta.fecha)}</td>
              <td>${venta.cliente_id || ''}</td>
              <td>${venta.metodo_pago || ''}</td>
              <td class="total">${this.formatCurrency(venta.total)}</td>
              <td>
                <div class="actions">
                  <button class="btn-view" data-id="${venta.id}">Ver</button>
                  <button class="btn-edit" data-id="${venta.id}">Editar</button>
                  <button class="btn-delete" data-id="${venta.id}">Eliminar</button>
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  setupEventListeners() {
    // manejar clicks en botones de ver
    const viewButtons = this.shadowRoot.querySelectorAll(".btn-view");
    viewButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        this.dispatchEvent(
          new CustomEvent("view-venta", {
            bubbles: true,
            composed: true,
            detail: { id },
          })
        );
      });
    });

    // manejar clicks en botones de editar
    const editButtons = this.shadowRoot.querySelectorAll(".btn-edit");
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        this.dispatchEvent(
          new CustomEvent("edit-venta", {
            bubbles: true,
            composed: true,
            detail: { id },
          })
        );
      });
    });

    // manejar clicks en botones de eliminar
    const deleteButtons = this.shadowRoot.querySelectorAll(".btn-delete");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        this.dispatchEvent(
          new CustomEvent("delete-venta", {
            bubbles: true,
            composed: true,
            detail: { id },
          })
        );
      });
    });
  }
}

customElements.define("ventas-list", VentasList);

