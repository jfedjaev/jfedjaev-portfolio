'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'de' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  de: {
    // Hero
    'hero.subtitle': 'Beratung für Autonomous Mobility, BCI & KI',
    'hero.title': 'Juri Fedjaev',
    'hero.role': 'COO & Program Leadership',
    'hero.description': 'Ich helpe Führungsteams, komplexe Technologieprogramme zu skalieren. Von 0 auf 100 autonome Fahrzeuge. €1,9 Milliarden Strategie-Initiativen. Jetzt als COO und Berater verfügbar.',
    'hero.cta.consulting': 'Leistungen entdecken',
    'hero.cta.contact': 'Termin vereinbaren',
    'hero.availability': 'Verfügbar ab März 2026 • Frankfurt & Remote',
    
    // Consulting
    'consulting.title': 'Strategische Führung für Ihr Technologiewachstum',
    'consulting.subtitle': 'Leistungen',
    'consulting.description': 'Von der Strategie bis zur Umsetzung: Ich bringe Erfahrung aus €1,9 Milliarden Programmen und skaliere Ihre Technologie-Initiativen.',
    
    // Services
    'service.mobility.title': 'Autonomous Mobility',
    'service.mobility.desc': 'Strategie und Umsetzung für autonome Fahrzeugflotten. Von ADAS bis Level 4 – mit Erfahrung aus dem 0→100 Deployment bei Volkswagen.',
    'service.bci.title': 'BCI & Neurotechnology',
    'service.bci.desc': 'Brain-Computer Interfaces für MedTech und Forschung. Von der Idee bis zum Produkt mit gumpy, meinem Open-Source BCI-Toolkit.',
    'service.ai.title': 'AI Product Leadership',
    'service.ai.desc': 'Skalierung von KI-Produkten mit echtem ROI. 200TB+ Datenplattformen, 15+ ML-Modelle in Produktion.',
    
    // Packages
    'packages.title': 'Engagement-Modelle',
    'package.strategy.title': 'Strategy Sprint',
    'package.strategy.desc': 'Schnelle Analyse und Roadmap für konkrete Herausforderungen',
    'package.transformation.title': 'Transformation Partner',
    'package.transformation.desc': 'Hands-on Unterstützung bei der Implementierung',
    'package.coo.title': 'COO-as-a-Service',
    'package.coo.desc': 'Strategische Führung und operative Exzellenz',
    'package.popular': 'Beliebt',
    'package.cta': 'Gespräch vereinbaren',
    
    // Stats
    'stats.strategy': 'Strategie-Initiativen',
    'stats.vehicles': 'Fahrzeuge deployed',
    'stats.data': 'Datenplattform',
    'stats.models': 'ML-Modelle',
    
    // Contact
    'contact.title': 'Lassen Sie uns zusammenarbeiten',
    'contact.subtitle': 'Kontakt',
    'contact.description': 'Buchen Sie ein kostenloses 30-minütiges Erstgespräch. Wir besprechen Ihre Herausforderungen und wie ich helfen kann.',
    'contact.form.name': 'Name',
    'contact.form.company': 'Unternehmen',
    'contact.form.email': 'E-Mail',
    'contact.form.interest': 'Interesse',
    'contact.form.message': 'Ihre Nachricht',
    'contact.form.submit': 'Anfrage senden',
    'contact.form.success': 'Anfrage gesendet!',
    'contact.form.success.desc': 'Ich melde mich innerhalb von 24 Stunden.',
    'contact.availability.title': 'Verfügbarkeit',
    'contact.location.title': 'Standort',
    'contact.languages.title': 'Sprachen',
    
    // Footer
    'footer.rights': 'Alle Rechte vorbehalten',
  },
  en: {
    // Hero
    'hero.subtitle': 'Consulting for Autonomous Mobility, BCI & AI',
    'hero.title': 'Juri Fedjaev',
    'hero.role': 'COO & Program Leadership',
    'hero.description': 'I help leadership teams scale complex technology programs. From 0 to 100 autonomous vehicles. €1.9 billion strategy initiatives. Now available as COO and advisor.',
    'hero.cta.consulting': 'Explore Services',
    'hero.cta.contact': 'Book a Call',
    'hero.availability': 'Available from March 2026 • Frankfurt & Remote',
    
    // Consulting
    'consulting.title': 'Strategic Leadership for Your Technology Growth',
    'consulting.subtitle': 'Services',
    'consulting.description': 'From strategy to execution: I bring experience from €1.9 billion programs and scale your technology initiatives.',
    
    // Services
    'service.mobility.title': 'Autonomous Mobility',
    'service.mobility.desc': 'Strategy and implementation for autonomous vehicle fleets. From ADAS to Level 4 – with experience from the 0→100 deployment at Volkswagen.',
    'service.bci.title': 'BCI & Neurotechnology',
    'service.bci.desc': 'Brain-Computer Interfaces for MedTech and research. From idea to product with gumpy, my open-source BCI toolkit.',
    'service.ai.title': 'AI Product Leadership',
    'service.ai.desc': 'Scaling AI products with real ROI. 200TB+ data platforms, 15+ ML models in production.',
    
    // Packages
    'packages.title': 'Engagement Models',
    'package.strategy.title': 'Strategy Sprint',
    'package.strategy.desc': 'Rapid analysis and roadmap for specific challenges',
    'package.transformation.title': 'Transformation Partner',
    'package.transformation.desc': 'Hands-on support during implementation',
    'package.coo.title': 'COO-as-a-Service',
    'package.coo.desc': 'Strategic leadership and operational excellence',
    'package.popular': 'Popular',
    'package.cta': 'Schedule a Call',
    
    // Stats
    'stats.strategy': 'Strategy Initiatives',
    'stats.vehicles': 'Vehicles Deployed',
    'stats.data': 'Data Platform',
    'stats.models': 'ML Models',
    
    // Contact
    'contact.title': "Let's Work Together",
    'contact.subtitle': 'Contact',
    'contact.description': 'Book a free 30-minute introductory call. We will discuss your challenges and how I can help.',
    'contact.form.name': 'Name',
    'contact.form.company': 'Company',
    'contact.form.email': 'Email',
    'contact.form.interest': 'Interest',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Inquiry',
    'contact.form.success': 'Inquiry Sent!',
    'contact.form.success.desc': 'I will get back to you within 24 hours.',
    'contact.availability.title': 'Availability',
    'contact.location.title': 'Location',
    'contact.languages.title': 'Languages',
    
    // Footer
    'footer.rights': 'All rights reserved',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.de] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
