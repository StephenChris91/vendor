/*
  Warnings:

  - You are about to drop the column `video` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `_categoryToproduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_categoryToproduct" DROP CONSTRAINT "_categoryToproduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_categoryToproduct" DROP CONSTRAINT "_categoryToproduct_B_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "video",
ADD COLUMN     "brandId" TEXT;

-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_categoryToproduct";

-- CreateTable
CREATE TABLE "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId","categoryId")
);

-- AddForeignKey
ALTER TABLE "shop" ADD CONSTRAINT "shop_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
