import { defineGuide, type Helpers } from '../../lib/guide-types';

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
};
/** Jour du versement d'une prestation pour un mois, ou un tiret s'il n'y en a pas. */
const day = (h: Helpers, k: Parameters<Helpers['M']['payDateIn']>[0], m: number) => { const d = h.M.payDateIn(k, m); return d ? h.num(Number(d.slice(8, 10))) : '–'; };
const grid = (h: Helpers) => MONTHS[h.lang].map((name, i) => [name, day(h, 'cpp_oas', i + 1), day(h, 'ccb', i + 1), day(h, 'cgeb', i + 1), day(h, 'cdb', i + 1), day(h, 'otb', i + 1), day(h, 'acwb', i + 1), day(h, 'acfb', i + 1)]);

export default defineGuide({
  id: 'benefit-payment-dates',
  group: 'dates',
  order: 10,
  tool: 'dates',
  related: ['cpp-payment-dates', 'oas-payment-dates', 'ccb-payment-dates', 'gst-payment-dates', 'ontario-trillium-benefit'],
  sources: ['craDates', 'benefitsCalendar', 'ccbDates', 'cdbElig'],
  en: {
    slug: 'benefit-payment-dates',
    nav: 'All benefit payment dates',
    card: 'Every 2026 deposit day from the CRA and Service Canada in one calendar.',
    title: 'Benefit Payment Dates 2026: CRA and Service Canada Calendar',
    description: 'Benefit payment dates 2026: CPP and OAS on December 22, the child benefit on December 11, the CGEB on October 5, and every other federal deposit in one table.',
    h1: 'Benefit payment dates in 2026',
    intro: 'Two federal calendars run side by side: the Canada Revenue Agency pays credits and family benefits, Service Canada pays pensions and the disability benefit.',
    resume: (h) => { const c = h.M.payDates('cpp_oas'), k = h.M.payDates('ccb'), g = h.M.payDates('cgeb'), d = h.M.payDates('cdb'); return `The last two federal deposits of 2026 are CPP and OAS on ${h.date(c[10])} and ${h.date(c[11])}, the Canada child benefit on ${h.date(k[10])} and ${h.date(k[11])}, and the Canada Disability Benefit on ${h.date(d[10])} and ${h.date(d[11])}. The Canada Groceries and Essentials Benefit, which replaced the GST/HST credit in July, made its last 2026 payment on ${h.date(g[3])}, after ${h.date(g[0])}, ${h.date(g[1])} and ${h.date(g[2])}. Each calendar belongs to one payer. Service Canada sets the pension days, usually in the last week of the month, and the disability benefit days, on the third Thursday. The Canada Revenue Agency sets the child benefit, near the 20th, the quarterly groceries benefit, the Ontario Trillium Benefit, around the 10th, and the advance payments of the workers benefit. December is early everywhere because of the holidays. None of the 2027 dates had been published when we checked, so the tool stops at the end of the year.`; },
    faqs: (h) => [
      { q: 'Which federal benefit is paid first in December 2026?', a: `The Ontario Trillium Benefit, on ${h.date(h.M.payDateIn('otb', 12)!)}, then the child benefit on ${h.date(h.M.payDateIn('ccb', 12)!)}, the Canada Disability Benefit on ${h.date(h.M.payDateIn('cdb', 12)!)} and CPP with OAS on ${h.date(h.M.payDateIn('cpp_oas', 12)!)}. There is no groceries benefit payment in December: its next one is in January 2027, on a day the CRA had not yet announced.` },
      { q: 'How long should I wait before reporting a missing CRA payment?', a: `The Canada Revenue Agency asks you to wait ${h.num(h.P.missing_payment_wait.ccb_acfb)} working days after the scheduled date for the child benefit and the Alberta child and family benefit, and ${h.num(h.P.missing_payment_wait.others)} working days for its other programs, before calling. For CPP, OAS and the disability benefit, the payer is Service Canada, not the CRA.` },
      { q: 'Are provincial benefits paid on the federal dates?', a: 'Several are. The CRA pays related provincial and territorial programs with the Canada child benefit and with the Groceries and Essentials Benefit, on the same day. The Ontario Trillium Benefit, the Alberta child and family benefit and the Newfoundland and Labrador disability benefit have their own calendars, listed by the CRA and included in the tool.' },
    ],
    body: (h) => `
<h2>What the tool shows</h2>
<p>Pick a benefit, or keep all of them, and the tool lists the next deposits from today, in date order. Every date comes from the 2026 calendars published by the ${h.src('craDates', 'Canada Revenue Agency')} and by ${h.src('benefitsCalendar', 'Service Canada')}. It does not know whether you are entitled to a payment, how much it will be, or how fast your bank posts it: a direct deposit usually shows on the date itself, a cheque takes longer.</p>
<h2>The 2026 grid, day of the month</h2>
${h.table(['Month', 'CPP, OAS, GIS', 'Child benefit', 'GST credit / CGEB', 'Disability Benefit', 'Ontario Trillium', 'Advanced CWB', 'Alberta ACFB'], grid(h), 'Day of each 2026 federal deposit (CRA and Service Canada calendars)', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The January and April groceries payments were still made under the old name, GST/HST credit. The workers benefit advances go only to people who applied for them, and the Alberta benefit only to Alberta families. For the amount behind each date, use the ${h.a('ccb-calculator', 'child benefit calculator')}, the ${h.a('gst-credit-calculator', 'groceries benefit calculator')} or the ${h.a('old-age-security', 'OAS calculator')}. The amount you receive is the one on your CRA notice or Service Canada letter.</p>
`,
  },
  fr: {
    slug: 'dates-versement-prestations',
    nav: 'Toutes les dates de versement',
    card: 'Tous les dépôts 2026 de l’ARC et de Service Canada dans un seul calendrier.',
    title: 'Dates de versement des prestations 2026 : calendrier fédéral',
    description: 'Dates de versement des prestations 2026 : RPC et SV le 22 décembre, allocation pour enfants le 11 décembre, ACEBE le 5 octobre, et tous les dépôts fédéraux.',
    h1: 'Les dates de versement des prestations en 2026',
    intro: 'Deux calendriers fédéraux coexistent : l’Agence du revenu du Canada verse les crédits et les prestations familiales, Service Canada les pensions et la prestation pour personnes handicapées.',
    resume: (h) => { const c = h.M.payDates('cpp_oas'), k = h.M.payDates('ccb'), g = h.M.payDates('cgeb'), d = h.M.payDates('cdb'); return `Les deux derniers dépôts fédéraux de 2026 sont le RPC et la SV le ${h.date(c[10])} et le ${h.date(c[11])}, l’allocation canadienne pour enfants le ${h.date(k[10])} et le ${h.date(k[11])}, et la Prestation canadienne pour les personnes en situation de handicap le ${h.date(d[10])} et le ${h.date(d[11])}. L’Allocation canadienne pour l’épicerie et les besoins essentiels, qui a remplacé le crédit pour la TPS/TVH en juillet, a fait son dernier versement de 2026 le ${h.date(g[3])}, après ceux du ${h.date(g[0])}, du ${h.date(g[1])} et du ${h.date(g[2])}. Chaque calendrier a son payeur. Service Canada fixe les jours des pensions, en général dans la dernière semaine du mois, et ceux de la prestation pour personnes handicapées, le troisième jeudi. L’Agence du revenu du Canada fixe l’allocation pour enfants, vers le 20, l’allocation trimestrielle pour l’épicerie, la prestation Trillium de l’Ontario, vers le 10, et les paiements anticipés de l’allocation pour les travailleurs. Décembre est avancé partout à cause des Fêtes. Aucune date de 2027 n’était publiée lors de notre vérification : l’outil s’arrête donc à la fin de l’année.`; },
    faqs: (h) => [
      { q: 'Quelle prestation fédérale est versée en premier en décembre 2026 ?', a: `La prestation Trillium de l’Ontario, le ${h.date(h.M.payDateIn('otb', 12)!)}, puis l’allocation pour enfants le ${h.date(h.M.payDateIn('ccb', 12)!)}, la prestation pour personnes handicapées le ${h.date(h.M.payDateIn('cdb', 12)!)} et le RPC avec la SV le ${h.date(h.M.payDateIn('cpp_oas', 12)!)}. L’allocation pour l’épicerie n’a pas de versement en décembre : le prochain tombe en janvier 2027, à un jour que l’ARC n’avait pas encore annoncé.` },
      { q: 'Combien de temps attendre avant de signaler un versement de l’ARC manquant ?', a: `L’Agence du revenu du Canada demande d’attendre ${h.num(h.P.missing_payment_wait.ccb_acfb)} jours ouvrables après la date prévue pour l’allocation canadienne pour enfants et l’allocation de l’Alberta pour enfants et familles, et ${h.num(h.P.missing_payment_wait.others)} jours ouvrables pour ses autres programmes, avant d’appeler. Pour le RPC, la SV et la prestation pour personnes handicapées, le payeur est Service Canada.` },
      { q: 'Les prestations provinciales suivent-elles les dates fédérales ?', a: 'Plusieurs, oui. L’ARC verse les programmes provinciaux et territoriaux liés avec l’allocation canadienne pour enfants et avec l’allocation pour l’épicerie, le même jour. La prestation Trillium de l’Ontario, l’allocation de l’Alberta et la prestation d’invalidité de Terre-Neuve-et-Labrador ont leurs propres calendriers, publiés par l’ARC et repris dans l’outil.' },
    ],
    body: (h) => `
<h2>Ce que montre l’outil</h2>
<p>Choisissez une prestation, ou gardez-les toutes : l’outil liste les prochains dépôts à partir d’aujourd’hui, dans l’ordre des dates. Chaque date provient des calendriers 2026 publiés par l’${h.src('craDates', 'Agence du revenu du Canada')} et par ${h.src('benefitsCalendar', 'Service Canada')}. Il ne sait pas si vous avez droit au versement, quel en sera le montant ni à quelle vitesse votre banque l’inscrit : un dépôt direct apparaît en général le jour même, un chèque prend plus de temps.</p>
<h2>La grille 2026, jour du mois</h2>
${h.table(['Mois', 'RPC, SV, SRG', 'Allocation pour enfants', 'Crédit TPS / ACEBE', 'Prestation pour personnes handicapées', 'Trillium (Ontario)', 'ACT anticipée', 'ACFB (Alberta)'], grid(h), 'Jour de chaque dépôt fédéral de 2026 (calendriers de l’ARC et de Service Canada)', ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Les versements de janvier et d’avril portaient encore l’ancien nom, crédit pour la TPS/TVH. Les paiements anticipés de l’allocation pour les travailleurs ne vont qu’aux personnes qui les ont demandés, et l’allocation de l’Alberta qu’aux familles albertaines. Pour le montant derrière chaque date, servez-vous du ${h.a('ccb-calculator', 'calculateur de l’allocation pour enfants')}, du ${h.a('gst-credit-calculator', 'calculateur de l’allocation pour l’épicerie')} ou du ${h.a('old-age-security', 'calculateur de la SV')}. Le montant reçu est celui de votre avis de l’ARC ou de votre lettre de Service Canada.</p>
`,
  },
});
