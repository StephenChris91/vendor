/*
  Warnings:

  - You are about to drop the column `accountNo` on the `PaymentInfo` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `PaymentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShopSettings" DROP CONSTRAINT "ShopSettings_shopId_fkey";

-- DropForeignKey
ALTER TABLE "shop" DROP CONSTRAINT "shop_userId_fkey";

-- AlterTable
ALTER TABLE "PaymentInfo" DROP COLUMN "accountNo",
ADD COLUMN     "accountNumber" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopSettings" ADD CONSTRAINT "ShopSettings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
