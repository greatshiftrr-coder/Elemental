import React, { useRef, useState, useEffect } from 'react';
import { ElementData, ElementCategory } from '../types/element';
import { ElementCard, PropertyMode } from './ElementCard';
import { CATEGORIES } from '../data/categories';
import { getStateAtTemperature } from '../data/elements';
import { Grid3X3, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';

interface PeriodicTableGridProps {
  elements: ElementData[];
  onSelectElement: (element: ElementData) => void;
  hoveredElement: ElementData | null;
  setHoveredElement: (element: ElementData | null) => void;
  selectedCategory: ElementCategory | 'all';
  selectedState: 'all' | 'solid' | 'liquid' | 'gas';
  searchQuery: string;
  temperatureKelvin: number;
  propertyMode: PropertyMode;
}

export const PeriodicTableGrid: React.FC<PeriodicTableGridProps> = ({
  elements,
  onSelectElement,
  hoveredElement,
  setHoveredElement,
  selectedCategory,
  selectedState,
  searchQuery,
  temperatureKelvin,
  propertyMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'grid' | 'pocket'>('grid');
  const [pocketFilterBlock, setPocketFilterBlock] = useState<'all' | 's' | 'p' | 'd' | 'f'>('all');

  // Track horizontal scroll progress on mobile
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
      }
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Quick jump helper for mobile/tablet horizontal scroll
  const scrollToColumn = (colIndex: number) => {
    if (containerRef.current) {
      // 18 columns over roughly 1100px width
      const targetX = (colIndex / 18) * 1100;
      containerRef.current.scrollTo({ left: targetX, behavior: 'smooth' });
    }
  };

  // Determine if element matches filters
  const matchesFilter = (el: ElementData): boolean => {
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

    if (selectedCategory !== 'all' && el.category !== selectedCategory) {
      return false;
    }

    if (selectedState !== 'all') {
      const currState = getStateAtTemperature(el, temperatureKelvin);
      if (currState !== selectedState) {
        return false;
      }
    }

    return true;
  };

  const groupLabels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const periodLabels = [1, 2, 3, 4, 5, 6, 7];

  // Focused preview element
  const previewElement = hoveredElement || elements.find((e) => e.number === 6) || elements[0];
  const previewCategory = previewElement ? CATEGORIES[previewElement.category] : null;

  return (
    <div className="w-full space-y-3">
      {/* Mobile/Tablet Helper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Mobile View Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setMobileLayoutMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mobileLayoutMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>18-Col Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileLayoutMode('pocket')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mobileLayoutMode === 'pocket'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pocket View</span>
          </button>
        </div>

        {/* Quick jump buttons for 18-column grid mode */}
        {mobileLayoutMode === 'grid' && (
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono text-slate-600">
            <span className="hidden sm:inline text-slate-400 font-sans mr-1">Quick Jump:</span>
            <button
              type="button"
              onClick={() => scrollToColumn(0)}
              className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              s-block (1-2)
            </button>
            <button
              type="button"
              onClick={() => scrollToColumn(4)}
              className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              d-block (3-12)
            </button>
            <button
              type="button"
              onClick={() => scrollToColumn(13)}
              className="px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              p-block (13-18)
            </button>
            <button
              type="button"
              onClick={() => scrollToColumn(3)}
              className="px-2 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors whitespace-nowrap"
            >
              f-block (La/Ac)
            </button>
          </div>
        )}

        {/* Pocket View Block filter */}
        {mobileLayoutMode === 'pocket' && (
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
            <span className="text-slate-500 mr-1">Block:</span>
            {(['all', 's', 'p', 'd', 'f'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setPocketFilterBlock(b)}
                className={`px-2.5 py-1 rounded-lg uppercase font-mono text-xs transition-colors ${
                  pocketFilterBlock === b
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b === 'all' ? 'All' : `${b}-block`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode 1: Classic 18-Column Grid */}
      {mobileLayoutMode === 'grid' && (
        <div className="relative">
          {/* Horizontal scroll helper bar for mobile */}
          <div className="lg:hidden flex items-center justify-between px-2 py-1 bg-slate-100 rounded-lg text-[11px] text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Scroll horizontally to explore all 18 groups <ArrowRight className="w-3 h-3" />
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-700">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          <div
            ref={containerRef}
            className="w-full overflow-x-auto pb-4 select-none scrollbar-thin scrollbar-thumb-slate-300"
          >
            <div className="min-w-[1080px] max-w-[1360px] mx-auto">
              <div
                className="grid gap-1 sm:gap-1.5"
                style={{
                  gridTemplateColumns: '26px repeat(18, minmax(0, 1fr))',
                  gridTemplateRows: '22px repeat(7, auto) 14px repeat(2, auto)',
                }}
              >
                {/* Group Column Headers (1 to 18) */}
                <div className="col-start-1 row-start-1" />
                {groupLabels.map((grp) => (
                  <div
                    key={`grp-${grp}`}
                    className="text-center font-mono text-[10px] text-slate-400 font-semibold flex items-center justify-center"
                    style={{ gridColumnStart: grp + 1, gridRowStart: 1 }}
                  >
                    {grp}
                  </div>
                ))}

                {/* Period Row Labels (1 to 7) */}
                {periodLabels.map((prd) => (
                  <div
                    key={`prd-${prd}`}
                    className="font-mono text-[10px] text-slate-400 font-semibold flex items-center justify-center"
                    style={{ gridColumnStart: 1, gridRowStart: prd + 1 }}
                  >
                    {prd}
                  </div>
                ))}

                {/* Central Empty Space (Cols 4-13, Rows 2-4) Interactive Live Atomic HUD */}
                <div
                  className="hidden md:flex flex-col justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-xs z-10 transition-all duration-150"
                  style={{
                    gridColumn: '4 / span 10',
                    gridRow: '2 / span 3',
                  }}
                >
                  {previewElement && previewCategory && (
                    <div className="flex items-center justify-between h-full gap-4">
                      {/* Large Atomic Tile Preview */}
                      <div
                        className="flex flex-col justify-between w-28 h-28 p-2 rounded-xl border transition-colors shadow-xs"
                        style={{
                          backgroundColor: `${previewCategory.colorHex}10`,
                          borderColor: `${previewCategory.colorHex}40`,
                        }}
                      >
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                          <span>{previewElement.number}</span>
                          <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-white border border-slate-200">
                            {previewElement.block}-block
                          </span>
                        </div>
                        <div className="text-center">
                          <div
                            className="font-mono text-3xl font-extrabold tracking-tight"
                            style={{ color: previewCategory.colorHex }}
                          >
                            {previewElement.symbol}
                          </div>
                          <div className="text-xs font-medium text-slate-800 truncate">
                            {previewElement.name}
                          </div>
                        </div>
                        <div className="text-center font-mono text-[10px] text-slate-500 tabular-nums">
                          {previewElement.atomicMass} u
                        </div>
                      </div>

                      {/* Live Element Facts */}
                      <div className="flex-1 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-sm">
                            {previewElement.name}{' '}
                            <span className="text-xs font-normal text-slate-500 font-mono">
                              (Z = {previewElement.number})
                            </span>
                          </span>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${previewCategory.colorHex}15`,
                              color: previewCategory.colorHex,
                            }}
                          >
                            {previewCategory.name}
                          </span>
                        </div>

                        <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                          {previewElement.summary}
                        </p>

                        <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-slate-600">
                          <div className="p-1 rounded bg-slate-50 border border-slate-200/70">
                            <div className="text-[9px] uppercase text-slate-400">Phase @ {temperatureKelvin}K</div>
                            <div className="font-bold text-slate-800 capitalize">
                              {getStateAtTemperature(previewElement, temperatureKelvin)}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-50 border border-slate-200/70">
                            <div className="text-[9px] uppercase text-slate-400">Electron Config</div>
                            <div className="font-bold text-slate-800 truncate">
                              {previewElement.electronConfiguration}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-50 border border-slate-200/70">
                            <div className="text-[9px] uppercase text-slate-400">Electronegativity</div>
                            <div className="font-bold text-slate-800">
                              {previewElement.electronegativity ?? '—'}
                            </div>
                          </div>
                          <div className="p-1 rounded bg-slate-50 border border-slate-200/70">
                            <div className="text-[9px] uppercase text-slate-400">Density</div>
                            <div className="font-bold text-slate-800">
                              {previewElement.density ? `${previewElement.density} g/cm³` : '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inspect Action */}
                      <button
                        type="button"
                        onClick={() => onSelectElement(previewElement)}
                        className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
                      >
                        Inspect Details →
                      </button>
                    </div>
                  )}
                </div>

                {/* Lanthanide & Actinide Placeholders in main table */}
                <button
                  type="button"
                  onClick={() => {
                    const la = elements.find((e) => e.number === 57);
                    if (la) onSelectElement(la);
                  }}
                  className="flex flex-col items-center justify-center p-1 rounded-lg border border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100/80 text-center transition-colors cursor-pointer"
                  style={{ gridColumnStart: 4, gridRowStart: 7 }}
                  title="Click to view Lanthanide series (Elements 57 to 71)"
                >
                  <span className="font-mono text-[9px] font-bold text-purple-700">57–71</span>
                  <span className="text-[8px] text-purple-900 font-medium">La–Lu</span>
                  <span className="text-[7px] text-purple-600 uppercase">Lanthanides</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const ac = elements.find((e) => e.number === 89);
                    if (ac) onSelectElement(ac);
                  }}
                  className="flex flex-col items-center justify-center p-1 rounded-lg border border-dashed border-fuchsia-300 bg-fuchsia-50 hover:bg-fuchsia-100/80 text-center transition-colors cursor-pointer"
                  style={{ gridColumnStart: 4, gridRowStart: 8 }}
                  title="Click to view Actinide series (Elements 89 to 103)"
                >
                  <span className="font-mono text-[9px] font-bold text-fuchsia-700">89–103</span>
                  <span className="text-[8px] text-fuchsia-900 font-medium">Ac–Lr</span>
                  <span className="text-[7px] text-fuchsia-600 uppercase">Actinides</span>
                </button>

                {/* 118 Elements */}
                {elements.map((element) => {
                  const matches = matchesFilter(element);
                  const cssRow = element.gridRow <= 7 ? element.gridRow + 1 : element.gridRow === 8 ? 10 : 11;
                  const cssCol = element.gridCol + 1;

                  return (
                    <div
                      key={element.number}
                      style={{
                        gridColumnStart: cssCol,
                        gridRowStart: cssRow,
                      }}
                    >
                      <ElementCard
                        element={element}
                        onClick={onSelectElement}
                        onHover={setHoveredElement}
                        propertyMode={propertyMode}
                        temperatureKelvin={temperatureKelvin}
                        isDimmed={!matches}
                        isSelected={hoveredElement?.number === element.number}
                      />
                    </div>
                  );
                })}

                {/* Row Labels for Lanthanides and Actinides on bottom left */}
                <div
                  className="text-[10px] font-mono text-purple-800 font-semibold flex items-center justify-end pr-1"
                  style={{ gridColumn: '1 / span 3', gridRowStart: 10 }}
                >
                  Lanthanides *
                </div>
                <div
                  className="text-[10px] font-mono text-fuchsia-800 font-semibold flex items-center justify-end pr-1"
                  style={{ gridColumn: '1 / span 3', gridRowStart: 11 }}
                >
                  Actinides **
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Pocket / Group View (Mobile & Tablet Optimized) */}
      {mobileLayoutMode === 'pocket' && (
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 7].map((periodNum) => {
            const periodElements = elements
              .filter((e) => e.period === periodNum && (pocketFilterBlock === 'all' || e.block === pocketFilterBlock))
              .sort((a, b) => a.number - b.number);

            if (periodElements.length === 0) return null;

            return (
              <div key={`pocket-period-${periodNum}`} className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Period {periodNum}</span>
                    <span className="text-xs text-slate-500 font-mono">({periodElements.length} elements)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Energy Level n={periodNum}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {periodElements.map((element) => {
                    const matches = matchesFilter(element);
                    return (
                      <ElementCard
                        key={element.number}
                        element={element}
                        onClick={onSelectElement}
                        onHover={setHoveredElement}
                        propertyMode={propertyMode}
                        temperatureKelvin={temperatureKelvin}
                        isDimmed={!matches}
                        isSelected={hoveredElement?.number === element.number}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Lanthanides & Actinides sections in Pocket view */}
          {['lanthanide', 'actinide'].map((family) => {
            const familyElements = elements
              .filter((e) => e.category === family && (pocketFilterBlock === 'all' || e.block === pocketFilterBlock))
              .sort((a, b) => a.number - b.number);

            if (familyElements.length === 0) return null;

            return (
              <div key={`pocket-fam-${family}`} className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 capitalize">{family}s</span>
                    <span className="text-xs text-slate-500 font-mono">({familyElements.length} elements)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">f-block elements</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {familyElements.map((element) => {
                    const matches = matchesFilter(element);
                    return (
                      <ElementCard
                        key={element.number}
                        element={element}
                        onClick={onSelectElement}
                        onHover={setHoveredElement}
                        propertyMode={propertyMode}
                        temperatureKelvin={temperatureKelvin}
                        isDimmed={!matches}
                        isSelected={hoveredElement?.number === element.number}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
