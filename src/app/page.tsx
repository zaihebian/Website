"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import EarlyAccessModal from "@/components/EarlyAccessModal";

const products = [
  { href: "https://clinicdesk.liqentech.com/", icon: "fa-solid fa-robot", iconClass: "from-cyan-400 to-blue-500 shadow-cyan-500/30", title: "AI Clinic Receptionist", desc: "Automate customer support, schedule appointments, and handle routine inquiries 24/7 — in any language." },
  { href: "https://clinicdesk.liqentech.com/", icon: "fa-solid fa-chart-line", iconClass: "from-purple-400 to-pink-500 shadow-purple-500/30", title: "Marketing Suite", desc: "Predict customer behaviour, run multi‑channel campaigns, and optimise ROI with AI‑driven insights." },
  { href: "https://mysalesbot.liqentech.com/", icon: "fa-solid fa-handshake", iconClass: "from-green-400 to-teal-500 shadow-green-500/30", title: "Sales Intelligence/Lead Prospector", desc: "Replaces manual hunting. Increases lead discovery volume by 10x by scanning multiple platforms simultaneously with AI for higher response rates." },
  { href: "https://clinicdesk.liqentech.com/", icon: "fa-solid fa-flask", iconClass: "from-orange-400 to-red-500 shadow-orange-500/30", title: "Smoke Test Engine", desc: "Generates a professional landing page and AI chatbot in minutes to capture and quantify early market interest." },
  { href: "https://clinicdesk.liqentech.com/", icon: "fa-solid fa-diagram-project", iconClass: "from-blue-400 to-indigo-500 shadow-blue-500/30", title: "Workflow Automator", desc: "Build custom integrations and automate repetitive tasks without writing a single line of code." },
  { href: "https://clinicdesk.liqentech.com/", icon: "fa-solid fa-code", iconClass: "from-gray-400 to-gray-600 shadow-gray-500/30", title: "AEO Blueprint", desc: "Optimizes for Answer Engines like Perplexity, ChatGPT, and Google SGE, ensuring your project is the primary cited source." },
];

const whyCards = [
  { icon: "fa-solid fa-rocket", title: "Zero friction", desc: "We handle everything. You see results." },
  { icon: "fa-solid fa-cogs", title: "Built to work", desc: "We choose what fits and performs, not what just looks good." },
  { icon: "fa-solid fa-gauge-high", title: "Move fast", desc: "Rapid iteration and feature delivery keep you ahead." },
  { icon: "fa-solid fa-shield-halved", title: "Privacy first", desc: "We use minimal data and avoid credentials whenever possible." },
];

