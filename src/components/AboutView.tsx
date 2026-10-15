import React from 'react';
import { CATEGORIES } from '../data/categories';
import { ElementCategory } from '../types/element';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          The Architecture of the Periodic Table
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          The periodic table of elements organizes all 118 confirmed chemical elements according to their atomic number, electron configuration, and recurring chemical properties. Elements in the same group possess identical valence electron configurations, leading to predictable patterns in chemical reactivity and physical states.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            Periods & Energy Levels
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The seven horizontal rows of the table represent periods. Each period corresponds to the principal quantum number ($n=1$ to $n=7$) of valence electrons filling successive electron subshells across the s, p, d, and f orbital blocks.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            Groups & Chemical Families
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The 18 vertical columns correspond to groups. Elements in a group share equivalent valence electron counts, resulting in homologous bonding behavior—such as the reactive single valence electron of alkali metals or the full electron octets of noble gases.
          </p>
        </div>
      </div>

      {/* Category Reference Guide */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Classification & Elemental Families
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(CATEGORIES) as [ElementCategory, typeof CATEGORIES[ElementCategory]][]).map(([key, cat]) => (
            <div key={key} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: cat.colorHex }}
              />
              <div>
                <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{cat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Legend & Guidance */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs text-slate-600">
        <div className="font-mono uppercase font-bold text-slate-500">
          Standards & Scientific Conventions
        </div>
        <p className="leading-relaxed">
          Standard atomic weights reflect the IUPAC Commission on Isotopic Abundances and Atomic Weights (CIAAW). Melting and boiling points are calibrated at standard atmospheric pressure (101.325 kPa). All electron configurations adhere to modern quantum mechanical orbital notation.
        </p>
      </div>
    </div>
  );
};
