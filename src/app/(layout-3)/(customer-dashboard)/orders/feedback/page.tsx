"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrder } from "actions/orders/getOrder";
import { Order, OrderItem } from "@models/order.model";
import Spinner from "@component/Spinner";
import ErrorBoundary from "@component/ErrorBoundary";
import { Button } from "@component/buttons";
import StarRating from "@component/orders/starRating";

export default function OrderFeedbackPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallRating, setOverallRating] = useState(0);
  const [itemRatings, setItemRatings] = useState<{ [key: string]: number }>({});
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      const id = window.location.pathname.split("/").pop(); // Get the ID from the URL
      if (id) {
        try {
          setLoading(true);
          const result = await getOrder(id);
          if ("error" in result) {
            setError(result.error);
          } else {
            setOrder(result.order);
            // Initialize item ratings
            const initialItemRatings = result.order.orderItems.reduce(
              (acc, item) => {
                acc[item.id] = 0;
                return acc;
              },
              {} as { [key: string]: number }
            );
            setItemRatings(initialItemRatings);
          }
        } catch (err) {
          setError("Failed to fetch order details. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrder();
  }, []);

  const submitOrderFeedback = async (orderId: string, data: any) => {
    const itemsToRate = Object.entries(itemRatings).filter(
      ([_, rating]) => rating > 0
    );
    if (itemsToRate.length === 0) {
      throw new Error("Please rate at least one item");
    }
    // Implement your feedback submission logic here
  };

  const handleSubmit = async () => {
    if (!order) return;
    try {
      setLoading(true);
      await submitOrderFeedback(order.id, {
        overallRating,
        itemRatings,
        comment,
      });
      router.push(`/orders/${order.id}?feedbackSubmitted=true`);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <ErrorBoundary>
      <div className="order-feedback-page">
        <h1>Order Feedback</h1>
        <div className="order-details">
          <p>Order ID: {order.id}</p>
          <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="overall-rating">
          <h2>Overall Rating:</h2>
          <StarRating
            rating={overallRating}
            onRatingChange={setOverallRating}
          />
        </div>
        <div className="item-ratings">
          <h2>Rate Individual Items:</h2>
          {order.orderItems.map((item: OrderItem) => (
            <div key={item.id} className="item-rating">
              <p>{item.name}</p>
              <StarRating
                rating={itemRatings[item.id]}
                onRatingChange={(rating) =>
                  setItemRatings((prev) => ({ ...prev, [item.id]: rating }))
                }
              />
            </div>
          ))}
        </div>
        <div className="feedback-comment">
          <h2>Additional Comments:</h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please share any additional feedback about your order"
            rows={4}
            className="feedback-comment-textarea"
          />
        </div>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </ErrorBoundary>
  );
}
