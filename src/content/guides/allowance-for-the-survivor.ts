import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const A = (h: Helpers) => h.P.allowance;
const X = (h: Helpers) => h.P.x as Record<string, number>;
/** Revenus annuels d'exemple du survivant (hors SV, après exemption d'emploi). */
const EX = [0, 4000, 8000, 12000, 18000, 24000, 30000];
/** Exemple chiffré : rente de conjoint survivant du RPC et intérêts. */
const CPP_SURV = 6000, INTEREST = 1000;
const QS = ['2026-01', '2026-04', '2026-07', '2026-10'] as const;
const surv = (h: Helpers, i: number) => h.M.allowance(true, i).monthly;

export default defineGuide({
  id: 'allowance-for-the-survivor',
  group: 'oas',
  order: 90,
  mini: 'allowanceSurvivorAmount',
  miniHref: 'guaranteed-income-supplement',
  related: ['allowance-60-64', 'cpp-survivor-pension', 'gis-couples', 'guaranteed-income-supplement', 'cpp-death-benefit'],
  sources: [S('oasQuarterly'), S('fSurvElig'), S('fSurvReceive'), S('fSurvOverview'), S('fSurvAmount'), S('fAllowApply'), S('fAllowOverview')],
  en: {
    slug: 'allowance-for-the-survivor',
    nav: 'Allowance for the Survivor',
    card: 'The tax-free monthly benefit for a widowed person aged 60 to 64 on a low income: amount, cut-off and conditions.',
    title: 'Allowance for the Survivor 2026: Up to $1,726 a Month',
    description: 'Allowance for the Survivor 2026: up to $1,726.18 a month, tax-free, for a widowed person aged 60 to 64 whose income is under $31,152. Conditions and amounts.',
    h1: 'The Allowance for the Survivor',
    intro: 'A widow or widower aged 60 to 64 with a low income can receive a monthly federal benefit until the age of Old Age Security.',
    resume: (h) => { const a = A(h); return `The Allowance for the Survivor pays up to ${h.eur(a.survivor_max, 2)} a month from October to December 2026 to a person aged ${h.num(X(h).fAllowAgeMin)} to ${h.num(X(h).fAllowAgeMax)} whose spouse or common-law partner has died and who has not remarried or entered a new common-law relationship. It stops when the survivor’s own annual income, without OAS and after the employment exemption, reaches ${h.eur(a.survivor_thr)}. Service Canada also requires the survivor to live in Canada, to be a Canadian citizen or legal resident, to have lived in Canada for at least ${h.num(X(h).fResYears)} years since age 18 and not to be under a sponsorship agreement. The benefit is tax-free. Income from the previous year sets the amount, and a CPP survivor’s pension, a workplace pension or interest all count. The maximum is higher than the regular Allowance of ${h.eur(a.max, 2)}, because a survivor runs a household alone. Someone already on the Allowance when the spouse dies is moved to it automatically; anyone else applies online or with form ISP3008. Payments are reviewed every year from the tax return, and the amount on the Service Canada letter is the one paid.`; },
    faqs: (h) => [
      { q: 'Who can get the Allowance for the Survivor?', a: `A widowed person aged ${h.num(X(h).fAllowAgeMin)} to ${h.num(X(h).fAllowAgeMax)} who has not remarried or entered a new common-law relationship, lives in Canada, is a Canadian citizen or legal resident, has lived in Canada at least ${h.num(X(h).fResYears)} years since age 18, is not under a sponsorship agreement, and has annual income below ${h.eur(A(h).survivor_thr)}. Those are the conditions on Service Canada’s eligibility page for October to December 2026.` },
      { q: 'Does a CPP survivor’s pension reduce the Allowance for the Survivor?', a: `Yes. The CPP survivor’s pension is income, so it counts against the cut-off of ${h.eur(A(h).survivor_thr)} like any CPP benefit, workplace pension or interest. With ${h.eur(CPP_SURV)} of CPP survivor’s pension and ${h.eur(INTEREST)} of interest a year, the model gives ${h.eur(surv(h, CPP_SURV + INTEREST), 2)} a month instead of the maximum ${h.eur(A(h).survivor_max, 2)}. Only the first dollars of employment income are exempted.` },
      { q: 'Do I lose the Allowance for the Survivor if I move in with a new partner?', a: 'It can end. One of the conditions is that you have not remarried or entered into a new common-law relationship since your spouse died. Service Canada asks recipients to report any change in marital status as soon as possible, through My Service Canada Account or by contacting it, so that payments are reviewed before an overpayment builds up.' },
      { q: 'Is the Allowance for the Survivor taxable?', a: `No. Service Canada describes it as a monthly tax-free payment. The survivor must still file a tax return by April ${h.num(X(h).fFileByDay)} every year, because the benefit is reviewed each year from that return. Filing even with little income keeps the payments from being interrupted when the new benefit year begins.` },
      { q: 'My husband received the GIS and I had the Allowance: must I reapply after his death?', a: 'No. Service Canada states that a person receiving the Allowance whose spouse or common-law partner dies is automatically converted to the Allowance for the Survivor. You should still tell Service Canada about the death, and the CPP survivor’s pension and death benefit are separate applications to make on the Canada Pension Plan side.' },
      { q: 'How is the Allowance for the Survivor different from the regular Allowance?', a: `The regular Allowance goes to a spouse aged 60 to 64 whose partner is alive and receives OAS, with a combined income cut-off of ${h.eur(A(h).thr)} and a maximum of ${h.eur(A(h).max, 2)}. The survivor version looks only at the survivor’s own income, cut off at ${h.eur(A(h).survivor_thr)}, and pays more, up to ${h.eur(A(h).survivor_max, 2)} a month.` },
    ],
    body: (h) => { const a = A(h); const x = X(h); const ex = CPP_SURV + INTEREST; return `
<h2>A bridge to 65 for widowed people</h2>
<p>Losing a spouse between 60 and 64 often means losing half of the household’s income at an age when no OAS pension is paid yet. The Allowance for the Survivor fills part of that gap. It is paid by Service Canada with the OAS programs, on the same monthly calendar, and it stops at the end of the age window, when the survivor can turn to the ${h.a('old-age-security', 'OAS pension')} and the GIS under their own conditions. The amounts are set federally and are the same wherever the survivor lives in Canada.</p>
<h2>The conditions</h2>
<p>All of these must be met, according to the ${h.src(S('fSurvElig'), 'Service Canada eligibility page')}:</p>
<ul>
<li>your spouse or common-law partner has died and you have not remarried or entered a new common-law relationship;</li>
<li>you are ${h.num(x.fAllowAgeMin)} to ${h.num(x.fAllowAgeMax)} years old;</li>
<li>you live in Canada and are a Canadian citizen or legal resident;</li>
<li>you have lived in Canada for at least ${h.num(x.fResYears)} years since age 18;</li>
<li>you are not under a sponsorship agreement;</li>
<li>your annual income is under ${h.eur(a.survivor_thr)}.</li>
</ul>
<h2>Amount by income</h2>
${h.table(['Survivor’s yearly income', 'Allowance for the Survivor per month', 'Over twelve months'], EX.map((i) => [h.eur(i), h.eur(surv(h, i), 2), h.eur(surv(h, i) * 12)]), 'Allowance for the Survivor, October to December 2026 (model fitted to the ESDC grid)', ['r', 'r', 'r'])}
<p>The maximum of about ${h.eur(a.survivor_max)} a month is paid in full only at very low incomes; a top-up reserved for the lowest incomes ends at ${h.eur(a.survivor_topup_thr)}. Amounts between published thresholds come from a model fitted to the ${h.src('oasQuarterly', 'ESDC quarterly table')}, exact at the maximum and at the cut-offs and within about a dollar a month in between.</p>
<h2>A worked example</h2>
<p>A widow of 62 receives a CPP survivor’s pension of ${h.eur(CPP_SURV)} a year and ${h.eur(INTEREST)} of interest on savings. Her income for the test is ${h.eur(ex)}. The model gives an Allowance for the Survivor of ${h.eur(surv(h, ex), 2)} a month, or ${h.eur(surv(h, ex) * 12)} over a year, tax-free, which is ${h.pct(surv(h, ex) / a.survivor_max, 0)} of the maximum. If she took a part-time job paying ${h.eur(h.P.gis.work_exempt_full)}, that pay would be fully exempt and the Allowance would not change. The ${h.a('cpp-survivor-pension', 'CPP survivor’s pension guide')} explains how the CPP side is calculated.</p>
<!--mini:allowanceSurvivorAmount-->
<h2>The two Allowances side by side</h2>
${h.table(['', 'Allowance', 'Allowance for the Survivor'], [['Who', 'Spouse of a living OAS and GIS pensioner', 'Widowed person not in a new couple'], ['Income tested', 'Combined income of the couple', 'Survivor’s own income'], ['Income cut-off', h.eur(a.thr), h.eur(a.survivor_thr)], ['Top-up ends at', h.eur(a.topup_thr), h.eur(a.survivor_topup_thr)], ['Maximum per month', h.eur(a.max, 2), h.eur(a.survivor_max, 2)]], 'Allowance and Allowance for the Survivor, October to December 2026', ['l', 'l', 'l'])}
<p>The survivor version tests a single income against a lower cut-off, yet pays a higher maximum. In practice, a widowed person with a modest CPP survivor’s pension often keeps a sizeable benefit, while the same income inside a couple would be weighed against the couple grid. Over the full window from ${h.num(x.fAllowAgeMin)} to ${h.num(x.fAllowAgeMax)}, the benefit of the worked example would add up to about ${h.eur(surv(h, ex) * 12 * (x.fAllowAgeMax - x.fAllowAgeMin + 1))} at this quarter’s rates, before the indexation applied every quarter. That is why it pays to apply as soon as the conditions are met rather than waiting for OAS.</p>
<h2>The four quarters of 2026</h2>
${h.table(['Quarter', 'Maximum per month', 'Income cut-off'], QS.map((q) => [q === '2026-01' ? 'January to March' : q === '2026-04' ? 'April to June' : q === '2026-07' ? 'July to September' : 'October to December', h.eur(a.quarters[q][2], 2), h.eur(a.quarters[q][3])]), 'Allowance for the Survivor published by ESDC for each quarter of 2026', ['l', 'r', 'r'])}
<h2>Applying, or being switched over</h2>
<p>A survivor who was already receiving the Allowance does not apply again: Service Canada converts the file automatically (${h.src(S('fAllowOverview'), 'Service Canada, Allowance')}). Everyone else applies online through My Service Canada Account, or on paper with the same forms as the regular Allowance: ISP3008, the income statement ISP3026 and the information sheet ISP3008A (${h.src(S('fAllowApply'), 'Service Canada, apply')}). The amount rests on the previous year’s income (${h.src(S('fSurvAmount'), 'Service Canada, how much you could receive')}). Service Canada’s pages do not describe a separate recalculation in the year of the death, so ask it directly if your income has just fallen.</p>
<h2>While you receive it</h2>
<p>The benefit is tax-free (${h.src(S('fSurvOverview'), 'Service Canada, Allowance for the Survivor')}), reviewed each year from the tax return to be filed by April ${h.num(x.fFileByDay)}, and suspended after more than ${h.num(x.fAbroadMonths)} months outside Canada. Changes of address, income or marital status must be reported quickly (${h.src(S('fSurvReceive'), 'Service Canada, receiving the benefit')}). Keeping a dated note of each change makes any later review simpler. A widowed person who is too young for this benefit, or a younger partner whose spouse is still alive, should look instead at the ${h.a('allowance-60-64', 'regular Allowance')}.</p>
`; },
  },
  fr: {
    slug: 'allocation-au-survivant',
    nav: 'Allocation au survivant',
    card: 'La prestation mensuelle non imposable d’une personne veuve de 60 à 64 ans à faible revenu : montant, seuil et conditions.',
    title: 'Allocation au survivant 2026 : jusqu’à 1 726 $ par mois',
    description: 'Allocation au survivant 2026 : jusqu’à 1 726,18 $ par mois, non imposable, pour une personne veuve de 60 à 64 ans dont le revenu est inférieur à 31 152 $.',
    h1: 'L’Allocation au survivant',
    intro: 'Une personne veuve de 60 à 64 ans à faible revenu peut recevoir une prestation fédérale mensuelle jusqu’à l’âge de la Sécurité de la vieillesse.',
    resume: (h) => { const a = A(h); return `L’Allocation au survivant verse jusqu’à ${h.eur(a.survivor_max, 2)} par mois d’octobre à décembre 2026 à une personne de ${h.num(X(h).fAllowAgeMin)} à ${h.num(X(h).fAllowAgeMax)} ans dont l’époux ou le conjoint de fait est décédé et qui ne s’est pas remariée ni engagée dans une nouvelle union de fait. Elle s’arrête quand le revenu annuel du survivant lui-même, hors SV et après l’exemption sur les gains de travail, atteint ${h.eur(a.survivor_thr)}. Service Canada exige aussi de vivre au Canada, d’être citoyen canadien ou résident autorisé, d’y avoir résidé au moins ${h.num(X(h).fResYears)} ans depuis l’âge de 18 ans et de ne pas avoir d’entente de parrainage. La prestation n’est pas imposable. Le revenu de l’année précédente fixe le montant, et une rente de conjoint survivant du RPC ou du RRQ, une rente de retraite ou des intérêts comptent tous. Le maximum dépasse celui de l’Allocation ordinaire, ${h.eur(a.max, 2)}, puisque le survivant tient seul un ménage. La personne qui touchait déjà l’Allocation au décès du conjoint y passe automatiquement ; les autres présentent une demande en ligne ou avec le formulaire ISP3008. Les versements sont révisés chaque année à partir de la déclaration de revenus, et le montant de la lettre de Service Canada est celui qui est versé.`; },
    faqs: (h) => [
      { q: 'Qui peut recevoir l’Allocation au survivant ?', a: `Une personne veuve de ${h.num(X(h).fAllowAgeMin)} à ${h.num(X(h).fAllowAgeMax)} ans qui ne s’est pas remariée ni engagée dans une nouvelle union de fait, vit au Canada, est citoyenne canadienne ou résidente autorisée, y a résidé au moins ${h.num(X(h).fResYears)} ans depuis 18 ans, n’a pas d’entente de parrainage et a un revenu annuel inférieur à ${h.eur(A(h).survivor_thr)}. Ce sont les conditions de la page d’admissibilité de Service Canada pour octobre à décembre 2026.` },
      { q: 'La rente de conjoint survivant du RPC réduit-elle l’Allocation au survivant ?', a: `Oui. La rente de conjoint survivant est un revenu : elle compte contre le seuil de ${h.eur(A(h).survivor_thr)}, comme toute prestation du RPC ou du RRQ, une rente de retraite ou des intérêts. Avec ${h.eur(CPP_SURV)} de rente de survivant et ${h.eur(INTEREST)} d’intérêts par année, le modèle donne ${h.eur(surv(h, CPP_SURV + INTEREST), 2)} par mois au lieu du maximum de ${h.eur(A(h).survivor_max, 2)}. Seuls les premiers dollars de revenu d’emploi sont exemptés.` },
      { q: 'Est-ce que je perds l’Allocation au survivant si j’emménage avec un nouveau conjoint ?', a: 'Elle peut cesser. L’une des conditions est de ne pas s’être remarié ni engagé dans une nouvelle union de fait depuis le décès du conjoint. Service Canada demande de signaler tout changement d’état matrimonial dès que possible, dans Mon dossier Service Canada ou en communiquant avec lui, pour que les versements soient revus avant qu’un trop-payé ne s’accumule.' },
      { q: 'L’Allocation au survivant est-elle imposable ?', a: `Non. Service Canada la décrit comme un paiement mensuel non imposable. Le survivant doit quand même produire sa déclaration de revenus avant le ${h.num(X(h).fFileByDay)} avril de chaque année, puisque la prestation est révisée chaque année à partir de cette déclaration. Produire même avec peu de revenus évite une interruption au début de la nouvelle année de prestations.` },
      { q: 'Mon mari touchait le SRG et moi l’Allocation : dois-je refaire une demande après son décès ?', a: 'Non. Service Canada précise que la personne qui reçoit l’Allocation et dont l’époux ou le conjoint de fait décède passe automatiquement à l’Allocation au survivant. Il faut quand même informer Service Canada du décès, et la rente de conjoint survivant et la prestation de décès du RPC font l’objet de demandes distinctes du côté du Régime de pensions du Canada.' },
      { q: 'En quoi l’Allocation au survivant diffère-t-elle de l’Allocation ordinaire ?', a: `L’Allocation ordinaire va au conjoint de 60 à 64 ans d’un pensionné vivant qui reçoit la SV, avec un seuil de revenu combiné de ${h.eur(A(h).thr)} et un maximum de ${h.eur(A(h).max, 2)}. La version pour survivant ne regarde que le revenu du survivant, avec un seuil de ${h.eur(A(h).survivor_thr)}, et verse davantage, jusqu’à ${h.eur(A(h).survivor_max, 2)} par mois.` },
    ],
    body: (h) => { const a = A(h); const x = X(h); const ex = CPP_SURV + INTEREST; return `
<h2>Un pont jusqu’à 65 ans pour les personnes veuves</h2>
<p>Perdre son conjoint entre 60 et 64 ans signifie souvent perdre la moitié du revenu du ménage, à un âge où aucune pension de la SV n’est encore versée. L’Allocation au survivant comble une partie de ce manque. Service Canada la verse avec les prestations de la SV, selon le même calendrier mensuel, et elle s’arrête à la fin de la tranche d’âge, quand le survivant peut se tourner vers la ${h.a('old-age-security', 'pension de la SV')} et le SRG, selon leurs propres conditions.</p>
<h2>Les conditions</h2>
<p>Toutes doivent être remplies, selon la ${h.src(S('fSurvElig'), 'page d’admissibilité de Service Canada')} :</p>
<ul>
<li>votre époux ou conjoint de fait est décédé et vous ne vous êtes pas remarié ni engagé dans une nouvelle union de fait;</li>
<li>vous avez entre ${h.num(x.fAllowAgeMin)} et ${h.num(x.fAllowAgeMax)} ans;</li>
<li>vous vivez au Canada et êtes citoyen canadien ou résident autorisé;</li>
<li>vous avez résidé au Canada pendant au moins ${h.num(x.fResYears)} ans depuis l’âge de 18 ans;</li>
<li>vous n’avez pas d’entente de parrainage;</li>
<li>votre revenu annuel est inférieur à ${h.eur(a.survivor_thr)}.</li>
</ul>
<h2>Le montant selon le revenu</h2>
${h.table(['Revenu annuel du survivant', 'Allocation au survivant par mois', 'Sur douze mois'], EX.map((i) => [h.eur(i), h.eur(surv(h, i), 2), h.eur(surv(h, i) * 12)]), 'Allocation au survivant, octobre à décembre 2026 (modèle calé sur la grille d’EDSC)', ['r', 'r', 'r'])}
<p>Le maximum, environ ${h.eur(a.survivor_max)} par mois, n’est versé en entier qu’aux revenus très faibles ; un complément réservé aux plus bas revenus s’arrête à ${h.eur(a.survivor_topup_thr)}. Entre deux seuils publiés, les montants viennent d’un modèle calé sur le ${h.src('oasQuarterly', 'rapport trimestriel d’EDSC')}, exact au maximum et aux seuils, et juste à environ un dollar par mois près entre les deux.</p>
<h2>Un exemple chiffré</h2>
<p>Une veuve de 62 ans touche une rente de conjoint survivant du RPC de ${h.eur(CPP_SURV)} par année et ${h.eur(INTEREST)} d’intérêts sur ses économies. Son revenu pour le calcul est de ${h.eur(ex)}. Le modèle donne une Allocation au survivant de ${h.eur(surv(h, ex), 2)} par mois, soit ${h.eur(surv(h, ex) * 12)} sur une année, non imposables, ou ${h.pct(surv(h, ex) / a.survivor_max, 0)} du maximum. Si elle prenait un emploi à temps partiel payé ${h.eur(h.P.gis.work_exempt_full)}, ce salaire serait entièrement exempté et l’Allocation ne changerait pas. Le ${h.a('cpp-survivor-pension', 'guide de la pension de survivant du RPC')} explique le calcul du côté du RPC.</p>
<!--mini:allowanceSurvivorAmount-->
<h2>Les deux Allocations côte à côte</h2>
${h.table(['', 'Allocation', 'Allocation au survivant'], [['Pour qui', 'Conjoint d’un pensionné vivant de la SV et du SRG', 'Personne veuve sans nouvelle union'], ['Revenu examiné', 'Revenu combiné du couple', 'Revenu du survivant seul'], ['Seuil de revenu', h.eur(a.thr), h.eur(a.survivor_thr)], ['Fin du complément', h.eur(a.topup_thr), h.eur(a.survivor_topup_thr)], ['Maximum par mois', h.eur(a.max, 2), h.eur(a.survivor_max, 2)]], 'Allocation et Allocation au survivant, octobre à décembre 2026', ['l', 'l', 'l'])}
<p>La version pour survivant examine un seul revenu, avec un seuil plus bas, mais verse un maximum plus élevé. En pratique, une personne veuve qui touche une modeste rente de survivant du RPC garde souvent une prestation appréciable, alors que le même revenu au sein d’un couple serait mesuré sur la grille des couples. Sur toute la période de ${h.num(x.fAllowAgeMin)} à ${h.num(x.fAllowAgeMax)} ans, la prestation de l’exemple atteindrait environ ${h.eur(surv(h, ex) * 12 * (x.fAllowAgeMax - x.fAllowAgeMin + 1))} aux taux de ce trimestre, avant l’indexation appliquée chaque trimestre. D’où l’intérêt de présenter la demande dès que les conditions sont réunies, sans attendre la SV.</p>
<h2>Les quatre trimestres de 2026</h2>
${h.table(['Trimestre', 'Maximum par mois', 'Seuil de revenu'], QS.map((q) => [q === '2026-01' ? 'Janvier à mars' : q === '2026-04' ? 'Avril à juin' : q === '2026-07' ? 'Juillet à septembre' : 'Octobre à décembre', h.eur(a.quarters[q][2], 2), h.eur(a.quarters[q][3])]), 'Allocation au survivant publiée par EDSC pour chaque trimestre de 2026', ['l', 'r', 'r'])}
<h2>Demander, ou être transféré</h2>
<p>Le survivant qui recevait déjà l’Allocation n’a pas à refaire de demande : Service Canada convertit le dossier automatiquement (${h.src(S('fAllowOverview'), 'Service Canada, Allocation')}). Les autres présentent leur demande en ligne dans Mon dossier Service Canada, ou sur papier avec les mêmes formulaires que l’Allocation ordinaire : ISP3008, l’état des revenus ISP3026 et la fiche ISP3008A (${h.src(S('fAllowApply'), 'Service Canada, demande')}). Le montant repose sur le revenu de l’année précédente (${h.src(S('fSurvAmount'), 'Service Canada, combien pourriez-vous recevoir')}). Les pages de Service Canada ne décrivent pas de recalcul particulier l’année du décès : si votre revenu vient de baisser, posez-lui directement la question.</p>
<h2>Pendant les versements</h2>
<p>La prestation n’est pas imposable (${h.src(S('fSurvOverview'), 'Service Canada, Allocation au survivant')}), elle est révisée chaque année à partir de la déclaration de revenus à produire avant le ${h.num(x.fFileByDay)} avril, et suspendue après plus de ${h.num(x.fAbroadMonths)} mois hors du Canada. Tout changement d’adresse, de revenu ou d’état matrimonial doit être signalé rapidement (${h.src(S('fSurvReceive'), 'Service Canada, recevoir votre prestation')}). Une personne veuve trop jeune pour cette prestation, ou un conjoint plus jeune dont le pensionné est vivant, regardera plutôt l’${h.a('allowance-60-64', 'Allocation ordinaire')}.</p>
`; },
  },
});
