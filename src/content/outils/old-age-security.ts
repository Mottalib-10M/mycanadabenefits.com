import { defineGuide, type Helpers } from '../../lib/guide-types';

type Q = '2026-01' | '2026-04' | '2026-07' | '2026-10';
const QS: Q[] = ['2026-01', '2026-04', '2026-07', '2026-10'];
const QN = { en: ['January to March', 'April to June', 'July to September', 'October to December'], fr: ['Janvier à mars', 'Avril à juin', 'Juillet à septembre', 'Octobre à décembre'] };
/** Cas types : années au Canada après 18 ans, âge de début, 75 ans ou plus, revenu net 2025. */
const CASES: Array<[number, number, boolean, number]> = [[40, 65, false, 45000], [25, 65, false, 45000], [12, 65, false, 30000], [40, 70, false, 60000], [40, 65, true, 45000], [40, 65, false, 120000]];
const quarterRows = (h: Helpers) => QS.map((k, i) => [QN[h.lang][i], h.eur(h.P.oas.quarters[k][0], 2), h.eur(h.P.oas.quarters[k][1], 2)]);
const caseRows = (h: Helpers) => CASES.map(([years, startAge, age75, netIncome]) => {
  const r = h.M.oas({ years, startAge, age75, netIncome });
  const who = h.lang === 'fr'
    ? `${h.num(years)} ans au Canada, début à ${startAge} ans${age75 ? ', 75 ans ou plus' : ''}, revenu ${h.eur(netIncome)}`
    : `${h.num(years)} years in Canada, starts at ${startAge}${age75 ? ', aged 75+' : ''}, income ${h.eur(netIncome)}`;
  return [who, h.eur(r.gross, 2), h.eur(r.recovery, 2), h.eur(r.net, 2)];
});

