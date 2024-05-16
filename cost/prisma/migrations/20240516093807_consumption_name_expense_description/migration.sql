/*
  Warnings:

  - Added the required column `name` to the `Consumption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consumption" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "description" TEXT NOT NULL;
