import { ccb } from '../engine/federal';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Garde partagée : chaque parent reçoit la moitié de l'ACE calculée sur le revenu de son propre ménage. */
export default (l: L) => ({
  title: T(l, 'Shared custody: what each parent receives', 'Garde partagée : ce que reçoit chaque parent'),
  cta: T(l, 'Run the full CCB calculator', 'Lancer le calculateur complet de l’ACE'),
  inputs: [
    { id: 'n', label: T(l, 'Children aged 6 to 17 in shared custody', 'Enfants de 6 à 17 ans en garde partagée'), def: 2, max: 8 },
    { id: 'a', label: T(l, 'Household income of parent A', 'Revenu du ménage du parent A'), def: 42000, unit: '$', max: 1000000 },
    { id: 'b', label: T(l, 'Household income of parent B', 'Revenu du ménage du parent B'), def: 95000, unit: '$', max: 1000000 },
  ],
  run: ({ n, a, b }: Record<string, number>) => {
    const k = Math.max(1, n || 0), s = P.x.bCustodyShare as number;
    const ra = ccb({ under6: 0, age6to17: k, afni: a || 0 }).annual * s;
    const rb = ccb({ under6: 0, age6to17: k, afni: b || 0 }).annual * s;
    return { head: [T(l, 'Both homes together, per month', 'Les deux foyers ensemble, par mois'), eur((ra + rb) / 12, l, 2)] as [string, string],
      rows: [[T(l, 'Parent A, per month', 'Parent A, par mois'), eur(ra / 12, l, 2)], [T(l, 'Parent B, per month', 'Parent B, par mois'), eur(rb / 12, l, 2)], [T(l, 'Gap between the two homes, per year', 'Écart entre les deux foyers, par an'), eur(Math.abs(ra - rb), l)]] as [string, string][],
      note: T(l, 'Each household income includes a new spouse or partner, if any. The CRA notice of each parent gives the amount paid.', 'Le revenu de chaque ménage comprend le nouveau conjoint, s’il y en a un. L’avis de l’ARC de chaque parent fait foi.') };
  },
});
