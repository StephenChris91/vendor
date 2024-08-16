// prisma/seed.mjs
import {
  PrismaClient,
  userRole,
  ProductStatus,
  ProductType,
  orderStatus,
  VerificationStatus,
  ShopStatus,
} from "@prisma/client";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: await hash("adminpassword", 10),
      firstname: "Admin",
      lastname: "User",
      role: userRole.Admin,
      emailVerified: new Date(),
      verificationStatus: VerificationStatus.Complete,
      hasPaid: true,
    },
  });

  const vendorUser = await prisma.user.create({
    data: {
      email: "vendor@example.com",
      password: await hash("vendorpassword", 10),
      firstname: "Vendor",
      lastname: "User",
      role: userRole.Vendor,
      emailVerified: new Date(),
      verificationStatus: VerificationStatus.Complete,
      isOnboardedVendor: true,
      hasPaid: true,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "customer@example.com",
      password: await hash("customerpassword", 10),
      firstname: "Customer",
      lastname: "User",
      role: userRole.Customer,
      emailVerified: new Date(),
      verificationStatus: VerificationStatus.Complete,
      hasPaid: false,
    },
  });

  // Create a shop category
  const shopCategory = await prisma.category.create({
    data: {
      name: "General",
      slug: "general",
    },
  });

  // Create a shop for the vendor
  const shop = await prisma.shop.create({
    data: {
      shopName: "Vendor's Shop",
      description: "A great shop with amazing products",
      userId: vendorUser.id,
      slug: "vendors-shop",
      status: ShopStatus.Approved,
      categoryId: shopCategory.id,
    },
  });

  // Create product categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.create({ data: { name: "Clothing", slug: "clothing" } }),
    prisma.category.create({ data: { name: "Books", slug: "books" } }),
  ]);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Smartphone",
        slug: "smartphone",
        description: "A high-end smartphone",
        price: 99900, // $999.00
        sale_price: 89900, // $899.00
        quantity: 50,
        in_stock: true,
        is_taxable: true,
        status: ProductStatus.Published,
        product_type: ProductType.Simple,
        user_id: vendorUser.id,
        shop_id: shop.id,
        categories: {
          create: [
            { categoryId: categories[0].id }, // Electronics
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "T-Shirt",
        slug: "t-shirt",
        description: "A comfortable cotton t-shirt",
        price: 1999, // $19.99
        sale_price: 1499, // $14.99
        quantity: 100,
        in_stock: true,
        is_taxable: true,
        status: ProductStatus.Published,
        product_type: ProductType.Variable,
        user_id: vendorUser.id,
        shop_id: shop.id,
        categories: {
          create: [
            { categoryId: categories[1].id }, // Clothing
          ],
        },
      },
    }),
  ]);

  // Create an order for the customer
  const order = await prisma.order.create({
    data: {
      status: orderStatus.Pending,
      subtotal: 100798, // $1007.98
      tax: 1101, // $11.01
      shippingCost: 1000, // $10.00
      totalPrice: 101899, // $1018.99
      userId: customerUser.id,
      shopId: shop.id,
      paymentMethod: "Credit Card",
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 99900, // $999.00
            name: "Smartphone",
            sku: "SKU-0001",
          },
          {
            productId: products[1].id,
            quantity: 2,
            price: 1499, // $14.99 each
            name: "T-Shirt",
            sku: "SKU-0002",
          },
        ],
      },
      shippingAddress: {
        create: {
          name: "Customer User",
          street: "123 Main St",
          city: "Anytown",
          state: "Anystate",
          zipCode: "12345",
          country: "USA",
          phone: "555-555-5555",
        },
      },
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
