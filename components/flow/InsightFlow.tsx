"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stages = [
  {
    number: "01",
    title: "Ingest",
    description: "Connect unlimited data sources with real-time streaming or batch processing. Handles structured, unstructured, and semi-structured data at scale.",
    icon: "↓",
    color: "indigo",
    metrics: ["2.4M records/sec", "99.9% uptime", "< 5ms latency"],
    gradient: "from-indigo-500 to-indigo-700",
  },
  {
    number: "02",
    title: "Analyze",
    description: "AI processes patterns, anomalies, and complex relationships across multiple dimensions using advanced neural architectures and ensemble methods.",
    icon: "⚡",
    color: "violet",
    metrics: ["18 data sources", "94.2% confidence", "Real-time insights"],
    gradient: "from-violet-500 to-violet-700",
  },
  {
    number: "03",
    title: "Synthesize",
    description: "Generate actionable intelligence with predictive modeling, automated recommendations, and strategic foresight capabilities.",
    icon: "◆",
    color: "purple",
    metrics: ["47 active models", "180ms inference", "Auto-scaling"],
    gradient: "from-purple-500 to-purple-700",
  },
];

function StageCard({ stage, index }: { stage: typeof stages[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!cardRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Main card animation
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });

      // Content stagger animation
      gsap.from(contentRef.current!.children, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      });

      // Number background pulse
      gsap.to(cardRef.current, {
        "--glow-opacity": 0.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="relative group">
      <motion.div
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 hover:border-indigo-500/50 rounded-3xl p-12 md:p-16 transition-all duration-500 overflow-hidden"
        style={{ "--glow-opacity": 0 } as React.CSSProperties}
      >
        {/* Large background number */}
        <div className="absolute top-0 right-0 text-[180px] md:text-[240px] font-black text-zinc-900/50 leading-none p-8 select-none pointer-events-none">
          {stage.number}
        </div>
        
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stage.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Glow effect on hover */}
        <div className={`absolute -inset-1 bg-gradient-to-br ${stage.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
        
        <div ref={contentRef} className="relative z-10 space-y-8">
          {/* Icon */}
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${stage.gradient} flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            {stage.icon}
          </div>
          
          {/* Title */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs font-mono font-bold text-zinc-600 uppercase tracking-widest">
                Stage {stage.number}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              {stage.title}
            </h3>
          </div>
          
          {/* Description */}
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
            {stage.description}
          </p>
          
          {/* Metrics */}
          <div className="flex flex-wrap gap-3 pt-4">
            {stage.metrics.map((metric, i) => (
              <div
                key={i}
                className="px-5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-400 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
              >
                {metric}
              </div>
            ))}
          </div>
          
          {/* Action button */}
          <button className="group/btn mt-4 flex items-center gap-3 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            <span className="uppercase tracking-wider">Learn more</span>
            <svg 
              className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
      
      {/* Connector line */}
      {index < stages.length - 1 && (
        <div className="flex justify-center my-12 relative">
          <div className="relative">
            <div className="w-px h-32 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent" />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-lg glow-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightFlow() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax background blobs
      gsap.to(".blob-1", {
        y: "20%",
        x: "10%",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".blob-2", {
        y: "-15%",
        x: "-10%",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <span className="inline-block px-6 py-3 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-10 backdrop-blur-sm">
            Intelligence Pipeline
          </span>
          <h2 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9]">
            <span className="text-gradient-primary block">Three-Stage</span>
            <span className="text-white block">Transformation</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed">
            From raw data streams to actionable intelligence in three precisely orchestrated stages
          </p>
        </motion.div>
        
        {/* Stages */}
        <div className="space-y-0">
          {stages.map((stage, index) => (
            <StageCard key={index} stage={stage} index={index} />
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-32 text-center"
        >
          <div className="inline-flex flex-col items-center gap-8 px-12 py-16 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl">
            <h3 className="text-3xl font-bold text-white">
              Ready to transform your data?
            </h3>
            <p className="text-zinc-400 max-w-md">
              Join leading organizations using Xai to unlock strategic intelligence from their data
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm uppercase tracking-wider rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-indigo-500/50">
              Request Demo
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Animated background blobs */}
      <div className="blob-1 absolute top-1/4 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="blob-2 absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}
