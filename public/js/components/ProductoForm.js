class ProductoForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._producto = null;
    }

    set producto(value) {
        this._producto = value;
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const p = this._producto || {};
        this.shadowRoot.innerHTML = `
            <style>
                form { display: flex; flex-direction: column; gap: 10px; }
                input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
                .actions { margin-top: 10px; }
                button { padding: 8px 15px; cursor: pointer; }
                .btn-save { background-color: #27ae60; color: white; border: none; }
                .btn-cancel { background-color: #95a5a6; color: white; border: none; }
            </style>
            <form id="form">
                <label>Nombre:</label>
                <input type="text" name="nombre" value="${p.nombre || ''}" required>
                
                <label>Precio:</label>
                <input type="number" step="0.01" name="precio" value="${p.precio || ''}" required>
                
                <label>Stock:</label>
                <input type="number" name="stock" value="${p.stock || ''}" required>
                
                <label>Alerta Stock (Mínimo):</label>
                <input type="number" name="alerta_stock" value="${p.alerta_stock || 10}" required>
                
                <label>ID Proveedor:</label>
                <input type="number" name="proveedor_id" value="${p.proveedor_id || ''}" required>

                <div class="actions">
                    <button type="submit" class="btn-save">Guardar</button>
                    <button type="button" id="btnCancel" class="btn-cancel">Cancelar</button>
                </div>
            </form>
        `;

        this.shadowRoot.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            if (this._producto) data.id = this._producto.id;
            
            this.dispatchEvent(new CustomEvent('submit-producto', { detail: { producto: data, isEdit: !!this._producto } }));
        });

        this.shadowRoot.getElementById('btnCancel').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cancel-form'));
        });
    }
}

customElements.define('producto-form', ProductoForm);