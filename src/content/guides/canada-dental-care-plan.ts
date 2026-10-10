import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const BILL = 1200;
const INC = [45000, 69999, 70000, 79999, 80000, 89999, 90000];
const bands = (h: Helpers) => h.P.dental.bands as [number, number][];
/** Part du patient sur une facture aux tarifs du RCSD (facture entière si non admissible). */
const yours = (h: Helpers, afni: number, fee: number) => { const d = h.M.dental(afni); return d.eligible ? fee * d.copay : fee; };

export default defineGuide({
  id: 'canada-dental-care-plan',
  group: 'credits',
  order: 60,
  mini: 'dentalCopayShare',
  miniHref: 'gst-credit-calculator',
  related: ['gst-credit-calculator', 'canada-child-benefit', 'canada-disability-benefit', 'canada-workers-benefit', 'old-age-security'],
  sources: ['dentalQualify', 'dentalCoverage', S('bDentalApply')],
  en: {
    slug: 'canada-dental-care-plan',
    nav: 'Canadian Dental Care Plan',
    card: 'Who qualifies for the CDCP under $90,000 of family income, and the 0%, 40% or 60% co-payment.',
    title: 'Canada Dental Benefit 2026: CDCP Income Limit and Co-Pay',
    description: 'Canada dental benefit 2026: the CDCP covers families under $90,000 of adjusted net income, with a co-payment of 0%, 40% or 60% of CDCP fees depending on income.',
    h1: 'The Canadian Dental Care Plan',
    intro: 'The Canadian Dental Care Plan pays part or all of the cost of oral health care for residents who have no access to dental insurance and a family income under the federal limit.',
    resume: (h) => { const b = bands(h); return `For the 2026-2027 benefit period, the Canadian Dental Care Plan, often searched as the Canada dental benefit, is open to residents whose adjusted family net income is under ${h.eur(h.P.dental.income_limit)}, who have no access to private dental insurance, who filed a tax return in Canada and who are residents of Canada for tax purposes. The share you pay depends on that income. Under ${h.eur(b[0][0])}, the plan covers all eligible costs at CDCP fees and the co-payment is ${h.pct(b[0][1], 0)}. From ${h.eur(b[0][0])} to ${h.eur(b[1][0] - 1)}, the plan pays ${h.pct(1 - b[1][1], 0)} and you pay ${h.pct(b[1][1], 0)}. From ${h.eur(b[1][0])} to ${h.eur(b[2][0] - 1)}, the plan pays ${h.pct(1 - b[2][1], 0)} and you pay ${h.pct(b[2][1], 0)}. At ${h.eur(h.P.dental.income_limit)} or more, the plan does not apply. On a ${h.eur(BILL)} treatment billed at CDCP fees, that means ${h.eur(yours(h, 60000, BILL))}, ${h.eur(yours(h, 75000, BILL))} or ${h.eur(yours(h, 85000, BILL))} out of pocket. You pay the co-payment directly to the dentist or other oral health provider, plus any amount the provider charges above the CDCP fee. Coverage through a provincial, territorial or federal social program does not, by itself, rule you out. Applications are open for the 2026-2027 period.`; },
    faqs: (h) => [
      { q: 'Does provincial dental coverage disqualify me from the CDCP?', a: `No. The federal page says that if you get dental coverage through a provincial, territorial or federal government social program, you could still qualify. What rules you out is access to dental insurance through your job or pension, a family member’s job or pension, a professional or student organization, or a plan you bought yourself. The income limit of ${h.eur(h.P.dental.income_limit)} still applies.` },
      { q: `What happens to my CDCP co-pay at ${h.eur(bands(h)[0][0])} of family income?`, a: `It jumps from ${h.pct(bands(h)[0][1], 0)} to ${h.pct(bands(h)[1][1], 0)} of CDCP fees. The bands are steps, not a gradual slope: a family at ${h.eur(69999)} pays nothing on covered care, while one at ${h.eur(70000)} pays ${h.pct(bands(h)[1][1], 0)}. On a ${h.eur(BILL)} treatment, that one dollar of income moves the bill from ${h.eur(yours(h, 69999, BILL))} to ${h.eur(yours(h, 70000, BILL))}.` },
      { q: 'Must my spouse file a tax return for me to get the dental plan?', a: `Yes. Eligibility rests on adjusted family net income, so the federal page requires you and your spouse or common-law partner, if you have one, to file tax returns in Canada. Without both returns, the family figure cannot be assessed against the ${h.eur(h.P.dental.income_limit)} limit and the ${h.eur(bands(h)[0][0])} and ${h.eur(bands(h)[1][0])} co-payment bands, even if your own income is low.` },
      { q: 'Can my dentist charge more than the CDCP co-payment?', a: 'Yes, in two cases set out on the coverage page. A provider whose fee is higher than what the CDCP reimburses can bill you the difference, on top of your co-payment, and services the plan does not cover are yours to pay. Asking the office before treatment whether it bills at CDCP fees avoids most surprises.' },
      { q: 'Is there an age limit for the Canadian Dental Care Plan?', a: `The qualification page lists no age condition for 2026-2027: a child, a working-age adult and a senior are all assessed on the same four requirements, including the ${h.eur(h.P.dental.income_limit)} family income limit and the absence of access to private dental insurance. What changes from one person to another is mostly that last point, since many workers have a plan through their job.` },
      { q: 'Which dental treatments need preauthorization under the CDCP?', a: `The coverage page names crowns, dentures, certain gum treatments and deep sedation among the services that require approval before the work is done. Routine diagnostic, preventive and basic restorative care does not. Your co-payment rate, ${h.pct(bands(h)[0][1], 0)}, ${h.pct(bands(h)[1][1], 0)} or ${h.pct(bands(h)[2][1], 0)} depending on income, applies the same way to preauthorized services once they are approved.` },
    ],
    body: (h) => {
      const b = bands(h);
      const rows = INC.map((x) => { const d = h.M.dental(x); return [h.eur(x), d.eligible ? h.pct(1 - d.copay, 0) : '–', d.eligible ? h.pct(d.copay, 0) : h.pct(1, 0), h.eur(yours(h, x, BILL))]; });
      return `
<h2>The four conditions</h2>
<p>The ${h.src('dentalQualify', 'federal qualification page')} lists four requirements, and an applicant must meet all of them:</p>
<ol>
<li>no access to private dental insurance or coverage;</li>
<li>a tax return filed in Canada, by you and by your spouse or common-law partner if you have one;</li>
<li>an adjusted family net income under ${h.eur(h.P.dental.income_limit)};</li>
<li>residence in Canada for tax purposes.</li>
</ol>
<p>The page does not set an age condition. Children, working-age adults and seniors are assessed on the same four points.</p>
<h2>What “access to insurance” means</h2>
<p>The first condition is the one that excludes most people with jobs. You are considered to have access to dental coverage if it is available through your employer or pension plan, through a family member’s employer or pension plan, through a professional or student organization, or through a plan you purchased. The word used is access, so it is worth checking whether such a plan is available to you or your family before applying.</p>
<p>Government programs are treated differently. Dental coverage through a provincial, territorial or federal government social program does not on its own disqualify you. Someone receiving that kind of coverage can still qualify for the CDCP if the other three conditions are met.</p>
<h2>The income limit and the three bands</h2>
<p>Income is measured as adjusted family net income, a family figure drawn from your return and your spouse’s. Because it is net income, deductions such as RRSP contributions lower it. The plan uses three bands, set out on the ${h.src('dentalCoverage', 'coverage page')}:</p>
${h.table(['Adjusted family net income', 'CDCP pays', 'You pay', `Your share of a ${h.eur(BILL)} treatment`], rows, 'Canadian Dental Care Plan co-payment by income, 2026-2027 benefit period (Government of Canada)', ['r', 'r', 'r', 'r'])}
<p>The bands are steps. A family just under ${h.eur(b[0][0])} pays nothing on covered services at CDCP fees, and the same family with one more dollar of income pays ${h.pct(b[1][1], 0)}. The second step, at ${h.eur(b[1][0])}, raises the share to ${h.pct(b[2][1], 0)}. At ${h.eur(h.P.dental.income_limit)}, the plan stops entirely. For a family near one of these lines and planning major work, the difference is real: on a ${h.eur(BILL)} treatment, the move from the first band to the second costs ${h.eur(yours(h, b[0][0], BILL) - yours(h, b[0][0] - 1, BILL))}.</p>
<h2>What the co-payment is, and what it is not</h2>
<p>The coverage page defines the co-payment as the percentage of CDCP fees that the plan does not cover, which you pay directly to the oral health provider. Two details follow. First, the percentage applies to the CDCP fee for the service, the amount set in the plan’s grid, not to whatever the office charges. Second, the co-payment is not the whole of what you may pay.</p>
<p>A provider can charge more than the CDCP fee. In that case you owe the co-payment plus the gap between the provider’s price and what the plan reimburses. You also pay for services the plan does not cover. A family in the first band can therefore receive a bill, even with a ${h.pct(b[0][1], 0)} co-payment, if the office bills above the plan’s fees. Asking for an estimate that separates the CDCP portion from any extra is the simplest protection.</p>
<!--mini:dentalCopayShare-->
<h2>Which services are covered</h2>
<p>The plan groups covered care in four families of services: diagnostic and preventive services; basic restorative, endodontic and periodontal services; major restorative, removable prosthodontic and oral surgery services; and anesthesia and sedation. Some services need preauthorization, which means the provider asks the plan for approval before doing the work. The coverage page names crowns, dentures, certain gum treatments and deep sedation in that group. Asking the office whether the request has been approved before the appointment is the patient’s best check.</p>
<h2>Applying for 2026-2027</h2>
<p>The ${h.src(S('bDentalApply'), 'federal application page')} states that applications are open for the 2026-2027 benefit period. Before applying, check the four conditions, especially access to insurance through a job held by you or a family member, and make sure both returns have been filed.</p>
<h2>How the plan sits next to other benefits</h2>
<p>The CDCP is not paid in cash, unlike most programs on this site. It works on the same income logic, though, and families who qualify often also receive the ${h.a('canada-child-benefit', 'Canada child benefit')} and the Groceries and Essentials Benefit, which the ${h.a('gst-credit-calculator', 'GST credit calculator')} estimates. Adults with a disability may also look at the ${h.a('canada-disability-benefit', 'Canada Disability Benefit')}, and low-income workers at the ${h.a('canada-workers-benefit', 'Canada workers benefit')}. Seniors who get ${h.a('old-age-security', 'Old Age Security')} and have no dental plan from a former employer are assessed on the same four conditions.</p>
<p>These rules come from the federal CDCP pages as modified in August and September 2026. The plan’s own decision letter gives your eligibility and co-payment band.</p>
`; },
  },
  fr: {
    slug: 'regime-canadien-soins-dentaires',
    nav: 'Régime canadien de soins dentaires',
    card: 'Qui a droit au RCSD sous 90 000 $ de revenu familial, et la quote-part de 0 %, 40 % ou 60 %.',
    title: 'Régime canadien de soins dentaires 2026 : seuil, quote-part',
    description: 'Régime canadien de soins dentaires 2026 : couverture des familles sous 90 000 $ de revenu net rajusté, quote-part de 0 %, 40 % ou 60 % selon le revenu.',
    h1: 'Le Régime canadien de soins dentaires',
    intro: 'Le Régime canadien de soins dentaires paie une partie ou la totalité des soins buccodentaires des résidents qui n’ont pas accès à une assurance dentaire et dont le revenu familial est sous le plafond fédéral.',
    resume: (h) => { const b = bands(h); return `Pour la période de prestations 2026-2027, le Régime canadien de soins dentaires est ouvert aux résidents dont le revenu familial net rajusté est inférieur à ${h.eur(h.P.dental.income_limit)}, qui n’ont pas accès à une assurance dentaire privée, qui ont produit une déclaration de revenus au Canada et qui résident au Canada aux fins de l’impôt. La part que vous payez dépend de ce revenu. Sous ${h.eur(b[0][0])}, le régime couvre la totalité des frais admissibles aux tarifs du RCSD et la quote-part est de ${h.pct(b[0][1], 0)}. De ${h.eur(b[0][0])} à ${h.eur(b[1][0] - 1)}, le régime paie ${h.pct(1 - b[1][1], 0)} et vous payez ${h.pct(b[1][1], 0)}. De ${h.eur(b[1][0])} à ${h.eur(b[2][0] - 1)}, le régime paie ${h.pct(1 - b[2][1], 0)} et vous payez ${h.pct(b[2][1], 0)}. À ${h.eur(h.P.dental.income_limit)} ou plus, le régime ne s’applique pas. Sur un traitement de ${h.eur(BILL)} facturé aux tarifs du RCSD, cela donne ${h.eur(yours(h, 60000, BILL))}, ${h.eur(yours(h, 75000, BILL))} ou ${h.eur(yours(h, 85000, BILL))} à débourser. La quote-part se paie directement au dentiste ou à l’autre fournisseur de soins buccodentaires, en plus de tout montant facturé au-delà du tarif du RCSD. Une couverture par un programme social provincial, territorial ou fédéral n’exclut pas à elle seule. Les demandes sont ouvertes pour la période 2026-2027.`; },
    faqs: (h) => [
      { q: 'Une couverture dentaire provinciale m’empêche-t-elle d’adhérer au RCSD ?', a: `Non. La page fédérale indique que si vous recevez une couverture dentaire par un programme social d’un gouvernement provincial, territorial ou fédéral, vous pourriez quand même être admissible. Ce qui exclut, c’est l’accès à une assurance dentaire par votre emploi ou votre régime de retraite, par l’emploi ou le régime d’un membre de la famille, par une association professionnelle ou étudiante, ou par un régime acheté vous-même. Le plafond de ${h.eur(h.P.dental.income_limit)} s’applique toujours.` },
      { q: `Que devient ma quote-part au RCSD à ${h.eur(bands(h)[0][0])} de revenu familial ?`, a: `Elle passe de ${h.pct(bands(h)[0][1], 0)} à ${h.pct(bands(h)[1][1], 0)} des tarifs du RCSD. Les tranches sont des marches, pas une pente : une famille à ${h.eur(69999)} ne paie rien sur les soins couverts, alors qu’une famille à ${h.eur(70000)} paie ${h.pct(bands(h)[1][1], 0)}. Sur un traitement de ${h.eur(BILL)}, ce dollar de revenu fait passer la facture de ${h.eur(yours(h, 69999, BILL))} à ${h.eur(yours(h, 70000, BILL))}.` },
      { q: 'Mon conjoint doit-il produire sa déclaration pour que j’aie droit au régime dentaire ?', a: `Oui. L’admissibilité repose sur le revenu familial net rajusté : la page fédérale exige donc que vous et votre conjoint, marié ou de fait, le cas échéant, produisiez une déclaration au Canada. Sans les deux déclarations, le chiffre familial ne peut pas être comparé au plafond de ${h.eur(h.P.dental.income_limit)} ni aux tranches de ${h.eur(bands(h)[0][0])} et ${h.eur(bands(h)[1][0])}, même si votre propre revenu est faible.` },
      { q: 'Mon dentiste peut-il facturer plus que la quote-part du RCSD ?', a: 'Oui, dans deux cas prévus par la page sur la couverture. Un fournisseur dont le prix dépasse ce que le RCSD rembourse peut vous facturer la différence, en plus de votre quote-part, et les services que le régime ne couvre pas restent à votre charge. Demander au cabinet, avant le traitement, s’il facture aux tarifs du RCSD évite la plupart des mauvaises surprises.' },
      { q: 'Le Régime canadien de soins dentaires a-t-il une limite d’âge ?', a: `La page d’admissibilité ne prévoit aucune condition d’âge pour 2026-2027 : un enfant, un adulte en âge de travailler et un aîné sont évalués sur les mêmes quatre exigences, dont le plafond de revenu familial de ${h.eur(h.P.dental.income_limit)} et l’absence d’accès à une assurance dentaire privée. Ce qui varie d’une personne à l’autre tient surtout à ce dernier point, car bien des salariés ont un régime au travail.` },
      { q: 'Quels soins dentaires exigent une autorisation préalable au RCSD ?', a: `La page sur la couverture cite les couronnes, les prothèses dentaires, certains traitements des gencives et la sédation profonde parmi les services qui doivent être approuvés avant les travaux. Les soins diagnostiques, préventifs et de restauration de base n’en ont pas besoin. Votre taux de quote-part, ${h.pct(bands(h)[0][1], 0)}, ${h.pct(bands(h)[1][1], 0)} ou ${h.pct(bands(h)[2][1], 0)} selon le revenu, s’applique de la même façon aux services autorisés.` },
    ],
    body: (h) => {
      const b = bands(h);
      const rows = INC.map((x) => { const d = h.M.dental(x); return [h.eur(x), d.eligible ? h.pct(1 - d.copay, 0) : '–', d.eligible ? h.pct(d.copay, 0) : h.pct(1, 0), h.eur(yours(h, x, BILL))]; });
      return `
<h2>Les quatre conditions</h2>
<p>La ${h.src('dentalQualify', 'page fédérale sur l’admissibilité')} pose quatre exigences, toutes obligatoires :</p>
<ol>
<li>ne pas avoir accès à une assurance ou à une couverture dentaire privée ;</li>
<li>avoir produit une déclaration de revenus au Canada, vous et votre conjoint marié ou de fait le cas échéant ;</li>
<li>avoir un revenu familial net rajusté inférieur à ${h.eur(h.P.dental.income_limit)} ;</li>
<li>résider au Canada aux fins de l’impôt.</li>
</ol>
<p>La page ne fixe aucune condition d’âge. Enfants, adultes en âge de travailler et aînés sont évalués sur les mêmes quatre points.</p>
<h2>Ce que veut dire « avoir accès à une assurance »</h2>
<p>La première condition est celle qui écarte la plupart des salariés. Vous êtes réputé avoir accès à une couverture dentaire si elle vous est offerte par votre employeur ou votre régime de retraite, par l’employeur ou le régime de retraite d’un membre de la famille, par une association professionnelle ou étudiante, ou par un régime que vous avez acheté. Le mot employé est « accès » : mieux vaut vérifier si un tel régime vous est offert, à vous ou à votre famille, avant de présenter une demande.</p>
<p>Les programmes gouvernementaux sont traités autrement. Une couverture dentaire reçue dans le cadre d’un programme social d’un gouvernement provincial, territorial ou fédéral n’exclut pas à elle seule. Une personne qui en bénéficie peut quand même adhérer au RCSD si elle remplit les trois autres conditions.</p>
<h2>Le plafond de revenu et les trois tranches</h2>
<p>Le revenu se mesure par le revenu familial net rajusté, un chiffre familial tiré de votre déclaration et de celle de votre conjoint. Comme il s’agit d’un revenu net, des déductions comme les cotisations à un REER le font baisser. Le régime prévoit trois tranches, détaillées sur la ${h.src('dentalCoverage', 'page sur la couverture')} :</p>
${h.table(['Revenu familial net rajusté', 'Le RCSD paie', 'Vous payez', `Votre part d’un traitement de ${h.eur(BILL)}`], rows, 'Quote-part du Régime canadien de soins dentaires selon le revenu, période 2026-2027 (gouvernement du Canada)', ['r', 'r', 'r', 'r'])}
<p>Les tranches sont des marches. Une famille juste sous ${h.eur(b[0][0])} ne paie rien sur les services couverts aux tarifs du RCSD, et la même famille avec un dollar de revenu de plus paie ${h.pct(b[1][1], 0)}. La deuxième marche, à ${h.eur(b[1][0])}, fait monter la part à ${h.pct(b[2][1], 0)}. À ${h.eur(h.P.dental.income_limit)}, le régime cesse complètement. Pour une famille proche d’un de ces seuils qui prévoit de gros travaux, l’écart est réel : sur un traitement de ${h.eur(BILL)}, passer de la première à la deuxième tranche coûte ${h.eur(yours(h, b[0][0], BILL) - yours(h, b[0][0] - 1, BILL))}.</p>
<h2>Ce qu’est la quote-part, et ce qu’elle n’est pas</h2>
<p>La page sur la couverture définit la quote-part comme le pourcentage des tarifs du RCSD que le régime ne couvre pas et que vous payez directement au fournisseur de soins buccodentaires. Deux précisions en découlent. D’abord, le pourcentage s’applique au tarif du RCSD pour le service, le montant fixé dans la grille du régime, et non au prix demandé par le cabinet. Ensuite, la quote-part n’est pas forcément tout ce que vous paierez.</p>
<p>Un fournisseur peut facturer plus que le tarif du RCSD. Vous devez alors la quote-part plus l’écart entre son prix et ce que le régime rembourse. Vous payez aussi les services que le régime ne couvre pas. Une famille de la première tranche peut donc recevoir une facture, même avec une quote-part de ${h.pct(b[0][1], 0)}, si le cabinet facture au-delà des tarifs du régime. Demander une estimation qui sépare la part du RCSD du supplément éventuel reste la protection la plus simple.</p>
<!--mini:dentalCopayShare-->
<h2>Les services couverts</h2>
<p>Le régime regroupe les soins couverts en quatre familles : services diagnostiques et préventifs ; services de restauration de base, d’endodontie et de parodontie ; services de restauration majeure, de prothèses amovibles et de chirurgie buccale ; anesthésie et sédation. Certains services exigent une autorisation préalable : le fournisseur demande l’accord du régime avant de commencer. La page sur la couverture y range les couronnes, les prothèses dentaires, certains traitements des gencives et la sédation profonde. Demander au cabinet si l’accord a été reçu avant le rendez-vous reste la meilleure vérification pour le patient.</p>
<h2>Faire la demande pour 2026-2027</h2>
<p>La ${h.src(S('bDentalApply'), 'page fédérale de demande')} indique que les demandes sont ouvertes pour la période de prestations 2026-2027. Avant de la remplir, vérifiez les quatre conditions, surtout l’accès à une assurance par un emploi occupé par vous ou un membre de la famille, et assurez-vous que les deux déclarations ont été produites.</p>
<h2>Le régime à côté des autres prestations</h2>
<p>Contrairement à la plupart des programmes de ce site, le RCSD ne verse pas d’argent. Il suit pourtant la même logique de revenu, et les familles admises reçoivent souvent aussi l’${h.a('canada-child-benefit', 'allocation canadienne pour enfants')} et l’allocation pour l’épicerie et les besoins essentiels, que le ${h.a('gst-credit-calculator', 'calcul du crédit TPS')} estime. Les adultes handicapés peuvent regarder la ${h.a('canada-disability-benefit', 'Prestation canadienne pour les personnes en situation de handicap')}, et les travailleurs à faible revenu l’${h.a('canada-workers-benefit', 'allocation canadienne pour les travailleurs')}. Les aînés qui reçoivent la ${h.a('old-age-security', 'pension de la Sécurité de la vieillesse')} sans régime dentaire d’un ancien employeur sont évalués sur les mêmes quatre conditions.</p>
<p>Ces règles viennent des pages fédérales du RCSD modifiées en août et en septembre 2026. La lettre de décision du régime fait foi de votre admissibilité et de votre tranche de quote-part.</p>
`; },
  },
});
