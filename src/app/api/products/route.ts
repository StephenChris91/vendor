import { getAllProducts } from '@/actions/products';
import { db } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
; // Replace with actual function to fetch products from your database

export async function GET(req: NextRequest) {
  try {
    const products = await db.product.findMany(
        {include: {categories: true, shop: true} }
    );
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}
