
# Guía de Ejecución y Despliegue

Sigue estos pasos para dejar el proyecto funcionando correctamente después de clonar o descargar el repositorio:

---

## 1. Backend (Express)

### a) Instalar dependencias
```bash
cd backend
npm install
```

### b) Configurar variables de entorno
Crea un archivo `.env` (o `.env.local`) si es necesario, con tus variables personalizadas (por ejemplo, PORT, MONGODB_URI, JWT_SECRET, etc.).

### c) Arrancar el backend
```bash
# En desarrollo
npm run dev

# En producción
npm run start
# O usando PM2
pm2 start app.js --name app
```

---

## 2. Frontend (React/Vite)

### a) Instalar dependencias
```bash
cd frontend
npm install
```

### b) Generar archivos de producción
```bash
npm run build
```
Esto creará la carpeta `dist/` con los assets listos para producción.

### c) Servir el frontend
Configura tu servidor (por ejemplo, NGINX) para servir los archivos de `frontend/dist`.

### d) (Opcional) Ejecutar en modo desarrollo
```bash
npm run dev
```

---

## 3. Notas importantes

- Si eliminaste `node_modules` o `dist` del repo, **siempre ejecuta `npm install` y `npm run build`** después de clonar.
- No subas archivos sensibles ni pesados al repositorio (usa `.gitignore`).
- Si usas PM2, puedes monitorear el backend con:
	```bash
	pm2 logs app
	pm2 list
	```
- Para actualizar dependencias:
	```bash
	npm update
	```

---

¡Con estos pasos tu proyecto quedará listo para desarrollo o producción!
