# Osiris Frontend

Frontend en React + Vite para la plataforma Osiris. Incluye módulos de Administración (Empresas, Sucursales, Puntos de Emisión), Seguridad (Roles, Usuarios) y Clientes (Tipos de Cliente, Clientes). Integra con el backend en `http://localhost:8000/api`.

## Requisitos
- Node.js 18+ (recomendado 20)
- npm, yarn o pnpm
- Backend Osiris corriendo en `localhost:8000` (ver `.env.local`)

## Configuración
1. Clonar el repositorio  
   `git clone https://github.com/tu-org/osiris-frontend.git`
2. Instalar dependencias  
   `npm install`
3. Variables de entorno  
   Copia `.env.local` o crea un `.env.local` con, por ejemplo:  
   ```
   VITE_API_BASE=http://localhost:8000
   ```
4. Levantar en desarrollo  
   `npm run dev`  
   (abre `http://localhost:5173`)
5. Build para producción  
   `npm run build`
6. Vista previa de build  
   `npm run preview`

## Estructura rápida
- `src/App.jsx`: rutas y navegación.
- `src/adapters/primary/`: páginas (capa de UI + casos de uso).
- `src/adapters/secondary/`: adapters HTTP hacia el backend.
- `src/domain/`: entidades, puertos (repositorios) y casos de uso.
- `src/components/`: formularios y listados reutilizables.

## Módulos y endpoints
- Empresas: `/api/empresa`
- Sucursales: `/api/sucursales`
- Puntos de Emisión: `/api/puntos-emision`
- Roles: `/api/roles`
- Usuarios: `/api/usuarios` (crea/actualiza persona en `/api/personas`)
- Tipos de Cliente: `/api/tipos-cliente`
- Clientes: `/api/clientes` (crea/actualiza persona en `/api/personas`)

## Notas operativas
- Los formularios limpian campos tras crear.
- Validaciones del backend se muestran bajo cada campo.
- Borrado es lógico (activo=false) donde aplica.
- Usuarios/Clientes: se hace lookup de persona por identificación al salir del campo.

## Scripts npm
- `dev`: servidor de desarrollo Vite.
- `build`: build de producción.
- `preview`: sirve el build localmente.

## Git
`.gitignore` ya incluye `node_modules`, `dist` y `.env*`. No subas credenciales ni `.env.local`.
