// Importar el servicio de ventas
import * as ventasService from '../services/ventasService.js';

// Importar componentes
import '../components/VentasList.js';
import '../components/VentaForm.js';

let ventas = [];
let loading = false;
let error = '';
let showForm = false;
let editingVenta = null;

// Referencias a los componentes
let listComponent = null;
let formComponent = null;

// Función para cargar las ventas
async function loadVentas() {
  try {
    loading = true;
    error = '';
    updateUI();
    
    ventas = await ventasService.getAll();
    loading = false;
    updateUI();
  } catch (err) {
    error = err.message || 'Error al cargar ventas';
    loading = false;
    
    // Si el error es de autenticación, mostrar mensaje más claro
    if (err.message.includes('AUTH_ERROR')) {
      error = '⚠️ No estás autenticado. Por favor, inicia sesión usando el modal.';
    } else if (err.message.includes('CONNECTION_ERROR')) {
      error = '❌ ' + err.message.replace('CONNECTION_ERROR: ', '');
    }
    
    updateUI();
    console.error('Error loading ventas:', err);
  }
}

// Función para manejar la creación de nueva venta
function handleCreate() {
  editingVenta = null;
  showForm = true;
  error = '';
  updateUI();
}

// Función para manejar la vista previa de venta
async function handleView(id) {
  try {
    error = '';
    const venta = await ventasService.getById(id);
    mostrarVistaPrevia(venta);
  } catch (err) {
    error = err.message || 'Error al cargar venta';
    updateUI();
    console.error('Error loading venta:', err);
  }
}

