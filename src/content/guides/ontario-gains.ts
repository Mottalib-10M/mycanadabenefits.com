import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const GA = (h: Helpers) => h.P.prov.on.gains;
const X = (h: Helpers) => h.P.x as Record<string, any>;
/** Revenus privés annuels d'exemple pour une personne seule. */
const EX = [0, 2000, 4000, 6000, 10000, 16000];
/** Plafond du RRAG pour un revenu privé donné (montant réel fixé par l'Ontario, formule non publiée). */
const cap = (h: Helpers, i: number, couple = false) => (i <= (couple ? GA(h).income_max_couple : GA(h).income_max_single) ? GA(h).max_month : 0);

export default defineGuide({
  id: 'ontario-gains',
  group: 'provinces',
  order: 30,
  mini: 'ontarioGainsCeiling',
  miniHref: 'guaranteed-income-supplement',
  related: ['guaranteed-income-supplement', 'ontario-trillium-benefit', 'gis-couples', 'old-age-security', 'benefit-payment-dates'],
  sources: [S('ontarioGains'), S('fGains'), S('oasQuarterly'), S('fGisReceive')],
  en: {
    slug: 'ontario-gains',
    nav: 'Ontario GAINS',
    card: 'Ontario’s monthly top-up for seniors on OAS and GIS: the $92 maximum, the private income limits and the payment day.',
    title: 'GAINS Ontario 2026: $92 a Month on Top of OAS and GIS',
    description: 'Ontario GAINS 2026: up to $92 a month for seniors on OAS and GIS with private income up to $4,416 single or $8,832 as a couple. Who qualifies, when it is paid.',
    h1: 'Ontario’s Guaranteed Annual Income System (GAINS)',
    intro: 'GAINS is a small provincial payment that Ontario adds to the federal OAS pension and GIS of its lowest-income seniors.',
    resume: (h) => { const g = GA(h); const y = X(h).fGainsYear as string[]; return `Ontario’s Guaranteed Annual Income System pays eligible seniors up to ${h.eur(g.max_month)} a month for the 2026 benefit year, which runs from ${h.date(y[0])} to ${h.date(y[1])}. It is reserved for people who already receive the federal Old Age Security pension and the Guaranteed Income Supplement, and whose annual private income is no more than ${h.eur(g.income_max_single)} for a single senior or ${h.eur(g.income_max_couple)} for a senior couple. Private income means money such as a workplace pension, the Canada Pension Plan or bank interest. The province adds that you must be ${h.num(X(h).fGainsAge)} or older, have been a Canadian resident for ${h.num(X(h).fGainsCanadaYears)} years or more, and have lived in Ontario for the past ${h.num(X(h).fGainsOnMonths)} months or for ${h.num(X(h).fGainsOnYears)} years in total since age 18. There is no application for OAS and GIS recipients, but a tax return must be filed every year by April ${h.num(X(h).fFileByDay)}, even with no income to report. Payments arrive on or about the ${h.num(X(h).fGainsPayDay)}th of each month. Ontario publishes the maximum and the income limits, not the formula that sets a partial amount, so the figure on your notice is the reference.`; },
    faqs: (h) => [
      { q: 'Do I have to apply for Ontario GAINS?', a: `Not if you already receive the OAS pension and the GIS: Ontario states that you do not have to apply. What it does require is a tax return filed every year by April ${h.num(X(h).fFileByDay)}, even if you have no income to report, because the province relies on it to confirm your private income. Missing that deadline is the simplest way to see the monthly ${h.eur(GA(h).max_month)} stop.` },
      { q: 'What day of the month is the GAINS payment deposited?', a: `On or about the ${h.num(X(h).fGainsPayDay)}th of each month, from July to June of the next year, according to the Ontario government. That is a different schedule from the federal calendar: in October 2026, for instance, CPP, OAS and GIS were deposited on ${h.date(h.P.pay_dates_2026.cpp_oas[9])}, a few days after GAINS. Expect two separate lines on your bank statement.` },
      { q: 'How much private income can an Ontario senior have and still get GAINS?', a: `Up to ${h.eur(GA(h).income_max_single)} a year for a single senior and ${h.eur(GA(h).income_max_couple)} for a senior couple, in the 2026 benefit year. Ontario counts money such as a workplace pension, CPP and bank interest. Different limits apply when the spouse is under 65 or not eligible for OAS; the province publishes them in separate rate tables that we have not reproduced here.` },
      { q: `Why is my GAINS payment lower than ${h.eur(GA(h).max_month)}?`, a: `Because ${h.eur(GA(h).max_month)} is a maximum. Ontario’s page says eligible seniors can receive up to that amount, and gives the income limits, but it does not publish the formula that reduces GAINS as private income rises. We have not invented one. If your amount looks wrong, compare it with your notice and contact the Ontario Ministry of Finance, listed as the contact on the province’s GAINS page.` },
      { q: 'Can I get GAINS if I moved to Ontario from another province last year?', a: `Yes, once you have lived in Ontario for the past ${h.num(X(h).fGainsOnMonths)} months, provided you meet the other conditions: aged ${h.num(X(h).fGainsAge)} or older, Canadian resident for at least ${h.num(X(h).fGainsCanadaYears)} years, receiving OAS and GIS, and within the private income limit. Someone who lived in Ontario for ${h.num(X(h).fGainsOnYears)} years in total since age 18 also qualifies on residence.` },
      { q: 'Can my GAINS amount change in the middle of the benefit year?', a: `Yes. Ontario states that a GAINS payment can change during the benefit year if your private income or your marital status changes. The benefit year runs from ${h.date((X(h).fGainsYear as string[])[0])} to ${h.date((X(h).fGainsYear as string[])[1])}, so a separation, a death or a new pension in the autumn can show up before the following July.` },
    ],
    body: (h) => { const g = GA(h); const x = X(h); const oas = h.P.oas.max_65_74; return `
<h2>What GAINS adds</h2>
<p>GAINS sits on the third level of a senior’s income in Ontario. The first is the federal ${h.a('old-age-security', 'OAS pension')}, ${h.eur(oas, 2)} a month at 65 to 74 from October to December 2026. The second is the ${h.a('guaranteed-income-supplement', 'Guaranteed Income Supplement')}, up to ${h.eur(h.P.gis.single.max, 2)} for a single pensioner. GAINS comes on top of both, “provided on top of” the federal payments in the province’s own words (${h.src(S('fGains'), 'Government of Ontario, GAINS payments')}), for a maximum of ${h.eur(g.max_month)} a month, or ${h.eur(g.max_month * 12)} over a full benefit year.</p>
<h2>Who qualifies</h2>
<p>Ontario lists five conditions, all of which must be met:</p>
<ul>
<li>being ${h.num(x.fGainsAge)} or older;</li>
<li>having been a Canadian resident for ${h.num(x.fGainsCanadaYears)} years or more;</li>
<li>having lived in Ontario for the past ${h.num(x.fGainsOnMonths)} months, or for a total of ${h.num(x.fGainsOnYears)} years since turning 18;</li>
<li>receiving the federal OAS pension and GIS;</li>
<li>having annual private income of up to ${h.eur(g.income_max_single)} as a single senior, or up to ${h.eur(g.income_max_couple)} as a senior couple.</li>
</ul>
<p>The income ceiling is the narrowest filter. A single pensioner can keep part of the GIS until income reaches ${h.eur(h.P.gis.single.thr)}, but GAINS stops at ${h.eur(g.income_max_single)} of private income, so only the lowest-income GIS recipients see it.</p>
<h2>Where GAINS ends compared with the GIS</h2>
${h.table(['Private income a year', 'OAS (65 to 74)', 'GIS per month', 'GAINS ceiling', 'Ceiling of the three'], EX.map((i) => { const gi = h.M.gis('single', i).monthly; const c = cap(h, i); return [h.eur(i), h.eur(oas, 2), h.eur(gi, 2), c ? h.eur(c) : h.eur(0), h.eur(oas + gi + c, 2)]; }), 'Single senior in Ontario, October to December 2026: federal amounts and the GAINS maximum (actual GAINS may be lower)', ['r', 'r', 'r', 'r', 'r'])}
<p>The GAINS column shows a ceiling, not a calculated amount: Ontario does not publish how a partial payment is worked out between zero and the income limit. The GIS column comes from a model fitted to the ${h.src('oasQuarterly', 'ESDC quarterly table')}, exact at the published thresholds and within about a dollar a month between them. Together they show the shape of the system: GAINS matters most for a pensioner with almost no CPP or workplace pension, for whom ${h.eur(g.max_month)} a month is a noticeable share of the budget.</p>
<!--mini:ontarioGainsCeiling-->
<h2>Couples</h2>
<p>For a senior couple, the private income limit is ${h.eur(g.income_max_couple)} a year, twice the single limit. The maximum is stated per eligible senior. The province notes that different income limits apply when one spouse is under 65 or is not eligible for OAS; those figures sit in separate rate tables by marital status that this guide does not reproduce. On the federal side, the couple’s GIS follows its own grids, explained in the ${h.a('gis-couples', 'couples guide')}.</p>
<h2>No application, but a tax return every year</h2>
<p>Seniors who receive OAS and the GIS do not apply for GAINS. Ontario asks them to file an income tax return every year by April ${h.num(x.fFileByDay)}, even if there is no income to report. The federal side asks the same thing: Service Canada reviews the GIS each year from the tax return (${h.src(S('fGisReceive'), 'Service Canada, receiving the GIS')}). A single late return can therefore interrupt both payments at once, which makes filing on time the most useful habit for a low-income senior in Ontario.</p>
<h2>When the money arrives</h2>
<p>GAINS is paid on or about the ${h.num(x.fGainsPayDay)}th of each month, starting in July and ending in June of the next year. The federal deposits follow a separate calendar: the ${h.a('benefit-payment-dates', 'combined calendar')} sets them side by side. In most months GAINS lands a few days before the CPP, OAS and GIS deposit, but December can reverse the order since the federal payment is made early.</p>
<h2>Changes during the year</h2>
<p>The GAINS payment can change within the benefit year when private income or marital status changes. A new workplace pension, the death of a spouse or a separation can all move the amount, in either direction, before the next July. Ontario does not publish the recalculation formula, so the notice from the province is the only reliable figure. Questions go to the Ontario Ministry of Finance, and questions about OAS and the GIS go to Service Canada.</p>
<h2>Other Ontario help for seniors</h2>
<p>GAINS is not the only provincial program a low-income senior may receive. The ${h.a('ontario-trillium-benefit', 'Ontario Trillium Benefit')} combines the energy and property tax credit, the sales tax credit and the northern energy credit, with a higher property tax amount for people aged 65 and over. It follows the CRA’s own payment calendar rather than the GAINS date.</p>
`; },
  },
  fr: {
    slug: 'rrag-ontario',
    nav: 'RRAG de l’Ontario',
    card: 'Le supplément mensuel de l’Ontario pour les aînés à la SV et au SRG : maximum de 92 $, limites de revenu privé et date de versement.',
    title: 'RRAG de l’Ontario 2026 : 92 $ par mois en plus du SRG',
    description: 'RRAG de l’Ontario 2026 : jusqu’à 92 $ par mois aux aînés à la SV et au SRG dont le revenu privé ne dépasse pas 4 416 $ (seul) ou 8 832 $ (couple). Conditions.',
    h1: 'Le Régime de revenu annuel garanti de l’Ontario (RRAG)',
    intro: 'Le RRAG est un petit versement provincial que l’Ontario ajoute à la pension de la SV et au SRG fédéraux de ses aînés aux revenus les plus faibles.',
    resume: (h) => { const g = GA(h); const y = X(h).fGainsYear as string[]; return `Le Régime de revenu annuel garanti de l’Ontario verse aux aînés admissibles jusqu’à ${h.eur(g.max_month)} par mois pour l’année de prestations 2026, qui va du ${h.date(y[0])} au ${h.date(y[1])}. Il est réservé aux personnes qui reçoivent déjà la pension fédérale de la Sécurité de la vieillesse et le Supplément de revenu garanti, et dont le revenu privé annuel ne dépasse pas ${h.eur(g.income_max_single)} pour une personne âgée seule ou ${h.eur(g.income_max_couple)} pour un couple de personnes âgées. Le revenu privé comprend par exemple une rente de retraite d’employeur, le Régime de pensions du Canada ou des intérêts bancaires. La province exige aussi d’avoir ${h.num(X(h).fGainsAge)} ans ou plus, d’être résident canadien depuis ${h.num(X(h).fGainsCanadaYears)} ans ou plus, et d’avoir vécu en Ontario pendant les ${h.num(X(h).fGainsOnMonths)} derniers mois ou pendant ${h.num(X(h).fGainsOnYears)} ans au total depuis l’âge de 18 ans. Aucune demande n’est requise pour les bénéficiaires de la SV et du SRG, mais une déclaration de revenus doit être produite chaque année avant le ${h.num(X(h).fFileByDay)} avril, même sans revenu à déclarer. Les versements arrivent vers le ${h.num(X(h).fGainsPayDay)} de chaque mois. L’Ontario publie le maximum et les limites de revenu, pas la formule d’un montant partiel : l’avis reçu fait foi.`; },
    faqs: (h) => [
      { q: 'Faut-il présenter une demande pour le RRAG de l’Ontario ?', a: `Non, si vous recevez déjà la pension de la SV et le SRG : l’Ontario précise que vous n’avez pas à présenter de demande. Il exige en revanche une déclaration de revenus produite chaque année avant le ${h.num(X(h).fFileByDay)} avril, même sans revenu à déclarer, puisque la province s’en sert pour confirmer votre revenu privé. Manquer cette échéance est la façon la plus simple de voir les ${h.eur(GA(h).max_month)} mensuels s’arrêter.` },
      { q: 'Quel jour du mois le versement du RRAG est-il déposé ?', a: `Vers le ${h.num(X(h).fGainsPayDay)} de chaque mois, de juillet à juin de l’année suivante, selon le gouvernement de l’Ontario. C’est un calendrier distinct du calendrier fédéral : en octobre 2026, par exemple, le RPC, la SV et le SRG ont été déposés le ${h.date(h.P.pay_dates_2026.cpp_oas[9])}, quelques jours après le RRAG. Attendez-vous à deux lignes distinctes sur votre relevé bancaire.` },
      { q: 'Quel revenu privé un aîné de l’Ontario peut-il avoir pour toucher le RRAG ?', a: `Jusqu’à ${h.eur(GA(h).income_max_single)} par année pour une personne âgée seule et ${h.eur(GA(h).income_max_couple)} pour un couple de personnes âgées, pour l’année de prestations 2026. L’Ontario compte par exemple une rente d’employeur, le RPC et les intérêts bancaires. D’autres limites s’appliquent quand le conjoint a moins de 65 ans ou n’a pas droit à la SV ; la province les publie dans des tableaux distincts que nous ne reproduisons pas.` },
      { q: `Pourquoi mon versement du RRAG est-il inférieur à ${h.eur(GA(h).max_month)} ?`, a: `Parce que ${h.eur(GA(h).max_month)} est un maximum. La page de l’Ontario indique que les aînés admissibles peuvent recevoir jusqu’à ce montant et donne les limites de revenu, mais elle ne publie pas la formule qui réduit le RRAG quand le revenu privé augmente. Nous n’en avons pas inventé. Si votre montant semble erroné, comparez-le à votre avis et communiquez avec le ministère des Finances de l’Ontario, indiqué comme contact sur la page du RRAG.` },
      { q: 'Puis-je toucher le RRAG si je suis arrivé en Ontario d’une autre province l’an dernier ?', a: `Oui, une fois que vous avez vécu en Ontario pendant les ${h.num(X(h).fGainsOnMonths)} derniers mois, si vous remplissez les autres conditions : ${h.num(X(h).fGainsAge)} ans ou plus, résident canadien depuis au moins ${h.num(X(h).fGainsCanadaYears)} ans, bénéficiaire de la SV et du SRG, et sous la limite de revenu privé. Une personne qui a vécu en Ontario ${h.num(X(h).fGainsOnYears)} ans au total depuis 18 ans remplit aussi la condition de résidence.` },
      { q: 'Le montant du RRAG peut-il changer en cours d’année de prestations ?', a: `Oui. L’Ontario précise que le versement du RRAG peut changer pendant l’année de prestations si votre revenu privé ou votre état matrimonial change. L’année de prestations va du ${h.date((X(h).fGainsYear as string[])[0])} au ${h.date((X(h).fGainsYear as string[])[1])} : une séparation, un décès ou une nouvelle rente à l’automne peuvent donc se répercuter avant le mois de juillet suivant.` },
    ],
    body: (h) => { const g = GA(h); const x = X(h); const oas = h.P.oas.max_65_74; return `
<h2>Ce qu’ajoute le RRAG</h2>
<p>Le RRAG forme le troisième étage du revenu d’un aîné en Ontario. Le premier est la ${h.a('old-age-security', 'pension de la SV')} fédérale, ${h.eur(oas, 2)} par mois entre 65 et 74 ans d’octobre à décembre 2026. Le deuxième est le ${h.a('guaranteed-income-supplement', 'Supplément de revenu garanti')}, jusqu’à ${h.eur(h.P.gis.single.max, 2)} pour un pensionné seul. Le RRAG s’ajoute aux deux, « en plus » des versements fédéraux selon les termes de la province (${h.src(S('fGains'), 'gouvernement de l’Ontario, versements du RRAG')}), pour un maximum de ${h.eur(g.max_month)} par mois, soit ${h.eur(g.max_month * 12)} sur une année de prestations complète.</p>
<h2>Qui y a droit</h2>
<p>L’Ontario énumère cinq conditions, toutes obligatoires :</p>
<ul>
<li>avoir ${h.num(x.fGainsAge)} ans ou plus;</li>
<li>être résident canadien depuis ${h.num(x.fGainsCanadaYears)} ans ou plus;</li>
<li>avoir vécu en Ontario pendant les ${h.num(x.fGainsOnMonths)} derniers mois, ou pendant ${h.num(x.fGainsOnYears)} ans au total depuis l’âge de 18 ans;</li>
<li>recevoir la pension fédérale de la SV et le SRG;</li>
<li>avoir un revenu privé annuel d’au plus ${h.eur(g.income_max_single)} pour une personne âgée seule, ou d’au plus ${h.eur(g.income_max_couple)} pour un couple de personnes âgées.</li>
</ul>
<p>La limite de revenu est le filtre le plus étroit. Un pensionné seul garde une partie du SRG jusqu’à ${h.eur(h.P.gis.single.thr)} de revenu, mais le RRAG s’arrête à ${h.eur(g.income_max_single)} de revenu privé : seuls les bénéficiaires du SRG aux revenus les plus faibles le reçoivent.</p>
<h2>Où s’arrête le RRAG par rapport au SRG</h2>
${h.table(['Revenu privé annuel', 'SV (65 à 74 ans)', 'SRG par mois', 'Plafond du RRAG', 'Plafond des trois'], EX.map((i) => { const gi = h.M.gis('single', i).monthly; const c = cap(h, i); return [h.eur(i), h.eur(oas, 2), h.eur(gi, 2), c ? h.eur(c) : h.eur(0), h.eur(oas + gi + c, 2)]; }), 'Personne âgée seule en Ontario, octobre à décembre 2026 : montants fédéraux et maximum du RRAG (le RRAG réel peut être plus bas)', ['r', 'r', 'r', 'r', 'r'])}
<p>La colonne du RRAG montre un plafond, pas un montant calculé : l’Ontario ne publie pas la façon dont un versement partiel est établi entre zéro et la limite de revenu. La colonne du SRG vient d’un modèle calé sur le ${h.src('oasQuarterly', 'rapport trimestriel d’EDSC')}, exact aux seuils publiés et juste à environ un dollar par mois près entre eux. Ensemble, elles montrent la forme du système : le RRAG pèse surtout pour un pensionné qui n’a presque pas de RPC ni de rente d’employeur, pour qui ${h.eur(g.max_month)} par mois représentent une part sensible du budget.</p>
<!--mini:ontarioGainsCeiling-->
<h2>Les couples</h2>
<p>Pour un couple de personnes âgées, la limite de revenu privé est de ${h.eur(g.income_max_couple)} par année, le double de celle d’une personne seule. Le maximum est exprimé par aîné admissible. La province signale que d’autres limites s’appliquent quand l’un des conjoints a moins de 65 ans ou n’a pas droit à la SV ; ces chiffres figurent dans des tableaux distincts par état matrimonial que ce guide ne reproduit pas. Côté fédéral, le SRG du couple suit ses propres grilles, expliquées dans le ${h.a('gis-couples', 'guide du SRG en couple')}.</p>
<h2>Pas de demande, mais une déclaration chaque année</h2>
<p>Les aînés qui reçoivent la SV et le SRG ne présentent pas de demande pour le RRAG. L’Ontario leur demande de produire une déclaration de revenus chaque année avant le ${h.num(x.fFileByDay)} avril, même sans revenu à déclarer. Le fédéral exige la même chose : Service Canada révise le SRG chaque année à partir de la déclaration (${h.src(S('fGisReceive'), 'Service Canada, recevoir le SRG')}). Une seule déclaration en retard peut donc interrompre les deux versements à la fois, ce qui fait de la production à temps l’habitude la plus utile pour un aîné à faible revenu en Ontario.</p>
<h2>Quand l’argent arrive</h2>
<p>Le RRAG est versé vers le ${h.num(x.fGainsPayDay)} de chaque mois, de juillet à juin de l’année suivante. Les dépôts fédéraux suivent un autre calendrier : le ${h.a('benefit-payment-dates', 'calendrier combiné')} les met côte à côte. La plupart des mois, le RRAG arrive quelques jours avant le dépôt du RPC, de la SV et du SRG, mais décembre peut inverser l’ordre puisque le versement fédéral y est avancé.</p>
<h2>Les changements en cours d’année</h2>
<p>Le versement du RRAG peut changer pendant l’année de prestations quand le revenu privé ou l’état matrimonial change. Une nouvelle rente d’employeur, le décès d’un conjoint ou une séparation peuvent faire bouger le montant, dans un sens ou dans l’autre, avant le mois de juillet suivant. L’Ontario ne publie pas la formule de recalcul : l’avis de la province reste le seul chiffre fiable. Les questions vont au ministère des Finances de l’Ontario, celles sur la SV et le SRG à Service Canada.</p>
<h2>Les autres aides ontariennes pour les aînés</h2>
<p>Le RRAG n’est pas le seul programme provincial dont un aîné à faible revenu peut profiter. La ${h.a('ontario-trillium-benefit', 'prestation Trillium de l’Ontario')} regroupe le crédit pour les coûts d’énergie et les impôts fonciers, le crédit de taxe de vente et le crédit pour les coûts d’énergie dans le Nord, avec un montant d’impôt foncier plus élevé à partir de 65 ans. Elle suit le calendrier de versement de l’ARC, et non la date du RRAG.</p>
`; },
  },
});
