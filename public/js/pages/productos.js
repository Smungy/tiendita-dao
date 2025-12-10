function renderProductos() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Productos</h1>
            </div>
            
            <div class="pendiente-mensaje">
                <h2>INTEGRANTE 2</h2>
                <p>Aqui va tu parte de Productos</p>
            </div>
        </div>
    `;
}

window.renderProductos = renderProductos;
