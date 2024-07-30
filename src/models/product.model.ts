import Shop from "./shop.model";
import Review from "./Review.model";
import Category from "./category.model";
import User from "./user.model";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  sku: number;
  quantity: number;
  in_stock?: boolean;
  is_taxable?: boolean;
  status: 'Published' | 'Draft' | 'Suspended' | 'OutOfStock';
  product_type: 'Simple' | 'Variable';
  video?: string;
  image?: string;
  ratings?: number;
  total_reviews?: number;
  my_review?: string;
  in_wishlist?: boolean;
  gallery: string[];
  shop_name?: string;
  stock?: number;
  categories?: Category[];
  shop?: Shop;
  user?: User;
}

export default Product;
