import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Search, AlertCircle, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Lab } from '../data/labsData';

interface LabsDashboardProps {
  labs: Lab[];
  setActiveLabId: (id: string) => void;
  setCurrentView: (view: string) => void;
  completedLabIds: string[];
}

export const LabsDashboard: React.FC<LabsDashboardProps> = ({
  labs,
  setActiveLabId,
  setCurrentView,
  completedLabIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard' | 'Expert'>('All');

  // Filter labs based on search input and difficulty filter
  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = 
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.owasp.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (diff: 'Easy' | 'Medium' | 'Hard' | 'Expert') => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-250';
      case 'Medium': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-250';
      case 'Hard': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border-amber-250';
      case 'Expert': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450 border-rose-250';
    }
  };

  const getSeverityColor = (sev: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (sev) {
      case 'Low': return 'text-slate-500 bg-slate-100 dark:bg-slate-900';
      case 'Medium': return 'text-blue-500 bg-blue-50/50 dark:bg-blue-950/10';
      case 'High': return 'text-amber-600 bg-amber-55/10 dark:text-amber-400';
      case 'Critical': return 'text-rose-600 bg-rose-55/10 dark:text-rose-400 font-bold';
    }
  };

  const runLab = (labId: string) => {
    setActiveLabId(labId);
    setCurrentView('workspace');
  };

  // Completion Stats
  const completedCount = completedLabIds.length;
  const completionRate = Math.round((completedCount / labs.length) * 100);
  const averageRisk = Math.round(labs.reduce((acc, lab) => acc + lab.riskScore, 0) / labs.length);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-cyber-darkBg transition-colors duration-300 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Prompt Injection Security range
            </h1>
            <p className="font-sans text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select an vulnerability vector scenario card below to load the live simulation workspace.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 px-3.5 py-1 text-xs font-semibold text-cyber-primary dark:text-cyber-secondary font-mono">
            <Sparkles className="h-4 w-4" />
            <span>Progress: {completedCount} / {labs.length} Completed ({completionRate}%)</span>
          </div>
        </div>

        {/* Lab Status Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="block font-sans text-xs text-slate-500 dark:text-slate-400">Total Scenarios</span>
              <span className="font-mono text-2xl font-bold text-slate-850 dark:text-slate-200">12 Labs</span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-cyber-primary flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="block font-sans text-xs text-slate-500 dark:text-slate-400">Labs Completed</span>
              <span className="font-mono text-2xl font-bold text-cyber-success">{completedCount} Completed</span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-cyber-success flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="block font-sans text-xs text-slate-500 dark:text-slate-400">Mean Risk Coefficient</span>
              <span className="font-mono text-2xl font-bold text-cyber-warning">{averageRisk} / 100</span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-cyber-warning flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#111827]">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search labs by name, severity, vulnerability..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 font-sans text-sm focus:border-cyber-primary outline-none transition-colors"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400 mr-1.5">Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard', 'Expert'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium border transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-cyber-primary text-white border-cyber-primary'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#111827]">
              <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400 font-semibold">
                No labs match the active filters
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedDifficulty('All'); }}
                className="font-sans text-xs text-cyber-primary font-semibold underline mt-1.5 hover:text-blue-600"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredLabs.map((lab) => {
              const isCompleted = completedLabIds.includes(lab.id);

              return (
                <motion.div
                  key={lab.id}
                  layout
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 flex flex-col justify-between relative transition-shadow duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800/80 shadow-sm"
                >
                  {/* Glowing Effect on Active Hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/1 group-hover:to-indigo-500/1 transition-all pointer-events-none" />

                  {/* Card Header info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded border uppercase ${getDifficultyColor(lab.difficulty)}`}>
                        {lab.difficulty}
                      </span>
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded uppercase ${getSeverityColor(lab.severity)}`}>
                        {lab.severity}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-sans font-bold text-base text-slate-800 dark:text-white flex items-center gap-1.5 group-hover:text-cyber-primary transition-colors">
                        <span>{lab.name.split(' (')[0]}</span>
                        {isCompleted && (
                          <CheckCircle2 className="h-4.5 w-4.5 text-cyber-success shrink-0" />
                        )}
                      </h3>
                      <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-none mt-1">
                        {lab.category} Attack
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px]">
                      {lab.description}
                    </p>
                  </div>

                  {/* Card Footer actions */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      {lab.owasp.split(':')[0]}
                    </span>

                    <button
                      onClick={() => runLab(lab.id)}
                      className="flex items-center gap-1 rounded bg-slate-100 hover:bg-cyber-primary hover:text-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 px-3.5 py-1.5 font-sans font-bold transition-all duration-200"
                    >
                      <span>Simulate</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
