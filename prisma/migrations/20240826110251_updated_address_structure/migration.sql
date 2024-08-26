/*
  Warnings:

  - You are about to drop the column `countryCode` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `stateCode` on the `Address` table. All the data in the column will be lost.
  - Added the required column `country` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "countryCode",
DROP COLUMN "stateCode",
ADD COLUMN     "country" TEXT NOT NULL;
