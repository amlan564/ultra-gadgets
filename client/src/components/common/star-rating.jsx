import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, handleChangeRating }) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      className={`size-4 transition-colors ${
        star <= rating
          ? "fill-yellow-500 text-yellow-500"
          : "text-gray-300 fill-gray-300"
      } ${handleChangeRating ? "cursor-pointer hover:fill-yellow-400 hover:text-yellow-400" : ""}`}
      onClick={handleChangeRating ? () => handleChangeRating(star) : null}
    />
  ));
};

export default StarRating;
