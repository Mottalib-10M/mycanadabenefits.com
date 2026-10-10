import { ccb, ontarioChildBenefit } from '../engine';
import { T, eur, type L } from './_kit';
/** Prestation ontarienne pour enfants : part de la POE dans le dépôt mensuel unique versé avec l'ACE. */
export default (l: L) => ({
  title: T(l, 'Your Ontario child benefit inside the monthly CRA deposit', 'Votre POE dans le dépôt mensuel de l’ARC'),
  cta: T(l, 'Full child benefit calculator', 'Calculateur complet de l’ACE'),
  inputs: [
    { id: 'y', label: T(l, 'Children under 6', 'Enfants de moins de 6 ans'), def: 1, max: 10 },
    { id: 'o', label: T(l, 'Children aged 6 to 17', 'Enfants de 6 à 17 ans'), def: 1, max: 10 },
    { id: 'i', label: T(l, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025'), def: 24000, unit: '$', max: 1000000 },
  ],
  run: ({ y, o, i }: Record<string, number>) => {
    const n = (y || 0) + (o || 0);
    const ocb = ontarioChildBenefit(n, i);
    const fed = ccb({ under6: y || 0, age6to17: o || 0, afni: i });
    const total = fed.monthly + ocb.monthlyMax;
    return {
      head: [ocb.partial ? T(l, 'Monthly deposit, at most', 'Dépôt mensuel, au plus') : T(l, 'Monthly deposit (CCB + OCB)', 'Dépôt mensuel (ACE + POE)'), eur(total, l, 2)] as [string, string],
      rows: [
        [T(l, 'Ontario child benefit', 'Prestation ontarienne pour enfants'), (ocb.partial ? T(l, 'up to ', 'jusqu’à ') : '') + eur(ocb.monthlyMax, l, 2)],
        [T(l, 'Canada child benefit', 'Allocation canadienne pour enfants'), eur(fed.monthly, l, 2)],
        [T(l, 'Full OCB up to this income', 'POE complète jusqu’à ce revenu'), eur(ocb.threshold, l)],
      ] as [string, string][],
      note: ocb.partial
        ? T(l, 'Your income is above the threshold: Ontario does not publish the rate at which the OCB then falls, so the figure shown is a ceiling.', 'Votre revenu dépasse le seuil : l’Ontario ne publie pas le taux auquel la POE diminue alors, le chiffre affiché est donc un plafond.')
        : T(l, 'July 2026 to June 2027 amounts, paid together around the 20th.', 'Montants de juillet 2026 à juin 2027, versés ensemble vers le 20.'),
    };
  },
});
