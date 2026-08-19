# Modelo de datos — Motos Benito

Diagrama entidad-relación del núcleo de facturación: talleres, empleados, clientes, artículos y facturas (con sus líneas).

## Decisiones clave

- La numeración de factura (`invoice_number`) y el encadenado de hash (Veri*Factu) son independientes **por empleado**, ya que Fernando y David son autónomos distintos, sin CIF de empresa conjunta — cada uno tributa de forma independiente ante Hacienda.
- Cada línea de factura guarda una copia congelada (*snapshot*) del nombre, precio unitario e IVA vigentes en el momento de facturar, en lugar de leerlos en vivo desde `items`. Así, si cambia el precio de un artículo o el % de IVA legal en el futuro, las facturas ya emitidas no se ven alteradas retroactivamente.
- `workshops` no tiene identidad fiscal propia — son solo los dos puntos físicos donde se presta el servicio (Aranjuez y Colmenar de Oreja). El dato fiscal (DNI, domicilio fiscal) vive en `employees`, porque es quien legalmente emite cada factura.
- Los campos monetarios usan `decimal`, no `float`/`double`, para evitar errores de redondeo en importes reales.

## Diagrama

```mermaid
erDiagram
    WORKSHOPS ||--o{ INVOICES
    WORKSHOPS {
        int workshop_id PK
        string name
        string street_type
        string street_name
        string street_number
        string city
        string province
        string postal_code
        string country
        string phone
        string email
    }

    EMPLOYEES ||--o{ INVOICES : "emite"
    EMPLOYEES {
        int empl_id PK
        string name
        string last_name_1
        string last_name_2
        string national_id
        string email
        string password
        string street_type
        string street_name
        string street_number
        string city
        string province
        string postal_code
        string country
        boolean active
    }

    CUSTOMERS ||--o{ INVOICES
    CUSTOMERS {
        int customer_id PK
        string type
        string tax_id
        string name
        string phone
        string email
        string street_type
        string street_name
        string street_number
        string city
        string province
        string postal_code
        string country
    }

    ITEMS ||--o{ INVOICE_LINES
    ITEMS {
        int item_id PK
        string name
        decimal unit_price
        boolean in_stock
    }

    INVOICES ||--o{ INVOICE_LINES
    INVOICES {
        int invoice_id PK
        string invoice_number
        int workshop_id FK
        int empl_id FK
        int customer_id FK
        string issue_date
        decimal subtotal
        decimal tax_rate
        decimal tax_amount
        decimal total
        string current_hash
        string previous_hash
        string status
        int corrected_invoice_id
    }

    INVOICE_LINES {
        int invoice_line_id PK
        int invoice_id FK
        int item_id FK
        string description
        int quantity
        decimal unit_price
        decimal line_subtotal
    }
```