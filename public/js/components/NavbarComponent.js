// componente navbar con shadow DOM
class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  update() {
    this.render();
  }

  render() {
    const isLoggedIn = window.isAuthenticated
      ? window.isAuthenticated()
      : false;

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                nav {
                    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand {
                    color: white;
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-decoration: none;
                }
                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                .nav-links a {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                .nav-links a:hover {
                    background-color: rgba(255,255,255,0.2);
                }
                .btn-logout {
                    background-color: #e74c3c;
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 500;
                }
                .btn-logout:hover {
                    background-color: #c0392b;
                }
                @media (max-width: 768px) {
                    .nav-links {
                        gap: 0.5rem;
                    }
                    .nav-links a {
                        padding: 0.5rem;
                        font-size: 0.9rem;
                    }
                }
            </style>

            <nav>
                <div class="nav-container">
                    <a href="#/dashboard" class="brand">Tiendita</a>
                    
                    <div class="nav-links">
                        ${
                          isLoggedIn
                            ? `
                            <a href="#/dashboard">Dashboard</a>
                            <a href="#/proveedores">Proveedores</a>
                            <a href="#/productos">Productos</a>
                            <a href="#/clientes">Clientes</a>
                            <a href="#/ventas">Ventas</a>
                            <button class="btn-logout" id="btnLogout">Salir</button>
                        `
                            : `
                            <a href="#/login">Iniciar Sesion</a>
                            <a href="#/register">Registrarse</a>
                        `
                        }
                    </div>
                </div>
            </nav>
        `;

    const btnLogout = this.shadowRoot.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        authService.logout();
        this.update();
      });
    }
  }
}

customElements.define("navbar-component", NavbarComponent);
