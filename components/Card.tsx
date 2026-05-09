export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-md border border-white/40 p-6 hover:shadow-lg transition">
      {children}
    </div>
  )
}
