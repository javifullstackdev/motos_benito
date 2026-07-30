# Modelo de datos — Motos Benito

Diagrama entidad-relación del núcleo de facturación: talleres, empleados, clientes, artículos y facturas (con sus líneas).

## Decisiones clave

- La numeración de factura (`numero_factura`) y el encadenado de hash (Veri*Factu) son independientes **por empleado**, ya que Fernando y David son autónomos distintos, sin CIF de empresa conjunta — cada uno tributa de forma independiente ante Hacienda.
- Cada línea de factura guarda una copia congelada (*snapshot*) del nombre, precio unitario e IVA vigentes en el momento de facturar, en lugar de leerlos en vivo desde `articulos`. Así, si cambia el precio de un artículo o el % de IVA legal en el futuro, las facturas ya emitidas no se ven alteradas retroactivamente.
- `talleres` no tiene identidad fiscal propia — son solo los dos puntos físicos donde se presta el servicio (Aranjuez y Colmenar de Oreja). El dato fiscal (DNI, domicilio fiscal) vive en `empleados`, porque es quien legalmente emite cada factura.
- Los campos monetarios usan `decimal`, no `float`/`double`, para evitar errores de redondeo en importes reales.

## Diagrama

```mermaid
erDiagram
    TALLERES ||--o{ FACTURAS
    TALLERES {
        int taller_id PK
        string nombre
        string direccion
        string telefono
        string email
    }

    EMPLEADOS ||--o{ FACTURAS : "emite"
    EMPLEADOS {
        int empleado_id PK
        string nombre
        string apellido1
        string apellido2
        string dni
        string email
        string password
        string tipo_via_fiscal
        string nombre_via_fiscal
        string numero_via_fiscal
        string localidad_fiscal
        string provincia_fiscal
        int cp_fiscal
        string pais_fiscal
        boolean activo
    }

    CLIENTES ||--o{ FACTURAS
    CLIENTES {
        int cliente_id PK
        string tipo_cliente
        string identificador_fiscal
        string nombre
        string telefono
        string email
        string direccion_tipo_via
        string direccion_nombre_via
        string direccion_numero
        string direccion_localidad
        string direccion_provincia
        int direccion_cp
        string direccion_pais
    }

    ARTICULOS ||--o{ LINEAS_FACTURA
    ARTICULOS {
        int articulo_id PK
        string nombre
        decimal precio_unitario
        boolean stock
    }

    FACTURAS ||--o{ LINEAS_FACTURA
    FACTURAS {
        int factura_id PK
        string numero_factura
        int taller_id FK
        int empleado_id FK
        int cliente_id FK
        string fecha_emision
        decimal subtotal
        int iva_porcentaje
        decimal iva_total
        decimal total
        string hash_actual
        string hash_anterior
        string estado
        int factura_rectificada_id
    }

    LINEAS_FACTURA {
        int linea_id PK
        int factura_id FK
        int articulo_id FK
        string descripcion
        int cantidad
        decimal precio_unitario
        decimal subtotal_linea
    }
```