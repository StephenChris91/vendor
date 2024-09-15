import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';

export async function GET(req: NextRequest) {
  try {
    const products = await db.product.findMany(
      { include: { categories: true, shop: true, orderItems: true } }
    );

    console.log(products);

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}