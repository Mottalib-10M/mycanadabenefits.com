import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const A = (h: Helpers) => h.P.allowance;
const X = (h: Helpers) => h.P.x as Record<string, number>;
/** Revenus combinés d'exemple (hors SV, après exemption d'emploi). */
const EX = [0, 6000, 12000, 20000, 30000, 40000];
/** Revenu du couple de l'exemple chiffré (rente du RPC du pensionné). */
const EXC = 9000;
const QS = ['2026-01', '2026-04', '2026-07', '2026-10'] as const;

export default defineGuide({
  id: 'allowance-60-64',
  group: 'oas',
  order: 80,
  mini: 'allowanceSpouseCouple',
  miniHref: 'guaranteed-income-supplement',
  related: ['gis-couples', 'allowance-for-the-survivor', 'guaranteed-income-supplement', 'gis-work-exemption', 'old-age-security'],
  sources: [S('oasQuarterly'), S('fAllowElig'), S('fAllowApply'), S('fAllowReceive'), S('fAllowAmount'), S('fAllowOverview'), S('benefitsCalendar')],
  en: {
    slug: 'allowance-60-64',
    nav: 'Allowance (60 to 64)',
    card: 'The monthly benefit for the 60 to 64-year-old spouse of a GIS pensioner: amount, income cut-off and conditions.',
    title: 'Allowance for Ages 60 to 64 in 2026: Up to $1,448 a Month',
    description: 'Allowance in 2026: up to $1,448.06 a month for the spouse, aged 60 to 64, of a GIS pensioner, until combined income reaches $42,768. Conditions and forms.',
    h1: 'The Allowance for a spouse aged 60 to 64',
    intro: 'The Allowance pays a monthly, tax-free benefit to the younger spouse of a low-income pensioner, before that spouse can claim Old Age Security.',
    resume: (h) => { const a = A(h); return `The Allowance pays up to ${h.eur(a.max, 2)} a month from October to December 2026 to a person aged ${h.num(X(h).fAllowAgeMin)} to ${h.num(X(h).fAllowAgeMax)} whose spouse or common-law partner receives Old Age Security and is eligible for the Guaranteed Income Supplement. It ends when the couple’s combined annual income, without OAS and after the employment exemption, reaches ${h.eur(a.thr)}. That maximum is the full OAS pension of ${h.eur(h.P.oas.max_65_74, 2)} plus the couple rate of the GIS, ${h.eur(h.P.gis.spouse_allowance.max, 2)}, so the younger partner receives roughly what an OAS and GIS pensioner would. Service Canada sets the other conditions on its eligibility page: being a Canadian citizen or legal resident, having lived in Canada for at least ${h.num(X(h).fResYears)} years since age 18, and neither partner being under a sponsorship agreement. The benefit is not automatic: the spouse applies online or with form ISP3008. Payments are tax-free but depend on filing a tax return by April ${h.num(X(h).fFileByDay)} each year, and the amount on the Service Canada letter is the one paid.`; },
    faqs: (h) => [
      { q: 'Who qualifies for the Allowance between 60 and 64?', a: `A person aged ${h.num(X(h).fAllowAgeMin)} to ${h.num(X(h).fAllowAgeMax)} whose spouse or common-law partner receives OAS and is eligible for the GIS, who is a Canadian citizen or legal resident, has lived in Canada at least ${h.num(X(h).fResYears)} years since age 18, and whose couple has combined income under ${h.eur(A(h).thr)}. Neither partner may be under a sponsorship agreement, according to Service Canada’s eligibility page.` },
      { q: 'Do I pay income tax on the Allowance?', a: `No. Service Canada states that you do not pay taxes on Allowance payments. It adds that you must still file your tax return by April ${h.num(X(h).fFileByDay)} every year to avoid any disruption, because the benefit is reviewed each year from your federal return. Since the test adds both incomes, both partners’ returns matter.` },
      { q: 'Can I get the Allowance if my husband receives OAS but no GIS?', a: `Only if he is eligible for the GIS, which is one of the conditions. In this situation the GIS and the Allowance share the same combined income cut-off, ${h.eur(A(h).thr)} from October to December 2026, so a couple below it usually meets both tests. A couple above it receives neither, and the younger partner waits for OAS at ${h.num(X(h).fGisAge)}.` },
      { q: 'Which forms are needed to apply for the Allowance by mail?', a: 'Three: the Application for the Allowance or Allowance for the Survivor (ISP3008), the Statement of income for the renewal of the GIS, the Allowance or the Allowance for the Survivor (ISP3026), and the information sheet ISP3008A. Applying online through My Service Canada Account is possible if you live in Canada, have not already applied and no third party manages your account.' },
      { q: 'Does the Allowance stop if we spend the winter in the United States?', a: `Not for a usual snowbird stay. Service Canada states that the Allowance cannot be collected by someone outside Canada for more than ${h.num(X(h).fAbroadMonths)} months, and asks recipients to contact it before leaving to avoid an overpayment. A few winter months away keep the benefit; a longer absence suspends it.` },
      { q: 'Our income dropped this year: can the Allowance be based on it?', a: `Possibly. The Allowance normally uses the couple’s income from the previous year, but Service Canada’s amount page says that if your income this year is lower than last year, you can contact it so the benefit is set on an estimate of the current year. This typically helps when one partner has just stopped working or lost a pension.` },
    ],
    body: (h) => { const a = A(h); const x = X(h); return `
<h2>What the Allowance is for</h2>
<p>A pensioner on a low income often has a younger spouse who has no pension yet. Without help, the household would live on one OAS pension and one GIS for several years. The Allowance closes that gap from age ${h.num(x.fAllowAgeMin)}: it pays the younger partner an amount built like an OAS pension plus a GIS, until the age when OAS can be claimed. The maximum, about ${h.eur(a.max)} a month, is close to what a pensioner with no other income receives in OAS and GIS combined. Common-law partners are covered on the same terms as married spouses, and the deposit follows the ${h.a('benefit-payment-dates', 'federal benefit calendar')}, so it lands on the same day as the pensioner’s own OAS and GIS.</p>
<h2>The six conditions</h2>
<p>Service Canada lists them on its ${h.src(S('fAllowElig'), 'Allowance eligibility page')}. All must be met at once.</p>
<ul>
<li>You are ${h.num(x.fAllowAgeMin)} to ${h.num(x.fAllowAgeMax)} years old.</li>
<li>Your spouse or common-law partner receives the OAS pension and is eligible for the GIS.</li>
<li>You are a Canadian citizen or a legal resident.</li>
<li>You have lived in Canada for at least ${h.num(x.fResYears)} years since age 18.</li>
<li>Your combined annual income is under ${h.eur(a.thr)}.</li>
<li>Neither of you is currently under a sponsorship agreement.</li>
</ul>
<p>The income test uses the previous year’s income of both partners, OAS excluded, after each partner’s employment exemption explained in the ${h.a('gis-work-exemption', 'work exemption guide')}.</p>
<h2>How much, by combined income</h2>
${h.table(['Combined income', 'Allowance per month', 'Pensioner’s GIS', 'Allowance + GIS'], EX.map((i) => { const al = h.M.allowance(false, i).monthly, g = h.M.gis('spouse_allowance', i).monthly; return [h.eur(i), h.eur(al, 2), h.eur(g, 2), h.eur(al + g, 2)]; }), 'Allowance and GIS paid to the couple per month, October to December 2026, pensioner’s OAS excluded (model fitted to the ESDC grid)', ['r', 'r', 'r', 'r'])}
<p>As the table shows, the Allowance falls much faster than the GIS as income rises: the younger partner absorbs most of the effect while the pensioner’s GIS stays close to its ceiling of ${h.eur(h.P.gis.spouse_allowance.max, 2)}. The amounts between two published thresholds come from a model fitted to the ESDC grid, exact at the maximum and at the cut-offs, within about a dollar a month in between.</p>
<!--mini:allowanceSpouseCouple-->
<h2>A worked example</h2>
<p>Take a pensioner aged 68 with a CPP pension of ${h.eur(EXC)} a year and a wife of 61 with no income. Their combined income is ${h.eur(EXC)}. From October to December 2026, the model gives her an Allowance of ${h.eur(h.M.allowance(false, EXC).monthly, 2)} a month, while he receives ${h.eur(h.M.gis('spouse_allowance', EXC).monthly, 2)} of GIS on top of his OAS pension of ${h.eur(h.P.oas.max_65_74, 2)}. With his CPP, the household lives on about ${h.eur(h.M.allowance(false, EXC).monthly + h.M.gis('spouse_allowance', EXC).monthly + h.P.oas.max_65_74 + EXC / 12)} a month, of which only the CPP and OAS are taxable. Without the Allowance, she would bring nothing in until her own OAS at ${h.num(x.fGisAge)}, which is why the application is worth making as soon as the conditions are met. The figures come from the model, exact at the published maximum and thresholds.</p>
<h2>Four quarters in 2026</h2>
${h.table(['Quarter', 'Maximum per month', 'Combined income cut-off'], QS.map((q) => [q === '2026-01' ? 'January to March' : q === '2026-04' ? 'April to June' : q === '2026-07' ? 'July to September' : 'October to December', h.eur(a.quarters[q][0], 2), h.eur(a.quarters[q][1])]), 'Allowance amounts published by ESDC for each quarter of 2026', ['l', 'r', 'r'])}
<p>The amounts follow the cost of living each quarter, published in the ${h.src('oasQuarterly', 'ESDC quarterly table')}.</p>
<h2>Applying</h2>
<p>The Allowance must be claimed by the younger partner. Online, the application goes through My Service Canada Account, which is open to people living in Canada who have not already applied and whose account is not managed by a third party. On paper, Service Canada asks for form ISP3008, the income statement ISP3026 and the information sheet ISP3008A (${h.src(S('fAllowApply'), 'Service Canada, apply for the Allowance')}).</p>
<h2>While you receive it</h2>
<p>The benefit is tax-free, and it is reviewed each year from the federal tax return, which must be filed by April ${h.num(x.fFileByDay)}. Changes of address, income or marital status must be reported, and an absence from Canada of more than ${h.num(x.fAbroadMonths)} months stops payment (${h.src(S('fAllowReceive'), 'Service Canada, receiving the Allowance')}). If the partners live apart for reasons beyond their control, such as long-term care, the amount may be higher. If income falls during the year, an estimate of current income can be used instead of last year’s (${h.src(S('fAllowAmount'), 'Service Canada, Allowance amount')}).</p>
<h2>When the situation changes</h2>
<p>If the pensioner dies, Service Canada converts the Allowance automatically to the ${h.a('allowance-for-the-survivor', 'Allowance for the Survivor')} (${h.src(S('fAllowOverview'), 'Service Canada, Allowance')}). If the couple’s income rises, the amount is recalculated at the next yearly review, and payments stop once the cut-off is reached. Because the age condition ends at ${h.num(x.fAllowAgeMax)}, the Allowance is a bridge: from ${h.num(x.fGisAge)}, the younger partner turns to the ${h.a('old-age-security', 'OAS pension')} and the GIS, each with its own rules. The ${h.a('gis-couples', 'couples guide')} compares the household with and without the Allowance.</p>
`; },
  },
  fr: {
    slug: 'allocation-conjoint-pensionne',
    nav: 'Allocation (60 à 64 ans)',
    card: 'La prestation mensuelle du conjoint de 60 à 64 ans d’un pensionné du SRG : montant, seuil de revenu et conditions.',
    title: 'Allocation 2026 de 60 à 64 ans : jusqu’à 1 448 $ par mois',
    description: 'Allocation 2026 : jusqu’à 1 448,06 $ par mois pour le conjoint de 60 à 64 ans d’un pensionné du SRG, jusqu’à 42 768 $ de revenu combiné. Conditions, demande.',
    h1: 'L’Allocation pour le conjoint de 60 à 64 ans',
    intro: 'L’Allocation verse une prestation mensuelle non imposable au conjoint plus jeune d’un pensionné à faible revenu, avant qu’il puisse demander la Sécurité de la vieillesse.',
    resume: (h) => { const a = A(h); return `L’Allocation verse jusqu’à ${h.eur(a.max, 2)} par mois d’octobre à décembre 2026 à une personne de ${h.num(X(h).fAllowAgeMin)} à ${h.num(X(h).fAllowAgeMax)} ans dont l’époux ou le conjoint de fait reçoit la Sécurité de la vieillesse et a droit au Supplément de revenu garanti. Elle s’arrête quand le revenu annuel combiné du couple, hors SV et après l’exemption sur les gains de travail, atteint ${h.eur(a.thr)}. Ce maximum correspond à la pension complète de la SV, ${h.eur(h.P.oas.max_65_74, 2)}, plus le taux de couple du SRG, ${h.eur(h.P.gis.spouse_allowance.max, 2)} : le conjoint plus jeune reçoit donc à peu près ce que toucherait un pensionné de la SV et du SRG. Service Canada fixe les autres conditions sur sa page d’admissibilité : être citoyen canadien ou résident autorisé, avoir résidé au Canada au moins ${h.num(X(h).fResYears)} ans depuis l’âge de 18 ans, et n’avoir, ni l’un ni l’autre, d’entente de parrainage. La prestation n’est pas automatique : le conjoint la demande en ligne ou avec le formulaire ISP3008. Les versements sont non imposables, mais exigent une déclaration de revenus produite avant le ${h.num(X(h).fFileByDay)} avril de chaque année, et le montant de la lettre de Service Canada est celui qui est versé.`; },
    faqs: (h) => [
      { q: 'Qui a droit à l’Allocation entre 60 et 64 ans ?', a: `Une personne de ${h.num(X(h).fAllowAgeMin)} à ${h.num(X(h).fAllowAgeMax)} ans dont l’époux ou le conjoint de fait reçoit la SV et a droit au SRG, qui est citoyenne canadienne ou résidente autorisée, a résidé au Canada au moins ${h.num(X(h).fResYears)} ans depuis 18 ans, et dont le couple a un revenu combiné inférieur à ${h.eur(A(h).thr)}. Aucun des deux ne doit avoir d’entente de parrainage, selon la page d’admissibilité de Service Canada.` },
      { q: 'L’Allocation est-elle imposable ?', a: `Non. Service Canada précise qu’on ne paie pas d’impôt sur les versements de l’Allocation. Il faut quand même produire sa déclaration de revenus avant le ${h.num(X(h).fFileByDay)} avril de chaque année pour éviter une interruption, car la prestation est révisée chaque année à partir de la déclaration fédérale. Comme le calcul additionne les deux revenus, les deux déclarations comptent.` },
      { q: 'Puis-je toucher l’Allocation si mon mari reçoit la SV mais pas le SRG ?', a: `Seulement s’il a droit au SRG, ce qui fait partie des conditions. Dans cette situation, le SRG et l’Allocation partagent le même seuil de revenu combiné, ${h.eur(A(h).thr)} d’octobre à décembre 2026 : un couple sous ce seuil remplit donc en général les deux critères. Au-dessus, il ne reçoit ni l’un ni l’autre, et le conjoint plus jeune attend la SV à ${h.num(X(h).fGisAge)} ans.` },
      { q: 'Quels formulaires faut-il pour demander l’Allocation par la poste ?', a: 'Trois : la Demande d’Allocation ou d’Allocation au survivant (ISP3008), l’État des revenus pour le renouvellement du SRG, de l’Allocation ou de l’Allocation au survivant (ISP3026), et la fiche de renseignements ISP3008A. La demande en ligne dans Mon dossier Service Canada est possible si vous vivez au Canada, n’avez pas déjà présenté de demande et qu’aucun tiers ne gère votre dossier.' },
      { q: 'L’Allocation cesse-t-elle si nous passons l’hiver aux États-Unis ?', a: `Pas pour un séjour habituel de « snowbird ». Service Canada précise qu’on ne peut pas toucher l’Allocation en étant à l’extérieur du Canada pendant plus de ${h.num(X(h).fAbroadMonths)} mois, et demande d’être prévenu avant le départ pour éviter un trop-payé. Quelques mois d’hiver à l’étranger préservent la prestation ; une absence plus longue la suspend.` },
      { q: 'Notre revenu a baissé cette année : l’Allocation peut-elle en tenir compte ?', a: `C’est possible. L’Allocation repose normalement sur le revenu du couple de l’année précédente, mais la page de Service Canada sur le montant indique que si votre revenu de cette année est inférieur à celui de l’an dernier, vous pouvez communiquer avec lui pour que la prestation soit fixée sur une estimation de l’année en cours. C’est utile quand un conjoint vient de cesser de travailler ou a perdu une rente.` },
    ],
    body: (h) => { const a = A(h); const x = X(h); return `
<h2>À quoi sert l’Allocation</h2>
<p>Un pensionné à faible revenu a souvent un conjoint plus jeune, encore sans pension. Sans aide, le ménage vivrait plusieurs années sur une seule SV et un seul SRG. L’Allocation comble cet écart dès ${h.num(x.fAllowAgeMin)} ans : elle verse au conjoint plus jeune un montant construit comme une SV plus un SRG, jusqu’à l’âge où il pourra demander la SV. Le maximum, environ ${h.eur(a.max)} par mois, est proche de ce qu’un pensionné sans autre revenu reçoit en SV et en SRG réunis. Les conjoints de fait sont visés aux mêmes conditions que les époux, et le dépôt suit le ${h.a('benefit-payment-dates', 'calendrier fédéral des prestations')} : il arrive le même jour que la SV et le SRG du pensionné.</p>
<h2>Les six conditions</h2>
<p>Service Canada les énumère sur sa ${h.src(S('fAllowElig'), 'page d’admissibilité à l’Allocation')}. Elles doivent toutes être remplies en même temps.</p>
<ul>
<li>Vous avez entre ${h.num(x.fAllowAgeMin)} et ${h.num(x.fAllowAgeMax)} ans.</li>
<li>Votre époux ou conjoint de fait reçoit la pension de la SV et a droit au SRG.</li>
<li>Vous êtes citoyen canadien ou résident autorisé.</li>
<li>Vous avez résidé au Canada pendant au moins ${h.num(x.fResYears)} ans depuis l’âge de 18 ans.</li>
<li>Votre revenu annuel combiné est inférieur à ${h.eur(a.thr)}.</li>
<li>Ni l’un ni l’autre n’a actuellement d’entente de parrainage.</li>
</ul>
<p>Le critère de revenu porte sur le revenu de l’année précédente des deux conjoints, hors SV, après l’exemption sur les gains de travail de chacun, expliquée dans le ${h.a('gis-work-exemption', 'guide de l’exemption')}.</p>
<h2>Combien, selon le revenu combiné</h2>
${h.table(['Revenu combiné', 'Allocation par mois', 'SRG du pensionné', 'Allocation + SRG'], EX.map((i) => { const al = h.M.allowance(false, i).monthly, g = h.M.gis('spouse_allowance', i).monthly; return [h.eur(i), h.eur(al, 2), h.eur(g, 2), h.eur(al + g, 2)]; }), 'Allocation et SRG versés au couple par mois, octobre à décembre 2026, SV du pensionné exclue (modèle calé sur la grille d’EDSC)', ['r', 'r', 'r', 'r'])}
<p>Comme le montre le tableau, l’Allocation baisse bien plus vite que le SRG quand le revenu monte : le conjoint plus jeune absorbe l’essentiel de l’effet pendant que le SRG du pensionné reste près de son plafond de ${h.eur(h.P.gis.spouse_allowance.max, 2)}. Entre deux seuils publiés, les montants viennent d’un modèle calé sur la grille d’EDSC, exact au maximum et aux seuils, juste à environ un dollar par mois près entre les deux.</p>
<!--mini:allowanceSpouseCouple-->
<h2>Un exemple chiffré</h2>
<p>Prenons un pensionné de 68 ans qui touche une rente du RPC de ${h.eur(EXC)} par année, marié à une femme de 61 ans sans revenu. Leur revenu combiné est de ${h.eur(EXC)}. D’octobre à décembre 2026, le modèle lui accorde à elle une Allocation de ${h.eur(h.M.allowance(false, EXC).monthly, 2)} par mois, et à lui ${h.eur(h.M.gis('spouse_allowance', EXC).monthly, 2)} de SRG en plus de sa pension de la SV de ${h.eur(h.P.oas.max_65_74, 2)}. Avec son RPC, le ménage dispose d’environ ${h.eur(h.M.allowance(false, EXC).monthly + h.M.gis('spouse_allowance', EXC).monthly + h.P.oas.max_65_74 + EXC / 12)} par mois, dont seuls le RPC et la SV sont imposables. Sans l’Allocation, elle n’apporterait rien avant sa propre SV à ${h.num(x.fGisAge)} ans : d’où l’intérêt de présenter la demande dès que les conditions sont réunies.</p>
<h2>Les quatre trimestres de 2026</h2>
${h.table(['Trimestre', 'Maximum par mois', 'Seuil de revenu combiné'], QS.map((q) => [q === '2026-01' ? 'Janvier à mars' : q === '2026-04' ? 'Avril à juin' : q === '2026-07' ? 'Juillet à septembre' : 'Octobre à décembre', h.eur(a.quarters[q][0], 2), h.eur(a.quarters[q][1])]), 'Montants de l’Allocation publiés par EDSC pour chaque trimestre de 2026', ['l', 'r', 'r'])}
<p>Les montants suivent le coût de la vie chaque trimestre, selon le ${h.src('oasQuarterly', 'rapport trimestriel d’EDSC')}.</p>
<h2>Présenter la demande</h2>
<p>C’est le conjoint plus jeune qui demande l’Allocation. En ligne, la demande passe par Mon dossier Service Canada, ouvert aux personnes qui vivent au Canada, n’ont pas déjà présenté de demande et dont le dossier n’est pas géré par un tiers. Sur papier, Service Canada demande le formulaire ISP3008, l’état des revenus ISP3026 et la fiche ISP3008A (${h.src(S('fAllowApply'), 'Service Canada, demander l’Allocation')}).</p>
<h2>Pendant les versements</h2>
<p>La prestation est non imposable et révisée chaque année à partir de la déclaration de revenus fédérale, à produire avant le ${h.num(x.fFileByDay)} avril. Tout changement d’adresse, de revenu ou d’état matrimonial doit être signalé, et une absence du Canada de plus de ${h.num(x.fAbroadMonths)} mois interrompt le versement (${h.src(S('fAllowReceive'), 'Service Canada, recevoir l’Allocation')}). Si les conjoints vivent séparément pour des raisons indépendantes de leur volonté, comme des soins de longue durée, le montant peut être plus élevé. Si le revenu baisse en cours d’année, une estimation du revenu courant peut remplacer celui de l’an dernier (${h.src(S('fAllowAmount'), 'Service Canada, montant de l’Allocation')}).</p>
<h2>Quand la situation change</h2>
<p>Si le pensionné décède, Service Canada convertit automatiquement l’Allocation en ${h.a('allowance-for-the-survivor', 'Allocation au survivant')} (${h.src(S('fAllowOverview'), 'Service Canada, Allocation')}). Si le revenu du couple augmente, le montant est recalculé à la révision annuelle suivante, et les versements cessent une fois le seuil atteint. Comme la condition d’âge s’arrête à ${h.num(x.fAllowAgeMax)} ans, l’Allocation est un pont : à partir de ${h.num(x.fGisAge)} ans, le conjoint plus jeune se tourne vers la ${h.a('old-age-security', 'pension de la SV')} et le SRG, chacun avec ses propres règles. Le ${h.a('gis-couples', 'guide du SRG en couple')} compare le ménage avec et sans l’Allocation.</p>
`; },
  },
});
