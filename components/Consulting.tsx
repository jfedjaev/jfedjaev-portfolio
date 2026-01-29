'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Car, Brain, Cpu, Check } from 'lucide-react'
import { useLanguage } from './LanguageContext'

const services = [
  {
    icon: Car,
    image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800&auto=format&fit=crop',
  },
  {
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&auto=format&fit=crop',
  },
  {
    icon: Cpu,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
  },
]

export default function Consulting() {
  const { t, language } = useLanguage()

  const packages = [
    {
      name: t('package.strategy.title'),
      price: '€8,500',
      duration: (lang: string) => lang === 'de' ? '2 Wochen' : '2 weeks',
      description: t('package.strategy.desc'),
      features: (lang: string) => lang === 'de' ? [
        'Strategie-Workshop vor Ort',
        'Markt- & Wettbewerbsanalyse',
        '90-Tage Umsetzungsplan',
        'Executive Summary'
      ] : [
        'On-site strategy workshop',
        'Market & competitive analysis',
        '90-day implementation plan',
        'Executive summary'
      ],
      popular: false,
    },
    {
      name: t('package.transformation.title'),
      price: '€15,000',
      duration: (lang: string) => lang === 'de' ? 'pro Monat' : 'per month',
      description: t('package.transformation.desc'),
      features: (lang: string) => lang === 'de' ? [
        '2 Tage/Woche vor Ort',
        'Team-Enablement',
        'Change Management',
        'Weekly Board Updates',
        'Slack/WhatsApp Support'
      ] : [
        '2 days/week on-site',
        'Team enablement',
        'Change management',
        'Weekly board updates',
        'Slack/WhatsApp support'
      ],
      popular: true,
    },
    {
      name: t('package.coo.title'),
      price: '€25,000',
      duration: (lang: string) => lang === 'de' ? 'pro Monat' : 'per month',
      description: t('package.coo.desc'),
      features: (lang: string) => lang === 'de' ? [
        '3-4 Tage/Woche Engagement',
        'P&L Verantwortung',
        'Investorenkommunikation',
        'M&A Due Diligence',
        'Board Representation'
      ] : [
        '3-4 days/week engagement',
        'P&L responsibility',
        'Investor communication',
        'M&A due diligence',
        'Board representation'
      ],
      popular: false,
    },
  ]

  return (
    <section id="consulting" className="py-24 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gold-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
            {t('consulting.subtitle')}
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-6">
            {t('consulting.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('consulting.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                <img
                  src={service.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <service.icon className="w-10 h-10 text-gold-400 mb-2" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">
                {t(`service.${['mobility', 'bci', 'ai'][index]}.title`)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(`service.${['mobility', 'bci', 'ai'][index]}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-navy-900 rounded-2xl p-12 mb-24"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '€1.9B', label: t('stats.strategy') },
              { value: '0→100', label: t('stats.vehicles') },
              { value: '200TB+', label: t('stats.data') },
              { value: '15+', label: t('stats.models') },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-gold-400 mb-2 font-display">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Packages */}
        <div className="mb-8">
          <h3 className="font-display text-3xl font-bold text-navy-900 text-center mb-12">
            {t('packages.title')}
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative rounded-2xl p-8 transition-all hover:-translate-y-2 ${
                  pkg.popular
                    ? 'bg-navy-900 text-white shadow-2xl scale-105'
                    : 'bg-white border border-gray-200 hover:shadow-xl'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold-500 text-navy-900 text-sm font-semibold rounded-full">
                    {t('package.popular')}
                  </div>
                )}

                <h4 className={`font-display text-xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-navy-900'}`}>
                  {pkg.name}
                </h4>

                <div className="mb-4">
                  <span className={`text-4xl font-bold font-display ${pkg.popular ? 'text-gold-400' : 'text-navy-900'}`}>
                    {pkg.price}
                  </span>
                  <span className={pkg.popular ? 'text-gray-400' : 'text-gray-500'}>
                    {' / '}{pkg.duration(language)}
                  </span>
                </div>

                <p className={`mb-8 ${pkg.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pkg.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {pkg.features(language).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 shrink-0 ${pkg.popular ? 'text-gold-400' : 'text-gold-500'}`} />
                      <span className={pkg.popular ? 'text-gray-300' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block w-full py-4 rounded-lg text-center font-semibold transition-all ${
                    pkg.popular
                      ? 'bg-gold-500 hover:bg-gold-400 text-navy-900'
                      : 'bg-navy-900 hover:bg-navy-800 text-white'
                  }`}
                >
                  {t('package.cta')}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
