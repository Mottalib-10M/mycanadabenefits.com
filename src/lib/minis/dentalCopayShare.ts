import { dental } from '../engine/federal';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** RCSD : part d'une facture dentaire payée par le régime et quote-part du patient selon le revenu familial net rajusté. */
export default (l: L) => ({
  title: T(l, 'Your share of a dental bill under the CDCP', 'Votre part d’une facture dentaire avec le RCSD'),
  cta: T(l, 'Check your CGEB at the same income', 'Estimer votre ACEBE au même revenu'),
  inputs: [
    { id: 'i', label: T(l, 'Adjusted family net income', 'Revenu familial net rajusté'), def: 75000, unit: '$', max: 1000000 },
    { id: 'f', label: T(l, 'Treatment cost at CDCP fees', 'Coût du traitement aux tarifs du RCSD'), def: 400, unit: '$', max: 50000 },
  ],
  run: ({ i, f }: Record<string, number>) => {
    const d = dental(i || 0); const fee = f || 0;
    if (!d.eligible) return { head: [T(l, 'You pay', 'Vous payez'), eur(fee, l)] as [string, string],
      rows: [[T(l, 'CDCP pays', 'Le RCSD paie'), eur(0, l)], [T(l, 'Why', 'Pourquoi'), T(l, `Income of ${eur(P.dental.income_limit, l)} or more`, `Revenu de ${eur(P.dental.income_limit, l)} ou plus`)]] as [string, string][],
      note: T(l, 'Above the limit, the plan does not apply.', 'Au-delà du plafond, le régime ne s’applique pas.') };
    return { head: [T(l, 'Your co-payment', 'Votre quote-part'), eur(fee * d.copay, l, 2)] as [string, string],
      rows: [[T(l, 'CDCP pays', 'Le RCSD paie'), eur(fee * (1 - d.copay), l, 2)], [T(l, 'Co-payment rate', 'Taux de quote-part'), pct(d.copay, l, 0)]] as [string, string][],
      note: T(l, 'A dentist who charges more than the CDCP fee can bill you the difference on top.', 'Un dentiste qui facture plus que le tarif du RCSD peut vous réclamer la différence en plus.') };
  },
});
