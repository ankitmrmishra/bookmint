import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { eventsTable } from "@/db/(cdn)/cdn-schema";
import { desc } from "drizzle-orm";
import { getUserByWalletAddress } from "@/actions/userAction";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const user = await getUserByWalletAddress(body.wallet);
    if (!user) {
      return NextResponse.json(
        { error: "User not found for the given wallet" },
        { status: 404 }
      );
    }
    const newEvent = await db
      .insert(eventsTable)
      .values({
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl, // Cloudinary full image URL
        thumbnailUrl: body.thumbnailUrl, // Cloudinary thumbnail URL
        date: new Date(body.date),
        location: body.location,
        organizerId: user?.id,
      })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
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
