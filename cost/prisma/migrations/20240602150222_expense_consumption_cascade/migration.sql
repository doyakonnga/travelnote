-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_consumptionId_fkey";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_consumptionId_fkey" FOREIGN KEY ("consumptionId") REFERENCES "Consumption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
