"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  ratings: Array<{
    nilai: number | null;
  }>;
  showCount?: boolean;
  size?: number;
  onClick?: () => void;
  className?: string;
}

export function StarRating({
  ratings,
  showCount = true,
  size = 16,
  onClick,
  className = "",
}: StarRatingProps) {
  // Calculate average rating
  const validRatings = ratings.filter((r) => r.nilai !== null) as Array<{
    nilai: number;
  }>;
  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, r) => sum + r.nilai, 0) / validRatings.length
      : 0;

  // Round to 1 decimal place
  const roundedRating = Math.round(averageRating * 10) / 10;

  // Generate stars
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    const isFilled = starValue <= Math.floor(averageRating);
    const isPartial =
      starValue - averageRating > 0 && starValue - averageRating < 1;

    return (
      <div key={i} className="relative inline-block">
        {/* Empty star background */}
        <Star size={size} className="text-gray-300 fill-gray-300" />
        {/* Filled star overlay */}
        {isFilled && (
          <Star
            size={size}
            className="absolute top-0 left-0 text-yellow-400 fill-yellow-400"
          />
        )}
        {/* Partial star overlay */}
        {isPartial && (
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${(averageRating % 1) * 100}%` }}
          >
            <Star size={size} className="text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>
    );
  });

  const containerClass = onClick
    ? "cursor-pointer hover:opacity-80 transition-opacity"
    : "";

  return (
    <div
      className={`flex items-center gap-2 ${containerClass} ${className}`}
      onClick={onClick}
    >
      <div className="flex gap-1">{stars}</div>
      {showCount && (
        <span className="text-sm font-medium text-gray-600">
          {roundedRating.toFixed(1)} ({validRatings.length})
        </span>
      )}
    </div>
  );
}
