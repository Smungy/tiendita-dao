// componente formulario de proveedor con shadow DOM
class ProveedorForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._proveedor = null;
    this._isEdit = false;
  }

  connectedCallback() {
    this.render();
  }

  set proveedor(value) {
    this._proveedor = value;
    this._isEdit = !!value;
    this.render();
  }

  render() {
    const p = this._proveedor || {};

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
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
                input, textarea {
                    padding: 0.75rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: #1a1a1a;
                }
                textarea {
                    resize: vertical;
                    min-height: 80px;
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
            </style>

            <form id="proveedorForm">
                <div class="form-group">
                    <label for="nombre_empresa">Nombre de la Empresa *</label>
                    <input 
                        type="text" 
                        id="nombre_empresa" 
                        name="nombre_empresa"
                        value="${p.nombre_empresa || ""}"
                        required 
                        minlength="3"
                        maxlength="100"
                    >
                </div>

                <div class="form-group">
                    <label for="contacto_nombre">Nombre del Contacto *</label>
                    <input 
                        type="text" 
                        id="contacto_nombre" 
                        name="contacto_nombre"
                        value="${p.contacto_nombre || ""}"
                        required 
                        minlength="3"
                        maxlength="100"
                    >
                </div>

                <div class="form-group">
                    <label for="telefono">Telefono *</label>
                    <input 
                        type="tel" 
                        id="telefono" 
                        name="telefono"
                        value="${p.telefono || ""}"
                        required 
                        pattern="[0-9]{10}"
                        maxlength="10"
                    >
                </div>

                <div class="form-group">
                    <label for="direccion">Direccion *</label>
                    <textarea 
                        id="direccion" 
                        name="direccion"
                        required 
                        minlength="5"
                        maxlength="200"
                    >${p.direccion || ""}</textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
                    <button type="submit" class="btn btn-primary">
                        ${this._isEdit ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        `;

    const form = this.shadowRoot.getElementById("proveedorForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const proveedor = {
        nombre_empresa: formData.get("nombre_empresa"),
        contacto_nombre: formData.get("contacto_nombre"),
        telefono: formData.get("telefono"),
        direccion: formData.get("direccion"),
      };

      if (this._isEdit) {
        proveedor.id = this._proveedor.id;
      }

      this.dispatchEvent(
        new CustomEvent("submit-proveedor", {
          detail: { proveedor, isEdit: this._isEdit },
        })
      );
    });

    this.shadowRoot
      .getElementById("btnCancel")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("cancel-form"));
      });
  }
}


customElements.define("proveedor-form", ProveedorForm);