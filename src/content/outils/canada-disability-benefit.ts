import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types de la PCPSH (juillet 2026 à juin 2027, revenu 2025), calculés par le moteur. */
const cases = (h: Helpers) => {
  const e = h.eur;
  const c = (couple: boolean, afni: number, working: number, bothEligible = false) => h.M.canadaDisabilityBenefit({ couple, bothEligible, afni, working, age: 40, dtc: true });
  return [
    { en: `Single, ${e(18000)} net, no earnings`, fr: `Seul, ${e(18000)} net, sans gains`, r: c(false, 18000, 0) },
    { en: `Single, ${e(30000)} net, no earnings`, fr: `Seul, ${e(30000)} net, sans gains`, r: c(false, 30000, 0) },
    { en: `Single, ${e(30000)} net incl. ${e(12000)} wages`, fr: `Seul, ${e(30000)} net dont ${e(12000)} de salaire`, r: c(false, 30000, 12000) },
    { en: `Couple, one eligible, ${e(40000)} net`, fr: `Couple, un admissible, ${e(40000)} net`, r: c(true, 40000, 0) },
    { en: `Couple, both eligible, ${e(40000)} net (each)`, fr: `Couple, deux admissibles, ${e(40000)} net (chacun)`, r: c(true, 40000, 0, true) },
  ];
};

