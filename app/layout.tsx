import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-neutral-800">
        <nav className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="font-bold text-lg">DancerFlow</h1>

            <div className="flex gap-3">
              
              <Link href="/" className="px-4 py-2 rounded-full bg-white shadow hover:bg-pink-100 transition">Dashboard</Link>
              <Link href="/nutrition" className="px-4 py-2 rounded-full bg-white shadow hover:bg-blue-100 transition">Nutrition</Link>
              <Link href="/progress" className="px-4 py-2 rounded-full bg-white shadow hover:bg-purple-100 transition">Progress</Link>
              <Link href="/recovery" className="px-4 py-2 rounded-full bg-white shadow hover:bg-green-100 transition">Recovery</Link>
              <Link href="/calendar" className="px-4 py-2 rounded-full bg-white shadow hover:bg-yellow-100 transition">Calendar</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
