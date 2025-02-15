import { NextResponse } from "next/server"

// This would typically be replaced with actual database calls
const bookings: Record<string, string[]> = {}; // In-memory storage for bookings

const workingHours = [
  { hour: 8, minutes: [0, 30] }, // 08:00 to 08:30, etc.
  { hour: 9, minutes: [0, 30] },
  { hour: 10, minutes: [0, 30] },
  { hour: 11, minutes: [0, 30] },
  { hour: 12, minutes: [0, 30] },
  { hour: 13, minutes: [0, 30] },
  { hour: 14, minutes: [0, 30] },
  { hour: 15, minutes: [0, 30] },
}
// Possible appointment durations in minutes
const appointmentDurations = [30, 60];

// Generate available slots based on the bookings
const getAvailableSlots = (date: string) => {
  const availableSlots: string[] = [];

  // Iterate through working hours
  workingHours.forEach(({ hour, minutes }) => {
    minutes.forEach(minute => {
      const timeSlot = new Date(date);
      timeSlot.setHours(hour, minute, 0);
      const slotStr = timeSlot.toISOString();

      // Check if the time slot is booked
      if (!bookings[date] || !bookings[date].includes(slotStr)) {
        availableSlots.push(slotStr);
      }
    });
  });

  return availableSlots;
}

// Handle GET request for available slots
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date"); // Get date from query parameters

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const availableSlots = getAvailableSlots(date);
  return NextResponse.json(availableSlots);
}

// Handle POST request to create a booking
export async function POST(request: Request) {
  const { date, time } = await request.json();

  if (!bookings[date]) {
    bookings[date] = []; // Initialize the array for that date
  }

  // Check if the time slot is already booked
  if (bookings[date].includes(time)) {
    return NextResponse.json({ error: "Time slot already booked" }, { status: 400 });
  }

  // Save the booking
  bookings[date].push(time);
  return NextResponse.json({ success: true });
}

