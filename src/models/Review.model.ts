import User from "./user.model";
import Product from "./product.model";

interface Review {
  rating: number;
  comment: string;
  user: User;
  product: Product;
}

export default Review;
