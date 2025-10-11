# Tiendita DAO - Instrucciones de Instalación

## Requisitos Previos

- Node.js instalado (versión 14 o superior)
- Acceso a la base de datos MySQL en Railway

## Pasos para ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Smungy/tiendita-dao.git
cd tiendita-dao
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la conexión a la base de datos

Copia el archivo `.env.example` y renómbralo como `.env`:

```bash
cp .env.example .env
```

Abre el archivo `.env` y completa con los datos de conexión de Railway:

```env
DB_HOST=tu_host_de_railway.proxy.rlwy.net
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=tu_dbname
DB_PORT=tu_puerto
```

> **Nota:** Solicita las credenciales de acceso a la base de datos. Los datos de conexión se encuentran en el panel de Railway.

### 4. Ejecutar el script de pruebas

```bash
node tests/pruebaDAO.js
```

El script ejecutará:

- Creación de registros (Proveedores, Productos, Clientes, Ventas)
- Consulta de datos
- Actualización de registros
- Historial de ventas por cliente
- Opción para eliminar los datos de prueba (te preguntará al final)

## Notas

- La base de datos debe estar creada previamente (Solicita las credenciales de acceso a la base de datos.)
- Si no quieres conectarte a la db en el servidor, crea la tuya con el scirpt que se te prorciono
- Si tienes problemas de conexión, verifica que el puerto y las credenciales sean correctas
- El script usa `readline-sync` para interactuar con la consola al final para pruebas de eliminacion

## Solución de Problemas

### Error: "connect ETIMEDOUT"

- Verifica que los datos en `.env` sean correctos
- Asegúrate de tener acceso a internet
- Comprueba que Railway no esté en mantenimiento

### Error: "ER_BAD_DB_ERROR"

- La base de datos `tiendita` no existe en Railway
- Ejecuta el script SQL para crear las tablas primero

## Comandos útiles

```bash
# instalar dependencias
npm install

# ejecutar pruebas
node tests/pruebaDAO.js

# ver el código principal
node index.js
```

---

¿Problemas? Consulta el script SQL incluido para crear las tablas o contacta al equipo.
