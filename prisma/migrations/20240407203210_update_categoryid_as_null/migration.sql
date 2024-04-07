-- DropForeignKey
ALTER TABLE "monthly_transactions" DROP CONSTRAINT "monthly_transactions_categoryId_fkey";

-- AlterTable
ALTER TABLE "monthly_transactions" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "monthly_transactions" ADD CONSTRAINT "monthly_transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
