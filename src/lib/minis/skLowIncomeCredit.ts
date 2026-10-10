import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Saskatchewan : crédit pour la taxe aux résidents à faible revenu (CTRFRS), maximum de la famille et part trimestrielle ; au-delà du seuil, partiel (taux non publié). */
export default (l: L) => ({
  title: T(l, 'Your Saskatchewan low-income tax credit', 'Votre crédit pour faible revenu de la Saskatchewan'),
  cta: T(l, 'Groceries and Essentials Benefit calculator', 'Calcul de l’ACEBE fédérale'),
  inputs: [
    { id: 'f', label: T(l, 'Household', 'Ménage'), def: 2, options: [T(l, 'Single, no child', 'Seul, sans enfant'), T(l, 'Single parent', 'Parent seul'), T(l, 'Couple', 'Couple')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'n', label: T(l, 'Children under 19', 'Enfants de moins de 19 ans'), def: 2, max: 10 },
    { id: 'i', label: T(l, 'Adjusted family net income (2025)', 'Revenu familial net rajusté (2025)'), def: 36000, unit: '$', max: 500000 },
  ],
  run: ({ f, n, i }: Record<string, number>) => {
    const S = P.prov.sk.slitc;
    const kids = f === 0 ? 0 : Math.max(0, n);
    // Parent seul : le montant pour personne à charge admissible remplace celui du conjoint pour un enfant (même convention que l'ACEBE).
    const second = f === 2 ? S.spouse : f === 1 && kids > 0 ? S.spouse : 0;
    const counted = f === 1 ? Math.max(0, kids - 1) : kids;
    const max = Math.min(S.max_family, S.adult + second + S.child * Math.min(counted, S.max_children));
    const zone = i <= S.thr ? 'full' : i < S.end ? 'partial' : 'none';
    const head = zone === 'full' ? eur(max, l) : zone === 'partial' ? T(l, `Partial, below ${eur(max, l)}`, `Partiel, sous ${eur(max, l)}`) : T(l, 'Likely nothing', 'Probablement rien');
    return { head: [T(l, 'Credit, July 2026 to June 2027', 'Crédit, juillet 2026 à juin 2027'), head] as [string, string],
      rows: [[T(l, 'Family maximum', 'Maximum de la famille'), eur(max, l)], [T(l, 'Each quarterly share at the maximum', 'Chaque quart au maximum'), eur(max / 4, l, 2)], [T(l, 'Reduction starts above', 'Réduction au-delà de'), eur(S.thr, l)], [T(l, 'Partial credit range ends at', 'Fin de la zone de crédit partiel'), eur(S.end, l)]] as [string, string][],
      note: T(l, 'The CRA does not publish the reduction rate: between the two incomes, only your notice gives the amount. Single parent: one child counted as eligible dependant.', 'L’ARC ne publie pas le taux de réduction : entre les deux revenus, seul votre avis donne le montant. Parent seul : un enfant compté comme personne à charge admissible.') };
  },
});
