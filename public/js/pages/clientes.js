function renderClientes() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Clientes</h1>
                <button class="btn btn-primary" id="btnNuevo">+ Nuevo Cliente</button>
            </div>
            
            <div id="alertContainer"></div>
            <div id="clientesContainer">
                <div class="loading">Cargando clientes...</div>
            </div>
        </div>
    `;

  cargarClientes();

  document.getElementById("btnNuevo").addEventListener("click", () => {
    mostrarFormulario();
  });
}

async function cargarClientes() {
  const container = document.getElementById("clientesContainer");

  try {
    const clientes = await clientesService.getAll();

    container.innerHTML = "<clientes-list></clientes-list>";
    const lista = container.querySelector("clientes-list");
    lista.clientes = clientes;

    lista.addEventListener("edit-clientes", (e) => {
      editarCliente(e.detail.id);
    });

    lista.addEventListener("delete-cliente", (e) => {
      eliminarCliente(e.detail.id);
    });
  } catch (error) {
    mostrarAlerta("Error al cargar clientes: " + error.message, "error");
    container.innerHTML = '<p class="error">Error al cargar datos</p>';
  }
}

function mostrarFormulario(cliente = null) {
  const modal = document.getElementById("main-modal");
  const titulo = cliente ? "Editar Cliente" : "Nuevo Cliente";

  const formContainer = document.createElement("div");
  formContainer.innerHTML = "<cliente-form></cliente-form>";

  modal.open(titulo, formContainer);

  const form = formContainer.querySelector("cliente-form");
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
}

async function guardarCliente(cliente, isEdit) {
  try {
    if (isEdit) {
      await clientesService.update(cliente.id, cliente);
      mostrarAlerta("Cliente actualizado correctamente", "success");
    } else {
      await clientesService.create(cliente);
      mostrarAlerta("Cliente creado correctamente", "success");
    }
    cargarClientes();
  } catch (error) {
    mostrarAlerta("Error: " + error.message, "error");
  }
}

async function editarCliente(id) {
  try {
    const cliente = await clientesService.getById(id);
    mostrarFormulario(cliente);
  } catch (error) {
    mostrarAlerta("Error al cargar cliente: " + error.message, "error");
  }
}

async function eliminarCliente(id) {
  if (!confirm("Estas seguro de eliminar este cliente?")) {
    return;
  }

  try {
    await clientesService.delete(id);
    mostrarAlerta(Cliente, eliminado, correctamente, "success");
    cargarClientes();
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

window.renderClientes = renderClientes;