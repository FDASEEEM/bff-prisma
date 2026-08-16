# CLAUDE.md — bff-prisma

> Contexto interno para sesiones de Claude Code que trabajen **solo en este repo**.
> Este archivo documenta lo que hay realmente en el código a la fecha de escritura; si algo
> cambia (rutas, variables, puertos), actualizá esta sección en vez de confiar en la memoria.

---

## 1. Rol dentro de P.R.I.S.M.A.

`bff-prisma` es el **Backend-For-Frontend**: la entrada única de la API REST para `prisma-front`.
El front usa **una sola instancia de Axios** que manda todo `/api/*` a este BFF (`VITE_BFF_URL`), y
el BFF reparte cada request al microservicio downstream que corresponde: `ms-users` (:3001),
`prisma-adminpanel` (:3004), `ms-perfil-alumno` (:3005) y `ms-docs` (:3000).

**⚠️ Este repo NO aparece en el `CLAUDE.md` raíz del workspace** (`EP2/CLAUDE.md`), que documenta 6
repos (front, ms-users, ms-docs, ms-perfil-alumno, adminpanel, prisma_workflow) sin mencionar ningún
BFF. Eso es porque `bff-prisma` es **posterior** a ese mapa: nació para que el front no tuviera que
mantener 5 instancias de Axios y 5 configuraciones CORS distintas (ver "Beneficios" en `README.md`).
Si tocás algo que cruza el front y los microservicios, tené en cuenta que el mapa raíz está
desactualizado en este punto — la fuente de verdad real es este archivo + el código.

**El chat agéntico (`prisma_workflow`, FastAPI :8000) NO pasa por este BFF.** El front le habla
directo por el proxy de Vite (`/chat/*`, `/health`, `/feedback/*`). Ver más abajo el gotcha sobre
`CHAT_SERVICE_URL` / `'chat'` en `ServiceName`, que es un remanente no usado.

---

## 2. Stack y estructura

- **NestJS 10** + `@nestjs/axios` (wrapper de Axios/RxJS) + `@nestjs/config` + `@nestjs/swagger`.
- Sin Prisma ni base de datos propia: el BFF no persiste nada, es puramente un proxy/agregador.
- `ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true })` global
  (`src/main.ts`).
- Swagger en `/docs` (`SwaggerModule.setup('docs', app, document)`).
- **No usa `app.setGlobalPrefix('api')`.** Cada controller declara su propio prefijo
  `@Controller('api/...')` a mano (`src/modules/*/*.controller.ts`).

### Estructura de carpetas

```
src/
  main.ts                                  # bootstrap, CORS, ValidationPipe, Swagger
  app.module.ts                            # importa todos los módulos
  health.controller.ts                     # GET /health (sin prefijo /api)
  infrastructure/microservice-client/
    microservice.client.ts                 # cliente HTTP genérico hacia los 5 servicios
    microservice.module.ts                 # @Global(), registra HttpModule (timeout 30s)
  modules/
    auth/          → ms-users   (/api/auth/*)
    colegios/       → ms-users   (/api/superadmin/colegios/*)
    professors/     → adminpanel (/api/admin/professors/*)
    students/       → perfil-alumno (/students, /paci-profiles — SIN /api)
    jobs/           → ms-docs    (/api/jobs/*, incluye upload multipart)
    admin/          → adminpanel + ms-users (tickets, recursos, anuncios, sesiones, usuarios)
    dashboard/      → agrega users + docs + colegios (único módulo con lógica propia real)
```

Cada módulo sigue el mismo patrón: `*.controller.ts` (rutas, `@Headers('authorization')`,
`@ApiBearerAuth()`) → `*.service.ts` (llama a `MicroserviceClient`, un método por endpoint,
sin lógica de negocio salvo `dashboard.service.ts`).

---

## 3. `MicroserviceClient` — el corazón del proxy

`src/infrastructure/microservice-client/microservice.client.ts`:

