'use server'

import { category, shop, user } from "@prisma/client";
import { db } from "../../prisma/prisma";

// Define a type for the returned product
type ProductWithDetails = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  sku: number;
  quantity: number;
  in_stock: boolean;
  is_taxable: boolean;
  image: string;
  video: string;
  gallery: string[];
  ratings: number;
  total_reviews: number;
  my_review: string;
  in_wishlist: boolean;
  categories: category[]; // List of Category objects
  shop_name: string;
  status: 'Published' | 'Draft' | 'Suspended' | 'OutOfStock';
  product_type: 'Simple' | 'Variable';
};

// Get all products
export const getAllProducts = async (): Promise<ProductWithDetails[]> => {
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
      quantity: product.quantity,
      in_stock: product.in_stock ?? false,
      is_taxable: product.is_taxable ?? false,
      image: product.image ?? "",
      video: product.video ?? "",
      gallery: product.gallery ?? [],
      ratings: product.ratings ?? 0,
      total_reviews: product.total_reviews ?? 0,
      my_review: product.my_review ?? "",
      in_wishlist: product.in_wishlist ?? false,
      categories: product.categories ?? [], // Directly use categories as Category[]
      shop_name: product.shop?.shopName ?? "Unknown",
      status: product.status as 'Published' | 'Draft' | 'Suspended' | 'OutOfStock',
      product_type: product.product_type as 'Simple' | 'Variable',
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get a product by ID
export const getProductById = async (id: string): Promise<ProductWithDetails | null> => {
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        shop: true,
        categories: true,
      },
    });

    if (!product) {
      console.error(`Product with ID ${id} not found`);
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price ?? 0,
      sku: product.sku ?? 0,
      quantity: product.quantity,
      in_stock: product.in_stock ?? false,
      is_taxable: product.is_taxable ?? false,
      image: product.image ?? "",
      video: product.video ?? "",
      gallery: product.gallery ?? [],
      ratings: product.ratings ?? 0,
      total_reviews: product.total_reviews ?? 0,
      my_review: product.my_review ?? "",
      in_wishlist: product.in_wishlist ?? false,
      categories: product.categories ?? [], // Directly use categories as Category[]
      shop_name: product.shop?.shopName ?? "Unknown",
      status: product.status as 'Published' | 'Draft' | 'Suspended' | 'OutOfStock',
      product_type: product.product_type as 'Simple' | 'Variable',
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Delete a product by ID
export const deleteProductById = async (id: string): Promise<ProductWithDetails | null> => {
  try {
    // Fetch the product by ID
    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        shop: true,
        categories: true,
      },
    });

    if (!product) {
      console.error(`Product with ID ${id} not found`);
      return null;
    }

    // Store the necessary details
    const productDetails: ProductWithDetails = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price ?? 0,
      sku: product.sku ?? 0,
      quantity: product.quantity,
      in_stock: product.in_stock ?? false,
      is_taxable: product.is_taxable ?? false,
      image: product.image ?? "",
      video: product.video ?? "",
      gallery: product.gallery ?? [],
      ratings: product.ratings ?? 0,
      total_reviews: product.total_reviews ?? 0,
      my_review: product.my_review ?? "",
      in_wishlist: product.in_wishlist ?? false,
      categories: product.categories ?? [], // Directly use categories as Category[]
      shop_name: product.shop?.shopName ?? "Unknown",
      status: product.status as 'Published' | 'Draft' | 'Suspended' | 'OutOfStock',
      product_type: product.product_type as 'Simple' | 'Variable',
    };

    // Delete the product
    await db.product.delete({
      where: {
        id,
      },
    });

    // Return the stored details
    return productDetails;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return null;
  }
};


export async function getProduct(slug: string) {
  try {
    const product = await db.product.findFirst({
      where: { slug },
      include: {
        categories: true,
        shop: {
          select: {
            id: true,
            shopName: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      sale_price: product.sale_price ?? 0,
      image: product.image ?? "",
      gallery: product.gallery ?? [],
      ratings: product.ratings ?? 0,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error('Failed to fetch product');
  }
}
