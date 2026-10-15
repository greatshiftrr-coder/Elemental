import React, { useState } from 'react';
import { ElementCategory } from '../types/element';
import { CATEGORIES } from '../data/categories';
import { PropertyMode } from './ElementCard';
import { Search, Thermometer, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ElementCategory | 'all';
  setSelectedCategory: (cat: ElementCategory | 'all') => void;
  selectedState: 'all' | 'solid' | 'liquid' | 'gas';
  setSelectedState: (s: 'all' | 'solid' | 'liquid' | 'gas') => void;
  temperatureKelvin: number;
  setTemperatureKelvin: (t: number) => void;
  propertyMode: PropertyMode;
  setPropertyMode: (p: PropertyMode) => void;
  onReset: () => void;
  totalVisible: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  temperatureKelvin,
  setTemperatureKelvin,
  propertyMode,
  setPropertyMode,
  onReset,
  totalVisible,
}) => {
  const [showAdvancedControls, setShowAdvancedControls] = useState<boolean>(false);

  const tempPresets = [
    { label: '0 K', value: 0, title: 'Absolute Zero (-273.15 °C)' },
    { label: '77 K', value: 77, title: 'Liquid Nitrogen (-196 °C)' },
    { label: '293 K', value: 293, title: 'Room Temp (20 °C)' },
    { label: '373 K', value: 373, title: 'Boiling Water (100 °C)' },
    { label: '1811 K', value: 1811, title: 'Iron Melt (1538 °C)' },
    { label: '5800 K', value: 5800, title: 'Sun Surface (5527 °C)' },
  ];

  const celsius = (temperatureKelvin - 273.15).toFixed(1);
  const isFiltered = searchQuery || selectedCategory !== 'all' || selectedState !== 'all' || temperatureKelvin !== 293;

  return (
    <div className="w-full space-y-3 p-3.5 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
      {/* Primary Row: Search Bar & Quick Action Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search element name, symbol, or # (e.g. Fe, Gold, 26)..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-700 p-1 rounded-full"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action strip: Property Overlay & Mobile Controls Toggle */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          {/* Overlay Property Selector */}
          <div className="flex items-center gap-1.5 flex-1 md:flex-none">
            <select
              value={propertyMode}
              onChange={(e) => setPropertyMode(e.target.value as PropertyMode)}
              aria-label="Metric Overlay"
              className="w-full md:w-auto text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="standard">Standard: Mass</option>
              <option value="electronegativity">Electronegativity (χ)</option>
              <option value="ionization">1st Ionization Energy</option>
              <option value="density">Density (g/cm³)</option>
              <option value="shells">Valence Electrons</option>
            </select>
          </div>

          {/* Temperature Toggle Button (Mobile/Tablet Friendly) */}
          <button
            type="button"
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors shrink-0 ${
              showAdvancedControls || temperatureKelvin !== 293
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle temperature thermodynamic simulation"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-mono text-[11px] tabular-nums font-bold">{temperatureKelvin}K</span>
            {showAdvancedControls ? (
              <ChevronUp className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            )}
          </button>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
              title="Reset all filters and temperature"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Temperature & Thermodynamic Controller (Drawer on Mobile, Smooth expand) */}
      {(showAdvancedControls || window.innerWidth >= 1024) && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Thermodynamic Temperature:</span>
              <span className="font-mono tabular-nums font-bold text-slate-900 text-sm">
                {temperatureKelvin} K
              </span>
              <span className="text-slate-500 font-mono text-xs">({celsius} °C)</span>
            </div>

            {/* Quick jump presets */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
              {tempPresets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setTemperatureKelvin(p.value)}
                  title={p.title}
                  className={`px-2 py-1 text-[10px] font-mono rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    temperatureKelvin === p.value
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-slate-400">0 K</span>
            <input
              type="range"
              min="0"
              max="6000"
              step="5"
              value={temperatureKelvin}
              onChange={(e) => setTemperatureKelvin(Number(e.target.value))}
              aria-label="Thermodynamic temperature slider"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="font-mono text-[10px] text-slate-400">6000 K</span>
          </div>
        </div>
      )}

      {/* Row 2: Category Chips & State Selector */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({totalVisible})
          </button>

          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? 'all' : (key as ElementCategory))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'text-white shadow-xs font-semibold'
                    : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.colorHex : undefined,
                  borderColor: isSelected ? cat.colorHex : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : cat.colorHex,
                  }}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* State selector buttons */}
        <div className="flex items-center justify-between md:justify-end gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
          <span className="text-[11px] font-medium text-slate-500 px-1.5">State:</span>
          {(['all', 'solid', 'liquid', 'gas'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedState(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors min-h-[26px] ${
                selectedState === st
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
