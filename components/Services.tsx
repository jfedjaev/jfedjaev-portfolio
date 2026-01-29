'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Minus } from 'lucide-react'
import { useLanguage } from './LanguageContext'

export default function Services() {
  const { t, language } = useLanguage()

  const services = [
    {
      number: '01',
      title: language === 'de' ? 'Autonomous Mobility' : 'Autonomous Mobility',
      description: language === 'de' 
        ? 'Strategie und Umsetzung für autonome Fahrzeugflotten. Von ADAS bis Level 4 mit praktischer Erfahrung aus dem 0→100 Fahrzeug-Deployment.'
        : 'Strategy and implementation for autonomous vehicle fleets. From ADAS to Level 4 with hands-on experience from the 0→100 vehicle deployment.',
      capabilities: language === 'de' 
        ? ['Strategie-Roadmap', 'Technologie-Assessment', 'Go-to-Market', 'Regulatorik']
        : ['Strategy Roadmap', 'Technology Assessment', 'Go-to-Market', 'Regulatory'],
    },
    {
      number: '02',
      title: language === 'de' ? 'AI & Data Leadership' : 'AI & Data Leadership',
      description: language === 'de'
        ? 'Skalierung von KI-Produkten mit echtem ROI. 200TB+ Datenplattformen, 15+ ML-Modelle in Produktion bei Volkswagen.'
        : 'Scaling AI products with real ROI. 200TB+ data platforms, 15+ ML models in production at Volkswagen.',
      capabilities: language === 'de'
        ? ['AI-Strategie', 'MLOps', 'Team-Aufbau', 'Data Governance']
        : ['AI Strategy', 'MLOps', 'Team Building', 'Data Governance'],
    },
    {
      number: '03',
      title: language === 'de' ? 'BCI & Neurotechnology' : 'BCI & Neurotechnology',
      description: language === 'de'
        ? 'Brain-Computer Interfaces für MedTech und Forschung. Von der Idee bis zum Produkt mit gumpy, dem Open-Source BCI-Toolkit.'
        : 'Brain-Computer Interfaces for MedTech and research. From idea to product with gumpy, the open-source BCI toolkit.',
      capabilities: language === 'de'
        ? ['Forschungsdesign', 'Signalverarbeitung', 'FDA/CE-Konformität', 'Produktentwicklung']
        : ['Research Design', 'Signal Processing', 'FDA/CE Compliance', 'Product Development'],
    },
  ]

  const packages = [
    {
      name: language === 'de' ? 'Strategie-Assessment' : 'Strategy Assessment',
      duration: language === 'de' ? '2 Wochen' : '2 weeks',
      price: '€8,500',
      description: language === 'de'
        ? 'Rapid Analysis für konkrete strategische Herausforderungen.'
        : 'Rapid analysis for specific strategic challenges.',
      includes: language === 'de'
        ? ['Strategie-Workshop', 'Marktanalyse', '90-Tage Plan', 'Executive Summary']
        : ['Strategy Workshop', 'Market Analysis', '90-Day Plan', 'Executive Summary'],
    },
    {
      name: language === 'de' ? 'Transformation Partner' : 'Transformation Partner',
      duration: language === 'de' ? 'Monatlich' : 'Monthly',
      price: '€15,000',
      description: language === 'de'
        ? 'Hands-on Unterstützung bei der strategischen Transformation.'
        : 'Hands-on support for strategic transformation.',
      includes: language === 'de'
        ? ['2 Tage/Woche vor Ort', 'Team Enablement', 'Change Management', 'Board Reporting']
        : ['2 days/week on-site', 'Team Enablement', 'Change Management', 'Board Reporting'],
      featured: true,
    },
    {
      name: language === 'de' ? 'Chief Operating Officer' : 'Chief Operating Officer',
      duration: language === 'de' ? 'Monatlich' : 'Monthly',
      price: '€25,000',
      description: language === 'de'
        ? 'Strategische Führung und operative Exzellenz auf C-Level.'
        : 'Strategic leadership and operational excellence at C-level.',
      includes: language === 'de'
        ? ['3-4 Tage/Woche', 'P&L Verantwortung', 'Investorenkommunikation', 'M&A Due Diligence']
        : ['3-4 days/week', 'P&L Responsibility', 'Investor Communication', 'M&A Due Diligence'],
    },
  ]

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#fafaf9]">
      <div className="max-w-6xl mx-auto px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <Minus className="text-gray-400" size={20} />
            <span className="text-xs tracking-[0.3em] uppercase text-gray-400">
              {language === 'de' ? 'Leistungen' : 'Services'}
            </span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-gray-900 max-w-3xl">
            {language === 'de' 
              ? 'Strategische Führung für komplexe Technologieprogramme'
              : 'Strategic leadership for complex technology programs'}
          </h2>
        </motion.div>

        {/* Services List */}
        <div className="space-y-16 mb-32">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid lg:grid-cols-12 gap-8 pb-16 border-b border-gray-200 last:border-0"
            >
              <div className="lg:col-span-1">
                <span className="text-xs text-gray-400 font-mono">{service.number}</span>
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-serif text-2xl lg:text-3xl text-gray-900">
                  {service.title}
                </h3>
              </div>
              <div className="lg:col-span-4">
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="lg:col-span-3">
                <ul className="space-y-2">
                  {service.capabilities.map((cap, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Engagement Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-12">
            <Minus className="text-gray-400" size={20} />
            <span className="text-xs tracking-[0.3em] uppercase text-gray-400">
              {language === 'de' ? 'Engagement' : 'Engagement'}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-px bg-gray-200">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-8 lg:p-10 ${pkg.featured ? 'lg:-mt-4 lg:mb-4 relative' : ''}`}
            >
              {pkg.featured && (
                <div className="absolute -top-px left-0 right-0 h-1 bg-[#0a1628]" />
              )}
              
              <div className="mb-8">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{pkg.duration}</p>
                <h3 className="font-serif text-2xl text-gray-900 mb-4">{pkg.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pkg.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-serif text-gray-900">{pkg.price}</span>
                <span className="text-gray-400 text-sm">/{language === 'de' ? 'Monat' : 'month'}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-3">
                    <span className="text-gray-300 mt-1">—</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-sm tracking-wider uppercase text-gray-900 hover:text-gray-600 transition-colors"
              >
                {language === 'de' ? 'Anfragen' : 'Inquire'}
                <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
