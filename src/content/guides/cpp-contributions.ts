import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const C = (h: Helpers) => h.P.cpp;
const X = (h: Helpers) => h.P.x;
/** Niveaux de revenu : exemples ronds et seuils officiels (MGA, MSGA). */
const levels = (h: Helpers) => [30000, 50000, C(h).ympe, 80000, C(h).yampe, 120000];
const rows = (h: Helpers) => levels(h).map((e) => { const s = h.M.cppContribution(e), t = h.M.cppContribution(e, true); return [h.eur(e), h.eur(s.base, 2), h.eur(s.second, 2), h.eur(s.total, 2), h.eur(t.total, 2)]; });
/** Trois profils types : étudiant à temps partiel, infirmière, graphiste autonome. */
const P3 = { student: 12000, nurse: 80000, designer: 45000 };
const room = (h: Helpers) => C(h).ympe - C(h).exemption;

export default defineGuide({
  id: 'cpp-contributions',
  group: 'cpp',
  order: 70,
  mini: 'cppContribPayroll',
  miniHref: 'cpp-calculator',
  related: ['cpp-payment-amount', 'cpp-calculator', 'cpp-disability', 'cpp-at-60-or-70', 'quebec-pension-plan'],
  sources: ['cppContrib', 'cpp2', 'dCppStartStop' as SourceKey, 'dCppAmount' as SourceKey],
  en: {
    slug: 'cpp-contributions',
    nav: 'CPP contributions',
    card: 'The 2026 CPP and CPP2 rates, ceilings and maximums for employees and the self-employed, with the rules on age.',
    title: 'CPP Contributions 2026: 5.95% to $74,600, CPP2 to $85,000',
    description: 'CPP contributions 2026: 5.95% on earnings from $3,500 to $74,600, a $4,230.45 maximum, plus CPP2 at 4% up to $85,000 for $416 more. Self-employed pay both.',
    h1: 'CPP contributions in 2026',
    intro: 'Every paycheque between 18 and 70 carries two Canada Pension Plan deductions at most, and the 2026 ceilings decide when each one stops.',
    resume: (h) => `In 2026, employees pay ${h.pct(C(h).rate, 2)} of their earnings between the basic exemption of ${h.eur(C(h).exemption)} and the yearly maximum pensionable earnings of ${h.eur(C(h).ympe)}, for a maximum base contribution of ${h.eur(C(h).max_contrib, 2)}. Earnings above that ceiling and up to ${h.eur(C(h).yampe)} carry the second additional contribution, CPP2, at ${h.pct(C(h).cpp2_rate, 0)}, which adds at most ${h.eur(C(h).cpp2_max)}. An employee therefore pays no more than ${h.eur(C(h).max_total_employee, 2)} for the year, and the employer pays the same amount again. Self-employed workers pay both shares: up to ${h.eur(C(h).max_contrib_self, 2)} for base CPP and ${h.eur(C(h).cpp2_max_self)} for CPP2. On a salary of ${h.eur(levels(h)[1])}, the base contribution comes to ${h.eur(h.M.cppContribution(levels(h)[1]).total, 2)}, with no CPP2. Contributions start the month after you turn ${h.num(X(h).dContribStartAge)} and stop after the month you turn ${h.num(X(h).dContribStopAge)}. Between ${h.num(X(h).dElectStopFrom)} and ${h.num(X(h).dContribStopAge)}, someone already receiving a CPP or QPP retirement pension can choose to stop, and an employee considered disabled under the CPP does not contribute. The amounts actually deducted are those on your pay stubs and your notice of assessment.`,
    faqs: (h) => [
      { q: 'How much CPP comes off a $60,000 salary in 2026?', a: `${h.eur(h.M.cppContribution(60000).total, 2)} for the year: ${h.pct(C(h).rate, 2)} of the earnings above the ${h.eur(C(h).exemption)} exemption. That salary is under the ${h.eur(C(h).ympe)} ceiling, so no CPP2 applies. Your employer pays the same amount on top, and a self-employed person earning the same net income would pay ${h.eur(h.M.cppContribution(60000, true).total, 2)}.` },
      { q: 'Why does my take-home pay rise late in the year once CPP is maxed out?', a: `Because the base deduction stops as soon as your contributions for the year reach ${h.eur(C(h).max_contrib, 2)}, which happens once your earnings pass ${h.eur(C(h).ympe)}. CPP2 then applies at ${h.pct(C(h).cpp2_rate, 0)} until earnings reach ${h.eur(C(h).yampe)} and ${h.eur(C(h).cpp2_max)} has been taken. After that, nothing more is deducted until January, when the count restarts.` },
      { q: 'Can I stop paying CPP at 66 if I already collect my pension?', a: `Yes, if you are at least ${h.num(X(h).dElectStopFrom)} and under ${h.num(X(h).dContribStopAge)}, receive a CPP or QPP retirement pension and have pensionable employment income. You make the election with form CPT30, and the same form lets you revoke it later. Stopping means no more post-retirement benefits, which each year of contributions would otherwise add to your pension.` },
      { q: 'Do self-employed workers really pay double CPP?', a: `They pay both the employee and the employer share, because no employer pays the other half. For 2026 that means ${h.pct(C(h).rate * 2, 1)} on earnings between ${h.eur(C(h).exemption)} and ${h.eur(C(h).ympe)}, up to ${h.eur(C(h).max_contrib_self, 2)}, plus ${h.pct(C(h).cpp2_rate * 2, 0)} on the CPP2 band, up to ${h.eur(C(h).cpp2_max_self)}. The deduction is spread over the year only if you plan for it, since no payroll takes it at source.` },
      { q: 'Does CPP apply to the first dollars of a small part-time income?', a: `No. The first ${h.eur(C(h).exemption)} of yearly earnings is exempt, so a student or retiree earning that much or less over the year owes no base contribution. Above it, only the part beyond the exemption is charged at ${h.pct(C(h).rate, 2)}. A year with no contributions does not count toward the disability or death benefit tests.` },
      { q: 'What is the CPP2 line on my pay stub and why did it appear?', a: `CPP2 is the second additional contribution, charged at ${h.pct(C(h).cpp2_rate, 0)} only on earnings between ${h.eur(C(h).ympe)} and ${h.eur(C(h).yampe)} in 2026. It appears once your earnings for the year pass the first ceiling, so many employees never see it and higher earners see it only for part of the year. It stops at ${h.eur(C(h).cpp2_max)}.` },
    ],
    body: (h) => `
<h2>The 2026 parameters</h2>
${h.table(['Parameter', '2026 value'], [
  ['Basic exemption', h.eur(C(h).exemption)],
  ['Yearly maximum pensionable earnings (YMPE)', h.eur(C(h).ympe)],
  ['Maximum contributory earnings (YMPE minus exemption)', h.eur(room(h))],
  ['Employee and employer rate, base CPP', h.pct(C(h).rate, 2)],
  ['Maximum employee contribution, base CPP', h.eur(C(h).max_contrib, 2)],
  ['Year’s additional maximum pensionable earnings (YAMPE)', h.eur(C(h).yampe)],
  ['Employee and employer rate, CPP2', h.pct(C(h).cpp2_rate, 0)],
  ['Maximum employee contribution, CPP2', h.eur(C(h).cpp2_max)],
  ['Maximum self-employed contribution, base CPP plus CPP2', h.eur(C(h).max_contrib_self + C(h).cpp2_max_self, 2)],
], 'CPP and CPP2 contribution parameters for 2026 (Canada Revenue Agency)', ['l', 'r'])}
<p>The base figures come from the CRA page on contribution rates, maximums and exemptions (${h.src('cppContrib')}), and the CPP2 figures from its page on the second additional contribution (${h.src('cpp2')}). The YMPE went up from ${h.eur(C(h).ympe_2025)} in 2025 to ${h.eur(C(h).ympe)} in 2026, so the maximum contribution rose with it, even though the rate did not change.</p>
<h2>What you pay at different earnings</h2>
${h.table(['Earnings', 'Base CPP', 'CPP2', 'Employee total', 'Self-employed total'], rows(h), 'Annual CPP contributions in 2026 by earnings level (My Canada Benefits calculation from CRA parameters)', ['r', 'r', 'r', 'r', 'r'])}
<p>The base contribution grows in a straight line from the exemption to the YMPE and then stops. CPP2 only begins above the YMPE and stops at the YAMPE, so it touches a narrow band of ${h.eur(C(h).yampe - C(h).ympe)}. Beyond ${h.eur(C(h).yampe)} the total is flat: someone earning ${h.eur(levels(h)[5])} pays exactly what someone earning ${h.eur(C(h).yampe)} pays.</p>
<h3>Three workers, three bills</h3>
<p>A student who earns ${h.eur(P3.student)} over the year in a part-time job pays ${h.eur(h.M.cppContribution(P3.student).total, 2)}: only the slice above the exemption is charged, so the effective rate on the whole income is ${h.pct(h.M.cppContribution(P3.student).total / P3.student, 1)}. A nurse earning ${h.eur(P3.nurse)} reaches the base maximum of ${h.eur(C(h).max_contrib, 2)} and pays ${h.eur(h.M.cppContribution(P3.nurse).second, 2)} of CPP2 on the ${h.eur(P3.nurse - C(h).ympe)} above the YMPE, ${h.eur(h.M.cppContribution(P3.nurse).total, 2)} in all; her employer adds the same. A self-employed graphic designer with ${h.eur(P3.designer)} of net business income pays ${h.eur(h.M.cppContribution(P3.designer, true).total, 2)}, twice what an employee with the same earnings would see on a pay stub, because there is no employer to share the cost.</p>
<p>The designer’s bill surprises people most, because no payroll spreads it across the year. Setting aside about ${h.pct(C(h).rate * 2, 1)} of each invoice above the exemption avoids the shock.</p>
<!--mini:cppContribPayroll-->
<h2>Two layers, and why CPP2 exists</h2>
<p>Since ${h.date(X(h).dEnhancedFrom)}, the plan has been building an enhanced component on top of the base pension. Service Canada describes it as resting on an ${h.pct(X(h).dEnhancedRate, 1)} contribution rate shared equally by employees and employers, which is the ${h.pct(C(h).rate, 2)} each side pays today (${h.src('dCppAmount' as SourceKey)}). CPP2 extends that enhancement to earnings above the YMPE. The extra contribution is not lost: it raises the pension paid later, which is why the ${h.a('cpp-payment-amount', 'maximum pension')} keeps rising as new cohorts retire with more enhanced years.</p>
<p>For a worker, the practical result is a deduction of up to ${h.eur(C(h).max_total_employee, 2)} a year, matched by the employer. Counted together, employee and employer put up to ${h.eur(C(h).max_total_employee * 2, 2)} a year into the plan for one well-paid worker, the same total a self-employed person pays alone. What that buys at retirement shows up in the ${h.a('cpp-calculator', 'CPP calculator')}, once your statement reflects the years paid in.</p>
<h2>When contributions start and stop</h2>
<p>An employer starts deducting CPP from the first pay dated in the month after an employee turns ${h.num(X(h).dContribStartAge)}, and stops after the last pay dated in the month the employee turns ${h.num(X(h).dContribStopAge)} (${h.src('dCppStartStop' as SourceKey)}). Two exceptions matter:</p>
<ul>
<li>an employee aged ${h.num(X(h).dElectStopFrom)} to under ${h.num(X(h).dContribStopAge)} who receives a CPP or QPP retirement pension can elect to stop contributing with form CPT30, and revoke that choice later;</li>
<li>an employee considered disabled under the CPP does not have to contribute, which the ${h.a('cpp-disability', 'CPP disability guide')} covers from the recipient’s side.</li>
</ul>
<p>Choosing to keep contributing after starting your pension is not wasted money. Each year adds a post-retirement benefit to your income for life, an argument the ${h.a('cpp-at-60-or-70', 'guide on starting at 60 or 70')} weighs against the start-age adjustment.</p>
<h2>Years that count for benefits</h2>
<p>Your statement of contributions in My Service Canada Account lists your recorded earnings year by year. Checking it every few years catches a missing year while the pay stubs and T4 slips are still easy to find, which matters because the pension, the disability benefit and the death benefit are all calculated from that record and nothing else.</p>
<p>Contributions do more than build the retirement pension. The disability benefit requires contributions in recent years, and the death benefit requires a minimum number of contributory years. A year in which earnings stayed under the ${h.eur(C(h).exemption)} exemption produces no contribution and therefore does not count. Workers in Quebec contribute to the ${h.a('quebec-pension-plan', 'Quebec Pension Plan')} instead, under its own rates.</p>
`,
  },
  fr: {
    slug: 'cotisations-rpc',
    nav: 'Cotisations au RPC',
    card: 'Les taux, plafonds et maximums 2026 du RPC et du RPC2 pour les salariés et les travailleurs autonomes, et les règles d’âge.',
    title: 'Cotisations au RPC 2026 : 5,95 % jusqu’à 74 600 $ et RPC2',
    description: 'Cotisations au RPC 2026 : 5,95 % des gains de 3 500 $ à 74 600 $, maximum de 4 230,45 $, puis RPC2 à 4 % jusqu’à 85 000 $ (416 $ de plus). Autonomes : double.',
    h1: 'Les cotisations au RPC en 2026',
    intro: 'Chaque paie entre 18 et 70 ans comporte au plus deux retenues pour le Régime de pensions du Canada, et les plafonds de 2026 déterminent quand chacune s’arrête.',
    resume: (h) => `En 2026, les salariés versent ${h.pct(C(h).rate, 2)} de leurs gains entre l’exemption de base de ${h.eur(C(h).exemption)} et le maximum des gains annuels ouvrant droit à pension (MGA) de ${h.eur(C(h).ympe)}, pour une cotisation de base maximale de ${h.eur(C(h).max_contrib, 2)}. Les gains au-delà de ce plafond et jusqu’à ${h.eur(C(h).yampe)} portent la deuxième cotisation supplémentaire, le RPC2, au taux de ${h.pct(C(h).cpp2_rate, 0)}, qui ajoute au plus ${h.eur(C(h).cpp2_max)}. Un salarié ne paie donc pas plus de ${h.eur(C(h).max_total_employee, 2)} pour l’année, et l’employeur verse le même montant. Les travailleurs autonomes paient les deux parts : jusqu’à ${h.eur(C(h).max_contrib_self, 2)} pour le RPC de base et ${h.eur(C(h).cpp2_max_self)} pour le RPC2. Sur un salaire de ${h.eur(levels(h)[1])}, la cotisation de base s’élève à ${h.eur(h.M.cppContribution(levels(h)[1]).total, 2)}, sans RPC2. Les cotisations commencent le mois suivant le ${h.num(X(h).dContribStartAge)}e anniversaire et cessent après le mois du ${h.num(X(h).dContribStopAge)}e. Entre ${h.num(X(h).dElectStopFrom)} et ${h.num(X(h).dContribStopAge)} ans, une personne qui touche déjà une pension de retraite du RPC ou du RRQ peut choisir d’arrêter, et un employé considéré comme invalide au sens du RPC ne cotise pas. Les montants réellement retenus sont ceux de vos talons de paie et de votre avis de cotisation.`,
    faqs: (h) => [
      { q: 'Combien de RPC est retenu sur un salaire de 60 000 $ en 2026 ?', a: `${h.eur(h.M.cppContribution(60000).total, 2)} pour l’année : ${h.pct(C(h).rate, 2)} des gains au-delà de l’exemption de ${h.eur(C(h).exemption)}. Ce salaire est sous le plafond de ${h.eur(C(h).ympe)} : aucun RPC2 ne s’applique. L’employeur verse le même montant en plus, et un travailleur autonome au même revenu net paierait ${h.eur(h.M.cppContribution(60000, true).total, 2)}.` },
      { q: 'Pourquoi ma paie nette augmente-t-elle en fin d’année une fois le RPC au maximum ?', a: `Parce que la retenue de base cesse dès que vos cotisations de l’année atteignent ${h.eur(C(h).max_contrib, 2)}, ce qui arrive une fois vos gains au-delà de ${h.eur(C(h).ympe)}. Le RPC2 s’applique ensuite à ${h.pct(C(h).cpp2_rate, 0)} jusqu’à ce que les gains atteignent ${h.eur(C(h).yampe)} et que ${h.eur(C(h).cpp2_max)} aient été prélevés. Après, plus rien n’est retenu jusqu’en janvier, quand le compteur repart.` },
      { q: 'Puis-je cesser de cotiser au RPC à 66 ans si je touche déjà ma pension ?', a: `Oui, si vous avez au moins ${h.num(X(h).dElectStopFrom)} ans et moins de ${h.num(X(h).dContribStopAge)} ans, recevez une pension de retraite du RPC ou du RRQ et touchez un revenu d’emploi ouvrant droit à pension. Le choix se fait avec le formulaire CPT30, qui permet aussi de le révoquer plus tard. Arrêter prive des prestations après-retraite que chaque année de cotisation ajouterait sinon à votre pension.` },
      { q: 'Les travailleurs autonomes paient-ils vraiment le RPC en double ?', a: `Ils paient la part du salarié et celle de l’employeur, puisqu’aucun employeur ne verse l’autre moitié. Pour 2026, cela fait ${h.pct(C(h).rate * 2, 1)} des gains entre ${h.eur(C(h).exemption)} et ${h.eur(C(h).ympe)}, jusqu’à ${h.eur(C(h).max_contrib_self, 2)}, plus ${h.pct(C(h).cpp2_rate * 2, 0)} sur la tranche du RPC2, jusqu’à ${h.eur(C(h).cpp2_max_self)}. Sans paie pour la prélever à la source, mieux vaut la prévoir tout au long de l’année.` },
      { q: 'Le RPC s’applique-t-il aux premiers dollars d’un petit revenu à temps partiel ?', a: `Non. Les premiers ${h.eur(C(h).exemption)} de gains annuels sont exemptés : un étudiant ou un retraité qui gagne cette somme ou moins sur l’année ne doit aucune cotisation de base. Au-delà, seule la partie qui dépasse l’exemption est soumise au taux de ${h.pct(C(h).rate, 2)}. Une année sans cotisation ne compte pas pour les conditions des prestations d’invalidité ou de décès.` },
      { q: 'Qu’est-ce que la ligne RPC2 sur mon talon de paie, et pourquoi est-elle apparue ?', a: `Le RPC2 est la deuxième cotisation supplémentaire, prélevée à ${h.pct(C(h).cpp2_rate, 0)} uniquement sur les gains entre ${h.eur(C(h).ympe)} et ${h.eur(C(h).yampe)} en 2026. Elle apparaît quand vos gains de l’année dépassent le premier plafond : beaucoup de salariés ne la voient jamais, et les mieux payés ne la voient qu’une partie de l’année. Elle s’arrête à ${h.eur(C(h).cpp2_max)}.` },
    ],
    body: (h) => `
<h2>Les paramètres de 2026</h2>
${h.table(['Paramètre', 'Valeur 2026'], [
  ['Exemption de base', h.eur(C(h).exemption)],
  ['Maximum des gains annuels ouvrant droit à pension (MGA)', h.eur(C(h).ympe)],
  ['Gains cotisables maximaux (MGA moins l’exemption)', h.eur(room(h))],
  ['Taux du salarié et de l’employeur, RPC de base', h.pct(C(h).rate, 2)],
  ['Cotisation maximale du salarié, RPC de base', h.eur(C(h).max_contrib, 2)],
  ['Maximum supplémentaire des gains annuels ouvrant droit à pension (MSGA)', h.eur(C(h).yampe)],
  ['Taux du salarié et de l’employeur, RPC2', h.pct(C(h).cpp2_rate, 0)],
  ['Cotisation maximale du salarié, RPC2', h.eur(C(h).cpp2_max)],
  ['Cotisation maximale du travailleur autonome, RPC de base et RPC2', h.eur(C(h).max_contrib_self + C(h).cpp2_max_self, 2)],
], 'Paramètres de cotisation au RPC et au RPC2 pour 2026 (Agence du revenu du Canada)', ['l', 'r'])}
<p>Les chiffres de base viennent de la page de l’ARC sur les taux de cotisation, maximums et exemptions (${h.src('cppContrib')}), et ceux du RPC2 de sa page sur la deuxième cotisation supplémentaire (${h.src('cpp2')}). Le MGA est passé de ${h.eur(C(h).ympe_2025)} en 2025 à ${h.eur(C(h).ympe)} en 2026 : la cotisation maximale a suivi, même si le taux n’a pas bougé.</p>
<h2>Ce que vous payez selon vos gains</h2>
${h.table(['Gains', 'RPC de base', 'RPC2', 'Total du salarié', 'Total du travailleur autonome'], rows(h), 'Cotisations annuelles au RPC en 2026 selon le niveau de gains (calcul My Canada Benefits selon les paramètres de l’ARC)', ['r', 'r', 'r', 'r', 'r'])}
<p>La cotisation de base croît en ligne droite de l’exemption jusqu’au MGA, puis s’arrête. Le RPC2 ne commence qu’au-dessus du MGA et s’arrête au MSGA : il touche une bande étroite de ${h.eur(C(h).yampe - C(h).ympe)}. Au-delà de ${h.eur(C(h).yampe)}, le total est plat : une personne qui gagne ${h.eur(levels(h)[5])} paie exactement ce que paie celle qui gagne ${h.eur(C(h).yampe)}.</p>
<h3>Trois travailleurs, trois factures</h3>
<p>Un étudiant qui gagne ${h.eur(P3.student)} sur l’année dans un emploi à temps partiel paie ${h.eur(h.M.cppContribution(P3.student).total, 2)} : seule la tranche au-dessus de l’exemption est soumise, si bien que le taux effectif sur l’ensemble de son revenu est de ${h.pct(h.M.cppContribution(P3.student).total / P3.student, 1)}. Une infirmière qui gagne ${h.eur(P3.nurse)} atteint le maximum de base de ${h.eur(C(h).max_contrib, 2)} et paie ${h.eur(h.M.cppContribution(P3.nurse).second, 2)} de RPC2 sur les ${h.eur(P3.nurse - C(h).ympe)} au-dessus du MGA, soit ${h.eur(h.M.cppContribution(P3.nurse).total, 2)} au total ; son employeur verse autant. Un graphiste autonome qui a ${h.eur(P3.designer)} de revenu net d’entreprise paie ${h.eur(h.M.cppContribution(P3.designer, true).total, 2)}, le double de ce que verrait un salarié aux gains égaux sur son talon de paie, faute d’employeur pour partager le coût.</p>
<p>La facture du graphiste est celle qui surprend le plus, puisqu’aucune paie ne la répartit sur l’année. Mettre de côté environ ${h.pct(C(h).rate * 2, 1)} de chaque facture au-delà de l’exemption évite le choc.</p>
<!--mini:cppContribPayroll-->
<h2>Deux étages, et la raison d’être du RPC2</h2>
<p>Depuis le ${h.date(X(h).dEnhancedFrom)}, le régime construit une composante bonifiée au-dessus de la pension de base. Service Canada la décrit comme reposant sur un taux de cotisation de ${h.pct(X(h).dEnhancedRate, 1)}, partagé à parts égales entre salariés et employeurs, soit les ${h.pct(C(h).rate, 2)} que chacun verse aujourd’hui (${h.src('dCppAmount' as SourceKey)}). Le RPC2 étend cette bonification aux gains au-dessus du MGA. La cotisation supplémentaire n’est pas perdue : elle augmente la pension versée plus tard, ce qui explique que la ${h.a('cpp-payment-amount', 'pension maximale')} continue de monter à mesure que de nouvelles cohortes prennent leur retraite avec plus d’années bonifiées.</p>
<p>Pour un salarié, le résultat concret est une retenue d’au plus ${h.eur(C(h).max_total_employee, 2)} par année, égalée par l’employeur. Réunis, salarié et employeur versent jusqu’à ${h.eur(C(h).max_total_employee * 2, 2)} par année au régime pour un travailleur bien payé, le même total qu’un travailleur autonome paie seul. Ce que cela rapporte à la retraite apparaît dans le ${h.a('cpp-calculator', 'calcul du RPC')}, une fois que votre relevé intègre les années cotisées.</p>
<h2>Quand les cotisations commencent et s’arrêtent</h2>
<p>L’employeur commence à retenir le RPC sur la première paie datée du mois qui suit le ${h.num(X(h).dContribStartAge)}e anniversaire de l’employé, et cesse après la dernière paie datée du mois de son ${h.num(X(h).dContribStopAge)}e anniversaire (${h.src('dCppStartStop' as SourceKey)}). Deux exceptions comptent :</p>
<ul>
<li>un employé de ${h.num(X(h).dElectStopFrom)} ans à moins de ${h.num(X(h).dContribStopAge)} ans qui reçoit une pension de retraite du RPC ou du RRQ peut choisir de cesser de cotiser avec le formulaire CPT30, puis révoquer ce choix plus tard ;</li>
<li>un employé considéré comme invalide au sens du RPC n’a pas à cotiser, ce que le ${h.a('cpp-disability', 'guide de l’invalidité du RPC')} aborde du côté du bénéficiaire.</li>
</ul>
<p>Continuer de cotiser après le début de sa pension n’est pas de l’argent perdu. Chaque année ajoute une prestation après-retraite à votre revenu, à vie, un argument que le ${h.a('cpp-at-60-or-70', 'guide de l’âge de début')} met en balance avec l’ajustement selon l’âge.</p>
<h2>Les années qui comptent pour les prestations</h2>
<p>Votre état de compte des cotisations, dans Mon dossier Service Canada, présente vos gains inscrits année par année. Le vérifier tous les quelques ans permet de repérer une année manquante pendant que les talons de paie et les feuillets T4 sont encore faciles à retrouver : la pension, la prestation d’invalidité et la prestation de décès se calculent toutes sur ce dossier, et sur rien d’autre.</p>
<p>Les cotisations ne servent pas qu’à la pension de retraite. La prestation d’invalidité exige des cotisations au cours des dernières années, et la prestation de décès un nombre minimal d’années cotisées. Une année où les gains sont restés sous l’exemption de ${h.eur(C(h).exemption)} ne produit aucune cotisation et ne compte donc pas. Les travailleurs du Québec cotisent plutôt au ${h.a('quebec-pension-plan', 'Régime de rentes du Québec')}, selon ses propres taux.</p>
`,
  },
});
