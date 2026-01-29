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
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 mb-20"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Minus className="text-gray-400" size={20} />
              <span className="text-xs tracking-[0.3em] uppercase text-gray-400">
                {language === 'de' ? 'Kontakt' : 'Contact'}
              </span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 mb-6">
              {language === 'de' 
                ? 'Lassen Sie uns Ihre nächste Phase gestalten'
                : 'Let us shape your next phase'}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {language === 'de'
                ? 'Verfügbar ab März 2026 für strategische Beratung und operative Führung. Erstgespräch kostenlos.'
                : 'Available from March 2026 for strategic consulting and operational leadership. Initial consultation complimentary.'}
            </p>
          </div>

          <div className="lg:pt-16 space-y-8">
            <div className="flex items-start gap-4">
              <Mail className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Email</p>
                <a href="mailto:j.fedjaev@gmail.com" className="text-gray-900 hover:text-gray-600 transition-colors">
                  j.fedjaev@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <MapPin className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Location</p>
                <p className="text-gray-900">Frankfurt & Remote</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Linkedin className="text-gray-400 mt-1" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">LinkedIn</p>
                <a href="https://linkedin.com/in/jfedjaev" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-600 transition-colors inline-flex items-center gap-1">
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
          <div className="grid md:grid-cols-2 gap-px bg-gray-200 mb-px">
            <div className="bg-white p-6">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                {language === 'de' ? 'Name' : 'Name'} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 px-0 py-2 text-gray-900 placeholder-gray-300"
                placeholder={language === 'de' ? 'Vorname Nachname' : 'First Last'}
              />
            </div>
            <div className="bg-white p-6">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                {language === 'de' ? 'Unternehmen' : 'Company'} *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 px-0 py-2 text-gray-900 placeholder-gray-300"
                placeholder={language === 'de' ? 'Firma GmbH' : 'Company Inc.'}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-gray-200 mb-px">
            <div className="bg-white p-6">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 px-0 py-2 text-gray-900 placeholder-gray-300"
                placeholder="name@company.com"
              />
            </div>
            <div className="bg-white p-6">
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                {language === 'de' ? 'Interesse' : 'Interest'}
              </label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({...formData, interest: e.target.value})}
                className="w-full border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 px-0 py-2 text-gray-900 bg-transparent"
              >
                <option value="">{language === 'de' ? 'Bitte wählen' : 'Please select'}</option>
                <option value="strategy">{language === 'de' ? 'Strategie-Assessment' : 'Strategy Assessment'}</option>
                <option value="transformation">{language === 'de' ? 'Transformation Partner' : 'Transformation Partner'}</option>
                <option value="coo">COO-as-a-Service</option>
                <option value="other">{language === 'de' ? 'Sonstiges' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 mb-8">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
              {language === 'de' ? 'Nachricht' : 'Message'}
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 px-0 py-2 text-gray-900 placeholder-gray-300 resize-none"
              placeholder={language === 'de' ? 'Beschreiben Sie Ihr Projekt kurz...' : 'Briefly describe your project...'}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#0a1628] text-white text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
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
          className="mt-32 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Juri Fedjaev. {language === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-gray-400">
            {language === 'de' ? 'Frankfurt am Main, Deutschland' : 'Frankfurt am Main, Germany'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
