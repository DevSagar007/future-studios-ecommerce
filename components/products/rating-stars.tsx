import { cn } from "@/lib/utils";

/** Five-star display rounded to the nearest whole star, with an accessible label. */
export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className={cn("tracking-px text-amber-500", className)}
    >
      {"★".repeat(filled)}
      <span className="text-amber-200">{"★".repeat(5 - filled)}</span>
    </span>
  );
}

export function reviewLabel(count: number) {
  return `${count} written ${count === 1 ? "review" : "reviews"}`;
}
