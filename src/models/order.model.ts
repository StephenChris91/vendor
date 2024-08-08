// models/order.model.ts

export type OrderStatus = "Pending" | "Processing" | "Complete";

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalPrice: number;
  paymentIntentId: string | null;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  shopId: string;
  paymentReference: string | null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  sku: string;
}