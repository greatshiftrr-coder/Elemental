import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { CATEGORIES } from '../data/categories';

interface PeriodicTrendsViewProps {
  elements: ElementData[];
  onSelectElement: (el: ElementData) => void;
}

type TrendMetric = 'electronegativity' | 'ionization' | 'meltingPoint' | 'density';

export const PeriodicTrendsView: React.FC<PeriodicTrendsViewProps> = ({
  elements,
  onSelectElement,
}) => {
  const [metric, setMetric] = useState<TrendMetric>('electronegativity');
  const [hoveredPoint, setHoveredPoint] = useState<ElementData | null>(null);

  const metricConfigs: Record<
    TrendMetric,
    { title: string; unit: string; description: string; getValue: (el: ElementData) => number | null }
  > = {
    electronegativity: {
      title: 'Electronegativity (Pauling Scale)',
      unit: '',
      description: 'Measures the tendency of an atom to attract a bonding pair of electrons. Increases across a period and decreases down a group.',
      getValue: (el) => el.electronegativity,
    },
    ionization: {
      title: 'First Ionization Energy',
      unit: 'kJ/mol',
      description: 'The energy required to remove the outermost electron from an isolated gaseous atom. Noble gases exhibit the highest peaks.',
      getValue: (el) => el.ionizationEnergy,
    },
    meltingPoint: {
      title: 'Melting Point',
      unit: 'K',
      description: 'Temperature at which the solid and liquid phases coexist at standard atmospheric pressure. Carbon and Tungsten show prominent summits.',
      getValue: (el) => el.meltingPoint,
    },
    density: {
      title: 'Density at STP',
      unit: 'g/cm³',
      description: 'Mass per unit volume. Osmium and Iridium reach maximum empirical density around period 6 transition metals.',
      getValue: (el) => el.density,
    },
  };

  const currentConfig = metricConfigs[metric];

  const validData = elements
    .map((el) => ({ el, val: currentConfig.getValue(el) }))
    .filter((d): d is { el: ElementData; val: number } => d.val !== null && !isNaN(d.val));

  const maxVal = Math.max(...validData.map((d) => d.val), 1);
  const minVal = Math.min(...validData.map((d) => d.val), 0);

  const width = 900;
  const height = 360;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 44;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (z: number) => paddingLeft + ((z - 1) / (118 - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;

  const pathD = validData.reduce((acc, curr, index) => {
    const x = getX(curr.el.number);
    const y = getY(curr.val);
    return `${acc} ${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  return (
    <div className="w-full space-y-4">
      {/* Metric Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">{currentConfig.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">{currentConfig.description}</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none shrink-0">
          {(Object.keys(metricConfigs) as TrendMetric[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize whitespace-nowrap shrink-0 ${
                metric === key
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart with Touch/Hover info */}
      <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="min-w-[650px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible select-none">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const y = paddingTop + chartHeight - pct * chartHeight;
                const labelVal = minVal + pct * (maxVal - minVal);
                return (
                  <g key={pct}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="font-mono text-[10px] fill-slate-400"
                    >
                      {labelVal < 10 ? labelVal.toFixed(1) : Math.round(labelVal)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis tick markers */}
              {[1, 10, 18, 36, 54, 86, 118].map((z) => {
                const x = getX(z);
                return (
                  <g key={`tick-${z}`}>
                    <line
                      x1={x}
                      y1={paddingTop + chartHeight}
                      x2={x}
                      y2={paddingTop + chartHeight + 6}
                      stroke="#94a3b8"
                      strokeWidth={1}
                    />
                    <text
                      x={x}
                      y={paddingTop + chartHeight + 18}
                      textAnchor="middle"
                      className="font-mono text-[10px] fill-slate-500 font-semibold"
                    >
                      Z={z}
                    </text>
                  </g>
                );
              })}

              {/* Connecting curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth={1.75}
                strokeLinejoin="round"
                className="opacity-60"
              />

              {/* Data Points */}
              {validData.map(({ el, val }) => {
                const x = getX(el.number);
                const y = getY(val);
                const cat = CATEGORIES[el.category];
                const isHovered = hoveredPoint?.number === el.number;

                return (
                  <g
                    key={el.number}
                    className="cursor-pointer transition-all duration-150"
                    onClick={() => onSelectElement(el)}
                    onMouseEnter={() => setHoveredPoint(el)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 3.5}
                      fill={cat?.colorHex || '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}

              {/* Tooltip */}
              {hoveredPoint && (
                <g
                  transform={`translate(${Math.min(width - 150, Math.max(70, getX(hoveredPoint.number)))}, ${Math.max(
                    36,
                    getY(currentConfig.getValue(hoveredPoint) || 0) - 38
                  )})`}
                >
                  <rect
                    x="-70"
                    y="-24"
                    width="140"
                    height="34"
                    rx="6"
                    fill="#0f172a"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x="0"
                    y="-9"
                    textAnchor="middle"
                    fill="#ffffff"
                    className="font-sans font-bold text-xs"
                  >
                    {hoveredPoint.name} ({hoveredPoint.symbol})
                  </text>
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="font-mono text-[10px]"
                  >
                    {currentConfig.getValue(hoveredPoint)}{' '}
                    {currentConfig.unit} (Z={hoveredPoint.number})
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 gap-2">
          <span>Tap any point to inspect atom properties in detail</span>
          <span className="font-mono text-[11px]">118 Elements Trace</span>
        </div>
      </div>
    </div>
  );
};
