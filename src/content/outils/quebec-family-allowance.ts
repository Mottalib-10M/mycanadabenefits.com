import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const af = (h: Helpers) => h.P.prov.qc.af;
type Case = { n: number; single: boolean; income: number };
const CASES: Case[] = [
  { n: 1, single: false, income: 50000 },
  { n: 2, single: false, income: 58000 },
  { n: 1, single: true, income: 38000 },
  { n: 2, single: true, income: 52000 },
  { n: 3, single: false, income: 95000 },
];
const table = (h: Helpers, l: 0 | 1) => h.table(
  l ? ['Famille, revenu familial', 'Maximum', 'Minimum', 'Fournitures scolaires', 'Allocation 2026'] : ['Family, family income', 'Maximum', 'Minimum', 'School supplies', '2026 allowance'],
  CASES.map((c) => {
    const r = h.M.quebecFamilyAllowance(c.n, c.single, c.income);
    const who = c.single ? (l ? `Monoparentale, ${c.n} enfant${c.n > 1 ? 's' : ''}` : `Single parent, ${c.n} child${c.n > 1 ? 'ren' : ''}`) : (l ? `Couple, ${c.n} enfant${c.n > 1 ? 's' : ''}` : `Couple, ${c.n} child${c.n > 1 ? 'ren' : ''}`);
    return [`${who}, ${h.eur(c.income)}`, h.eur(r.max), h.eur(r.min), h.eur(r.school), r.partial ? (l ? `entre ${h.eur(r.min)} et ${h.eur(r.max)}` : `between ${h.eur(r.min)} and ${h.eur(r.max)}`) : h.eur(r.max)];
  }),
  l ? 'Allocation famille 2026, calculée avec les paramètres de Finances Québec et de Retraite Québec' : 'Quebec family allowance 2026, computed with Finances Québec and Retraite Québec parameters',
  ['l', 'r', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'quebec-family-allowance', group: 'provinces', order: 20, tool: 'qcfa',
  related: ['quebec-solidarity-tax-credit', 'ccb-calculator', 'canada-child-benefit', 'quebec-pension-plan', 'benefit-payment-dates'],
  sources: ['rqAf', 'qcParams', 'gRqDates' as SourceKey],
  en: {
    slug: 'quebec-family-allowance',
    nav: 'Quebec family allowance',
    card: 'Retraite Québec’s family allowance for 2026: maximum, minimum, single-parent amount and payment dates.',
    title: 'Quebec Family Allowance 2026: Amounts, Minimum and Dates',
    description: 'Quebec family allowance 2026: up to $3,068 per child, at least $1,221, $1,077 more for a single parent, full amount for a couple at or below $60,398 of income.',
    h1: 'Quebec family allowance',
    intro: 'Enter the number of children, your family type and your family income to see the 2026 family allowance paid by Retraite Québec.',
    resume: (h) => { const a = af(h); const q = h.P.x.gAfDatesQuarterly; return `The Quebec family allowance pays up to ${h.eur(a.max)} per child under 18 in 2026, and never less than ${h.eur(a.min)} per child, whatever the family income. Single-parent families add ${h.eur(a.single_max)} a year (at least ${h.eur(a.single_min)}). The full amount goes to couples whose family income is ${h.eur(a.thr_couple)} or less and to single parents at ${h.eur(a.thr_single)} or less; above those thresholds the allowance slides toward the minimum. Retraite Québec does not publish the rate of that slide, so between the two ends the calculator shows a range rather than inventing a figure. Every child also brings a ${h.eur(a.school)} school supplies supplement, paid once in July. The allowance comes four times a year, on ${h.date(q[0])}, ${h.date(q[1])}, ${h.date(q[2])} and ${h.date(q[3])}, or monthly on request. It is not taxable. The amount you receive is the one on your Retraite Québec notice.`; },
    faqs: (h) => { const a = af(h); const x = h.P.x; return [
      { q: 'What is the least a Quebec family can get from the family allowance in 2026?', a: `${h.eur(a.min)} per child, plus ${h.eur(a.single_min)} for a single-parent family. Retraite Québec gives the example of a couple with ${h.eur(a.example_min_income)} or more of family income: it still receives ${h.eur(a.min)} for each child, and a single parent at that income ${h.eur(x.gAfExampleSingleMin)} for one child. The allowance never drops to zero while the child is eligible.` },
      { q: 'Can I get the Quebec family allowance every month instead of every three months?', a: `Yes, by asking Retraite Québec. Monthly payments arrive on the first business day of the month, for example ${h.date(x.gAfDatesMonthly[1])} and ${h.date(x.gAfDatesMonthly[7])} in 2026, while the default quarterly payments fall in January, April, July and October. The yearly total is the same either way.` },
      { q: 'How much extra does Quebec pay for a child with a disability in 2026?', a: `The supplement for handicapped children is ${h.eur(a.disabled_month)} a month, or ${h.eur(a.disabled_month * 12)} a year, on top of the family allowance. When the child needs exceptional care, a second supplement pays ${h.eur(a.disabled_exc[0])} a month at level 1 or ${h.eur(a.disabled_exc[1])} at level 2, after assessment by Retraite Québec.` },
    ]; },
    body: (h) => { const a = af(h); const x = h.P.x; return `
<h2>What the calculator does</h2>
<p>It adds ${h.eur(a.max)} per child and, for a single parent, ${h.eur(a.single_max)}, then compares your family income with the threshold for your family type. Under the threshold the maximum is your allowance. Above it, the result is a range from the guaranteed minimum (${h.eur(a.min)} per child, ${h.eur(a.single_min)} for a single parent) to the maximum, because the reduction rate is not in the official 2026 parameters. The ${h.eur(a.school)} school supplies supplement is listed apart: it is paid on ${h.date(x.gAfSchoolDate)}.</p>
<h2>Typical families</h2>
${table(h, 0)}
<p>Retraite Québec’s own examples bracket the range: a couple at ${h.eur(x.gAfExampleCoupleIncome)} or less receives ${h.eur(a.max)} per child, a single parent at ${h.eur(x.gAfExampleSingleIncome)} or less ${h.eur(x.gAfExampleSingleMax)} for one child, and both fall to the minimum at about ${h.eur(a.example_min_income)}.</p>
<h2>Limits</h2>
<p>To qualify, the child must be under 18 and you must live in Québec and be a Canadian citizen, permanent resident or protected person, and file a Québec return every year. The tool does not model shared custody or disability supplements. The federal ${h.a('ccb-calculator', 'child benefit')} is paid on top, and low-income households may also receive the ${h.a('quebec-solidarity-tax-credit', 'solidarity tax credit')}. Amounts come from ${h.src('rqAf', 'Retraite Québec')} and the ${h.src('qcParams', 'Finances Québec 2026 parameters')}.</p>
`; },
  },
  fr: {
    slug: 'allocation-famille-quebec',
    nav: 'Allocation famille',
    card: 'L’Allocation famille 2026 de Retraite Québec : maximum, minimum, montant monoparental et dates de versement.',
    title: 'Allocation famille 2026 : montants, minimum et versements',
    description: 'Allocation famille 2026 : jusqu’à 3 068 $ par enfant, au moins 1 221 $, 1 077 $ de plus pour une famille monoparentale, montant complet sous 60 398 $.',
    h1: 'L’Allocation famille du Québec',
    intro: 'Entrez le nombre d’enfants, votre type de famille et votre revenu familial pour voir l’Allocation famille 2026 versée par Retraite Québec.',
    resume: (h) => { const a = af(h); const q = h.P.x.gAfDatesQuarterly; return `L’Allocation famille verse jusqu’à ${h.eur(a.max)} par enfant de moins de 18 ans en 2026, et jamais moins de ${h.eur(a.min)} par enfant, quel que soit le revenu familial. Les familles monoparentales reçoivent en plus ${h.eur(a.single_max)} par année (au moins ${h.eur(a.single_min)}). Le montant complet va aux couples dont le revenu familial ne dépasse pas ${h.eur(a.thr_couple)} et aux familles monoparentales à ${h.eur(a.thr_single)} ou moins ; au-delà, l’allocation glisse vers le minimum. Retraite Québec ne publie pas le taux de cette baisse : entre les deux bornes, le calculateur affiche donc une fourchette plutôt qu’un chiffre inventé. Chaque enfant donne aussi droit au supplément de ${h.eur(a.school)} pour l’achat de fournitures scolaires, versé une fois en juillet. L’allocation arrive quatre fois par année, le ${h.date(q[0])}, le ${h.date(q[1])}, le ${h.date(q[2])} et le ${h.date(q[3])}, ou chaque mois sur demande. Elle n’est pas imposable. Le montant reçu est celui de votre avis de Retraite Québec.`; },
    faqs: (h) => { const a = af(h); const x = h.P.x; return [
      { q: 'Quel est le montant minimal de l’Allocation famille en 2026 ?', a: `${h.eur(a.min)} par enfant, plus ${h.eur(a.single_min)} pour une famille monoparentale. Retraite Québec donne l’exemple d’un couple dont le revenu familial atteint ${h.eur(a.example_min_income)} ou plus : il reçoit tout de même ${h.eur(a.min)} par enfant, et une famille monoparentale à ce revenu, ${h.eur(x.gAfExampleSingleMin)} pour un enfant. L’allocation ne tombe jamais à zéro tant que l’enfant y donne droit.` },
      { q: 'Peut-on recevoir l’Allocation famille chaque mois plutôt qu’aux trois mois ?', a: `Oui, sur demande à Retraite Québec. Le versement mensuel arrive le premier jour ouvrable du mois, par exemple le ${h.date(x.gAfDatesMonthly[1])} et le ${h.date(x.gAfDatesMonthly[7])} en 2026, alors que les versements trimestriels, offerts par défaut, tombent en janvier, avril, juillet et octobre. Le total de l’année reste le même.` },
      { q: 'Combien Retraite Québec verse-t-elle de plus pour un enfant handicapé en 2026 ?', a: `Le supplément pour enfant handicapé est de ${h.eur(a.disabled_month)} par mois, soit ${h.eur(a.disabled_month * 12)} par année, en plus de l’Allocation famille. Si l’enfant a besoin de soins exceptionnels, un second supplément verse ${h.eur(a.disabled_exc[0])} par mois au palier 1 ou ${h.eur(a.disabled_exc[1])} au palier 2, après évaluation par Retraite Québec.` },
    ]; },
    body: (h) => { const a = af(h); const x = h.P.x; return `
<h2>Ce que fait le calculateur</h2>
<p>Il additionne ${h.eur(a.max)} par enfant et, pour une famille monoparentale, ${h.eur(a.single_max)}, puis compare votre revenu familial au seuil de votre type de famille. Sous le seuil, le maximum est votre allocation. Au-dessus, le résultat est une fourchette qui va du minimum garanti (${h.eur(a.min)} par enfant, ${h.eur(a.single_min)} pour une famille monoparentale) au maximum, parce que le taux de réduction ne figure pas dans les paramètres officiels de 2026. Le supplément de ${h.eur(a.school)} pour les fournitures scolaires est indiqué à part : il est versé le ${h.date(x.gAfSchoolDate)}.</p>
<h2>Familles types</h2>
${table(h, 1)}
<p>Les exemples de Retraite Québec encadrent la fourchette : un couple à ${h.eur(x.gAfExampleCoupleIncome)} ou moins reçoit ${h.eur(a.max)} par enfant, une famille monoparentale à ${h.eur(x.gAfExampleSingleIncome)} ou moins, ${h.eur(x.gAfExampleSingleMax)} pour un enfant, et tous deux descendent au minimum vers ${h.eur(a.example_min_income)}.</p>
<h2>Limites</h2>
<p>L’enfant doit avoir moins de 18 ans ; vous devez résider au Québec, être citoyen canadien, résident permanent ou personne protégée, et produire votre déclaration de revenus du Québec chaque année. L’outil ne traite ni la garde partagée ni les suppléments pour enfant handicapé. L’${h.a('ccb-calculator', 'allocation canadienne pour enfants')} s’ajoute, et les ménages à faible revenu peuvent aussi toucher le ${h.a('quebec-solidarity-tax-credit', 'crédit d’impôt pour solidarité')}. Montants tirés de ${h.src('rqAf', 'Retraite Québec')} et des ${h.src('qcParams', 'paramètres 2026 de Finances Québec')}.</p>
`; },
  },
});
