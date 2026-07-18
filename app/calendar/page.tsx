'use client'
import { useState } from 'react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Calendar() {
  const today = new Date()
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  })

  const [events, setEvents] = useState<{ [key: string]: string }>({})

  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  // Weekday (0=Sun..6=Sat) that the 1st of this month falls on, so the
  // grid can start day 1 in its correct column instead of always column 1.
  const firstWeekday = new Date(current.year, current.month, 1).getDay()

  const isCurrentMonth =
    current.month === today.getMonth() && current.year === today.getFullYear()

  const handlePrev = () => {
    setCurrent(({ month, year }) =>
      month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year }
    )
  }

  const handleNext = () => {
    setCurrent(({ month, year }) =>
      month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year }
    )
  }

  const handleToday = () => {
    setCurrent({ month: today.getMonth(), year: today.getFullYear() })
  }

  const handleChange = (key: string, value: string) => {
    setEvents({ ...events, [key]: value })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-white/40 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={handlePrev}
            aria-label="Previous month"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-200 transition"
          >
            ←
          </button>

          <div className="flex flex-col items-center">
            <p className="font-semibold text-lg">
              {MONTH_NAMES[current.month]} {current.year}
            </p>
            {!isCurrentMonth && (
              <button
                onClick={handleToday}
                className="text-xs text-blue-400 hover:text-blue-600 hover:underline mt-0.5"
              >
                Jump to today
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next month"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-200 transition"
          >
            →
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-3 mb-2">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-3">
          {/* Leading blanks so day 1 lands in its correct weekday column */}
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const key = `${current.month}-${day}-${current.year}`
            const isToday = isCurrentMonth && day === today.getDate()

            return (
              <div
                key={key}
                className={`rounded-xl p-2 h-28 flex flex-col transition ${
                  isToday
                    ? 'bg-blue-100 ring-2 ring-blue-400 shadow-sm'
                    : 'bg-white shadow-sm hover:shadow-md'
                }`}
              >
                <span
                  className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-blue-400 text-white' : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>

                <textarea
                  value={events[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="Add event..."
                  className="text-xs mt-1 flex-1 resize-none outline-none bg-transparent placeholder:text-gray-300"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
