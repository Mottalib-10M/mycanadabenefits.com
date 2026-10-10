import { oas } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** Pension partielle de la SV : montant selon les années de résidence après 18 ans, et règle des 20 ans hors du Canada. */
export default (l: L) => ({
  title: T(l, 'Your partial OAS pension', 'Votre pension partielle de la SV'),
  cta: T(l, 'Full OAS calculator', 'Calculateur complet de la SV'),
  inputs: [
    { id: 'y', label: T(l, 'Years lived in Canada after 18', 'Années vécues au Canada après 18 ans'), def: 22, max: 60 },
    { id: 'w', label: T(l, 'Where you live when paid', 'Lieu de résidence au moment du paiement'), def: 0, options: [{ value: '0', label: T(l, 'In Canada', 'Au Canada') }, { value: '1', label: T(l, 'Outside Canada', 'Hors du Canada') }] },
    { id: 'o', label: T(l, 'Your age', 'Votre âge'), def: 0, options: [{ value: '0', label: T(l, '65 to 74', '65 à 74 ans') }, { value: '1', label: T(l, '75 or older', '75 ans ou plus') }] },
  ],
  run: ({ y, w, o }: Record<string, number>) => {
    const min = w === 1 ? P.oas.res_min_abroad : P.oas.res_min;
    const r = oas({ years: y, startAge: 65, age75: o === 1 });
    const ok = r.eligible && y >= min;
    const full = o === 1 ? P.oas.max_75 : P.oas.max_65_74;
    return { head: [T(l, 'Partial OAS per month', 'SV partielle par mois'), ok ? eur(r.gross, l, 2) : T(l, 'Not eligible', 'Non admissible')] as [string, string],
      rows: [
        [T(l, 'Share of the full pension', 'Part de la pension complète'), ok ? pct(r.fraction, l, 1) : '–'],
        [T(l, 'Full pension (40 years)', 'Pension complète (40 ans)'), eur(full, l, 2)],
        [T(l, 'Minimum years for your case', 'Minimum d’années dans votre cas'), String(min)],
      ] as [string, string][],
      note: T(l, 'October to December 2026, pension started at 65. A social security agreement can help you qualify, not raise the amount.', 'Octobre à décembre 2026, pension commencée à 65 ans. Un accord de sécurité sociale peut aider à être admissible, pas à augmenter le montant.') };
  },
});