export default defineGuide({
  id: 'old-age-security',
  group: 'oas',
  order: 10,
  tool: 'oas',
  related: ['oas-deferral', 'oas-clawback', 'oas-partial-pension', 'oas-at-75', 'guaranteed-income-supplement', 'oas-payment-dates'],
  sources: ['oasPayments', 'oasQuarterly', 'oasAmount', 'oasElig', 'oasStart', 'oasRecovery', 'oasApply'],
  en: {
    slug: 'old-age-security',
    nav: 'Old Age Security',
    card: 'The OAS pension for each 2026 quarter, by age, residence and income.',
    title: 'Old Age Security 2026: OAS Amounts for Each Quarter',
    description: 'Old Age Security 2026: up to $762.50 a month from October to December at 65 to 74 and $838.75 at 75 or older, with the residence, deferral and clawback rules.',
    h1: 'Old Age Security pension calculator',
    intro: 'Enter your years in Canada, the age you start and your net income to see the OAS pension Service Canada pays for the last quarter of 2026.',
    resume: (h) => `From October to December 2026, the full Old Age Security pension is ${h.eur(h.P.oas.max_65_74, 2)} a month at 65 to 74 and ${h.eur(h.P.oas.max_75, 2)} at 75 or older. Those are the maximums in Service Canada’s quarterly table, and they apply to anyone who lived in Canada for ${h.num(h.P.oas.res_full)} years after age 18 and started the pension at 65. Fewer years give a partial pension, one fortieth of the full amount per year, with a floor of ${h.num(h.P.oas.res_min)} years in Canada or ${h.num(h.P.oas.res_min_abroad)} years for someone living abroad. Starting later raises the pension by ${h.pct(h.P.oas.defer, 1)} for each month after 65, up to ${h.pct(h.P.oas.defer_max, 0)} at 70. High incomes give part of it back: the recovery tax takes ${h.pct(h.P.oas.recovery.rate, 0)} of 2025 net income above ${h.eur(h.P.oas.recovery.thr_2025)}, withheld from each payment between July 2026 and June 2027. OAS is reviewed every quarter for inflation, so the amount moved four times in 2026. The figure that counts for you is the one on your Service Canada notice.`,
    faqs: (h) => [
      { q: 'How much was the OAS pension in each quarter of 2026?', a: `For ages 65 to 74 the full pension was ${h.eur(h.P.oas.quarters['2026-01'][0], 2)} from January, ${h.eur(h.P.oas.quarters['2026-04'][0], 2)} from April, ${h.eur(h.P.oas.quarters['2026-07'][0], 2)} from July and ${h.eur(h.P.oas.quarters['2026-10'][0], 2)} from October. At 75 or older it ran from ${h.eur(h.P.oas.quarters['2026-01'][1], 2)} to ${h.eur(h.P.oas.quarters['2026-10'][1], 2)}. Each change follows the consumer price index, and a quarter is never lowered when prices fall.` },
      { q: 'Do I have to apply for Old Age Security or is it automatic?', a: `Service Canada enrols many people automatically and sends a letter around age ${h.num(h.P.oas.enrolment_letter_age)} when it has enough information on file. If no letter arrives, you apply yourself, online through My Service Canada Account or on paper. When you apply, you can ask for a start date later than 65, which raises the pension for life.` },
      { q: 'Is the OAS pension taxable income in Canada?', a: `Yes. Service Canada describes the pension as taxable income: it goes on your return with your other income and is taxed at your usual rate, which is why a retiree with a modest income may still owe a little tax on it. Separately, if your net income is above ${h.eur(h.P.oas.recovery.thr_2025)} for 2025, the recovery tax of ${h.pct(h.P.oas.recovery.rate, 0)} is taken from the pension itself before it reaches you.` },
      { q: 'Can I get OAS if I immigrated to Canada as an adult?', a: `Yes, once you have lived in Canada for at least ${h.num(h.P.oas.res_min)} years after 18 and hold legal status when the application is approved. The amount is prorated: someone with ${h.num(25)} years receives ${h.pct(25 / h.P.oas.res_full, 1)} of the full pension, or ${h.eur(h.M.oas({ years: 25, startAge: 65 }).gross, 2)} a month at 65 to 74 in the last quarter of 2026.` },
    ],
    body: (h) => `
<h2>What the calculator computes</h2>
<p>The tool takes four inputs: complete years lived in Canada after 18 (capped at ${h.num(h.P.oas.res_full)}), the age you start between 65 and 70, whether you are 75 or older, and your 2025 net income from line 23400. It returns the gross monthly pension, the share of a full pension you earned, the deferral increase, the recovery tax withheld each month and what lands in your account. All amounts use the October to December 2026 rates published by ${h.src('oasQuarterly', 'ESDC’s quarterly report')}.</p>
<h2>The four quarters of 2026</h2>
${h.table(['Quarter', 'Ages 65 to 74', 'Age 75 or older'], quarterRows(h), 'Full OAS pension per month in 2026 (Service Canada)', ['l', 'r', 'r'])}
<p>The 75+ column is ${h.pct(h.P.oas.increase_75, 0)} above the other, an increase that starts automatically the month after your 75th birthday. The ${h.a('oas-at-75', 'page on the age-75 increase')} works through it.</p>
<h2>Typical cases, October to December 2026</h2>
${h.table(['Situation', 'Gross', 'Recovery tax', 'Net per month'], caseRows(h), 'Monthly OAS computed with the site’s engine', ['l', 'r', 'r', 'r'])}
<p>The partial pension in the second and third rows is explained on the ${h.a('oas-partial-pension', 'partial pension page')}; the fourth row is a start at 70, covered in the ${h.a('oas-deferral', 'deferral guide')}; the last row loses part of its pension to the ${h.a('oas-clawback', 'recovery tax')}.</p>
<h2>What it does not do</h2>
<p>The calculator does not add the Guaranteed Income Supplement, which depends on a separate income test: use the ${h.a('guaranteed-income-supplement', 'GIS calculator')} for that. It counts whole years only, applies the recovery threshold for 2025 income and does not project future indexation. It cannot check residence periods abroad or social security agreements, which Service Canada assesses from your file. Deposit days are listed on the ${h.a('oas-payment-dates', 'OAS payment dates page')}.</p>
`,
  },
  fr: {
    slug: 'pension-de-vieillesse',
    nav: 'Pension de vieillesse',
    card: 'La pension de la SV de chaque trimestre de 2026, selon l’âge, la résidence et le revenu.',
    title: 'Pension de vieillesse 2026 : montants de la SV par trimestre',
    description: 'Pension de vieillesse 2026 : jusqu’à 762,50 $ par mois d’octobre à décembre de 65 à 74 ans et 838,75 $ à 75 ans ou plus, avec résidence, report et récupération.',
    h1: 'Calculateur de la pension de la Sécurité de la vieillesse',
    intro: 'Indiquez vos années au Canada, l’âge de début et votre revenu net pour connaître la pension de la SV versée par Service Canada au dernier trimestre de 2026.',
    resume: (h) => `D’octobre à décembre 2026, la pension de la Sécurité de la vieillesse complète atteint ${h.eur(h.P.oas.max_65_74, 2)} par mois de 65 à 74 ans et ${h.eur(h.P.oas.max_75, 2)} à 75 ans ou plus. Ce sont les maximums du tableau trimestriel de Service Canada, valables pour quiconque a résidé ${h.num(h.P.oas.res_full)} ans au Canada après 18 ans et a commencé sa pension à 65 ans. Avec moins d’années, la pension est partielle, un quarantième du montant complet par année, à condition d’avoir au moins ${h.num(h.P.oas.res_min)} ans de résidence, ou ${h.num(h.P.oas.res_min_abroad)} ans pour la personne qui vit à l’étranger. Commencer plus tard majore la pension de ${h.pct(h.P.oas.defer, 1)} par mois après 65 ans, jusqu’à ${h.pct(h.P.oas.defer_max, 0)} à 70 ans. Les revenus élevés en rendent une partie : l’impôt de récupération prend ${h.pct(h.P.oas.recovery.rate, 0)} du revenu net de 2025 au-delà de ${h.eur(h.P.oas.recovery.thr_2025)}, retenu sur chaque paiement de juillet 2026 à juin 2027. La SV est révisée chaque trimestre selon l’inflation, si bien que son montant a changé quatre fois en 2026. Le chiffre qui vous concerne reste celui de l’avis de Service Canada.`,
    faqs: (h) => [
      { q: 'Combien valait la pension de vieillesse à chaque trimestre de 2026 ?', a: `De 65 à 74 ans, la pension complète était de ${h.eur(h.P.oas.quarters['2026-01'][0], 2)} dès janvier, ${h.eur(h.P.oas.quarters['2026-04'][0], 2)} dès avril, ${h.eur(h.P.oas.quarters['2026-07'][0], 2)} dès juillet et ${h.eur(h.P.oas.quarters['2026-10'][0], 2)} dès octobre. À 75 ans ou plus, elle est passée de ${h.eur(h.P.oas.quarters['2026-01'][1], 2)} à ${h.eur(h.P.oas.quarters['2026-10'][1], 2)}. Chaque hausse suit l’indice des prix à la consommation, et un trimestre n’est jamais réduit quand les prix baissent.` },
      { q: 'Faut-il demander la pension de vieillesse ou est-elle automatique ?', a: `Service Canada inscrit d’office bien des gens et envoie une lettre vers ${h.num(h.P.oas.enrolment_letter_age)} ans lorsqu’il dispose des renseignements nécessaires. Sans lettre, vous présentez vous-même la demande, en ligne dans Mon dossier Service Canada ou sur papier. La demande permet aussi de choisir une date de début postérieure à 65 ans, ce qui majore la pension pour la vie.` },
      { q: 'La pension de la SV est-elle imposable ?', a: `Oui. Service Canada la qualifie de revenu imposable : elle s’inscrit dans la déclaration avec vos autres revenus et s’impose à votre taux habituel, d’où un petit impôt possible même pour un retraité au revenu modeste. À part, si votre revenu net de 2025 dépasse ${h.eur(h.P.oas.recovery.thr_2025)}, l’impôt de récupération de ${h.pct(h.P.oas.recovery.rate, 0)} est prélevé directement sur la pension avant qu’elle vous parvienne.` },
      { q: 'Un immigrant arrivé adulte au Canada a-t-il droit à la SV ?', a: `Oui, après au moins ${h.num(h.P.oas.res_min)} ans de résidence au Canada après 18 ans, avec un statut légal au moment où la demande est approuvée. Le montant est proportionnel : avec ${h.num(25)} ans, on reçoit ${h.pct(25 / h.P.oas.res_full, 1)} de la pension complète, soit ${h.eur(h.M.oas({ years: 25, startAge: 65 }).gross, 2)} par mois de 65 à 74 ans au dernier trimestre de 2026.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>L’outil demande quatre données : les années complètes vécues au Canada après 18 ans (plafonnées à ${h.num(h.P.oas.res_full)}), l’âge de début entre 65 et 70 ans, si vous avez 75 ans ou plus, et votre revenu net de 2025 inscrit à la ligne 23400. Il affiche la pension mensuelle brute, la part de la pension complète acquise, la majoration pour report, l’impôt de récupération retenu chaque mois et le montant déposé. Les montants sont ceux d’octobre à décembre 2026 publiés dans le ${h.src('oasQuarterly', 'rapport trimestriel d’EDSC')}.</p>
<h2>Les quatre trimestres de 2026</h2>
${h.table(['Trimestre', '65 à 74 ans', '75 ans ou plus'], quarterRows(h), 'Pension de la SV complète par mois en 2026 (Service Canada)', ['l', 'r', 'r'])}
<p>La colonne des 75 ans ou plus dépasse l’autre de ${h.pct(h.P.oas.increase_75, 0)}, une hausse accordée d’office le mois suivant le 75e anniversaire. La ${h.a('oas-at-75', 'page sur la hausse à 75 ans')} la détaille.</p>
<h2>Cas types, octobre à décembre 2026</h2>
${h.table(['Situation', 'Brut', 'Récupération', 'Net par mois'], caseRows(h), 'SV mensuelle calculée avec le moteur du site', ['l', 'r', 'r', 'r'])}
<p>Les deuxième et troisième lignes sont des pensions partielles, expliquées sur la ${h.a('oas-partial-pension', 'page de la pension partielle')} ; la quatrième commence à 70 ans, comme le montre le ${h.a('oas-deferral', 'guide du report')} ; la dernière perd une partie de sa pension à cause de l’${h.a('oas-clawback', 'impôt de récupération')}.</p>
<h2>Ce que l’outil ne fait pas</h2>
<p>Il n’ajoute pas le Supplément de revenu garanti, soumis à un critère de revenu distinct : le ${h.a('guaranteed-income-supplement', 'calculateur du SRG')} s’en charge. Il ne compte que les années entières, applique le seuil de récupération du revenu de 2025 et ne projette pas l’indexation future. Il ne peut pas vérifier les périodes de résidence à l’étranger ni les accords de sécurité sociale, que Service Canada évalue à partir de votre dossier. Les jours de dépôt figurent sur la ${h.a('oas-payment-dates', 'page des dates de paiement de la SV')}.</p>
`,
  },
});
