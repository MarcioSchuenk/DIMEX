/*
  Warnings:

  - You are about to drop the column `data` on the `Sobras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sobras" DROP COLUMN "data",
ADD COLUMN     "onde_qual" TEXT,
ADD COLUMN     "quadrante" TEXT,
ALTER COLUMN "pedido_cancelado" SET DATA TYPE TEXT;
