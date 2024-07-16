'use server'

// import { categories } from '@/db/categories';
import { ProductType } from "@/app/types/types";
import { db } from "@/prisma/prisma"


export const getAllProducts = async (): Promise<ProductType[]> => {
    try {
      const products = await db.product.findMany({
        include: {
          shop: true,
          categories: true,
        },
      });
  
      if (!products) {
        console.error("No products found");
        return [];
      }
  
      return products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        sale_price: product.sale_price ?? 0,
        sku: product.sku ?? 0,
        quantity: product.quantity ?? 0,
        in_stock: product.in_stock ?? false,
        is_taxable: product.is_taxable ?? false,
        image: product.image ?? "",
        video: product.video ?? "",
        gallery: product.gallery ?? [],
        ratings: product.ratings ?? 0,
        total_reviews: product.total_reviews ?? 0,
        my_review: product.my_review ?? "",
        in_wishlist: product.in_wishlist ?? false,
        categories: product.categories?.map(c => c.id) ?? [], // Map categories to their IDs
        shop_name: product.shop?.shopname ?? "Unknown",
        status: product.status ?? "Unknown",
        product_type: product.product_type ?? "Unknown",
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };


export const getProductById = async (id: string) => {

    const product = await db.product.findUnique({
        where: {
            id
        }
    })

    return product
}

export const deleteProductById = async (id: string) => {

    const product = await db.product.delete({
        where: {
            id
        }
    })

    return product
}