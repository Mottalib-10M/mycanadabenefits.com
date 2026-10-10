import { payDateIn } from '../engine/dates';
import { ccb } from '../engine/federal';
import { P } from '../engine/params';
import { T, eur, jourMois, moisOptions, type L } from './_kit';
/** Dates ACE : jour du versement d'un mois de juillet à décembre 2026 et montant mensuel (ou versement unique de juillet sous 240 $). */
const KIDS: Array<[number, number, string, string]> = [
  [1, 0, 'One child under 6', 'Un enfant de moins de 6 ans'],
  [0, 1, 'One child aged 6 to 17', 'Un enfant de 6 à 17 ans'],
  [1, 1, 'Two: one under 6, one 6 to 17', 'Deux : un de moins de 6 ans, un de 6 à 17 ans'],
  [0, 2, 'Two aged 6 to 17', 'Deux de 6 à 17 ans'],
  [1, 2, 'Three: one under 6, two 6 to 17', 'Trois : un de moins de 6 ans, deux de 6 à 17 ans'],
];
export default (l: L) => ({
  title: T(l, 'When your child benefit lands, and how much', 'Quand arrive votre allocation pour enfants, et combien'),
  cta: T(l, 'Full child benefit calculator', 'Calculateur complet de l’ACE'),
  inputs: [
    { id: 'm', label: T(l, 'Month (2026)', 'Mois (2026)'), def: 12, options: moisOptions(l).slice(6) },
    { id: 'k', label: T(l, 'Children', 'Enfants'), def: 2, options: KIDS.map((k, n) => ({ value: String(n), label: T(l, k[2], k[3]) })) },
    { id: 'i', label: T(l, 'Family net income (2025)', 'Revenu familial net (2025)'), def: 70000, unit: '$', max: 1000000 },
  ],
  run: ({ m, k, i }: Record<string, number>) => {
    const month = m >= 7 && m <= 12 ? m : 12;
    const kid = KIDS[k] ?? KIDS[2];
    const r = ccb({ under6: kid[0], age6to17: kid[1], afni: i });
    const d = payDateIn('ccb', r.lumpSum ? 7 : month);
    const amount = r.lumpSum ? (month === 7 ? r.annual : 0) : r.monthly;
    return { head: [T(l, 'Payment date', 'Date du versement'), d ? jourMois(d, l) : '–'] as [string, string],
      rows: [[T(l, 'Paid that month', 'Versé ce mois-là'), eur(amount, l, 2)], [T(l, 'Yearly total, July 2026 to June 2027', 'Total annuel, juillet 2026 à juin 2027'), eur(r.annual, l)], [T(l, 'Paid as', 'Mode de versement'), r.annual === 0 ? T(l, 'nothing at this income', 'rien à ce revenu') : r.lumpSum ? T(l, `one July payment (under ${eur(P.ccb.lump_sum_under, l)} a year)`, `un versement en juillet (moins de ${eur(P.ccb.lump_sum_under, l)} par an)`) : T(l, 'twelve monthly payments', 'douze versements mensuels')]] as [string, string][],
      note: T(l, 'Federal CCB only. Provincial child benefits paid with it are not included.', 'ACE fédérale seulement. Les allocations provinciales versées avec elle ne sont pas comprises.') };
  },
});
