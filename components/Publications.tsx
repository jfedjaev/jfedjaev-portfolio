'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

const publications = [
  {
    title: 'Validating deep neural networks for online decoding of motor imagery movements from EEG signals',
    journal: 'Sensors Journal',
    year: '2019',
    award: null,
  },
  {
    title: 'Gumpy: A Python toolbox suitable for hybrid brain–computer interfaces',
    journal: 'Journal of Neuroengineering',
    year: '2018',
    award: null,
  },
  {
    title: 'Linear programming based optimization tool for day ahead energy management of a lithium-ion battery',
    journal: 'IEEE PEMC Conference',
    year: '2016',
    award: 'Best Paper Award',
  },
]

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12">Publications</h2>
          <div className="space-y-6">
            {publications.map((pub, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-gray-800/30 border border-gray-800"
              >
                <div className="flex items-start gap-3">
                  {pub.award && <Award className="text-yellow-400 shrink-0 mt-1" size={20} />}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">{pub.title}</h3>
                    <p className="text-gray-400">
                      {pub.journal} • {pub.year}
                      {pub.award && (
                        <span className="text-yellow-400 ml-2">• {pub.award}</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
