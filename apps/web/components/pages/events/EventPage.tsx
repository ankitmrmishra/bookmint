import Link from "next/link";
import { EventCard } from "./event-card";
import { getEvents } from "@/actions/event-action-fetch-events";

export default async function EventPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Discover
          </p>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
            Curated Events. Premium Nights.
          </h2>
        </div>
        <Link
          href="#"
          className="hidden rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary sm:inline-block"
        >
          View all categories
        </Link>
      </section>

      {events.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No events available at the moment.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              category={event.category}
              image={event.thumbnailUrl || event.imageUrl}
              rating={0} // Default rating for new events
              price={parseFloat(event.price)}
              venue={event.venue}
              city={event.city}
              date={new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            />
          ))}
        </div>
      )}
    </main>
  );
}
