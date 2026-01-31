"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic imports for performance
const Hero = dynamic(() => import("@/components/hero/HeroSection").then((mod) => ({ default: mod.Hero })), { ssr: false });
const Terminal = dynamic(() => import("@/components/terminal/Terminal"), { ssr: false });
const InsightFlow = dynamic(() => import("@/components/flow/InsightFlow"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/dashboard/Dashboard").then((mod) => ({ default: mod.Dashboard })), { ssr: false });
const SignatureInteraction = dynamic(() => import("@/components/signature/SignatureInteraction"), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-zinc-400 font-bold text-lg">Initializing Intelligence Core...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative bg-black">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50" style={{ scaleX }} />
      
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-black/50 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">X</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-none">Xai</span>
              <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold leading-none">Intelligence Workspace</span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-bold">
            {[
              { href: "#hero", label: "Home" },
              { href: "#terminal", label: "Terminal" },
              { href: "#flow", label: "Pipeline" },
              { href: "#dashboard", label: "Dashboard" },
              { href: "#signature", label: "3D Mesh" }
            ].map(({ href, label }) => (
              <a key={href} href={href} className="text-zinc-400 hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>

          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg hover:shadow-indigo-500/50">
            Launch App
          </button>
        </div>
      </nav>

      <div id="hero"><Hero /></div>

      <section id="terminal" className="relative py-32 px-6 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-24">
            <span className="inline-block px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs font-bold uppercase tracking-[0.3em] text-indigo-400 mb-10 backdrop-blur-sm">
              Neural Query Engine
            </span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10">
              <span className="text-white">Direct</span><br /><span className="text-gradient">Interface</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Communicate with Xai's architectural core. Query data pipelines, model architectures, and strategic insights in real-time.
            </p>
          </motion.div>
          <Terminal />
        </div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      </section>

      <div id="flow"><InsightFlow /></div>
      <div id="dashboard"><Dashboard /></div>
      <div id="signature"><SignatureInteraction /></div>

      <footer className="relative py-24 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">X</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl leading-none">Xai</span>
                <span className="text-xs text-zinc-600 uppercase tracking-widest font-bold">Intelligence Workspace</span>
              </div>
            </div>

            <div className="flex gap-12 text-sm font-bold text-zinc-500">
              {['Documentation', 'API Reference', 'GitHub', 'Support'].map(link => (
                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-sm font-medium">© 2026 Xai Architecture Labs. All rights reserved.</p>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-700">
              {['Privacy', 'Terms', 'Security'].map(link => (
                <a key={link} href="#" className="hover:text-zinc-500 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
