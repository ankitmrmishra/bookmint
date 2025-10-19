// actions/event-action-fetch-events.ts
"use server";

import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/event.schema";
import { desc, eq } from "drizzle-orm";

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

export async function getEventById(id: string | number): Promise<Event | null> {
  try {
    const eventId = typeof id === "string" ? parseInt(id) : id;

    if (isNaN(eventId)) {
      return null;
    }

    const result = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, eventId))
      .limit(1);

    const event = result[0];

    if (!event) {
      return null;
    }

    // Transform dates to strings for serialization
    return {
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return null;
  }
}

export async function getEventsByCategory(
  category: string,
  limit: number = 4
): Promise<Event[]> {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.category, category))
      .orderBy(desc(eventsTable.createdAt))
      .limit(limit);

    return events.map((event) => ({
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching events by category:", error);
    return [];
  }
}
