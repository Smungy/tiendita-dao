// componente lista de ventas con shadow DOM
class VentasList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ventas = [];
    this._ventasFiltradas = [];
    this._filtro = "";
  }

  connectedCallback() {
    this.render();
  }

  set ventas(value) {
    this._ventas = value;
    this._ventasFiltradas = value;
    this._filtro = "";
    this.render();
  }

  filtrar(termino) {
    this._filtro = termino.toLowerCase();
    if (this._filtro === "") {
      this._ventasFiltradas = this._ventas;
    } else {
      this._ventasFiltradas = this._ventas.filter(
        (v) =>
          v.id.toString().includes(this._filtro) ||
          (v.cliente_id && v.cliente_id.toString().includes(this._filtro)) ||
          (v.total && v.total.toString().includes(this._filtro))
      );
    }
    this.renderTabla();
  }

  formatearFecha(fecha) {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatearMoneda(cantidad) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad || 0);
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .search-container {
                    margin-bottom: 1rem;
                }
                .search-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 0.8rem 1rem;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #1a1a1a;
                }
                .table-container {
                    overflow-x: auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 600px;
                }
                th, td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                th {
                    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
                    color: white;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                }
                tr:hover {
                    background-color: #f8f9fa;
                }
                .actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .btn {
                    padding: 0.4rem 0.8rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.85rem;
                }
                .btn-edit {
                    background-color: #3498db;
                    color: white;
                }
                .btn-delete {
                    background-color: #e74c3c;
                    color: white;
                }
                .btn-view {
                    background-color: #27ae60;
                    color: white;
                }
                .empty-message {
                    text-align: center;
                    padding: 3rem;
                    color: #666;
                }
                .results-count {
                    font-size: 0.9rem;
                    color: #666;
                    margin-top: 0.5rem;
                }
                .badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .badge-efectivo {
                    background-color: #27ae60;
                    color: white;
                }
                .badge-tarjeta {
                    background-color: #3498db;
                    color: white;
                }
                .badge-transferencia {
                    background-color: #9b59b6;
                    color: white;
                }
                .badge-otro {
                    background-color: #95a5a6;
                    color: white;
                }
            </style>

            <div class="search-container">
                <input type="text" class="search-input" placeholder="Buscar por ID, cliente o total..." value="${
                  this._filtro
                }">
                ${
                  this._filtro
                    ? `<p class="results-count">${this._ventasFiltradas.length} resultado(s) encontrado(s)</p>`
                    : ""
                }
            </div>

            <div class="table-container">
                ${
                  this._ventasFiltradas.length > 0
                    ? `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Cliente ID</th>
                                <th>Total</th>
                                <th>Método de Pago</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._ventasFiltradas
                              .map(
                                (v) => `
                                <tr>
                                    <td>${v.id}</td>
                                    <td>${this.formatearFecha(v.fecha)}</td>
                                    <td>${v.cliente_id || "N/A"}</td>
                                    <td>${this.formatearMoneda(v.total)}</td>
                                    <td>
                                        <span class="badge badge-${v.metodo_pago || "otro"}">
                                            ${v.metodo_pago || "N/A"}
                                        </span>
                                    </td>
                                    <td class="actions">
                                        <button class="btn btn-view" data-id="${v.id}">Ver</button>
                                        <button class="btn btn-edit" data-id="${v.id}">Editar</button>
                                        <button class="btn btn-delete" data-id="${v.id}">Eliminar</button>
                                    </td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                `
                    : `
                    <div class="empty-message">
                        <p>${
                          this._filtro
                            ? "No se encontraron resultados"
                            : "No hay ventas registradas"
                        }</p>
                    </div>
                `
                }
            </div>
        `;

    const searchInput = this.shadowRoot.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filtrar(e.target.value);
      });
    }

    this.shadowRoot.querySelectorAll(".btn-view").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("view-venta", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });

    this.shadowRoot.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("edit-venta", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });

    this.shadowRoot.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-venta", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });
  }

  renderTabla() {
    const tableContainer = this.shadowRoot.querySelector(".table-container");
    const resultsCount = this.shadowRoot.querySelector(".results-count");

    if (resultsCount) {
      resultsCount.remove();
    }

    if (this._filtro) {
      const searchContainer =
        this.shadowRoot.querySelector(".search-container");
      const countEl = document.createElement("p");
      countEl.className = "results-count";
      countEl.textContent = `${this._ventasFiltradas.length} resultado(s) encontrado(s)`;
      searchContainer.appendChild(countEl);
    }

    tableContainer.innerHTML =
      this._ventasFiltradas.length > 0
        ? `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente ID</th>
              <th>Total</th>
              <th>Método de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this._ventasFiltradas
              .map(
                (v) => `
              <tr>
                <td>${v.id}</td>
                <td>${this.formatearFecha(v.fecha)}</td>
                <td>${v.cliente_id || "N/A"}</td>
                <td>${this.formatearMoneda(v.total)}</td>
                <td>
                  <span class="badge badge-${v.metodo_pago || "otro"}">
                    ${v.metodo_pago || "N/A"}
                  </span>
                </td>
                <td class="actions">
                  <button class="btn btn-view" data-id="${v.id}">Ver</button>
                  <button class="btn btn-edit" data-id="${v.id}">Editar</button>
                  <button class="btn btn-delete" data-id="${v.id}">Eliminar</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `
        : `
        <div class="empty-message">
          <p>${
            this._filtro
              ? "No se encontraron resultados"
              : "No hay ventas registradas"
          }</p>
        </div>
      `;

    this.shadowRoot.querySelectorAll(".btn-view").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("view-venta", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });

    this.shadowRoot.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("edit-venta", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });

    this.shadowRoot.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-venta", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });
  }
}

customElements.define("ventas-list", VentasList);

