/*
  Warnings:

  - Added the required column `created_by_empl_id` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: añadimos la columna sin NOT NULL todavía, para poder rellenar las filas existentes
ALTER TABLE "invoices" ADD COLUMN     "created_by_empl_id" INTEGER;

-- Backfill: en las facturas creadas antes de que existiera este campo, asumimos que quien la creó
-- es el mismo empleado al que se atribuye (no existía todavía la posibilidad de elegir otro)
UPDATE "invoices" SET "created_by_empl_id" = "empl_id" WHERE "created_by_empl_id" IS NULL;

-- Ahora que todas las filas tienen valor, exigimos que no pueda quedar vacío nunca más
ALTER TABLE "invoices" ALTER COLUMN "created_by_empl_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_created_by_empl_id_fkey" FOREIGN KEY ("created_by_empl_id") REFERENCES "employees"("empl_id") ON DELETE RESTRICT ON UPDATE CASCADE;
