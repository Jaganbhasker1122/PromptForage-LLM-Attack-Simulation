import { Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] transition-colors duration-300 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyber-primary" />
            <div className="text-left">
              <span className="font-sans text-sm font-bold text-slate-800 dark:text-white">
                Prompt<span className="text-cyber-primary">Forge</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-slate-400 uppercase leading-none">
                LLM prompt injection range
              </span>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center md:text-left">
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Built by <span className="font-semibold text-slate-700 dark:text-slate-300">Gurram Jagan Bhasker</span>
            </p>
            <p className="font-mono text-[9px] text-slate-400 dark:text-slate-600 mt-1">
              © {currentYear} PromptForge Security Lab. All rights reserved. Educational simulation.
            </p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Jaganbhasker1122"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              title="GitHub Profile"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/gurramjaganbhasker/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyber-primary dark:text-slate-400 dark:hover:text-cyber-secondary hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              title="LinkedIn Profile"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://jaganbhasker-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-sans font-medium text-slate-500 hover:text-cyber-primary dark:text-slate-400 dark:hover:text-cyber-secondary transition-colors"
              title="Developer Portfolio"
            >
              <span>Portfolio</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
