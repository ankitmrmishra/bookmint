import EventPage from "@/components/pages/events/EventPage";
import { getEvents } from "@/actions/event-action-fetch-events";
import React from "react";

export default async function page() {
  return (
    <div>
      <EventPage />
    </div>
  );
}
