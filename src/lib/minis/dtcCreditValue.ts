import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** CIPH : valeur fédérale du crédit (montant pour personnes handicapées, supplément des moins de 18 ans) au taux de base 2026. */
export default (l: L) => ({
  title: T(l, 'What the disability amount saves in federal tax', 'Ce que le montant pour personnes handicapées fait économiser en impôt fédéral'),
  cta: T(l, 'Canada Disability Benefit calculator', 'Calculateur de la PCPSH'),
  inputs: [
    { id: 'a', label: T(l, 'Person with the DTC', 'Personne admise au CIPH'), def: 0, options: [T(l, '18 or older', '18 ans ou plus'), T(l, 'Under 18', 'Moins de 18 ans')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'c', label: T(l, 'Child care and attendant care claimed for the child', 'Frais de garde et de préposé déduits pour l’enfant'), def: 0, unit: '$', max: 100000 },
  ],
  run: ({ a, c }: Record<string, number>) => {
    const D = P.dtc, rate = P.x.cDtcRate as number;
    const supp = a === 1 ? Math.max(0, D.supp_under18 - Math.max(0, c - D.supp_childcare_threshold)) : 0;
    const amount = D.federal_amount + supp;
    return { head: [T(l, 'Federal tax reduction, at most', 'Baisse d’impôt fédéral, au plus'), eur(amount * rate, l, 2)] as [string, string],
      rows: [[T(l, 'Disability amount', 'Montant pour personnes handicapées'), eur(D.federal_amount, l)], [T(l, 'Supplement for under 18', 'Supplément des moins de 18 ans'), eur(supp, l)], [T(l, 'Rate applied', 'Taux appliqué'), pct(rate, l, 0)]] as [string, string][],
      note: T(l, 'Non-refundable: the saving cannot exceed the federal tax owed, but the unused part can be transferred. Provincial credit not included.', 'Non remboursable : l’économie ne dépasse pas l’impôt fédéral dû, mais la partie inutilisée peut être transférée. Crédit provincial non compris.') };
  },
});
