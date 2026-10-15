import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { ELEMENTS } from '../data/elements';
import { CATEGORIES } from '../data/categories';
import { BohrModel } from './BohrModel';
import { X, ArrowRightLeft } from 'lucide-react';

interface ComparisonModalProps {
  initialElement: ElementData;
  onClose: () => void;
  onSelectElement: (el: ElementData) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  initialElement,
  onClose,
  onSelectElement,
}) => {
  const [elementA, setElementA] = useState<ElementData>(initialElement);
  const [elementB, setElementB] = useState<ElementData>(() => {
    const nextZ = initialElement.number < 118 ? initialElement.number + 1 : 1;
    return ELEMENTS.find((e) => e.number === nextZ) || ELEMENTS[0];
  });

  const catA = CATEGORIES[elementA.category];
  const catB = CATEGORIES[elementB.category];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-4xl h-[94vh] sm:h-auto sm:max-h-[92vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Mobile Swipe Drag Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-slate-50">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-slate-700" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Atomic Comparison
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Element Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label htmlFor="select-element-a" className="block text-[11px] font-mono uppercase text-slate-500 font-bold mb-1">
                Element A
              </label>
              <select
                id="select-element-a"
                value={elementA.number}
                onChange={(e) => {
                  const found = ELEMENTS.find((el) => el.number === Number(e.target.value));
                  if (found) setElementA(found);
                }}
                className="w-full text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {ELEMENTS.map((el) => (
                  <option key={el.number} value={el.number}>
                    #{el.number} {el.name} ({el.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label htmlFor="select-element-b" className="block text-[11px] font-mono uppercase text-slate-500 font-bold mb-1">
                Element B
              </label>
              <select
                id="select-element-b"
                value={elementB.number}
                onChange={(e) => {
                  const found = ELEMENTS.find((el) => el.number === Number(e.target.value));
                  if (found) setElementB(found);
                }}
                className="w-full text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {ELEMENTS.map((el) => (
                  <option key={el.number} value={el.number}>
                    #{el.number} {el.name} ({el.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-side Bohr Models */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white font-mono"
                  style={{ backgroundColor: catA.colorHex }}
                >
                  {elementA.symbol}
                </span>
                <span className="font-bold text-slate-900 text-sm">{elementA.name}</span>
                <span className="text-xs text-slate-500 font-mono">#{elementA.number}</span>
              </div>
              <BohrModel element={elementA} />
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white font-mono"
                  style={{ backgroundColor: catB.colorHex }}
                >
                  {elementB.symbol}
                </span>
                <span className="font-bold text-slate-900 text-sm">{elementB.name}</span>
                <span className="text-xs text-slate-500 font-mono">#{elementB.number}</span>
              </div>
              <BohrModel element={elementB} />
            </div>
          </div>

          {/* Comparison Table with Sticky Property Column */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-mono uppercase text-slate-600 border-b border-slate-200">
                    <th className="sticky left-0 bg-slate-100 z-10 py-2.5 px-3 font-bold w-36 shadow-xs">Property</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">{elementA.name}</th>
                    <th className="py-2.5 px-3 font-bold text-slate-900">{elementB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Category</td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: catA.colorHex }}>{catA.name}</td>
                    <td className="py-2.5 px-3 font-bold" style={{ color: catB.colorHex }}>{catB.name}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Atomic Mass</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementA.atomicMass} u</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementB.atomicMass} u</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Period / Group</td>
                    <td className="py-2.5 px-3">P{elementA.period}, G{elementA.group} ({elementA.block}-blk)</td>
                    <td className="py-2.5 px-3">P{elementB.period}, G{elementB.group} ({elementB.block}-blk)</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Configuration</td>
                    <td className="py-2.5 px-3 font-bold">{elementA.electronConfiguration}</td>
                    <td className="py-2.5 px-3 font-bold">{elementB.electronConfiguration}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Shells (e⁻)</td>
                    <td className="py-2.5 px-3">{elementA.shells.join(', ')}</td>
                    <td className="py-2.5 px-3">{elementB.shells.join(', ')}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Electronegativity</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementA.electronegativity ?? '—'}</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementB.electronegativity ?? '—'}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">1st Ionization</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementA.ionizationEnergy ? `${elementA.ionizationEnergy} kJ/mol` : '—'}</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementB.ionizationEnergy ? `${elementB.ionizationEnergy} kJ/mol` : '—'}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Melting Point</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementA.meltingPoint ? `${elementA.meltingPoint} K` : '—'}</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementB.meltingPoint ? `${elementB.meltingPoint} K` : '—'}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Boiling Point</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementA.boilingPoint ? `${elementA.boilingPoint} K` : '—'}</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementB.boilingPoint ? `${elementB.boilingPoint} K` : '—'}</td>
                  </tr>
                  <tr>
                    <td className="sticky left-0 bg-white z-10 py-2.5 px-3 font-sans text-slate-600 font-medium shadow-xs">Density</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementA.density ? `${elementA.density} g/cm³` : '—'}</td>
                    <td className="py-2.5 px-3 tabular-nums">{elementB.density ? `${elementB.density} g/cm³` : '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors min-h-[36px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
