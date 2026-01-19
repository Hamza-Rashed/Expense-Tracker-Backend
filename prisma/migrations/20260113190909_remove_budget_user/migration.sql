/*
  Warnings:

  - You are about to drop the column `userId` on the `budgets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sanad_cash"."budgets" DROP CONSTRAINT "budgets_userId_fkey";

-- AlterTable
ALTER TABLE "sanad_cash"."budgets" DROP COLUMN "userId";
