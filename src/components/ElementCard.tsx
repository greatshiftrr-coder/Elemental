import React from 'react';
import { ElementData } from '../types/element';
import { CATEGORIES } from '../data/categories';
import { getStateAtTemperature } from '../data/elements';

export type PropertyMode = 'standard' | 'electronegativity' | 'ionization' | 'density' | 'shells';

interface ElementCardProps {
  element: ElementData;
  onClick: (element: ElementData) => void;
  onHover?: (element: ElementData | null) => void;
  propertyMode?: PropertyMode;
  temperatureKelvin: number;
  isDimmed?: boolean;
  isSelected?: boolean;
}

export const ElementCard: React.FC<ElementCardProps> = ({
  element,
  onClick,
  onHover,
  propertyMode = 'standard',
  temperatureKelvin,
  isDimmed = false,
  isSelected = false,
}) => {
  const categoryInfo = CATEGORIES[element.category];
  const currentState = getStateAtTemperature(element, temperatureKelvin);

  // Secondary value based on property mode
  let secondaryValue = element.atomicMass;
  let secondaryLabel = 'u';
  if (propertyMode === 'electronegativity') {
    secondaryValue = element.electronegativity != null ? element.electronegativity.toFixed(2) : '—';
    secondaryLabel = 'χ';
  } else if (propertyMode === 'ionization') {
    secondaryValue = element.ionizationEnergy != null ? Math.round(element.ionizationEnergy).toString() : '—';
    secondaryLabel = 'kJ';
  } else if (propertyMode === 'density') {
    secondaryValue = element.density != null ? (element.density < 0.1 ? element.density.toExponential(1) : element.density.toFixed(2)) : '—';
    secondaryLabel = 'g/cm³';
  } else if (propertyMode === 'shells') {
    const val = element.shells[element.shells.length - 1];
    secondaryValue = `${val}e⁻`;
    secondaryLabel = 'val';
  }

  // State indicator styling
  const stateBadge = {
    solid: { symbol: 'S', title: 'Solid', dotClass: 'bg-slate-700' },
    liquid: { symbol: 'L', title: 'Liquid', dotClass: 'bg-blue-600 ring-2 ring-blue-300' },
    gas: { symbol: 'G', title: 'Gas', dotClass: 'bg-emerald-600 ring-2 ring-emerald-300' },
    unknown: { symbol: '?', title: 'Unknown state', dotClass: 'bg-slate-400' },
  }[currentState];

  return (
    <button
      type="button"
      onClick={() => onClick(element)}
      onMouseEnter={() => onHover?.(element)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(element)}
      onBlur={() => onHover?.(null)}
      aria-label={`${element.name}, atomic number ${element.number}, symbol ${element.symbol}`}
      className={`group relative flex flex-col justify-between w-full h-[68px] sm:h-[72px] lg:h-[76px] p-1 sm:p-1.5 rounded-lg border text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 select-none ${
        categoryInfo ? categoryInfo.bgLight : 'bg-white'
      } ${
        categoryInfo ? categoryInfo.borderLight : 'border-slate-200'
      } ${
        isDimmed ? 'opacity-25 grayscale scale-[0.98]' : 'opacity-100 hover:scale-[1.04] hover:shadow-md hover:z-20'
      } ${
        isSelected ? 'ring-2 ring-slate-900 border-slate-900 shadow-md z-30' : ''
      }`}
    >
      {/* Top row: Atomic Number and State Indicator / Property Label */}
      <div className="flex items-center justify-between w-full leading-none">
        <span className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-600 tabular-nums">
          {element.number}
        </span>

        {/* State Glyph Pill */}
        <span
          title={`State at ${temperatureKelvin} K: ${stateBadge.title}`}
          className="flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 text-[9px] font-mono font-bold rounded-full bg-white/80 border border-slate-200 text-slate-600"
        >
          {stateBadge.symbol}
        </span>
      </div>

      {/* Center: Symbol */}
      <div className="flex flex-col items-center justify-center my-0.5">
        <span className="font-mono font-bold text-base sm:text-lg lg:text-xl text-slate-900 leading-none tracking-tight group-hover:scale-105 transition-transform">
          {element.symbol}
        </span>
        <span className="text-[9px] sm:text-[10px] text-slate-600 truncate max-w-full font-medium leading-none mt-0.5 text-center">
          {element.name}
        </span>
      </div>

      {/* Bottom row: Atomic Mass or Selected Property */}
      <div className="flex items-center justify-center w-full leading-none">
        <span className="font-mono text-[9px] sm:text-[9.5px] text-slate-500 tabular-nums truncate">
          {secondaryValue}
        </span>
      </div>
    </button>
  );
};
