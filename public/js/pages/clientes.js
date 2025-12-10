function renderClientes() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Clientes</h1>
            </div>
            
            <div class="pendiente-mensaje">
                <h2>INTEGRANTE 3</h2>
                <p>Aqui va tu parte de Clientes</p>
            </div>
        </div>
    `;
}

window.renderClientes = renderClientes;