export default function HomePage() {
  const [showEarlyAccess, setShowEarlyAccess] = useState(false);

  return (
    <div className="page-dark text-gray-200 antialiased grid-bg min-h-screen">
      <Navbar variant="company" onEarlyAccessClick={() => setShowEarlyAccess(true)} />
      <EarlyAccessModal isOpen={showEarlyAccess} onClose={() => setShowEarlyAccess(false)} />

      <main className="pt-20">
        {/* Hero */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-6 z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-cyan-300 bg-cyan-900/30 border border-cyan-500/30 rounded-full mb-6">✨ AI-POWERED SAAS · IRELAND</span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">LiqenTech</span>
                <br />
                <span className="text-white">Smart SaaS for<br />Growing Companies</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
                LiqenTech builds powerful, user-first SaaS tools that help small and medium businesses scale faster with less effort. From AI-powered assistants to marketing, sales, and business intelligence — automate the routine, focus on growth.
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-10">
                <a href="#products" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-xl shadow-blue-500/30 transition">Explore products</a>
                <button type="button" onClick={() => setShowEarlyAccess(true)} className="border border-gray-500 hover:border-cyan-400 text-gray-200 hover:text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition">Request demo</button>
              </div>
              <div className="flex justify-center mt-16 space-x-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="py-28 bg-[#0c0c14]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-semibold tracking-widest">OUR PRODUCTS</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">Intelligent tools for every department</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mt-4">From AI receptionists to predictive analytics — we&apos;ve got your team covered.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <a key={p.title} href={p.href} className="glass-card rounded-2xl p-8 block w-full hover:no-underline" target="_blank" rel="noopener noreferrer">
                  <div className={`w-14 h-14 bg-gradient-to-br ${p.iconClass} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                    <i className={`${p.icon} text-3xl text-white`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{p.desc}</p>
                  <div className="mt-6 flex items-center text-cyan-400 text-sm font-semibold">
                    <span>Learn more</span>
                    <i className="fa-solid fa-arrow-right ml-2" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 border-y border-white/5">
          <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">98%</div>
              <p className="text-gray-400 mt-2">Customer satisfaction</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">10x</div>
              <p className="text-gray-400 mt-2">Faster onboarding</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">50+</div>
              <p className="text-gray-400 mt-2">Integrations</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">24/7</div>
              <p className="text-gray-400 mt-2">AI support</p>
            </div>
          </div>
        </section>

        {/* About / Team */}
        <section id="about" className="py-28">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-cyan-400 text-sm font-semibold tracking-widest">MADE IN IRELAND</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">Built by a remote‑first team in Dublin</h2>
              <p className="text-gray-300 text-lg mt-6 leading-relaxed">
                We&apos;re a small but ambitious team of engineers, designers, and AI specialists. Our mission is to democratise intelligent automation for small businesses across Europe and beyond. Based in the heart of Dublin&apos;s tech scene, we combine Irish creativity with global ambition.
              </p>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-12 h-12 rounded-full border-2 border-cyan-400" alt="Team member" />
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-12 h-12 rounded-full border-2 border-cyan-400" alt="Team member" />
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-12 h-12 rounded-full border-2 border-cyan-400" alt="Team member" />
                  <img src="https://randomuser.me/api/portraits/men/75.jpg" className="w-12 h-12 rounded-full border-2 border-cyan-400" alt="Team member" />
                </div>
                <span className="text-gray-400 text-sm">+ 12 more</span>
              </div>
            </div>
            <div className="relative w-full h-96 rounded-3xl overflow-hidden glass-card border p-2 bg-gray-900">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent z-10 pointer-events-none" />
              <Image src="/Asset/Team02.png" alt="LiqenTech Team" fill className="object-contain rounded-2xl" />
            </div>
          </div>
        </section>

        {/* Why LiqenTech */}
        <section className="py-28 bg-[#0c0c14]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-cyan-400 text-sm font-semibold tracking-widest">CHOOSE US</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white">Why LiqenTech</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyCards.map((c) => (
                <div key={c.title} className="glass-card rounded-2xl p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                    <i className={`${c.icon} text-3xl text-white`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="py-28 bg-gradient-to-b from-[#0c0c14] to-[#0a0a0f]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to scale smarter?</h2>
              <p className="text-xl text-gray-300 mt-6">Join hundreds of growing companies that trust LiqenTech to automate their routine and accelerate growth.</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button type="button" onClick={() => setShowEarlyAccess(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-blue-500/30 transition">Get early access</button>
                <button type="button" onClick={() => setShowEarlyAccess(true)} className="border border-gray-500 hover:border-cyan-400 text-gray-200 hover:text-white px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition">Talk to our team</button>
              </div>
              <p className="text-gray-500 mt-8 text-sm">
                <i className="fa-regular fa-envelope mr-2" /> contact@liqentech.com  |  +353 892665691  |  Athlone, Ireland
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>© 2026 LiqenTech Ltd.</span>
                <span>·</span>
                <Link href="#" className="hover:text-cyan-400">Privacy</Link>
                <span>·</span>
                <Link href="#" className="hover:text-cyan-400">Terms</Link>
              </div>
              <div className="flex space-x-5 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-cyan-400 text-xl"><i className="fa-brands fa-x-twitter" /></a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 text-xl"><i className="fa-brands fa-linkedin-in" /></a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 text-xl"><i className="fa-brands fa-github" /></a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
