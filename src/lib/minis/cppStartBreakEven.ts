import { cppPension, cppBreakEven, cppCumulative } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
const ages = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }));
/** Âge de début du RPC : point d'équilibre entre deux âges et totaux jusqu'à 85 ans. */
export default (l: L) => ({
  title: T(l, 'Break-even age between two CPP start dates', 'Âge d’équilibre entre deux débuts du RPC'),
  cta: T(l, 'Compare every age in the calculator', 'Comparer tous les âges dans le calculateur'),
  inputs: [
    { id: 'p', label: T(l, 'CPP at 65 on your statement', 'RPC à 65 ans selon votre relevé'), def: Math.round(P.cpp.avg_65), unit: '$', max: P.cpp.max_65, decimals: 2 },
    { id: 'b', label: T(l, 'Earlier start', 'Début hâtif'), def: 60, options: ages(60, 69) },
    { id: 'a', label: T(l, 'Later start', 'Début tardif'), def: 70, options: ages(61, 70) },
  ],
  run: ({ p, b, a }: Record<string, number>) => {
    const lo = Math.min(b, a), hi = Math.max(b, a);
    const be = hi > lo ? cppBreakEven(p, lo, hi) : NaN;
    const ok = Number.isFinite(be);
    return { head: [T(l, `Starting at ${hi} catches up at about`, `Le début à ${hi} ans rattrape vers`), ok ? T(l, `age ${num(be, l, 1)}`, `${num(be, l, 1)} ans`) : T(l, 'choose two different ages', 'choisissez deux âges différents')] as [string, string],
      rows: [
        [T(l, `Monthly at ${lo}`, `Par mois à ${lo} ans`), eur(cppPension(p, lo).monthly, l, 2)],
        [T(l, `Monthly at ${hi}`, `Par mois à ${hi} ans`), eur(cppPension(p, hi).monthly, l, 2)],
        [T(l, `Total to 85, start at ${lo}`, `Total à 85 ans, début à ${lo} ans`), eur(cppCumulative(p, lo, 85), l)],
        [T(l, `Total to 85, start at ${hi}`, `Total à 85 ans, début à ${hi} ans`), eur(cppCumulative(p, hi, 85), l)],
      ] as [string, string][],
      note: T(l, 'In 2026 dollars, before tax; real payments are indexed every January.', 'En dollars de 2026, avant impôt ; les versements réels sont indexés chaque janvier.') };
  },
});
