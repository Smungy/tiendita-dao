// pagina de dashboard con estadísticas
async function renderDashboard() {
  const app = document.getElementById("app");

  app.innerHTML = `
        <div class="page-container">
            <div class="page-header">
                <h1>Dashboard</h1>
            </div>
            
            <div id="dashboardContainer">
                <div class="loading">Cargando estadísticas...</div>
            </div>
        </div>
    `;

  await cargarEstadisticas();
}

async function cargarEstadisticas() {
  const container = document.getElementById("dashboardContainer");

  try {
    const [ventas, productos, clientes, proveedores] = await Promise.all([
      ventasService.getAll().catch(() => []),
      productosService.getAll().catch(() => []),
      clientesService.getAll().catch(() => []),
      proveedoresService.getAll().catch(() => []),
    ]);

    const estadisticas = calcularEstadisticas(ventas, productos, clientes);

    container.innerHTML = `
      <style>
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }
        .stat-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0.5rem 0;
        }
        .stat-card .change {
          font-size: 0.85rem;
          color: #27ae60;
        }
        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .chart-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .chart-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #333;
        }
        .method-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .method-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eee;
        }
        .method-item:last-child {
          border-bottom: none;
        }
        .method-name {
          font-weight: 600;
          color: #333;
        }
        .method-count {
          color: #666;
        }
        .recent-ventas {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .recent-ventas h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #333;
        }
        .venta-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
        }
        .venta-item:last-child {
          border-bottom: none;
        }
        .venta-info {
          flex: 1;
        }
        .venta-id {
          font-weight: 600;
          color: #333;
        }
        .venta-date {
          font-size: 0.85rem;
          color: #666;
        }
        .venta-total {
          font-weight: 600;
          color: #1a1a1a;
        }
        .chart-full {
          grid-column: 1 / -1;
        }
        .chart-full canvas {
          max-height: 400px;
        }
      </style>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total de Ventas</h3>
          <div class="value">${estadisticas.totalVentas}</div>
          <div class="change">${estadisticas.ventasHoy} hoy</div>
        </div>
        
        <div class="stat-card">
          <h3>Ingresos Totales</h3>
          <div class="value">${formatearMoneda(estadisticas.ingresosTotales)}</div>
          <div class="change">${formatearMoneda(estadisticas.ingresosHoy)} hoy</div>
        </div>
        
        <div class="stat-card">
          <h3>Productos</h3>
          <div class="value">${productos.length}</div>
          <div class="change">${productos.filter(p => (p.stock || 0) < (p.alerta_stock || 10)).length} con stock bajo</div>
        </div>
        
        <div class="stat-card">
          <h3>Clientes</h3>
          <div class="value">${clientes.length}</div>
          <div class="change">${proveedores.length} proveedores</div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <h3>Ventas por Método de Pago</h3>
          <ul class="method-list">
            ${Object.entries(estadisticas.ventasPorMetodo)
              .map(([metodo, cantidad]) => `
                <li class="method-item">
                  <span class="method-name">${metodo.charAt(0).toUpperCase() + metodo.slice(1)}</span>
                  <span class="method-count">${cantidad} ventas</span>
                </li>
              `)
              .join("")}
          </ul>
        </div>
        
        <div class="chart-card">
          <h3>Promedio de Venta</h3>
          <div class="value" style="font-size: 1.5rem; margin-top: 1rem;">
            ${formatearMoneda(estadisticas.promedioVenta)}
          </div>
          <div style="margin-top: 1rem; color: #666;">
            <p>Venta más alta: ${formatearMoneda(estadisticas.ventaMasAlta)}</p>
            <p>Venta más baja: ${formatearMoneda(estadisticas.ventaMasBaja)}</p>
          </div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card chart-full">
          <h3>Ventas de los Últimos 7 Días</h3>
          <canvas id="ventasBarrasChart"></canvas>
        </div>
        
        <div class="chart-card chart-full">
          <h3>Distribución de Ingresos por Método de Pago</h3>
          <canvas id="metodosPagoChart"></canvas>
        </div>
      </div>

      <div class="recent-ventas">
        <h3>Ventas Recientes</h3>
        ${ventas.length > 0
          ? ventas
              .slice(0, 5)
              .map(
                (v) => `
              <div class="venta-item">
                <div class="venta-info">
                  <div class="venta-id">Venta #${v.id}</div>
                  <div class="venta-date">${formatearFecha(v.fecha)}</div>
                </div>
                <div class="venta-total">${formatearMoneda(v.total)}</div>
              </div>
            `
              )
              .join("")
          : "<p style='color: #666;'>No hay ventas registradas</p>"}
      </div>
    `;

    // Crear gráficas después de renderizar el HTML
    setTimeout(() => {
      crearGraficaBarras(ventas, estadisticas);
      crearGraficaPastel(ventas, estadisticas);
    }, 100);
  } catch (error) {
    container.innerHTML = `<p class="error">Error al cargar estadísticas: ${error.message}</p>`;
  }
}

