'use client'
import { useState, useEffect } from 'react'
import Card from '../../components/Card'

export default function Nutrition() {
  const [water, setWater] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      alert('Hydration Reminder 💧')
    }, 1000 * 60 * 60 * 2)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nutrition</h1>

      <Card>
        <h2 className="font-semibold">Hydration Tracker</h2>
        <p className="text-neutral-500">{water} ml</p>
        <button
          onClick={() => setWater(water + 250)}
          className="mt-3 px-4 py-2 bg-black text-white rounded-xl"
        >
          +250ml
        </button>
      </Card>

      <Card>
        <h2 className="font-semibold">Balanced Meal Guide</h2>
        <ul className="text-sm text-neutral-600 mt-2 space-y-1">
          <li>• Carbs: Rice, pasta, oats</li>
          <li>• Protein: Chicken, tofu, eggs</li>
          <li>• Fats: Avocado, nuts</li>
        </ul>
      </Card>
    </div>
  )
}