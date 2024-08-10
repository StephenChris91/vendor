// app/orders/[id]/tracking/page.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getOrder } from "actions/orders/getOrder";
import { Order } from "store/cartStore";
import Spinner from "@component/Spinner";
import OrderTrackingTimeline from "@component/orders/OrderTrackingTimeline";
import ErrorBoundary from "@component/ErrorBoundary";

export default function OrderTrackingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (id) {
        try {
          setLoading(true);
          const fetchedOrder = await getOrder(id as string);
          setOrder(fetchedOrder);
        } catch (err) {
          setError("Failed to fetch order details. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <ErrorBoundary>
      <div className="order-tracking-page">
        <h1>Track Your Order</h1>
        <div className="order-details">
          <p>Order ID: {order.id}</p>
          <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Status: {order.status}</p>
        </div>
        <OrderTrackingTimeline order={order} />
      </div>
    </ErrorBoundary>
  );
}
