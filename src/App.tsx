import React, { useState, useMemo } from 'react';
import { ELEMENTS } from './data/elements';
import { ElementData, ElementCategory } from './types/element';
import { PropertyMode } from './components/ElementCard';
import { Navbar, ActiveTab } from './components/Navbar';
import { FilterToolbar } from './components/FilterToolbar';
import { PeriodicTableGrid } from './components/PeriodicTableGrid';
import { ElementModal } from './components/ElementModal';
import { ComparisonModal } from './components/ComparisonModal';
import { ElementListView } from './components/ElementListView';
import { PeriodicTrendsView } from './components/PeriodicTrendsView';
import { AboutView } from './components/AboutView';
import { getStateAtTemperature } from './data/elements';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('table');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const [compareElement, setCompareElement] = useState<ElementData | null>(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [selectedState, setSelectedState] = useState<'all' | 'solid' | 'liquid' | 'gas'>('all');
  const [temperatureKelvin, setTemperatureKelvin] = useState<number>(293); // Room temperature ~20 °C
  const [propertyMode, setPropertyMode] = useState<PropertyMode>('standard');

  // Filtered elements calculation
  const filteredElements = useMemo(() => {
    return ELEMENTS.filter((el) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = el.name.toLowerCase().includes(q);
        const matchSymbol = el.symbol.toLowerCase() === q || el.symbol.toLowerCase().startsWith(q);
        const matchNumber = el.number.toString() === q;
        const matchGroup = `group ${el.group}` === q || `group ${el.group}`.includes(q);
        const matchPeriod = `period ${el.period}` === q;
        if (!matchName && !matchSymbol && !matchNumber && !matchGroup && !matchPeriod) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && el.category !== selectedCategory) {
        return false;
      }

      // State filter at current temperature
      if (selectedState !== 'all') {
        const currState = getStateAtTemperature(el, temperatureKelvin);
        if (currState !== selectedState) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedState, temperatureKelvin]);

  // Handle Random Atom
  const handleRandomElement = () => {
    const randomIndex = Math.floor(Math.random() * ELEMENTS.length);
    setSelectedElement(ELEMENTS[randomIndex]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedState('all');
    setTemperatureKelvin(293);
    setPropertyMode('standard');
  };

  // Count states at current temperature
  const stateCounts = useMemo(() => {
    let solids = 0;
    let liquids = 0;
    let gases = 0;
    let unknowns = 0;

    for (const el of ELEMENTS) {
      const st = getStateAtTemperature(el, temperatureKelvin);
      if (st === 'solid') solids++;
      else if (st === 'liquid') liquids++;
      else if (st === 'gas') gases++;
      else unknowns++;
    }

    return { solids, liquids, gases, unknowns };
  }, [temperatureKelvin]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 antialiased">
      {/* Top Bar matching Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRandomElement={handleRandomElement}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Sub-header Hero Kicker with Live Thermodynamic Phase Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-slate-800">118 Chemical Elements</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Standard Periodic System</span>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
            <span className="hidden sm:inline">IUPAC Calibrated</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] overflow-x-auto scrollbar-none py-0.5">
            <span className="flex items-center gap-1 text-slate-700 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
              <span>{stateCounts.solids} Solids</span>
            </span>
            <span className="flex items-center gap-1 text-blue-700 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span>{stateCounts.liquids} Liquids</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{stateCounts.gases} Gases</span>
            </span>
          </div>
        </div>

        {/* Global Filter & Temperature Simulation Toolbar (shown on Table and List views) */}
        {(activeTab === 'table' || activeTab === 'list') && (
          <FilterToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            temperatureKelvin={temperatureKelvin}
            setTemperatureKelvin={setTemperatureKelvin}
            propertyMode={propertyMode}
            setPropertyMode={setPropertyMode}
            onReset={handleResetFilters}
            totalVisible={filteredElements.length}
          />
        )}

        {/* Active Tab Views */}
        {activeTab === 'table' && (
          <div className="space-y-4">
            <PeriodicTableGrid
              elements={ELEMENTS}
              onSelectElement={(el) => setSelectedElement(el)}
              hoveredElement={hoveredElement}
              setHoveredElement={setHoveredElement}
              selectedCategory={selectedCategory}
              selectedState={selectedState}
              searchQuery={searchQuery}
              temperatureKelvin={temperatureKelvin}
              propertyMode={propertyMode}
            />
          </div>
        )}

        {activeTab === 'list' && (
          <ElementListView
            elements={filteredElements}
            onSelectElement={(el) => setSelectedElement(el)}
            temperatureKelvin={temperatureKelvin}
          />
        )}

        {activeTab === 'trends' && (
          <PeriodicTrendsView
            elements={ELEMENTS}
            onSelectElement={(el) => setSelectedElement(el)}
          />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Atomic Detail Inspector Modal */}
      {selectedElement && (
        <ElementModal
          element={selectedElement}
          temperatureKelvin={temperatureKelvin}
          onClose={() => setSelectedElement(null)}
          onSelectElement={(el) => setSelectedElement(el)}
          onOpenCompare={(el) => {
            setSelectedElement(null);
            setCompareElement(el);
          }}
        />
      )}

      {/* Side-by-Side Element Comparison Modal */}
      {compareElement && (
        <ComparisonModal
          initialElement={compareElement}
          onClose={() => setCompareElement(null)}
          onSelectElement={(el) => {
            setCompareElement(null);
            setSelectedElement(el);
          }}
        />
      )}

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Elemental</span>
            <span>·</span>
            <span>Interactive Periodic Table of the Elements</span>
          </div>
          <div>
            <span>Tap any element for detailed orbitals, states & atomic properties</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
