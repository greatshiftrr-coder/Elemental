import { CategoryInfo, ElementCategory } from '../types/element';

export const CATEGORIES: Record<ElementCategory, CategoryInfo> = {
  'alkali-metal': {
    id: 'alkali-metal',
    name: 'Alkali Metals',
    description: 'Highly reactive group 1 metals with a single valence electron, easily tarnishing and reacting vigorously with water.',
    bgLight: 'bg-rose-50 hover:bg-rose-100/90',
    borderLight: 'border-rose-200 hover:border-rose-400',
    textLight: 'text-rose-950',
    badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-200',
    colorHex: '#e11d48'
  },
  'alkaline-earth-metal': {
    id: 'alkaline-earth-metal',
    name: 'Alkaline Earth Metals',
    description: 'Shiny, somewhat reactive group 2 metals that typically lose two electrons to form cations with +2 charge.',
    bgLight: 'bg-amber-50 hover:bg-amber-100/90',
    borderLight: 'border-amber-200 hover:border-amber-400',
    textLight: 'text-amber-950',
    badgeBg: 'bg-amber-500/10 text-amber-800 border-amber-200',
    colorHex: '#d97706'
  },
  'transition-metal': {
    id: 'transition-metal',
    name: 'Transition Metals',
    description: 'Hard, ductile metals with high melting points, versatile oxidation states, and colored coordination compounds.',
    bgLight: 'bg-blue-50 hover:bg-blue-100/90',
    borderLight: 'border-blue-200 hover:border-blue-400',
    textLight: 'text-blue-950',
    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-200',
    colorHex: '#2563eb'
  },
  'post-transition-metal': {
    id: 'post-transition-metal',
    name: 'Post-Transition Metals',
    description: 'Soft metals with lower melting points and higher electronegativities than transition metals, bordering metalloids.',
    bgLight: 'bg-sky-50 hover:bg-sky-100/90',
    borderLight: 'border-sky-200 hover:border-sky-400',
    textLight: 'text-sky-950',
    badgeBg: 'bg-sky-500/10 text-sky-800 border-sky-200',
    colorHex: '#0284c7'
  },
  'metalloid': {
    id: 'metalloid',
    name: 'Metalloids',
    description: 'Semimetals exhibiting intermediate chemical and physical properties between metals and nonmetals, vital for semiconductors.',
    bgLight: 'bg-teal-50 hover:bg-teal-100/90',
    borderLight: 'border-teal-200 hover:border-teal-400',
    textLight: 'text-teal-950',
    badgeBg: 'bg-teal-500/10 text-teal-800 border-teal-200',
    colorHex: '#0d9488'
  },
  'reactive-nonmetal': {
    id: 'reactive-nonmetal',
    name: 'Reactive Nonmetals',
    description: 'Electronegative elements including halogens and life-essential building blocks that readily accept or share electrons.',
    bgLight: 'bg-emerald-50 hover:bg-emerald-100/90',
    borderLight: 'border-emerald-200 hover:border-emerald-400',
    textLight: 'text-emerald-950',
    badgeBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
    colorHex: '#059669'
  },
  'noble-gas': {
    id: 'noble-gas',
    name: 'Noble Gases',
    description: 'Odorless, colorless, exceptionally stable monoatomic gases with full valence electron shells and very low chemical reactivity.',
    bgLight: 'bg-indigo-50 hover:bg-indigo-100/90',
    borderLight: 'border-indigo-200 hover:border-indigo-400',
    textLight: 'text-indigo-950',
    badgeBg: 'bg-indigo-500/10 text-indigo-800 border-indigo-200',
    colorHex: '#6366f1'
  },
  'lanthanide': {
    id: 'lanthanide',
    name: 'Lanthanides',
    description: 'Rare earth elements from Lanthanum to Lutetium with filling 4f orbitals, crucial for high-strength magnets and lasers.',
    bgLight: 'bg-purple-50 hover:bg-purple-100/90',
    borderLight: 'border-purple-200 hover:border-purple-400',
    textLight: 'text-purple-950',
    badgeBg: 'bg-purple-500/10 text-purple-800 border-purple-200',
    colorHex: '#9333ea'
  },
  'actinide': {
    id: 'actinide',
    name: 'Actinides',
    description: 'Radioactive f-block heavy elements from Actinium to Lawrencium with filling 5f subshells, essential in nuclear chemistry.',
    bgLight: 'bg-fuchsia-50 hover:bg-fuchsia-100/90',
    borderLight: 'border-fuchsia-200 hover:border-fuchsia-400',
    textLight: 'text-fuchsia-950',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-800 border-fuchsia-200',
    colorHex: '#c026d3'
  },
  'unknown': {
    id: 'unknown',
    name: 'Unknown / Superheavy',
    description: 'Artificially synthesized transactinide elements with short half-lives whose macro chemical states remain subject to research.',
    bgLight: 'bg-slate-50 hover:bg-slate-100/90',
    borderLight: 'border-slate-200 hover:border-slate-400',
    textLight: 'text-slate-900',
    badgeBg: 'bg-slate-500/10 text-slate-700 border-slate-200',
    colorHex: '#64748b'
  }
};
