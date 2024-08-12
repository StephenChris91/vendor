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

  const categoryNames = validInput.data.categories ?? [];

  try {
    // Check if the brand exists, if not create it
    let brand;
    if (validInput.data.brandId) {
      brand = await db.brand.findFirst({
        where: { name: validInput.data.brandId }
      });

      if (!brand) {
        // Create a new brand if it doesn't exist
        brand = await db.brand.create({
          data: {
            name: validInput.data.brandId,
            slug: validInput.data.brandId.toLowerCase().replace(/\s+/g, '-'),
          }
        });
      }
    }

    // Check if categories exist, if not create them
    const categories = await Promise.all(categoryNames.map(async (name) => {
      let category = await db.category.findFirst({ where: { name } });
      if (!category) {
        category = await db.category.create({
          data: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
          }
        });
      }
      return category;
    }));

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
      gallery: validInput.data.gallery,
      ratings: validInput.data.ratings,
      total_reviews: validInput.data.total_reviews,
      my_review: validInput.data.my_review,
      in_wishlist: validInput.data.in_wishlist,
      shop_name: shop.shopName,
      stock: validInput.data.quantity,
      isFlashDeal: validInput.data.isFlashDeal,
      discountPercentage: validInput.data.discountPercentage,
      shop: {
        connect: { id: shop.id },
      },
      categories: {
        create: categories.map(category => ({
          category: { connect: { id: category.id } }
        })),
      },
      user: {
        connect: { id: session.user.id },
      },
    };

    if (brand) {
      productData.brand = {
        connect: { id: brand.id },
      };
    }

    const product = await db.product.create({
      data: productData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        brand: true,
        shop: true,
      },
    });

    revalidatePath('/');
    return { status: 'success', product };
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { status: 'error', message: 'A product with this slug already exists.' };
      }
      return { status: 'error', message: `Database error: ${error.message}` };
    }
    return { status: 'error', message: 'Failed to create product' };
  }
}