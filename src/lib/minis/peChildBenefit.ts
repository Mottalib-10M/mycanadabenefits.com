import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Île-du-Prince-Édouard : prestation pour enfants à paliers (34,16 / 24,16 / 0 $), exacte, et crédit pour la taxe de vente maximal. */
export default (l: L) => ({
  title: T(l, 'PEI child benefit and sales tax credit', 'Prestation pour enfants et crédit de taxe de l’Î.-P.-É.'),
  cta: T(l, 'Child benefit calculator', 'Calcul de l’allocation pour enfants'),
  inputs: [
    { id: 'n', label: T(l, 'Children under 18', 'Enfants de moins de 18 ans'), def: 2, max: 10 },
    { id: 'c', label: T(l, 'Household', 'Ménage'), def: 1, options: [T(l, 'Single person', 'Personne seule'), T(l, 'Couple or single parent', 'Couple ou parent seul')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'i', label: T(l, 'Adjusted family net income (2025)', 'Revenu familial net rajusté (2025)'), def: 52000, unit: '$', max: 500000 },
  ],
  run: ({ n, c, i }: Record<string, number>) => {
    const X = P.x.hPeChild; const S = P.prov.pe.stc;
    const rate = i < X.thr ? X.low : i <= X.end ? X.mid : 0;
    return { head: [T(l, 'PEI child benefit per month', 'Prestation pour enfants par mois'), eur(n * rate, l, 2)] as [string, string],
      rows: [[T(l, 'Per child', 'Par enfant'), eur(rate, l, 2)], [T(l, 'Over 12 months', 'Sur 12 mois'), eur(n * rate * 12, l, 2)], [T(l, 'Sales tax credit, maximum per year', 'Crédit pour la taxe de vente, maximum annuel'), eur(c === 1 || n > 0 ? S.couple : S.single, l)]] as [string, string][],
      note: T(l, 'Child benefit: exact CRA steps. The income test of the sales tax credit is not on the CRA page; from November 2026 it becomes the Essentials Benefit with a minimum payment.', 'Prestation pour enfants : paliers exacts de l’ARC. Le critère de revenu du crédit de taxe n’est pas sur la page de l’ARC ; dès novembre 2026, il devient la prestation pour les besoins essentiels, avec un paiement minimal.') };
  },
});
