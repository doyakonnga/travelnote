/*
  Warnings:

  - A unique constraint covering the columns `[name,journeyId]` on the table `Album` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Album_name_journeyId_key" ON "Album"("name", "journeyId");
