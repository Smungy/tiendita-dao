// pagina de login
function renderLogin() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="auth-container">
            <div class="auth-right">
                <h2>Mi Tiendita</h2>
                <p>Sistema de gestion para tu negocio</p>
                
                <ul class="auth-features">
                    <li>
                        <div class="feature-icon">1</div>
                        <div>
                            <strong>Gestion de Inventario</strong><br>
                            <span>Controla tus productos y stock en tiempo real</span>
                        </div>
                    </li>
                    <li>
                        <div class="feature-icon">2</div>
                        <div>
                            <strong>Control de Proveedores</strong><br>
                            <span>Administra tus proveedores y contactos</span>
                        </div>
                    </li>
                    <li>
                        <div class="feature-icon">3</div>
                        <div>
                            <strong>Registro de Ventas</strong><br>
                            <span>Lleva el control de todas tus transacciones</span>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="auth-left">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Iniciar Sesion</h1>
                        <p>Ingresa tus credenciales</p>
                    </div>
                    
                    <form id="loginForm" class="auth-form">
                        <div class="form-group">
                            <label for="username">Usuario</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <div id="errorMessage" class="error-message"></div>
                        
                        <button type="submit" class="btn btn-primary" id="btnLogin">
                            Iniciar Sesion
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>No tienes cuenta? <a href="#/register">Registrate aqui</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const btnLogin = document.getElementById("btnLogin");
    const errorMessage = document.getElementById("errorMessage");

    btnLogin.disabled = true;
    btnLogin.textContent = "Iniciando...";
    errorMessage.textContent = "";

    try {
      await authService.login(username, password);
      const navbar = document.querySelector("navbar-component");
      if (navbar) navbar.update();
      window.location.hash = "#/proveedores";
    } catch (error) {
      errorMessage.textContent = error.message || "Error al iniciar sesion";
    } finally {
      btnLogin.disabled = false;
      btnLogin.textContent = "Iniciar Sesion";
    }
  });
}

window.renderLogin = renderLogin;