export default defineGuide({
  id: 'canada-disability-benefit',
  group: 'disability',
  order: 10,
  tool: 'cdb',
  related: ['disability-tax-credit', 'odsp-rates', 'aish-alberta', 'cwb-disability-supplement', 'benefit-payment-dates'],
  sources: ['cdbAmount', 'cdbElig', 'benefitsCalendar', 'dtc'],
  en: {
    slug: 'canada-disability-benefit',
    nav: 'Canada Disability Benefit',
    card: 'Monthly Canada Disability Benefit from July 2026, by income, work and couple status.',
    title: 'CDB 2026: Canada Disability Benefit Amount, $204.20 a Month',
    description: 'Canada Disability Benefit 2026: up to $204.20 a month from July, reduced by 20% of income above $23,000 for a single person. Calculator, work exemption, dates.',
    h1: 'Canada Disability Benefit calculator',
    intro: 'Enter your 2025 adjusted family net income and the working income in it to see the monthly benefit paid from July 2026 to June 2027.',
    resume: (h) => { const D = h.P.cdb; return `The Canada Disability Benefit pays up to ${h.eur(D.max_month, 2)} a month from July 2026 to June 2027, up from ${h.eur(D.max_month_2025_26)} in the first benefit year. It is reserved for people aged ${D.age[0]} to ${D.age[1]} who have been approved for the disability tax credit and who filed their ${D.income_year} return, along with their spouse or partner if they have one. The full amount is paid while adjusted family net income, after removing up to ${h.eur(D.work_exempt_single)} of working income for a single person or ${h.eur(D.work_exempt_couple)} for a couple, stays at or below ${h.eur(D.thr_single)} for a single person or ${h.eur(D.thr_couple)} for a couple. Above that level the benefit falls by ${h.pct(D.rate, 0)} of the excess, or by ${h.pct(D.rate_both, 0)} each when both spouses receive it. The income thresholds were not indexed this year, while the work exemptions were. The benefit arrives on a fixed day near the middle of each month, ${h.date(D.dates_2026[9])} for October 2026. From fall 2026 a one-time ${h.eur(D.dtc_cost_payment)} can be added to help with the cost of getting the disability tax credit.`; },
    faqs: (h) => { const D = h.P.cdb; return [
      { q: 'Does working reduce the Canada Disability Benefit?', a: `Only beyond the exemption. The first ${h.eur(D.work_exempt_single)} of working income for a single person, or ${h.eur(D.work_exempt_couple)} combined for a couple, is removed before the income test. In our table, a single person with ${h.eur(30000)} of net income keeps the full ${h.eur(D.max_month, 2)} if ${h.eur(12000)} of it is wages, and gets far less if none of it is.` },
      { q: 'What happens to the Canada Disability Benefit at age 65?', a: `Payments are limited to ages ${D.age[0]} to ${D.age[1]}. A late applicant can receive back payments for up to ${h.num(h.P.x.cCdbBackMonths)} months before the application, never past the month of the ${h.num(D.age[1] + 1)}th birthday. Old Age Security can start at ${h.num(D.age[1] + 1)}, and Service Canada usually sends an enrolment letter around age ${h.num(h.P.oas.enrolment_letter_age)} when it has your information. Source: ${h.src('cdbElig')}.` },
      { q: 'Which income year counts for the July 2026 to June 2027 benefit?', a: `Your ${D.income_year} federal return, and your spouse’s: both must be filed before any payment is made. A drop in income during 2026 only shows up from July 2027, once the 2026 returns are assessed. Source: ${h.src('cdbAmount')}.` },
    ]; },
    body: (h) => { const D = h.P.cdb; const rows = cases(h).map((x) => [h.lang === 'en' ? x.en : x.fr, h.eur(x.r.monthly, 2), h.eur(x.r.annual, 2)]); return `
<h2>What the calculator does</h2>
<p>It applies the published formula for the benefit year that started in July 2026: a maximum of ${h.eur(D.max_month, 2)} a month, the working income exemption, the threshold for your situation and the reduction rate, ${h.pct(D.rate, 0)} or ${h.pct(D.rate_both, 0)} when both spouses are eligible. It assumes your disability tax credit is approved, because without it there is no benefit at all, and it returns zero outside ages ${D.age[0]} to ${D.age[1]}.</p>
<h2>Worked cases</h2>
${h.table(['Situation', 'Per month', 'Per year'], rows, 'Canada Disability Benefit, July 2026 to June 2027, based on 2025 income', ['l', 'r', 'r'])}
<p>A single person reaches zero once counted income is ${h.eur(D.max_month * 12 / D.rate + D.thr_single)}, the point where ${h.pct(D.rate, 0)} of the excess equals the yearly maximum. Couples where both partners receive the benefit lose it more slowly, at ${h.pct(D.rate_both, 0)} each.</p>
<h2>Payment dates in 2026</h2>
<p>The 2026 deposits are set for ${D.dates_2026.map((d) => h.date(d)).join(', ')}. Dates for 2027 were not published when we checked; the ${h.a('benefit-payment-dates', 'combined calendar')} adds them once they are.</p>
<h2>Limits of the estimate</h2>
<p>The calculator does not check residence, the return-filing condition or the effect of a change in marital status. Provincial disability assistance such as ${h.a('odsp-rates', 'ODSP')} or ${h.a('aish-alberta', 'AISH and ADAP')} has its own rules on whether the federal benefit is counted. The amount paid is the one in your Service Canada decision. Sources: ${h.src('cdbAmount')} and ${h.src('cdbElig')}.</p>
`; },
  },
  fr: {
    slug: 'prestation-canadienne-personnes-handicapees',
    nav: 'Prestation canadienne pour personnes handicapées',
    card: 'La PCPSH mensuelle dès juillet 2026, selon le revenu, le travail et la situation de couple.',
    title: 'PCPSH 2026 : prestation pour personnes handicapées, montant',
    description: 'Prestation canadienne pour les personnes en situation de handicap 2026 : jusqu’à 204,20 $ par mois, réduite de 20 % au-delà de 23 000 $ pour une personne seule.',
    h1: 'Calcul de la prestation canadienne pour les personnes en situation de handicap',
    intro: 'Entrez votre revenu familial net rajusté de 2025 et la part qui vient du travail pour voir la prestation mensuelle de juillet 2026 à juin 2027.',
    resume: (h) => { const D = h.P.cdb; return `La Prestation canadienne pour les personnes en situation de handicap (PCPSH) verse jusqu’à ${h.eur(D.max_month, 2)} par mois de juillet 2026 à juin 2027, contre ${h.eur(D.max_month_2025_26)} la première année. Elle s’adresse aux personnes de ${D.age[0]} à ${D.age[1]} ans admises au crédit d’impôt pour personnes handicapées qui ont produit leur déclaration de ${D.income_year}, tout comme leur conjoint le cas échéant. Le montant complet est versé tant que le revenu familial net rajusté, après retrait d’au plus ${h.eur(D.work_exempt_single)} de revenu de travail pour une personne seule ou ${h.eur(D.work_exempt_couple)} pour un couple, ne dépasse pas ${h.eur(D.thr_single)} seul ou ${h.eur(D.thr_couple)} en couple. Au-delà, la prestation baisse de ${h.pct(D.rate, 0)} de l’excédent, ou de ${h.pct(D.rate_both, 0)} chacun quand les deux conjoints la reçoivent. Les seuils de revenu n’ont pas été indexés cette année, contrairement aux exemptions de travail. Le dépôt arrive vers le milieu du mois, le ${h.date(D.dates_2026[9])} pour octobre 2026. Dès l’automne 2026, un montant unique de ${h.eur(D.dtc_cost_payment)} peut s’ajouter pour compenser le coût d’obtention du crédit d’impôt.`; },
    faqs: (h) => { const D = h.P.cdb; return [
      { q: 'Travailler réduit-il la PCPSH ?', a: `Seulement au-delà de l’exemption. Les premiers ${h.eur(D.work_exempt_single)} de revenu de travail d’une personne seule, ou ${h.eur(D.work_exempt_couple)} réunis pour un couple, sont retirés avant le critère de revenu. Dans notre tableau, une personne seule dont le revenu net est de ${h.eur(30000)} garde les ${h.eur(D.max_month, 2)} si ${h.eur(12000)} viennent d’un salaire, et touche bien moins sinon.` },
      { q: 'Que devient la PCPSH à 65 ans ?', a: `Les versements sont limités aux ${D.age[0]} à ${D.age[1]} ans. Une personne qui présente sa demande tard peut recevoir un rétroactif d’au plus ${h.num(h.P.x.cCdbBackMonths)} mois avant la demande, jamais au-delà du mois de ses ${h.num(D.age[1] + 1)} ans. La Sécurité de la vieillesse peut commencer à ${h.num(D.age[1] + 1)} ans, et Service Canada envoie en général une lettre d’inscription vers ${h.num(h.P.oas.enrolment_letter_age)} ans s’il a vos renseignements. Source : ${h.src('cdbElig')}.` },
      { q: 'Quelle année de revenu compte pour la PCPSH de juillet 2026 à juin 2027 ?', a: `Votre déclaration fédérale de ${D.income_year}, et celle de votre conjoint : les deux doivent être produites avant tout versement. Une baisse de revenu en 2026 ne jouera qu’à partir de juillet 2027, une fois les déclarations de 2026 cotisées. Source : ${h.src('cdbAmount')}.` },
    ]; },
    body: (h) => { const D = h.P.cdb; const rows = cases(h).map((x) => [x.fr, h.eur(x.r.monthly, 2), h.eur(x.r.annual, 2)]); return `
<h2>Ce que fait le calculateur</h2>
<p>Il applique la formule publiée pour l’année de prestations commencée en juillet 2026 : un maximum de ${h.eur(D.max_month, 2)} par mois, l’exemption du revenu de travail, le seuil de votre situation et le taux de réduction, ${h.pct(D.rate, 0)} ou ${h.pct(D.rate_both, 0)} si les deux conjoints sont admissibles. Il suppose le crédit d’impôt pour personnes handicapées approuvé, faute de quoi il n’y a aucune prestation, et renvoie zéro hors de la tranche de ${D.age[0]} à ${D.age[1]} ans.</p>
<h2>Cas types</h2>
${h.table(['Situation', 'Par mois', 'Par année'], rows, 'PCPSH, juillet 2026 à juin 2027, selon le revenu de 2025', ['l', 'r', 'r'])}
<p>Pour une personne seule, la prestation s’éteint quand le revenu compté atteint ${h.eur(D.max_month * 12 / D.rate + D.thr_single)}, niveau où ${h.pct(D.rate, 0)} de l’excédent égale le maximum annuel. Les couples dont les deux membres la reçoivent la perdent plus lentement, à ${h.pct(D.rate_both, 0)} chacun.</p>
<h2>Dates de versement en 2026</h2>
<p>Les dépôts de 2026 tombent le ${D.dates_2026.map((d) => h.date(d)).join(', le ')}. Les dates de 2027 n’étaient pas publiées lors de notre vérification ; le ${h.a('benefit-payment-dates', 'calendrier combiné')} les ajoutera.</p>
<h2>Limites de l’estimation</h2>
<p>Le calculateur ne vérifie ni la résidence, ni la production des déclarations, ni l’effet d’un changement d’état civil. L’aide provinciale aux personnes handicapées, comme le ${h.a('odsp-rates', 'POSPH')} ou ${h.a('aish-alberta', 'l’AISH et l’ADAP')}, a ses propres règles sur la prise en compte de la prestation fédérale. Le montant versé est celui de la décision de Service Canada. Sources : ${h.src('cdbAmount')} et ${h.src('cdbElig')}.</p>
`; },
  },
});
