// pagina de ventas con CRUD completo
function renderVentas() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Ventas</h1>
                <button class="btn btn-primary" id="btnNuevo">+ Nueva Venta</button>
            </div>
            
            <div id="alertContainer"></div>
            <div id="ventasContainer">
                <div class="loading">Cargando ventas...</div>
            </div>
        </div>
    `;

  cargarVentas();

  document.getElementById("btnNuevo").addEventListener("click", () => {
    mostrarFormulario();
  });
}

async function cargarVentas() {
  const container = document.getElementById("ventasContainer");

  try {
    const ventas = await ventasService.getAll();

    container.innerHTML = "<ventas-list></ventas-list>";
    const lista = container.querySelector("ventas-list");
    lista.ventas = ventas;

    lista.addEventListener("edit-venta", (e) => {
      editarVenta(e.detail.id);
    });

    lista.addEventListener("delete-venta", (e) => {
      eliminarVenta(e.detail.id);
    });

    lista.addEventListener("view-venta", (e) => {
      verVenta(e.detail.id);
    });
  } catch (error) {
    mostrarAlerta("Error al cargar ventas: " + error.message, "error");
    container.innerHTML = '<p class="error">Error al cargar datos</p>';
  }
}

function mostrarFormulario(venta = null) {
  const modal = document.getElementById("main-modal");
  const titulo = venta ? "Editar Venta" : "Nueva Venta";

  const formContainer = document.createElement("div");
  formContainer.innerHTML = "<venta-form></venta-form>";

  modal.open(titulo, formContainer, true); // true para modal grande

  const form = formContainer.querySelector("venta-form");
  if (venta) {
    form.venta = venta;
  }

  form.addEventListener("submit-venta", async (e) => {
    const { venta: datos, isEdit } = e.detail;
    await guardarVenta(datos, isEdit);
    modal.close();
  });

  form.addEventListener("cancel-form", () => {
    modal.close();
  });
}

async function guardarVenta(venta, isEdit) {
  try {
    // Nota: El backend actual solo acepta la venta básica
    // Los detalles de venta se manejarían en una segunda llamada o endpoint adicional
    const ventaData = {
      fecha: venta.fecha,
      total: venta.total,
      metodo_pago: venta.metodo_pago,
      cliente_id: venta.cliente_id,
    };

    if (isEdit) {
      await ventasService.update(venta.id, ventaData);
      mostrarAlerta("Venta actualizada correctamente", "success");
    } else {
      const resultado = await ventasService.create(ventaData);
      mostrarAlerta("Venta creada correctamente", "success");
      
      // TODO: Aquí se podrían crear los detalles de venta si hay un endpoint
      // if (venta.productos && venta.productos.length > 0) {
      //   await crearDetallesVenta(resultado.ventaId, venta.productos);
      // }
    }
    cargarVentas();
  } catch (error) {
    mostrarAlerta("Error: " + error.message, "error");
  }
}

async function editarVenta(id) {
  try {
    const venta = await ventasService.getById(id);
    mostrarFormulario(venta);
  } catch (error) {
    mostrarAlerta("Error al cargar venta: " + error.message, "error");
  }
}

async function verVenta(id) {
  try {
    const [venta, detalles] = await Promise.all([
      ventasService.getById(id),
      ventasService.getDetalles(id).catch(() => []) // Si no hay detalles, retorna array vacío
    ]);
    
    const modal = document.getElementById("main-modal");
    
    const formatearMoneda = (cantidad) => {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(cantidad || 0);
    };
    
    const detallesHTML = `
      <style>
        .venta-detalle {
          padding: 1rem;
        }
        .venta-info {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #eee;
        }
        .venta-info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .venta-info-label {
          font-weight: 600;
          color: #333;
        }
        .venta-info-value {
          color: #666;
        }
        .productos-titulo {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #333;
        }
        .productos-tabla {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .productos-tabla th {
          background: #f8f9fa;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        .productos-tabla td {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
        }
        .productos-tabla tr:hover {
          background-color: #f8f9fa;
        }
        .text-right {
          text-align: right;
        }
        .total-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid #1a1a1a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .sin-productos {
          text-align: center;
          padding: 2rem;
          color: #666;
          font-style: italic;
        }
      </style>
      <div class="venta-detalle">
        <div class="venta-info">
          <h3 style="margin-top: 0;">Venta #${venta.id}</h3>
          <div class="venta-info-item">
            <span class="venta-info-label">Fecha:</span>
            <span class="venta-info-value">${new Date(venta.fecha).toLocaleString("es-MX")}</span>
          </div>
          <div class="venta-info-item">
            <span class="venta-info-label">Cliente ID:</span>
            <span class="venta-info-value">${venta.cliente_id || "N/A"}</span>
          </div>
          <div class="venta-info-item">
            <span class="venta-info-label">Método de Pago:</span>
            <span class="venta-info-value">${venta.metodo_pago ? venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1) : "N/A"}</span>
          </div>
        </div>
        
        <div class="productos-titulo">Productos</div>
        ${
          detalles && detalles.length > 0
            ? `
            <table class="productos-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th class="text-right">Precio Unitario</th>
                  <th class="text-right">Cantidad</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${detalles
                  .map(
                    (d) => `
                  <tr>
                    <td>${d.nombre_producto || "N/A"}</td>
                    <td class="text-right">${formatearMoneda(d.precio_unitario)}</td>
                    <td class="text-right">${d.cantidad}</td>
                    <td class="text-right">${formatearMoneda(d.subtotal)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="total-section">
              <span>Total:</span>
              <span>${formatearMoneda(venta.total)}</span>
            </div>
          `
            : `
            <div class="sin-productos">No hay productos registrados para esta venta</div>
            <div class="total-section">
              <span>Total:</span>
              <span>${formatearMoneda(venta.total)}</span>
            </div>
          `
        }
      </div>
    `;
    
    modal.open(`Venta #${venta.id}`, detallesHTML, true); // true para modal grande
    
    // Agregar botón de cerrar
    setTimeout(() => {
      const overlay = modal.shadowRoot.querySelector(".overlay");
      if (overlay) {
        overlay.addEventListener("click", () => modal.close(), { once: true });
      }
    }, 100);
  } catch (error) {
    mostrarAlerta("Error al cargar venta: " + error.message, "error");
  }
}

async function eliminarVenta(id) {
  if (!confirm("¿Estás seguro de eliminar esta venta?")) {
    return;
  }

  try {
    await ventasService.delete(id);
    mostrarAlerta("Venta eliminada correctamente", "success");
    cargarVentas();
  } catch (error) {
    mostrarAlerta("Error al eliminar: " + error.message, "error");
  }
}

function mostrarAlerta(mensaje, tipo) {
  const container = document.getElementById("alertContainer");
  container.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

  setTimeout(() => {
    container.innerHTML = "";
  }, 3000);
}

window.renderVentas = renderVentas;
