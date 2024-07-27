-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "ShopSettings" ALTER COLUMN "businessHours" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shop" ADD COLUMN     "status" "ShopStatus" NOT NULL DEFAULT 'Pending';
