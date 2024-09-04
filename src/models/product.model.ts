import { ProductStatus, ProductType } from "@prisma/client";

export interface Category {
  productId: string;
  categoryId: string;
  // You might want to include more fields here if needed
}

export interface Product {
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
  status: ProductStatus;
  product_type: ProductType;
  image: string | null;
  ratings: number | null;
  total_reviews: number | null;
  my_review: string | null;
  in_wishlist: boolean | null;
  gallery: string[];
  shop_name: string | null;
  stock: number | null;
  categories: Category[];
  shop: {
    id: string;
    shopName: string;
  } | null;
  user: any; // You might want to define a more specific type for user
  brandId: string | null;
  brand?: {
    name: string | null;
  };
  isFlashDeal: boolean;
  discountPercentage?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Product;