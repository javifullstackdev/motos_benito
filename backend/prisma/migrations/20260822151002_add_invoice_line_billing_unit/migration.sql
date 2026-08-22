-- AlterTable
ALTER TABLE "invoice_lines" ADD COLUMN     "billing_unit" TEXT NOT NULL DEFAULT 'unit';
