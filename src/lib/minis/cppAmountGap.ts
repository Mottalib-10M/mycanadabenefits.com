import { cppPension } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** Montant du RPC : pension mensuelle selon le relevé et l'âge de début, comparée au maximum et à la moyenne 2026. */
export default (l: L) => ({
  title: T(l, 'Where your CPP sits against the 2026 maximum', 'Votre RPC face au maximum de 2026'),
  cta: T(l, 'Full CPP calculator', 'Calculateur complet du RPC'),
  inputs: [
    { id: 'p', label: T(l, 'CPP at 65 on your statement', 'RPC à 65 ans selon votre relevé'), def: Math.round(P.cpp.avg_65), unit: '$', max: P.cpp.max_65, decimals: 2 },
    { id: 'a', label: T(l, 'Age you start', 'Âge de début'), def: 65, options: Array.from({ length: 11 }, (_, i) => ({ value: String(60 + i), label: String(60 + i) })) },
  ],
  run: ({ p, a }: Record<string, number>) => {
    const you = cppPension(p, a), top = cppPension(P.cpp.max_65, a);
    return { head: [T(l, `Your monthly CPP at ${a}`, `Votre RPC mensuel à ${a} ans`), eur(you.monthly, l, 2)] as [string, string],
      rows: [
        [T(l, `Maximum possible at ${a}`, `Maximum possible à ${a} ans`), eur(top.monthly, l, 2)],
        [T(l, 'Share of that maximum', 'Part de ce maximum'), pct(top.monthly ? you.monthly / top.monthly : 0, l)],
        [T(l, 'Gap to the maximum, per year', 'Écart au maximum, par année'), eur(top.annual - you.annual, l)],
      ] as [string, string][],
      note: T(l, 'Statement amounts above the 2026 maximum are capped. Before tax and indexation.', 'Un montant de relevé supérieur au maximum de 2026 est plafonné. Avant impôt et indexation.') };
  },
});
