"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SYSTEM_RESPONSES = [
  "Data ingestion pipeline optimized. Processing 2.4M records/second across 47 distributed nodes. Latency: <5ms.",
  "Anomaly detection model trained on 18 heterogeneous data sources. Confidence score: 94.2%. Critical patterns identified: 3.",
  "Strategic synthesis complete. Revenue correlation factor: 0.87 (p<0.001). Recommended action: Scale segment A by 34%, reallocate 12% compute to pipeline optimization.",
  "Real-time analytics dashboard synchronized. 12 KPIs tracking within nominal ranges. Alert threshold breached: 2 deviations detected in user engagement metrics.",
  "Neural architecture deployment successful. 47 active models processing concurrent data streams. Average inference latency: 180ms. GPU utilization: 87%.",
  "Predictive modeling converged after 847 iterations. Forecast accuracy improved by 23%. Next quarter revenue projection: $4.7M ± $340K.",
  "Cross-domain entity resolution completed. 1.2M entities linked across 5 knowledge graphs. Disambiguation confidence: 91%.",
  "Automated insight generation enabled. 34 actionable recommendations surfaced from Q4 data. Priority flags: 7 high-impact opportunities.",
];

export default function Terminal() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Xai Intelligence Core v4.2 initialized. Neural networks online. Ready for queries.",
      timestamp: new Date(),
    },
    {
      role: "assistant",
      content: "Welcome to the Xai command interface. Ask me about data synthesis, model architectures, analytics pipelines, or strategic insights.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const simulateTyping = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      let currentText = "";
      const typingSpeed = 20; // ms per character
      const words = text.split(" ");
      let wordIndex = 0;

      const typeNextWord = () => {
        if (wordIndex < words.length) {
          currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
          wordIndex++;
          
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.isStreaming) {
              lastMessage.content = currentText;
            }
            return newMessages;
          });

          setTimeout(typeNextWord, typingSpeed);
        } else {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage) {
              lastMessage.isStreaming = false;
            }
            return newMessages;
          });
          resolve();
        }
      };

      typeNextWord();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Try calling the actual API first
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: "You are Xai, an advanced intelligence workspace AI. Respond concisely and technically about data analysis, AI models, and analytics. Keep responses under 100 words. Be precise and use metrics.",
          messages: [
            { role: "user", content: input.trim() },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.content && data.content[0]) {
          const streamingMessage: Message = {
            role: "assistant",
            content: "",
            timestamp: new Date(),
            isStreaming: true,
          };
          
          setMessages((prev) => [...prev, streamingMessage]);
          await simulateTyping(data.content[0].text);
        }
      } else {
        throw new Error("API call failed");
      }
    } catch (error) {
      // Fallback to simulated responses
      const randomResponse = SYSTEM_RESPONSES[Math.floor(Math.random() * SYSTEM_RESPONSES.length)];
      
      const streamingMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      
      setMessages((prev) => [...prev, streamingMessage]);
      await simulateTyping(randomResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Ambient glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-50" />
        
        <div className="relative bg-zinc-950/90">
          {/* Terminal Header */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <span className="text-sm font-mono text-zinc-500 ml-4">
                xai-core-terminal <span className="text-zinc-700">~/intelligence</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-green-400 font-bold">ONLINE</span>
              </div>
              <div className="text-xs font-mono text-zinc-600">
                {messages.filter(m => m.role === "user").length} queries
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[600px] overflow-y-auto p-8 space-y-6 scroll-smooth">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role !== "user" && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg glow-primary">
                      <span className="text-white font-black text-sm">X</span>
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
                        {message.role === "user" ? "YOU" : message.role === "system" ? "SYSTEM" : "XAI"}
                      </span>
                      <span className="text-xs font-mono text-zinc-700">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    
                    <div
                      className={`px-6 py-4 rounded-2xl font-mono text-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 shadow-lg"
                          : message.role === "system"
                          ? "bg-zinc-900/50 border border-zinc-800 text-zinc-400 italic"
                          : "bg-zinc-900/80 border border-zinc-800 text-zinc-200 shadow-lg"
                      }`}
                    >
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block w-1 h-4 bg-indigo-500 ml-1 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && !messages[messages.length - 1]?.isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center glow-primary">
                  <span className="text-white font-black text-sm">X</span>
                </div>
                <div className="flex gap-2 items-center bg-zinc-900/80 border border-zinc-800 px-6 py-4 rounded-2xl">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-100" />
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-200" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-xl px-8 py-6"
          >
            <div className="flex gap-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query the intelligence core..."
                disabled={loading}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-6 py-4 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/50 disabled:shadow-none"
              >
                {loading ? "Processing..." : "Execute"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-zinc-600 font-mono">
                <span className="text-zinc-500">Tip:</span> Press <kbd className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-xs">Enter</kbd> to submit
              </p>
              <p className="text-xs text-zinc-600 font-mono">
                Powered by <span className="text-indigo-400">LLM</span>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Decorative ambient lights */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
