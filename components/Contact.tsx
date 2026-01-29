'use client'

import { motion } from 'framer-motion'
import { MapPin, Mail, Globe, CheckCircle, Send } from 'lucide-react'
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
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = language === 'de' 
      ? `Beratungsanfrage von ${formData.name}`
      : `Consulting inquiry from ${formData.name}`
    const body = `${t('contact.form.name')}: ${formData.name}\n${t('contact.form.company')}: ${formData.company}\nEmail: ${formData.email}\n${t('contact.form.interest')}: ${formData.interest}\n\n${formData.message}`
    window.location.href = `mailto:j.fedjaev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  const interests = language === 'de' ? [
    { value: '', label: 'Bitte wählen...' },
    { value: 'strategy', label: 'Autonomous Mobility Strategie' },
    { value: 'bci', label: 'BCI & Neurotechnology' },
    { value: 'ai', label: 'AI Product Leadership' },
    { value: 'coo', label: 'COO-as-a-Service' },
    { value: 'other', label: 'Sonstiges' },
  ] : [
    { value: '', label: 'Please select...' },
    { value: 'strategy', label: 'Autonomous Mobility Strategy' },
    { value: 'bci', label: 'BCI & Neurotechnology' },
    { value: 'ai', label: 'AI Product Leadership' },
    { value: 'coo', label: 'COO-as-a-Service' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <section id="contact" className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <span className="text-gold-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
              {t('contact.subtitle')}
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('contact.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 lg:p-10"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">{t('contact.form.success')}</h3>
                  <p className="text-gray-600">{t('contact.form.success.desc')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">{t('contact.form.name')} *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                        placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-2">{t('contact.form.company')} *</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                        placeholder={language === 'de' ? 'Muster GmbH' : 'Acme Corp'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2">{t('contact.form.email')} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                      placeholder="email@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2">{t('contact.form.interest')} *</label>
                    <select
                      required
                      value={formData.interest}
                      onChange={(e) => setFormData({...formData, interest: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all"
                    >
                      {interests.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-2">{t('contact.form.message')}</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all resize-none"
                      placeholder={language === 'de' ? 'Beschreiben Sie Ihr Projekt...' : 'Describe your project...'}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Send size={18} />
                    {t('contact.form.submit')}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-lg">
                    <Globe className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.availability.title')}</h3>
                    <p className="text-gray-400">{language === 'de' ? 'Ab März 2026' : 'From March 2026'}</p>
                    <p className="text-gray-500 text-sm">{language === 'de' ? 'Frankfurt & Remote' : 'Frankfurt & Remote'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-lg">
                    <MapPin className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.location.title')}</h3>
                    <p className="text-gray-400">Frankfurt am Main, Germany</p>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-lg">
                    <Mail className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400">j.fedjaev@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-500/10 rounded-lg">
                    <Globe className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{t('contact.languages.title')}</h3>
                    <p className="text-gray-400">{language === 'de' ? 'Deutsch, Englisch, Russisch' : 'German, English, Russian'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-16"
          >
            © {new Date().getFullYear()} Juri Fedjaev. {t('footer.rights')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
