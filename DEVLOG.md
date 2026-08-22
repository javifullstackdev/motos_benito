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


## 2026-08-16 — Fase 8.2 completada: página de login

- `frontend/src/pages/Login.tsx`: formulario controlado (email + contraseña) que llama a `POST /api/auth/login` mediante `apiFetch`.
- Manejo de estados: `isLoading` (deshabilita el botón y cambia su texto mientras se envía), `error` (muestra el mensaje del backend si el login falla).
- Probado con éxito: login correcto con las credenciales de Fernando, y mensaje de error visible con credenciales incorrectas.
- Pendiente para la Fase 8.3: sistema de rutas (React Router) y protección de páginas privadas — de momento `Login` se muestra directamente en `App.tsx` sin navegación real tras el login.


## 2026-08-16 — Fase 8.3 completada: rutas y protección de páginas privadas

- Instalado `react-router-dom`: rutas `/login` (pública) y `/` (protegida, con `Dashboard` como placeholder).
- `AuthContext` (Context API de React): mantiene el empleado logueado (`employee`), comprueba la sesión existente contra `/api/auth/me` al arrancar la app, y expone `login()`/`logout()`.
- `ProtectedRoute`: redirige a `/login` si no hay sesión válida, esperando primero a que termine la comprobación inicial (`isLoading`) para evitar redirecciones incorrectas mientras se carga.
- Backend: `POST /api/auth/login` ahora también devuelve los datos del empleado (sin la contraseña), igual que `/me`, para no tener que hacer una segunda petición tras el login.
- `Login.tsx` actualizado: al iniciar sesión con éxito, actualiza el contexto (`login(data.user)`) y navega al panel protegido (`navigate("/")`).
- Siguiente paso (Fase 8.4): gestión de clientes (listar, crear) en el frontend.


## 2026-08-16 — Fase 8.4 (en progreso): listado de clientes

- `frontend/src/pages/CustomerList.tsx`: pide `GET /api/customers` al montar y dibuja una tabla con nombre, NIF/CIF, teléfono y email de cada cliente.
- Ruta `/customers` añadida y protegida con `ProtectedRoute`, enlazada desde el panel principal con `<Link>` (navegación sin recargar la página).
- Corregido un fallo de seguridad real: la ruta `/` había perdido su envoltorio `ProtectedRoute` al añadir la ruta de clientes, dejando el panel accesible sin sesión — detectado y arreglado antes de que llegara a producción.
- Pendiente: formulario de creación de clientes.


## 2026-08-16 — Fase 8.4 completada: gestión de clientes (listar y crear)

- `frontend/src/pages/CustomerCreate.tsx`: formulario de creación con estado de objeto único (`formData`) y una función `handleChange` genérica reutilizada por los 12 campos — patrón más escalable que un `useState` por campo, usado en formularios grandes.
- Ruta `/customers/new` añadida y protegida; enlazada desde el listado con `<Link>`.
- Probado el flujo completo: login → ver clientes → crear cliente nuevo → vuelve al listado y aparece correctamente.
- Siguiente paso (Fase 8.5): gestión de artículos (listar, crear) — mismo patrón, aplicado más rápido esta vez.


## 2026-08-16 — Fase 8.5 completada: gestión de artículos (listar y crear)

- `frontend/src/pages/ItemList.tsx` e `ItemCreate.tsx`: mismo patrón que clientes, aplicado a `Item` (nombre, precio, en stock).
- Introducido el patrón de casilla de verificación controlada: usa `checked` (no `value`) y su propio `onChange` leyendo `event.target.checked`
- Añadido un `<select>` de tipo de vía en el formulario de clientes.
- Rutas `/items` y `/items/new` añadidas y protegidas, con enlaces desde el panel y el listado.
- Siguiente paso (Fase 8.6): el formulario de nueva factura, con autorelleno de cliente y artículo — el objetivo original de todo el proyecto.


## 2026-08-16 — Fase 8.6 completada: formulario de nueva factura con autorelleno

