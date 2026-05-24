import React from 'react';
import { Shield, Sun, Moon, Cpu } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeLabId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  darkMode,
  setDarkMode,
  activeLabId
}) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-primary text-white shadow-md shadow-blue-500/20">
              <Shield className="h-5 w-5" />
              <div className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-cyber-success animate-pulse" />
            </div>
            <div>
              <span className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Prompt<span className="text-cyber-primary">Forge</span>
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                GenAI Security Lab
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { id: 'home', label: 'Home' },
              { id: 'labs', label: 'Labs Dashboard' },
              { id: 'workspace', label: 'Simulation Workspace' },
              { id: 'owasp', label: 'OWASP Top 10' },
              { id: 'learn', label: 'Learning Center' }
            ].map((tab) => {
              const isActive = currentView === tab.id || (tab.id === 'workspace' && currentView === 'workspace');
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`relative py-2 text-sm font-medium transition-colors font-sans hover:text-cyber-primary dark:hover:text-cyber-secondary ${
                    isActive 
                      ? 'text-cyber-primary dark:text-cyber-secondary' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyber-primary dark:bg-cyber-secondary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Blinking Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1 text-xs border border-slate-200 dark:border-slate-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-success"></span>
              </span>
              <span className="font-mono text-[10px] uppercase text-slate-500 dark:text-slate-400">
                Guard: ACTIVE
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* CTA */}
            <button
              onClick={() => setCurrentView(activeLabId ? 'workspace' : 'labs')}
              className="hidden lg:flex items-center gap-1.5 rounded-lg bg-cyber-primary px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-600 hover:shadow-blue-600/25 transition-all duration-200"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{activeLabId ? 'Continue Lab' : 'Start Simulation'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
