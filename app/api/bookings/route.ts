import { NextResponse } from "next/server"

// This would be replaced with actual database calls
const bookings: Record<string, string[]> = {}

export async function GET() {
  return NextResponse.json(bookings)
}

export async function POST(request: Request) {
  const { date, time } = await request.json()

  if (!bookings[date]) {
    bookings[date] = []
  }

  if (bookings[date].includes(time)) {
    return NextResponse.json({ error: "Time slot already booked" }, { status: 400 })
  }

  bookings[date].push(time)
  return NextResponse.json({ success: true })
}

