
"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange?: (dateRange: DateRange | undefined) => void;
    initialDateRange?: DateRange; // Optional initial date range
}

export function DatePickerWithRange({
  className,
  onDateChange,
  initialDateRange
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialDateRange);
  const [isOpen, setIsOpen] = React.useState(false); // Control popover state

  // Update parent component when date changes
  React.useEffect(() => {
     if(onDateChange) {
        onDateChange(date);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]); // Only trigger when date changes

  // Sync with initialDateRange prop if it changes externally
   React.useEffect(() => {
     setDate(initialDateRange);
   }, [initialDateRange]);


  // Handle date selection and close popover
  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    // Optionally close the popover when a full range is selected
    if (selectedDate?.from && selectedDate?.to) {
       // Delay closing slightly to allow visual feedback
       // setTimeout(() => setIsOpen(false), 100);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/y")} -{" "}
                  {format(date.to, "dd/MM/y")}
                </>
              ) : (
                // Display single selected date if only 'from' is picked
                 format(date.from, "dd/MM/y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect} // Use the controlled handler
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
