import React from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-xl font-bold text-blue-400">CareerConnect</h3>
        <p className="text-slate-400 text-sm mt-1">Connecting talent with opportunity</p>
        
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
             className="hover:text-blue-400 transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in" target="_blank" rel="noopener noreferrer"
             className="hover:text-blue-400 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="mailto:prathamesh@gmail.com"
             className="hover:text-blue-400 transition-colors">
            <Mail size={20} />
          </a>
        </div>
        
        <p className="text-slate-500 text-sm mt-6">
          Built by <span className="text-blue-400 font-semibold">Prathamesh Chougale</span>
        </p>
        <p className="text-slate-600 text-xs mt-1">© 2026 CareerConnect. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer