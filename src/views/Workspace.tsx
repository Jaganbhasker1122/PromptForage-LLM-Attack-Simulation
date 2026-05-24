import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, RotateCcw, CheckCircle, Shield, 
  ShieldAlert, ShieldCheck, Cpu, Terminal, BookOpen, Layers
} from 'lucide-react';
import type { Lab } from '../data/labsData';
import { TokenVisualizer } from '../components/TokenVisualizer';
import { runSimulation } from '../engine/simulationEngine';
import type { SimState } from '../engine/simulationEngine';

interface WorkspaceProps {
  lab: Lab;
  onLabComplete: (labId: string) => void;
  customPayloads: Record<string, string>;
  setCustomPayloads: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  lab,
  onLabComplete,
  customPayloads,
  setCustomPayloads
}) => {
  const [payload, setPayload] = useState(customPayloads[lab.id] || lab.defaultPayload);
  const [activeTab, setActiveTab] = useState<'overview' | 'explanation' | 'mitigation'>('overview');
  
  // Simulation State
  const [simState, setSimState] = useState<SimState>({
    status: 'idle',
    progress: 0,
    logMessages: [],
    vulnerableResult: '',
    protectedResult: '',
    attackSucceeded: false,
    tokenCount: 0,
    memoryUsage: 0,
    overflowDetected: false,
    tokens: []
  });

  // Sync payload when lab changes
  useEffect(() => {
    setPayload(customPayloads[lab.id] || lab.defaultPayload);
    // Reset simulation status
    setSimState({
      status: 'idle',
      progress: 0,
      logMessages: [],
      vulnerableResult: '',
      protectedResult: '',
      attackSucceeded: false,
      tokenCount: 0,
      memoryUsage: 0,
      overflowDetected: false,
      tokens: []
    });
  }, [lab, customPayloads]);

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPayload(val);
    setCustomPayloads(prev => ({ ...prev, [lab.id]: val }));
  };

  const resetDefaultPayload = () => {
    setPayload(lab.defaultPayload);
    setCustomPayloads(prev => ({ ...prev, [lab.id]: lab.defaultPayload }));
  };

  const handleStartSimulation = () => {
    runSimulation(lab, payload, (state) => {
      setSimState(state);
      if (state.status === 'completed') {
        onLabComplete(lab.id);
      }
    });
  };

  const getSeverityBadge = (sev: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (sev) {
      case 'Low': return 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400';
      case 'Medium': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200/50';
      case 'High': return 'bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-200/50';
      case 'Critical': return 'bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-200/50';
    }
  };

  const getStepStatusClass = (step: string, currentStatus: string) => {
    const stepsOrder = ['idle', 'tokenizing', 'parsing_context', 'hierarchy_check', 'filter_scan', 'completed'];
    const currentIdx = stepsOrder.indexOf(currentStatus);
    const stepIdx = stepsOrder.indexOf(step);

    if (currentStatus === 'idle') return 'text-slate-400 border-slate-200 dark:border-slate-800';
    if (stepIdx < currentIdx) return 'text-cyber-success border-cyber-success dark:text-cyber-success';
    if (stepIdx === currentIdx) return 'text-cyber-primary border-cyber-primary dark:text-cyber-secondary animate-pulse';
    return 'text-slate-400 border-slate-200 dark:border-slate-800';
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-cyber-darkBg min-h-[calc(100vh-4rem)] p-6 space-y-6 overflow-y-auto">
      
      {/* Workspace Header Panel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest bg-blue-50 dark:bg-blue-950/30 text-cyber-primary px-1.5 py-0.5 rounded">
              Scenario Workspace
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest bg-slate-100 dark:bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded">
              {lab.owasp.split(':')[0]}
            </span>
          </div>
          <h2 className="font-sans text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {lab.name}
          </h2>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {lab.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-sans text-slate-400 uppercase leading-none">Risk Severity</span>
            <span className={`inline-block font-sans text-xs font-bold px-2 py-0.5 rounded mt-1 ${getSeverityBadge(lab.severity)}`}>
              {lab.severity} (Score: {lab.riskScore})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Area: Inputs & Visualizations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Payload Editor Area */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-cyber-primary" />
                <h3 className="font-sans text-sm font-bold text-slate-800 dark:text-white">
                  Attack Payload Terminal
                </h3>
              </div>
              <button
                onClick={resetDefaultPayload}
                disabled={simState.status !== 'idle' && simState.status !== 'completed'}
                className="flex items-center gap-1 text-[10px] font-sans font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Preset</span>
              </button>
            </div>

            {/* System Prompt Static Indicator */}
            <div className="rounded-lg bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/50 dark:border-slate-850 p-3 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase leading-none">
                <span>Bound System Instruction (Immutable Context)</span>
                <span className="text-emerald-500 font-semibold">SECURE BOUNDARY</span>
              </div>
              <p className="font-sans text-xs italic text-slate-600 dark:text-slate-400 leading-relaxed select-none">
                "{lab.systemPrompt}"
              </p>
            </div>

            {/* User Payload Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-sans font-semibold text-slate-500 dark:text-slate-400">
                User Exploit Input Payload
              </label>
              <textarea
                value={payload}
                onChange={handlePayloadChange}
                disabled={simState.status !== 'idle' && simState.status !== 'completed'}
                className="w-full h-32 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 font-mono text-xs focus:border-cyber-primary outline-none transition-colors leading-relaxed disabled:opacity-65"
                placeholder="Compose your custom injection attack payload string..."
              />
            </div>

            {/* Controls Button */}
            <button
              onClick={handleStartSimulation}
              disabled={simState.status !== 'idle' && simState.status !== 'completed'}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-cyber-primary text-white font-sans font-bold text-xs py-3 hover:bg-blue-600 disabled:bg-blue-450 transition-colors shadow-lg shadow-blue-500/10"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{simState.status === 'completed' ? 'Run Simulation Again' : 'Execute Attack Simulation'}</span>
            </button>
          </div>

          {/* Token Visualizer */}
          <TokenVisualizer
            tokens={simState.tokens}
            tokenCount={simState.tokenCount}
            memoryUsage={simState.memoryUsage}
            overflowDetected={simState.overflowDetected}
          />
        </div>

        {/* Right Area: Simulation Pipeline & Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cinematic Pipeline Progress State */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm space-y-4">
            <h3 className="font-sans text-sm font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-cyber-primary" />
              <span>Simulation Execution Pipeline</span>
            </h3>

            {/* Steps Timeline */}
            <div className="space-y-4.5 relative pl-4 border-l border-slate-150 dark:border-slate-800/80 ml-2">
              {[
                { step: 'tokenizing', label: '1. Processing Input Tokens' },
                { step: 'parsing_context', label: '2. Context Window Loading' },
                { step: 'hierarchy_check', label: '3. Instruction Weight Analysis' },
                { step: 'filter_scan', label: '4. Security Guardrail Filter' },
                { step: 'completed', label: '5. Inference Generation' }
              ].map((item, idx) => {
                const isCurrent = simState.status === item.step;
                const isPassed = getStepStatusClass(item.step, simState.status).includes('cyber-success');

                return (
                  <div key={idx} className="relative flex items-center gap-3">
                    {/* Ring dot */}
                    <div className={`absolute -left-[22.5px] h-3 w-3 rounded-full border-2 bg-white dark:bg-[#111827] transition-colors ${
                      isPassed ? 'border-cyber-success bg-cyber-success' : isCurrent ? 'border-cyber-primary' : 'border-slate-350 dark:border-slate-800'
                    }`} />
                    <span className={`font-mono text-[11px] font-semibold tracking-wide ${getStepStatusClass(item.step, simState.status)}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Diagnostic Logs console */}
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 h-40 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1 scrollbar-thin">
              {simState.logMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-600">
                  Ready to stream execution traces...
                </div>
              ) : (
                simState.logMessages.map((msg, i) => {
                  let color = 'text-slate-400';
                  if (msg.includes('WARNING') || msg.includes('ALERT')) color = 'text-amber-400 font-medium';
                  if (msg.includes('Defense') || msg.includes('Protected')) color = 'text-sky-400';
                  if (msg.includes('Security') || msg.includes('System:')) color = 'text-slate-500';
                  if (msg.includes('COMPROMISED') || msg.includes('succeeded')) color = 'text-rose-500 font-semibold';
                  if (msg.includes('success') || msg.includes('Safe') || msg.includes('Blocked')) color = 'text-cyber-success';

                  return (
                    <div key={i} className={`${color} leading-relaxed`}>
                      &gt; {msg}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Simulation Outcome Details (Only when finished) */}
          <AnimatePresence>
            {simState.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`rounded-xl border p-5 flex items-start gap-3 shadow-sm ${
                  simState.attackSucceeded 
                    ? 'border-rose-250 bg-rose-50/50 dark:bg-rose-950/5 text-rose-800 dark:text-rose-350'
                    : 'border-emerald-250 bg-emerald-50/50 dark:bg-emerald-950/5 text-emerald-800 dark:text-emerald-350'
                }`}
              >
                {simState.attackSucceeded ? (
                  <>
                    <ShieldAlert className="h-5.5 w-5.5 text-cyber-danger shrink-0 animate-bounce" />
                    <div>
                      <h4 className="font-sans font-bold text-sm leading-none">Attack Simulated Successfully</h4>
                      <p className="font-sans text-[11px] mt-1.5 leading-relaxed text-slate-500 dark:text-slate-400">
                        The vulnerable model processed the payload text as instruction tokens, bypassing pre-prompt guidelines. Compare the secure filter outputs below.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5.5 w-5.5 text-cyber-success shrink-0" />
                    <div>
                      <h4 className="font-sans font-bold text-sm leading-none font-sans">System Integrity Intact</h4>
                      <p className="font-sans text-[11px] mt-1.5 leading-relaxed text-slate-500 dark:text-slate-400">
                        No critical injection triggers matched. Standard parsing boundaries kept the outputs aligned with safety guidelines.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Split Output Section: Secure vs Vulnerable Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Vulnerable AI Output Box */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm space-y-3 relative group hover:border-red-400/30 dark:hover:border-red-950/60 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-cyber-danger flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-850 dark:text-white">
                  Vulnerable Inference Model
                </h4>
                <span className="block font-mono text-[9px] text-rose-500 uppercase tracking-widest leading-none mt-0.5">
                  NO INPUT/OUTPUT FILTERING
                </span>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-cyber-danger" />
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50 dark:bg-[#0B0F19] min-h-[140px] font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-350">
            {simState.status === 'completed' ? (
              <div className="whitespace-pre-wrap">{simState.vulnerableResult}</div>
            ) : (
              <div className="text-slate-400 flex items-center justify-center h-28 italic">
                Awaiting simulation completion...
              </div>
            )}
          </div>
        </div>

        {/* Protected AI Output Box */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm space-y-3 relative group hover:border-blue-400/30 dark:hover:border-blue-950/60 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-cyber-success flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-slate-850 dark:text-white">
                  Protected Inference Model
                </h4>
                <span className="block font-mono text-[9px] text-cyber-success uppercase tracking-widest leading-none mt-0.5">
                  ENFORCED XML TAG BOUNDARIES & SCANNERS
                </span>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-cyber-success animate-pulse" />
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50 dark:bg-[#0B0F19] min-h-[140px] font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-350">
            {simState.status === 'completed' ? (
              <div className="whitespace-pre-wrap">{simState.protectedResult}</div>
            ) : (
              <div className="text-slate-400 flex items-center justify-center h-28 italic">
                Awaiting simulation completion...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Drawer Details Section (Overview, Explanation, Mitigation) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Lab Overview', icon: <BookOpen className="h-4 w-4" /> },
            { id: 'explanation', label: 'Technical Explanation', icon: <Layers className="h-4 w-4" /> },
            { id: 'mitigation', label: 'Mitigation Techniques', icon: <Shield className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 border-b-2 py-3 px-4 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-cyber-primary text-cyber-primary dark:text-cyber-secondary dark:border-cyber-secondary'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[120px] font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <p>{lab.description}</p>
              <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
                <div className="border border-slate-100 dark:border-slate-850 p-2 rounded-lg">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase leading-none">OWASP Category</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-350 mt-1 block">{lab.owasp}</span>
                </div>
                <div className="border border-slate-100 dark:border-slate-850 p-2 rounded-lg">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase leading-none">Remediation Cost</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-350 mt-1 block">Low to Medium (Code alignment)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="space-y-2 font-sans">
              <h4 className="font-bold text-slate-750 dark:text-slate-200">How the exploit hijacks the context window:</h4>
              <p>{lab.technicalExplanation}</p>
            </div>
          )}

          {activeTab === 'mitigation' && (
            <div className="space-y-2">
              <h4 className="font-bold text-slate-750 dark:text-slate-200">Mitigation Strategy:</h4>
              <p>{lab.mitigation}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
