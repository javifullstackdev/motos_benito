# Sistema de diseño — Motos Benito

Referencia rápida de los colores, tipografía y componentes reutilizables usados en el frontend, para mantener consistencia visual al añadir pantallas nuevas.

## Paleta de colores

| Uso | Clase Tailwind | Descripción |
|---|---|---|
| Fondo de página / tarjetas | `bg-neutral-950`, `bg-neutral-900/85` | Fondos oscuros con transparencia para el efecto "glassmorphism" |
| Bordes | `border-neutral-800` | Borde estándar en tarjetas, inputs y separadores |
| Texto principal | `text-white`, `text-neutral-100` | Títulos y texto de alto contraste |
| Texto secundario | `text-neutral-400`, `text-neutral-500` | Subtítulos, ayudas, texto de menor jerarquía |
| Acento de marca | `orange-500` / `orange-600` | Color principal de la marca — botones primarios, enlaces activos, acentos |
| Éxito | `emerald-400` / `emerald-500` | Confirmaciones, estados "disponible/activo" |
| Peligro | `red-500` / `red-600` | Errores, acciones destructivas (borrar) |

## Tipografía

- **Fuente base**: la que trae Tailwind por defecto (sans-serif del sistema) en la interfaz de la app.
- **Fuente monoespaciada** (`font-mono`): reservada para datos "de máquina" — números de factura, NIF/CIF, precios, códigos postales. Ayuda a que estos datos se distingan visualmente del texto normal.
- **Etiquetas de formulario**: siempre `text-base font-bold uppercase tracking-wider text-neutral-300` (ver `FormLabel`).
- **Títulos de página**: `text-2xl font-extrabold tracking-tight text-white uppercase`.

## Componentes reutilizables

Todos viven en `frontend/src/components/ui/`.

### `Card`
Contenedor con el estilo "dark glassmorphism" (fondo oscuro semitransparente, borde sutil, sombra) y una barra de acento en degradado en el borde superior.

```tsx
<Card accent="orange" className="p-6 sm:p-9">
  {/* contenido */}
</Card>
```
- `accent`: `"orange"` (por defecto) / `"red"` / `"emerald"` — color de la barra superior.
- `className`: para el padding, que varía según la pantalla (no está fijado dentro del componente).

### `FormLabel`
Etiqueta de campo de formulario, estandarizada en mayúsculas.

```tsx
<FormLabel htmlFor="name">Nombre completo *</FormLabel>
```

### `TextInput` / `Select`
Versiones estilizadas de `<input>` y `<select>` nativos. Aceptan todos los atributos HTML normales (`value`, `onChange`, `type`, `required`, `placeholder`, `list`, etc.) porque extienden los tipos nativos de React.

```tsx
<TextInput type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="font-mono" />

<Select name="type" value={formData.type} onChange={handleChange}>
  <option value="particular">Particular</option>
</Select>
```
- `className` se **añade** a las clases base (no las sustituye) — úsalo para variantes puntuales como `font-mono` o para dejar hueco a un icono (`pr-10`).

### `Button`
Botón con tres variantes y estado de carga integrado (spinner + texto alternativo).

```tsx
<Button type="submit" isLoading={isLoading} loadingText="Guardando...">
  Guardar
</Button>

<Button variant="danger" onClick={handleDelete}>Eliminar</Button>
<Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
```
- `variant`: `"primary"` (naranja, por defecto) / `"secondary"` (neutro, con borde) / `"danger"` (rojo).
- No se usa para enlaces de navegación (`<Link>` de React Router) — esos mantienen su propio estilo escrito a mano cuando necesitan parecerse a un botón secundario, ya que `Button` renderiza un `<button>` real.

### `Alert`
Aviso de error o éxito, con icono.

```tsx
{error && <Alert variant="error">{error}</Alert>}
{successMessage && <Alert variant="success">{successMessage}</Alert>}
```

### `Badge`
Insignia pequeña en forma de píldora, con un punto de color opcional — usada para etiquetas de estado o contexto ("Ficha de Cliente", "Emisión Completada").

```tsx
<Badge color="orange" withDot>Ficha de Cliente</Badge>
```
- `color`: `"orange"` (por defecto) / `"emerald"` / `"neutral"`.
- `withDot`: añade el puntito de color delante del texto.

## Qué se dejó fuera del sistema (a propósito)

No todo se migró a componentes — algunos elementos son demasiado específicos o puntuales como para justificar una abstracción:
- El checkbox de "en stock" (interruptor visual, distinto de un input de texto).
- Botones pequeños de utilidad sin texto o con iconos sueltos (añadir línea, quitar línea en la factura).
- Los enlaces `<Link>` con apariencia de botón secundario (necesitan navegar, no enviar un formulario).

Si un patrón de estos empieza a repetirse en 3 o más sitios, es buena señal de que merece su propio componente — de momento, tres líneas parecidas no justifican una abstracción nueva.