// Función para mostrar vista previa de la venta
function mostrarVistaPrevia(venta) {
  // Crear modal
  const modal = document.createElement('div');
  modal.id = 'venta-preview-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  const fechaFormateada = venta.fecha 
    ? new Date(venta.fecha).toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';
  
  const metodoPagoFormateado = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'otro': 'Otro'
  }[venta.metodo_pago] || venta.metodo_pago || 'N/A';
  
  const totalFormateado = venta.total 
    ? new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(venta.total)
    : '$0.00';
  
  modal.innerHTML = `
    <div style="
      background: white;
      padding: 32px;
      border-radius: 8px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #18181b;">Detalles de la Venta</h2>
        <button id="close-preview" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #18181b;
        ">
          <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">ID de Venta</div>
          <div style="font-size: 18px; font-weight: 600; color: #18181b;">#${venta.id}</div>
        </div>
        
        <div>
          <div style="font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Fecha</div>
          <div style="font-size: 16px; color: #18181b; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
            ${fechaFormateada}
          </div>
        </div>
        
        <div>
          <div style="font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Cliente ID</div>
          <div style="font-size: 16px; color: #18181b; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
            ${venta.cliente_id || 'N/A'}
          </div>
        </div>
        
        <div>
          <div style="font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 8px;">Método de Pago</div>
          <div style="font-size: 16px; color: #18181b; padding: 12px; background-color: #f9fafb; border-radius: 6px;">
            ${metodoPagoFormateado}
          </div>
        </div>
        
        <div style="
          padding: 20px;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border-radius: 8px;
          color: white;
        ">
          <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Total</div>
          <div style="font-size: 32px; font-weight: 600;">${totalFormateado}</div>
        </div>
      </div>
      
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <button id="edit-from-preview" style="
          width: 100%;
          padding: 12px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 12px;
        ">Editar Venta</button>
        <button id="close-preview-btn" style="
          width: 100%;
          padding: 12px;
          background-color: #e5e7eb;
          color: #374151;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        ">Cerrar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners
  const closeBtn = document.getElementById('close-preview');
  const closeBtn2 = document.getElementById('close-preview-btn');
  const editBtn = document.getElementById('edit-from-preview');
  
  const cerrarModal = () => {
    modal.remove();
  };
  
  closeBtn.addEventListener('click', cerrarModal);
  closeBtn2.addEventListener('click', cerrarModal);
  editBtn.addEventListener('click', () => {
    modal.remove();
    handleEdit(venta.id);
  });
  
  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });
}

// Función para manejar la edición de venta
async function handleEdit(id) {
  try {
    error = '';
    updateUI();
    
    editingVenta = await ventasService.getById(id);
    showForm = true;
    updateUI();
  } catch (err) {
    error = err.message || 'Error al cargar venta';
    updateUI();
    console.error('Error loading venta:', err);
  }
}

// Función para manejar la eliminación de venta
async function handleDelete(id) {
  if (!confirm('¿Estás seguro de eliminar esta venta?')) {
    return;
  }

  try {
    error = '';
    updateUI();
    
    await ventasService.deleteVenta(id);
    await loadVentas();
  } catch (err) {
    error = err.message || 'Error al eliminar venta';
    updateUI();
    console.error('Error deleting venta:', err);
  }
}

// Función para manejar el envío del formulario
async function handleSubmit(ventaData) {
  try {
    error = '';
    updateUI();
    
    if (editingVenta) {
      await ventasService.update(editingVenta.id, ventaData);
    } else {
      await ventasService.create(ventaData);
    }
    
    showForm = false;
    editingVenta = null;
    await loadVentas();
  } catch (err) {
    error = err.message || 'Error al guardar venta';
    updateUI();
    console.error('Error saving venta:', err);
  }
}

// Función para manejar la cancelación del formulario
function handleCancel() {
  showForm = false;
  editingVenta = null;
  error = '';
  updateUI();
}

// Función para actualizar la UI
function updateUI() {
  const container = document.getElementById('ventas-container');
  if (!container) return;

  container.innerHTML = `
    <div style="padding: 32px; max-width: 1400px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 600; color: #18181b; letter-spacing: -0.025em;">
          Gestión de Ventas
        </h1>
        ${!showForm ? `
          <button id="btn-new-venta" style="
            padding: 12px 24px;
            background-color: #18181b;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
          ">
            Nueva Venta
          </button>
        ` : ''}
      </div>

      ${error ? `
        <div style="
          padding: 14px;
          background-color: #fef2f2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 14px;
          border: 1px solid #fee2e2;
          margin-bottom: 24px;
        ">
          ${error}
        </div>
      ` : ''}

      ${loading ? `
        <div style="padding: 40px; text-align: center; color: #6b7280; font-size: 16px;">
          Cargando...
        </div>
      ` : showForm ? `
        <venta-form id="venta-form"></venta-form>
      ` : `
        <ventas-list id="ventas-list"></ventas-list>
      `}
    </div>
  `;

  // Configurar event listeners
  setupEventListeners();
}

// Función para configurar los event listeners
function setupEventListeners() {
  // Botón de nueva venta
  const btnNew = document.getElementById('btn-new-venta');
  if (btnNew) {
    btnNew.addEventListener('click', handleCreate);
  }

  // Componente de lista
  listComponent = document.getElementById('ventas-list');
  if (listComponent) {
    listComponent.ventas = ventas;
    
    // Event listeners para la lista
    const onEdit = (event) => {
      handleEdit(event.detail.id);
    };
    
    const onDelete = (event) => {
      handleDelete(event.detail.id);
    };
    
    const onView = (event) => {
      handleView(event.detail.id);
    };
    
    listComponent.addEventListener('edit-venta', onEdit);
    listComponent.addEventListener('delete-venta', onDelete);
    listComponent.addEventListener('view-venta', onView);
  }

  // Componente de formulario
  formComponent = document.getElementById('venta-form');
  if (formComponent) {
    formComponent.venta = editingVenta;
    
    // Event listeners para el formulario
    const onSubmit = (event) => {
      handleSubmit(event.detail.venta);
    };
    
    const onCancel = () => {
      handleCancel();
    };
    
    formComponent.addEventListener('submit-venta', onSubmit);
    formComponent.addEventListener('cancel-form', onCancel);
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadVentas();
  });
} else {
  loadVentas();
}

// Exportar funciones para uso global si es necesario
window.ventasPage = {
  loadVentas,
  handleCreate,
  handleEdit,
  handleDelete,
  handleSubmit,
  handleCancel
};

