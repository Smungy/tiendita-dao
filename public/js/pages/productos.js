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

    
    document.getElementById("btnNuevo").addEventListener("click", () => mostrarFormularioProducto());
}

async function cargarProductos() {
    try {
        const productos = await productosService.getAll();
        const container = document.getElementById("productosContainer");
        container.innerHTML = "<productos-list></productos-list>";
        
        const lista = container.querySelector("productos-list");
        lista.productos = productos;

        verificarStockBajo(productos);

        
        lista.addEventListener("edit-producto", (e) => editarProducto(e.detail.id));
        lista.addEventListener("delete-producto", (e) => eliminarProducto(e.detail.id));
    } catch (error) {
        console.error(error);
        document.getElementById("productosContainer").innerHTML = "<p>Error al cargar productos.</p>";
    }
}

function verificarStockBajo(productos) {
    if (Notification.permission === "granted") {
        const bajos = productos.filter(p => parseInt(p.stock) <= parseInt(p.alerta_stock));
        if (bajos.length > 0) {
            new Notification("Alerta de Inventario", {
                body: `Tienes ${bajos.length} productos con stock bajo. ¡Revisa tu inventario!`,
                icon: "/vite.svg" 
            });
        }
    }
}


function mostrarFormularioProducto(producto = null) {
    const modal = document.getElementById("main-modal");
    const container = document.createElement("div");
    container.innerHTML = "<producto-form></producto-form>";
    
    const form = container.querySelector("producto-form");
    if (producto) form.producto = producto;

    form.addEventListener("submit-producto", async (e) => {
        const { producto, isEdit } = e.detail;
        console.log("Datos a enviar:", producto); 

        try {
            if (isEdit) {
                await productosService.update(producto.id, producto);
            } else {
                await productosService.create(producto);
            }
            modal.close();
            cargarProductos(); 
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar: " + (error.message || "Verifica los datos"));
        }
    });

    form.addEventListener("cancel-form", () => modal.close());
    
    modal.open(producto ? "Editar Producto" : "Nuevo Producto", container);
}

async function editarProducto(id) {
    try {
        const producto = await productosService.getById(id);
       
        mostrarFormularioProducto(producto);
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar el producto para editar.");
    }
}

async function eliminarProducto(id) {
    if(confirm("¿Seguro que deseas eliminar este producto?")) {
        try {
            await productosService.delete(id);
            cargarProductos(); 
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar el producto. Es posible que tenga ventas registradas.");
        }
    }
}

window.renderProductos = renderProductos;