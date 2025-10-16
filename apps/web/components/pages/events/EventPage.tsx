import Link from "next/link";
import { events } from "@/data/events";
import { EventCard } from "./event-card";

export default function EventPage() {
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
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
    </main>
  );
}
