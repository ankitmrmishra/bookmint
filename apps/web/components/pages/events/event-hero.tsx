import { BuyButton } from "./buy-button"
import { RatingStars } from "./rating-stars"

export function EventHero(props: {
  title: string
  image: string
  rating: number
  price: number
  date: string
  time: string
  venue: string
  city: string
}) {
  const { title, image, rating, price, date, time, venue, city } = props
  return (
    <header className="overflow-hidden rounded-xl border border-border">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={`${title} banner`}
          className="h-[320px] w-full object-cover sm:h-[420px]"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-balance text-2xl font-semibold sm:text-3xl">{title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {date} • {time}
                </span>
                <span className="hidden sm:inline">|</span>
                <span>
                  {venue}, {city}
                </span>
              </div>
              <RatingStars rating={rating} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-medium">{"$" + price}</span>
              <BuyButton price={price} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
