// Servicio para manejar las operaciones de ventas con la API
const API_BASE_URL = '/api/v1/ventas';

// Función para obtener el token de autenticación
function getAuthToken() {
  return localStorage.getItem('token');
}

// Función para hacer peticiones autenticadas
async function apiRequest(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
  } catch (err) {
    // Error de conexión (servidor no disponible)
    if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('CONNECTION_ERROR: El servidor no está disponible. Verifica que esté corriendo en el puerto 3000.');
    }
    throw err;
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Limpiar token inválido
      localStorage.removeItem('token');
      // Disparar evento para mostrar modal de login
      window.dispatchEvent(new CustomEvent('show-login-modal'));
      const error = await response.json().catch(() => ({ error: 'Token no fue proporcionado' }));
      throw new Error('AUTH_ERROR: No estás autenticado. Por favor, inicia sesión.');
    }
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || error.message || 'Error en la petición');
  }

  // Si la respuesta es 204 (No Content), retornar null
  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

// Obtener todas las ventas
export async function getAll() {
  return await apiRequest('');
}

// Obtener venta por ID
export async function getById(id) {
  return await apiRequest(`/${id}`);
}

// Crear nueva venta
export async function create(venta) {
  return await apiRequest('', {
    method: 'POST',
    body: JSON.stringify(venta),
  });
}

// Actualizar venta
export async function update(id, venta) {
  return await apiRequest(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(venta),
  });
}

// Eliminar venta
export async function deleteVenta(id) {
  return await apiRequest(`/${id}`, {
    method: 'DELETE',
  });
}

