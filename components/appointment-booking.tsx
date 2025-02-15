"use client"

import { useState } from "react"
import { format, isBefore, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import TimeSlotPicker from "./time-slot-picker"
import BookingForm from "./booking-form"

// This would typically come from your backend
const INITIAL_BOOKED_SLOTS: Record<string, string[]> = {}

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>(INITIAL_BOOKED_SLOTS)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setShowForm(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowForm(true)
  }

  const handleBookingSubmit = (formData: any) => {
    if (selectedDate && selectedTime) {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      setBookedSlots((prev) => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), selectedTime],
      }))
      console.log("Booking submitted:", { date: selectedDate, time: selectedTime, ...formData })
      alert(`Booking submitted successfully for ${formData.name}!`)
      // Reset the form
      setSelectedDate(undefined)
      setSelectedTime(null)
      setShowForm(false)
    }
  }

  const isDateUnavailable = (date: Date) => {
    return isBefore(date, startOfDay(new Date()))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Select a Date</CardTitle>
        <CardDescription>Choose your preferred date for the appointment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          disabled={isDateUnavailable}
        />
        {selectedDate && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Available Time Slots for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <TimeSlotPicker
              onTimeSelect={handleTimeSelect}
              bookedSlots={bookedSlots[format(selectedDate, "yyyy-MM-dd")] || []}
              selectedDate={selectedDate}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {showForm ? (
          <BookingForm onSubmit={handleBookingSubmit} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {selectedDate
              ? "Please select a time slot to proceed."
              : "Please select a date to view available time slots."}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

