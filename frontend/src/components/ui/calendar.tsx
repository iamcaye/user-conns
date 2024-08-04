"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select } from "./select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {

  const [month, setMonth] = React.useState(new Date().getMonth());
  const [year, setYear] = React.useState(new Date().getFullYear());

  return (
    <DayPicker
      month={new Date(year, month)}
      captionLayout="dropdown-buttons"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // add select for month and year
        Caption: () => {
          let months = [
            { label: "January", value: 1 },
            { label: "February", value: 2 },
            { label: "March", value: 3 },
            { label: "April", value: 4 },
            { label: "May", value: 5 },
            { label: "June", value: 6 },
            { label: "July", value: 7 },
            { label: "August", value: 8 },
            { label: "September", value: 9 },
            { label: "October", value: 10 },
            { label: "November", value: 11 },
            { label: "December", value: 12 },
          ]
          // years from 1900 to current year
          let years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse()

          return (
            <div className="flex gap-4 justify-center">
              <Select
                onValueChange={(value) => setMonth(parseInt(value) - 1)}
                value="props.selected.getMonth()"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                  <div className="flex items-center space-x-1">
                    <span>{months[month]?.label || "Month"}</span>
                    <ChevronDownIcon />
                  </div>
                </SelectTrigger>
                <SelectContent className="z-10 bg-white border rounded-md shadow-lg w-40 p-3 h-40 overflow-y-auto mt-6">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setYear(parseInt(value))}
                value="props.selected.getFullYear()"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                  <div className="flex items-center space-x-1">
                    <span>{year || "Year"}</span>
                    <ChevronDownIcon />
                  </div>
                </SelectTrigger>
                <SelectContent className="z-10 bg-white border rounded-md shadow-lg w-40 p-3 h-40 overflow-y-auto mt-6">
                  {years.map((year, index) => (
                    <SelectItem key={index} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div >
          )
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
