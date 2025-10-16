"use client"

type Props = { rating: number; size?: number }

export function RatingStars({ rating, size = 18 }: Props) {
  const full = Math.round(rating)
  const stars = Array.from({ length: 5 }, (_, i) => i < full)

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      {stars.map((filled, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={filled ? "text-gold" : "text-muted-foreground/40"}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
      <span className="sr-only">{"Stars"}</span>
    </div>
  )
}
