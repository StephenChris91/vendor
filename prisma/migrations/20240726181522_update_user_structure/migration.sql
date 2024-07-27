-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('Pending', 'Processing', 'Complete');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'Pending';
