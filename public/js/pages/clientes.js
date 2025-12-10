// pagina de clientes con CRUD completo
function renderClientes() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Clientes</h1>
                <button class="btn btn-primary" id="btnNuevoCliente">+ Nuevo Cliente</button>
            </div>
            
            <div id="alertContainerClientes"></div>
            <div id="clientesContainer">
                <div class="loading">Cargando clientes...</div>
            </div>
        </div>
    `;

  cargarClientes();

  document.getElementById("btnNuevoCliente").addEventListener("click", () => {
    mostrarFormularioCliente();
  });
}

async function cargarClientes() {
  const container = document.getElementById("clientesContainer");

  try {
    const clientes = await clientesService.getAll();

    container.innerHTML = "<clientes-list></clientes-list>";
    const lista = container.querySelector("clientes-list");
    lista.clientes = clientes;

    lista.addEventListener("edit-cliente", (e) => {
      editarCliente(e.detail.id);
    });

    lista.addEventListener("delete-cliente", (e) => {
      eliminarCliente(e.detail.id);
    });
  } catch (error) {
    mostrarAlertaCliente("Error al cargar clientes: " + error.message, "error");
    container.innerHTML = '<p class="error">Error al cargar datos</p>';
  }
}

function mostrarFormularioCliente(cliente = null) {
  const modal = document.getElementById("main-modal");
  const titulo = cliente ? "Editar Cliente" : "Nuevo Cliente";

  const formContainer = document.createElement("div");
  formContainer.innerHTML = "<cliente-form></cliente-form>";

  modal.open(titulo, formContainer);

  // Pequeño delay para asegurar que el componente esté completamente cargado
  setTimeout(() => {
    const form = formContainer.querySelector("cliente-form");
    if (form) {
      if (cliente) {
        form.cliente = cliente;
      }

      form.addEventListener("submit-cliente", async (e) => {
        const { cliente: datos, isEdit } = e.detail;
        await guardarCliente(datos, isEdit);
        modal.close();
      });

      form.addEventListener("cancel-form", () => {
        modal.close();
      });
    } else {
      console.error("No se pudo cargar el componente cliente-form");
      mostrarAlertaCliente("Error al cargar el formulario", "error");
      modal.close();
    }
  }, 50);
}

async function guardarCliente(cliente, isEdit) {
  try {
    if (isEdit) {
      await clientesService.update(cliente.id, cliente);
      mostrarAlertaCliente("Cliente actualizado correctamente", "success");
    } else {
      await clientesService.create(cliente);
      mostrarAlertaCliente("Cliente creado correctamente", "success");
    }
    cargarClientes();
  } catch (error) {
    mostrarAlertaCliente("Error: " + error.message, "error");
  }
}

async function editarCliente(id) {
  try {
    const cliente = await clientesService.getById(id);
    mostrarFormularioCliente(cliente);
  } catch (error) {
    mostrarAlertaCliente("Error al cargar cliente: " + error.message, "error");
  }
}

async function eliminarCliente(id) {
  if (!confirm("¿Estás seguro de eliminar este cliente?")) {
    return;
  }

  try {
    await clientesService.delete(id);
    mostrarAlertaCliente("Cliente eliminado correctamente", "success");
    cargarClientes();
  } catch (error) {
    mostrarAlertaCliente("Error al eliminar: " + error.message, "error");
  }
}

function mostrarAlertaCliente(mensaje, tipo) {
  const container = document.getElementById("alertContainerClientes");
  if (container) {
    container.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    setTimeout(() => {
      container.innerHTML = "";
    }, 3000);
  }
}

window.renderClientes = renderClientes;