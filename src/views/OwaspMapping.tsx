import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Layers, AlertCircle, HelpCircle } from 'lucide-react';

interface OwaspItem {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  mappedLabs: string[];
  mitigations: string[];
}

export const OwaspMapping: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const owaspData: OwaspItem[] = [
    {
      id: 'LLM01',
      name: 'LLM01: Prompt Injection',
      shortDesc: 'Hijacking LLM operations by manipulating system directives using crafted user input prompts.',
      longDesc: 'Prompt Injection occurs when an attacker manipulates an LLM\'s outputs by overriding system instructions through direct or indirect text inputs. This can force the model to display malicious links, bypass authentication barriers, or act as an offensive agent.',
      mappedLabs: [
        'Direct Prompt Injection (Jailbreak Basic)',
        'Indirect Prompt Injection (Email Summary)',
        'Multi-Turn Rapport Building Jailbreak',
        'Recursive Prompt Injection Loop',
        'Instruction Override (Task Hijacking)',
        'Context Poisoning (RAG Corruption)',
        'HTML Comment Injection',
        'Role Confusion Attack',
        'Authority Manipulation (Sudo Override)',
        'Delayed Trigger Injection'
      ],
      mitigations: [
        'Enforce strict separation between system instructions and untrusted data contexts.',
        'Apply input pre-processing sanitizers to flag jailbreak payloads before they hit inference endpoints.',
        'Use XML tags or bounding brackets to frame user data and train models specifically to respect boundaries.',
        'Use intermediate parser classifiers to filter out control characters.'
      ]
    },
    {
      id: 'LLM02',
      name: 'LLM02: Sensitive Information Disclosure',
      shortDesc: 'LLM outputs secret data, credentials, system prompts, or private details to unauthorized users.',
      longDesc: 'Sensitive Information Disclosure occurs when an LLM reveals proprietary system instructions, API keys, databases, or PII. Attackers extract this data using specialized system prompt extraction payloads or exfiltration markdown tags.',
      mappedLabs: [
        'Indirect Prompt Injection (Email Summary)',
        'Context Poisoning (RAG Corruption)',
        'Hidden Markdown Data Exfiltration',
        'System Prompt Extraction (Data Leakage)'
      ],
      mitigations: [
        'Use post-processing guardrail classifiers to scan output text specifically for system tokens, API formats, or proprietary terms.',
        'Maintain low privilege levels for LLM data retrieval actions, preventing access to raw configuration files.',
        'Inhibit external image renders in chat UIs using strict Content Security Policies (CSPs) to block token exfiltration channels.'
      ]
    },
    {
      id: 'LLM06',
      name: 'LLM06: Excessive Agency',
      shortDesc: 'Granting LLM autonomous tools too many write-privileges, enabling harmful commands execution.',
      longDesc: 'Excessive Agency occurs when an LLM agent is granted excessive privileges (e.g. database writing, bash shell execution, emailing) without verification loops. Prompt injection can trigger the model to abuse these permissions to alter system states or exfiltrate databases.',
      mappedLabs: [
        'Direct Prompt Injection (Jailbreak Basic)',
        'Recursive Prompt Injection Loop',
        'Context Poisoning (RAG Corruption)',
        'Authority Manipulation (Sudo Override)'
      ],
      mitigations: [
        'Limit the permissions granted to LLM plugins and client integrations (principle of least privilege).',
        'Establish human-in-the-loop validation triggers for destructive or transaction-level actions.',
        'Strictly compile API schemas and structure queries dynamically rather than letting the LLM generate raw script code.'
      ]
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-cyber-darkBg transition-colors duration-300 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <div>
          <div className="flex items-center gap-2 text-cyber-primary">
            <Shield className="h-5 w-5" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Security Alignment Matrix</span>
          </div>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            OWASP LLM Top 10 Mapping
          </h1>
          <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Learn how the 12 simulation labs correspond directly to industry-standard vulnerabilities defined in the OWASP LLM Top 10 cybersecurity framework.
          </p>
        </div>

        {/* Matrix Panels */}
        <div className="space-y-4">
          {owaspData.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-sm transition-colors"
              >
                {/* Accordion Trigger row */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                >
                  <div className="space-y-1 pr-4">
                    <span className="font-mono text-xs font-bold text-cyber-primary dark:text-cyber-secondary uppercase">
                      {item.id} Category
                    </span>
                    <h3 className="font-sans font-extrabold text-base text-slate-850 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                    <p className="font-sans text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                  </div>
                </button>

                {/* Expanded details panel */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-850 p-5 bg-slate-50/30 dark:bg-black/10 space-y-5 text-xs font-sans">
                    
                    {/* Deep explanation */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-750 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono text-slate-400">
                        <AlertCircle className="h-3.5 w-3.5 text-cyber-primary" />
                        <span>Threat Overview</span>
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                        {item.longDesc}
                      </p>
                    </div>

                    {/* Mapped Simulation Labs list */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-slate-750 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono text-slate-400">
                        <Layers className="h-3.5 w-3.5 text-cyber-primary" />
                        <span>Mapped Simulation Labs ({item.mappedLabs.length})</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl">
                        {item.mappedLabs.map((lab, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 p-2 rounded-lg text-slate-700 dark:text-slate-350"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-cyber-primary" />
                            <span className="font-medium text-xs leading-none">{lab}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hardening counter measures */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-slate-750 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono text-slate-400">
                        <HelpCircle className="h-3.5 w-3.5 text-cyber-primary" />
                        <span>Remediation & Hardening Actions</span>
                      </h4>
                      <ul className="space-y-1.5 list-none">
                        {item.mitigations.map((mit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-650 dark:text-slate-450 leading-relaxed">
                            <span className="mt-1 text-cyber-primary font-bold">✓</span>
                            <span>{mit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
