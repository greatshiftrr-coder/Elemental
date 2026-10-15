export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type StandardState = 'solid' | 'liquid' | 'gas' | 'unknown';
export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: ElementCategory;
  period: number;
  group: number; // 1-18 or 3 for lanthanides/actinides
  block: ElementBlock;
  gridRow: number; // 1-7 for main, 8 for lanthanides, 9 for actinides
  gridCol: number; // 1-18
  state: StandardState;
  meltingPoint: number | null; // in Kelvin
  boilingPoint: number | null; // in Kelvin
  density: number | null; // in g/cm³ (or g/L for STP gas)
  electronegativity: number | null; // Pauling
  ionizationEnergy: number | null; // kJ/mol
  electronConfiguration: string;
  shells: number[]; // e.g. [2, 8, 18, 1]
  oxidationStates: string;
  discoveredBy: string;
  yearDiscovered: string | number;
  summary: string;
  trivia?: string;
  appearance?: string;
}

export interface CategoryInfo {
  id: ElementCategory;
  name: string;
  description: string;
  bgLight: string;
  borderLight: string;
  textLight: string;
  badgeBg: string;
  colorHex: string;
}
