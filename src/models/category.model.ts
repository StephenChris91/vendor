import Product from "./product.model";

interface Category {
  id: string;
  name: string;
  slug: string;
  products?: Product[];
}

export default Category;
