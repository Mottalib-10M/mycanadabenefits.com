import { oas } from '../engine/pensions';
import { T, eur, type L } from './_kit';
/** Hausse de 10 % à 75 ans : pension avant et après le 75e anniversaire, selon la résidence et l'âge de début. */
const AGES = [65, 66, 67, 68, 69, 70];
export default (l: L) => ({
  title: T(l, 'Your OAS before and after 75', 'Votre SV avant et après 75 ans'),
  cta: T(l, 'Full OAS calculator', 'Calculateur complet de la SV'),
  inputs: [
    { id: 'y', label: T(l, 'Years in Canada after 18', 'Années au Canada après 18 ans'), def: 40, max: 60 },
    { id: 'a', label: T(l, 'Age you started OAS', 'Âge de début de la SV'), def: 65, options: AGES.map((x) => ({ value: String(x), label: String(x) })) },
  ],
  run: ({ y, a }: Record<string, number>) => {
    const age = AGES.includes(a) ? a : 65;
    const before = oas({ years: y, startAge: age }), after = oas({ years: y, startAge: age, age75: true });
    const up = after.gross - before.gross;
    return { head: [T(l, 'OAS per month from 75', 'SV par mois dès 75 ans'), after.eligible ? eur(after.gross, l, 2) : T(l, 'Not eligible', 'Non admissible')] as [string, string],
      rows: [
        [T(l, 'OAS per month at 74', 'SV par mois à 74 ans'), eur(before.gross, l, 2)],
        [T(l, 'Increase per month', 'Hausse par mois'), eur(up, l, 2)],
        [T(l, 'Increase over a year', 'Hausse sur un an'), eur(up * 12, l, 2)],
      ] as [string, string][],
      note: T(l, 'October to December 2026 rates, before recovery tax. The increase starts the month after your 75th birthday.', 'Taux d’octobre à décembre 2026, avant l’impôt de récupération. La hausse commence le mois suivant le 75e anniversaire.') };
  },
});
