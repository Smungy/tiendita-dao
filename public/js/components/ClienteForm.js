// componente formulario de cliente con shadow DOM
class ClienteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cliente = null;
    this._isEdit = false;
  }

  connectedCallback() {
    this.render();
  }

  set cliente(value) {
    this._cliente = value;
    this._isEdit = !!value;
    this.render();
  }

  render() {
    const c = this._cliente || {};

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
                input {
                    padding: 0.75rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                input:focus {
                    outline: none;
                    border-color: #1a1a1a;
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

            <form id="clienteForm">
                <div class="form-group">
                    <label for="nombre">Nombre *</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre"
                        value="${c.nombre || ""}"
                        required 
                        minlength="3"
                        maxlength="100"
                    >
                </div>

                <div class="form-group">
                    <label for="telefono">Teléfono * (10 dígitos)</label>
                    <input 
                        type="tel" 
                        id="telefono" 
                        name="telefono"
                        value="${c.telefono || ""}"
                        required 
                        pattern="[0-9]{10}"
                        maxlength="10"
                    >
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="btnCancel">Cancelar</button>
                    <button type="submit" class="btn btn-primary">
                        ${this._isEdit ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        `;

    const form = this.shadowRoot.getElementById("clienteForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const cliente = {
        nombre: formData.get("nombre"),
        telefono: formData.get("telefono"),
      };
      if (this._isEdit) {
        cliente.id = this._cliente.id;
      }
      this.dispatchEvent(
        new CustomEvent("submit-cliente", {
          detail: { cliente, isEdit: this._isEdit },
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

customElements.define("cliente-form", ClienteForm);
