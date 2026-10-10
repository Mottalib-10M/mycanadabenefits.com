import { cgeb, ccb } from '../engine/federal';
import { T, eur, type L } from './_kit';
/** Remise carbone : ce que l'ARC verse encore à un ménage depuis la fin de la remise (ACEBE, ACE), sans prétendre qu'elle la remplace. */
export default (l: L) => ({
  title: T(l, 'What still reaches your account without the rebate', 'Ce qui arrive encore sans la remise'),
  cta: T(l, 'CGEB calculator', 'Calculateur de l’ACEBE'),
  inputs: [
    { id: 's', label: T(l, 'Situation', 'Situation'), def: 1, options: [{ value: '0', label: T(l, 'Single', 'Seul') }, { value: '1', label: T(l, 'Couple', 'En couple') }] },
    { id: 'c', label: T(l, 'Children aged 6 to 17', 'Enfants de 6 à 17 ans'), def: 1, max: 10 },
    { id: 'i', label: T(l, 'Family net income (2025)', 'Revenu familial net (2025)'), def: 55000, unit: '$', max: 500000 },
  ],
  run: ({ s, c, i }: Record<string, number>) => {
    const g = cgeb({ couple: s === 1, children: c || 0, afni: i });
    const k = ccb({ under6: 0, age6to17: c || 0, afni: i });
    return { head: [T(l, 'Carbon rebate paid in 2026', 'Remise carbone versée en 2026'), eur(0, l)] as [string, string],
      rows: [[T(l, 'CGEB, each quarter (a separate benefit)', 'ACEBE, chaque trimestre (prestation distincte)'), eur(g.quarterly, l, 2)], [T(l, 'Child benefit, each month', 'Allocation pour enfants, chaque mois'), eur(k.monthly, l, 2)], [T(l, 'Both over July 2026 to June 2027', 'Les deux, de juillet 2026 à juin 2027'), eur(g.annual + k.annual, l)]] as [string, string][],
      note: T(l, 'Neither benefit replaces the rebate: both existed before it ended and are based on income, not on fuel costs.', 'Aucune ne remplace la remise : les deux existaient avant sa fin et dépendent du revenu, pas du coût du carburant.') };
  },
});
