-- CreateTable
CREATE TABLE "talleres" (
    "taller_id" SERIAL NOT NULL,
    "nombre_taller" TEXT NOT NULL,
    "dir_taller" TEXT NOT NULL,
    "tel_taller" TEXT NOT NULL,
    "email_taller" TEXT NOT NULL,

    CONSTRAINT "talleres_pkey" PRIMARY KEY ("taller_id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "empl_id" SERIAL NOT NULL,
    "nombre_empl" TEXT NOT NULL,
    "apellido1_empl" TEXT NOT NULL,
    "apellido2_empl" TEXT NOT NULL,
    "dni_empl" TEXT NOT NULL,
    "email_empl" TEXT NOT NULL,
    "password_empl" TEXT NOT NULL,
    "tipo_via_empl" TEXT NOT NULL,
    "nombre_via_empl" TEXT NOT NULL,
    "num_via_empl" TEXT NOT NULL,
    "localidad_empl" TEXT NOT NULL,
    "provincia_empl" TEXT NOT NULL,
    "cp_empl" TEXT NOT NULL,
    "pais_empl" TEXT NOT NULL,
    "activo_empl" BOOLEAN NOT NULL,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("empl_id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "cliente_id" SERIAL NOT NULL,
    "tipo_cliente" TEXT NOT NULL,
    "id_fiscal_cliente" TEXT NOT NULL,
    "nombre_cliente" TEXT NOT NULL,
    "tel_cliente" TEXT NOT NULL,
    "email_cliente" TEXT NOT NULL,
    "tipo_via_cliente" TEXT NOT NULL,
    "nombre_via_cliente" TEXT NOT NULL,
    "num_via_cliente" TEXT NOT NULL,
    "localidad_cliente" TEXT NOT NULL,
    "provincia_cliente" TEXT NOT NULL,
    "cp_cliente" TEXT NOT NULL,
    "pais_cliente" TEXT NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("cliente_id")
);

-- CreateTable
CREATE TABLE "articulos" (
    "articulo_id" SERIAL NOT NULL,
    "nombre_articulo" TEXT NOT NULL,
    "precio_unit_articulo" DECIMAL(10,2) NOT NULL,
    "stock_articulo" BOOLEAN NOT NULL,

    CONSTRAINT "articulos_pkey" PRIMARY KEY ("articulo_id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "factura_id" SERIAL NOT NULL,
    "num_factura" TEXT NOT NULL,
    "taller_id" INTEGER NOT NULL,
    "empl_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "iva_porcentaje" DECIMAL(10,2) NOT NULL,
    "iva_total" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "hash_actual" TEXT NOT NULL,
    "hash_anterior" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fact_rect_id" INTEGER,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("factura_id")
);

-- CreateTable
CREATE TABLE "lineas_facturas" (
    "linea_id" SERIAL NOT NULL,
    "factura_id" INTEGER NOT NULL,
    "articulo_id" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unit" DECIMAL(10,2) NOT NULL,
    "subtotal_linea" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "lineas_facturas_pkey" PRIMARY KEY ("linea_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "talleres_nombre_taller_key" ON "talleres"("nombre_taller");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_dni_empl_key" ON "empleados"("dni_empl");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_email_empl_key" ON "empleados"("email_empl");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_id_fiscal_cliente_key" ON "clientes"("id_fiscal_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "articulos_nombre_articulo_key" ON "articulos"("nombre_articulo");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_num_factura_key" ON "facturas"("num_factura");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_hash_actual_key" ON "facturas"("hash_actual");

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_taller_id_fkey" FOREIGN KEY ("taller_id") REFERENCES "talleres"("taller_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_empl_id_fkey" FOREIGN KEY ("empl_id") REFERENCES "empleados"("empl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("cliente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineas_facturas" ADD CONSTRAINT "lineas_facturas_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("factura_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineas_facturas" ADD CONSTRAINT "lineas_facturas_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "articulos"("articulo_id") ON DELETE RESTRICT ON UPDATE CASCADE;
