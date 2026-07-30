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
        string nombre_taller
        string dir_taller
        string tel_taller
        string email_taller
    }

    EMPLEADOS ||--o{ FACTURAS : "emite"
    EMPLEADOS {
        int empleado_id PK
        string nombre
        string apellido1_empl
        string apellido2_empl
        string dni_empl
        string email_empl
        string password_empl
        string tipo_via_empl
        string nombre_via_empl
        string num_via_empl
        string localidad_empl
        string provincia_empl
        string cp_empl
        string pais_empl
        boolean activo_empl
    }

    CLIENTES ||--o{ FACTURAS
    CLIENTES {
        int cliente_id PK
        string tipo_cliente
        string id_fiscal_cliente
        string nombre_cliente
        string tel_cliente
        string email_cliente
        string tipo_via_cliente
        string nombre_via_cliente
        string num_via_cliente
        string localidad_cliente
        string provincia_cliente
        string cp_cliente
        string pais_cliente
    }

    ARTICULOS ||--o{ LINEAS_FACTURA
    ARTICULOS {
        int articulo_id PK
        string nombre_articulo
        decimal precio_unit_articulo
        boolean stock_articulo
    }

    FACTURAS ||--o{ LINEAS_FACTURA
    FACTURAS {
        int factura_id PK
        string num_factura
        int taller_id FK
        int empl_id FK
        int cliente_id FK
        string fecha_emision
        decimal subtotal
        decimal iva_porcentaje
        decimal iva_total
        decimal total
        string hash_actual
        string hash_anterior
        string estado
        int fact_rect_id
    }

    LINEAS_FACTURA {
        int linea_id PK
        int factura_id FK
        int articulo_id FK
        string descripcion
        int cantidad
        decimal precio_unit
        decimal subtotal_linea
    }
```