- `ServiceName = 'users' | 'adminpanel' | 'perfil' | 'docs' | 'chat'`.
- La URL base se resuelve dinámicamente: `${SERVICE.toUpperCase()}_SERVICE_URL` desde
  `ConfigService` (ej. `'users'` → `USERS_SERVICE_URL`). Si la env var no existe, lanza
  `BadGatewayException` en runtime (no falla al bootear).
- `validateStatus: (status) => status < 500` — los 4xx del downstream se devuelven tal cual al
  front (no se transforman en excepción Nest), solo los 5xx del propio Axios (timeout, conexión
  rechazada, etc.) se envuelven en `BadGatewayException`.
- Soporta multipart (`postMultipart`) reenviando un `FormData` de la librería `form-data` con sus
  headers (boundary incluido) — usado por `jobs.service.ts` para `/api/jobs/upload`.
- **`'chat'` está declarado en `ServiceName` pero ningún controller/service lo usa.** Es un
  remanente — no hay módulo `chat` en `src/modules/`. Consistente con que el chat NO pasa por el
  BFF (ver §1). `CHAT_SERVICE_URL` en `.env`/`.env.example` tampoco se consume hoy; no lo borres
  sin confirmar que de verdad no se está planeando usar.

---

## 4. Mapa de ruteo (evidencia: controllers + services)

| Ruta expuesta (`/api/...`) | Downstream | Base URL (env) | Archivo |
|---|---|---|---|
| `POST/GET/PATCH /api/auth/*` | ms-users `/api/auth/*` | `USERS_SERVICE_URL` | `modules/auth/auth.service.ts` |
| `GET/POST/PATCH/DELETE /api/colegios*` | ms-users `/api/superadmin/colegios/*` | `USERS_SERVICE_URL` | `modules/colegios/colegios.service.ts` |
| `GET/POST/PATCH/DELETE /api/professors*` | adminpanel `/api/admin/professors/*` | `ADMINPANEL_SERVICE_URL` | `modules/professors/professors.service.ts` |
| `GET/POST/PATCH/DELETE /api/students*` (incl. `/paci-profiles/*`) | perfil-alumno `/students`, `/paci-profiles` (**sin** `/api`) | `PERFIL_SERVICE_URL` | `modules/students/students.service.ts` |
| `POST /api/jobs/upload`, `GET /api/jobs*` | ms-docs `/api/jobs/*` | `DOCS_SERVICE_URL` | `modules/jobs/jobs.service.ts` |
| `GET/POST/PATCH/DELETE/PUT /api/admin/{tickets,resources,announcements,sessions,notifications,dashboard,me}` | adminpanel `/api/admin/*` | `ADMINPANEL_SERVICE_URL` | `modules/admin/admin.service.ts` |
| `GET/POST/PATCH /api/admin/users*` | ms-users `/api/admin/users*` | `USERS_SERVICE_URL` | `modules/admin/admin.service.ts` |
| `GET/POST/PATCH/DELETE /api/admin/colegio-stats/*` | adminpanel `/api/admin/colegio-stats/*` | `ADMINPANEL_SERVICE_URL` | `modules/admin/admin.service.ts` |
| `GET /api/dashboard/me` | agrega ms-users `/api/auth/me` + ms-docs `/api/jobs` | ambas | `modules/dashboard/dashboard.service.ts` |
| `GET /api/dashboard/colegio/:colegioId` | agrega `colegios.service` (ms-users) + ms-docs `/api/jobs/colegio/:id/stats` | ambas | `modules/dashboard/dashboard.service.ts` |
| `GET /health` | local, no proxea nada | — | `health.controller.ts` |

**Gotchas de ruteo:**
- `/api/admin/*` está **partido entre dos microservicios distintos**: `adminpanel` (tickets,
  recursos, anuncios, sesiones, notificaciones, dashboard, colegio-stats) y `ms-users` (gestión de
  usuarios: `/api/admin/users*`). No asumas que todo `admin.service.ts` pega al mismo host — mirá
  el primer argumento de cada `this.client.*` llamada.
