import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Terre-Neuve-et-Labrador : prestation pour enfants selon le rang de chaque enfant, plus le supplément nutritionnel des moins de 5 ans. */
export default (l: L) => ({
  title: T(l, 'Newfoundland and Labrador child benefit', 'Prestation pour enfants de Terre-Neuve-et-Labrador'),
  cta: T(l, 'Child benefit calculator', 'Calcul de l’allocation pour enfants'),
  inputs: [
    { id: 'n', label: T(l, 'Children under 18', 'Enfants de moins de 18 ans'), def: 3, max: 10 },
    { id: 'u', label: T(l, 'Of whom under 5', 'Dont moins de 5 ans'), def: 1, max: 10 },
    { id: 'i', label: T(l, 'Adjusted family net income (2025)', 'Revenu familial net rajusté (2025)'), def: 19000, unit: '$', max: 500000 },
  ],
  run: ({ n, u, i }: Record<string, number>) => {
    const N = P.prov.nl;
    const rank = Array.from({ length: Math.max(0, n) }, (_, k) => N.child_month[Math.min(k, 3)]);
    const max = rank.reduce((s, x) => s + x, 0);
    const small = Math.min(Math.max(0, u), Math.max(0, n));
    const under = i <= N.child_thr;
    return { head: [T(l, 'Child benefit per month', 'Prestation pour enfants par mois'), n <= 0 ? eur(0, l) : under ? eur(max, l, 2) : T(l, `Partial, below ${eur(max, l, 2)}`, `Partielle, sous ${eur(max, l, 2)}`)] as [string, string],
      rows: [[T(l, 'Maximum by rank of child', 'Maximum selon le rang des enfants'), rank.map((x) => eur(x, l, 2)).join(' + ') || '–'], [T(l, 'Nutrition supplement, maximum per month', 'Supplément nutritionnel, maximum mensuel'), eur(small * N.nutrition_month, l)], [T(l, 'Full benefit up to', 'Prestation complète jusqu’à'), eur(N.child_thr, l)]] as [string, string][],
      note: T(l, 'The CRA does not publish the reduction rate above the threshold, nor the income test of the nutrition supplement: your notice gives the exact figure.', 'L’ARC ne publie ni le taux de réduction au-delà du seuil ni le critère de revenu du supplément nutritionnel : votre avis donne le montant exact.') };
  },
});
