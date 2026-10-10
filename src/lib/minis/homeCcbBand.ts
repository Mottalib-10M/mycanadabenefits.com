import { ccb } from '../engine/federal';
import { T, eur, type L } from './_kit';
/** Accueil : effet de 5 000 $ de revenu en plus sur l'ACE d'une famille. */
export default (l: L) => ({
  title: T(l, 'What $5,000 more income does to the child benefit', 'Ce que 5 000 $ de revenu en plus font à l’allocation pour enfants'),
  cta: T(l, 'Full child benefit calculator', 'Calculateur complet de l’ACE'),
  inputs: [
    { id: 'n', label: T(l, 'Children under 18', 'Enfants de moins de 18 ans'), def: 2, max: 10 },
    { id: 'i', label: T(l, 'Family net income', 'Revenu familial net'), def: 60000, unit: '$', max: 1000000 },
  ],
  run: ({ n, i }: Record<string, number>) => {
    const a = ccb({ under6: 0, age6to17: n, afni: i }), b = ccb({ under6: 0, age6to17: n, afni: i + 5000 });
    return { head: [T(l, 'Child benefit lost per year', 'Allocation perdue par an'), eur(a.annual - b.annual, l)] as [string, string],
      rows: [[T(l, 'At your income', 'À votre revenu'), eur(a.annual, l)], [T(l, 'With $5,000 more', 'Avec 5 000 $ de plus'), eur(b.annual, l)]] as [string, string][],
      note: T(l, 'Children aged 6 to 17, July 2026 to June 2027 amounts.', 'Enfants de 6 à 17 ans, montants de juillet 2026 à juin 2027.') };
  },
});
