import { bcFamilyBenefit } from '../engine/provinces';
import { T, eur, type L } from './_kit';
/** Crédit climat C.-B. : terminé ; ce que l'allocation familiale de la C.-B. verse encore à la famille en 2026-2027. */
export default (l: L) => ({
  title: T(l, 'B.C. family benefit now that the climate credit is gone', 'L’allocation familiale de la C.-B. depuis la fin du crédit climat'),
  cta: T(l, 'Full B.C. family benefit calculator', 'Calculateur complet de l’allocation de la C.-B.'),
  inputs: [
    { id: 'n', label: T(l, 'Children under 18', 'Enfants de moins de 18 ans'), def: 2, max: 10 },
    { id: 'i', label: T(l, 'Family net income (2025)', 'Revenu familial net (2025)'), def: 50000, unit: '$', max: 500000 },
    { id: 'p', label: T(l, 'Single parent', 'Parent seul'), def: 0, options: [{ value: '0', label: T(l, 'No', 'Non') }, { value: '1', label: T(l, 'Yes', 'Oui') }] },
  ],
  run: ({ n, i, p }: Record<string, number>) => {
    const b = bcFamilyBenefit(n || 0, i, p === 1);
    return { head: [T(l, 'B.C. family benefit, per year', 'Allocation familiale de la C.-B., par an'), eur(b.annual, l, 2)] as [string, string],
      rows: [[T(l, 'Each month, with the CCB', 'Chaque mois, avec l’ACE'), eur(b.monthly, l, 2)], [T(l, 'Ceiling for this family', 'Plafond pour cette famille'), eur(n ? b.max : 0, l)], [T(l, 'Climate action tax credit in 2026', 'Crédit pour l’action climatique en 2026'), eur(0, l)]] as [string, string][],
      note: T(l, 'July 2026 to June 2027 amounts, based on 2025 income. The climate credit made its final payment in April 2025.', 'Montants de juillet 2026 à juin 2027, selon le revenu de 2025. Le crédit climat a fait son dernier versement en avril 2025.') };
  },
});
