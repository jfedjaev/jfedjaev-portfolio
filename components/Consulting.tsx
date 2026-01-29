'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Brain, Car, Cpu, TrendingUp, Users, Zap } from 'lucide-react'

const services = [
  {
    icon: Car,
    title: 'Autonomous Mobility Strategy',
    description: 'Von ADAS bis Level 4: Ich helfe Ihnen, autonome Fahrzeugflotten profitabel zu skalieren. Basierend auf Erfahrung aus dem 0→100 Fahrzeug-Deployment bei Volkswagen.',
    deliverables: ['Strategie-Roadmap', 'Technologie-Assessment', 'Go-to-Market Plan'],
  },
  {
    icon: Brain,
    title: 'BCI & Neurotechnology',
    description: 'Brain-Computer Interfaces für MedTech und Research. Von der Idee bis zum Prototyp – mit gumpy, meinem Open-Source BCI-Toolkit.',
    deliverables: ['Forschungsdesign', 'Signalverarbeitung', 'ML-Modelle'],
  },
  {
    icon: Cpu,
    title: 'AI Product Leadership',
    description: '200TB+ Datenplattformen, 15+ ML-Modelle in Produktion. Ich zeige Ihnen, wie Sie AI-Produkte skalieren, die echte ROI liefern.',
    deliverables: ['AI-Strategie', 'MLOps-Setup', 'Team-Aufbau'],
  },
]

const packages = [
  {
    name: 'Strategy Sprint',
    price: '€8,500',
    duration: '2 Wochen',
    description: 'Schnelle Analyse und Roadmap für konkrete Herausforderungen',
    features: [
      '2-tägiger Workshop vor Ort',
      'Aktuellen Stand analysieren',
      '90-Tage Aktionsplan',
      '1 Follow-up Call',
    ],
    cta: 'Jetzt Termin vereinbaren',
    popular: false,
  },
  {
    name: 'Transformation Partner',
    price: '€15,000',
    duration: 'pro Monat',
    description: 'Hands-on Unterstützung bei der Implementierung',
    features: [
      '2 Tage/Woche vor Ort',
      'Team-Coaching & Enablement',
      'Technische Architektur',
      'Unbegrenzte Calls & Slack',
      'Wöchentliche Progress-Reviews',
    ],
    cta: 'Gespräch buchen',
    popular: true,
  },
  {
    name: 'Fractional CTO',
    price: '€25,000',
    duration: 'pro Monat',
    description: 'Vollständige technische Führung für Ihr Team',
    features: [
      '3-4 Tage/Woche verfügbar',
      'Strategische Technologieführung',
      'Investoren- & Stakeholder-Kommunikation',
      'M&A Technical Due Diligence',
      'Priorisierung & Roadmap-Ownership',
    ],
    cta: 'Verfügbarkeit prüfen',
    popular: false,
  },
]

export default function Consulting() {
  return (
    <section id="consulting" className="py-24 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-400 font-medium mb-4">Beratung & Strategie</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Technologieführung für Ihr nächstes Wachstum
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Von 0 auf 100 autonome Fahrzeuge. €1,9 Milliarden Strategie-Initiativen. 
            200TB Datenplattformen. Ich bringe Erfahrung aus der Praxis – 
            nicht nur aus PowerPoint.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all group"
            >
              <service.icon className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.deliverables.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Zap size={14} className="text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 py-12 border-y border-gray-800"
        >
          {[
            { number: '€1.9B', label: 'Strategie-Initiativen geleitet' },
            { number: '0→100', label: 'Fahrzeuge in 3 Städten deployed' },
            { number: '200TB+', label: 'Datenplattform gebaut' },
            { number: '15+', label: 'ML-Modelle in Produktion' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Packages */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center mb-12">Beratungspakete</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border ${
                  pkg.popular 
                    ? 'bg-blue-600/10 border-blue-500 scale-105' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-sm font-medium rounded-full">
                    Beliebt
                  </div>
                )}
                <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                  <span className="text-gray-400 text-sm"> / {pkg.duration}</span>
                </div>
                <p className="text-gray-400 mb-6 text-sm">{pkg.description}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <TrendingUp size={16} className="text-blue-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block w-full py-3 px-6 rounded-lg text-center font-medium transition-colors ${
                    pkg.popular
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {pkg.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <p className="text-gray-400 mb-4">Verfügbar ab März 2026</p>
          <p className="text-lg text-gray-300 mb-8">
            Frankfurt & Remote | 2-4 Tage/Woche | Englisch & Deutsch
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-lg transition-colors"
          >
            <Users size={20} />
            Erstgespräch vereinbaren
            <ArrowRight size={20} />
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Kostenloses 30-minütiges Gespräch zur Bedarfsanalyse
          </p>
        </motion.div>
      </div>
    </section>
  )
}
