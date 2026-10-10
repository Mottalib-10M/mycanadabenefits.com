import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const Q = (h: Helpers) => h.P.prov.qc.qpp;
const X = (h: Helpers) => h.P.x;
/** Rente maximale à un âge donné : 0,6 % par mois avant 65 ans (rente maximale), 0,7 % par mois après (Retraite Québec). */
const maxAt = (h: Helpers, age: number) => { const m = (age - 65) * 12; return Q(h).max_65 * (1 + (m < 0 ? X(h).gQppEarlyHigh : X(h).gQppLate) * m); };
/** Cotisation d'un salarié en 2026 : moitié des taux totaux de Retraite Québec. */
const contrib = (h: Helpers, earnings: number) => {
  const q = Q(h);
  const first = (q.rate_base_total + q.rate_supp_total) / 2 * Math.max(0, Math.min(earnings, q.ympe) - q.exemption);
  const second = X(h).gQppSecondRateTotal / 2 * Math.max(0, Math.min(earnings, q.yampe) - q.ympe);
  return { first, second, total: first + second };
};
const AGES = [60, 62, 65, 67, 70, 72];
const EARN = 50000;

export default defineGuide({
  id: 'quebec-pension-plan',
  group: 'cpp',
  order: 80,
  mini: 'qppStartAge',
  miniHref: 'cpp-calculator',
  related: ['cpp-calculator', 'cpp-at-60-or-70', 'cpp-contributions', 'cpp-payment-dates', 'old-age-security'],
  sources: ['rqAmounts', 'gRqQppCalc' as SourceKey, 'gRqDates' as SourceKey, 'cppAmounts', 'cppContrib'],
  en: {
    slug: 'quebec-pension-plan',
    nav: 'Quebec Pension Plan',
    card: 'The 2026 QPP retirement pension from 60 to 72, how Retraite Québec adjusts it, and what workers contribute.',
    title: 'Quebec Pension Plan 2026: Pension by Age and Contributions',
    description: 'Quebec Pension Plan 2026: maximum pension of $1,507.65 a month at 65, $964.90 at 60 and $2,394.15 at 72, contributions on earnings up to $74,600 and $85,000.',
    h1: 'Quebec Pension Plan (QPP)',
    intro: 'In Québec the Régime de rentes du Québec replaces the CPP: same maximum at 65, but its own adjustment rules, its own contribution rates and a pension that can start as late as 72.',
    resume: (h) => { const q = Q(h); const x = X(h); return `The maximum Quebec Pension Plan retirement pension is ${h.eur(q.max_65, 2)} a month in 2026 for a pension started at 65, the same ceiling as the CPP. Starting earlier lowers it for life: Retraite Québec cuts ${h.pct(x.gQppEarlyLow, 1)} to ${h.pct(x.gQppEarlyHigh, 1)} for each month before 65, the higher rate applying to the largest pensions, so the maximum at 60 is ${h.eur(x.gQppMax60, 2)}. Starting later raises it by ${h.pct(x.gQppLate, 1)} a month, up to age ${h.num(x.gQppMaxAge)}, where the maximum reaches ${h.eur(x.gQppMax72, 2)}. Few people get the maximum: those who started at 65 in 2026 receive ${h.eur(x.gQppAvg['65'])} on average. Workers and employers each pay half of a ${h.pct(q.rate_base_total, 2)} base rate and a ${h.pct(q.rate_supp_total, 2)} supplementary rate on earnings between ${h.eur(q.exemption)} and ${h.eur(q.ympe)}, then half of ${h.pct(x.gQppSecondRateTotal, 2)} up to ${h.eur(q.yampe)}. The pension is paid on the last business day of each month. The amount you receive is the one Retraite Québec confirms.`; },
    faqs: (h) => { const q = Q(h); const x = X(h); const c = contrib(h, q.yampe); return [
      { q: 'How much is the QPP pension cut if I start it at 60 instead of 65?', a: `Between ${h.pct(x.gQppEarlyLow * 60, 0)} and ${h.pct(x.gQppEarlyHigh * 60, 0)} for life, since Retraite Québec removes ${h.pct(x.gQppEarlyLow, 1)} to ${h.pct(x.gQppEarlyHigh, 1)} per month over 60 months. A person entitled to the maximum takes the full ${h.pct(x.gQppEarlyHigh * 60, 0)} cut and gets ${h.eur(x.gQppMax60, 2)} at 60; a small pension loses closer to ${h.pct(x.gQppEarlyLow * 60, 0)}.` },
      { q: 'Can I delay my Quebec Pension Plan retirement pension past age 70?', a: `Yes, until ${h.num(x.gQppMaxAge)}. Unlike the CPP, which stops growing at 70, the QPP keeps adding ${h.pct(x.gQppLate, 1)} for each month after 65 until age ${h.num(x.gQppMaxAge)}, a total increase of ${h.pct(x.gQppLate * 84, 1)}. In 2026 that lifts the maximum to ${h.eur(x.gQppMax72, 2)} a month, against ${h.eur(maxAt(h, 70))} at 70.` },
      { q: 'How much does an employee pay into the QPP in 2026?', a: `At most ${h.eur(c.total, 2)}. On earnings between ${h.eur(q.exemption)} and ${h.eur(q.ympe)}, the employee pays half of the ${h.pct(q.rate_base_total, 2)} base and ${h.pct(q.rate_supp_total, 2)} supplementary rates, up to ${h.eur(x.gQppEmpBaseMax, 2)} plus ${h.eur(x.gQppEmpSuppMax, 2)}; between ${h.eur(q.ympe)} and ${h.eur(q.yampe)}, half of ${h.pct(x.gQppSecondRateTotal, 2)} adds ${h.eur(c.second, 2)}. The employer pays the same.` },
      { q: 'What is the average QPP pension for someone who started at 65 in 2026?', a: `${h.eur(x.gQppAvg['65'])} a month, according to Retraite Québec, less than half of the ${h.eur(q.max_65, 2)} maximum. Those who started at 60 average ${h.eur(x.gQppAvg['60'])}, and those who waited until 70 average ${h.eur(x.gQppAvg['70'])}. The gap with the maximum reflects careers with lower earnings, part-time years or years outside Québec.` },
      { q: 'On what date is the Quebec Pension Plan paid in December 2026?', a: `On ${h.date(x.gQppDates[11])}. Retraite Québec generally pays the pension on the last business day of each month, so the date moves with weekends and holidays: ${h.date(x.gQppDates[9])} in October and ${h.date(x.gQppDates[10])} in November. These are not the CPP dates, which Service Canada sets a few days earlier.` },
      { q: 'Is the QPP death benefit the same amount as the CPP one?', a: `Yes, ${h.eur(x.gQppDeath)} at most under the Quebec plan in 2026, the figure Retraite Québec lists among its benefit amounts, which matches the CPP death benefit of ${h.eur(h.P.cpp.death)}. It is a one-time payment, separate from any surviving spouse’s pension, and it is claimed from Retraite Québec rather than Service Canada.` },
    ]; },
    body: (h) => { const q = Q(h); const x = X(h); const c = contrib(h, EARN); const cpp = h.M.cppContribution(EARN); const d = x.gQppDates; return `
<h2>The pension at each starting age</h2>
<p>The QPP retirement pension can start at any age from ${h.num(x.gQppMinAge)} to ${h.num(x.gQppMaxAge)}. Retraite Québec publishes the maximum and the average pension for people who applied in 2026; the table below rebuilds the maximum from the ${h.eur(q.max_65, 2)} ceiling with the official monthly rates.</p>
${h.table(['Starting age', 'Change vs 65', 'Maximum per month', 'Average for 2026 applicants'], AGES.map((a) => [h.num(a), a < 65 ? `−${h.pct(-x.gQppEarlyHigh * (a - 65) * 12, 1)}` : a === 65 ? '0' : `+${h.pct(x.gQppLate * (a - 65) * 12, 1)}`, h.eur(maxAt(h, a), 2), x.gQppAvg[String(a)] ? h.eur(x.gQppAvg[String(a)]) : '–']), 'Quebec Pension Plan retirement pension in 2026 by starting age (Retraite Québec)', ['l', 'r', 'r', 'r'])}
<p>The computed maximums match Retraite Québec’s own figures: ${h.eur(x.gQppMax60, 2)} at 60 and ${h.eur(x.gQppMax72, 2)} at 72. Before 65, the percentages shown are those for a maximum pension; a smaller pension loses a little less.</p>
<h2>Why the early reduction is not a single rate</h2>
<p>The CPP applies one rate to everybody who starts early. The QPP does not. Retraite Québec explains that the monthly reduction is about ${h.pct(x.gQppEarlyLow, 1)} for someone with a low pension and rises in proportion to the pension amount, up to ${h.pct(x.gQppEarlyHigh, 1)} for someone entitled to the maximum. In practice, a worker with a short or low-paid career pays a smaller price for starting at 60 than a high earner does. Our mini-simulator shows that range when your pension is below the maximum, because the exact sliding formula is not published on the page we read. Take the average pension at 65, ${h.eur(x.gQppAvg['65'])}: started at 62, it becomes between ${h.eur(x.gQppAvg['65'] * (1 - x.gQppEarlyHigh * 36))} and ${h.eur(x.gQppAvg['65'] * (1 - x.gQppEarlyLow * 36))} a month, and the person keeps that lower amount for the rest of their life, indexation aside. Waiting until 67 would instead give ${h.eur(x.gQppAvg['65'] * (1 + x.gQppLate * 24))}.</p>
<h2>QPP and CPP side by side</h2>
${h.table(['', 'QPP', 'CPP'], [
  ['Maximum at 65 (2026)', h.eur(q.max_65, 2), h.eur(h.P.cpp.max_65, 2)],
  ['Reduction per month before 65', `${h.pct(x.gQppEarlyLow, 1)} to ${h.pct(x.gQppEarlyHigh, 1)}`, h.pct(h.P.cpp.early, 1)],
  ['Increase per month after 65', h.pct(x.gQppLate, 1), h.pct(h.P.cpp.late, 1)],
  ['Latest starting age', h.num(x.gQppMaxAge), h.num(h.P.cpp.max_age)],
  ['Employee rate up to the first ceiling', h.pct((q.rate_base_total + q.rate_supp_total) / 2, 2), h.pct(h.P.cpp.rate, 2)],
  ['Earnings ceilings', `${h.eur(q.ympe)} · ${h.eur(q.yampe)}`, `${h.eur(h.P.cpp.ympe)} · ${h.eur(h.P.cpp.yampe)}`],
], 'Quebec Pension Plan and Canada Pension Plan, main 2026 parameters', ['l', 'r', 'r'])}
<p>The two plans share their earnings ceilings and their maximum at 65. The differences are in the early-start reduction, the extra two years of possible deferral and a higher contribution rate in Québec.</p>
<!--mini:qppStartAge-->
<h2>Contributions in 2026</h2>
<p>Workers in Québec contribute on employment earnings above the ${h.eur(q.exemption)} basic exemption. Retraite Québec states the rates as totals, shared equally between employee and employer: ${h.pct(q.rate_base_total, 2)} for the base plan and ${h.pct(q.rate_supp_total, 2)} for the supplementary plan up to ${h.eur(q.ympe)}, then ${h.pct(x.gQppSecondRateTotal, 2)} on the slice up to ${h.eur(q.yampe)}. A self-employed worker pays both halves.</p>
<p>For a salary of ${h.eur(EARN)}, the employee share comes to ${h.eur(c.total, 2)} for the year, against ${h.eur(cpp.total, 2)} for the same salary under the CPP outside Québec. The difference is the cost of the QPP’s higher base rate. Contributions stop at the ceilings: the most an employee can pay in 2026 is ${h.eur(contrib(h, q.yampe).total, 2)}.</p>
<h2>Payment dates in 2026</h2>
<p>Retraite Québec pays on the last business day of the month: ${d.map((x2: string) => h.date(x2)).join(', ')}. December is paid on the 30th. Old Age Security, a federal benefit, arrives separately on the Service Canada calendar, so a Québec retiree usually sees two deposits a few days apart; the ${h.a('cpp-payment-dates', 'federal dates')} are listed elsewhere.</p>
<h2>What a retiree at 65 can count on</h2>
<p>At 65, most Québec retirees combine two public pensions. Someone entitled to the QPP maximum and a full Old Age Security pension receives ${h.eur(q.max_65, 2)} from Retraite Québec plus ${h.eur(h.P.oas.max_65_74, 2)} from Service Canada for October to December 2026, or ${h.eur(q.max_65 + h.P.oas.max_65_74, 2)} a month before tax. With the average QPP pension of ${h.eur(x.gQppAvg['65'])}, the total falls to ${h.eur(x.gQppAvg['65'] + h.P.oas.max_65_74, 2)}, which is why low-income retirees should also check the Guaranteed Income Supplement.</p>
<h2>Working out your own pension</h2>
<p>A search for “rrq calcul” usually means one question: how much will I get? The starting point is your statement of participation, available in your online file with Retraite Québec, which gives the pension you have earned so far at 65. Enter that figure in the mini-simulator above, choose an age, and you get the monthly pension in 2026 dollars, before indexation.</p>
<p>Two cautions. The QPP pension is taxable, so the deposit is lower than the gross figure if you ask for tax to be withheld. And starting early is permanent: the reduction does not end at 65. Readers comparing with the federal plan can use the ${h.a('cpp-calculator', 'CPP calculator')} and the ${h.a('cpp-at-60-or-70', 'guide to starting at 60 or 70')}; the ${h.a('old-age-security', 'Old Age Security page')} covers the pension that adds to the QPP at 65. Figures come from ${h.src('rqAmounts', 'Retraite Québec’s 2026 amounts')} and its ${h.src('gRqQppCalc' as SourceKey, 'calculation page')}.</p>
`; },
  },
  fr: {
    slug: 'regime-rentes-quebec',
    nav: 'Régime de rentes du Québec',
    card: 'La rente de retraite du RRQ en 2026, de 60 à 72 ans, son ajustement par Retraite Québec et les cotisations des travailleurs.',
    title: 'Régime de rentes du Québec 2026 : rente et cotisations',
    description: 'Régime de rentes du Québec 2026 : rente maximale de 1 507,65 $ par mois à 65 ans, 964,90 $ à 60 ans et 2 394,15 $ à 72 ans, cotisations jusqu’à 74 600 $.',
    h1: 'Le Régime de rentes du Québec (RRQ)',
    intro: 'Au Québec, le Régime de rentes du Québec tient lieu de RPC : même maximum à 65 ans, mais ses propres règles d’ajustement, ses propres taux de cotisation et une rente qui peut commencer jusqu’à 72 ans.',
    resume: (h) => { const q = Q(h); const x = X(h); return `La rente de retraite maximale du Régime de rentes du Québec est de ${h.eur(q.max_65, 2)} par mois en 2026 pour une rente commencée à 65 ans, le même plafond qu’au RPC. Commencer plus tôt la réduit à vie : Retraite Québec retire de ${h.pct(x.gQppEarlyLow, 1)} à ${h.pct(x.gQppEarlyHigh, 1)} par mois avant 65 ans, le taux le plus haut visant les rentes les plus élevées, si bien que le maximum à 60 ans est de ${h.eur(x.gQppMax60, 2)}. Commencer plus tard l’augmente de ${h.pct(x.gQppLate, 1)} par mois, jusqu’à ${h.num(x.gQppMaxAge)} ans, où le maximum atteint ${h.eur(x.gQppMax72, 2)}. Peu de gens touchent le maximum : les personnes qui ont commencé à 65 ans en 2026 reçoivent ${h.eur(x.gQppAvg['65'])} en moyenne. Le travailleur et l’employeur paient chacun la moitié d’un taux de base de ${h.pct(q.rate_base_total, 2)} et d’un taux supplémentaire de ${h.pct(q.rate_supp_total, 2)} sur les revenus entre ${h.eur(q.exemption)} et ${h.eur(q.ympe)}, puis la moitié de ${h.pct(x.gQppSecondRateTotal, 2)} jusqu’à ${h.eur(q.yampe)}. La rente est versée le dernier jour ouvrable de chaque mois. Le montant reçu est celui que confirme Retraite Québec.`; },
    faqs: (h) => { const q = Q(h); const x = X(h); const c = contrib(h, q.yampe); return [
      { q: 'De combien la rente du RRQ baisse-t-elle si je la demande à 60 ans plutôt qu’à 65 ?', a: `De ${h.pct(x.gQppEarlyLow * 60, 0)} à ${h.pct(x.gQppEarlyHigh * 60, 0)} à vie, puisque Retraite Québec retire de ${h.pct(x.gQppEarlyLow, 1)} à ${h.pct(x.gQppEarlyHigh, 1)} par mois sur 60 mois. Une personne qui a droit au maximum subit la pleine baisse de ${h.pct(x.gQppEarlyHigh * 60, 0)} et reçoit ${h.eur(x.gQppMax60, 2)} à 60 ans ; une petite rente perd plutôt près de ${h.pct(x.gQppEarlyLow * 60, 0)}.` },
      { q: 'Peut-on reporter sa rente de retraite du RRQ après 70 ans ?', a: `Oui, jusqu’à ${h.num(x.gQppMaxAge)} ans. Contrairement au RPC, qui cesse d’augmenter à 70 ans, le RRQ continue d’ajouter ${h.pct(x.gQppLate, 1)} par mois après 65 ans jusqu’à ${h.num(x.gQppMaxAge)} ans, soit une hausse totale de ${h.pct(x.gQppLate * 84, 1)}. En 2026, le maximum passe ainsi à ${h.eur(x.gQppMax72, 2)} par mois, contre ${h.eur(maxAt(h, 70))} à 70 ans.` },
      { q: 'Combien un salarié verse-t-il au RRQ en 2026 ?', a: `Au plus ${h.eur(c.total, 2)}. Sur les revenus entre ${h.eur(q.exemption)} et ${h.eur(q.ympe)}, le salarié paie la moitié des taux de ${h.pct(q.rate_base_total, 2)} (régime de base) et de ${h.pct(q.rate_supp_total, 2)} (régime supplémentaire), soit au plus ${h.eur(x.gQppEmpBaseMax, 2)} et ${h.eur(x.gQppEmpSuppMax, 2)} ; entre ${h.eur(q.ympe)} et ${h.eur(q.yampe)}, la moitié de ${h.pct(x.gQppSecondRateTotal, 2)} ajoute ${h.eur(c.second, 2)}. L’employeur verse autant.` },
      { q: 'Quelle est la rente moyenne du RRQ pour une personne qui a commencé à 65 ans en 2026 ?', a: `${h.eur(x.gQppAvg['65'])} par mois, selon Retraite Québec, moins de la moitié du maximum de ${h.eur(q.max_65, 2)}. Les personnes qui ont commencé à 60 ans touchent en moyenne ${h.eur(x.gQppAvg['60'])}, et celles qui ont attendu 70 ans, ${h.eur(x.gQppAvg['70'])}. L’écart avec le maximum reflète des carrières à revenus plus modestes, des années à temps partiel ou passées hors du Québec.` },
      { q: 'À quelle date la rente du RRQ est-elle versée en décembre 2026 ?', a: `Le ${h.date(x.gQppDates[11])}. Retraite Québec verse en général la rente le dernier jour ouvrable de chaque mois : la date bouge donc avec les fins de semaine et les jours fériés, soit le ${h.date(x.gQppDates[9])} en octobre et le ${h.date(x.gQppDates[10])} en novembre. Ce ne sont pas les dates du RPC, que Service Canada fixe quelques jours plus tôt.` },
      { q: 'La prestation de décès du RRQ est-elle la même que celle du RPC ?', a: `Oui : au plus ${h.eur(x.gQppDeath)} au régime québécois en 2026, le montant que Retraite Québec inscrit parmi ses prestations, ce qui correspond à la prestation de décès du RPC de ${h.eur(h.P.cpp.death)}. Il s’agit d’un paiement unique, distinct de la rente de conjoint survivant, et il se demande à Retraite Québec plutôt qu’à Service Canada.` },
    ]; },
    body: (h) => { const q = Q(h); const x = X(h); const c = contrib(h, EARN); const cpp = h.M.cppContribution(EARN); const d = x.gQppDates; return `
<h2>La rente selon l’âge de début</h2>
<p>La rente de retraite du RRQ peut commencer à tout âge entre ${h.num(x.gQppMinAge)} et ${h.num(x.gQppMaxAge)} ans. Retraite Québec publie la rente maximale et la rente moyenne des personnes qui l’ont demandée en 2026 ; le tableau ci-dessous recalcule le maximum à partir du plafond de ${h.eur(q.max_65, 2)} avec les taux mensuels officiels.</p>
${h.table(['Âge de début', 'Écart par rapport à 65 ans', 'Maximum par mois', 'Moyenne des demandes de 2026'], AGES.map((a) => [`${h.num(a)} ans`, a < 65 ? `−${h.pct(-x.gQppEarlyHigh * (a - 65) * 12, 1)}` : a === 65 ? '0' : `+${h.pct(x.gQppLate * (a - 65) * 12, 1)}`, h.eur(maxAt(h, a), 2), x.gQppAvg[String(a)] ? h.eur(x.gQppAvg[String(a)]) : '–']), 'Rente de retraite du Régime de rentes du Québec en 2026 selon l’âge de début (Retraite Québec)', ['l', 'r', 'r', 'r'])}
<p>Les maximums calculés concordent avec ceux de Retraite Québec : ${h.eur(x.gQppMax60, 2)} à 60 ans et ${h.eur(x.gQppMax72, 2)} à 72 ans. Avant 65 ans, les pourcentages indiqués sont ceux d’une rente maximale ; une rente plus petite perd un peu moins.</p>
<h2>Pourquoi la réduction n’est pas un taux unique</h2>
<p>Le RPC applique le même taux à toute personne qui commence tôt. Le RRQ, non. Retraite Québec explique que la réduction mensuelle est d’environ ${h.pct(x.gQppEarlyLow, 1)} pour une personne qui reçoit une faible rente et augmente proportionnellement au montant de la rente, jusqu’à ${h.pct(x.gQppEarlyHigh, 1)} pour une personne qui a droit à la rente maximale. Concrètement, un travailleur à carrière courte ou peu payée paie moins cher son départ à 60 ans qu’une personne à revenu élevé. Notre mini-simulateur affiche cette fourchette quand votre rente est sous le maximum, car la formule exacte de glissement ne figure pas sur la page consultée. Prenons la rente moyenne à 65 ans, ${h.eur(x.gQppAvg['65'])} : commencée à 62 ans, elle devient de ${h.eur(x.gQppAvg['65'] * (1 - x.gQppEarlyHigh * 36))} à ${h.eur(x.gQppAvg['65'] * (1 - x.gQppEarlyLow * 36))} par mois, montant que la personne garde à vie, indexation mise à part. Attendre 67 ans donnerait plutôt ${h.eur(x.gQppAvg['65'] * (1 + x.gQppLate * 24))}.</p>
<h2>Le RRQ et le RPC côte à côte</h2>
${h.table(['', 'RRQ', 'RPC'], [
  ['Maximum à 65 ans (2026)', h.eur(q.max_65, 2), h.eur(h.P.cpp.max_65, 2)],
  ['Réduction par mois avant 65 ans', `${h.pct(x.gQppEarlyLow, 1)} à ${h.pct(x.gQppEarlyHigh, 1)}`, h.pct(h.P.cpp.early, 1)],
  ['Hausse par mois après 65 ans', h.pct(x.gQppLate, 1), h.pct(h.P.cpp.late, 1)],
  ['Âge de début le plus tardif', `${h.num(x.gQppMaxAge)} ans`, `${h.num(h.P.cpp.max_age)} ans`],
  ['Taux du salarié jusqu’au premier plafond', h.pct((q.rate_base_total + q.rate_supp_total) / 2, 2), h.pct(h.P.cpp.rate, 2)],
  ['Plafonds de revenu', `${h.eur(q.ympe)} · ${h.eur(q.yampe)}`, `${h.eur(h.P.cpp.ympe)} · ${h.eur(h.P.cpp.yampe)}`],
], 'Régime de rentes du Québec et Régime de pensions du Canada, principaux paramètres de 2026', ['l', 'r', 'r'])}
<p>Les deux régimes partagent leurs plafonds de revenu et leur maximum à 65 ans. Les différences tiennent à la réduction pour un départ hâtif, aux deux années de report supplémentaires et à un taux de cotisation plus élevé au Québec.</p>
<!--mini:qppStartAge-->
<h2>Les cotisations en 2026</h2>
<p>Les travailleurs québécois cotisent sur leurs revenus de travail au-delà de l’exemption générale de ${h.eur(q.exemption)}. Retraite Québec exprime les taux en totaux, partagés à parts égales entre salarié et employeur : ${h.pct(q.rate_base_total, 2)} pour le régime de base et ${h.pct(q.rate_supp_total, 2)} pour le régime supplémentaire jusqu’à ${h.eur(q.ympe)}, puis ${h.pct(x.gQppSecondRateTotal, 2)} sur la tranche qui va jusqu’à ${h.eur(q.yampe)}. Un travailleur autonome paie les deux moitiés.</p>
<p>Pour un salaire de ${h.eur(EARN)}, la part du salarié atteint ${h.eur(c.total, 2)} pour l’année, contre ${h.eur(cpp.total, 2)} pour le même salaire au RPC hors Québec. L’écart correspond au taux de base plus élevé du RRQ. Les cotisations s’arrêtent aux plafonds : un salarié ne peut pas verser plus de ${h.eur(contrib(h, q.yampe).total, 2)} en 2026.</p>
<h2>Les dates de paiement de 2026</h2>
<p>Retraite Québec verse la rente le dernier jour ouvrable du mois : ${d.map((x2: string) => `le ${h.date(x2)}`).join(', ')}. Décembre est payé le 30. La pension de la Sécurité de la vieillesse, fédérale, arrive à part selon le calendrier de Service Canada : un retraité québécois voit donc en général deux dépôts à quelques jours d’intervalle ; les ${h.a('cpp-payment-dates', 'dates fédérales')} sont présentées ailleurs.</p>
<h2>Ce que touche un retraité à 65 ans</h2>
<p>À 65 ans, la plupart des retraités québécois cumulent deux régimes publics. Une personne qui a droit au maximum du RRQ et à une pleine pension de la Sécurité de la vieillesse reçoit ${h.eur(q.max_65, 2)} de Retraite Québec et ${h.eur(h.P.oas.max_65_74, 2)} de Service Canada d’octobre à décembre 2026, soit ${h.eur(q.max_65 + h.P.oas.max_65_74, 2)} par mois avant impôt. Avec la rente moyenne du RRQ, ${h.eur(x.gQppAvg['65'])}, le total tombe à ${h.eur(x.gQppAvg['65'] + h.P.oas.max_65_74, 2)} : les retraités à faible revenu ont donc intérêt à vérifier aussi le Supplément de revenu garanti.</p>
<h2>Faire le calcul de sa propre rente</h2>
<p>Qui cherche « RRQ calcul » veut surtout savoir combien il touchera. Le point de départ est votre relevé de participation, offert dans votre dossier en ligne à Retraite Québec, qui indique la rente acquise à ce jour à 65 ans. Entrez ce montant dans le mini-simulateur ci-dessus, choisissez un âge, et vous obtenez la rente mensuelle en dollars de 2026, avant indexation.</p>
<p>Deux mises en garde. La rente du RRQ est imposable : le dépôt est inférieur au montant brut si vous demandez une retenue d’impôt. Et un départ hâtif est définitif : la réduction ne prend pas fin à 65 ans. Pour comparer avec le régime fédéral, voyez le ${h.a('cpp-calculator', 'calculateur du RPC')} et le ${h.a('cpp-at-60-or-70', 'guide pour commencer à 60 ou 70 ans')} ; la page sur la ${h.a('old-age-security', 'pension de vieillesse')} traite de la prestation qui s’ajoute au RRQ à 65 ans. Chiffres tirés des ${h.src('rqAmounts', 'montants 2026 de Retraite Québec')} et de sa ${h.src('gRqQppCalc' as SourceKey, 'page sur le calcul de la rente')}.</p>
`; },
  },
});
