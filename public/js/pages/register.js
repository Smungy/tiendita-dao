// pagina de registro
function renderRegister() {
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
                        <h1>Crear Cuenta</h1>
                        <p>Registrate para comenzar</p>
                    </div>
                    
                    <form id="registerForm" class="auth-form">
                        <div class="form-group">
                            <label for="username">Usuario</label>
                            <input type="text" id="username" name="username" required minlength="3">
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" required minlength="6">
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required>
                        </div>
                        
                        <div id="errorMessage" class="error-message"></div>
                        <div id="successMessage" class="success-message"></div>
                        
                        <button type="submit" class="btn btn-primary" id="btnRegister">
                            Crear Cuenta
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        <p>Ya tienes cuenta? <a href="#/login">Inicia sesion</a></p>
                    </div>
                </div>
            </div>
        </div>
    `;

  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const btnRegister = document.getElementById("btnRegister");
      const errorMessage = document.getElementById("errorMessage");
      const successMessage = document.getElementById("successMessage");

      if (password !== confirmPassword) {
        errorMessage.textContent = "Las contraseñas no coinciden";
        return;
      }

      btnRegister.disabled = true;
      btnRegister.textContent = "Creando cuenta...";
      errorMessage.textContent = "";
      successMessage.textContent = "";

      try {
        await authService.register(username, password);
        successMessage.textContent = "Cuenta creada! Redirigiendo...";
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 1500);
      } catch (error) {
        errorMessage.textContent = error.message || "Error al crear cuenta";
        btnRegister.disabled = false;
        btnRegister.textContent = "Crear Cuenta";
      }
    });
}

window.renderRegister = renderRegister;
