import { NextResponse } from "next/server"
import { getEventById } from "@/data/events"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const event = getEventById(params.id)
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ event })
}
