// componente modal reutilizable con shadow DOM
class ModalComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none;
                }
                :host(.open) {
                    display: block;
                }
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal {
                    background: white;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .modal.large {
                    max-width: 900px;
                    width: 95%;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 {
                    margin: 0;
                    color: #333;
                    font-size: 1.25rem;
                }
                .btn-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                }
                .btn-close:hover {
                    color: #333;
                }
                .modal-body {
                    padding: 1.5rem;
                }
            </style>

            <div class="overlay" id="overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2 id="modalTitle">Titulo</h2>
                        <button class="btn-close" id="btnClose">&times;</button>
                    </div>
                    <div class="modal-body" id="modalBody"></div>
                </div>
            </div>
        `;

    this.shadowRoot
      .getElementById("btnClose")
      .addEventListener("click", () => this.close());
    this.shadowRoot.getElementById("overlay").addEventListener("click", (e) => {
      if (e.target.id === "overlay") this.close();
    });
  }

  open(title, content, large = false) {
    this.shadowRoot.getElementById("modalTitle").textContent = title;
    const body = this.shadowRoot.getElementById("modalBody");
    const modal = this.shadowRoot.querySelector(".modal");

    if (large) {
      modal.classList.add("large");
    } else {
      modal.classList.remove("large");
    }

    if (typeof content === "string") {
      body.innerHTML = content;
    } else {
      body.innerHTML = "";
      body.appendChild(content);
    }

    this.classList.add("open");
    this._isOpen = true;
  }

  close() {
    this.classList.remove("open");
    this._isOpen = false;
  }
}

customElements.define("modal-component", ModalComponent);
