'use server'

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
  categories: string[]; // List of category IDs
  shop_name: string;
  status: string;
  product_type: string;
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
      categories: product.categories?.map(c => c.id) ?? [], // Map categories to their IDs
      shop_name: product.shop?.shopName ?? "Unknown",
      status: product.status ?? "Draft",
      product_type: product.product_type ?? "Simple",
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get a product by ID
export const getProductById = async (id: string) => {
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
      categories: product.categories?.map(c => c.id) ?? [],
      shop_name: product.shop?.shopName ?? "Unknown",
      status: product.status ?? "Draft",
      product_type: product.product_type ?? "Simple",
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Delete a product by ID
export const deleteProductById = async (id: string) => {
  try {
    const product = await db.product.delete({
      where: {
        id,
      },
    });

    return product;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return null;
  }
};
