"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const performanceData = [
  { time: '08:00', throughput: 420, efficiency: 88, latency: 45 },
  { time: '10:00', throughput: 580, efficiency: 92, latency: 38 },
  { time: '12:00', throughput: 900, efficiency: 84, latency: 52 },
  { time: '14:00', throughput: 720, efficiency: 95, latency: 28 },
  { time: '16:00', throughput: 850, efficiency: 91, latency: 35 },
  { time: '18:00', throughput: 1100, efficiency: 98, latency: 22 },
  { time: '20:00', throughput: 950, efficiency: 94, latency: 31 },
];

const ModelCard: React.FC<{ name: string; status: 'active' | 'training' | 'idle'; accuracy: number; }> = 
  ({ name, status, accuracy }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-mono text-zinc-300">{name}</span>
      <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse' : status === 'training' ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-600'}`} />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">Accuracy</span>
        <span className="text-zinc-300 font-mono">{accuracy}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${accuracy}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
      </div>
    </div>
  </motion.div>
);

const StatCard: React.FC<{ label: string; value: string; delta: string; trend: 'up' | 'down' }> = ({ label, value, delta, trend }) => (
  <motion.div whileHover={{ scale: 1.02, y: -4 }} className="p-6 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-indigo-500/30 transition-all">
    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">{label}</div>
    <div className="flex items-baseline justify-between">
      <div className="text-3xl font-black tracking-tight text-white">{value}</div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        <svg className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {delta}
      </div>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedMetric, setSelectedMetric] = useState('throughput');
  const tabs = ['Overview', 'Models', 'Pipeline', 'Analytics', 'Settings'];

  return (
    <section className="relative py-32 px-6 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs font-bold uppercase tracking-[0.3em] text-indigo-400 mb-8">
            Command Center
          </span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
            <span className="text-white">Intelligence</span><br /><span className="text-gradient">Dashboard</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row min-h-[800px]">
            <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-900/30">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-sm font-black text-white">X</span>
                  </div>
                  <div><div className="text-sm font-bold text-white">Alpha Node</div><div className="text-xs text-zinc-500 font-mono">Production</div></div>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === tab ? 'bg-indigo-400' : 'bg-transparent'}`} />
                    {tab}
                  </button>
                ))}
              </nav>

              <div className="p-6 mt-auto border-t border-white/5">
                <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">System Load</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1"><span>CPU</span><span className="font-mono">67%</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" /></div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1 mt-3"><span>Memory</span><span className="font-mono">84%</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full w-5/6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" /></div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 bg-black">
              <header className="px-8 py-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div><h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Environment <span className="text-white">/ {activeTab}</span></h3></div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">{[1, 2, 3].map(i => (<div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">{i}</div>))}</div>
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50">Deploy</button>
                </div>
              </header>

              <div className="p-8 space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard label="Active Models" value="47" delta="+12%" trend="up" />
                      <StatCard label="Avg Latency" value="28ms" delta="-15%" trend="down" />
                      <StatCard label="Confidence" value="98.4%" delta="+2.1%" trend="up" />
                    </div>

                    <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
                      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Performance Metrics</h4>
                        <div className="flex gap-2">
                          {['throughput', 'efficiency', 'latency'].map((metric) => (
                            <button key={metric} onClick={() => setSelectedMetric(metric)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${selectedMetric === metric ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-300'}`}>
                              {metric}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <defs><linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="time" stroke="#444" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                            <YAxis stroke="#444" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }} labelStyle={{ color: '#71717a', fontSize: '11px' }} itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey={selectedMetric} stroke="#6366f1" fill="url(#colorGradient)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <ModelCard name="Neural-Core-01" status="active" accuracy={98.4} />
                      <ModelCard name="Inference-Engine" status="active" accuracy={96.7} />
                      <ModelCard name="Pattern-Detect" status="training" accuracy={94.2} />
                      <ModelCard name="Anomaly-Scan" status="active" accuracy={97.8} />
                      <ModelCard name="Predictor-v4" status="idle" accuracy={95.3} />
                      <ModelCard name="Classifier-Pro" status="active" accuracy={99.1} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/3 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};
