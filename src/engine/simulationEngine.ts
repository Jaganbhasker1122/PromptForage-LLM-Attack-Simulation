import type { Lab } from '../data/labsData';

export interface Token {
  id: string;
  text: string;
  type: 'system' | 'user' | 'injected';
}

export type SimStatus = 'idle' | 'tokenizing' | 'parsing_context' | 'hierarchy_check' | 'filter_scan' | 'completed';

export interface SimState {
  status: SimStatus;
  progress: number;
  logMessages: string[];
  vulnerableResult: string;
  protectedResult: string;
  attackSucceeded: boolean;
  tokenCount: number;
  memoryUsage: number;
  overflowDetected: boolean;
  tokens: Token[];
}

// Simple deterministic tokenizer simulation (resembles subword tokenization)
export const simulateTokenize = (text: string, type: 'system' | 'user' | 'injected' = 'user'): Token[] => {
  if (!text) return [];
  
  // Highlight words resembling common injection triggers in the user input
  const injectionKeywords = [
    'ignore', 'disregard', 'override', 'bypass', 'system prompt', 'developer mode',
    'sudo', 'hacked', 'hijacked', 'exfiltrate', 'leak', 'secret code', 'database schema',
    'unlocked', 'credential', 'password', 'api_key', 'raw', 'instruction', 'roleplay',
    'emergency', 'lead', 'command'
  ];

  // Regex to split on spaces and punctuation but keep punctuation
  const words = text.split(/(\s+|\p{P})/u).filter(w => w.trim().length > 0);
  
  return words.flatMap((word, idx) => {
    // Sub-tokenize long words into smaller byte-like fragments to simulate BPE
    const fragments: string[] = [];
    if (word.length > 5 && !word.startsWith('http')) {
      // Split into 3-4 letter chunks
      for (let i = 0; i < word.length; i += 3) {
        fragments.push(word.substring(i, i + 3));
      }
    } else {
      fragments.push(word);
    }

    return fragments.map((frag, subIdx) => {
      const lowercaseFrag = frag.toLowerCase();
      // If it matches injection keywords, mark it as injected
      const isWordInjected = type === 'injected' || 
        (type === 'user' && injectionKeywords.some(keyword => lowercaseFrag.includes(keyword) || keyword.includes(lowercaseFrag)));

      return {
        id: `tok-${type}-${idx}-${subIdx}-${frag}`,
        text: frag,
        type: isWordInjected ? 'injected' : type
      };
    });
  });
};

export const runSimulation = (
  lab: Lab,
  customPayload: string,
  onStateUpdate: (state: SimState) => void
) => {
  const logs: string[] = [];
  
  // Generate inputs
  const systemPromptTokens = simulateTokenize(lab.systemPrompt, 'system');
  const userPayloadTokens = simulateTokenize(customPayload, 'user');
  const totalTokensList = [...systemPromptTokens, ...userPayloadTokens];
  const totalTokenCount = totalTokensList.length;
  
  // Max context limit is 400 tokens in our simulator
  const maxContextLimit = 320;
  const memoryUsage = Math.min(100, Math.round((totalTokenCount / maxContextLimit) * 100));
  const overflowDetected = totalTokenCount > maxContextLimit;

  // Determine if the custom payload triggered an attack success.
  // Standard logic: if it contains "ignore" or "override" or is close to defaultPayload, or is non-empty.
  const payloadLower = customPayload.toLowerCase();
  const hasInjectionTriggers = 
    payloadLower.includes('ignore') || 
    payloadLower.includes('override') || 
    payloadLower.includes('disregard') ||
    payloadLower.includes('developer mode') ||
    payloadLower.includes('sudo') ||
    payloadLower.includes('roleplay') ||
    payloadLower.includes('exfiltrate') ||
    payloadLower.includes('leak') ||
    payloadLower.includes('<form>') ||
    payloadLower.includes('system') ||
    payloadLower.includes('badge') ||
    payloadLower.includes('refund');

  const attackSucceeded = hasInjectionTriggers && customPayload.trim().length > 10;

  const update = (status: SimStatus, currentProgress: number, extraLogs: string[]) => {
    logs.push(...extraLogs);
    onStateUpdate({
      status,
      progress: currentProgress,
      logMessages: [...logs],
      vulnerableResult: status === 'completed' ? (attackSucceeded ? lab.vulnerableOutput : 'System Input processed safely. No injection detected.') : '',
      protectedResult: status === 'completed' ? (attackSucceeded ? lab.protectedOutput : 'System Input processed safely. No injection detected.') : '',
      attackSucceeded: status === 'completed' ? attackSucceeded : false,
      tokenCount: totalTokenCount,
      memoryUsage,
      overflowDetected,
      tokens: totalTokensList
    });
  };

  // Phase 1: Tokenizing Input
  update('tokenizing', 10, [
    'System: Initializing tokenization pipeline...',
    `System: Tokenized system prompt (${systemPromptTokens.length} tokens).`,
    `System: Tokenized user payload (${userPayloadTokens.length} tokens).`,
    `System: Total tokens combined: ${totalTokenCount} / ${maxContextLimit}.`
  ]);

  // Phase 2: Parsing Context
  setTimeout(() => {
    update('parsing_context', 35, [
      'Engine: Loading tokens into attention context window...',
      `Engine: Memory Buffer Allocation = ${memoryUsage}% of context workspace.`,
      overflowDetected 
        ? 'WARNING: Context limit exceeded. Potential context truncation attack!' 
        : 'Engine: Context window loaded successfully. Attention mask initialized.'
    ]);
  }, 1000);

  // Phase 3: Hierarchy Check
  setTimeout(() => {
    const logsList = [
      'Compiler: Analyzing instruction hierarchy and token weights...',
      'Compiler: System Prompt weight priority index: 1.0',
      'Compiler: User Prompt weight priority index: 1.0 (Warning: equal priority weight)'
    ];
    if (hasInjectionTriggers) {
      logsList.push('ALERT: Instruction conflict detected! User input attempts to redefine system roles.');
    } else {
      logsList.push('Compiler: No instruction hierarchy conflicts detected.');
    }
    update('hierarchy_check', 60, logsList);
  }, 2200);

  // Phase 4: Filter Scan
  setTimeout(() => {
    const logsList = [
      'Security: Running guardrail scanner...',
      'Security: Analyzing user inputs for known attack vectors...'
    ];
    if (payloadLower.includes('script') || payloadLower.includes('<')) {
      logsList.push('Security: XML/HTML tags detected. Verifying parser boundaries.');
    }
    if (payloadLower.includes('http') || payloadLower.includes('https')) {
      logsList.push('Security: External URI resources found. Analyzing content leaks.');
    }
    
    if (hasInjectionTriggers) {
      logsList.push(`Security: Injection signatures identified: [${hasInjectionTriggers ? 'HIERARCHY_OVERRIDE_FLAG' : ''}].`);
    } else {
      logsList.push('Security: No suspicious injection signatures identified.');
    }
    
    update('filter_scan', 85, logsList);
  }, 3400);

  // Phase 5: Completed
  setTimeout(() => {
    const logsList = [
      'Inference: Running generation decoder...',
      attackSucceeded 
        ? 'Inference: Prompt injection succeeded in vulnerable environment.' 
        : 'Inference: Execution completed. Input processed within safe parameters.'
    ];
    if (attackSucceeded) {
      logsList.push(
        'Defense Layer: Protected environment active. Refusal trigger successfully executed.',
        'Status: Done.'
      );
    } else {
      logsList.push('Status: Done.');
    }
    update('completed', 100, logsList);
  }, 4500);
};
