'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from './LanguageContext'
import { useTheme } from './ThemeProvider'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import MobileNav from './MobileNav'

// Navigation items
const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
  { label: 'Angebot', href: '/angebot.pdf', external: true },
]

export default function Hero() {
  const { language, setLanguage, t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  
  // Safe theme access - defaults to light during SSR
  let theme = 'light'
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
  } catch {
    // ThemeProvider not available during SSR
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      {/* Abstract Generative Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div 
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: mounted && theme === 'dark'
              ? 'linear-gradient(135deg, #0a1628 0%, #111827 50%, #1f2937 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #fafaf9 50%, #f3f4f6 100%)'
          }}
        />
        
        {/* Animated gradient orbs - only animate on client */}
        {mounted && (
          <>
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-30"
              style={{
                background: theme === 'dark'
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
              }}
            />
            
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 80, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
              style={{
                background: theme === 'dark'
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(10, 22, 40, 0.1) 0%, transparent 70%)'
              }}
            />
          </>
        )}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Diagonal accent line */}
        <div 
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, var(--accent) 50%, transparent 60%)'
          }}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-20">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 lg:px-12"
        >
          <div className="flex items-center justify-between h-20 border-b border-[var(--border)]">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent)] flex items-center justify-center">
                <span className="text-white font-serif text-xl font-medium">JF</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-xl text-[var(--text-primary)] tracking-tight">Juri Fedjaev</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item: { label: string; href: string; external?: boolean }) => (
                <a
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors tracking-wide"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {/* Desktop Theme Toggle */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Language Toggle - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border)] hover:border-[var(--border-hover)]"
                >
                  <Globe size={14} />
                  <span className="uppercase tracking-wider">{language}</span>
                  <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 right-0 bg-[var(--bg-primary)] border border-[var(--border)] shadow-lg min-w-[100px] z-50"
                  >
                    <button
                      onClick={() => { setLanguage('de'); setLangOpen(false) }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-secondary)] transition-colors ${language === 'de' ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}
                    >
                      Deutsch
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setLangOpen(false) }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-[var(--bg-secondary)] transition-colors ${language === 'en' ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Mobile Menu */}
              <MobileNav navItems={navItems} />
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-80px)] py-16">
          {/* Left Content - 8 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6 font-medium"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Main Headline - McKinsey Style */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium text-[var(--text-primary)] mb-8 leading-[0.95] tracking-tight">
              {language === 'de' ? (
                <>
                  Strategische<br />
                  <span className="text-[var(--text-secondary)]">Führung für</span><br />
                  Technologie
                </>
              ) : (
                <>
                  Strategic<br />
                  <span className="text-[var(--text-secondary)]">Leadership for</span><br />
                  Technology
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-2xl font-light">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#services"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent)] text-white text-sm tracking-wider uppercase hover:bg-[var(--accent-hover)] transition-colors"
              >
                {t('hero.cta.consulting')}
                <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[var(--border)] text-sm tracking-wider uppercase text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {t('hero.cta.contact')}
              </motion.a>
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-16 pt-8 border-t border-[var(--border)]"
            >
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--text-tertiary)] mb-8">
                {language === 'de' ? 'Erfahrung' : 'Experience'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                <div>
                  <p className="text-4xl lg:text-5xl font-serif text-[var(--text-primary)]">€1.9B</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 uppercase tracking-wider">
                    {language === 'de' ? 'Strategie-Programme' : 'Strategy Programs'}
                  </p>
                </div>
                <div>
                  <p className="text-4xl lg:text-5xl font-serif text-[var(--text-primary)]">0→100</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 uppercase tracking-wider">
                    {language === 'de' ? 'Fahrzeuge deployed' : 'Vehicles Deployed'}
                  </p>
                </div>
                <div>
                  <p className="text-4xl lg:text-5xl font-serif text-[var(--text-primary)]">200TB+</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 uppercase tracking-wider">
                    {language === 'de' ? 'Datenplattform' : 'Data Platform'}
                  </p>
                </div>
                <div>
                  <p className="text-4xl lg:text-5xl font-serif text-[var(--text-primary)]">15+</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2 uppercase tracking-wider">
                    {language === 'de' ? 'ML-Modelle' : 'ML Models'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Profile Image - 4 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative">
              {/* Image container */}
              <div className="relative aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden">
                <Image
                  src="/profile.jpg"
                  alt="Juri Fedjaev"
                  fill
                  className="object-cover transition-all duration-700"
                  priority
                />
                {/* Overlay gradient */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 30%)'
                  }}
                />
              </div>
              
              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-[var(--border)] -z-10" />
              
              {/* Name card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"
              >
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Founder</p>
                <p className="text-xl font-serif text-[var(--text-primary)]">Juri Fedjaev</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {language === 'de' ? 'Ehem. Head of Program Management' : 'Former Head of Program Management'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">Volkswagen Autonomous Mobility</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
    </section>
  )
}
