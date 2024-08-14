'use server'

import { ProductStatus, ProductType, category, shop } from "@prisma/client";
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
  image: string | null;
  gallery: string[];
  ratings: number | null;
  total_reviews: number | null;
  my_review: string | null;
  in_wishlist: boolean | null;
  categories: category[];
  shop_name: string | null;
  status: ProductStatus;
  product_type: ProductType;
  isFlashDeal: boolean;
  discountPercentage: number | null;
  brand: { id: string; name: string } | null;
};

// Get all products
export const getAllProducts = async (): Promise<ProductWithDetails[]> => {
  try {
    const products = await db.product.findMany({
      include: {
        shop: true,
        categories: {
          include: {
            category: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
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
      sale_price: product.sale_price,
      sku: product.sku,
      quantity: product.quantity,
      in_stock: product.in_stock ?? false,
      is_taxable: product.is_taxable ?? false,
      image: product.image,
      gallery: product.gallery,
      ratings: product.ratings,
      total_reviews: product.total_reviews,
      my_review: product.my_review,
      in_wishlist: product.in_wishlist,
      categories: product.categories.map(pc => pc.category),
      shop_name: product.shop?.shopName ?? null,
      status: product.status,
      product_type: product.product_type,
      isFlashDeal: product.isFlashDeal,
      discountPercentage: product.discountPercentage,
      brand: product.brand,
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
        categories: {
          include: {
            category: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
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
      sale_price: product.sale_price,
      sku: product.sku,
      quantity: product.quantity,
      in_stock: product.in_stock ?? false,
      is_taxable: product.is_taxable ?? false,
      image: product.image,
      gallery: product.gallery,
      ratings: product.ratings,
      total_reviews: product.total_reviews,
      my_review: product.my_review,
      in_wishlist: product.in_wishlist,
      categories: product.categories.map(pc => pc.category),
      shop_name: product.shop?.shopName ?? null,
      status: product.status,
      product_type: product.product_type,
      isFlashDeal: product.isFlashDeal,
      discountPercentage: product.discountPercentage,
      brand: product.brand,
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Delete a product by ID
export const deleteProductById = async (id: string): Promise<ProductWithDetails | null> => {
  try {
    const product = await db.product.delete({
      where: {
        id,
      },
      include: {
        shop: true,
        categories: {
          include: {
            category: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
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
      sale_price: product.sale_price,
      sku: product.sku,
      quantity: product.quantity,
      in_stock: product.in_stock ?? false,
      is_taxable: product.is_taxable ?? false,
      image: product.image,
      gallery: product.gallery,
      ratings: product.ratings,
      total_reviews: product.total_reviews,
      my_review: product.my_review,
      in_wishlist: product.in_wishlist,
      categories: product.categories.map(pc => pc.category),
      shop_name: product.shop?.shopName ?? null,
      status: product.status,
      product_type: product.product_type,
      isFlashDeal: product.isFlashDeal,
      discountPercentage: product.discountPercentage,
      brand: product.brand,
    };
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
        categories: {
          include: {
            category: true,
          },
        },
        shop: {
          select: {
            id: true,
            shopName: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      categories: product.categories.map(pc => pc.category),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error('Failed to fetch product');
  }
}