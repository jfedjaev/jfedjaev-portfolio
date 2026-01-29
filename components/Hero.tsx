'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from './LanguageContext'
import { useState } from 'react'

export default function Hero() {
  const { language, setLanguage, t } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <section className="relative min-h-screen bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0a1628 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Top Navigation Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Language Toggle - Minimal */}
      <div className="absolute top-8 right-8 z-50">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-none hover:border-gray-400"
          >
            <Globe size={14} />
            <span className="uppercase tracking-wider">{language}</span>
            <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 right-0 bg-white border border-gray-200 shadow-lg min-w-[100px]"
            >
              <button
                onClick={() => { setLanguage('de'); setLangOpen(false) }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${language === 'de' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
              >
                Deutsch
              </button>
              <button
                onClick={() => { setLanguage('en'); setLangOpen(false) }}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${language === 'en' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
              >
                English
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-8 lg:px-16">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-8 flex justify-between items-center border-b border-gray-100"
        >
          <div className="text-sm tracking-[0.2em] uppercase text-gray-400">
            Juri Fedjaev
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-500">
            <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
            <a href="#experience" className="hover:text-gray-900 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="pt-20 lg:pt-32 pb-20">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Content - 7 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-6">
                {t('hero.subtitle')}
              </p>

              <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-medium text-gray-900 mb-8 leading-[1.1]">
                {t('hero.title')}
              </h1>

              <p className="text-lg lg:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl font-light">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0a1628] text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
                >
                  {t('hero.cta.consulting')}
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-gray-300 text-sm tracking-wider uppercase text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                >
                  {t('hero.cta.contact')}
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-6">Trusted Experience</p>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-3xl font-serif text-gray-900">€1.9B</p>
                    <p className="text-xs text-gray-400 mt-1">Strategy Programs</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-gray-900">0→100</p>
                    <p className="text-xs text-gray-400 mt-1">Vehicles Deployed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-gray-900">200TB+</p>
                    <p className="text-xs text-gray-400 mt-1">Data Platform</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Image - 5 columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src="/profile.jpg"
                  alt="Juri Fedjaev"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  priority
                />
              </div>
              {/* Decorative Frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-gray-200 -z-10" />
              
              {/* Caption */}
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Former</p>
                  <p className="text-sm text-gray-600 mt-1">Head of Program Management</p>
                  <p className="text-sm text-gray-400">Volkswagen Autonomous Mobility</p>
                </div>
                <p className="text-xs text-gray-400">Frankfurt & Remote</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
