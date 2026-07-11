import Card from '../../components/Card'

const recoveryTopics = [
  {
    title: 'Ankle Injuries',
    color: 'text-red-400',
    border: 'border-red-400',
    tips: ['Resistance band exercises', 'Balance training', 'Ice after activity'],
    articles: [
      { label: 'Ankle Sprain Rehab Exercises', url: 'https://www.healthline.com/health/sprained-ankle-exercises' },
      { label: 'Sprained Ankle Rehab Guide', url: 'https://wildhawkphysicaltherapy.com/sprained-ankle-rehab-exercises/' },
    ],
  },
  {
    title: 'Knee Injuries',
    color: 'text-blue-400',
    border: 'border-blue-400',
    tips: ['Strengthen quads + hamstrings', 'Avoid deep jumps', 'Controlled stretching'],
    articles: [
      { label: 'Exercises for Knee Pain Relief', url: 'https://www.healthline.com/health/exercises-for-knee-pain' },
      { label: 'ACL & Knee Rehab Overview', url: 'https://www.physio-pedia.com/Anterior_Cruciate_Ligament_(ACL)_Rehabilitation' },
    ],
  },
  {
    title: 'Hip Tightness',
    color: 'text-green-400',
    border: 'border-green-400',
    tips: ['Hip flexor stretches', 'Mobility drills', 'Foam rolling'],
    articles: [
      { label: 'Hip Flexor Stretches & Exercises', url: 'https://www.healthline.com/health/tight-hips' },
      { label: 'Hip Strengthening & Mobility Exercises', url: 'https://www.healthline.com/health/hip-exercises' },
    ],
  },
  {
    title: 'General Recovery',
    color: 'text-purple-400',
    border: 'border-purple-400',
    tips: ['Sleep 7–9 hours', 'Hydrate consistently', 'Active recovery days'],
    articles: [
      { label: 'The Benefits of Rest Days', url: 'https://www.healthline.com/health/exercise-fitness/rest-day' },
      { label: 'Active Recovery: How It Works', url: 'https://www.healthline.com/health/active-recovery' },
    ],
  },
]

export default function Recovery() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recovery Plans</h1>
      {recoveryTopics.map(({ title, color, border, tips, articles }) => (
        <Card key={title}>
          <h2 className={`font-semibold ${color}`}>{title}</h2>
          <ul className="text-sm mt-2 space-y-1">
            {tips.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
          <div className={`mt-4 pt-3 border-t ${border} border-opacity-30`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              📖 Further Reading
            </p>
            <ul className="space-y-1">
              {articles.map(({ label, url }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={`text-sm ${color} hover:underline`}>
                    → {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}
    </div>
  )
}