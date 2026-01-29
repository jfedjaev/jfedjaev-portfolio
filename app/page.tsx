import Hero from '@/components/Hero'
import Consulting from '@/components/Consulting'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Publications from '@/components/Publications'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Consulting />
      <About />
      <Experience />
      <Projects />
      <Publications />
      <Contact />
    </main>
  )
}
