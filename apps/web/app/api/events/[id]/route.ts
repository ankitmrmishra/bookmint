import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/data/events";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const event = getEventById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ event });
}
