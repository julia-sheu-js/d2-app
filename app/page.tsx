import Link from 'next/link'
import Card from '../components/Card'

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">The Dance Nutrition App</h1>
        <p className="text-neutral-500">Train smarter, Perform stronger.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/nutrition"><Card> Nutrition & Hydration</Card></Link>
        <Link href="/progress"><Card>Performance Progress</Card></Link>
        <Link href="/recovery"><Card>Recovery & Injury Care</Card></Link>
        <Link href="/calendar"><Card>Schedule & Planning</Card></Link>
      </div>
    </div>
  )
}
