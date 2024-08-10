// app/orders/[id]/return/page.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getOrder } from "actions/orders/getOrder";
import { Order } from "@models/order.model";
import Spinner from "@component/Spinner";
import { Button } from "@component/buttons";
import ErrorBoundary from "@component/ErrorBoundary";
export default function ReturnRequestPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState("");

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

  const handleItemSelect = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      setError("Please select at least one item to return.");
      return;
    }
    try {
      setLoading(true);
      await submitReturnRequest(id as string, selectedItems, reason);
      router.push(`/orders/${id}?returnRequestSubmitted=true`);
    } catch (err) {
      setError("Failed to submit return request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <ErrorBoundary>
      <div className="return-request-page">
        <h1>Return Request</h1>
        <div className="order-details">
          <p>Order ID: {order.id}</p>
          <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="return-items">
          <h2>Select items to return:</h2>
          {order.orderItems.map((item: OrderItem) => (
            <div key={item.id} className="return-item">
              <input
                type="checkbox"
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onChange={() => handleItemSelect(item.id)}
              />
              <label htmlFor={item.id}>
                {item.name} (Quantity: {item.quantity})
              </label>
            </div>
          ))}
        </div>
        <div className="return-reason">
          <h2>Reason for return:</h2>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a reason for the return"
            rows={4}
            className="return-reason-textarea"
          />
        </div>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Return Request"}
        </Button>
      </div>
    </ErrorBoundary>
  );
}
