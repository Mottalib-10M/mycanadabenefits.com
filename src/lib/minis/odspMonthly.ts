import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** POSPH : besoins essentiels + logement réel plafonné, moins 75 % des gains nets au-delà de l'exemption mensuelle. */
export default (l: L) => ({
  title: T(l, 'Your ODSP income support for a month', 'Votre soutien du revenu du POSPH pour un mois'),
  cta: T(l, 'Canada Disability Benefit calculator', 'Calculateur de la PCPSH'),
  inputs: [
    { id: 'h', label: T(l, 'Household', 'Ménage'), def: 0, options: [T(l, 'Single recipient', 'Bénéficiaire seul'), T(l, 'Couple, one with a disability', 'Couple, un conjoint handicapé'), T(l, 'Couple, both with a disability', 'Couple, les deux handicapés')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'r', label: T(l, 'Monthly rent and utilities', 'Loyer et services par mois'), def: 900, unit: '$', max: 10000 },
    { id: 'e', label: T(l, 'Net monthly earnings', 'Gains nets par mois'), def: 0, unit: '$', max: 20000 },
  ],
  run: ({ h, r, e }: Record<string, number>) => {
    const O = P.prov.on.odsp;
    const basic = h === 0 ? O.basic_single : h === 1 ? O.basic_couple : O.basic_couple_both;
    const shelter = Math.min(Math.max(0, r), h === 0 ? O.shelter['1'] : O.shelter['2']);
    const ded = O.work_rate * Math.max(0, e - O.work_exempt);
    const support = Math.max(0, basic + shelter - ded);
    return { head: [T(l, 'Income support', 'Soutien du revenu'), eur(support, l)] as [string, string],
      rows: [[T(l, 'Basic needs', 'Besoins essentiels'), eur(basic, l)], [T(l, 'Shelter (actual cost, capped)', 'Logement (coût réel, plafonné)'), eur(shelter, l)], [T(l, 'Deducted for earnings', 'Déduit pour les gains'), eur(ded, l)], [T(l, 'Support plus earnings', 'Soutien et gains réunis'), eur(support + Math.max(0, e), l)]] as [string, string][],
      note: T(l, 'July 2026 rates, no children, no other income. The earnings exemption is applied once to the amount entered.', 'Taux de juillet 2026, sans enfant ni autre revenu. L’exemption des gains est appliquée une fois au montant saisi.') };
  },
});
