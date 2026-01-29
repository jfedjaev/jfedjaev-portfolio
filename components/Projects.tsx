'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    title: 'gumpy',
    description: 'Open-source Python toolkit for brain-computer interfaces. Used by research labs worldwide for EEG/EMG decoding and hybrid BCI development.',
    tags: ['Python', 'BCI', 'Deep Learning', 'Open Source'],
    link: 'https://github.com/gumpy-bci/gumpy',
  },
  {
    title: 'VW Autonomous Fleet',
    description: 'Scaled autonomous ID. Buzz AD fleet 0→100 vehicles across Munich, Hamburg, and Austin.',
    tags: ['Autonomous Vehicles', 'Program Management', 'Product Strategy'],
    link: null,
  },
  {
    title: 'SpaceX Hyperloop',
    description: 'Won 1st prize at SpaceX Hyperloop Competition (vs. MIT, TU Delft). Built real-time control systems for 300+ mph pod.',
    tags: ['Robotics', 'Real-time Systems', 'Competition'],
    link: null,
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full bg-gray-700 text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
