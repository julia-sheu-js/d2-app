'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import Card from '../../components/Card'

interface ScoreData {
  name: string
  score: number
  color: string
  summary: string
}

interface NutritionData {
  calories?: number
  protein?: number
  carbs?: number
  fats?: number
  waterIntakeLiters?: number
}

const BAR_COLORS = {
  Strength: '#fca5a5',     // pastel red
  Endurance: '#93c5fd',    // pastel blue
  Flexibility: '#86efac',  // pastel green
}

export default function ProgressPage() {
  // ---------------- AI CHAT ----------------
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I’m your dance coach 💃 What do you need help with today?',
    },
  ])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setChatLoading(true)

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.reply || 'No response' },
      ])
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Error getting response.' },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  // ---------------- PROGRESS ----------------
  const [userNote, setUserNote] = useState('')
  const [scores, setScores] = useState<ScoreData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nutrition, setNutrition] = useState<NutritionData>({})

  useEffect(() => {
    const stored = localStorage.getItem('nutritionData')
    if (stored) {
      try {
        setNutrition(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const generateReport = async () => {
    setLoading(true)
    setError('')
    setScores(null)

    const prompt = `
You are a fitness analysis AI for dancers. Return ONLY JSON.

{
  "strength": { "score": number, "summary": string },
  "endurance": { "score": number, "summary": string },
  "flexibility": { "score": number, "summary": string }
}

Nutrition:
Calories: ${nutrition.calories ?? 'none'}
Protein: ${nutrition.protein ?? 'none'}
Carbs: ${nutrition.carbs ?? 'none'}
Fats: ${nutrition.fats ?? 'none'}
Water: ${nutrition.waterIntakeLiters ?? 'none'}

User note: ${userNote || 'none'}
`

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (!data?.strength) throw new Error('Invalid AI response')

      setScores([
        {
          name: 'Strength',
          score: data.strength.score,
          summary: data.strength.summary,
          color: BAR_COLORS.Strength,
        },
        {
          name: 'Endurance',
          score: data.endurance.score,
          summary: data.endurance.summary,
          color: BAR_COLORS.Endurance,
        },
        {
          name: 'Flexibility',
          score: data.flexibility.score,
          summary: data.flexibility.summary,
          color: BAR_COLORS.Flexibility,
        },
      ])
    } catch (err) {
      console.error(err)
      setError('Failed to generate report.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Progress Report</h1>

      {/* Nutrition */}
      {nutrition.calories && (
        <Card>
          <h2 className="text-sm text-gray-500 mb-2">📊 Today's Nutrition</h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Calories', value: nutrition.calories, unit: 'kcal' },
              { label: 'Protein', value: nutrition.protein, unit: 'g' },
              { label: 'Carbs', value: nutrition.carbs, unit: 'g' },
              { label: 'Water', value: nutrition.waterIntakeLiters, unit: 'L' },
            ].map(item => (
              <div key={item.label} className="bg-blue-50 rounded-lg p-2">
                <div className="font-semibold">
                  {Math.round(item.value ?? 0)}{item.unit}
                </div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Input */}
      <Card>
        <h2 className="font-semibold mb-2">Training Notes</h2>
        <textarea
          value={userNote}
          onChange={e => setUserNote(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm h-24"
        />

        <button
          onClick={generateReport}
          disabled={loading}
          className="mt-3 w-full bg-blue-300 text-white py-2 rounded-lg hover:bg-blue-200"
        >
          {loading ? 'Analyzing...' : '⚡ Generate AI Report'}
        </button>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </Card>

      {/* Chart */}
      {scores && (
        <>
          <Card>
            <h2 className="font-semibold mb-4">Fitness Scores</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {scores.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="space-y-3">
            {scores.map(s => (
              <Card key={s.name}>
                <div className="flex justify-between">
                  <h3 className="font-semibold" style={{ color: s.color }}>
                    {s.name}
                  </h3>
                  <span className="font-bold">{s.score}/100</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {s.summary}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* AI CHAT */}
      <Card>
        <h2 className="font-semibold mb-3">AI Coach 💬</h2>

        <div className="h-64 overflow-y-auto space-y-2 mb-3 p-2 bg-blue-50 rounded-lg">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                m.role === 'user'
                  ? 'ml-auto bg-blue-300 text-white'
                  : 'bg-white border text-gray-700'
              }`}
            >
              {m.content}
            </div>
          ))}

          {chatLoading && (
            <div className="text-xs text-gray-400">Coach is typing...</div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about training, recovery..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-300 text-white px-4 rounded-lg"
          >
            Send
          </button>
        </div>
      </Card>
    </div>
  )
}