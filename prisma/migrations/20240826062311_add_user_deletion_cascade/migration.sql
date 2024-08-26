-- Step 1: Create the new "users" table
CREATE TABLE "users" (
  "id" TEXT NOT NULL
  , "email" TEXT NOT NULL
  , "password" TEXT
  , "firstname" TEXT
  , "lastname" TEXT
  , "role" "userRole" DEFAULT 'Customer'
  , "emailVerified" TIMESTAMP(3)
  , "image" TEXT
  , "name" TEXT
  , "isOnboardedVendor" BOOLEAN NOT NULL DEFAULT false
  , "hasPaid" BOOLEAN NOT NULL DEFAULT false
  , "paymentReference" TEXT
  , "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
  , "updatedAt" TIMESTAMP(3) NOT NULL
  , "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'Pending'
  , CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Step 2: Copy data from "user" to "users"
INSERT INTO
  "users"
SELECT
  *
FROM
  "user";

-- Step 3: Drop foreign key constraints
ALTER TABLE "CustomerAddress"
DROP CONSTRAINT
IF
  EXISTS "CustomerAddress_userId_fkey";
  ALTER TABLE "PaymentMethod"
  DROP CONSTRAINT
  IF
    EXISTS "PaymentMethod_userId_fkey";
    ALTER TABLE "Wishlist"
    DROP CONSTRAINT
    IF
      EXISTS "Wishlist_userId_fkey";
      ALTER TABLE "account"
      DROP CONSTRAINT
      IF
        EXISTS "account_userId_fkey";
        ALTER TABLE "avatar"
        DROP CONSTRAINT
        IF
          EXISTS "avatar_userId_fkey";
          ALTER TABLE "cart"
          DROP CONSTRAINT
          IF
            EXISTS "cart_userId_fkey";
            ALTER TABLE "order"
            DROP CONSTRAINT
            IF
              EXISTS "order_userId_fkey";
              ALTER TABLE "product"
              DROP CONSTRAINT
              IF
                EXISTS "product_user_id_fkey";
                ALTER TABLE "shop"
                DROP CONSTRAINT
                IF
                  EXISTS "shop_userId_fkey";

                  -- Step 4: Drop the old "user" table
                  DROP TABLE "user";

                  -- Step 5: Create unique index on email in "users" table
                  CREATE UNIQUE INDEX "users_email_key"
                  ON "users"("email");

                  -- Step 6: Add new foreign key constraints
                  ALTER TABLE "CustomerAddress"
                  ADD CONSTRAINT "CustomerAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "PaymentMethod"
                  ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "Wishlist"
                  ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "account"
                  ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "avatar"
                  ADD CONSTRAINT "avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "shop"
                  ADD CONSTRAINT "shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "product"
                  ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "order"
                  ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE;
                  ALTER TABLE "cart"
                  ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id")
                  ON DELETE CASCADE
                  ON
                  UPDATE
                    CASCADE