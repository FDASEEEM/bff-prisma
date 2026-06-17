# PRISMA BFF (Backend for Frontend)

Servicio BFF que actúa como capa intermedia entre el frontend y los microservicios backend del sistema PRISMA.

## Arquitectura

```
Frontend (1 instancia Axios)
    ↓
BFF (prisma-bff :3006)
    ↓
[ms-users :3001 | adminpanel :3004 | perfil-alumno :3005 | ms-docs :3000]
```

## Endpoints principales

### Auth (proxy a ms-users)
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/me`

### Colegios (proxy a ms-users)
- `GET /api/colegios`
- `GET /api/colegios/:id`
- `POST /api/colegios`
- `PATCH /api/colegios/:id`
- `DELETE /api/colegios/:id`
- `GET /api/colegios/:id/stats`
- `GET /api/colegios/:id/professors`

### Professors (proxy a adminpanel)
- `GET /api/professors`
- `GET /api/professors/:id`
- `POST /api/professors`
- `PATCH /api/professors/:id`
- `DELETE /api/professors/:id`

### Students (proxy a perfil-alumno)
- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `PATCH /api/students/:id`
- `DELETE /api/students/:id`
- `GET /api/students/me`
- `GET /api/students/paci-profiles/all`
- `POST /api/students/paci-profiles/create`
- `GET /api/students/paci-profiles/:id`
- `PATCH /api/students/paci-profiles/:id`
- `DELETE /api/students/paci-profiles/:id`

### Jobs (proxy a ms-docs)
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/jobs/history`
- `GET /api/jobs/:id/download`
- `GET /api/jobs/colegio/:colegioId/stats`
- `GET /api/jobs/colegio/:colegioId/jobs`

### Admin (proxy a adminpanel + ms-users)
- `GET /api/admin/dashboard/summary`
- `GET /api/admin/me`
- `GET /api/admin/users/stats`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `GET /api/admin/tickets` (y POST, PATCH, DELETE)
- `GET /api/admin/resources` (y POST, PATCH, DELETE)
- `GET /api/admin/announcements` (y POST, PATCH, DELETE)
- `GET /api/admin/colegio-stats/:colegioId/professors`
- `GET /api/admin/colegio-stats/:colegioId/consumo`
- `GET /api/admin/colegio-stats/:colegioId/full`

### Dashboard (agregación)
- `GET /api/dashboard/me` - Dashboard del usuario autenticado
- `GET /api/dashboard/colegio/:colegioId` - Dashboard completo de un colegio

## Configuración

Variables de entorno (`.env`):

```env
PORT=3006
CORS_ORIGIN=http://localhost:3002,http://127.0.0.1:3002

USERS_SERVICE_URL=http://localhost:3001
ADMINPANEL_SERVICE_URL=http://localhost:3004
PERFIL_SERVICE_URL=http://localhost:3005
DOCS_SERVICE_URL=http://localhost:3000
CHAT_SERVICE_URL=http://localhost:3000
```

## Desarrollo

```bash
npm install
npm run start:dev
```

El BFF estará disponible en `http://localhost:3006` con Swagger UI en `/docs`.

## Tests

```bash
npm test
```

## Beneficios

1. **Simplificación del frontend** - 1 sola instancia de Axios en lugar de 5
2. **Reducción de CORS** - Solo el BFF necesita acceso a microservicios
3. **Agregación** - Combina datos de múltiples servicios en una respuesta
4. **Seguridad** - Tokens no se exponen directamente al frontend
5. **Cache** - Puede cachear respuestas agregadas
6. **Versionado** - Cambias la API del BFF sin tocar el frontend
7. **Manejo de errores centralizado** - Un solo lugar para retry, fallbacks
