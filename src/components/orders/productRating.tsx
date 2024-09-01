// components/ProductRating.tsx
import React, { useState } from "react";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import { useAuth } from "@context/authContext"; // Assuming you have an auth context
import StarRating from "./starRating";
import { rateProduct } from "actions/products/rating";

interface ProductRatingProps {
  productId: string;
  existingRating?: number;
  existingComment?: string;
}

const ProductRating: React.FC<ProductRatingProps> = ({
  productId,
  existingRating,
  existingComment,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (!user) {
      // Handle unauthenticated user (e.g., show login prompt)
      return;
    }

    setIsSubmitting(true);
    try {
      await rateProduct(productId, rating, comment);
      // Handle successful rating (e.g., show success message, update UI)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p>Please log in to rate this product.</p>;
  }

  return (
    <div>
      <h3>Rate this product</h3>
      <StarRating rating={rating} onRatingChange={setRating} />
      <TextField
        fullwidth
        multiline
        rows={4}
        label="Your review (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRatingSubmit}
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? "Submitting..." : "Submit Rating"}
      </Button>
    </div>
  );
};

export default ProductRating;