- Añadido `GET /api/workshops` en el backend (solo lectura, ya que los 2 talleres son datos fijos sembrados).
- `frontend/src/pages/InvoiceCreate.tsx`: formulario completo con desplegable de taller, autorelleno de cliente y de artículo por línea usando `<datalist>` (sugiere coincidencias existentes mientras escribes, sin necesidad de un componente de autocompletado a medida).
- Líneas de factura dinámicas: array de objetos en el estado, con funciones `addLine`/`removeLine`/`updateLine` siguiendo el patrón estándar de React para actualizar un array sin mutarlo directamente.
- Validación antes de enviar: si el cliente o cualquier artículo escrito no coincide con un registro real del catálogo, se bloquea el envío — así se cumple de verdad el objetivo de mantener uniformidad en los datos.
- Tras crear la factura con éxito, se muestra el número generado y un enlace directo de descarga del PDF (`/api/invoices/:id/pdf`).
- Probado el flujo completo de principio a fin: login → nueva factura → taller + cliente + artículos autorellenados → factura creada → PDF descargado correctamente.
- Pendiente (Fase 8.7): listado de facturas.


## 2026-08-16 — Fase 8.7 completada: listado de facturas

- Añadido `GET /api/invoices` en el backend, incluyendo cliente, taller y empleado emisor mediante `select` anidado dentro de `include` — mismo principio que `/me`, aplicado ahora a relaciones incluidas, para no filtrar la contraseña del empleado.
- `frontend/src/pages/InvoiceList.tsx`: tabla con número de factura, cliente, taller, empleado, fecha, total y enlace de descarga directa del PDF.
- Con esto, el ciclo completo de facturación ya es utilizable de principio a fin desde el navegador: crear cliente/artículo → crear factura con autorelleno → listar facturas → descargar PDF.
- Pendiente (Fase 8.8): pulido visual y responsive.


## 2026-08-16 — Fase 8.8 completada: pulido visual y responsive

- `Layout.tsx`: barra de navegación compartida (aplicada automáticamente a todas las páginas protegidas a través de `ProtectedRoute`), con menú hamburguesa real en pantallas estrechas — botón que alterna un estado (`isMenuOpen`), mostrando enlaces en fila en escritorio (`hidden sm:flex`) o apilados en un panel desplegable en móvil (`sm:hidden`), sin que ambas vistas coincidan nunca.
- Las 3 tablas (`CustomerList`, `ItemList`, `InvoiceList`) envueltas en un contenedor con `overflow-x-auto`, para que se puedan desplazar horizontalmente en pantallas estrechas en vez de romper el diseño.
- Con esto, la **Fase 8 (frontend) queda completa**: login, navegación protegida, gestión de clientes y artículos, creación de facturas con autorelleno, listado y descarga de PDF, todo con una interfaz consistente y usable tanto en escritorio como en móvil.


## 2026-08-16 — Pulido del frontend: login, PDF y corrección de IVA

- **Login rediseñado**: tarjeta centrada con sombra, marcador de logo, fondo con degradado sutil, estados de foco en los inputs, spinner animado en el botón mientras carga, y caja de error con estilo propio.
- **PDF de factura rediseñado**: cabecera con espacio para logo + título/número/fecha, datos del emisor (empleado + taller) y del cliente en dos columnas, tabla de líneas con importes alineados a la derecha, totales en formato factura real (base imponible / IVA / total destacado), y pie de página con QR + nota de verificación.
- **Corrección importante de cálculo**: los precios de los artículos se interpretan ahora como **IVA incluido** (lo habitual de cara al cliente final), en vez de sumar el IVA aparte. El backend ahora calcula el `total` directamente a partir de los precios (que ya lo incluyen), y **deriva** la base imponible y el IVA a partir de ese total (`base = total / 1.21`), en vez de calcular la base primero y sumarle el IVA después.
- Probado con una factura de prueba nueva, confirmando que los importes cuadran correctamente.


## 2026-08-16 — Búsqueda dentro de cada sección

- Añadida una caja de búsqueda en `CustomerList.tsx`, `ItemList.tsx` e `InvoiceList.tsx`, filtrando en el propio frontend sobre los datos ya cargados con `.filter()` (sin tocar el backend).
- Búsqueda insensible a mayúsculas/minúsculas, comparando contra varios campos a la vez (nombre, NIF, teléfono, email en clientes; nombre, precio, stock en artículos; número, cliente, taller, empleado, fecha, total en facturas).
- Primer paso de una mejora más grande del Dashboard/búsqueda: pendiente el panel de artículos más vendidos, la gráfica de ingresos, y una búsqueda general.


## 2026-08-16 — Dashboard con contenido real y gráfica de ingresos

