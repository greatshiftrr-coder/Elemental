import React, { useEffect, useState } from 'react';
import { ElementData } from '../types/element';
import { CATEGORIES } from '../data/categories';
import { getStateAtTemperature, getElementByNumber } from '../data/elements';
import { BohrModel } from './BohrModel';
import { X, ChevronLeft, ChevronRight, Scale, Sparkles, BookOpen, Atom, Flame, Layers } from 'lucide-react';

interface ElementModalProps {
  element: ElementData | null;
  temperatureKelvin: number;
  onClose: () => void;
  onSelectElement: (el: ElementData) => void;
  onOpenCompare?: (el: ElementData) => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  temperatureKelvin,
  onClose,
  onSelectElement,
  onOpenCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'atomic' | 'thermal' | 'history'>('overview');

  useEffect(() => {
    if (!element) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (element.number > 1) {
          const prev = getElementByNumber(element.number - 1);
          if (prev) onSelectElement(prev);
        }
      } else if (e.key === 'ArrowRight') {
        if (element.number < 118) {
          const next = getElementByNumber(element.number + 1);
          if (next) onSelectElement(next);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [element, onClose, onSelectElement]);

  if (!element) return null;

  const category = CATEGORIES[element.category];
  const currentState = getStateAtTemperature(element, temperatureKelvin);

  const prevElement = element.number > 1 ? getElementByNumber(element.number - 1) : null;
  const nextElement = element.number < 118 ? getElementByNumber(element.number + 1) : null;

  const toCelsius = (k: number | null) => (k != null ? (k - 273.15).toFixed(1) + ' °C' : 'Unknown');
  const toFahrenheit = (k: number | null) => (k != null ? (((k - 273.15) * 9) / 5 + 32).toFixed(1) + ' °F' : 'Unknown');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="element-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-4xl h-[94vh] sm:h-auto sm:max-h-[92vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Mobile Swipe Handle Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-slate-50/80">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span
              className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-mono text-base sm:text-xl font-bold text-white shadow-sm shrink-0"
              style={{ backgroundColor: category?.colorHex || '#2563eb' }}
            >
              {element.symbol}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="element-modal-title" className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight truncate">
                  {element.name}
                </h2>
                <span className="font-mono text-xs font-bold text-slate-500 tabular-nums shrink-0">
                  #{element.number}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                <span className="font-semibold truncate" style={{ color: category?.colorHex }}>
                  {category?.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="shrink-0">P{element.period} / G{element.group || '—'}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase font-mono shrink-0">{element.block}-blk</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenCompare && (
              <button
                type="button"
                onClick={() => onOpenCompare(element)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Compare</span>
              </button>
            )}

            {/* Prev/Next arrows with comfortable touch targets */}
            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                disabled={!prevElement}
                onClick={() => prevElement && onSelectElement(prevElement)}
                className="p-2 sm:p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                title={prevElement ? `Previous: ${prevElement.name} (#${prevElement.number})` : ''}
                aria-label="Previous element"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-slate-200" />
              <button
                type="button"
                disabled={!nextElement}
                onClick={() => nextElement && onSelectElement(nextElement)}
                className="p-2 sm:p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                title={nextElement ? `Next: ${nextElement.name} (#${nextElement.number})` : ''}
                aria-label="Next element"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-0.5 min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Tabs with horizontal scroll on mobile */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-2.5 pb-2 border-b border-slate-100 bg-white text-xs font-medium overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[34px] ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('atomic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[34px] ${
              activeTab === 'atomic'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            Orbitals & Shells
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('thermal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[34px] ${
              activeTab === 'thermal'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            States & Phases
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[34px] ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            History & Discovery
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Bohr Model Stage */}
              <div className="md:col-span-5 flex flex-col items-center p-3 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wider font-mono">
                  Bohr Atomic Model
                </div>
                <BohrModel element={element} />
                <div className="mt-2 text-[10px] sm:text-[11px] text-center text-slate-500 max-w-xs">
                  Concentric circles depict electron shells (n=1 to {element.shells.length}). Orbiting dots represent electrons.
                </div>
              </div>

              {/* Details & Metrics */}
              <div className="md:col-span-7 space-y-4">
                {/* Summary Box */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-slate-500 font-bold mb-1">
                    Summary & Chemical Role
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {element.summary}
                  </p>
                  {element.trivia && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-xs text-slate-600">
                      <span className="font-bold text-slate-900">Notable trivia: </span>
                      {element.trivia}
                    </div>
                  )}
                </div>

                {/* Primary Metric Grid: 2 columns on mobile, 3 on tablet/desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Atomic Mass
                    </div>
                    <div className="text-base sm:text-lg font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {element.atomicMass} <span className="text-xs font-normal text-slate-500">u</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      State @ {temperatureKelvin} K
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 capitalize flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          currentState === 'solid'
                            ? 'bg-slate-800'
                            : currentState === 'liquid'
                            ? 'bg-blue-600'
                            : currentState === 'gas'
                            ? 'bg-emerald-600'
                            : 'bg-slate-400'
                        }`}
                      />
                      {currentState}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Electronegativity
                    </div>
                    <div className="text-base sm:text-lg font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {element.electronegativity != null ? element.electronegativity.toFixed(2) : '—'}{' '}
                      <span className="text-[10px] font-normal text-slate-500">Pauling</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Melting Point
                    </div>
                    <div className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {element.meltingPoint != null ? `${element.meltingPoint} K` : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {toCelsius(element.meltingPoint)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Boiling Point
                    </div>
                    <div className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {element.boilingPoint != null ? `${element.boilingPoint} K` : '—'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {toCelsius(element.boilingPoint)}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Density
                    </div>
                    <div className="text-sm sm:text-base font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                      {element.density != null ? element.density : '—'}{' '}
                      <span className="text-[10px] font-normal text-slate-500">g/cm³</span>
                    </div>
                  </div>
                </div>

                {/* Configuration Strip */}
                <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">Electron Configuration:</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900">
                    {element.electronConfiguration}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'atomic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
                  Electronic & Quantum Structure
                </h3>
                <dl className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <dt className="text-slate-600">Full Configuration</dt>
                    <dd className="font-mono font-bold text-slate-900">{element.electronConfiguration}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <dt className="text-slate-600">Electrons per Shell</dt>
                    <dd className="font-mono font-bold text-slate-900">{element.shells.join(', ')}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <dt className="text-slate-600">Valence Electrons</dt>
                    <dd className="font-mono font-bold text-slate-900">
                      {element.shells[element.shells.length - 1]}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <dt className="text-slate-600">Oxidation States</dt>
                    <dd className="font-mono font-bold text-slate-900">{element.oxidationStates || '0'}</dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200">
                    <dt className="text-slate-600">First Ionization Energy</dt>
                    <dd className="font-mono font-bold text-slate-900">
                      {element.ionizationEnergy != null ? `${element.ionizationEnergy} kJ/mol` : 'Unknown'}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-slate-600">Electronegativity (Pauling)</dt>
                    <dd className="font-mono font-bold text-slate-900">
                      {element.electronegativity != null ? element.electronegativity : 'None'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50">
                <BohrModel element={element} />
              </div>
            </div>
          )}

          {activeTab === 'thermal' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Thermodynamic Phase Spectrum
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Phase transitions relative to standard temperatures and current system calibration ({temperatureKelvin} K).
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] font-mono text-slate-500">Phase @ {temperatureKelvin}K:</span>
                    <div className="text-base font-bold text-slate-900 capitalize flex items-center sm:justify-end gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          currentState === 'solid'
                            ? 'bg-slate-800'
                            : currentState === 'liquid'
                            ? 'bg-blue-600'
                            : currentState === 'gas'
                            ? 'bg-emerald-600'
                            : 'bg-slate-400'
                        }`}
                      />
                      {currentState}
                    </div>
                  </div>
                </div>

                {/* Temperature bar */}
                <div className="relative w-full h-8 bg-slate-200 rounded-lg overflow-hidden flex text-[10px] font-mono text-white font-bold select-none">
                  <div
                    className="h-full bg-slate-500 flex items-center justify-center"
                    style={{
                      width: element.meltingPoint
                        ? `${Math.min(100, Math.max(12, (element.meltingPoint / 5000) * 100))}%`
                        : '50%',
                    }}
                  >
                    Solid
                  </div>
                  <div
                    className="h-full bg-blue-500 flex items-center justify-center"
                    style={{
                      width:
                        element.meltingPoint && element.boilingPoint
                          ? `${Math.min(
                              100,
                              Math.max(12, ((element.boilingPoint - element.meltingPoint) / 5000) * 100)
                            )}%`
                          : '20%',
                    }}
                  >
                    Liquid
                  </div>
                  <div className="flex-1 h-full bg-emerald-500 flex items-center justify-center">
                    Gas
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">
                      Melting Point
                    </span>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                      {element.meltingPoint != null ? `${element.meltingPoint} K` : 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-1 space-x-1.5">
                      <span>{toCelsius(element.meltingPoint)}</span>
                      <span>·</span>
                      <span>{toFahrenheit(element.meltingPoint)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 font-mono uppercase">
                      Boiling Point
                    </span>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                      {element.boilingPoint != null ? `${element.boilingPoint} K` : 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-600 font-mono mt-1 space-x-1.5">
                      <span>{toCelsius(element.boilingPoint)}</span>
                      <span>·</span>
                      <span>{toFahrenheit(element.boilingPoint)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3">
                  Historical Provenance
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <dt className="text-[11px] text-slate-500 uppercase font-mono font-semibold">Discovered By</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">{element.discoveredBy}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-slate-500 uppercase font-mono font-semibold">Year of Discovery</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">{element.yearDiscovered}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] text-slate-500 uppercase font-mono font-semibold">Natural Appearance</dt>
                    <dd className="text-slate-800 mt-0.5">{element.appearance || 'Standard elemental state'}</dd>
                  </div>
                </dl>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Scientific Importance
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {element.summary}
                </p>
                {element.trivia && (
                  <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900">
                    <span className="font-bold">Historical Trivia: </span>
                    {element.trivia}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/80 text-xs text-slate-500">
          <div className="hidden sm:flex items-center gap-2">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">→</kbd> to cycle</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Esc</kbd> to close</span>
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-slate-700">#{element.number} {element.symbol}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors min-h-[36px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
