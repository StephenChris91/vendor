import { NextRequest, NextResponse } from 'next/server';
import { productSchema } from '@/app/schemas';
import { db } from '@/prisma/prisma';
import { z } from 'zod';
import { getUserByEmail, getUserById } from '@/lib/data/user';
import { useCurrentSession } from '@/lib/use-session-server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const session = await useCurrentSession();
    // const vendor = getUserById(session?.user.id)
    if (!session?.user) {
      return NextResponse.json({ status: 'error', message: 'User not authenticated' }, { status: 401 });
    }

    const user = await getUserById(session.user.id as string);

    if (!user || (user.role !== 'Vendor' && user.role !== 'Admin')) {
      return NextResponse.json({ status: 'error', message: 'User not authorized to create a product' }, { status: 403 });
    }

    const shop = await db.shop.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!shop) {
      return NextResponse.json({ status: 'error', message: 'No shop found for the user' }, { status: 404 });
    }

    const body = await req.json();
    const validInput = productSchema.safeParse(body);

    if (!validInput.success) {
      return NextResponse.json({ status: 'error', message: 'Invalid product data', errors: validInput.error.errors }, { status: 400 });
    }

    const productData = {
      ...validInput.data,
    //   user: user,
    //   author_id: user.id,
    // user: {
    //     connect: { user: user.id}
    // },
      shop: {
        connect: { id: shop.id },
      },
      categories: {
        connect: validInput.data.categories?.map(id => ({ id })) ?? [],
      },
      image: validInput.data.image ?? undefined, // Ensure image is either provided or explicitly set to undefined
    };

    const product = await db.product.create({
      data: productData,
    });

    if(product){
      revalidatePath('/dashboard/all-products')
    }

    // if (validInput.data.image) {
    //   await db.image.create({
    //     data: {
    //       url: validInput.data.image,
    //       product: {
    //         connect: { id: product.id },
    //       },
    //     },
    //   });
    // }

    // if (validInput.data.gallery && validInput.data.gallery.length > 0) {
    //   const galleryImages = validInput.data.gallery.map(url => ({ url }));
    //   await db.gallery.create({
    //     data: {
    //       product: {
    //         connect: { id: product.id },
    //       },
    //       Image: {
    //         create: galleryImages,
    //       },
    //     },
    //   });
    // }

    return NextResponse.json({ status: 'success', product }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: 'Failed to create product' }, { status: 500 });
  }
}
