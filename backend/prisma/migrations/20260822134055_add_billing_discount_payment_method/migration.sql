/*
  Warnings:

  - You are about to alter the column `quantity` on the `invoice_lines` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - Added the required column `payment_method` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_lines" ADD COLUMN     "discount_percent" DECIMAL(5,2) NOT NULL DEFAULT 0,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "payment_method" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "billing_unit" TEXT NOT NULL DEFAULT 'unit';
