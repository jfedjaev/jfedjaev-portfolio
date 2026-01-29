'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl">
              <Image
                src="/profile.jpg"
                alt="Juri Fedjaev"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <p className="text-blue-400 font-medium mb-4 text-lg">
            Beratung für Autonomous Mobility, BCI & KI
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Juri Fedjaev
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-6 max-w-3xl mx-auto">
            Technical Program Manager & Strategieberater
          </p>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Ich helfe Unternehmen, autonome Systeme und KI-Produkte zu skalieren. 
            Von 0 auf 100 Fahrzeuge bei VW. €1,9 Milliarden Strategie-Initiativen. 
            Jetzt verfügbar für Ihr nächstes Projekt.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <a 
              href="#consulting"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-lg transition-colors"
            >
              <Calendar size={20} />
              Beratungspakete ansehen
              <ArrowRight size={20} />
            </a>
            <a 
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-lg transition-colors"
            >
              <Mail size={20} />
              Erstgespräch vereinbaren
            </a>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <a 
              href="https://linkedin.com/in/jfedjaev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com/jfedjaev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://twitter.com/jfedjaev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Verfügbar ab März 2026 • Frankfurt & Remote
          </p>
        </motion.div>
      </div>
    </section>
  )
}
