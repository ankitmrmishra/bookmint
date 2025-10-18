// actions/event-action-fetch-events.ts
"use server";

import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/(cdn)/cdn-schema";
import { desc } from "drizzle-orm";

interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  date: string;
  venue: string;
  city: string;
  price: string;
  organizerId: number;
  createdAt: string;
  updatedAt: string;
}

export async function getEvents(): Promise<Event[]> {
  try {
    const allEvents = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.createdAt));

    // Transform dates to strings for serialization
    return allEvents.map((event) => ({
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
