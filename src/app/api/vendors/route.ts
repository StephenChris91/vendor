
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';
; // Replace with actual function to fetch products from your database

export async function GET(req: NextRequest) {
  try {
    const products = await db.shop.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}
