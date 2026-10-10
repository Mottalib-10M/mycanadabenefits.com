import { cppPension } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** Pension de survivant du RPC : part du survivant selon son âge et la pension du cotisant décédé. */
export default (l: L) => ({
  title: T(l, 'Estimate a CPP survivor’s pension', 'Estimer une pension de survivant du RPC'),
  cta: T(l, 'CPP calculator', 'Calculateur du RPC'),
  inputs: [
    { id: 'p', label: T(l, 'Contributor’s CPP at 65', 'RPC du cotisant à 65 ans'), def: Math.round(P.cpp.avg_65), unit: '$', max: P.cpp.max_65, decimals: 2 },
    { id: 's', label: T(l, 'Your age', 'Votre âge'), def: 1, options: [T(l, 'Under 65', 'Moins de 65 ans'), T(l, '65 or older', '65 ans ou plus')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'o', label: T(l, 'Your own CPP pension', 'Votre propre pension du RPC'), def: 0, unit: '$', max: P.cpp.max_65, decimals: 2 },
  ],
  run: ({ p, s, o }: Record<string, number>) => {
    const base = cppPension(p, 65).monthly;
    const surv = s === 1 ? Math.min(P.cpp.survivor_65_max, base * (P.x.dSurv65Rate as number)) : Math.min(P.cpp.survivor_u65_max, P.cpp.survivor_u65_flat + base * (P.x.dSurvU65Rate as number));
    const ceiling = P.cpp.combined_surv_ret_max;
    return { head: [T(l, 'Survivor’s pension, alone', 'Pension de survivant seule'), eur(surv, l, 2)] as [string, string],
      rows: [
        [T(l, 'Rule applied', 'Règle appliquée'), s === 1 ? T(l, `${pct(P.x.dSurv65Rate as number, l, 0)} of the contributor’s pension`, `${pct(P.x.dSurv65Rate as number, l, 0)} de la pension du cotisant`) : T(l, `Flat rate plus ${pct(P.x.dSurvU65Rate as number, l)}`, `Taux fixe plus ${pct(P.x.dSurvU65Rate as number, l)}`)],
        [T(l, 'Your pension plus the survivor’s pension', 'Votre pension plus la pension de survivant'), eur(o + surv, l, 2)],
        [T(l, 'Ceiling for combined survivor and retirement at 65', 'Plafond survivant et retraite combinés à 65 ans'), eur(ceiling, l, 2)],
      ] as [string, string][],
      note: o > 0 ? T(l, 'With your own pension, Service Canada applies the combination rule and pays less than the sum.', 'Avec votre propre pension, Service Canada applique la règle de combinaison et verse moins que la somme.') : T(l, '2026 amounts, before tax.', 'Montants de 2026, avant impôt.') };
  },
});
