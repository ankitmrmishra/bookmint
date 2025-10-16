import { events } from "@/data/events"
import { EventCard } from "./event-card"

export function MoreLikeThis({ currentId, category }: { currentId: string; category: string }) {
  const related = events.filter((e) => e.category === category && e.id !== currentId).slice(0, 3)
  if (related.length === 0) return null
  return (
    <section aria-labelledby="related-title" className="space-y-3">
      <h3 id="related-title" className="text-xl font-medium">
        More like this
      </h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {related.map((e) => (
          <EventCard
            key={e.id}
            id={e.id}
            title={e.title}
            category={e.category}
            image={e.image}
            rating={e.rating}
            price={e.price}
            venue={e.venue}
            city={e.city}
          />
        ))}
      </div>
    </section>
  )
}
