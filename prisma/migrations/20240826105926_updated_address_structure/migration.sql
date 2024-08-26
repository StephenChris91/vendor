/*
  Warnings:

  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `shop` table. All the data in the column will be lost.
  - Added the required column `countryCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryName` to the `shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shop" DROP CONSTRAINT "shop_categoryId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "country",
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "stateCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shop" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
