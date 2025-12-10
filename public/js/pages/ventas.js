function renderVentas() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Ventas</h1>
            </div>
            
            <div class="pendiente-mensaje">
                <h2>INTEGRANTE 4</h2>
                <p>Aqui va tu parte de Ventas</p>
            </div>
        </div>
    `;
}

window.renderVentas = renderVentas;
