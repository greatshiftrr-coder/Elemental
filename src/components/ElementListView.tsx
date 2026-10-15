import React, { useState } from 'react';
import { ElementData } from '../types/element';
import { CATEGORIES } from '../data/categories';
import { getStateAtTemperature } from '../data/elements';
import { ArrowUpDown, ChevronDown, ChevronUp, LayoutList, Table } from 'lucide-react';

interface ElementListViewProps {
  elements: ElementData[];
  onSelectElement: (el: ElementData) => void;
  temperatureKelvin: number;
}

type SortField =
  | 'number'
  | 'name'
  | 'symbol'
  | 'atomicMass'
  | 'electronegativity'
  | 'meltingPoint'
  | 'boilingPoint'
  | 'density';

export const ElementListView: React.FC<ElementListViewProps> = ({
  elements,
  onSelectElement,
  temperatureKelvin,
}) => {
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [mobileMode, setMobileMode] = useState<'cards' | 'table'>('cards');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sorted = [...elements].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (sortField === 'atomicMass') {
      valA = parseFloat(a.atomicMass.replace(/[\[\]]/g, '')) || 0;
      valB = parseFloat(b.atomicMass.replace(/[\[\]]/g, '')) || 0;
    }

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 ml-1 inline" />;
    }
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-slate-900 ml-1 inline" />
    ) : (
      <ChevronDown className="w-3 h-3 text-slate-900 ml-1 inline" />
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* Mobile Card / Table Switcher */}
      <div className="md:hidden flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">{sorted.length} Elements Listed</span>
        <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
          <button
            type="button"
            onClick={() => setMobileMode('cards')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              mobileMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutList className="w-3 h-3" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              mobileMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3 h-3" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Mobile Cards View (Active on phones if selected) */}
      <div className={`${mobileMode === 'cards' ? 'grid md:hidden' : 'hidden'} grid-cols-1 sm:grid-cols-2 gap-2.5`}>
        {sorted.map((el) => {
          const cat = CATEGORIES[el.category];
          const st = getStateAtTemperature(el, temperatureKelvin);

          return (
            <div
              key={el.number}
              onClick={() => onSelectElement(el)}
              className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-400 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: cat?.colorHex || '#2563eb' }}
                >
                  {el.symbol}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{el.name}</span>
                    <span className="font-mono text-xs text-slate-400">#{el.number}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {cat?.name}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="font-bold text-slate-800">{el.atomicMass} u</div>
                <div className="text-[10px] text-slate-500 capitalize">{st}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Responsive Data Table */}
      <div className={`w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden ${mobileMode === 'cards' ? 'hidden md:block' : 'block'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600 uppercase select-none">
                <th
                  onClick={() => handleSort('number')}
                  className="sticky left-0 bg-slate-50 z-20 py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors w-14 font-semibold shadow-xs"
                >
                  # {renderSortIcon('number')}
                </th>
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors w-16 font-semibold"
                >
                  Sym {renderSortIcon('symbol')}
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors font-semibold"
                >
                  Name {renderSortIcon('name')}
                </th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th
                  onClick={() => handleSort('atomicMass')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors font-semibold text-right"
                >
                  Weight (u) {renderSortIcon('atomicMass')}
                </th>
                <th className="py-3 px-3 font-semibold text-center">State @ {temperatureKelvin}K</th>
                <th
                  onClick={() => handleSort('electronegativity')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors font-semibold text-right"
                >
                  χ (Pauling) {renderSortIcon('electronegativity')}
                </th>
                <th
                  onClick={() => handleSort('meltingPoint')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors font-semibold text-right"
                >
                  M.P. (K) {renderSortIcon('meltingPoint')}
                </th>
                <th
                  onClick={() => handleSort('boilingPoint')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors font-semibold text-right"
                >
                  B.P. (K) {renderSortIcon('boilingPoint')}
                </th>
                <th
                  onClick={() => handleSort('density')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors font-semibold text-right"
                >
                  Density {renderSortIcon('density')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {sorted.map((el) => {
                const cat = CATEGORIES[el.category];
                const st = getStateAtTemperature(el, temperatureKelvin);

                return (
                  <tr
                    key={el.number}
                    onClick={() => onSelectElement(el)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="sticky left-0 bg-white group-hover:bg-slate-50 z-10 py-2.5 px-3 font-bold text-slate-500 tabular-nums shadow-xs">
                      {el.number}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="px-1.5 py-0.5 rounded text-[11px] font-bold text-white"
                        style={{ backgroundColor: cat?.colorHex || '#2563eb' }}
                      >
                        {el.symbol}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {el.name}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{
                          backgroundColor: `${cat?.colorHex}15`,
                          color: cat?.colorHex,
                        }}
                      >
                        {cat?.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {el.atomicMass}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          st === 'solid'
                            ? 'bg-slate-100 text-slate-800'
                            : st === 'liquid'
                            ? 'bg-blue-100 text-blue-800'
                            : st === 'gas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        {st}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {el.electronegativity != null ? el.electronegativity.toFixed(2) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {el.meltingPoint != null ? `${el.meltingPoint}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {el.boilingPoint != null ? `${el.boilingPoint}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                      {el.density != null ? `${el.density}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
