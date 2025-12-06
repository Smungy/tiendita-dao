-- ===========================================================
-- SISTEMA DE CONTROL DE VENTAS PARA TIENDITA
-- Script SQL completo para Railway
-- ===========================================================

CREATE DATABASE IF NOT EXISTS tiendita;
USE tiendita;

-- ===========================================================
-- TABLA: usuarios (para autenticación JWT)
-- ===========================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- TABLA: proveedores
-- ===========================================================
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(100) NOT NULL,
    contacto_nombre VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(150)
);

-- ===========================================================
-- TABLA: productos
-- ===========================================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    alerta_stock INT DEFAULT 10,
    proveedor_id INT,
    proveedor_nombre VARCHAR(100),

    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ===========================================================
-- TABLA: clientes
-- ===========================================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL
);

-- ===========================================================
-- TABLA: ventas
-- ===========================================================
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'otro') DEFAULT 'efectivo',
    cliente_id INT,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ===========================================================
-- TABLA: detalles_venta
-- ===========================================================
CREATE TABLE detalles_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    nombre_producto VARCHAR(100),
    precio_unitario DECIMAL(10,2) NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (venta_id) REFERENCES ventas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON UPDATE CASCADE
);

-- ===========================================================
-- TABLA: historial_ventas_cliente
-- ===========================================================
CREATE TABLE historial_ventas_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    venta_id INT NOT NULL,
    fecha DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (venta_id) REFERENCES ventas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================================================
-- DATOS DE PRUEBA
-- ===========================================================

-- Usuario de prueba para login (admin/admin123)
INSERT INTO usuarios (username, password) VALUES 
('admin', 'admin123');

-- Proveedor de prueba
INSERT INTO proveedores (nombre_empresa, contacto_nombre, telefono, direccion)
VALUES ('Dulces del Norte S.A.', 'María López', '5551234567', 'Av. Central 100, Ciudad');

-- Producto de prueba
INSERT INTO productos (nombre, precio, stock, alerta_stock, proveedor_id, proveedor_nombre)
VALUES ('Galletas ChocoMix', 15.50, 50, 10, 1, 'Dulces del Norte S.A.');

-- Cliente de prueba
INSERT INTO clientes (nombre, telefono)
VALUES ('Carlos Martínez', '5559988776');

-- Venta de prueba
INSERT INTO ventas (fecha, total, metodo_pago, cliente_id)
VALUES (NOW(), 31.00, 'tarjeta', 1);

-- Detalle de venta de prueba
INSERT INTO detalles_venta (venta_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal)
VALUES (1, 1, 'Galletas ChocoMix', 15.50, 2, 31.00);

-- Historial de venta de prueba
INSERT INTO historial_ventas_cliente (cliente_id, venta_id, fecha, total)
VALUES (1, 1, NOW(), 31.00);
