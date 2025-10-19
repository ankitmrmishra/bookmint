import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/event.schema";
import { desc } from "drizzle-orm";
import { getUserByWalletAddress } from "@/actions/userAction";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await getUserByWalletAddress(body.wallet);
    if (!user) {
      return NextResponse.json(
        { error: "User not found for the given wallet" },
        { status: 404 }
      );
    }

    // Validate required event fields
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

    // Create the event
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
        price: body.price.toString(), // Convert to string for decimal type
        organizerId: user.id,
      })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        error: "Failed to create event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allEvents = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.createdAt));

    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
