class ProductoForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._producto = null;
        this._proveedores = []; 
    }

    set producto(value) {
        this._producto = value;
       
        if (this._proveedores.length > 0) this.render();
    }

    async connectedCallback() {
        
        await this.cargarProveedores();
        this.render();
    }

    async cargarProveedores() {
        try {
           
            if (window.proveedoresService) {
                this._proveedores = await window.proveedoresService.getAll();
            } else {
                console.warn("Servicio de proveedores no disponible");
            }
        } catch (error) {
            console.error("Error al cargar proveedores para el select:", error);
        }
    }

    render() {
        const p = this._producto || {};
        const isEdit = !!this._producto;

        
        const opcionesProveedores = this._proveedores.map(prov => {
            const selected = (p.proveedor_id === prov.id) ? 'selected' : '';
            return `<option value="${prov.id}" ${selected}>${prov.nombre_empresa}</option>`;
        }).join('');

        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    padding: 10px;
                    font-family: system-ui, -apple-system, sans-serif;
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

                input, select {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 1rem;
                    background-color: white;
                }

                input:focus, select:focus {
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
                    <label>Proveedor *</label>
                    <select name="proveedor_id" required>
                        <option value="">-- Selecciona un proveedor --</option>
                        ${opcionesProveedores}
                    </select>
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
            
            
            const proveedorIdSeleccionado = parseInt(formData.get('proveedor_id'));
            
            
            const proveedorObj = this._proveedores.find(prov => prov.id === proveedorIdSeleccionado);
            const nombreProveedor = proveedorObj ? proveedorObj.nombre_empresa : "Proveedor General";

            const data = {
                nombre: formData.get('nombre'),
                precio: parseFloat(formData.get('precio')),
                stock: parseInt(formData.get('stock')),
                alerta_stock: parseInt(formData.get('alerta_stock')),
                proveedor_id: proveedorIdSeleccionado,
                proveedor_nombre: nombreProveedor
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