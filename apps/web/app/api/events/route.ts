/**
 * @file route.ts
 * @description
 * Handles all API operations related to event creation and retrieval.
 *
 * This route supports:
 *  - `POST`: Create a new event associated with a registered user.
 *  - `GET`: Retrieve all existing events, ordered by creation date (latest first).
 *
 * @module /api/events
 *
 * @dependencies
 * - `drizzle-orm`: Database ORM used to perform SQL operations.
 * - `NextRequest`, `NextResponse`: Next.js server utilities for request/response handling.
 * - `getUserById`: Verifies if a user exists before event creation.
 * - `eventsTable`: Schema definition for the events table in Drizzle ORM.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/event.schema";
import { desc } from "drizzle-orm";
import { getUserById } from "@/actions/user.actions";

/**
 * @async
 * @function POST
 * @description
 * Handles the creation of a new event. This route expects a JSON payload
 * containing all the required event details. The request is validated for
 * missing fields, and user verification is performed using the `userId` field.
 *
 * @param {NextRequest} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} - A structured JSON response indicating success or error.
 *
 * @example
 * POST /api/events
 * {
 *   "userId": "123",
 *   "title": "Solana Web3 Meetup",
 *   "description": "A community event for Solana devs",
 *   "category": "Technology",
 *   "imageUrl": "https://example.com/banner.png",
 *   "thumbnailUrl": "https://example.com/thumb.png",
 *   "date": "2025-12-12",
 *   "venue": "Mumbai Expo Center",
 *   "city": "Mumbai",
 *   "price": "299"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    /**
     * ✅ Step 1: Validate that the user exists.
     * The frontend provides `userId` directly; if invalid, we reject the request early.
     */
    const user = await getUserById(body.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found for the given user ID" },
        { status: 404 }
      );
    }

    /**
     * ✅ Step 2: Ensure all required fields are provided.
     * Missing any of these indicates an incomplete event payload.
     */
    const requiredFields = [
      "title",
      "description",
      "category",
      "imageUrl",
      "thumbnailUrl",
      "date",
      "venue",
      "city",
      "price",
    ];

    const missingFields = requiredFields.filter(
      (field) => !body[field] && body[field] !== 0
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    /**
     * ✅ Step 3: Insert the new event into the database.
     * Converts the price to a string (Drizzle decimal type) and stores the event.
     */
    const newEvent = await db
      .insert(eventsTable)
      .values({
        title: body.title,
        description: body.description,
        category: body.category,
        imageUrl: body.imageUrl,
        thumbnailUrl: body.thumbnailUrl,
        date: new Date(body.date),
        venue: body.venue,
        city: body.city,
        price: body.price.toString(),
        organizerId: user.id,
      })
      .returning();

    /**
     * ✅ Step 4: Return the newly created event with status 201.
     */
    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("❌ Error creating event:", error);

    /**
     * ❌ Step 5: Handle unexpected errors gracefully.
     * Provides a safe error structure to the client.
     */
    return NextResponse.json(
      {
        error: "Failed to create event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * @async
 * @function GET
 * @description
 * Fetches all existing events from the database, ordered by their creation date (descending).
 * Returns an array of events, or an error if the query fails.
 *
 * @returns {Promise<NextResponse>} - A JSON array of all stored events.
 *
 * @example
 * GET /api/events
 * [
 *   {
 *     "id": 1,
 *     "title": "Solana Hackathon 2025",
 *     "date": "2025-12-01T00:00:00Z",
 *     "city": "Delhi",
 *     ...
 *   }
 * ]
 */
export async function GET() {
  try {
    /**
     * ✅ Fetch all events sorted by creation date (newest first).
     */
    const allEvents = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.createdAt));

    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("❌ Error fetching events:", error);

    /**
     * ❌ Return structured error in case of database failure.
     */
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
