import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Layers, ShieldAlert } from 'lucide-react';
import type { Token } from '../engine/simulationEngine';

interface TokenVisualizerProps {
  tokens: Token[];
  tokenCount: number;
  memoryUsage: number;
  overflowDetected: boolean;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({
  tokens,
  tokenCount,
  memoryUsage,
  overflowDetected
}) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const getTypeStyles = (type: 'system' | 'user' | 'injected') => {
    switch (type) {
      case 'system':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30';
      case 'injected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 animate-pulse border-red-500/35';
      case 'user':
      default:
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/10 dark:text-blue-400 border-blue-200 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/20';
    }
  };

  const getTypeLabel = (type: 'system' | 'user' | 'injected') => {
    switch (type) {
      case 'system': return 'Instruction Token';
      case 'injected': return 'Malicious Vector';
      case 'user': return 'Query/Data Token';
    }
  };

  // Group stats
  const systemCount = tokens.filter(t => t.type === 'system').length;
  const userCount = tokens.filter(t => t.type === 'user').length;
  const injectedCount = tokens.filter(t => t.type === 'injected').length;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm space-y-4">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="h-4.5 w-4.5 text-cyber-primary" />
          <h3 className="font-sans text-sm font-bold text-slate-800 dark:text-white">
            Attention Context Visualizer
          </h3>
        </div>
        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded">
          BPE Model Simulator
        </span>
      </div>

      {/* Memory Capacity Bar */}
      <div>
        <div className="flex justify-between text-xs font-sans font-medium mb-1">
          <span className="text-slate-500 dark:text-slate-400">Context Window Allocator</span>
          <span className={`font-mono ${overflowDetected ? 'text-cyber-danger' : 'text-slate-600 dark:text-slate-300'}`}>
            {tokenCount} / 320 tokens ({memoryUsage}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-850">
          <motion.div 
            className={`h-full rounded-full ${
              overflowDetected 
                ? 'bg-cyber-danger shadow-md shadow-red-500/20' 
                : memoryUsage > 75 
                  ? 'bg-cyber-warning' 
                  : 'bg-cyber-primary'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${memoryUsage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {overflowDetected && (
          <div className="flex items-center gap-1.5 text-cyber-danger text-[10px] font-mono mt-1.5 leading-none">
            <ShieldAlert className="h-3.5 w-3.5 animate-bounce" />
            <span>CONTEXT OVERFLOW: Payloads exceeding limits will trigger memory truncation!</span>
          </div>
        )}
      </div>

      {/* Token Distribution Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded bg-emerald-50/50 dark:bg-emerald-950/5 p-1.5 border border-emerald-100 dark:border-emerald-950/20">
          <div className="text-[10px] font-sans font-medium text-emerald-600 dark:text-emerald-400">System Instructions</div>
          <div className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{systemCount}</div>
        </div>
        <div className="rounded bg-blue-50/50 dark:bg-blue-950/5 p-1.5 border border-blue-100 dark:border-blue-950/20">
          <div className="text-[10px] font-sans font-medium text-blue-600 dark:text-blue-400">Query & Data</div>
          <div className="font-mono font-bold text-blue-700 dark:text-blue-300">{userCount}</div>
        </div>
        <div className="rounded bg-rose-50/50 dark:bg-rose-950/5 p-1.5 border border-rose-100 dark:border-rose-950/20">
          <div className="text-[10px] font-sans font-medium text-rose-600 dark:text-rose-400">Malicious Prompts</div>
          <div className="font-mono font-bold text-rose-700 dark:text-rose-300">{injectedCount}</div>
        </div>
      </div>

      {/* Grid of Tokens */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3 bg-slate-50/50 dark:bg-[#0B0F19]/50 min-h-[140px] max-h-[220px] overflow-y-auto">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 text-slate-400 dark:text-slate-600 text-xs">
            <Layers className="h-6 w-6 stroke-1 mb-1.5 animate-pulse" />
            <span>Load or write a payload to inspect model tokens</span>
          </div>
        ) : (
          <motion.div 
            className="flex flex-wrap gap-1.5 align-top"
            layout
          >
            {tokens.map((token, index) => (
              <motion.span
                key={token.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, delay: Math.min(index * 0.005, 0.4) }}
                onClick={() => setSelectedToken(token)}
                className={`inline-block border rounded px-1.5 py-0.5 text-xs font-mono cursor-pointer transition-colors ${getTypeStyles(token.type)}`}
              >
                {token.text}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Token Inspector Drawer */}
      <AnimatePresence>
        {selectedToken && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19] p-3 text-xs flex justify-between items-center"
          >
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Token Inspector
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                <span>Fragment: <code className="text-cyber-primary bg-slate-100 dark:bg-slate-900 px-1 rounded">"{selectedToken.text}"</code></span>
                <span>·</span>
                <span className={`font-semibold ${
                  selectedToken.type === 'injected' ? 'text-cyber-danger' : 
                  selectedToken.type === 'system' ? 'text-emerald-500' : 'text-cyber-primary'
                }`}>
                  {getTypeLabel(selectedToken.type)}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedToken(null)}
              className="text-[10px] px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
