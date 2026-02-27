import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

const StarRating = ({ rating, handleChangeRating }) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500"
          : ""
      }`}
      size="icon"
      variant="ghost"
      onClick={handleChangeRating ? () => handleChangeRating(star) : null}
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating ? "fill-yellow-500" : ""
        }`}
      />
    </Button>
  ));
};

export default StarRating;
