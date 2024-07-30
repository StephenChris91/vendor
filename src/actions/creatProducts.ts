'use server'

import { productSchema } from "schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "auth";
import { getUserById } from "lib/data/user";
import { db } from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

export async function createProduct(values: z.infer<typeof productSchema>) {
  const session = await auth();

  if (!session?.user) {
    return { status: 'error', message: 'User not authenticated' };
  }

  const user = await getUserById(session.user.id as string);

  if (!user || (user.role !== 'Vendor' && user.role !== 'Admin')) {
    return { status: 'error', message: 'User not authorized to create a product' };
  }

  const shop = await db.shop.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!shop) {
    return { status: 'error', message: 'No shop found for the user' };
  }

  const validInput = productSchema.safeParse(values);

  if (!validInput.success) {
    console.error("Invalid product data:", validInput.error.errors);
    return { status: 'error', message: 'Invalid product data' };
  }

  const categoryIds = validInput.data.categories ?? [];
  const categories = await db.category.findMany({
    where: { id: { in: categoryIds } }
  });

  if (categories.length !== categoryIds.length) {
    console.error("Some categories not found:", { expected: categoryIds.length, found: categories.length });
    return { status: 'error', message: 'Some categories not found' };
  }

  try {
    const productData: Prisma.productCreateInput = {
      name: validInput.data.name,
      slug: validInput.data.slug,
      description: validInput.data.description,
      price: validInput.data.price,
      sale_price: validInput.data.sale_price,
      sku: validInput.data.sku,
      quantity: validInput.data.quantity,
      in_stock: validInput.data.in_stock,
      is_taxable: validInput.data.is_taxable,
      status: validInput.data.status,
      product_type: validInput.data.product_type,
      image: validInput.data.image,
      video: validInput.data.video,
      gallery: validInput.data.gallery,
      ratings: validInput.data.ratings,
      total_reviews: validInput.data.total_reviews,
      my_review: validInput.data.my_review,
      in_wishlist: validInput.data.in_wishlist,
      shop_name: validInput.data.shop_name,
      shop: {
        connect: { id: shop.id },
      },
      categories: {
        connect: categoryIds.map(id => ({ id })),
      },
      user: {
        connect: { id: session.user.id },
      },
    };

    const product = await db.product.create({
      data: productData,
    });

    revalidatePath('/');
    return { status: 'success', product };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Failed to create product' };
  }
}