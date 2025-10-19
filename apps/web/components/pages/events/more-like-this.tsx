import { getEventsByCategory } from "@/actions/event-action-fetch-events";
import { EventCard } from "./event-card";

interface MoreLikeThisProps {
  currentId: number;
  category: string;
}

export async function MoreLikeThis({ currentId, category }: MoreLikeThisProps) {
  const relatedEvents = await getEventsByCategory(category, 4);

  // Filter out the current event
  const filteredEvents = relatedEvents.filter(
    (event) => event.id !== currentId
  );

  // Only show if there are related events
  if (filteredEvents.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">More like this</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            category={event.category}
            image={event.thumbnailUrl || event.imageUrl}
            rating={0}
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
    </div>
  );
}
