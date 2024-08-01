// models/order.model.ts

import User from "./user.model";


export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'Pending' | 'Processing' | 'Complete';
  totalPrice: number;
  orderItems: OrderItem[];
  userId: string;
  user?: User;  // Optional, in case we need to populate user details
  shopId?: string;
};

export default Order;