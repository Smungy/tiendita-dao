# Workflow de Git - Tiendita DAO

Guía paso a paso para trabajar con branches y Pull Requests.

## Conceptos Básicos

- **Branch (rama)**: Tu espacio de trabajo sin afectar el código principal
- **Pull Request (PR)**: Solicitud para integrar tus cambios al proyecto
- **main**: Rama principal con código estable

## Pasos a Seguir

### PASO 1: Actualizar tu repositorio local

Siempre haz esto ANTES de empezar a trabajar:

```bash
# Asegúrate de estar en main
git checkout main

# Descarga los últimos cambios
git pull origin main
```

### PASO 2: Crear tu branch

Cada compañero crea su propio branch según su entidad:

```bash
# Sintaxis: git checkout -b nombre-del-branch
git checkout -b feat/productos-crud      # Compañero 1
git checkout -b feat/clientes-crud       # Compañero 2
git checkout -b feat/ventas-crud         # Compañero 3
```

### PASO 3: Trabajar en tu branch

Verifica que estés en tu branch:

```bash
# Confirma que estés en tu branch (debe tener asterisco *)
git branch
```

Crea tus archivos siguiendo el ejemplo de `proveedores`:

- Controller, Validator, Routes
- Descomenta las líneas de tu entidad en `app.js`

### PASO 4: Guardar tus cambios

Cuando termines de programar y probar:

```bash
# Agregar todos los archivos
git add .

# Guardar cambios con mensaje descriptivo
git commit -m "feat: implementar CRUD completo de productos"
```

Mensaje recomendado: `feat: implementar CRUD completo de [tu-entidad]`

### PASO 5: Subir tu branch a GitHub

```bash
# Subir a GitHub (reemplaza "productos" por tu entidad)
git push origin feat/productos-crud
```

Si es la primera vez, usa: `git push --set-upstream origin feat/productos-crud`

### PASO 6: Crear Pull Request en GitHub

1. Ve a https://github.com/Smungy/tiendita-dao
2. Haz clic en el botón amarillo **"Compare & pull request"**
3. Llena el título: `feat: CRUD completo de [tu-entidad]`
4. En la descripción menciona qué archivos creaste y que probaste en Postman
5. Haz clic en **"Create pull request"**

### PASO 7: Esperar aprobación y merge

1. Revisa que no haya conflictos en tu PR
2. Espera a que un compañero revise y apruebe tu PR
3. El compañero que aprobó hará clic en **"Merge pull request"** y **"Confirm merge"**
4. NO elimines el branch en GitHub (el maestro necesita verlo)

### PASO 8: Actualizar tu repositorio local

```bash
# Regresar a main
git checkout main

# Actualizar con los cambios que se fusionaron
git pull origin main

# Eliminar tu branch local (solo local, NO en GitHub)
git branch -d feat/productos-crud
```

## Resumen Rápido

```bash
# 1. Actualizar
git checkout main
git pull origin main

# 2. Crear branch
git checkout -b feat/tu-entidad-crud

# 3. Programar y probar en Postman

# 4. Guardar cambios
git add .
git commit -m "feat: implementar CRUD completo de tu-entidad"

# 5. Subir
git push origin feat/tu-entidad-crud

# 6. Crear PR en GitHub (navegador web)

# 7. Hacer merge en GitHub

# 8. Actualizar local (eliminar solo branch local)
git checkout main
git pull origin main
git branch -d feat/tu-entidad-crud
```

## Problemas Comunes

**Olvidé crear un branch antes de hacer cambios:**

```bash
git checkout -b feat/mi-entidad-crud
# Tus cambios se mueven automáticamente
```

**Alguien hizo merge mientras trabajaba:**

```bash
git checkout feat/mi-entidad-crud
git pull origin main
# Resolver conflictos si aparecen
```

**Mensaje de commit incorrecto:**

```bash
git reset --soft HEAD~1
git commit -m "mensaje correcto"
```

## Checklist Antes de Crear PR

- [ ] Código sin errores
- [ ] Probado en Postman (todos los endpoints)
- [ ] Descomentaste líneas TODO en app.js
- [ ] No subiste el archivo .env

---

Si tienes dudas, pregunta en el chat del equipo antes de hacer push.
