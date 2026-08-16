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


## 2026-08-02 — Renombrado completo del código a inglés

- Todo el proyecto (esquema de Prisma, rutas, seeds, documentación) traducido del español al inglés para una imagen más profesional en el portfolio: `Taller→Workshop`, `Empleado→Employee`, `Cliente→Customer`, `Articulo→Item`, `Factura→Invoice`, `LineaFactura→InvoiceLine`.
- Base de datos reseteada y migrada desde cero con el esquema en inglés (`prisma migrate reset` + `prisma migrate dev --name init`), y datos de Fernando y David resembrados.
- Verificado el flujo completo tras la renombrada: login, `/api/customers`, `/api/items` funcionando correctamente.
- `src/routes/invoices.ts` sigue en construcción (Fase 5) — el cálculo del número de factura con reintento transaccional ya está traducido y corregido; pendiente el cálculo del hash y la creación real de la factura.


## 2026-08-02 — Fase 5 completada: núcleo de facturación

- Endpoint `POST /api/invoices`: crea una factura con sus líneas, calculando `subtotal`, `taxAmount` (21%) y `total` con aritmética `Decimal` exacta (nunca `float`).
- Numeración de factura correlativa **por empleado** (`INICIALES-AÑO-NNNN`, ej. `FMV-2026-0001`), calculada dentro de una transacción con aislamiento `Serializable` y reintento automático ante conflictos de escritura (`P2034`) — protege contra condiciones de carrera si dos facturas se crean casi a la vez.
- Cadena de hash (SHA-256) por empleado: cada factura encadena su hash con el de la anterior, verificado manualmente en PostgreSQL — el `current_hash` de la primera coincide exactamente con el `previous_hash` de la segunda.
- Cada línea de factura congela el nombre y precio del artículo en el momento de facturar (snapshot), no una referencia en vivo.
- Añadidos los 2 talleres (Colmenar de Oreja, Aranjuez) al `seed.ts`, con datos pendientes de confirmar por el cliente real.
- Probado de principio a fin: login → crear cliente y artículo de prueba → crear 2 facturas consecutivas → verificar en PostgreSQL que la cadena de hash es correcta.
- Pendiente para más adelante: flujo de facturas rectificativas (correcciones), que usará la autorreferencia `correctedInvoiceId` que dejamos preparada en el esquema pero sin implementar todavía.


## 2026-08-16 — Fase 6 completada: código QR de verificación

- Endpoint `GET /api/invoices/:id/qr`: genera un código QR (imagen en base64) a partir de los datos clave de la factura (NIF del empleado, número, fecha, importe), usando la librería `qrcode`.
- Probado generando y visualizando el QR en el navegador — funciona correctamente.
- **Pendiente de validación oficial**: el contenido actual del QR es un texto de ejemplo (`NIF:...|NUM:...|FECHA:...|IMPORTE:...`), no el formato exacto que exige la normativa Veri*Factu. Al escanearlo con la cámara del móvil, dio "contenido no válido" — probablemente porque el formato oficial real es una URL (que las cámaras reconocen de forma nativa), no texto libre. Antes de producción, hay que confirmar el formato exacto con la documentación oficial de la AEAT (o la gestoría) y actualizar `qrContent` en consecuencia — el resto de la implementación no cambiaría.


## 2026-08-16 — Fase 7 completada: generación de PDF

- `src/lib/pdf.ts`: `generatePdf(html)` usa Puppeteer (Chrome headless) para convertir cualquier HTML en un PDF; `buildInvoiceHtml(invoice, qrDataUrl)` construye la plantilla de la factura con los datos del taller, el empleado emisor, el cliente, la tabla de líneas, el desglose de IVA/total, y el código QR incrustado.
- Endpoint `GET /api/invoices/:id/pdf`: junta todo (factura con sus relaciones completas, QR, HTML, PDF) y lo devuelve como descarga real (`Content-Type: application/pdf`).
- Refactor: la generación del contenido del QR se extrajo a una función compartida (`generateInvoiceQr`), reutilizada tanto por `/qr` como por `/pdf`, evitando duplicar lógica.
- Aprendido de paso: las sesiones en memoria (`MemoryStore`) se pierden cada vez que el servidor se reinicia (por ejemplo, al guardar un archivo con `tsx watch` corriendo) — hay que volver a hacer login tras cada reinicio durante el desarrollo.
- Probado de principio a fin: login → generar PDF de la factura 1 → verificado visualmente que todos los datos y el QR aparecen correctamente.


## 2026-08-16 — Fase 8.0 completada: entorno del frontend

- Proyecto React + TypeScript creado con Vite (`frontend/`), usando ESLint como linter.
- Tailwind CSS instalado y configurado mediante su plugin oficial de Vite (`@tailwindcss/vite`) — sin necesidad de archivo de configuración aparte para lo básico.
- Limpiado el contenido de ejemplo de Vite en `App.tsx`, sustituido por un placeholder mínimo. Verificado que las clases de Tailwind se aplican correctamente (tamaño de letra, negrita y color comprobados en el navegador).
- Siguiente paso (Fase 8.1): estructura base del frontend y comunicación con la API del backend.


## 2026-08-16 — Fase 8.1 completada: estructura base y conexión con la API

- Configurado CORS en el backend (`cors`, con `credentials: true` y origen restringido a `FRONTEND_URL`) para permitir peticiones desde el frontend con la cookie de sesión incluida.
- Creado `frontend/src/api/client.ts`: función `apiFetch` que envuelve `fetch` con la URL base, `credentials: "include"` y manejo de errores reutilizando el formato `{ error }` del backend.
- Verificado el circuito completo (CORS + cookies + fetch + estado de React) llamando a `/api/health` desde `App.tsx` con `useState`/`useEffect`.
- Siguiente paso (Fase 8.2): página de login.