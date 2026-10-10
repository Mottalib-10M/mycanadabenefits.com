import { cgeb } from '../engine/federal';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** ACEBE : montant annuel 2026-2027 (hausse de 25 % comprise) et plafond du complément unique du 5 juin 2026 pour la même famille. */
export default (l: L) => ({
  title: T(l, 'Your Groceries and Essentials Benefit for 2026-27', 'Votre allocation pour l’épicerie de 2026-2027'),
  cta: T(l, 'Detailed CGEB calculator', 'Calculateur détaillé de l’ACEBE'),
  inputs: [
    { id: 's', label: T(l, 'Situation', 'Situation'), def: 1, options: [{ value: '0', label: T(l, 'Single or single parent', 'Seul ou parent seul') }, { value: '1', label: T(l, 'Married or common-law', 'Marié ou conjoint de fait') }] },
    { id: 'c', label: T(l, 'Children under 19', 'Enfants de moins de 19 ans'), def: 2, max: 10 },
    { id: 'i', label: T(l, 'Family net income (2025)', 'Revenu familial net (2025)'), def: 40000, unit: '$', max: 500000 },
  ],
  run: ({ s, c, i }: Record<string, number>) => {
    const r = cgeb({ couple: s === 1, children: c || 0, afni: i });
    const table = (s === 1 ? P.x.aTopupMaxCouple : P.x.aTopupMaxSingle) as number[];
    const top = table[Math.min(c || 0, table.length - 1)];
    return { head: [T(l, 'CGEB, July 2026 to June 2027', 'ACEBE, juillet 2026 à juin 2027'), eur(r.annual, l, 2)] as [string, string],
      rows: [[T(l, 'Each quarterly payment', 'Chaque versement trimestriel'), eur(r.quarterly, l, 2)], [T(l, 'Reduction for income', 'Réduction liée au revenu'), eur(r.reduction, l, 2)], [T(l, 'June 5, 2026 top-up, maximum for this family', 'Complément du 5 juin 2026, maximum pour cette famille'), eur(top, l)]] as [string, string][],
      note: T(l, 'The top-up was based on 2024 income and has already been paid: the figure shown is its ceiling, not your amount.', 'Le complément reposait sur le revenu de 2024 et a déjà été versé : le chiffre affiché est son plafond, pas votre montant.') };
  },
});
