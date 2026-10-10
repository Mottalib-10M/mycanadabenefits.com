import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Territoires : maximum mensuel des prestations pour enfants du Yukon, des T.N.-O. (grille familiale par âge) et du Nunavut, partiel au-delà du seuil. */
export default (l: L) => ({
  title: T(l, 'Territorial child benefit, monthly maximum', 'Prestation territoriale pour enfants, maximum mensuel'),
  cta: T(l, 'Child benefit calculator', 'Calcul de l’allocation pour enfants'),
  inputs: [
    { id: 't', label: T(l, 'Territory', 'Territoire'), def: 1, options: [T(l, 'Yukon', 'Yukon'), T(l, 'Northwest Territories', 'Territoires du Nord-Ouest'), T(l, 'Nunavut', 'Nunavut')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'n', label: T(l, 'Children under 18', 'Enfants de moins de 18 ans'), def: 2, max: 10 },
    { id: 'a', label: T(l, 'Ages (NWT grid)', 'Âges (grille des T.N.-O.)'), def: 0, options: [T(l, 'All under 6', 'Tous moins de 6 ans'), T(l, 'All 6 to 17', 'Tous de 6 à 17 ans')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'i', label: T(l, 'Adjusted family net income (2025)', 'Revenu familial net rajusté (2025)'), def: 28000, unit: '$', max: 500000 },
  ],
  run: ({ t, n, a, i }: Record<string, number>) => {
    const pr = P.prov; const G = P.x.hNtGrid;
    const kids = Math.max(0, n);
    const grid = (g: number[], add: number) => (kids === 0 ? 0 : kids <= 4 ? g[kids - 1] : g[3] + (kids - 4) * add);
    const max = t === 0 ? kids * pr.yt.child_month : t === 1 ? (a === 0 ? grid(G.u6, G.u6_add) : grid(G.k617, G.k617_add)) : kids * pr.nu.child_month;
    const thr = t === 0 ? pr.yt.thr : t === 1 ? pr.nt.thr : pr.nu.thr;
    const full = i <= thr;
    return { head: [T(l, 'Monthly benefit', 'Prestation mensuelle'), kids === 0 ? eur(0, l) : full ? eur(max, l, 2) : T(l, `Partial, below ${eur(max, l, 2)}`, `Partielle, sous ${eur(max, l, 2)}`)] as [string, string],
      rows: [[T(l, 'Maximum over 12 months', 'Maximum sur 12 mois'), eur(max * 12, l, 2)], [T(l, 'Full amount up to', 'Montant complet jusqu’à'), eur(thr, l)], [T(l, 'Paid with', 'Versée avec'), T(l, 'the CCB, same deposit', 'l’ACE, même dépôt')]] as [string, string][],
      note: T(l, 'Above the threshold the territories do not publish a rate on the CRA pages. NWT families with children in both age groups: see your CRA notice.', 'Au-delà du seuil, les territoires ne publient pas de taux sur les pages de l’ARC. Familles des T.N.-O. avec des enfants des deux groupes d’âge : voir l’avis de l’ARC.') };
  },
});