- Nuevo endpoint `GET /api/stats/top-items`: usa `groupBy` de Prisma para calcular los 5 artículos más vendidos (sumando cantidades de todas las líneas de factura), combinado con una segunda consulta para traer sus nombres.
- Nuevo endpoint `GET /api/stats/revenue-by-month`: agrupa la facturación por mes (agregación hecha en JavaScript, ya que Prisma no agrupa directamente por fragmentos de fecha).
- `Dashboard.tsx` rediseñado: accesos rápidos (nueva factura/cliente/artículo), paneles de últimas facturas, últimos clientes y artículos más vendidos, y una gráfica de líneas de ingresos por mes con `recharts`.
- Corregido `customers.ts` para ordenar por `customerId` descendente (necesario para que "últimos clientes" muestre los más recientes de verdad).


## 2026-08-16 — Fichas de cliente y artículo (ver y editar)

- `CustomerDetail.tsx` e `ItemDetail.tsx`: páginas nuevas que cargan un registro existente por su id (`useParams()`, con `[id]` como dependencia del `useEffect` para recargar si cambia), precargan el formulario con sus datos reales, y permiten editarlo y guardarlo con `PUT` (reutilizando los endpoints ya existentes desde la Fase 4).
- El nombre de cada cliente/artículo en `CustomerList.tsx`/`ItemList.tsx` es ahora un enlace directo a su ficha.
- Rutas `/customers/:id` y `/items/:id` añadidas y protegidas.
- Probado de principio a fin: clic en un nombre → ficha precargada → editar → guardar → vuelve al listado con el cambio aplicado.


## 2026-08-19 — Logo, footer, política de privacidad y mejoras de diseño

- Logo de la empresa incluido en tres sitios: la barra de navegación y el login (como imagen importada en React), y el PDF de factura (SVG insertado directamente en el HTML generado, leído del disco con `fs.readFileSync` al arrancar el servidor).
- Corregido un fallo de maquetación: `CustomerCreate`, `ItemCreate`, `CustomerDetail` e `ItemDetail` usaban un envoltorio pensado para páginas de pantalla completa (`min-h-screen` + centrado), que entraba en conflicto con el `Layout` que ya las envuelve — sustituido por un contenedor simple (`max-w-md mx-auto p-6`), consistente con el resto de páginas.
- `Footer.tsx` nuevo: copyright con año dinámico, enlace a la política de privacidad, y enlace al portfolio del desarrollador. Aplicado el patrón "sticky footer" en `Layout.tsx` (`flex flex-col` + `flex-1` en `<main>`) para que el footer quede siempre anclado abajo, incluso en páginas con poco contenido.
- Página de política de privacidad (`/privacidad`, ruta pública) con la estructura estándar exigida por el RGPD — marcada explícitamente como borrador pendiente de revisión legal, sobre todo en cuanto a quién es el "responsable del tratamiento" (Fernando y David son autónomos independientes, sin entidad jurídica conjunta).
- `Workshop` (talleres): la dirección pasa de un único campo `address` a los mismos 6 campos desglosados que ya usan `Employee`/`Customer` (tipo de vía, calle, número, ciudad, provincia, código postal, país) — con su migración correspondiente, y actualizado el PDF y el `seed.ts`.
- Varias mejoras adicionales de diseño, branding y UX/UI en toda la app, en escritorio y móvil.


## 2026-08-19 — Preparación para despliegue: sesiones persistentes y Puppeteer en contenedor

- Sustituido el almacén de sesiones en memoria (`MemoryStore`) por `connect-pg-simple`, guardando las sesiones como filas en la propia base de datos PostgreSQL — sobreviven a reinicios del servidor, tanto en desarrollo como en producción (esencial para no perder sesiones aleatoriamente en un hosting real).
- Cookie de sesión configurada de forma condicional según el entorno: `secure`/`sameSite: "none"` en producción (necesario porque frontend y backend viven en dominios distintos), `sameSite: "lax"` en desarrollo (suficiente porque `localhost` en distintos puertos se considera "mismo sitio").
- Puppeteer configurado con `--no-sandbox`/`--disable-setuid-sandbox`, necesario para poder arrancar Chrome dentro de un contenedor Docker (como los que usa Railway).
- Corregido un bug real: se quedaron dos middlewares de sesión activos a la vez (el nuevo y el antiguo sin borrar), pisándose entre sí.
- Probado: login funciona, y la sesión sobrevive a un reinicio del servidor sin tener que volver a autenticarse.
- Siguiente paso: desplegar el backend + base de datos en Railway, y el frontend en Vercel.


