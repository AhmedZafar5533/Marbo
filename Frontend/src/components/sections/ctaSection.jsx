import React from 'react'
import { Link } from 'react-router-dom'

export default function CtaSection() {
  return (
    <section className="py-24 bg-[#121212] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

      <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Join thousands of companies that are already growing with our platform.
          </p>
        </div>
        <div className="pt-4">
          <Link to={'/signup'}>
            <button className="px-10 py-5 bg-white text-[#1c3144] rounded-full text-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Get Started Today
            </button>
          </Link>
        </div>
      </div>

      {/* Abstract shapes */}
      <div className="absolute -top-24 left-0 w-72 h-72 bg-[#1c3144]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 right-0 w-72 h-72 bg-[#1c3144]/20 rounded-full blur-3xl"></div>
    </section>
  )
}