- `colegios` (colegios/schools, multi-tenant) vive en **`ms-users`** bajo `/api/superadmin/colegios`,
  con guard propio (`superadmin-role.guard.ts` en ese repo). Esto es una entidad **`SUPERADMIN`** que
  no está documentada en el `CLAUDE.md` raíz del workspace (que solo menciona roles `ADMIN`/`TEACHER`).
  Si trabajás en rutas de colegios, el modelo de roles real en `ms-users` incluye `SUPERADMIN` — hay
  que verificarlo ahí, no confiar en el mapa raíz.
- `students`/`paci-profiles` van **sin** el prefijo `/api` porque `ms-perfil-alumno` NO tiene
  `app.setGlobalPrefix('api')` en su `main.ts` (a diferencia de ms-users, ms-docs y adminpanel, que sí
  lo tienen). Si agregás un endpoint nuevo hacia `perfil`, no le antepongas `/api`.
- `dashboard.controller.ts` (`getUserDashboard`) accede a `this.dashboardService['client']` con
  notación de corchetes para esquivar que `client` es `private` en el service — es un hack para
  obtener el `id` del usuario antes de llamar a `getUserDashboard`. Si refactorizás
  `DashboardService`, revisá este acceso directo (línea ~14 de `dashboard.controller.ts`).

---

## 5. Autenticación — el BFF NO valida JWT, solo lo reenvía

Confirmado en código y en `README.md` (sección "Seguridad y autorización"):

- No hay ningún `Guard` de auth en este repo. Cada controller extrae el header con
  `@Headers('authorization') authorization: string` y lo pasa tal cual a `MicroserviceClient` como
  `authToken`, que lo reenvía como header `Authorization` sin tocarlo
  (`microservice.client.ts`, líneas ~56-61).
- La validación real del JWT de Supabase ocurre en cada microservicio downstream (`SupabaseAuthGuard`
  / JWKS con `jose`), y la autorización por rol con `RolesGuard` + `@Roles(...)`, tal como describe
  el `CLAUDE.md` raíz del workspace (§4).
- Si un JWT es inválido, el downstream devuelve 401 y el BFF lo propaga sin modificar (gracias a
  `validateStatus: status < 500`).
- **Consecuencia práctica:** cualquier endpoint nuevo que solo llame a un microservicio queda
  "protegido" automáticamente porque el downstream rechaza el token inválido. Pero si agregás un
  endpoint que NO llama a ningún microservicio (agregación pura en el BFF), no hay validación de
  JWT — hay que agregarla a mano.
- `auth.service.ts` tiene dos helpers, `extractToken` (separa `Bearer <token>`) y
  `extractAuthHeader` (devuelve el header completo) — usados solo en `auth.controller.ts` para
  `logout`/`me`/`updateMe`. El resto de los controllers pasan el header crudo directo sin usar estos
  helpers.

---

## 6. Variables de entorno

`.env.example` (raíz del repo):

```env
CORS_ORIGIN=http://localhost:3002,http://127.0.0.1:3002

USERS_SERVICE_URL=http://localhost:3001
ADMINPANEL_SERVICE_URL=http://localhost:3004
PERFIL_SERVICE_URL=http://localhost:3005
DOCS_SERVICE_URL=http://localhost:3000
CHAT_SERVICE_URL=http://localhost:3000
```

**`.env.example` NO define `PORT`** — pero `main.ts` sí lo lee con default `3006`
(`configService.get<number>('PORT', 3006)`), y así lo documentan también `README.md` y el
`Dockerfile` (`ENV PORT=3006`, `EXPOSE 3006`).

El `.env` real de este repo (no versionado) sí trae `PORT=3010` — ver gotcha de puertos abajo.

`CHAT_SERVICE_URL` está definida pero, como se explicó en §3, no la consume ningún módulo hoy
(el chat no pasa por el BFF).

---

## 7. Comandos

