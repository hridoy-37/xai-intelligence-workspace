import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

const data = [
  { name: '08:00', throughput: 420, efficiency: 88 },
  { name: '10:00', throughput: 580, efficiency: 92 },
  { name: '12:00', throughput: 900, efficiency: 84 },
  { name: '14:00', throughput: 720, efficiency: 95 },
  { name: '16:00', throughput: 850, efficiency: 91 },
  { name: '18:00', throughput: 1100, efficiency: 98 },
  { name: '20:00', throughput: 950, efficiency: 94 },
];

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Workspace');

  return (
    <div className="w-full h-full bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden shadow-3xl flex flex-col md:flex-row">
      {/* Sidebar Navigation - High Density */}
      <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-zinc-900/20">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
              <span className="text-[10px] font-bold">A</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Alpha-Node</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {['Workspace', 'Synthetics', 'Library', 'Automations', 'Settings'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === item 
                ? 'bg-white/10 text-white border border-white/5' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <div className={`w-1 h-1 rounded-full ${activeTab === item ? 'bg-indigo-400' : 'bg-transparent'}`} />
              {item}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Compute Load</div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 bg-black flex flex-col min-h-0">
        <header className="px-8 py-5 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Environment / <span className="text-white">Main_Interface</span></h3>
          </div>
          <div className="flex gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800" />
              ))}
            </div>
            <button className="px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-indigo-400">Deploy</button>
          </div>
        </header>

        <div className="p-8 overflow-y-auto space-y-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Stats Grid */}
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <SimpleStat label="Synthesized Nodes" value="12,482" delta="+1.2%" />
                  <SimpleStat label="Processing Latency" value="14.2ms" delta="-0.4%" />
                  <SimpleStat label="Engine Confidence" value="99.8%" delta="+0.1%" />
                </div>

                {/* Main Graph */}
                <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Resource Allocation Flux</h4>
                    <select className="bg-transparent border-none text-[10px] font-bold text-indigo-400 uppercase tracking-widest outline-none">
                      <option>Last 24 Hours</option>
                    </select>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="throughput" 
                          stroke="#6366f1" 
                          fill="url(#indigoGradient)" 
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Feed Sidebar */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">Real-time Telemetry</h4>
                  <div className="space-y-4">
                    <TelemetryItem status="success" label="Core-01" value="Active" />
                    <TelemetryItem status="warning" label="Mem-Buffer" value="84%" />
                    <TelemetryItem status="success" label="Net-Bridge" value="Stable" />
                    <TelemetryItem status="success" label="Enc-Kernel" value="Secure" />
                  </div>
                </div>
                
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">AI Suggestion</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">Increase node parallelism in the Northern sector to optimize Q3 data ingestion.</p>
                  <button className="text-[10px] font-bold text-white uppercase tracking-widest underline decoration-indigo-500/50 hover:decoration-indigo-500">Apply Patch</button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const SimpleStat: React.FC<{ label: string; value: string; delta: string }> = ({ label, value, delta }) => (
  <div className="p-5 rounded-xl bg-zinc-900/20 border border-white/5">
    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
    <div className="flex items-baseline justify-between">
      <div className="text-xl font-bold tracking-tight">{value}</div>
      <div className={`text-[9px] font-bold ${delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{delta}</div>
    </div>
  </div>
);

const TelemetryItem: React.FC<{ status: 'success' | 'warning'; label: string; value: string }> = ({ status, label, value }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      <span className="text-[10px] font-mono text-zinc-400">{label}</span>
    </div>
    <span className="text-[10px] font-mono font-bold text-zinc-200">{value}</span>
  </div>
);