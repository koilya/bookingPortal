import { Button } from "@/components/ui/button"
import { isBefore, parse } from "date-fns"

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]

interface TimeSlotPickerProps {
  onTimeSelect: (time: string) => void
  bookedSlots: string[]
  selectedDate: Date
}

export default function TimeSlotPicker({ onTimeSelect, bookedSlots, selectedDate }: TimeSlotPickerProps) {
  const isTimeSlotAvailable = (time: string) => {
    if (bookedSlots.includes(time)) {
      return false
    }

    const currentTime = new Date()
    const slotTime = parse(time, "hh:mm a", selectedDate)

    return !isBefore(slotTime, currentTime)
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {TIME_SLOTS.map((time) => (
        <Button key={time} variant="outline" onClick={() => onTimeSelect(time)} disabled={!isTimeSlotAvailable(time)}>
          {time}
        </Button>
      ))}
    </div>
  )
}

