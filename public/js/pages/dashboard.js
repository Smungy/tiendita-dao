// Importar el servicio de ventas
import * as ventasService from '../services/ventasService.js';

let estadisticas = {
  totalVentas: 0,
  totalIngresos: 0,
  ventasHoy: 0,
  ingresosHoy: 0,
  metodoPagoMasUsado: '',
  promedioVenta: 0,
  ventasPorMetodo: {}
};

let loading = false;
let error = '';

// Función para cargar estadísticas
async function loadEstadisticas() {
  try {
    loading = true;
    error = '';
    updateUI();
    
    const ventas = await ventasService.getAll();
    
    // Calcular estadísticas
    calcularEstadisticas(ventas);
    
    loading = false;
    updateUI();
  } catch (err) {
    error = err.message || 'Error al cargar estadísticas';
    loading = false;
    
    // Si el error es de autenticación, mostrar mensaje más claro
    if (err.message.includes('AUTH_ERROR')) {
      error = '⚠️ No estás autenticado. Por favor, inicia sesión usando el modal.';
    } else if (err.message.includes('CONNECTION_ERROR')) {
      error = '❌ ' + err.message.replace('CONNECTION_ERROR: ', '');
    }
    
    updateUI();
    console.error('Error loading estadisticas:', err);
  }
}

// Función para calcular estadísticas
function calcularEstadisticas(ventas) {
  if (!ventas || ventas.length === 0) {
    estadisticas = {
      totalVentas: 0,
      totalIngresos: 0,
      ventasHoy: 0,
      ingresosHoy: 0,
      metodoPagoMasUsado: 'N/A',
      promedioVenta: 0,
      ventasPorMetodo: {}
    };
    return;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  let totalIngresos = 0;
  let ventasHoy = 0;
  let ingresosHoy = 0;
  const ventasPorMetodo = {};
  
  ventas.forEach(venta => {
    const total = parseFloat(venta.total) || 0;
    totalIngresos += total;
    
    // Verificar si la venta es de hoy
    const fechaVenta = new Date(venta.fecha);
    fechaVenta.setHours(0, 0, 0, 0);
    
    if (fechaVenta.getTime() === hoy.getTime()) {
      ventasHoy++;
      ingresosHoy += total;
    }
    
    // Contar por método de pago
    const metodo = venta.metodo_pago || 'otro';
    if (!ventasPorMetodo[metodo]) {
      ventasPorMetodo[metodo] = { count: 0, total: 0 };
    }
    ventasPorMetodo[metodo].count++;
    ventasPorMetodo[metodo].total += total;
  });
  
  // Encontrar método de pago más usado
  let metodoMasUsado = 'N/A';
  let maxCount = 0;
  Object.keys(ventasPorMetodo).forEach(metodo => {
    if (ventasPorMetodo[metodo].count > maxCount) {
      maxCount = ventasPorMetodo[metodo].count;
      metodoMasUsado = metodo;
    }
  });
  
  estadisticas = {
    totalVentas: ventas.length,
    totalIngresos: totalIngresos,
    ventasHoy: ventasHoy,
    ingresosHoy: ingresosHoy,
    metodoPagoMasUsado: metodoMasUsado,
    promedioVenta: ventas.length > 0 ? totalIngresos / ventas.length : 0,
    ventasPorMetodo: ventasPorMetodo
  };
}

// Función para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

// Función para formatear método de pago
function formatMetodoPago(metodo) {
  const metodos = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
    'otro': 'Otro'
  };
  return metodos[metodo] || metodo;
}

