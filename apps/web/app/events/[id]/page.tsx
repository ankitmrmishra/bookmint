import { notFound } from "next/navigation";
import { getEventById } from "@/actions/event-action-fetch-events";
import { EventHero } from "@/components/pages/events/event-hero";
import { LikeButton } from "@/components/pages/events/like-button";
import { Comments } from "@/components/pages/events/comments";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MoreLikeThis } from "@/components/pages/events/more-like-this";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const event = await getEventById(id);

  if (!event) return notFound();

  // Format date and time from ISO string
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <EventHero
        title={event.title}
        image={event.imageUrl}
        rating={0} // Default rating for new events
        price={parseFloat(event.price)}
        date={formattedDate}
        time={formattedTime}
        venue={event.venue}
        city={event.city}
      />

      <section className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <article className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">About this event</h2>
          </div>
          <p className="leading-relaxed text-pretty">{event.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-border text-xs"
            >
              {event.category}
            </Badge>
          </div>

          <Separator />
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div>
              <span className="mr-2 text-foreground">Date:</span>
              {formattedDate} at {formattedTime}
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
              <span className="mr-2 text-foreground">Price:</span>$
              {parseFloat(event.price).toFixed(2)}
            </div>
          </div>

          <Separator />
          <Comments eventId={event.id as unknown as string} initial={[]} />
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