## 2026-08-19 — Preparación para producción: compilación real con `tsc`

- Añadidos los scripts `build` (`prisma generate && tsc && shx cp -r src/assets dist/assets`) y `start` (`node dist/server.js`) — hasta ahora solo habíamos ejecutado el proyecto con `tsx`, que es mucho más permisivo que el compilador real de TypeScript.
- `tsconfig.json`: `module` cambiado de `"nodenext"` a `"commonjs"`, y `verbatimModuleSyntax` desactivado — la combinación anterior exigía que cada archivo declarase explícitamente si era CommonJS o ESM, y entraba en conflicto con la sintaxis `import`/`export` que ya teníamos escrita en todo el proyecto.
- Añadido `include: ["src/**/*"]` en `tsconfig.json`, para que `tsc` no intente compilar `prisma.config.ts` ni los scripts de `prisma/seed*.ts` (viven fuera de `src/`, y no forman parte del servidor en sí).
- Corregidos varios errores reales que solo `tsc` (no `tsx`) detecta: un valor no válido en `page.setContent` de Puppeteer, un tipo de retorno desactualizado (`Buffer` → `Uint8Array`), y dos sitios donde faltaba confirmar explícitamente a TypeScript que un valor no sería `undefined` en tiempo de ejecución.
- `shx` añadido como dependencia de desarrollo, para copiar la carpeta `assets/` (el logo) a `dist/` de forma que funcione igual en Windows (desarrollo) y Linux (Railway) — `tsc` no copia archivos que no sean `.ts`.
- Probado: `npm run build` compila sin errores, y `npm run start` arranca el servidor ya compilado, sirviendo la app exactamente igual que en desarrollo.


## 2026-08-19 — Despliegue a producción: Railway (backend) y Vercel (frontend)

- **Backend + PostgreSQL en Railway**: desplegados como dos servicios dentro del mismo proyecto, comunicándose por red interna (`postgres.railway.internal`). Aplicado `prisma migrate deploy` (versión no interactiva, pensada para producción) contra la base de datos real.
- **Sembrado de datos reales en producción**: hecho a través de Railway CLI (`railway link`, `railway service` para cambiar al servicio de Postgres, `railway variables` para localizar su proxy TCP público) y ejecutando `npx prisma db seed` en local con `DATABASE_URL` sobreescrita temporalmente a esa dirección pública. El proxy público se desactivó de nuevo justo después, ya que el backend solo necesita hablar con la base de datos por red interna.
- **Frontend en Vercel**: desplegado con "Root Directory" = `frontend`. Corregidos 2 errores de compilación que `tsc` sí detecta y Vite (en desarrollo) no: `AuthContext` sin tipo genérico en `createContext` (TypeScript inferí­a que el contexto era siempre `null`), y un `useNavigate` importado pero nunca usado.
- **Cookies de sesión bloqueadas entre dominios distintos**: causa 1, Express no confiaba en el proxy de Railway, así que `express-session` nunca llegaba a enviar la cookie `Secure` — solucionado con `app.set("trust proxy", 1)`. Causa 2, en iPhone (Safari y Chrome, ambos sobre WebKit) la cookie se seguía bloqueando por ser "cross-site" entre `vercel.app` y `railway.app`, incluso con `sameSite: "none"` — solucionado con un proxy interno vía `vercel.json` (`rewrites` de `/api/*` hacia el backend de Railway), haciendo que el navegador vea las peticiones como same-origin.
- Ajustados `VITE_API_URL` y los enlaces de descarga de PDF a rutas relativas (`/api/...`) para funcionar con ese proxy; corregido un bug donde la variable de entorno en Vercel contenía literalmente el texto `""` en vez de estar vacía de verdad (`client.ts` ahora usa `?? ""` como red de seguridad).
- **Probado**: login, listado de clientes/artículos y descarga de PDF funcionando correctamente desde escritorio y desde móvil (iPhone).


## 2026-08-21 — Validación de datos, borrado con confirmación y confirmación de facturación por DNI

