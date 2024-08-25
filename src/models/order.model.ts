// models/order.model.ts

export type OrderStatus = "Pending" | "Processing" | "Complete";

export interface OrderItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
  shopOrderId: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  sku: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  userId: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalPrice: number;
  paymentIntentId: string | null;
  paymentMethod: string;
  shopId: string;
  paymentReference: string | null;
  orderItems: OrderItem[];
  items?: any[]; // Adjust type as necessary
  shippingAddress?: string; // Adjust type as necessary
  shippingRates?: any[]; // Adjust type as necessary
  totalAmount?: number; // Adjust type as necessary
}