```bash
npm install
npm run start:dev     # nest start --watch (alias: npm run dev)
npm run build          # nest build
npm start               # node dist/main
npm run start:debug    # nest start --debug --watch
npm test                # Jest (test:watch, test:cov)
npm run lint            # eslint --fix
```

Swagger UI disponible en `http://localhost:<PORT>/docs` una vez levantado.

Tests: cada `*.controller.ts` y `*.service.ts` tiene su `*.spec.ts` al lado (patrón NestJS estándar).
Hay también `src/infrastructure/microservice-client/microservice.client.spec.ts` que testea el
cliente genérico. `package.json` tiene la config de Jest embebida (`rootDir: "src"`, coverage a
`../coverage`).

---

## 8. Gotchas / discrepancias detectadas en el código (⚠️ IMPORTANTE)

1. **Discrepancia de puerto BFF, activa hoy** (verificado leyendo los `.env` reales, no solo
   `.env.example`):
   - `bff-prisma/.env` (local, no versionado) → `PORT=3010`.
   - `bff-prisma/README.md`, `Dockerfile` y el default hardcodeado en `main.ts` → `3006`.
   - `prisma-front/.env.example` → `VITE_BFF_URL=http://localhost:3010` (coincide con el `.env`
     real del BFF).
   - **`prisma-front/.env` (local, no versionado) → `VITE_BFF_URL=http://localhost:3006`** — NO
     coincide con el puerto real en el que corre el BFF (3010). Si el front no puede pegarle al
     BFF en desarrollo local, este es el primer lugar a revisar.
   - Conclusión: el puerto "canónico" real de desarrollo es **3010** (así lo confirma el `.env` que
     efectivamente se usa), pero el resto de la documentación de este repo (README, Dockerfile,
     default de `main.ts`) quedó en `3006` y no se actualizó. Si tocás el bootstrap o el Dockerfile,
     considerá alinear todo a 3010 o, al menos, dejar `.env.example` con `PORT=3010` explícito.

2. **`.env.example` no lista `PORT`** aunque `main.ts` sí lo lee — quien clona el repo y copia
   `.env.example` a `.env` arranca en el puerto 3006 por defecto (el hardcodeado en `main.ts`), no
   en 3010. Agregar `PORT=3010` a `.env.example` evitaría esta trampa.

3. **`ServiceName` incluye `'chat'` y existe `CHAT_SERVICE_URL`, pero no hay módulo `chat` ni
   ningún uso real** — remanente, probablemente pensado para una futura integración del chat vía
   BFF que hoy no existe (el chat sigue yendo directo del front a `prisma_workflow`).

4. **`colegios` (multi-tenant, rol `SUPERADMIN`) no está en el `CLAUDE.md` raíz del workspace.**
   Es funcionalidad nueva en `ms-users` (`/api/superadmin/colegios`, guard
   `superadmin-role.guard.ts`) posterior al mapa raíz. Si trabajás en rutas de colegios/schools acá
   o en `ms-users`, no asumas que el modelo de roles se limita a `ADMIN`/`TEACHER`.

5. **`/api/admin/*` está repartido entre dos microservicios** (`adminpanel` y `ms-users`) — ver
   detalle en §4. Fácil de romper si se agrega un endpoint nuevo sin fijarse a qué servicio apunta.

6. **`ms-perfil-alumno` no usa `/api` como prefijo global**, a diferencia de los otros tres
   microservicios downstream — ver §4. Cualquier ruta nueva hacia `perfil` no debe llevar `/api`.

7. **No hay caché ni agregación real** más allá de `dashboard.service.ts` (que usa `Promise.all`
   para pegarle a 2-4 servicios en paralelo). El resto del BFF es proxy 1:1 sin transformar payloads
   — el README lista "cache" y "agregación" como beneficios potenciales del patrón BFF, pero en el
   código actual casi no se ejercen.

8. **`microservice.client.ts` no reintenta** (no hay retry/backoff) — un timeout o error de red en
   el downstream se traduce directo en `BadGatewayException` (502) hacia el front, sin reintento
   automático.
