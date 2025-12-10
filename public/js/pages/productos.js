function renderProductos() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Gestión de Productos</h1>
                <button class="btn btn-primary" id="btnNuevo">+ Nuevo Producto</button>
            </div>
            <div id="alertContainer"></div>
            <div id="productosContainer">Loading...</div>
        </div>
    `;

    cargarProductos();
    
    
    if ("Notification" in window) {
        Notification.requestPermission();
    }

    document.getElementById("btnNuevo").addEventListener("click", () => mostrarFormulario());
}

async function cargarProductos() {
    try {
        const productos = await productosService.getAll();
        const container = document.getElementById("productosContainer");
        container.innerHTML = "<productos-list></productos-list>";
        
        const lista = container.querySelector("productos-list");
        lista.productos = productos;

        // Verificar stock bajo y notificar
        verificarStockBajo(productos);

        lista.addEventListener("edit-producto", (e) => editarProducto(e.detail.id));
        lista.addEventListener("delete-producto", (e) => eliminarProducto(e.detail.id));
    } catch (error) {
        console.error(error);
        document.getElementById("productosContainer").innerHTML = "Error al cargar productos";
    }
}

// Lógica de Notificaciones 
function verificarStockBajo(productos) {
    if (Notification.permission === "granted") {
        const bajos = productos.filter(p => p.stock <= p.alerta_stock);
        if (bajos.length > 0) {
            new Notification(" Alerta de Inventario", {
                body: `Tienes ${bajos.length} productos con stock bajo. ¡Revisa tu inventario!`,
                icon: "/vite.svg" 
            });
        }
    }
}

function mostrarFormulario(producto = null) {
    const modal = document.getElementById("main-modal");
    const container = document.createElement("div");
    container.innerHTML = "<producto-form></producto-form>";
    
    const form = container.querySelector("producto-form");
    if (producto) form.producto = producto;

    form.addEventListener("submit-producto", async (e) => {
        const { producto, isEdit } = e.detail;
        try {
            if (isEdit) await productosService.update(producto.id, producto);
            else await productosService.create(producto);
            modal.close();
            cargarProductos();
        } catch (error) {
            alert("Error al guardar: " + error.message);
        }
    });

    form.addEventListener("cancel-form", () => modal.close());
    
    modal.open(producto ? "Editar Producto" : "Nuevo Producto", container);
}

async function editarProducto(id) {
    const producto = await productosService.getById(id);
    mostrarFormulario(producto);
}

async function eliminarProducto(id) {
    if(confirm("¿Seguro que deseas eliminar este producto?")) {
        await productosService.delete(id);
        cargarProductos();
    }
}

window.renderProductos = renderProductos;