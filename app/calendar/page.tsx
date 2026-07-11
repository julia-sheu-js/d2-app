'use client'
import { useState } from 'react'

export default function Calendar() {
  const today = new Date()
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  })

  const [events, setEvents] = useState<{ [key: string]: string }>({})

  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()

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

  const handleChange = (key: string, value: string) => {
    setEvents({ ...events, [key]: value })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Calendar</h1>

      <div className="flex justify-between items-center">
        <button onClick={handlePrev}>←</button>
        <p className="font-medium">{current.month + 1}/{current.year}</p>
        <button onClick={handleNext}>→</button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const key = `${current.month}-${day}-${current.year}`

          return (
            <div key={key} className="bg-white rounded-xl p-2 shadow-sm h-28 flex flex-col">
              <span className="text-xs font-semibold">{day}</span>

              <textarea
                value={events[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder="Add event..."
                className="text-xs mt-1 flex-1 resize-none outline-none"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}