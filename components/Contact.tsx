'use client'

import { motion } from 'framer-motion'
import { MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now, this opens the user's email client with pre-filled content
    const subject = `Message from ${formData.name} via juri.fedjaev.de`
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    window.location.href = `mailto:j.fedjaev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 px-6 bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-12">Get in Touch</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="p-6 rounded-lg bg-gray-800/50">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-green-400 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold mb-2">Message Ready!</h3>
                  <p className="text-gray-400">Your email client should open. If not, copy your message and email directly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-400 focus:outline-none resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Location & Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-gray-800/50 text-center">
                <MapPin className="mx-auto mb-4 text-blue-400" size={24} />
                <h3 className="font-medium mb-1">Location</h3>
                <p className="text-gray-400 text-sm">Frankfurt, Germany</p>
              </div>
              
              <div className="p-6 rounded-lg bg-gray-800/50">
                <h3 className="font-medium mb-2">Connect</h3>
                <div className="flex justify-center gap-4 mt-4">
                  <a 
                    href="https://linkedin.com/in/jfedjaev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/jfedjaev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                  <a 
                    href="https://twitter.com/jfedjaev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 mt-12"
          >
            © {new Date().getFullYear()} Juri Fedjaev. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
