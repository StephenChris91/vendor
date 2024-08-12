import Shop from "./shop.model";
import Category from "./category.model";
import User from "./user.model";
import { ProductStatus, ProductType } from "@prisma/client";

interface Product {
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
  video?: string;
  image: string;
  ratings?: number;
  total_reviews?: number;
  my_review?: string;
  in_wishlist?: boolean;
  gallery: string[];
  shop_name?: string;
  stock: number;
  categories: Category[];
  shop?: Shop;
  user?: User;
  brandId: string | null;
  isFlashDeal: boolean;
  discountPercentage: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default Product;