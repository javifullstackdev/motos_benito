# Registro de desarrollo (DEVLOG)

Este archivo documenta cronológicamente las decisiones tomadas y los pasos dados en el desarrollo del proyecto.

## 2026-07-29 — Fase 0: arranque del proyecto

- Definidos los requisitos iniciales: app web de facturación para los talleres de Colmenar de Oreja y Aranjuez, con base de datos compartida, login por empleado, numeración única de factura y autorelleno de clientes/artículos.
- Decisión de stack: React + TypeScript + Vite + Tailwind (frontend), Node.js + Express + TypeScript (backend), PostgreSQL + Prisma (datos), Puppeteer para generación de PDF.
- Decisión clave: la app debe sustituir por completo el proceso manual de facturación actual, por lo que debe cumplir la normativa Veri*Factu (registros inalterables y encadenados por hash). Se empezará en modo "no tiempo real" (sin envío automático a la AEAT), dejando la arquitectura preparada para añadir esa integración más adelante.
- Entorno verificado: Node v22.22.0, npm 10.9.4, Git 2.51.0, PostgreSQL 18.4.
- Repositorio Git inicializado en `motos-benito/`.


## 2026-07-29 — Fase 1: modelado de datos

- Diseñadas las 6 entidades del núcleo de facturación: `talleres`, `empleados`, `clientes`, `articulos`, `facturas`, `lineas_factura`.
- Descubrimiento clave: Fernando y David son autónomos independientes (sin CIF de empresa conjunta), por lo que la numeración de factura y la cadena de hash de Veri*Factu deben ser independientes por empleado, no por taller ni globales.
- Decisiones de diseño: direcciones aplanadas (1FN), snapshot de precio e IVA en cada línea de factura, campos de dinero como `decimal`.
- Pendiente: domicilio fiscal real de Fernando y David (de momento con datos de ejemplo).
- Diagrama entidad-relación documentado en `docs/modelo-datos.md`.


## 2026-07-30 — Fase 2: backend base y primera migración

- Servidor Express + TypeScript funcionando, con ruta de comprobación `/api/health`.
- Prisma 7 configurado con PostgreSQL local (`motos_benito_dev`), usando el nuevo `prisma.config.ts`.
- Traducidos los 6 modelos del diagrama entidad-relación a `schema.prisma`, con relaciones completas, tipos `Decimal` para dinero, y `@map`/`@@map` para mantener las columnas de PostgreSQL en snake_case mientras el código usa camelCase.
- Añadidas restricciones `@unique` adicionales: nombre de artículo (evita duplicados en el catálogo) y hash de factura (red de seguridad de integridad).
- Primera migración (`20260730114009_init`) aplicada correctamente: las 6 tablas existen en PostgreSQL, con claves foráneas protegidas (`ON DELETE RESTRICT`, para no poder borrar registros con facturas asociadas).


## 2026-07-30 — Fase 3 (en progreso): autenticación — hashing y seed de empleados

- Instaladas dependencias de autenticación: `bcryptjs` (hashing de contraseñas; se usa en vez de `bcrypt` para evitar problemas de compilación nativa en Windows) y `express-session`.
- Descubierto que Prisma 7 requiere un "driver adapter" explícito para conectar con PostgreSQL (`@prisma/adapter-pg` + `pg`), a diferencia de versiones anteriores donde bastaba `new PrismaClient()`.
- Creado `prisma/seed.ts`: da de alta a Fernando y David en `empleados`, con sus contraseñas ya hasheadas (nunca en texto plano). Ejecutado correctamente contra la base de datos real.
- Decisión de privacidad: `prisma/seed.ts` contiene datos reales (DNI, dirección fiscal) y se ha añadido a `.gitignore` — nunca se sube al repositorio público. Se versiona en su lugar `prisma/seed.example.ts` (datos ficticios) y `.env.example` (plantilla sin credenciales reales), siguiendo el mismo patrón que `.env`.
- Pendiente para la próxima sesión: endpoint de login, gestión de sesiones, y protección de rutas.


## 2026-07-30 — Fase 3 completada: autenticación de empleados

- Endpoint `POST /api/auth/login`: verifica email + contraseña (comparación con bcrypt, nunca en texto plano); mismo mensaje y código 401 tanto si el usuario no existe como si la contraseña es incorrecta, para no filtrar qué emails están registrados.
- Endpoint `POST /api/auth/logout`: destruye la sesión del servidor.
- Endpoint `GET /api/auth/me`: devuelve los datos del empleado autenticado, usando `select` de Prisma para excluir explícitamente la contraseña de la respuesta.
- Middleware `requireAuth` reutilizable (`src/middleware/requireAuth.ts`), listo para proteger cualquier ruta futura (clientes, artículos, facturas).
- Sesiones gestionadas con `express-session` (cookie firmada, caduca a las 8 horas).
- Probado el flujo completo de principio a fin: login → `/me` autenticado → logout → `/me` tras logout devuelve 401 correctamente.


## 2026-08-02 — Fase 4 completada: CRUD de clientes y artículos

- Endpoints REST completos (listar, obtener por id, crear, actualizar, borrar) para `clientes` y `articulos`, montados en `/api/clientes` y `/api/articulos`, protegidos con el middleware `requireAuth`.
- Cada recurso vive en su propio archivo (`src/routes/clientes.ts`, `src/routes/articulos.ts`), usando `Router` de Express para mantener el código organizado.
- Manejo de errores con `try/catch` en `update`/`delete`, capturando tanto registros no encontrados como violaciones de las restricciones `ON DELETE RESTRICT` (por ejemplo, no se puede borrar un artículo ya usado en alguna línea de factura).
- Probado el flujo completo (crear → listar → obtener → actualizar → borrar → confirmar borrado) para ambos recursos, con datos de prueba ficticios.
- Estos endpoints son la base sobre la que se construirá el autorelleno del formulario de facturas en el frontend (Fase 8).