- **Validación de NIF/NIE/CIF español** (`frontend/src/utils/taxId.ts`): implementado el algoritmo de la letra de control del DNI/NIE (módulo 23) y el del CIF (suma ponderada duplicando las cifras impares). Conectado al `handleSubmit` de `CustomerCreate.tsx` y `CustomerDetail.tsx`, bloqueando el guardado si el documento no es válido.
- **Normalización a mayúsculas** (`frontend/src/utils/formatting.ts`): los campos de texto libre (`type="text"`) se convierten a mayúsculas al escribir, aprovechando que el propio `type` del input ya distingue automáticamente estos campos de los que no deben tocarse (email, teléfono, números, `<select>` con valores internos en minúsculas) — sin necesidad de mantener una lista de exclusiones a mano.
- **Bug real detectado y corregido en el backend**: `customers.ts` e `items.ts` no capturaban el error de restricción única de Prisma (`P2002`) en `POST`/`PUT` (por ejemplo, al crear un cliente con un NIF ya existente) — Express devolvía entonces su página de error HTML por defecto en vez de JSON, rompiendo el `.json()` del frontend. Añadido `try/catch` en ambos archivos, distinguiendo `P2002` (409, duplicado) de `P2025` (404, no encontrado) de cualquier otro fallo (500).
- **Borrado de clientes y artículos**: nuevo componente reutilizable `ConfirmDialog.tsx` (modal de sí/no con el estilo visual de la app), conectado a nuevos botones "Eliminar" en `CustomerDetail.tsx` e `ItemDetail.tsx`, usando las rutas `DELETE` que ya existían en el backend desde la Fase 4.
- **Confirmación de facturación con DNI**: nuevo componente `TypeToConfirmDialog.tsx` — antes de generar una factura, se pide al empleado que escriba su propio DNI para confirmar la acción, comparándolo contra `employee.nationalId` (campo añadido ahora a las respuestas de `/api/auth/login` y `/api/auth/me`, que antes no lo exponían). El botón de confirmar permanece deshabilitado mientras el texto no coincide exactamente, con una comprobación explícita para que un campo vacío nunca pueda "colar" como válido.
- **Probado**: NIF inválido bloquea el alta de cliente; borrado de cliente/artículo sin facturas asociadas funciona, y con facturas asociadas muestra el mensaje de conflicto; factura solo se genera tras escribir el DNI correcto del empleado logueado.


## 2026-08-21 — Sistema de diseño reutilizable y refactor visual

- Extraídos los patrones visuales repetidos por toda la app a componentes reutilizables en `frontend/src/components/ui/`: `Card`, `FormLabel`, `TextInput`, `Select`, `Button` (con variantes primary/secondary/danger y estado de carga integrado), `Alert` (error/éxito) y `Badge`.
- Migrados todos los formularios existentes (`CustomerCreate`, `CustomerDetail`, `ItemCreate`, `ItemDetail`, `InvoiceCreate`) para usar estos componentes en vez de repetir las mismas cadenas de clases de Tailwind en cada archivo.
- Estandarizado el tamaño de las etiquetas de formulario (`text-base` en todos los formularios; antes había una mezcla de `text-xs`/`text-base` según la pantalla).
- Ocultadas las flechas nativas de incremento/decremento de los inputs numéricos (`type="number"`), que no seguían el tema oscuro de la app — regla CSS global añadida en `index.css`.


## 2026-08-21 — Informe trimestral de IVA

- Nuevo endpoint `GET /api/employees` (listado simple de empleados activos, no existía hasta ahora).
- Dos rutas nuevas en `invoices.ts`: `GET /api/invoices/quarterly-report` (resumen en JSON, para mostrar en pantalla) y `GET /api/invoices/quarterly-report/pdf` (informe descargable), ambas filtrando por empleado + trimestre/año — imprescindible que sea por empleado, ya que Fernando y David declaran el IVA cada uno por separado al ser autónomos independientes sin CIF conjunto.
- Nueva plantilla de PDF (`buildQuarterlyReportHtml`) con el listado de facturas del periodo y los totales de base imponible, IVA repercutido y total facturado, con el mismo estilo visual que las facturas individuales.
- **Alcance deliberadamente limitado**: el informe solo cubre el IVA repercutido (facturas emitidas) — la app no registra gastos ni compras del taller, así que no sustituye la preparación completa del Modelo 303, que también necesita el IVA soportado.
- Añadida una tarjeta nueva en el Dashboard con selector de empleado/trimestre/año, resumen en pantalla y botón de descarga del PDF.


## 2026-08-21 — Precio editable, mano de obra por tiempo, descuentos, forma de pago y trazabilidad de autoría

