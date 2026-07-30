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