import { cart, order } from "@prisma/client";
import Product from "./product.model";
import Shop from "./shop.model";


interface User {
  id: string;
  email: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  role: 'Admin' | 'Vendor' | 'Customer';
  emailVerified?: Date;
  image?: string;
  name?: string;
  isOnboardedVendor: boolean;
  hasPaid: boolean;
  products: Product[];
  shop?: Shop;
  orders: order[];
  cart?: cart;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
  verificationStatus: 'Pending' | 'Processing' | 'Complete';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  }
}

export default User;
