/*
  Warnings:

  - You are about to drop the column `margensId` on the `Matricula` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "ultimaConsulta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Matricula" DROP COLUMN "margensId";
