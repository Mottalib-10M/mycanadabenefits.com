import { cppContribution } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Cotisations 2026 au RPC et au RPC2 pour un salaire ou un revenu de travail autonome. */
export default (l: L) => ({
  title: T(l, 'Your 2026 CPP and CPP2 contributions', 'Vos cotisations 2026 au RPC et au RPC2'),
  cta: T(l, 'See what the pension pays back', 'Voir ce que la pension rapporte'),
  inputs: [
    { id: 'e', label: T(l, 'Employment or self-employment earnings', 'Revenu d’emploi ou de travail autonome'), def: 60000, unit: '$', max: 500000 },
    { id: 's', label: T(l, 'Status', 'Statut'), def: 0, options: [T(l, 'Employee', 'Salarié'), T(l, 'Self-employed', 'Travailleur autonome')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ e, s }: Record<string, number>) => {
    const c = cppContribution(e, s === 1);
    return { head: [T(l, 'Your contributions for 2026', 'Vos cotisations pour 2026'), eur(c.total, l, 2)] as [string, string],
      rows: [
        [T(l, 'Base CPP', 'RPC de base'), eur(c.base, l, 2)],
        [T(l, 'CPP2 (earnings above the YMPE)', 'RPC2 (gains au-dessus du MGA)'), eur(c.second, l, 2)],
        s === 1 ? [T(l, 'Employer share', 'Part de l’employeur'), T(l, 'Included: you pay both', 'Incluse : vous payez les deux')] : [T(l, 'Your employer adds', 'Votre employeur ajoute'), eur(c.total, l, 2)],
        [T(l, 'Per month on average', 'Par mois en moyenne'), eur(c.total / 12, l, 2)],
      ] as [string, string][],
      note: T(l, `Base CPP stops at ${eur(P.cpp.ympe, l)}, CPP2 at ${eur(P.cpp.yampe, l)}.`, `Le RPC de base s’arrête à ${eur(P.cpp.ympe, l)}, le RPC2 à ${eur(P.cpp.yampe, l)}.`) };
  },
});