// Función para actualizar la UI
function updateUI() {
  const container = document.getElementById('dashboard-container');
  if (!container) return;

  container.innerHTML = `
    <div style="padding: 32px; max-width: 1400px; margin: 0 auto;">
      <h1 style="font-size: 32px; font-weight: 600; color: #18181b; letter-spacing: -0.025em; margin-bottom: 32px;">
        Dashboard
      </h1>

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
          Cargando estadísticas...
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <!-- Tarjeta: Total de Ventas -->
          <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              Total de Ventas
            </div>
            <div style="font-size: 32px; font-weight: 600; color: #18181b;">
              ${estadisticas.totalVentas}
            </div>
          </div>

          <!-- Tarjeta: Total de Ingresos -->
          <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              Total de Ingresos
            </div>
            <div style="font-size: 32px; font-weight: 600; color: #059669;">
              ${formatCurrency(estadisticas.totalIngresos)}
            </div>
          </div>

          <!-- Tarjeta: Ventas de Hoy -->
          <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              Ventas de Hoy
            </div>
            <div style="font-size: 32px; font-weight: 600; color: #18181b;">
              ${estadisticas.ventasHoy}
            </div>
          </div>

          <!-- Tarjeta: Ingresos de Hoy -->
          <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              Ingresos de Hoy
            </div>
            <div style="font-size: 32px; font-weight: 600; color: #059669;">
              ${formatCurrency(estadisticas.ingresosHoy)}
            </div>
          </div>

          <!-- Tarjeta: Promedio por Venta -->
          <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              Promedio por Venta
            </div>
            <div style="font-size: 32px; font-weight: 600; color: #18181b;">
              ${formatCurrency(estadisticas.promedioVenta)}
            </div>
          </div>

          <!-- Tarjeta: Método de Pago Más Usado -->
          <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          ">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
              Método de Pago Más Usado
            </div>
            <div style="font-size: 32px; font-weight: 600; color: #18181b;">
              ${formatMetodoPago(estadisticas.metodoPagoMasUsado)}
            </div>
          </div>
        </div>

        <!-- Gráfico de Ventas por Método de Pago -->
        <div style="
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
        ">
          <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin-bottom: 24px;">
            Ventas por Método de Pago
          </h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${Object.keys(estadisticas.ventasPorMetodo).map(metodo => {
              const data = estadisticas.ventasPorMetodo[metodo];
              const porcentaje = estadisticas.totalVentas > 0 
                ? (data.count / estadisticas.totalVentas * 100).toFixed(1) 
                : 0;
              
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 14px; font-weight: 500; color: #18181b;">
                      ${formatMetodoPago(metodo)}
                    </span>
                    <span style="font-size: 14px; color: #6b7280;">
                      ${data.count} ventas (${porcentaje}%) - ${formatCurrency(data.total)}
                    </span>
                  </div>
                  <div style="
                    width: 100%;
                    height: 8px;
                    background-color: #e5e7eb;
                    border-radius: 4px;
                    overflow: hidden;
                  ">
                    <div style="
                      width: ${porcentaje}%;
                      height: 100%;
                      background-color: #18181b;
                      transition: width 0.3s ease;
                    "></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Gráfica de Barras - Ventas por Método de Pago -->
        <div style="
          background-color: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
        ">
          <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin-bottom: 24px;">
            Gráfica de Ventas por Método de Pago
          </h2>
          <canvas id="ventasChart" width="800" height="400" style="max-width: 100%; height: auto;"></canvas>
        </div>
      `}
    </div>
  `;
  
  // Dibujar gráfica después de actualizar la UI
  if (!loading && Object.keys(estadisticas.ventasPorMetodo).length > 0) {
    setTimeout(() => {
      dibujarGrafica();
    }, 100);
  }
}

// Función para dibujar la gráfica de barras
function dibujarGrafica() {
  const canvas = document.getElementById('ventasChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const metodos = Object.keys(estadisticas.ventasPorMetodo);
  
  if (metodos.length === 0) {
    // Mostrar mensaje si no hay datos
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No hay datos para mostrar', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  // Configuración mejorada de la gráfica
  const paddingTop = 40;
  const paddingBottom = 80;
  const paddingLeft = 60;
  const paddingRight = 40;
  const barSpacing = 30;
  const barWidth = Math.max(40, (canvas.width - paddingLeft - paddingRight - (barSpacing * (metodos.length - 1))) / metodos.length);
  const maxValue = Math.max(...metodos.map(m => estadisticas.ventasPorMetodo[m].count), 1);
  const chartHeight = canvas.height - paddingTop - paddingBottom;
  
  // Colores mejorados para cada método
  const colores = {
    'efectivo': '#10b981',
    'tarjeta': '#3b82f6',
    'transferencia': '#f59e0b',
    'otro': '#8b5cf6'
  };
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fondo de la gráfica
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(paddingLeft, paddingTop, canvas.width - paddingLeft - paddingRight, chartHeight);
  
  // Dibujar ejes principales
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  
  // Eje Y (vertical)
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, canvas.height - paddingBottom);
  ctx.stroke();
  
  // Eje X (horizontal)
  ctx.beginPath();
  ctx.moveTo(paddingLeft, canvas.height - paddingBottom);
  ctx.lineTo(canvas.width - paddingRight, canvas.height - paddingBottom);
  ctx.stroke();
  
  // Dibujar líneas de referencia en el eje Y
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.font = '12px Arial';
  ctx.fillStyle = '#6b7280';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const numLines = 5;
  for (let i = 0; i <= numLines; i++) {
    const value = (maxValue / numLines) * i;
    const y = canvas.height - paddingBottom - (chartHeight / numLines) * i;
    
    // Línea de referencia
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(canvas.width - paddingRight, y);
    ctx.stroke();
    
    // Etiqueta del valor
    ctx.fillText(Math.round(value).toString(), paddingLeft - 10, y);
  }
  
  // Dibujar barras con sombra y mejor diseño
  metodos.forEach((metodo, index) => {
    const data = estadisticas.ventasPorMetodo[metodo];
    const barHeight = (data.count / maxValue) * chartHeight;
    const x = paddingLeft + index * (barWidth + barSpacing);
    const y = canvas.height - paddingBottom - barHeight;
    const color = colores[metodo] || '#18181b';
    
    // Sombra de la barra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(x + 2, y - 2, barWidth, barHeight);
    
    // Barra principal
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Borde de la barra
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);
    
    // Valor encima de la barra
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(data.count.toString(), x + barWidth / 2, y - 8);
    
    // Etiqueta del método (horizontal, más legible)
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textBaseline = 'top';
    const metodoTexto = formatMetodoPago(metodo);
    // Dividir texto largo en dos líneas si es necesario
    if (metodoTexto.length > 10) {
      const mitad = Math.ceil(metodoTexto.length / 2);
      ctx.fillText(metodoTexto.substring(0, mitad), x + barWidth / 2, canvas.height - paddingBottom + 5);
      ctx.fillText(metodoTexto.substring(mitad), x + barWidth / 2, canvas.height - paddingBottom + 20);
    } else {
      ctx.fillText(metodoTexto, x + barWidth / 2, canvas.height - paddingBottom + 5);
    }
  });
  
  // Título del eje Y
  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#6b7280';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Cantidad de Ventas', 0, 0);
  ctx.restore();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadEstadisticas();
  });
} else {
  loadEstadisticas();
}

// Exportar funciones para uso global si es necesario
window.dashboardPage = {
  loadEstadisticas,
  calcularEstadisticas
};

