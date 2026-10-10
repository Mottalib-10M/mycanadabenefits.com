/** Libellés partagés des calculateurs (provinces, situations), anglais puis français. */
import type { Province } from '../../lib/engine/provinces';
import type { L } from './kit';

export const PROV_NAMES: Record<Province, [string, string]> = {
  on: ['Ontario', 'Ontario'], qc: ['Quebec', 'Québec'], bc: ['British Columbia', 'Colombie-Britannique'], ab: ['Alberta', 'Alberta'],
  sk: ['Saskatchewan', 'Saskatchewan'], mb: ['Manitoba', 'Manitoba'], nb: ['New Brunswick', 'Nouveau-Brunswick'], ns: ['Nova Scotia', 'Nouvelle-Écosse'],
  pe: ['Prince Edward Island', 'Île-du-Prince-Édouard'], nl: ['Newfoundland and Labrador', 'Terre-Neuve-et-Labrador'], yt: ['Yukon', 'Yukon'],
  nt: ['Northwest Territories', 'Territoires du Nord-Ouest'], nu: ['Nunavut', 'Nunavut'],
};
export const provName = (p: Province, l: L) => PROV_NAMES[p][l === 'fr' ? 1 : 0];
export const provOptions = (l: L) => (Object.keys(PROV_NAMES) as Province[]).map((p) => ({ value: p, label: provName(p, l) }));
export const tr = (l: L, en: string, fr: string) => (l === 'fr' ? fr : en);
export const dollar = (l: L) => '$';
