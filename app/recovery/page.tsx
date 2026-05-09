import Card from '../../components/Card'

export default function Recovery() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recovery Plans</h1>

      <Card>
        <h2 className="font-semibold text-red-400">Ankle Injuries</h2>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Resistance band exercises</li>
          <li>• Balance training</li>
          <li>• Ice after activity</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-blue-400">Knee Injuries</h2>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Strengthen quads + hamstrings</li>
          <li>• Avoid deep jumps</li>
          <li>• Controlled stretching</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-green-400">Hip Tightness</h2>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Hip flexor stretches</li>
          <li>• Mobility drills</li>
          <li>• Foam rolling</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-purple-400">General Recovery</h2>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Sleep 7–9 hours</li>
          <li>• Hydrate consistently</li>
          <li>• Active recovery days</li>
        </ul>
      </Card>
    </div>
  )
}
