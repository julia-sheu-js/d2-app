'use client'
import { useState, useEffect } from 'react'
import Card from '../../components/Card'

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!
const TARGETS = { cal: 2000, carbs: 270, protein: 90, fat: 65 }

type FoodEntry = {
  label: string
  cal: number
  carbs: number
  protein: number
  fat: number
  tip: string
}

export default function Nutrition() {
  const [water, setWater]         = useState(0)
  const [input, setInput]         = useState('')
  const [foodInput, setFoodInput] = useState('')
  const [loading, setLoading]     = useState(false)
  const [log, setLog]             = useState<FoodEntry[]>([])
  const [error, setError]         = useState('')
  const goal = 2500

  // Save to localStorage whenever log or water changes
  useEffect(() => {
    const totals = log.reduce(
      (acc, f) => ({
        calories: acc.calories + f.cal,
        carbs:    acc.carbs + f.carbs,
        protein:  acc.protein + f.protein,
        fats:     acc.fats + f.fat,
      }),
      { calories: 0, carbs: 0, protein: 0, fats: 0 }
    )
    localStorage.setItem('nutritionData', JSON.stringify({
      ...totals,
      waterIntakeLiters: +(water / 1000).toFixed(2),
    }))
  }, [log, water])

  useEffect(() => {
    const interval = setInterval(() => {
      alert('Hydration Reminder 💧')
    }, 1000 * 60 * 60 * 2)
    return () => clearInterval(interval)
  }, [])

  const addWater = () => {
    const amount = Number(input)
    if (!isNaN(amount) && amount > 0) {
      setWater(w => w + amount)
      setInput('')
    }
  }

  const analyseFood = async (food?: string) => {
    const query = food ?? foodInput.trim()
    if (!query) return
    setLoading(true)
    setError('')

    const prompt = `You are a sports nutritionist specialising in dancers. Analyse this food: "${query}".

Return ONLY valid JSON (no markdown, no backticks):
{
  "calories": number,
  "carbs_g": number,
  "protein_g": number,
  "fat_g": number,
  "label": "short food name",
  "dancer_tip": "1-2 sentence tip specific to dancers about this food and energy/recovery"
}`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      )
      const data  = await res.json()
      const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const p     = JSON.parse(clean)

      setLog(prev => [...prev, {
        label:   p.label,
        cal:     p.calories,
        carbs:   p.carbs_g,
        protein: p.protein_g,
        fat:     p.fat_g,
        tip:     p.dancer_tip,
      }])
      setFoodInput('')
    } catch {
      setError('Could not analyse food. Check your Gemini API key.')
    }
    setLoading(false)
  }

  const totals = log.reduce(
    (acc, f) => ({
      cal:     acc.cal + f.cal,
      carbs:   acc.carbs + f.carbs,
      protein: acc.protein + f.protein,
      fat:     acc.fat + f.fat,
    }),
    { cal: 0, carbs: 0, protein: 0, fat: 0 }
  )

  const radius         = 60
  const circumference  = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - Math.min(water / goal, 1))

  const MacroBar = ({ label, value, target, color }: {
    label: string; value: number; target: number; color: string
  }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-neutral-500 mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}g / {target}g</span>
      </div>
      <div className="bg-neutral-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min((value / target) * 100, 100)}%`, background: color }}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nutrition</h1>

      {/* Hydration */}
      <Card>
        <h2 className="font-semibold mb-4">Hydration Tracker</h2>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <svg width="150" height="150">
              <circle cx="75" cy="75" r={radius} stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="75" cy="75" r={radius}
                stroke="#60a5fa" strokeWidth="10" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 75 75)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
              <span className="font-bold">{water} ml</span>
              <span className="text-xs text-neutral-500">/ {goal} ml</span>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="number" value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ml"
              className="border rounded-lg px-3 py-2 w-24 text-sm"
            />
            <button onClick={addWater} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Add
            </button>
          </div>
          <div className="flex gap-2 text-sm">
            {[200, 250, 500].map(amt => (
              <button key={amt} onClick={() => setWater(w => w + amt)}
                className="px-3 py-1 bg-blue-100 rounded-full">
                +{amt}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Food Tracker */}
      <Card>
        <h2 className="font-semibold mb-4">AI Food Tracker 💃</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text" value={foodInput}
            onChange={e => setFoodInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyseFood()}
            placeholder="e.g. banana, grilled chicken 150g..."
            className="border rounded-lg px-3 py-2 text-sm flex-1"
          />
          <button
            onClick={() => analyseFood()} disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Analysing...' : 'Analyse'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {['Banana', 'Grilled chicken 150g', 'Bowl of oats', 'Avocado toast'].map(f => (
            <button key={f} onClick={() => analyseFood(f)}
              className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              {f}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {log.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-neutral-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-medium">{Math.round(totals.cal)}</div>
                <div className="text-xs text-neutral-500 mt-1">kcal today</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-medium text-purple-600">{TARGETS.cal}</div>
                <div className="text-xs text-neutral-500 mt-1">kcal target</div>
              </div>
            </div>

            <MacroBar label="Carbohydrates" value={totals.carbs}   target={TARGETS.carbs}   color="#378ADD" />
            <MacroBar label="Protein"       value={totals.protein} target={TARGETS.protein} color="#1D9E75" />
            <MacroBar label="Fat"           value={totals.fat}     target={TARGETS.fat}     color="#D85A30" />

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Today's log</p>
              {log.map((f, i) => (
                <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-neutral-100">
                  <span>{f.label}</span>
                  <span className="text-xs text-neutral-400">
                    {Math.round(f.cal)} kcal · C:{Math.round(f.carbs)}g P:{Math.round(f.protein)}g F:{Math.round(f.fat)}g
                  </span>
                </div>
              ))}
            </div>

            {log[log.length - 1]?.tip && (
              <div className="mt-4 border-l-4 border-purple-400 pl-3 text-sm text-neutral-600 italic">
                💃 {log[log.length - 1].tip}
              </div>
            )}
          </>
        )}
      </Card>

      {/* Meal Guide */}
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