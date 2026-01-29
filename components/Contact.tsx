'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send, Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
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
    const subject = `Beratungsanfrage von ${formData.name} (${formData.company})`
    const body = `Name: ${formData.name}\nUnternehmen: ${formData.company}\nEmail: ${formData.email}\nInteresse: ${formData.interest}\n\nNachricht:\n${formData.message}`
    window.location.href = `mailto:j.fedjaev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <p className="text-blue-400 font-medium mb-4">Kontakt</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Lassen Sie uns zusammenarbeiten
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Buchen Sie ein kostenloses 30-minütiges Erstgespräch. 
              Wir besprechen Ihre Herausforderungen und wie ich helfen kann.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="p-8 rounded-2xl bg-gray-800/50">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto mb-4 text-green-400" size={64} />
                  <h3 className="text-2xl font-bold mb-2">Anfrage gesendet!</h3>
                  <p className="text-gray-400">
                    Ich melde mich innerhalb von 24 Stunden bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Unternehmen *</label>
                      <input
                        type="text"
                        id="company"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                        placeholder="Muster GmbH"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">E-Mail *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="max@unternehmen.de"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-2">Interesse *</label>
                    <select
                      id="interest"
                      required
                      value={formData.interest}
                      onChange={(e) => setFormData({...formData, interest: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="strategy">Autonomous Mobility Strategie</option>
                      <option value="bci">BCI & Neurotechnology</option>
                      <option value="ai">AI Product Leadership</option>
                      <option value="fractional">Fractional CTO</option>
                      <option value="other">Sonstiges</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Ihre Nachricht</label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none resize-none"
                      placeholder="Beschreiben Sie kurz Ihre Herausforderung oder Ihr Projekt..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center justify-center gap-2 transition-colors text-lg"
                  >
                    <Send size={18} />
                    Anfrage senden
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Antwort innerhalb von 24 Stunden. Ihre Daten werden vertraulich behandelt.
                  </p>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="p-6 rounded-xl bg-gray-800/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Clock className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Verfügbarkeit</h3>
                    <p className="text-gray-400">Ab März 2026</p>
                    <p className="text-gray-400">2-4 Tage/Woche | Frankfurt & Remote</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gray-800/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <MapPin className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Standort</h3>
                    <p className="text-gray-400">Frankfurt am Main, Deutschland</p>
                    <p className="text-gray-500 text-sm mt-1">Remote & Vor-Ort-Termine deutschlandweit</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gray-800/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Mail className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Direkter Kontakt</h3>
                    <p className="text-gray-400">j.fedjaev@gmail.com</p>
                    <p className="text-gray-500 text-sm mt-1">Oder nutzen Sie das Formular</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gray-800/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Phone className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sprachen</h3>
                    <p className="text-gray-400">Deutsch (Muttersprache)</p>
                    <p className="text-gray-400">Englisch (fließend)</p>
                    <p className="text-gray-400">Russisch (bilingual)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-16"
          >
            © {new Date().getFullYear()} Juri Fedjaev. Alle Rechte vorbehalten.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
