import { P } from '../engine/params';
import { T, eur, jourMois, type L } from './_kit';
const yn = (l: L) => [T(l, 'No', 'Non'), T(l, 'Yes', 'Oui')].map((x, i) => ({ value: String(i), label: x }));
/** Prestation de décès du RPC : montant de base et supplément versé à la succession sans survivant. */
export default (l: L) => ({
  title: T(l, 'CPP death benefit: base amount or top-up', 'Prestation de décès du RPC : base ou supplément'),
  cta: T(l, 'Survivor’s pension guide', 'Guide de la pension de survivant'),
  inputs: [
    { id: 'y', label: T(l, 'Years the person contributed', 'Années de cotisation du défunt'), def: 30, max: 50 },
    { id: 'r', label: T(l, 'Was already receiving a CPP or QPP pension', 'Touchait déjà une pension du RPC ou du RRQ'), def: 1, options: yn(l) },
    { id: 's', label: T(l, 'Leaves a spouse eligible for a survivor’s pension', 'Laisse un conjoint admissible à la pension de survivant'), def: 1, options: yn(l) },
  ],
  run: ({ y, r, s }: Record<string, number>) => {
    const base = P.cpp.death, extra = P.cpp.death_estate_extra;
    const sure = y >= (P.x.dDeathAltYears as number), maybe = y >= (P.x.dDeathMinYears as number);
    const topup = r === 0 && s === 0;
    const total = maybe ? base + (topup ? extra : 0) : 0;
    return { head: [T(l, 'One-time death benefit', 'Prestation de décès unique'), eur(total, l)] as [string, string],
      rows: [
        [T(l, 'Contribution test', 'Condition de cotisation'), sure ? T(l, 'Met', 'Remplie') : maybe ? T(l, 'Depends on the one-third rule', 'Dépend de la règle du tiers') : T(l, 'Not met', 'Non remplie')],
        [T(l, 'Basic amount', 'Montant de base'), eur(maybe ? base : 0, l)],
        [T(l, 'Estate top-up', 'Supplément à la succession'), eur(maybe && topup ? extra : 0, l)],
      ] as [string, string][],
      note: T(l, `Top-up for deaths on or after ${jourMois(P.x.dDeathTopupFrom as string, l)}.`, `Supplément pour les décès survenus depuis le ${jourMois(P.x.dDeathTopupFrom as string, l)}.`) };
  },
});
