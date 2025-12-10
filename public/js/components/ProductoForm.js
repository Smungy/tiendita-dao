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
        const isEdit = !!this._producto;

        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 10px;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #333;
                }

                input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                }

                input:focus {
                    outline: none;
                    border-color: #1a1a1a;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }

                button {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-save {
                    background-color: #27ae60;
                    color: white;
                }

                .btn-cancel {
                    background-color: #95a5a6;
                    color: white;
                }
                
                .btn-save:hover { background-color: #219150; }
                .btn-cancel:hover { background-color: #7f8c8d; }
            </style>

            <form id="productoForm">
                <div class="form-group">
                    <label>Nombre del Producto *</label>
                    <input type="text" name="nombre" value="${p.nombre || ''}" required minlength="3">
                </div>
                
                <div class="form-group">
                    <label>Precio *</label>
                    <input type="number" step="0.50" name="precio" value="${p.precio || ''}" required min="0">
                </div>
                
                <div class="form-group">
                    <label>Stock Actual *</label>
                    <input type="number" name="stock" value="${p.stock || ''}" required min="0">
                </div>
                
                <div class="form-group">
                    <label>Alerta de Stock Mínimo</label>
                    <input type="number" name="alerta_stock" value="${p.alerta_stock || 10}" required min="0">
                </div>
                
                <div class="form-group">
                    <label>ID Proveedor (Opcional)</label>
                    <input type="number" name="proveedor_id" value="${p.proveedor_id || ''}" placeholder="Ej: 1">
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-save">
                        ${isEdit ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button type="button" id="btnCancel" class="btn-cancel">Cancelar</button>
                </div>
            </form>
        `;

        const form = this.shadowRoot.getElementById('productoForm');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            
            const data = {
                nombre: formData.get('nombre'),
                precio: parseFloat(formData.get('precio')),
                stock: parseInt(formData.get('stock')),
                alerta_stock: parseInt(formData.get('alerta_stock')),
                
                proveedor_id: formData.get('proveedor_id') ? parseInt(formData.get('proveedor_id')) : null,
               
                proveedor_nombre: "Proveedor General" 
            };

            if (this._producto) {
                data.id = this._producto.id;
            }
            
            
            this.dispatchEvent(new CustomEvent('submit-producto', { 
                detail: { 
                    producto: data, 
                    isEdit: !!this._producto 
                },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.getElementById('btnCancel').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('cancel-form', {
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('producto-form', ProductoForm);