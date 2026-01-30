'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Linkedin, Minus } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from './LanguageContext'

export default function Contact() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    interest: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = language === 'de' 
      ? `Beratungsanfrage: ${formData.company}`
      : `Consulting Inquiry: ${formData.company}`
    const body = `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\n\n${formData.message}`
    window.location.href = `mailto:j.fedjaev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 mb-20"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Minus className="text-[var(--text-tertiary)]" size={20} />
              <span className="text-xs tracking-[0.3em] uppercase text-[var(--text-tertiary)]">
                {language === 'de' ? 'Kontakt' : 'Contact'}
              </span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-[var(--text-primary)] mb-6 leading-tight">
              {language === 'de' 
                ? 'Lassen Sie uns Ihre nächste Phase gestalten'
                : 'Let us shape your next phase'}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {language === 'de'
                ? 'Verfügbar ab März 2026 für strategische Beratung und operative Führung. Erstgespräch kostenlos.'
                : 'Available from March 2026 for strategic consulting and operational leadership. Initial consultation complimentary.'}
            </p>
          </div>

          <div className="lg:pt-16 space-y-8">
            <div className="flex items-start gap-4">
              <Mail className="text-[var(--text-tertiary)] mt-1" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Email</p>
                <a href="mailto:j.fedjaev@gmail.com" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                  j.fedjaev@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="text-[var(--text-tertiary)] mt-1" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Location</p>
                <p className="text-[var(--text-primary)]">Frankfurt & Remote</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Linkedin className="text-[var(--text-tertiary)] mt-1" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">LinkedIn</p>
                <a href="https://linkedin.com/in/jfedjaev" target="_blank" rel="noopener noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1">
                  linkedin.com/in/jfedjaev
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-3xl"
        >
          <div className="grid md:grid-cols-2 gap-px bg-[var(--border)] mb-px">
            <div className="bg-[var(--bg-primary)] p-6">
              <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                {language === 'de' ? 'Name' : 'Name'} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border-0 border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-transparent"
                placeholder={language === 'de' ? 'Vorname Nachname' : 'First Last'}
              />
            </div>
            <div className="bg-[var(--bg-primary)] p-6">
              <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                {language === 'de' ? 'Unternehmen' : 'Company'} *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full border-0 border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-transparent"
                placeholder={language === 'de' ? 'Firma GmbH' : 'Company Inc.'}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--border)] mb-px">
            <div className="bg-[var(--bg-primary)] p-6">
              <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border-0 border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-transparent"
                placeholder="name@company.com"
              />
            </div>
            <div className="bg-[var(--bg-primary)] p-6">
              <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                {language === 'de' ? 'Interesse' : 'Interest'}
              </label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
                className="w-full border-0 border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 text-[var(--text-primary)] bg-transparent"
              >
                <option value="">{language === 'de' ? 'Bitte wählen' : 'Please select'}</option>
                <option value="strategy">{language === 'de' ? 'Strategie-Assessment' : 'Strategy Assessment'}</option>
                <option value="transformation">{language === 'de' ? 'Transformation Partner' : 'Transformation Partner'}</option>
                <option value="coo">COO-as-a-Service</option>
                <option value="other">{language === 'de' ? 'Sonstiges' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] p-6 mb-8 border-b border-[var(--border)]">
            <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
              {language === 'de' ? 'Nachricht' : 'Message'}
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full border-0 border-b border-[var(--border)] focus:border-[var(--accent)] focus:ring-0 px-0 py-2 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-transparent resize-none"
              placeholder={language === 'de' ? 'Beschreiben Sie Ihr Projekt kurz...' : 'Briefly describe your project...'}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--accent)] text-white text-sm tracking-wider uppercase hover:bg-[var(--accent-hover)] transition-colors"
          >
            {language === 'de' ? 'Anfrage senden' : 'Send Inquiry'}
            <ArrowUpRight size={16} />
          </button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-serif text-sm font-medium">SA</span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              © {new Date().getFullYear()} Shift Autonomy. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
            </p>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            {language === 'de' ? 'Frankfurt am Main, Deutschland' : 'Frankfurt am Main, Germany'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
