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
    <section className="relative min-h-screen bg-navy-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gold Accent Line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 origin-left"
      />

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800/80 backdrop-blur-sm border border-gold-500/30 rounded-lg text-white hover:border-gold-500/60 transition-colors"
          >
            <Globe size={18} className="text-gold-400" />
            <span className="uppercase font-medium">{language}</span>
            <ChevronDown size={16} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 right-0 bg-navy-800 border border-gold-500/30 rounded-lg overflow-hidden min-w-[120px]"
            >
              <button
                onClick={() => { setLanguage('de'); setLangOpen(false) }}
                className={`w-full px-4 py-3 text-left hover:bg-navy-700 transition-colors ${language === 'de' ? 'text-gold-400' : 'text-white'}`}
              >
                Deutsch
              </button>
              <button
                onClick={() => { setLanguage('en'); setLangOpen(false) }}
                className={`w-full px-4 py-3 text-left hover:bg-navy-700 transition-colors ${language === 'en' ? 'text-gold-400' : 'text-white'}`}
              >
                English
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              <span className="text-gold-400 text-sm font-medium tracking-wider uppercase">
                {t('hero.subtitle')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-display text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-2xl lg:text-3xl text-gold-400 font-display mb-6"
            >
              {t('hero.role')}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#consulting"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold rounded-lg transition-all hover:scale-105"
              >
                {t('hero.cta.consulting')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium rounded-lg transition-all"
              >
                {t('hero.cta.contact')}
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 text-gray-400 text-sm"
            >
              {t('hero.availability')}
            </motion.p>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Juri Fedjaev"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
            </div>
            
            {/* Decorative Frame */}
            <div className="absolute -inset-4 border-2 border-gold-500/20 rounded-3xl -z-10" />
            <div className="absolute -inset-8 border border-gold-500/10 rounded-3xl -z-20" />
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-2xl"
            >
              <div className="text-3xl font-bold text-navy-900">€1.9B</div>
              <div className="text-sm text-gray-600">Strategy Programs</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -top-6 -right-6 bg-gold-500 rounded-xl p-6 shadow-2xl"
            >
              <div className="text-3xl font-bold text-navy-900">0→100</div>
              <div className="text-sm text-navy-800/70">Vehicles Deployed</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
