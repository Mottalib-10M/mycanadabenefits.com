import { ccb } from '../engine/federal';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** PEH : supplément versé avec l'ACE pour les enfants admissibles au CIPH, après réduction au-delà du seuil. */
export default (l: L) => ({
  title: T(l, 'Child disability benefit for your family', 'Prestation pour enfants handicapés de votre famille'),
  cta: T(l, 'Add it to the full CCB estimate', 'L’ajouter à l’estimation complète de l’ACE'),
  inputs: [
    { id: 'd', label: T(l, 'Children approved for the DTC', 'Enfants admissibles au CIPH'), def: 1, max: 6 },
    { id: 'i', label: T(l, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025'), def: 95000, unit: '$', max: 1000000 },
  ],
  run: ({ d, i }: Record<string, number>) => {
    const n = Math.max(1, d || 0);
    const r = ccb({ under6: 0, age6to17: n, afni: i || 0, disabled: n });
    const rate = n >= 2 ? P.ccb.cdb.r[1] : P.ccb.cdb.r[0];
    return { head: [T(l, 'Child disability benefit per year', 'Prestation pour enfants handicapés par an'), eur(r.cdb, l, 2)] as [string, string],
      rows: [[T(l, 'Per month, inside the CCB deposit', 'Par mois, dans le dépôt de l’ACE'), eur(r.cdb / 12, l, 2)], [T(l, 'Maximum for these children', 'Maximum pour ces enfants'), eur(n * P.ccb.cdb.max, l)], [T(l, 'Reduction rate above the threshold', 'Taux de réduction au-delà du seuil'), `${pct(rate, l)} > ${eur(P.ccb.cdb.threshold, l)}`]] as [string, string][],
      note: T(l, 'The CRA pays it only to families entitled to the CCB. Amount set on your CRA notice.', 'L’ARC ne la verse qu’aux familles qui ont droit à l’ACE. Montant fixé par l’avis de l’ARC.') };
  },
});
