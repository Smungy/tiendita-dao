// pagina de proveedores con CRUD completo
function renderProveedores() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Proveedores</h1>
                <button class="btn btn-primary" id="btnNuevo">+ Nuevo Proveedor</button>
            </div>
            
            <div id="alertContainer"></div>
            <div id="proveedoresContainer">
                <div class="loading">Cargando proveedores...</div>
            </div>
        </div>
    `;

  cargarProveedores();

  document.getElementById("btnNuevo").addEventListener("click", () => {
    mostrarFormulario();
  });
}

async function cargarProveedores() {
  const container = document.getElementById("proveedoresContainer");

  try {
    const proveedores = await proveedoresService.getAll();

    container.innerHTML = "<proveedores-list></proveedores-list>";
    const lista = container.querySelector("proveedores-list");
    lista.proveedores = proveedores;

    lista.addEventListener("edit-proveedor", (e) => {
      editarProveedor(e.detail.id);
    });

    lista.addEventListener("delete-proveedor", (e) => {
      eliminarProveedor(e.detail.id);
    });
  } catch (error) {
    mostrarAlerta("Error al cargar proveedores: " + error.message, "error");
    container.innerHTML = '<p class="error">Error al cargar datos</p>';
  }
}

function mostrarFormulario(proveedor = null) {
  const modal = document.getElementById("main-modal");
  const titulo = proveedor ? "Editar Proveedor" : "Nuevo Proveedor";

  const formContainer = document.createElement("div");
  formContainer.innerHTML = "<proveedor-form></proveedor-form>";

  modal.open(titulo, formContainer);

  const form = formContainer.querySelector("proveedor-form");
  if (proveedor) {
    form.proveedor = proveedor;
  }

  form.addEventListener("submit-proveedor", async (e) => {
    const { proveedor: datos, isEdit } = e.detail;
    await guardarProveedor(datos, isEdit);
    modal.close();
  });

  form.addEventListener("cancel-form", () => {
    modal.close();
  });
}

async function guardarProveedor(proveedor, isEdit) {
  try {
    if (isEdit) {
      await proveedoresService.update(proveedor.id, proveedor);
      mostrarAlerta("Proveedor actualizado correctamente", "success");
    } else {
      await proveedoresService.create(proveedor);
      mostrarAlerta("Proveedor creado correctamente", "success");
    }
    cargarProveedores();
  } catch (error) {
    mostrarAlerta("Error: " + error.message, "error");
  }
}

async function editarProveedor(id) {
  try {
    const proveedor = await proveedoresService.getById(id);
    mostrarFormulario(proveedor);
  } catch (error) {
    mostrarAlerta("Error al cargar proveedor: " + error.message, "error");
  }
}

async function eliminarProveedor(id) {
  if (!confirm("Estas seguro de eliminar este proveedor?")) {
    return;
  }

  try {
    await proveedoresService.delete(id);
    mostrarAlerta("Proveedor eliminado correctamente", "success");
    cargarProveedores();
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

window.renderProveedores = renderProveedores;
