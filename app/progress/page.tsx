'use client'
import { useState } from 'react'
import Card from '../../components/Card'

export default function Progress() {
  const [stats, setStats] = useState({ strength: 60, flexibility: 70, endurance: 50 })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Progress</h1>

      {Object.entries(stats).map(([key, value]) => (
        <Card key={key}>
          <div className="flex justify-between">
            <span className="capitalize">{key}</span>
            <span>{value}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setStats({ ...stats, [key]: Number(e.target.value) })}
            className="w-full mt-3"
          />
        </Card>
      ))}
    </div>
  )
}