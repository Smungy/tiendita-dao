class ProductosList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._productos = []; 
        this._productosFiltrados = []; 
    }

    connectedCallback() {
        this.render();
    }

    set productos(value) {
        this._productos = value;
        this._productosFiltrados = value; 
        this.render();
    }

   
    filtrarProductos(termino) {
        const texto = termino.toLowerCase();
        
        this._productosFiltrados = this._productos.filter(p => {
            const nombreMatch = p.nombre.toLowerCase().includes(texto);
            const idMatch = p.id.toString().includes(texto);
            return nombreMatch || idMatch;
        });

        this.renderTabla(); 
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                /* Estilos del Buscador */
                .search-container {
                    margin-bottom: 20px;
                }

                .search-input {
                    width: 100%;
                    max-width: 400px;
                    padding: 10px 15px;
                    font-size: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    outline: none;
                    transition: border-color 0.3s;
                }

                .search-input:focus {
                    border-color: #1a1a1a;
                    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
                }

                /* Contenedor de la tabla */
                .table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    border-spacing: 0;
                }

                thead {
                    background-color: #000000;
                    color: white;
                }

                th {
                    padding: 15px;
                    text-align: left;
                    font-size: 0.9rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                td {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    color: #333;
                    font-size: 0.95rem;
                }

                tbody tr:hover {
                    background-color: #f9f9f9;
                }

                .actions {
                    display: flex;
                    gap: 8px;
                }

                .btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    color: white;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }

                .btn:hover { opacity: 0.8; }

                .btn-edit { background-color: #3498db; }
                .btn-delete { background-color: #e74c3c; }

                .stock-alert {
                    color: #e74c3c;
                    font-weight: bold;
                    background-color: #fceceb;
                }

                .empty-msg {
                    padding: 20px;
                    text-align: center;
                    color: #666;
                }
            </style>

            <div class="search-container">
                <input type="text" class="search-input" placeholder="Buscar por ID o nombre...">
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Alerta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        </tbody>
                </table>
                <div id="empty-msg" class="empty-msg" style="display: none;">No se encontraron productos</div>
            </div>
        `;

        
        const searchInput = this.shadowRoot.querySelector('.search-input');
        searchInput.addEventListener('keyup', (e) => {
            this.filtrarProductos(e.target.value);
        });

        this.renderTabla();
    }

    renderTabla() {
        const tbody = this.shadowRoot.getElementById('table-body');
        const emptyMsg = this.shadowRoot.getElementById('empty-msg');
        
        
        if (this._productosFiltrados.length === 0) {
            tbody.innerHTML = '';
            emptyMsg.style.display = 'block';
            return;
        }

        emptyMsg.style.display = 'none';
        
        
        tbody.innerHTML = this._productosFiltrados.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>$${parseFloat(p.precio).toFixed(2)}</td>
                <td class="${parseInt(p.stock) <= parseInt(p.alerta_stock) ? 'stock-alert' : ''}">${p.stock}</td>
                <td>${p.alerta_stock}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-edit" data-id="${p.id}">Editar</button>
                        <button class="btn btn-delete" data-id="${p.id}">Eliminar</button>
                    </div>
                </td>
            </tr>
        `).join('');

        
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('edit-producto', { 
                    detail: { id: parseInt(btn.dataset.id) },
                    bubbles: true, 
                    composed: true 
                }));
            });
        });

        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('delete-producto', { 
                    detail: { id: parseInt(btn.dataset.id) },
                    bubbles: true, 
                    composed: true 
                }));
            });
        });
    }
}

customElements.define('productos-list', ProductosList);