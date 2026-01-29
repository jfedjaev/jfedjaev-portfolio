'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8">About</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              I'm a technical program manager at Volkswagen Commercial Vehicles, leading the 
              autonomous mobility program from concept to market. I bridge the gap between 
              cutting-edge AI/ML research and real-world deployment.
            </p>
            <p>
              My background is in neuroengineering and brain-computer interfaces — I developed 
              <span className="text-blue-400"> gumpy</span>, an open-source Python toolkit for BCI 
              research, and published work on deep learning for EEG signal decoding.
            </p>
            <p>
              At VW, I've scaled autonomous fleets from 0 to 100 vehicles, managed €1.9B strategic 
              initiatives, and built data platforms processing 200TB+ of vehicle telemetry.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {['Python', 'TensorFlow', 'AWS', 'Autonomous Systems', 'Product Management', 'BCI'].map((skill) => (
              <span 
                key={skill}
                className="px-4 py-2 rounded-full bg-gray-800 text-sm text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
