# Tiendita DAO - API RESTful

API RESTful para gestión de tienda con autenticación JWT y operaciones CRUD completas.

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Acceso a la base de datos MySQL en Railway
- Postman (para pruebas de endpoints)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Smungy/tiendita-dao.git
cd tiendita-dao
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos MySQL
DB_HOST=tu_host_de_railway.proxy.rlwy.net
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=railway
DB_PORT=tu_puerto

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

# Servidor
PORT=3000
```

> **Nota:** Solicita las credenciales de Railway al equipo. El `JWT_SECRET` puede ser cualquier string largo y aleatorio.

### 4. Iniciar el servidor

```bash
node app.js
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
tiendita-dao/
├── controllers/          # Lógica de negocio HTTP
│   ├── authController.js
│   └── proveedoresController.js
├── routes/              # Definición de endpoints
│   ├── authRoutes.js
│   └── proveedoresRoutes.js
├── middlewares/         # Middleware de Express
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validators/
├── data/
│   └── daos/           # Acceso a base de datos
├── models/             # Entidades del negocio
├── app.js              # Punto de entrada
└── .env                # Configuración (NO subir a git)
```

## Solución de Problemas

### Error: "connect ETIMEDOUT"

- Verifica las credenciales en `.env`
- Revisa tu conexión a internet
- Confirma que Railway esté activo

### Error: "jwt must be provided"

- Incluye el header `Authorization: Bearer <token>`
- Verifica que el token no haya expirado (24h)

### Error: "Validation failed"

- Revisa que todos los campos requeridos estén presentes

## Iniciar el servidor

```bash
node app.js
```

El servidor estará corriendo en `http://localhost:3000`

---

Para el flujo de trabajo con Git, consulta [WORKFLOW.md](./WORKFLOW.md).
