/*
   Warnings:
   
   - You are about to drop the column `gallery_id` on the `product` table. All the data in the column will be lost.
   - You are about to drop the column `image_id` on the `product` table. All the data in the column will be lost.
   - You are about to drop the column `accountName` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `accountNo` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `address` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `bankName` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `city` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `country` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `phoneNumber` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `profileId` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `shopname` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `state` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `website` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the column `zip` on the `shop` table. All the data in the column will be lost.
   - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
   - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
   - A unique constraint covering the columns `[slug]` on the table `shop` will be added. If there are existing duplicate values, this will fail.
   - Made the column `description` on table `shop` required. This step will fail if there are existing NULL values in that column.
   - Made the column `slug` on table `shop` required. This step will fail if there are existing NULL values in that column.
   - Made the column `userId` on table `shop` required. This step will fail if there are existing NULL values in that column.
   
   */
-- DropForeignKey
ALTER TABLE "profile"
DROP CONSTRAINT "profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "shop"
DROP CONSTRAINT "shop_profileId_fkey";

-- DropForeignKey
ALTER TABLE "shop"
DROP CONSTRAINT "shop_userId_fkey";

-- DropIndex
DROP INDEX "shop_profileId_key";

-- AlterTable
ALTER TABLE "avatar"
ALTER COLUMN "updatedAt"
DROP DEFAULT;

-- AlterTable
ALTER TABLE "product"
DROP COLUMN "gallery_id"
, DROP COLUMN "image_id";

-- AlterTable
ALTER TABLE "shop"
DROP COLUMN "accountName"
, DROP COLUMN "accountNo"
, DROP COLUMN "address"
, DROP COLUMN "bankName"
, DROP COLUMN "city"
, DROP COLUMN "country"
, DROP COLUMN "phoneNumber"
, DROP COLUMN "profileId"
, DROP COLUMN "shopname"
, DROP COLUMN "state"
, DROP COLUMN "website"
, DROP COLUMN "zip"
, ADD COLUMN "shopName" TEXT NOT NULL DEFAULT 'My Shop'
, ALTER COLUMN "description"
SET NOT NULL, ALTER COLUMN "description"
SET DEFAULT '', ALTER COLUMN "logo"
SET DEFAULT '', ALTER COLUMN "banner"
SET DEFAULT '', ALTER COLUMN "slug"
SET NOT NULL, ALTER COLUMN "updatedAt"
DROP DEFAULT
, ALTER COLUMN "userId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "user"
ALTER COLUMN "hasPaid"
SET DEFAULT false, ALTER COLUMN "updatedAt"
DROP DEFAULT;

-- prisma/migrations/[timestamp]_handle_null_values.sql

-- Update existing NULL values for isOnboardedVendor
UPDATE
  "user"
SET "isOnboardedVendor" = false
WHERE
  "isOnboardedVendor" IS NULL;

-- Update existing NULL values for hasPaid
UPDATE
  "user"
SET "hasPaid" = false
WHERE
  "hasPaid" IS NULL;

-- Now make the columns required
ALTER TABLE "user"
ALTER COLUMN "isOnboardedVendor"
SET NOT NULL;
ALTER TABLE "user"
ALTER COLUMN "hasPaid"
SET NOT NULL;

-- DropTable
DROP TABLE "image";

-- DropTable
DROP TABLE "profile";

-- CreateTable
CREATE TABLE "Address" (
  "id" TEXT NOT NULL
  , "street" TEXT NOT NULL
  , "city" TEXT NOT NULL
  , "state" TEXT NOT NULL
  , "postalCode" TEXT NOT NULL
  , "country" TEXT NOT NULL
  , "shopId" TEXT NOT NULL
  , CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentInfo" (
  "id" TEXT NOT NULL
  , "accountName" TEXT NOT NULL
  , "accountNo" TEXT NOT NULL
  , "bankName" TEXT NOT NULL
  , "shopId" TEXT NOT NULL
  , CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopSettings" (
  "id" TEXT NOT NULL
  , "phoneNumber" TEXT NOT NULL
  , "website" TEXT NOT NULL
  , "businessHours" TEXT NOT NULL
  , "category" TEXT NOT NULL
  , "deliveryOptions" TEXT []
  , "isActive" BOOLEAN NOT NULL DEFAULT true
  , "shopId" TEXT NOT NULL
  , CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_shopId_key"
ON "Address"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo_shopId_key"
ON "PaymentInfo"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettings_shopId_key"
ON "ShopSettings"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "shop_slug_key"
ON "shop"("slug");

-- AddForeignKey
ALTER TABLE "shop"
ADD CONSTRAINT "shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE RESTRICT
ON
UPDATE
  CASCADE;

-- AddForeignKey
ALTER TABLE "Address"
ADD CONSTRAINT "Address_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id")
ON DELETE RESTRICT
ON
UPDATE
  CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentInfo"
ADD CONSTRAINT "PaymentInfo_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id")
ON DELETE RESTRICT
ON
UPDATE
  CASCADE;

-- AddForeignKey
ALTER TABLE "ShopSettings"
ADD CONSTRAINT "ShopSettings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id")
ON DELETE RESTRICT
ON
UPDATE
  CASCADE;