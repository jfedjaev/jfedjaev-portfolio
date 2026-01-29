'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl">
              <Image
                src="/profile.jpg"
                alt="Juri Fedjaev"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <p className="text-blue-400 font-medium mb-4">Technical Program Manager</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Juri Fedjaev
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Building autonomous systems at Volkswagen. 
            Former BCI researcher. AI/ML product leader.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <a 
              href="https://github.com/jfedjaev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/jfedjaev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://twitter.com/jfedjaev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>

          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>Learn more</span>
            <ArrowDown size={16} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
