import { nsAffordableLiving } from '../engine/provinces';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Nouvelle-Écosse : crédit pour la vie abordable (moteur, exact) et prestation pour enfants (plein, partiel ou nul selon la zone publiée). */
export default (l: L) => ({
  title: T(l, 'Nova Scotia living credit and child benefit', 'Crédit vie abordable et prestation pour enfants (N.-É.)'),
  cta: T(l, 'Child benefit calculator', 'Calcul de l’allocation pour enfants'),
  inputs: [
    { id: 'n', label: T(l, 'Children under 18', 'Enfants de moins de 18 ans'), def: 1, max: 10 },
    { id: 'i', label: T(l, 'Adjusted family net income (2025)', 'Revenu familial net rajusté (2025)'), def: 24000, unit: '$', max: 500000 },
  ],
  run: ({ n, i }: Record<string, number>) => {
    const S = P.prov.ns;
    const altc = nsAffordableLiving(n, i);
    const full = n * S.nscb_month;
    const cb = n === 0 ? eur(0, l) : i <= S.nscb_partial[0] ? eur(full, l, 2) : i < S.nscb_partial[1] ? T(l, `Partial, below ${eur(full, l, 2)}`, `Partielle, sous ${eur(full, l, 2)}`) : T(l, 'Above the partial range', 'Au-delà de la zone partielle');
    return { head: [T(l, 'Affordable living credit per year', 'Crédit pour la vie abordable par an'), eur(altc, l, 2)] as [string, string],
      rows: [[T(l, 'Each quarterly share', 'Chaque versement trimestriel'), eur(altc / 4, l, 2)], [T(l, 'Child benefit, monthly', 'Prestation pour enfants, par mois'), cb], [T(l, 'Child benefit over 12 months', 'Prestation pour enfants sur 12 mois'), n > 0 && i <= S.nscb_partial[0] ? eur(full * 12, l, 2) : '–']] as [string, string][],
      note: T(l, 'Living credit: exact CRA formula (5% above the threshold). Child benefit: the CRA gives the partial range, not the rate.', 'Crédit : formule exacte de l’ARC (5 % au-delà du seuil). Prestation pour enfants : l’ARC donne la zone partielle, pas le taux.') };
  },
});
