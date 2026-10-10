import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types repris des lignes du tableau des versements de l'ARC (cgebChart), recalculés par le moteur. */
const CASES: Array<[boolean, number, number]> = [[false, 0, 10000], [false, 0, 20000], [false, 0, 30000], [false, 0, 50000], [false, 1, 30000], [false, 1, 50000], [true, 2, 30000], [true, 2, 50000], [true, 2, 60000]];
const g = (h: Helpers, couple: boolean, children: number, afni: number) => h.M.cgeb({ couple, children, afni });

export default defineGuide({
  id: 'gst-credit-calculator',
  group: 'credits',
  order: 10,
  tool: 'cgeb',
  related: ['canada-groceries-essentials-benefit', 'gst-payment-dates', 'canada-workers-benefit', 'canada-child-benefit', 'canada-dental-care-plan'],
  sources: ['cgebAmounts', 'cgebChart', 'gstCredit', 'cgeb'],
  en: {
    slug: 'gst-credit-calculator',
    nav: 'GST credit calculator',
    card: 'The former GST/HST credit, now the Groceries and Essentials Benefit: your amount for July 2026 to June 2027.',
    title: 'GST Credit Calculator 2026: CGEB Amounts by Family Income',
    description: 'GST credit calculator 2026: the credit is now the Groceries and Essentials Benefit, $445 per adult, reduced by 5% of the family net income above $46,432.',
    h1: 'GST credit calculator',
    intro: 'Estimate the former GST/HST credit, renamed the Canada Groceries and Essentials Benefit in July 2026, from your family situation and 2025 net income.',
    resume: (h) => { const P = h.P.cgeb; return `The GST/HST credit has been called the Canada Groceries and Essentials Benefit since July 2026, with the same conditions and a ${h.pct(P.increase, 0)} increase for five years. For the payments of July 2026 to April 2027, based on 2025 income, the CRA grants ${h.eur(P.individual)} for you, ${h.eur(P.spouse)} for a spouse or common-law partner, ${h.eur(P.child)} per child under 19, and ${h.eur(P.first_child_single)} for the first child of a single parent. A single person also gets a supplement of up to ${h.eur(P.single_supp)}, phased in at ${h.pct(P.supp_rate, 0)} of net income above ${h.eur(P.supp_start)}; a single parent gets it in full. The total is then reduced by ${h.pct(P.rate, 0)} of adjusted family net income above ${h.eur(P.threshold)}. A couple with two children and ${h.eur(50000)} of family income receives ${h.eur(g(h, true, 2, 50000).annual, 2)} for the year, paid in four quarterly instalments of ${h.eur(g(h, true, 2, 50000).quarterly, 2)}. The calculator returns the same figures as the CRA payments chart.`; },
    faqs: (h) => [
      { q: 'Is the GST credit still paid after July 2026?', a: `Yes, under a new name. From July 2026 the CRA pays it as the Canada Groceries and Essentials Benefit, with the same eligibility and no new application. The 2026 deposits were ${h.date(h.P.cgeb.gst_dates_2026[0])} and ${h.date(h.P.cgeb.gst_dates_2026[1])} under the old name, then ${h.date(h.P.cgeb.dates[0])} and ${h.date(h.P.cgeb.dates[1])} as the CGEB. A one-time top-up was also paid on ${h.date(h.P.cgeb.topup_date)}.` },
      { q: 'Why does my GST credit estimate stop growing at a low income?', a: `For a single person, the extra ${h.eur(h.P.cgeb.single_supp)} supplement builds up at ${h.pct(h.P.cgeb.supp_rate, 0)} of net income above ${h.eur(h.P.cgeb.supp_start)}, so it is complete at ${h.eur(h.P.cgeb.supp_start + h.P.cgeb.single_supp / h.P.cgeb.supp_rate)}. Between that point and ${h.eur(h.P.cgeb.threshold)}, the benefit stays flat at ${h.eur(g(h, false, 0, 30000).annual, 2)}, then declines by ${h.pct(h.P.cgeb.rate, 0)} of each extra dollar of family income.` },
      { q: 'Does the GST credit calculator include provincial credits?', a: `No. It estimates the federal benefit only. When you file your return, the CRA also considers you automatically for related provincial and territorial programs, which follow their own rules and are not added here. Quebec residents have a separate ${h.a('quebec-solidarity-tax-credit', 'solidarity tax credit')}. The federal amount actually paid is the one on your CRA notice.` },
    ],
    body: (h) => {
      const rows = CASES.map(([c, k, x]) => { const r = g(h, c, k, x); return [c ? 'Couple' : k ? 'Single parent' : 'Single', h.num(k), h.eur(x), h.eur(r.annual, 2), h.eur(r.quarterly, 2)]; });
      return `
<h2>From the GST credit to the CGEB</h2>
<p>The ${h.src('gstCredit', 'CRA GST/HST credit page')} confirms the change of name in July 2026. Nothing changes in who qualifies: you must be a resident of Canada for tax purposes, generally 19 or older, and file a return. The CRA considers you automatically when you file. The calculator uses the ${h.src('cgebAmounts', 'CGEB payment amounts')} for the 2025 base year.</p>
<h2>Typical amounts, checked against the CRA chart</h2>
<p>Each row below matches a row of the ${h.src('cgebChart', 'CRA payments chart')} for July 2026 to June 2027.</p>
${h.table(['Situation', 'Children', 'Family income 2025', 'For the year', 'Per quarter'], rows, 'Groceries and Essentials Benefit, base year 2025 (site engine, equal to the CRA chart)', ['l', 'r', 'r', 'r', 'r'])}
<h2>What it does not do</h2>
<p>The calculator assumes a full year in the same situation. A birth, a separation or a new spouse during the year can change later payments once the CRA has been told. It does not estimate the one-time top-up of ${h.date(h.P.cgeb.topup_date)}. For the deposit days, see the ${h.a('gst-payment-dates', 'GST payment dates')}; for the benefit itself, the ${h.a('canada-groceries-essentials-benefit', 'CGEB guide')}.</p>
`; },
  },
  fr: {
    slug: 'calcul-credit-tps',
    nav: 'Calcul du crédit TPS',
    card: 'L’ancien crédit pour la TPS/TVH, devenu l’allocation pour l’épicerie et les besoins essentiels : votre montant de juillet 2026 à juin 2027.',
    title: 'Crédit TPS 2026 : calcul du montant de l’ACEBE par revenu',
    description: 'Calcul du crédit TPS 2026 : devenu l’allocation pour l’épicerie et les besoins essentiels, 445 $ par adulte, réduite de 5 % du revenu au-delà de 46 432 $.',
    h1: 'Calculateur du crédit TPS',
    intro: 'Estimez l’ancien crédit pour la TPS/TVH, renommé allocation canadienne pour l’épicerie et les besoins essentiels en juillet 2026, selon votre situation familiale et votre revenu net de 2025.',
    resume: (h) => { const P = h.P.cgeb; return `Le crédit pour la TPS/TVH s’appelle depuis juillet 2026 l’allocation canadienne pour l’épicerie et les besoins essentiels, avec les mêmes conditions et une hausse de ${h.pct(P.increase, 0)} pour cinq ans. Pour les versements de juillet 2026 à avril 2027, fondés sur le revenu de 2025, l’ARC accorde ${h.eur(P.individual)} pour vous, ${h.eur(P.spouse)} pour un conjoint marié ou de fait, ${h.eur(P.child)} par enfant de moins de 19 ans et ${h.eur(P.first_child_single)} pour le premier enfant d’un parent seul. Une personne seule reçoit aussi un supplément d’au plus ${h.eur(P.single_supp)}, qui monte de ${h.pct(P.supp_rate, 0)} du revenu net au-delà de ${h.eur(P.supp_start)} ; un parent seul le reçoit en entier. Le total est ensuite réduit de ${h.pct(P.rate, 0)} du revenu familial net rajusté au-delà de ${h.eur(P.threshold)}. Un couple avec deux enfants et ${h.eur(50000)} de revenu familial reçoit ${h.eur(g(h, true, 2, 50000).annual, 2)} pour l’année, en quatre versements trimestriels de ${h.eur(g(h, true, 2, 50000).quarterly, 2)}. Le calculateur retombe sur les montants du tableau des versements de l’ARC.`; },
    faqs: (h) => [
      { q: 'Le crédit TPS est-il encore versé après juillet 2026 ?', a: `Oui, sous un nouveau nom. Depuis juillet 2026, l’ARC le verse comme allocation canadienne pour l’épicerie et les besoins essentiels, avec les mêmes conditions et sans nouvelle demande. Les dépôts de 2026 ont eu lieu le ${h.date(h.P.cgeb.gst_dates_2026[0])} et le ${h.date(h.P.cgeb.gst_dates_2026[1])} sous l’ancien nom, puis le ${h.date(h.P.cgeb.dates[0])} et le ${h.date(h.P.cgeb.dates[1])} sous le nouveau. Un complément unique a aussi été versé le ${h.date(h.P.cgeb.topup_date)}.` },
      { q: 'Pourquoi mon estimation du crédit TPS cesse-t-elle de monter à faible revenu ?', a: `Pour une personne seule, le supplément de ${h.eur(h.P.cgeb.single_supp)} se constitue à raison de ${h.pct(h.P.cgeb.supp_rate, 0)} du revenu net au-delà de ${h.eur(h.P.cgeb.supp_start)} : il est complet à ${h.eur(h.P.cgeb.supp_start + h.P.cgeb.single_supp / h.P.cgeb.supp_rate)}. Entre ce point et ${h.eur(h.P.cgeb.threshold)}, l’allocation reste à ${h.eur(g(h, false, 0, 30000).annual, 2)}, puis elle diminue de ${h.pct(h.P.cgeb.rate, 0)} de chaque dollar de revenu familial en plus.` },
      { q: 'Le calculateur du crédit TPS inclut-il les crédits provinciaux ?', a: `Non. Il estime seulement l’allocation fédérale. Quand vous produisez votre déclaration, l’ARC vous considère aussi d’office pour les programmes provinciaux et territoriaux connexes, qui ont leurs propres règles et ne sont pas ajoutés ici. Au Québec, le ${h.a('quebec-solidarity-tax-credit', 'crédit d’impôt pour solidarité')} est distinct. Le montant fédéral réellement versé est celui de votre avis de l’ARC.` },
    ],
    body: (h) => {
      const rows = CASES.map(([c, k, x]) => { const r = g(h, c, k, x); return [c ? 'Couple' : k ? 'Parent seul' : 'Personne seule', h.num(k), h.eur(x), h.eur(r.annual, 2), h.eur(r.quarterly, 2)]; });
      return `
<h2>Du crédit TPS à l’ACEBE</h2>
<p>La ${h.src('gstCredit', 'page de l’ARC sur le crédit pour la TPS/TVH')} confirme le changement de nom en juillet 2026. Rien ne change quant aux personnes admissibles : il faut résider au Canada aux fins de l’impôt, avoir en général 19 ans ou plus et produire une déclaration. L’ARC examine votre droit d’office quand vous la produisez. Le calculateur utilise les ${h.src('cgebAmounts', 'montants de l’ACEBE')} de l’année de base 2025.</p>
<h2>Montants types, vérifiés sur le tableau de l’ARC</h2>
<p>Chaque ligne ci-dessous correspond à une ligne du ${h.src('cgebChart', 'tableau des versements de l’ARC')} pour juillet 2026 à juin 2027.</p>
${h.table(['Situation', 'Enfants', 'Revenu familial 2025', 'Pour l’année', 'Par trimestre'], rows, 'Allocation pour l’épicerie et les besoins essentiels, année de base 2025 (moteur du site, identique au tableau de l’ARC)', ['l', 'r', 'r', 'r', 'r'])}
<h2>Ce qu’il ne fait pas</h2>
<p>Le calculateur suppose une année complète dans la même situation. Une naissance, une séparation ou un nouveau conjoint en cours d’année peut modifier les versements suivants, une fois l’ARC informée. Il n’estime pas le complément unique du ${h.date(h.P.cgeb.topup_date)}. Pour les jours de dépôt, voir les ${h.a('gst-payment-dates', 'dates de versement du crédit TPS')} ; pour l’allocation elle-même, le ${h.a('canada-groceries-essentials-benefit', 'guide de l’ACEBE')}.</p>
`; },
  },
});
