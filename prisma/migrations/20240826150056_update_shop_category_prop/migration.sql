/*
  Warnings:

  - You are about to drop the column `categoryName` on the `shop` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "shop" DROP CONSTRAINT "shop_categoryName_fkey";

-- AlterTable
ALTER TABLE "shop" DROP COLUMN "categoryName",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "categoryId" TEXT;