function calcularEstadisticas(ventas, productos, clientes) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ventasHoy = ventas.filter((v) => {
    const fechaVenta = new Date(v.fecha);
    fechaVenta.setHours(0, 0, 0, 0);
    return fechaVenta.getTime() === hoy.getTime();
  });

  const ingresosTotales = ventas.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
  const ingresosHoy = ventasHoy.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);

  const ventasPorMetodo = ventas.reduce((acc, v) => {
    const metodo = v.metodo_pago || "otro";
    acc[metodo] = (acc[metodo] || 0) + 1;
    return acc;
  }, {});

  // Calcular ingresos por método de pago
  const ingresosPorMetodo = ventas.reduce((acc, v) => {
    const metodo = v.metodo_pago || "otro";
    acc[metodo] = (acc[metodo] || 0) + (parseFloat(v.total) || 0);
    return acc;
  }, {});

  // Calcular ventas por día (últimos 7 días)
  const ventasPorDia = {};
  const ultimos7Dias = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    fecha.setHours(0, 0, 0, 0);
    const fechaStr = fecha.toISOString().split('T')[0];
    ultimos7Dias.push(fechaStr);
    ventasPorDia[fechaStr] = 0;
  }

  ventas.forEach((v) => {
    const fechaVenta = new Date(v.fecha);
    fechaVenta.setHours(0, 0, 0, 0);
    const fechaStr = fechaVenta.toISOString().split('T')[0];
    if (ventasPorDia.hasOwnProperty(fechaStr)) {
      ventasPorDia[fechaStr] += parseFloat(v.total) || 0;
    }
  });

  const totales = ventas.map((v) => parseFloat(v.total) || 0);
  const promedioVenta = totales.length > 0 ? ingresosTotales / totales.length : 0;
  const ventaMasAlta = totales.length > 0 ? Math.max(...totales) : 0;
  const ventaMasBaja = totales.length > 0 ? Math.min(...totales) : 0;

  return {
    totalVentas: ventas.length,
    ventasHoy: ventasHoy.length,
    ingresosTotales,
    ingresosHoy,
    ventasPorMetodo,
    ingresosPorMetodo,
    ventasPorDia,
    ultimos7Dias,
    promedioVenta,
    ventaMasAlta,
    ventaMasBaja,
  };
}

function crearGraficaBarras(ventas, estadisticas) {
  const ctx = document.getElementById('ventasBarrasChart');
  if (!ctx) return;

  // Destruir gráfica anterior si existe
  if (window.ventasBarrasChartInstance) {
    window.ventasBarrasChartInstance.destroy();
  }

  const labels = estadisticas.ultimos7Dias.map(fecha => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  });

  const datos = estadisticas.ultimos7Dias.map(fecha => estadisticas.ventasPorDia[fecha] || 0);

  window.ventasBarrasChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ingresos ($)',
        data: datos,
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderColor: 'rgba(26, 26, 26, 1)',
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Ingresos: ' + formatearMoneda(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString('es-MX');
            }
          }
        }
      }
    }
  });
}

function crearGraficaPastel(ventas, estadisticas) {
  const ctx = document.getElementById('metodosPagoChart');
  if (!ctx) return;

  // Destruir gráfica anterior si existe
  if (window.metodosPagoChartInstance) {
    window.metodosPagoChartInstance.destroy();
  }

  const metodos = Object.keys(estadisticas.ingresosPorMetodo);
  const ingresos = Object.values(estadisticas.ingresosPorMetodo);
  
  const colores = {
    efectivo: 'rgba(39, 174, 96, 0.8)',
    tarjeta: 'rgba(52, 152, 219, 0.8)',
    transferencia: 'rgba(155, 89, 182, 0.8)',
    otro: 'rgba(149, 165, 166, 0.8)'
  };

  const backgroundColor = metodos.map(metodo => colores[metodo] || colores.otro);
  const borderColor = backgroundColor.map(color => color.replace('0.8', '1'));

  const labels = metodos.map(metodo => {
    const nombre = metodo.charAt(0).toUpperCase() + metodo.slice(1);
    const total = estadisticas.ingresosPorMetodo[metodo];
    return `${nombre}: ${formatearMoneda(total)}`;
  });

  window.metodosPagoChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: ingresos,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatearMoneda(context.parsed);
              const total = ingresos.reduce((a, b) => a + b, 0);
              const porcentaje = ((context.parsed / total) * 100).toFixed(1);
              return `${label.split(':')[0]}: ${value} (${porcentaje}%)`;
            }
          }
        }
      }
    }
  });
}

function formatearMoneda(cantidad) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(cantidad || 0);
}

function formatearFecha(fecha) {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

window.renderDashboard = renderDashboard;
