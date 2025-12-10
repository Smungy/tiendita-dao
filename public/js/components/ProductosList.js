class ProductosList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._productos = [];
    }

    connectedCallback() {
        this.render();
    }

    set productos(value) {
        this._productos = value;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
                th { background-color: #f4f4f4; }
                .btn { padding: 5px 10px; cursor: pointer; border-radius: 4px; border: none; color: white; }
                .btn-edit { background-color: #3498db; margin-right: 5px; }
                .btn-delete { background-color: #e74c3c; }
                .low-stock { color: red; font-weight: bold; }
            </style>
            <div>
                ${this._productos.length === 0 ? '<p>No hay productos</p>' : `
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Alerta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._productos.map(p => `
                            <tr>
                                <td>${p.nombre}</td>
                                <td>$${p.precio}</td>
                                <td class="${p.stock <= p.alerta_stock ? 'low-stock' : ''}">${p.stock}</td>
                                <td>${p.alerta_stock}</td>
                                <td>
                                    <button class="btn btn-edit" data-id="${p.id}">Editar</button>
                                    <button class="btn btn-delete" data-id="${p.id}">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                `}
            </div>
        `;

        this.shadowRoot.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('edit-producto', { detail: { id: btn.dataset.id } }));
            });
        });

        this.shadowRoot.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('delete-producto', { detail: { id: btn.dataset.id } }));
            });
        });
    }
}

customElements.define('productos-list', ProductosList);