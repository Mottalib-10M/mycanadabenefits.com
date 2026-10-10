import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Manitoba : crédits d'abordabilité pour locataires (avec supplément aîné) et propriétaires, maximum par année d'imposition. */
export default (l: L) => ({
  title: T(l, 'Manitoba affordability credit by tax year', 'Crédit d’abordabilité du Manitoba par année'),
  cta: T(l, 'All 2026 benefit payment dates', 'Toutes les dates de versement 2026'),
  inputs: [
    { id: 's', label: T(l, 'Your home', 'Votre logement'), def: 0, options: [T(l, 'Renter', 'Locataire'), T(l, 'Renter, senior', 'Locataire, aîné'), T(l, 'Homeowner (principal residence)', 'Propriétaire (résidence principale)')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'y', label: T(l, 'Tax year', 'Année d’imposition'), def: 1, options: ['2025', '2026', '2027'].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ s, y }: Record<string, number>) => {
    const M = P.prov.mb;
    const year = (['2025', '2026', '2027'] as const)[y] ?? '2026';
    const rent = (M.renters as Record<string, number>)[year];
    const top = (M.renters_seniors as Record<string, number>)[year];
    const own = (M.homeowners as Record<string, number>)[year];
    const na = T(l, 'Not announced', 'Non annoncé');
    const total = s === 2 ? own : rent === undefined ? undefined : rent + (s === 1 ? top ?? 0 : 0);
    return { head: [T(l, `Maximum for ${year}`, `Maximum pour ${year}`), total === undefined ? na : eur(total, l)] as [string, string],
      rows: [[T(l, 'Renters credit', 'Crédit des locataires'), rent === undefined ? na : eur(rent, l)], [T(l, 'Seniors top-up (maximum)', 'Supplément pour aînés (maximum)'), top === undefined ? na : eur(top, l)], [T(l, 'Homeowners credit', 'Crédit des propriétaires'), own === undefined ? na : eur(own, l)]] as [string, string][],
      note: T(l, 'Maximums from Manitoba Finance; the seniors top-up shrinks with family net income. Paid through your Manitoba tax return or the property tax statement, not by the CRA benefit cheques.', 'Maximums de Finances Manitoba ; le supplément pour aînés baisse avec le revenu familial net. Obtenu par la déclaration de revenus ou le relevé d’impôt foncier, pas par les versements de prestations de l’ARC.') };
  },
});
