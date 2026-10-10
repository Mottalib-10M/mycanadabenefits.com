import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** AISH / ADAP : allocation de subsistance maximale, prestation de transition et prestation pour enfants (montants publiés). */
export default (l: L) => ({
  title: T(l, 'Your maximum AISH or ADAP payment', 'Votre versement maximal de l’AISH ou de l’ADAP'),
  cta: T(l, 'Canada Disability Benefit calculator', 'Calculateur de la PCPSH'),
  inputs: [
    { id: 'p', label: T(l, 'Program', 'Programme'), def: 0, options: [T(l, 'AISH', 'AISH'), T(l, 'ADAP, moved from AISH in July 2026', 'ADAP, transféré de l’AISH en juillet 2026'), T(l, 'ADAP, new client', 'ADAP, nouveau client')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'k', label: T(l, 'Dependent children', 'Enfants à charge'), def: 0, max: 10 },
  ],
  run: ({ p, k }: Record<string, number>) => {
    const A = P.prov.ab, kids = P.x.cAbChild as number[];
    const living = p === 0 ? A.aish_month : A.adap_month;
    const trans = p === 1 ? A.adap_transition : 0;
    let child = 0;
    for (let i = 0; i < Math.max(0, Math.floor(k)); i++) child += kids[Math.min(i, kids.length - 1)];
    return { head: [T(l, 'Maximum per month', 'Maximum par mois'), eur(living + trans + child, l)] as [string, string],
      rows: [[T(l, 'Living allowance', 'Allocation de subsistance'), eur(living, l)], [T(l, 'Transition benefit', 'Prestation de transition'), eur(trans, l)], [T(l, 'Child benefit', 'Prestation pour enfants'), eur(child, l)]] as [string, string][],
      note: T(l, 'Single client with no non-exempt income; a cohabiting partner on AISH or ADAP changes the living allowance.', 'Client seul sans revenu non exempté ; un conjoint qui touche l’AISH ou l’ADAP modifie l’allocation de subsistance.') };
  },
});
