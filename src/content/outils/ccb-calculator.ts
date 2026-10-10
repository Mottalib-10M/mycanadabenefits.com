import { defineGuide, type Helpers } from '../../lib/guide-types';

const INC = [35000, 60000, 90000, 130000];
/** Cas types de l'outil : n enfants, le plus jeune de moins de 6 ans, les autres de 6 à 17 ans. */
const kid = (h: Helpers, n: number, afni: number) => h.M.ccb({ under6: 1, age6to17: n - 1, afni });

export default defineGuide({
  id: 'ccb-calculator',
  group: 'family',
  order: 10,
  tool: 'ccb',
  related: ['canada-child-benefit', 'ccb-payment-dates', 'child-disability-benefit', 'ccb-shared-custody', 'benefit-payment-dates'],
  sources: ['ccbCalc', 'cdbChild', 'ccbDates'],
  en: {
    slug: 'ccb-calculator',
    nav: 'CCB calculator',
    card: 'Monthly Canada child benefit for July 2026 to June 2027, by age of the children and family income.',
    title: 'CCB Calculator 2026: Monthly Child Benefit by Income',
    description: 'CCB calculator 2026: your Canada child benefit from July 2026 to June 2027, up to $8,157 per child under 6, with the disability supplement and CRA reduction.',
    h1: 'Canada child benefit calculator',
    intro: 'Enter the children’s ages and your 2025 family net income to see the monthly CCB the CRA pays from July 2026 to June 2027.',
    resume: (h) => `This Canada child benefit calculator applies the CRA formula for July 2026 to June 2027: a maximum of ${h.eur(h.P.ccb.max_under6)} a year per child under 6 and ${h.eur(h.P.ccb.max_6_17)} per child aged 6 to 17, minus a reduction that starts above ${h.eur(h.P.ccb.t1)} of adjusted family net income and changes pace at ${h.eur(h.P.ccb.t2)}. For two children, the younger under 6, and a 2025 family income of ${h.eur(60000)}, it gives ${h.eur(kid(h, 2, 60000).monthly, 2)} a month. Enter the number of children in each age group, line 23600 of your 2025 return plus your spouse’s, and the number of children approved for the disability tax credit. The result shows the yearly and monthly CCB, the child disability benefit when it applies, and the reduction tier you are in. When the total for the year is under ${h.eur(h.P.ccb.lump_sum_under)}, the calculator flags that the CRA pays it in one sum in July.`,
    faqs: (h) => [
      { q: 'What income do I enter in the CCB calculator?', a: `Your adjusted family net income for 2025: line 23600 of your return plus line 23600 of your spouse’s or common-law partner’s, adjusted for any universal child care or RDSP income. Payments from July 2026 to June 2027 are based on 2025, so the ${h.eur(h.P.ccb.t1)} and ${h.eur(h.P.ccb.t2)} thresholds apply to that year, not to your current salary.` },
      { q: 'Why does the calculator show a different amount from my CRA notice?', a: 'The notice reflects facts the calculator cannot see: a child who turned 6 during the year, a change of marital status or custody, a late return, or a 2025 income that differs from the figure you entered. The calculator estimates the federal CCB for a full year in a stable situation. Your CRA notice gives the amount actually paid.' },
      { q: 'Can I use the CCB calculator for shared custody?', a: `Yes, with one step. Run it with your own household income as if you had full custody, then take ${h.pct(h.P.x.bCustodyShare as number, 0)} of the result: that is the CRA rule for each parent in shared custody. The other parent repeats the calculation with their own household income.` },
    ],
    body: (h) => {
      const rows = INC.map((x) => [h.eur(x), ...[1, 2, 3, 4].map((n) => h.eur(kid(h, n, x).monthly, 2))]);
      return `
<h2>What the calculator computes</h2>
<p>It follows the ${h.src('ccbCalc', 'CRA calculation page')} for the benefit year that started in July 2026. It adds up the maximum for each child, subtracts the income reduction for the number of children in the family, then adds the child disability benefit of up to ${h.eur(h.P.ccb.cdb.max)} per eligible child, reduced above ${h.eur(h.P.ccb.cdb.threshold)} as the ${h.src('cdbChild', 'CDB page')} explains. All amounts come from the CRA tables in force since July 2026.</p>
<h2>Typical monthly amounts</h2>
<p>The table runs the same engine for families of one to four children, with the youngest under 6 and the others aged 6 to 17.</p>
${h.table(['Family income 2025', '1 child', '2 children', '3 children', '4 children'], rows, 'Monthly CCB, youngest child under 6, July 2026 to June 2027', ['r', 'r', 'r', 'r', 'r'])}
<p>The gaps between columns narrow as income rises, because the reduction rate grows with the number of children. A four-child family at ${h.eur(130000)} still receives ${h.eur(kid(h, 4, 130000).monthly, 2)} a month.</p>
<h2>What it does not do</h2>
<p>The calculator does not check eligibility, which depends on residence, status and who cares for the child; the ${h.a('canada-child-benefit', 'Canada child benefit guide')} covers those rules. It does not split a year in which a child turns 6 or the family changes, and it leaves out provincial and territorial child benefits. For deposit days, see the ${h.a('ccb-payment-dates', 'CCB payment dates')}; in shared custody, the ${h.a('ccb-shared-custody', 'shared custody guide')}.</p>
`; },
  },
  fr: {
    slug: 'calcul-allocation-canadienne-enfants',
    nav: 'Calcul de l’ACE',
    card: 'L’allocation canadienne pour enfants mensuelle de juillet 2026 à juin 2027, selon l’âge des enfants et le revenu familial.',
    title: 'Prestation canadienne pour enfants 2026 : calcul du montant',
    description: 'Calcul de l’allocation canadienne pour enfants 2026 : montant de juillet 2026 à juin 2027, jusqu’à 8 157 $ par enfant de moins de 6 ans, PEH comprise.',
    h1: 'Calculateur de l’allocation canadienne pour enfants',
    intro: 'Indiquez l’âge des enfants et votre revenu familial net de 2025 pour voir l’ACE mensuelle que l’ARC verse de juillet 2026 à juin 2027.',
    resume: (h) => `Ce calculateur de l’allocation canadienne pour enfants applique la formule de l’ARC pour juillet 2026 à juin 2027 : un maximum de ${h.eur(h.P.ccb.max_under6)} par année par enfant de moins de 6 ans et de ${h.eur(h.P.ccb.max_6_17)} par enfant de 6 à 17 ans, moins une réduction qui commence au-delà de ${h.eur(h.P.ccb.t1)} de revenu familial net rajusté et change de rythme à ${h.eur(h.P.ccb.t2)}. Pour deux enfants, dont le cadet a moins de 6 ans, et un revenu familial de ${h.eur(60000)} en 2025, il donne ${h.eur(kid(h, 2, 60000).monthly, 2)} par mois. Saisissez le nombre d’enfants de chaque groupe d’âge, la ligne 23600 de votre déclaration de 2025 plus celle de votre conjoint, et le nombre d’enfants admissibles au crédit d’impôt pour personnes handicapées. Le résultat donne l’ACE annuelle et mensuelle, la prestation pour enfants handicapés s’il y a lieu, et votre tranche de réduction. Quand le total de l’année est inférieur à ${h.eur(h.P.ccb.lump_sum_under)}, le calculateur signale que l’ARC le verse en une fois en juillet.`,
    faqs: (h) => [
      { q: 'Quel revenu inscrire dans le calculateur de l’ACE ?', a: `Votre revenu familial net rajusté de 2025 : la ligne 23600 de votre déclaration plus la ligne 23600 de celle de votre conjoint marié ou de fait, rajustée pour la prestation universelle pour la garde d’enfants ou un REEI. Les versements de juillet 2026 à juin 2027 reposent sur 2025 : les seuils de ${h.eur(h.P.ccb.t1)} et ${h.eur(h.P.ccb.t2)} s’appliquent à cette année-là, pas à votre salaire actuel.` },
      { q: 'Pourquoi le calculateur affiche-t-il un montant différent de mon avis de l’ARC ?', a: 'L’avis tient compte de faits que le calculateur ignore : un enfant qui a eu 6 ans en cours d’année, un changement d’état civil ou de garde, une déclaration en retard, ou un revenu de 2025 différent du chiffre saisi. Le calculateur estime l’ACE fédérale d’une année complète, dans une situation stable. L’avis de l’ARC fait foi du montant versé.' },
      { q: 'Peut-on utiliser le calculateur de l’ACE en garde partagée ?', a: `Oui, en une étape de plus. Faites le calcul avec le revenu de votre ménage comme si vous aviez la garde complète, puis prenez ${h.pct(h.P.x.bCustodyShare as number, 0)} du résultat : c’est la règle de l’ARC pour chaque parent en garde partagée. L’autre parent refait le calcul avec le revenu de son propre ménage.` },
    ],
    body: (h) => {
      const rows = INC.map((x) => [h.eur(x), ...[1, 2, 3, 4].map((n) => h.eur(kid(h, n, x).monthly, 2))]);
      return `
<h2>Ce que calcule l’outil</h2>
<p>Il suit la ${h.src('ccbCalc', 'page de calcul de l’ARC')} pour l’année de prestations commencée en juillet 2026. Il additionne le maximum de chaque enfant, retranche la réduction selon le revenu prévue pour le nombre d’enfants de la famille, puis ajoute la prestation pour enfants handicapés, jusqu’à ${h.eur(h.P.ccb.cdb.max)} par enfant admissible, réduite au-delà de ${h.eur(h.P.ccb.cdb.threshold)} comme l’explique la ${h.src('cdbChild', 'page de la PEH')}. Tous les montants viennent des tableaux de l’ARC en vigueur depuis juillet 2026.</p>
<h2>Montants mensuels types</h2>
<p>Le tableau applique le même moteur à des familles d’un à quatre enfants, le cadet ayant moins de 6 ans et les autres de 6 à 17 ans.</p>
${h.table(['Revenu familial 2025', '1 enfant', '2 enfants', '3 enfants', '4 enfants'], rows, 'ACE mensuelle, cadet de moins de 6 ans, juillet 2026 à juin 2027', ['r', 'r', 'r', 'r', 'r'])}
<p>Les écarts entre colonnes se resserrent quand le revenu monte, car le taux de réduction augmente avec le nombre d’enfants. Une famille de quatre enfants à ${h.eur(130000)} reçoit encore ${h.eur(kid(h, 4, 130000).monthly, 2)} par mois.</p>
<h2>Ce qu’il ne fait pas</h2>
<p>Le calculateur ne vérifie pas l’admissibilité, qui dépend de la résidence, du statut et de la personne qui s’occupe de l’enfant ; le ${h.a('canada-child-benefit', 'guide de l’allocation canadienne pour enfants')} détaille ces règles. Il ne découpe pas une année où un enfant a 6 ans ou où la famille change, et il laisse de côté les prestations provinciales et territoriales pour enfants. Pour les jours de dépôt, voir les ${h.a('ccb-payment-dates', 'dates de versement de l’ACE')} ; en garde partagée, le ${h.a('ccb-shared-custody', 'guide de la garde partagée')}.</p>
`; },
  },
});
