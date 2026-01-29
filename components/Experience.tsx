'use client'

import { motion } from 'framer-motion'

const experiences = [
  {
    role: 'Head of Technical Program Management',
    company: 'Volkswagen Commercial Vehicles',
    period: '2023 – Present',
    description: 'Leading autonomous mobility program from concept to market. Scaled fleet 0→100 vehicles. Managing €50M+ program across EU and US.',
  },
  {
    role: 'Chief of Staff to the CEO',
    company: 'Volkswagen Commercial Vehicles',
    period: '2020 – 2023',
    description: 'Strategic advisor on €1.9B initiatives. Led Argo AI wind-down and 25% corporate restructuring. Co-authored VWCV 2030 strategy.',
  },
  {
    role: 'Senior Product Manager – Data & AI',
    company: 'Volkswagen Commercial Vehicles',
    period: '2019 – 2020',
    description: 'Built 200TB+ cloud data platform. Deployed 15+ ML models. Led 8-person data/ML team. Generated €12M ARR through data products.',
  },
  {
    role: 'Machine Learning Engineer',
    company: 'Motius GmbH',
    period: '2017',
    description: 'Productionized CNN and LSTM models for computer vision. Built real-time inference pipelines processing 10K+ images/day.',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12">Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-l-2 border-gray-700 pl-6 py-2"
              >
                <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                <p className="text-blue-400 font-medium">{exp.company}</p>
                <p className="text-gray-500 text-sm mb-2">{exp.period}</p>
                <p className="text-gray-300">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
