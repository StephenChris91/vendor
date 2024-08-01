"use server"
import { db } from '../../../prisma/prisma';
// app/actions/getWishlist.ts

import { useCurrentSession } from './../../lib/use-session-server';

export async function getWishlist() {
  try {
    const session = await useCurrentSession();

    if (!session || !session.user || !session.user.id) {
      return { error: 'User not authenticated' };
    }

    const wishlistItems = await db.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    });

    return {
      wishlist: wishlistItems.map(item => ({
        id: item.id,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          image: item.product.image || '',
          rating: item.product.ratings || 0,
          discount: item.product.sale_price ?
            Math.round(((item.product.price - item.product.sale_price) / item.product.price) * 100) : 0,
          // Assuming 'gallery' is an array of image URLs
          images: item.product.gallery || [item.product.image || ''],
        },
      })),
    };
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return { error: 'Failed to fetch wishlist' };
  }
}