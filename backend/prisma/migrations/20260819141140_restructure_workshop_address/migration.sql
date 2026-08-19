/*
  Warnings:

  - You are about to drop the column `address` on the `workshops` table. All the data in the column will be lost.
  - Added the required column `city` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_name` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_number` to the `workshops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street_type` to the `workshops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workshops" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "street_name" TEXT NOT NULL,
ADD COLUMN     "street_number" TEXT NOT NULL,
ADD COLUMN     "street_type" TEXT NOT NULL;
