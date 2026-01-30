'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './LanguageContext'
import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

interface MobileNavProps {
  navItems: { label: string; href: string }[]
}

export default function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  
  // Safe theme access
  let theme = 'light'
  let toggleTheme = () => {}
  
  try {
    const themeContext = useTheme()
    theme = themeContext.theme
    toggleTheme = themeContext.toggleTheme
  } catch {
    // ThemeProvider not available during SSR
  }

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden relative z-50 p-2"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <motion.span
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 8 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-0.5 bg-[var(--text-primary)] origin-left"
          />
          <motion.span
            animate={{
              opacity: isOpen ? 0 : 1,
              scaleX: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-0.5 bg-[var(--text-primary)]"
          />
          <motion.span
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -8 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-0.5 bg-[var(--text-primary)] origin-left"
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--bg-primary)] z-40 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                {/* Navigation Links */}
                <nav className="flex flex-col gap-1">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                      className="py-3 text-lg font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors border-b border-[var(--border)]"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto pb-8 space-y-6">
                  {/* Language Toggle */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {language === 'de' ? 'Sprache' : 'Language'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLanguage('de')}
                        className={`px-3 py-1 text-sm rounded ${
                          language === 'de'
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        DE
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 text-sm rounded ${
                          language === 'en'
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {language === 'de' ? 'Erscheinungsbild' : 'Appearance'}
                    </span>
                    <button
                      onClick={toggleTheme}
                      className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                      {theme === 'light' ? (
                        <Moon size={18} className="text-[var(--text-secondary)]" />
                      ) : (
                        <Sun size={18} className="text-[var(--accent)]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
