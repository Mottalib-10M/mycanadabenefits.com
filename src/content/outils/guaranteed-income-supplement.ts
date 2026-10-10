import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const G = (h: Helpers) => h.P.gis;
const X = (h: Helpers) => h.P.x as Record<string, number>;
/** Revenus annuels (hors SV) servant d'exemples au tableau de cas types. */
const CASES = [0, 4000, 8000, 12000, 16000, 20000, 25000, 30000, 40000];
const KINDS = ['single', 'spouse_oas', 'spouse_allowance', 'spouse_no_oas'] as const;
const caseRows = (h: Helpers) => CASES.map((i) => [h.eur(i), ...KINDS.map((k) => h.eur(h.M.gis(k, i).monthly, 2))]);
const QS = ['2026-01', '2026-04', '2026-07', '2026-10'] as const;

export default defineGuide({
  id: 'guaranteed-income-supplement',
  group: 'oas',
  order: 10,
  tool: 'gis',
  related: ['gis-couples', 'gis-work-exemption', 'allowance-60-64', 'old-age-security', 'rrif-gis-clawback', 'ontario-gains'],
  sources: [S('oasQuarterly'), S('oasPayments'), S('fGisElig'), S('fGisReceive'), S('fGisAmount')],
  en: {
    slug: 'guaranteed-income-supplement',
    nav: 'GIS calculator',
    card: 'Your monthly Guaranteed Income Supplement for October to December 2026, in all four household situations.',
    title: 'Guaranteed Income Supplement 2026: Amounts by Situation',
    description: 'Guaranteed Income Supplement 2026: up to $1,138.90 a month for a single senior from October to December, ending at $23,112 of income. Four situations compared.',
    h1: 'Guaranteed Income Supplement calculator',
    intro: 'Enter your situation and last year’s income without OAS to see the monthly GIS paid on top of your Old Age Security pension.',
    resume: (h) => { const g = G(h); return `From October to December 2026 the Guaranteed Income Supplement pays up to ${h.eur(g.single.max, 2)} a month to a single, widowed or divorced Old Age Security pensioner whose income, OAS excluded, stays under ${h.eur(g.single.thr)} a year. The amount depends on the household. When the spouse also receives OAS, each partner can get up to ${h.eur(g.spouse_oas.max, 2)}, and the supplement ends once the couple’s combined income reaches ${h.eur(g.spouse_oas.thr)}. When the spouse receives the Allowance, the pensioner’s ceiling is the same ${h.eur(g.spouse_allowance.max, 2)} but the combined cut-off rises to ${h.eur(g.spouse_allowance.thr)}. When the spouse gets neither benefit, the pensioner can receive up to ${h.eur(g.spouse_no_oas.max, 2)} and keeps some GIS until combined income hits ${h.eur(g.spouse_no_oas.thr)}. Income means the previous year’s income as assessed by the CRA: CPP, workplace pensions, RRIF withdrawals, interest and wages, after the employment exemption of ${h.eur(g.work_exempt_full)} plus half of earnings up to ${h.eur(g.work_exempt_half_to)}. The GIS is not taxable and its amounts are raised each quarter.`; },
    faqs: (h) => [
      { q: 'How accurate is this GIS calculator between the published income thresholds?', a: `Exact at the maximum and at each threshold Service Canada publishes, and within about a dollar a month in between. The government prints its grid in income bands rather than as a formula, so the calculator uses a model fitted to that grid. For a single pensioner, the two published anchors are the top-up cut-off of ${h.eur(G(h).single.topup_thr)} and the income cut-off of ${h.eur(G(h).single.thr)}. Your Service Canada letter remains the amount actually paid.` },
      { q: 'Which year’s income should I enter for my GIS in late 2026?', a: `Your 2025 income. Service Canada reviews the supplement each year from your federal tax return and sends a renewal letter in July, so the payments from July 2026 to June 2027 rest on 2025 income. Leave out the OAS pension itself, and enter wages in the second field so the exemption of ${h.eur(G(h).work_exempt_full)} plus half of the next band is applied.` },
      { q: 'How much did the maximum GIS rise during 2026?', a: `For a single pensioner it went from ${h.eur(G(h).quarters['2026-01'].single[0], 2)} in January to ${h.eur(G(h).quarters['2026-10'].single[0], 2)} in October, because Service Canada indexes the amounts in January, April, July and October. The income cut-off moved with it, from ${h.eur(G(h).quarters['2026-01'].single[1])} to ${h.eur(G(h).quarters['2026-10'].single[1])}. The calculator uses the October to December figures.` },
      { q: 'Can I get the GIS while spending winters outside Canada?', a: `Yes for short stays, no beyond ${h.num(X(h).fAbroadMonths)} months. Service Canada states that the supplement cannot be collected by someone outside Canada for more than ${h.num(X(h).fAbroadMonths)} months and asks recipients to contact it before leaving, which avoids an overpayment to repay later. The calculator assumes you live in Canada, which is also a condition of eligibility.` },
    ],
    body: (h) => { const g = G(h); const x = X(h); return `
<h2>What the calculator works out</h2>
<p>It returns the monthly GIS for October to December 2026, split into the basic supplement and the top-up reserved for the lowest incomes, for the four situations of the ${h.src('oasQuarterly', 'ESDC quarterly table')}. Employment and self-employment income goes through the exemption before the threshold test, so a part-time job weighs less than the same amount of pension. To qualify you must be ${h.num(x.fGisAge)} or older, receive the OAS pension, live in Canada and not be under a sponsorship agreement (${h.src(S('fGisElig'), 'Service Canada eligibility page')}).</p>
<h2>Typical cases, monthly GIS</h2>
${h.table(['Income without OAS', 'Single', 'Spouse with OAS (each)', 'Spouse with Allowance', 'Spouse without OAS'], caseRows(h), 'GIS per month by annual income, October to December 2026 (model fitted to the ESDC grid)', ['r', 'r', 'r', 'r', 'r'])}
<p>For couples, the income in the first column is the combined income of both partners. In the third column the pensioner’s GIS stays near its ceiling over a wide range, while the spouse’s Allowance is the amount that falls. The ${h.a('gis-couples', 'couples guide')} works through each case.</p>
<h2>Maximum and cut-off, quarter by quarter</h2>
${h.table(['Quarter', 'Single: maximum', 'Single: cut-off', 'Spouse with OAS: maximum', 'Couple cut-off'], QS.map((q) => [q === '2026-01' ? 'Jan. to Mar.' : q === '2026-04' ? 'Apr. to June' : q === '2026-07' ? 'July to Sept.' : 'Oct. to Dec.', h.eur(g.quarters[q].single[0], 2), h.eur(g.quarters[q].single[1]), h.eur(g.quarters[q].spouse_oas[0], 2), h.eur(g.quarters[q].spouse_oas[1])]), 'GIS amounts published for each 2026 quarter', ['l', 'r', 'r', 'r', 'r'])}
<h2>What it does not do</h2>
<p>It does not handle couples who live apart for reasons beyond their control, such as long-term care, which Service Canada asks recipients to report and which can change the amount. It does not estimate the ${h.a('ontario-gains', 'Ontario GAINS top-up')} or other provincial supplements, and it ignores sponsorship exceptions. Large RRIF withdrawals count as income the following year: the ${h.a('rrif-gis-clawback', 'RRIF and GIS guide')} shows the effect. File your return by April ${h.num(x.fFileByDay)} each year to keep payments flowing (${h.src(S('fGisReceive'), 'Service Canada, receiving the GIS')}).</p>
`; },
  },
  fr: {
    slug: 'supplement-de-revenu-garanti',
    nav: 'Calcul du SRG',
    card: 'Votre Supplément de revenu garanti mensuel d’octobre à décembre 2026, dans les quatre situations de ménage.',
    title: 'Supplément de revenu garanti 2026 : montants et seuils',
    description: 'Supplément de revenu garanti 2026 : jusqu’à 1 138,90 $ par mois pour une personne seule d’octobre à décembre, nul à partir de 23 112 $ de revenu. Quatre cas.',
    h1: 'Calculateur du Supplément de revenu garanti',
    intro: 'Indiquez votre situation et le revenu de l’an dernier, hors SV, pour voir le SRG mensuel versé en plus de votre pension de la Sécurité de la vieillesse.',
    resume: (h) => { const g = G(h); return `D’octobre à décembre 2026, le Supplément de revenu garanti verse jusqu’à ${h.eur(g.single.max, 2)} par mois à un pensionné de la Sécurité de la vieillesse seul, veuf ou divorcé dont le revenu, hors SV, reste sous ${h.eur(g.single.thr)} par année. Le montant dépend du ménage. Si le conjoint touche aussi la SV, chacun peut recevoir jusqu’à ${h.eur(g.spouse_oas.max, 2)}, et le supplément s’arrête quand le revenu combiné du couple atteint ${h.eur(g.spouse_oas.thr)}. Si le conjoint reçoit l’Allocation, le plafond du pensionné reste de ${h.eur(g.spouse_allowance.max, 2)}, mais le seuil combiné monte à ${h.eur(g.spouse_allowance.thr)}. Si le conjoint ne reçoit ni l’une ni l’autre, le pensionné peut toucher jusqu’à ${h.eur(g.spouse_no_oas.max, 2)} et garde un peu de SRG jusqu’à ${h.eur(g.spouse_no_oas.thr)} de revenu combiné. Le revenu retenu est celui de l’année précédente (RPC ou RRQ, rentes, retraits de FERR, intérêts, salaires), après l’exemption de ${h.eur(g.work_exempt_full)} sur les gains de travail. Le SRG n’est pas imposable et ses montants sont relevés chaque trimestre.`; },
    faqs: (h) => [
      { q: 'Quelle est la précision du calculateur du SRG entre deux seuils publiés ?', a: `Il est exact au maximum et à chaque seuil publié par Service Canada, et à environ un dollar par mois près entre les deux. Le gouvernement publie sa grille par tranches de revenu, sans formule : le calculateur s’appuie donc sur un modèle calé sur cette grille. Pour une personne seule, les deux repères publiés sont le seuil du complément, ${h.eur(G(h).single.topup_thr)}, et le seuil de revenu, ${h.eur(G(h).single.thr)}. La lettre de Service Canada fait foi.` },
      { q: 'Quel revenu inscrire pour calculer mon SRG de la fin de 2026 ?', a: `Votre revenu de 2025. Service Canada révise le supplément chaque année à partir de votre déclaration de revenus fédérale et envoie une lettre de renouvellement en juillet : les versements de juillet 2026 à juin 2027 reposent donc sur le revenu de 2025. Excluez la pension de la SV et inscrivez le salaire dans le second champ, qui applique l’exemption.` },
      { q: 'De combien le SRG maximal a-t-il augmenté en 2026 ?', a: `Pour une personne seule, il est passé de ${h.eur(G(h).quarters['2026-01'].single[0], 2)} en janvier à ${h.eur(G(h).quarters['2026-10'].single[0], 2)} en octobre, puisque Service Canada indexe les montants en janvier, avril, juillet et octobre. Le seuil de revenu a suivi, de ${h.eur(G(h).quarters['2026-01'].single[1])} à ${h.eur(G(h).quarters['2026-10'].single[1])}. Le calculateur utilise les chiffres d’octobre à décembre.` },
      { q: 'Peut-on toucher le SRG en passant l’hiver hors du Canada ?', a: `Oui pour un court séjour, non au-delà de ${h.num(X(h).fAbroadMonths)} mois. Service Canada précise qu’on ne peut pas toucher le supplément en étant à l’extérieur du Canada pendant plus de ${h.num(X(h).fAbroadMonths)} mois, et demande de le prévenir avant le départ pour éviter un trop-payé à rembourser. Le calculateur suppose que vous vivez au Canada, ce qui est aussi une condition d’admissibilité.` },
    ],
    body: (h) => { const g = G(h); const x = X(h); return `
<h2>Ce que calcule l’outil</h2>
<p>Il donne le SRG mensuel d’octobre à décembre 2026, réparti entre le supplément de base et le complément réservé aux plus faibles revenus, pour les quatre situations du ${h.src('oasQuarterly', 'rapport trimestriel d’EDSC')}. Pour être admissible, il faut avoir ${h.num(x.fGisAge)} ans ou plus, recevoir la pension de la SV, vivre au Canada et ne pas avoir d’entente de parrainage (${h.src(S('fGisElig'), 'page d’admissibilité de Service Canada')}).</p>
<h2>Cas types, SRG par mois</h2>
${h.table(['Revenu hors SV', 'Seul', 'Conjoint avec SV (chacun)', 'Conjoint avec Allocation', 'Conjoint sans SV'], caseRows(h), 'SRG mensuel selon le revenu annuel, octobre à décembre 2026 (modèle calé sur la grille d’EDSC)', ['r', 'r', 'r', 'r', 'r'])}
<p>Pour un couple, le revenu de la première colonne est le revenu combiné des deux conjoints. Le ${h.a('gis-couples', 'guide du SRG en couple')} détaille chaque cas.</p>
<h2>Maximum et seuil, trimestre par trimestre</h2>
${h.table(['Trimestre', 'Seul : maximum', 'Seul : seuil', 'Conjoint avec SV : maximum', 'Seuil du couple'], QS.map((q) => [q === '2026-01' ? 'Janv. à mars' : q === '2026-04' ? 'Avr. à juin' : q === '2026-07' ? 'Juill. à sept.' : 'Oct. à déc.', h.eur(g.quarters[q].single[0], 2), h.eur(g.quarters[q].single[1]), h.eur(g.quarters[q].spouse_oas[0], 2), h.eur(g.quarters[q].spouse_oas[1])]), 'Montants du SRG publiés pour chaque trimestre de 2026', ['l', 'r', 'r', 'r', 'r'])}
<h2>Ce que l’outil ne fait pas</h2>
<p>Il ne traite pas les conjoints séparés pour des raisons indépendantes de leur volonté (soins de longue durée), une situation à signaler à Service Canada. Il n’estime pas le ${h.a('ontario-gains', 'RRAG de l’Ontario')} ni les autres suppléments provinciaux,. Un gros retrait de FERR compte comme revenu l’année suivante : le ${h.a('rrif-gis-clawback', 'guide FERR et SRG')} en montre l’effet. Produisez votre déclaration avant le ${h.num(x.fFileByDay)} avril de chaque année pour garder vos versements (${h.src(S('fGisReceive'), 'Service Canada, recevoir le SRG')}).</p>
`; },
  },
});
