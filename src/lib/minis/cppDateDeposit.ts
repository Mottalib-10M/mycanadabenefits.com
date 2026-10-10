import { payDateIn } from '../engine/dates';
import { P } from '../engine/params';
import { T, eur, jourMois, moisOptions, type L } from './_kit';
/** Dates RPC : jour du dépôt d'un mois choisi et somme RPC + SV attendue ce jour-là. */
export default (l: L) => ({
  title: T(l, 'Your CPP deposit for a given month', 'Votre dépôt du RPC pour un mois donné'),
  cta: T(l, 'All 2026 payment dates', 'Toutes les dates de 2026'),
  inputs: [
    { id: 'm', label: T(l, 'Month (2026)', 'Mois (2026)'), def: 11, options: moisOptions(l) },
    { id: 'c', label: T(l, 'Your monthly CPP', 'Votre RPC mensuel'), def: Math.round(P.cpp.avg_65), unit: '$', max: 3000 },
    { id: 'o', label: T(l, 'Also receive OAS', 'Vous touchez aussi la SV'), def: 1, options: [T(l, 'No', 'Non'), T(l, 'Yes', 'Oui')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ m, c, o }: Record<string, number>) => {
    const d = payDateIn('cpp_oas', m || 1);
    const oasAmt = o === 1 ? (m >= 10 ? P.oas.quarters['2026-10'][0] : m >= 7 ? P.oas.quarters['2026-07'][0] : m >= 4 ? P.oas.quarters['2026-04'][0] : P.oas.quarters['2026-01'][0]) : 0;
    return { head: [T(l, 'Deposit date', 'Date du dépôt'), d ? jourMois(d, l) : '—'] as [string, string],
      rows: [[T(l, 'CPP', 'RPC'), eur(c, l, 2)], [T(l, 'OAS (full, 65 to 74)', 'SV (complète, 65 à 74 ans)'), eur(oasAmt, l, 2)], [T(l, 'Total that day, before tax', 'Total ce jour-là, avant impôt'), eur(c + oasAmt, l, 2)]] as [string, string][],
      note: T(l, 'OAS amount of the quarter that month belongs to.', 'Montant de la SV du trimestre auquel appartient le mois.') };
  },
});
