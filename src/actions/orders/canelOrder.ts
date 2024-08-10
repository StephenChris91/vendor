import { order } from "@prisma/client";
import { OrderStatus } from "@sections/customer-dashboard/orders";


export async function cancelOrder(orderId: string, reason: string): Promise<void> {
    console.log("Cancelling order")

}