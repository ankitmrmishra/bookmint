import { notFound } from "next/navigation";
import { getEventById } from "@/data/events";
import { EventHero } from "@/components/pages/events/event-hero";
import { LikeButton } from "@/components/pages/events/like-button";
import { Comments } from "@/components/pages/events/comments";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MoreLikeThis } from "@/components/pages/events/more-like-this";

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = getEventById(params.id);
  if (!event) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <EventHero
        title={event.title}
        image={event.image}
        rating={event.rating}
        price={event.price}
        date={event.date}
        time={event.time}
        venue={event.venue}
        city={event.city}
      />

      <section className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <article className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">About this event</h2>
            <LikeButton eventId={event.id} baseLikes={event.initialLikes} />
          </div>
          <p className="leading-relaxed text-pretty">{event.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {event.tags.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="rounded-full border-border text-xs"
              >
                {t}
              </Badge>
            ))}
          </div>

          <Separator />
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div>
              <span className="mr-2 text-foreground">Date:</span>
              {event.date} at {event.time}
            </div>
            <div>
              <span className="mr-2 text-foreground">Venue:</span>
              {event.venue}, {event.city}
            </div>
            <div>
              <span className="mr-2 text-foreground">Category:</span>
              {event.category}
            </div>
            <div>
              <span className="mr-2 text-foreground">Price:</span>${event.price}
            </div>
          </div>

          <Separator />
          <Comments eventId={event.id} initial={event.initialComments} />
        </article>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border p-4">
            <h3 className="mb-2 text-lg font-medium">Need help?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have a question about seating or accessibility?{" "}
              <Link className="underline" href="#">
                Contact support
              </Link>
              .
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="mb-2 text-lg font-medium">Policy</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>All sales final unless event is canceled.</li>
              <li>Doors open 45 minutes before showtime.</li>
              <li>Photography may be restricted by the artist.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="mt-12">
        <MoreLikeThis currentId={event.id} category={event.category} />
      </section>
    </main>
  );
}
