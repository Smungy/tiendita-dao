// componente lista de proveedores con shadow DOM
class ProveedoresList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._proveedores = [];
    this._proveedoresFiltrados = [];
    this._filtro = "";
  }

  connectedCallback() {
    this.render();
  }

  set proveedores(value) {
    this._proveedores = value;
    this._proveedoresFiltrados = value;
    this._filtro = "";
    this.render();
  }

  filtrar(termino) {
    this._filtro = termino.toLowerCase();
    if (this._filtro === "") {
      this._proveedoresFiltrados = this._proveedores;
    } else {
      this._proveedoresFiltrados = this._proveedores.filter(
        (p) =>
          p.id.toString().includes(this._filtro) ||
          p.nombre_empresa.toLowerCase().includes(this._filtro)
      );
    }
    this.renderTabla();
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
            </style>

            <div class="search-container">
                <input type="text" class="search-input" placeholder="Buscar por ID o empresa..." value="${
                  this._filtro
                }">
                ${
                  this._filtro
                    ? `<p class="results-count">${this._proveedoresFiltrados.length} resultado(s) encontrado(s)</p>`
                    : ""
                }
            </div>

            <div class="table-container">
                ${
                  this._proveedoresFiltrados.length > 0
                    ? `
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Empresa</th>
                                <th>Contacto</th>
                                <th>Telefono</th>
                                <th>Direccion</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._proveedoresFiltrados
                              .map(
                                (p) => `
                                <tr>
                                    <td>${p.id}</td>
                                    <td>${p.nombre_empresa}</td>
                                    <td>${p.contacto_nombre}</td>
                                    <td>${p.telefono}</td>
                                    <td>${p.direccion}</td>
                                    <td class="actions">
                                        <button class="btn btn-edit" data-id="${p.id}">Editar</button>
                                        <button class="btn btn-delete" data-id="${p.id}">Eliminar</button>
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
                            : "No hay proveedores registrados"
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

    this.shadowRoot.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("edit-proveedor", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });

    this.shadowRoot.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-proveedor", {
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
      countEl.textContent = `${this._proveedoresFiltrados.length} resultado(s) encontrado(s)`;
      searchContainer.appendChild(countEl);
    }

    tableContainer.innerHTML =
      this._proveedoresFiltrados.length > 0
        ? `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Telefono</th>
              <th>Direccion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this._proveedoresFiltrados
              .map(
                (p) => `
              <tr>
                <td>${p.id}</td>
                <td>${p.nombre_empresa}</td>
                <td>${p.contacto_nombre}</td>
                <td>${p.telefono}</td>
                <td>${p.direccion}</td>
                <td class="actions">
                  <button class="btn btn-edit" data-id="${p.id}">Editar</button>
                  <button class="btn btn-delete" data-id="${p.id}">Eliminar</button>
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
              : "No hay proveedores registrados"
          }</p>
        </div>
      `;

    this.shadowRoot.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("edit-proveedor", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });

    this.shadowRoot.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("delete-proveedor", {
            detail: { id: parseInt(btn.dataset.id) },
          })
        );
      });
    });
  }
}

customElements.define("proveedores-list", ProveedoresList);
