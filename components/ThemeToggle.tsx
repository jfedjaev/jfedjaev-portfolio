'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
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

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <Moon 
            size={18} 
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          />
        ) : (
          <Sun 
            size={18} 
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          />
        )}
      </motion.div>
    </button>
  )
}
