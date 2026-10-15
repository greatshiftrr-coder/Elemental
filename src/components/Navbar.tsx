import React from 'react';
import { Shuffle } from 'lucide-react';

export type ActiveTab = 'table' | 'list' | 'trends' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRandomElement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRandomElement,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-8 px-3.5 sm:px-6 py-2.5 sm:py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab('table')}
          className="text-base sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors"
        >
          Elemental
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 overflow-x-auto scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`transition-colors whitespace-nowrap shrink-0 px-2 sm:px-2.5 py-1.5 rounded-lg ${
              activeTab === 'table'
                ? 'text-slate-900 font-bold bg-slate-100 sm:bg-transparent sm:underline underline-offset-8'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="hidden sm:inline">Periodic Table</span>
            <span className="sm:hidden">Table</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`transition-colors whitespace-nowrap shrink-0 px-2 sm:px-2.5 py-1.5 rounded-lg ${
              activeTab === 'list'
                ? 'text-slate-900 font-bold bg-slate-100 sm:bg-transparent sm:underline underline-offset-8'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="hidden sm:inline">Table View</span>
            <span className="sm:hidden">List</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trends')}
            className={`transition-colors whitespace-nowrap shrink-0 px-2 sm:px-2.5 py-1.5 rounded-lg ${
              activeTab === 'trends'
                ? 'text-slate-900 font-bold bg-slate-100 sm:bg-transparent sm:underline underline-offset-8'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="hidden sm:inline">Periodic Trends</span>
            <span className="sm:hidden">Trends</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`transition-colors whitespace-nowrap shrink-0 px-2 sm:px-2.5 py-1.5 rounded-lg ${
              activeTab === 'about'
                ? 'text-slate-900 font-bold bg-slate-100 sm:bg-transparent sm:underline underline-offset-8'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRandomElement}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-95 transition-all whitespace-nowrap shrink-0 shadow-xs min-h-[36px]"
            title="Inspect a random chemical element"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Random Atom</span>
            <span className="md:hidden">Random</span>
          </button>
        </div>
      </div>
    </header>
  );
};
