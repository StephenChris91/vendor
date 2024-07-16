'use server';


import { db } from '@/prisma/prisma';


export const getAllShops = async () => {
    const shops = await db.shop.findMany()
    
    return shops
}

