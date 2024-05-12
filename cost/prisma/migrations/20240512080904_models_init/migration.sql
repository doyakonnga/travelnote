-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "memberIds" TEXT[],

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumption" (
    "id" TEXT NOT NULL,
    "isForeign" BOOLEAN NOT NULL DEFAULT true,
    "rate" DOUBLE PRECISION,
    "payingUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "journeyId" TEXT NOT NULL,

    CONSTRAINT "Consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expence" (
    "id" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "consumptionId" TEXT NOT NULL,

    CONSTRAINT "Expence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expence_userId_idx" ON "Expence"("userId");

-- AddForeignKey
ALTER TABLE "Consumption" ADD CONSTRAINT "Consumption_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expence" ADD CONSTRAINT "Expence_consumptionId_fkey" FOREIGN KEY ("consumptionId") REFERENCES "Consumption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
