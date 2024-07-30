import { PaymentInfo, product, ShopSettings, ShopStatus } from "@prisma/client";
import Address from "./address.model";
import Order from "./order.model";
import User from "./user.model";

interface Shop {
  id: string;
  shopName: string;
  description: string;
  logo?: string;
  banner?: string;
  slug: string;
  status: ShopStatus
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  user: User;
  products: product[];
  orders: Order[];
  address?: Address;
  paymentInfo?: PaymentInfo;
  shopSettings?: ShopSettings;
}

export default Shop;
