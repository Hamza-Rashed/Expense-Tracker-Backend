/*
  Warnings:

  - Added the required column `userId` to the `budgets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sanad_cash"."budgets" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "sanad_cash"."budgets" ADD CONSTRAINT "budgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sanad_cash"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
