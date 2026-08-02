-- CreateTable
CREATE TABLE "workshops" (
    "workshop_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("workshop_id")
);

-- CreateTable
CREATE TABLE "employees" (
    "empl_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name_1" TEXT NOT NULL,
    "last_name_2" TEXT NOT NULL,
    "national_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "street_type" TEXT NOT NULL,
    "street_name" TEXT NOT NULL,
    "street_number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("empl_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "customer_id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "street_type" TEXT NOT NULL,
    "street_name" TEXT NOT NULL,
    "street_number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "in_stock" BOOLEAN NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "invoice_id" SERIAL NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "workshop_id" INTEGER NOT NULL,
    "empl_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "current_hash" TEXT NOT NULL,
    "previous_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "corrected_invoice_id" INTEGER,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "invoice_lines" (
    "invoice_line_id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "line_subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "invoice_lines_pkey" PRIMARY KEY ("invoice_line_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workshops_name_key" ON "workshops"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_national_id_key" ON "employees"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_tax_id_key" ON "customers"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "items_name_key" ON "items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_current_hash_key" ON "invoices"("current_hash");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("workshop_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_empl_id_fkey" FOREIGN KEY ("empl_id") REFERENCES "employees"("empl_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