- **Esquema**: nuevos campos `billingUnit` en `Item` (por unidad / hora / minuto), `discountPercent` en `InvoiceLine`, `paymentMethod` en `Invoice`, y `createdByEmplId` en `Invoice` (con dos relaciones nombradas hacia `Employee` — `InvoiceAttribution` e `InvoiceAuthor` — necesarias porque ahora hay dos vínculos distintos entre los mismos dos modelos). `quantity` en `InvoiceLine` pasa de `Int` a `Decimal` para soportar fracciones de hora (ej. 1.5h de mano de obra).
- **Precio manual y descuentos**: el backend deja de forzar el precio del catálogo — acepta el `unitPrice` que mande el frontend por línea (validando que no sea negativo) y aplica el descuento por línea (`unitPrice × cantidad × (1 - descuento/100)`), útil para casos como regalar un artículo (100% de descuento) al vender otro.
- **Empleado que emite sin re-loguear**: `InvoiceCreate.tsx` incorpora un selector de empleado independiente de la sesión iniciada, con el modal de confirmación por DNI (ya existente) ahora validado contra el empleado elegido en la factura, no contra el de la sesión — pasa a ser el verdadero mecanismo de autorización por factura.
- **Trazabilidad de autoría**: para distinguir "a quién se atribuye la factura" (`emplId`, determina numeración/NIF/cadena de hash) de "quién la ha creado realmente" (`createdByEmplId`), se añadió este segundo campo, tomado siempre de `req.session.emplId` en el servidor — nunca del cuerpo de la petición, para que no se pueda falsear. `InvoiceList.tsx` muestra un aviso "Registrada por..." solo cuando ambos empleados no coinciden, para no ensuciar el caso normal.
- **Branding**: favicon, título de pestaña y metaetiquetas Open Graph (vista previa al compartir el enlace por WhatsApp) actualizados en `index.html`.

**Pendiente**: el desplegable de empleados del informe trimestral de IVA (Dashboard) no carga datos en producción, aunque en local sí — por depurar, parece un problema aislado de esa ruta concreta en el despliegue.


## 2026-08-22 — Corrección de migraciones en producción y mejoras en el PDF de factura

- **Incidente de migraciones**: dos de las migraciones nuevas (`payment_method` y `created_by_empl_id` en `Invoice`) se generaron con la base de datos local recién reseteada (vacía), así que Prisma las creó como columnas `NOT NULL` sin ningún relleno para las filas existentes — funcionaron en local, pero fallaron al aplicarlas en producción (que sí tenía facturas reales), dejando la migración a medio aplicar. Corregido añadiendo un `UPDATE` de relleno antes de exigir `NOT NULL` en ambos archivos de migración, y resuelto el estado de producción con `prisma migrate resolve` + `prisma db execute`, ejecutados manualmente desde la Console del servicio de backend en Railway (es el único sitio desde el que se puede alcanzar la red interna de Postgres).
- **Lección aprendida**: cualquier columna nueva `NOT NULL` sin `@default` es peligrosa si la tabla ya tiene filas en producción — o se le pone un valor por defecto en el propio esquema, o la migración necesita un `UPDATE` de relleno antes del `NOT NULL`. Ya aplicado de forma preventiva en el siguiente cambio.
- **Snapshot de tipo de facturación por línea**: nuevo campo `billingUnit` en `InvoiceLine` (con `@default("unit")`, esta vez sin sobresaltos), para que una factura ya emitida no cambie de significado si el tipo de facturación del artículo del catálogo se modifica después.
- **Mejoras en el PDF de factura**:
  - El emisor ahora muestra el nombre del mecánico/autónomo (ej. "Fernando Moral Vega") como titular, con el taller como dato de dirección — antes aparecía el nombre del taller como titular, lo cual no reflejaba correctamente quién es el emisor fiscal real.
  - Las líneas de mano de obra por tiempo muestran cantidad y precio con su unidad (`1.5 h`, `10.00 €/h`) en vez de números sueltos sin contexto.
  - Las líneas con descuento muestran una etiqueta junto a la descripción (ej. `-100%`).
  - Nueva insignia de "Forma de pago" junto al resumen de totales.
  - Junto al logo, listado de los dos talleres (dirección y teléfono) a modo de aviso comercial, para que el cliente sepa que existen ambas ubicaciones.