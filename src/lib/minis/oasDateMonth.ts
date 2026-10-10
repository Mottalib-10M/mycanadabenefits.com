import { payDateIn } from '../engine/dates';
import { oasRecovery } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, jourMois, moisOptions, type L } from './_kit';
/** Dates SV : jour du dépôt d'un mois de juillet à décembre 2026, montant du trimestre selon l'âge et impôt de récupération retenu (revenu 2025). */
const quarterOf = (m: number) => (m >= 10 ? '2026-10' : '2026-07') as '2026-10' | '2026-07';
export default (l: L) => ({
  title: T(l, 'Your OAS deposit, month by month', 'Votre dépôt de la SV, mois par mois'),
  cta: T(l, 'Every 2026 benefit date', 'Toutes les dates de 2026'),
  inputs: [
    { id: 'm', label: T(l, 'Month (2026)', 'Mois (2026)'), def: 11, options: moisOptions(l).slice(6) },
    { id: 'a', label: T(l, 'Your age', 'Votre âge'), def: 0, options: [{ value: '0', label: T(l, '65 to 74', '65 à 74 ans') }, { value: '1', label: T(l, '75 or older', '75 ans ou plus') }] },
    { id: 'i', label: T(l, 'Your 2025 net income', 'Votre revenu net de 2025'), def: 105000, unit: '$', max: 400000 },
  ],
  run: ({ m, a, i }: Record<string, number>) => {
    const month = m >= 7 && m <= 12 ? m : 11;
    const d = payDateIn('cpp_oas', month);
    const gross = P.oas.quarters[quarterOf(month)][a === 1 ? 1 : 0];
    const back = Math.round(oasRecovery(i, gross * 12, 2025) / 12 * 100) / 100;
    return { head: [T(l, 'OAS deposit date', 'Date du dépôt de la SV'), d ? jourMois(d, l) : '–'] as [string, string],
      rows: [[T(l, 'Full OAS pension that month', 'Pension complète de la SV ce mois-là'), eur(gross, l, 2)], [T(l, 'Recovery tax withheld', 'Impôt de récupération retenu'), eur(back, l, 2)], [T(l, 'OAS left in the deposit', 'SV restant dans le dépôt'), eur(gross - back, l, 2)]] as [string, string][],
      note: T(l, 'Full pension (40 years in Canada after 18). Recovery based on 2025 income, applied from July 2026 to June 2027.', 'Pension complète (40 ans au Canada après 18 ans). Récupération calculée sur le revenu de 2025, appliquée de juillet 2026 à juin 2027.') };
  },
});
