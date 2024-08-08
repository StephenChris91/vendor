'use server'

import { productSchema } from "schemas";
import { revalidatePath } from "next/cache";
import { auth } from "auth";
import { getUserById } from "lib/data/user";
import { Prisma } from "@prisma/client";
import { db } from "../../../../prisma/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response(JSON.stringify({ status: 'error', message: 'User not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await getUserById(session.user.id as string);

  if (!user || (user.role !== 'Vendor' && user.role !== 'Admin')) {
    return new Response(JSON.stringify({ status: 'error', message: 'User not authorized to create a product' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const shop = await db.shop.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!shop) {
    return new Response(JSON.stringify({ status: 'error', message: 'No shop found for the user' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  const validInput = productSchema.safeParse(body);

  if (!validInput.success) {
    console.error("Invalid product data:", validInput.error.errors);
    return new Response(JSON.stringify({ status: 'error', message: 'Invalid product data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const categoryIds = validInput.data.categories ?? [];
  const categories = await db.category.findMany({
    where: { id: { in: categoryIds } }
  });

  if (categories.length !== categoryIds.length) {
    console.error("Some categories not found:", { expected: categoryIds.length, found: categories.length });
    return new Response(JSON.stringify({ status: 'error', message: 'Some categories not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
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

    return new Response(JSON.stringify({ status: 'success', product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ status: 'error', message: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
