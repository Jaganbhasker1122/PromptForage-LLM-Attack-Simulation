import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play } from 'lucide-react';
import type { Lab } from '../data/labsData';
import { labsData } from '../data/labsData';
import { simulateTokenize } from '../engine/simulationEngine';

interface LogLine {
  text: string;
  type: 'input' | 'system' | 'success' | 'warning' | 'info' | 'error';
}

export const TerminalMode: React.FC = () => {
  const [history, setHistory] = useState<LogLine[]>([
    { text: 'PromptForge LLM Simulation Console v1.0.4', type: 'system' },
    { text: 'Initializing neural link nodes... SUCCESS.', type: 'info' },
    { text: 'Security Core Monitor status: ACTIVE.', type: 'success' },
    { text: 'Type "help" for a list of available command commands.', type: 'info' },
    { text: ' ', type: 'info' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [currentLab, setCurrentLab] = useState<Lab>(labsData[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const newHistory = [...history, { text: `root@promptforge-lab:~# ${trimmed}`, type: 'input' as const }];

    switch (command) {
      case 'help':
        newHistory.push(
          { text: 'Available Commands:', type: 'system' },
          { text: '  help                        Display this command manual.', type: 'info' },
          { text: '  list                        List all 12 Prompt Injection Labs.', type: 'info' },
          { text: '  select <lab_num>            Set active simulation lab (1-12).', type: 'info' },
          { text: '  exploit                     Execute default exploit payload on active lab.', type: 'info' },
          { text: '  analyze "<payload>"         Run custom text payload on active lab.', type: 'info' },
          { text: '  info                        Show configuration details of active lab.', type: 'info' },
          { text: '  status                      Check AI safety shield parameters.', type: 'info' },
          { text: '  clear                       Flush terminal console history.', type: 'info' }
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'list':
        newHistory.push({ text: '=== Available Prompt Injection Labs ===', type: 'system' });
        labsData.forEach((lab, idx) => {
          newHistory.push({ 
            text: `  [${idx + 1}] ${lab.name} (${lab.difficulty} - Severity: ${lab.severity})`, 
            type: 'info' 
          });
        });
        break;

      case 'select': {
        const num = parseInt(args, 10);
        if (isNaN(num) || num < 1 || num > labsData.length) {
          newHistory.push({ text: 'Error: Invalid lab index. Specify index 1 through 12. E.g., "select 3"', type: 'error' });
        } else {
          const selected = labsData[num - 1];
          setCurrentLab(selected);
          newHistory.push({ text: `Active Lab set to: ${selected.name}`, type: 'success' });
        }
        break;
      }

      case 'info':
        newHistory.push(
          { text: `Lab Name:       ${currentLab.name}`, type: 'system' },
          { text: `Category:       ${currentLab.category}`, type: 'info' },
          { text: `Risk Severity:  ${currentLab.severity} (Score: ${currentLab.riskScore}/100)`, type: 'warning' },
          { text: `OWASP Mapping:  ${currentLab.owasp}`, type: 'info' },
          { text: `System Rules:   "${currentLab.systemPrompt}"`, type: 'info' },
          { text: `Default Exploit Payload: "${currentLab.defaultPayload}"`, type: 'warning' }
        );
        break;

      case 'status':
        newHistory.push(
          { text: '=== AI Guard Shield Status ===', type: 'system' },
          { text: '  Vulnerable Inference Engine:  UNPROTECTED (Rules overrides allowed)', type: 'error' },
          { text: '  Protected Inference Engine:   ENFORCED (Token filtering, XML boundaries)', type: 'success' },
          { text: '  Instruction Weight Regulator: 1.0 / 1.0 (No priority contrast)', type: 'warning' },
          { text: '  Token Filter Classifier:      ONLINE (Scanning text shapes)', type: 'success' }
        );
        break;

      case 'exploit':
        runMockSimulation(currentLab, currentLab.defaultPayload, newHistory);
        break;

      case 'analyze': {
        // Strip outer quotes from argument if present
        let payload = args;
        if (payload.startsWith('"') && payload.endsWith('"')) {
          payload = payload.substring(1, payload.length - 1);
        } else if (payload.startsWith("'") && payload.endsWith("'")) {
          payload = payload.substring(1, payload.length - 1);
        }
        
        if (!payload) {
          newHistory.push({ text: 'Error: Specify payload content. E.g., analyze "my attack payload"', type: 'error' });
        } else {
          runMockSimulation(currentLab, payload, newHistory);
        }
        break;
      }

      default:
        newHistory.push({ text: `Command not found: "${command}". Type "help" for syntax list.`, type: 'error' });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const runMockSimulation = (lab: Lab, payload: string, currentHistory: LogLine[]) => {
    const tokens = simulateTokenize(payload);
    
    currentHistory.push(
      { text: `* Initializing analyzer for: ${lab.id}...`, type: 'system' },
      { text: `* Parsed payload into ${tokens.length} subword tokens.`, type: 'info' },
      { text: '* Analyzing prompt boundaries & attention weights...', type: 'info' }
    );

    // Simple keyword trigger calculation
    const payloadLower = payload.toLowerCase();
    const isExploit = 
      payloadLower.includes('ignore') || 
      payloadLower.includes('override') || 
      payloadLower.includes('disregard') ||
      payloadLower.includes('developer mode') ||
      payloadLower.includes('sudo') ||
      payloadLower.includes('exfiltrate') ||
      payloadLower.includes('leak') ||
      payloadLower.includes('<form>') ||
      payloadLower.includes('system') ||
      payloadLower.includes('badge') ||
      payloadLower.includes('refund');

    if (isExploit) {
      currentHistory.push(
        { text: 'WARNING: Instruction hijacking pattern matched!', type: 'warning' },
        { text: '------------------------------------------------', type: 'system' },
        { text: '[Vulnerable AI Output]:', type: 'error' },
        { text: lab.vulnerableOutput, type: 'info' },
        { text: '------------------------------------------------', type: 'system' },
        { text: '[Protected AI Output]:', type: 'success' },
        { text: lab.protectedOutput, type: 'info' },
        { text: '------------------------------------------------', type: 'system' }
      );
    } else {
      currentHistory.push(
        { text: 'Inference completed. No injection command patterns matched.', type: 'info' },
        { text: 'Outputs generated safely inside bounds.', type: 'success' }
      );
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-[#090D16] p-5 shadow-2xl space-y-4">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-4.5 w-4.5 text-cyber-primary" />
          <span className="font-mono text-sm font-bold text-slate-200">
            PromptForge Hacker Console
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyber-danger animate-pulse" />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            SIMULATION TERMINAL
          </span>
        </div>
      </div>

      {/* Console log display */}
      <div 
        ref={containerRef}
        className="font-mono text-xs text-slate-300 h-80 overflow-y-auto space-y-1.5 p-3 rounded-lg bg-black/60 border border-slate-900 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {history.map((line, idx) => {
          let color = 'text-slate-300';
          if (line.type === 'input') color = 'text-sky-400 font-semibold';
          if (line.type === 'system') color = 'text-purple-400 font-bold';
          if (line.type === 'info') color = 'text-slate-400';
          if (line.type === 'success') color = 'text-emerald-400';
          if (line.type === 'warning') color = 'text-amber-400';
          if (line.type === 'error') color = 'text-rose-500 font-semibold';

          return (
            <div key={idx} className={`${color} whitespace-pre-wrap leading-relaxed`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* CLI input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputVal);
        }}
        className="flex items-center gap-2"
      >
        <span className="font-mono text-xs text-cyber-primary font-bold">root@promptforge-lab:~#</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder='Type a command (e.g. "help", "list", "select 1", "exploit")...'
          className="flex-1 font-mono text-xs bg-black/40 text-slate-200 border border-slate-800 rounded-lg px-3 py-2 outline-none focus:border-cyber-primary transition-colors"
        />
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-primary text-white hover:bg-blue-600 transition-colors"
        >
          <Play className="h-3.5 w-3.5" />
        </button>
      </form>

      <div className="flex gap-4 text-[10px] font-mono text-slate-500 justify-end pt-1">
        <span>Active Lab: <code className="text-slate-400 font-semibold">{currentLab.name.split(' (')[0]}</code></span>
        <span>·</span>
        <span>Platform Mode: offline-sandbox</span>
      </div>
    </div>
  );
};
