import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { LabsDashboard } from './views/LabsDashboard';
import { Workspace } from './views/Workspace';
import { OwaspMapping } from './views/OwaspMapping';
import { LearningCenter } from './views/LearningCenter';
import { TerminalMode } from './components/TerminalMode';
import { labsData } from './data/labsData';
import { exportSimulationReport } from './utils/reportHelper';
import { Download, Terminal as TermIcon } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeLabId, setActiveLabId] = useState<string>('direct-injection');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to cyber dark mode
  
  // Track completion and inputs
  const [completedLabIds, setCompletedLabIds] = useState<string[]>([]);
  const [customPayloads, setCustomPayloads] = useState<Record<string, string>>({});
  const [attackStatus, setAttackStatus] = useState<Record<string, boolean>>({});

  // Sync theme class to document body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLabComplete = (labId: string) => {
    if (!completedLabIds.includes(labId)) {
      setCompletedLabIds(prev => [...prev, labId]);
    }
    setAttackStatus(prev => ({ ...prev, [labId]: true }));
  };

  const handleExport = () => {
    const completedLabs = labsData.filter(lab => completedLabIds.includes(lab.id));
    exportSimulationReport(completedLabs, labsData.length, customPayloads, attackStatus);
  };

  const activeLab = labsData.find(lab => lab.id === activeLabId) || labsData[0];

  return (
    <div className="min-h-screen flex flex-col font-sans select-none antialiased text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#090D16] transition-colors duration-300">
      
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeLabId={activeLabId}
      />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <LandingPage setCurrentView={setCurrentView} />
        )}

        {currentView === 'labs' && (
          <LabsDashboard
            labs={labsData}
            setActiveLabId={setActiveLabId}
            setCurrentView={setCurrentView}
            completedLabIds={completedLabIds}
          />
        )}

        {currentView === 'workspace' && (
          <div className="flex flex-1">
            {/* Sidebar selector */}
            <Sidebar
              labs={labsData}
              activeLabId={activeLabId}
              setActiveLabId={setActiveLabId}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
              completedLabIds={completedLabIds}
            />
            
            {/* Workspace details */}
            <div className="flex-1 flex flex-col relative">
              <Workspace
                lab={activeLab}
                onLabComplete={handleLabComplete}
                customPayloads={customPayloads}
                setCustomPayloads={setCustomPayloads}
              />

              {/* Floating Action: Download Report */}
              <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('terminal')}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-350 shadow-lg hover:text-white transition-colors"
                  title="Open Hacker Shell"
                >
                  <TermIcon className="h-5 w-5" />
                </button>
                
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 rounded-full bg-cyber-primary text-white text-xs font-bold px-4 py-3 shadow-lg shadow-blue-500/20 hover:bg-blue-600 hover:shadow-blue-600/35 transition-all duration-200"
                  title="Export Markdown security assessment audit report"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export Audit Report</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'owasp' && (
          <OwaspMapping />
        )}

        {currentView === 'learn' && (
          <LearningCenter />
        )}

        {currentView === 'terminal' && (
          <div className="p-6 max-w-4xl mx-auto w-full my-auto flex flex-col justify-center">
            <TerminalMode />
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentView('workspace')}
                className="text-xs font-sans font-bold text-cyber-primary hover:underline"
              >
                &lt; Back to Visual Workspace
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-lg bg-cyber-primary text-white text-xs font-bold px-4 py-2 hover:bg-blue-600 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default App;
