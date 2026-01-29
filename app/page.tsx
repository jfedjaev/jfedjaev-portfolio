import Hero from '@/components/Hero'
import Consulting from '@/components/Consulting'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Consulting />
      <Contact />
    </main>
  )
}
