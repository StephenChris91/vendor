// components/StarRating.tsx

import React from "react";
import Icon from "@component/icon/Icon";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRatingChange(star)}
          style={{ cursor: "pointer" }}
        >
          <Icon variant="small" color={star <= rating ? "warn" : "primary"}>
            star
          </Icon>
        </span>
      ))}
    </div>
  );
};

export default StarRating;
