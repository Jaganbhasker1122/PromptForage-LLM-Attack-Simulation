import React from 'react';
import { 
  ShieldAlert, Lock, Terminal,
  ChevronLeft, ChevronRight, CheckCircle2, Play
} from 'lucide-react';
import type { Lab } from '../data/labsData';

interface SidebarProps {
  labs: Lab[];
  activeLabId: string;
  setActiveLabId: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  completedLabIds: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  labs,
  activeLabId,
  setActiveLabId,
  collapsed,
  setCollapsed,
  completedLabIds
}) => {
  const inactiveCategories = [
    { name: 'Adversarial Jailbreaks', count: 8 },
    { name: 'Model Data Leakage', count: 5 },
    { name: 'RAG Poisoning', count: 6 },
    { name: 'Excessive Agency Exploits', count: 4 }
  ];

  return (
    <aside 
      className={`relative h-[calc(100vh-4rem)] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Sidebar Header / Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        {!collapsed && (
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">
            Vector Library
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Active Category: Prompt Injection */}
        <div>
          {!collapsed && (
            <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-blue-50 dark:bg-blue-950/20 text-cyber-primary rounded-md">
              <ShieldAlert className="h-4 w-4" />
              <span className="font-sans text-xs font-bold uppercase tracking-wide">
                Prompt Injection Labs
              </span>
              <span className="ml-auto text-[10px] bg-cyber-primary text-white font-mono px-1.5 py-0.5 rounded-full">
                12
              </span>
            </div>
          )}

          <div className="space-y-1 mt-1">
            {labs.map((lab) => {
              const isActive = lab.id === activeLabId;
              const isCompleted = completedLabIds.includes(lab.id);

              return (
                <button
                  key={lab.id}
                  onClick={() => setActiveLabId(lab.id)}
                  className={`w-full text-left flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-sans transition-all duration-200 ${
                    isActive
                      ? 'bg-cyber-primary text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                  title={lab.name}
                >
                  {isCompleted ? (
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-cyber-success'}`} />
                  ) : (
                    <Play className={`h-3 w-3 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  )}

                  {!collapsed && (
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                      <div className="font-semibold text-xs leading-tight">{lab.name}</div>
                      <div className={`text-[9px] font-mono leading-none mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                        {lab.difficulty} · {lab.severity}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lock Categories: Coming Soon */}
        <div className="space-y-2">
          {!collapsed && (
            <span className="block font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              Advanced Security Focus (Soon)
            </span>
          )}
          
          <div className="space-y-1">
            {inactiveCategories.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-sans text-slate-400 dark:text-slate-600 cursor-not-allowed border border-dashed border-slate-200 dark:border-slate-800"
                title={`${cat.name} - Coming Soon`}
              >
                {collapsed ? (
                  <Lock className="h-3.5 w-3.5 mx-auto text-slate-400/60" />
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-slate-400/60" />
                    <span className="font-medium flex-1 text-left truncate">{cat.name}</span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono">
                      +{cat.count}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Footer info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B0F19]">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyber-primary" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
              Lab Console v1.0.4
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
