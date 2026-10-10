import { defineGuide, type Helpers } from '../../lib/guide-types';

const A = (h: Helpers) => h.P.prov.ab.acfb;
const dates = (h: Helpers) => h.P.pay_dates_2026.acfb;
type Case = { n: number; afni: number; work: number };
const CASES: Case[] = [
  { n: 1, afni: 20000, work: 15000 },
  { n: 2, afni: 26000, work: 8000 },
  { n: 3, afni: 22000, work: 0 },
  { n: 2, afni: 36000, work: 36000 },
  { n: 4, afni: 52000, work: 52000 },
];
const table = (h: Helpers, l: 0 | 1) => h.table(
  l ? ['Enfants, revenu net, revenu de travail (2025)', 'Base', 'Travail', 'Total annuel'] : ['Children, net income, working income (2025)', 'Base', 'Working', 'Annual total'],
  CASES.map((c) => {
    const r = h.M.albertaChildFamilyBenefit(c.n, c.afni, c.work);
    const cap = (x: number, p: boolean) => (p ? `${l ? 'au plus ' : 'at most '}${h.eur(x)}` : h.eur(x));
    return [`${c.n}, ${h.eur(c.afni)}, ${h.eur(c.work)}`, cap(r.base, r.basePartial), cap(r.work, r.workPartial), cap(r.base + r.work, r.basePartial || r.workPartial)];
  }),
  l ? 'Allocation pour enfants et familles de l’Alberta, juillet 2026 à juin 2027, calculée par notre moteur' : 'Alberta child and family benefit, July 2026 to June 2027, computed by our engine',
  ['l', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'alberta-child-family-benefit', group: 'provinces', order: 40, tool: 'acfb',
  related: ['aish-alberta', 'ccb-calculator', 'benefit-payment-dates', 'bc-family-benefit', 'canada-workers-benefit'],
  sources: ['craAlberta', 'albertaAcfb', 'craDates'],
  en: {
    slug: 'alberta-child-family-benefit',
    nav: 'Alberta child and family benefit',
    card: 'Alberta’s base and working components for 2026–27, the income thresholds and the four quarterly deposits.',
    title: 'Alberta Child and Family Benefit 2026: Amounts and Dates',
    description: 'Alberta child and family benefit 2026: base component up to $1,529 for one child, working component up to $782, reduced above $28,116 and $47,115 of income.',
    h1: 'Alberta child and family benefit',
    intro: 'Enter your children, 2025 family net income and working income to see the two parts of the Alberta child and family benefit for July 2026 to June 2027.',
    resume: (h) => { const a = A(h); const d = dates(h); return `The Alberta child and family benefit for July 2026 to June 2027 has two parts. The base component pays up to ${h.eur(a.base[0])} a year for one child, ${h.eur(a.base[1])} for two, ${h.eur(a.base[2])} for three and ${h.eur(a.base[3])} for four or more, to every eligible family with low income. The working component is added once family employment income passes ${h.eur(a.work_start)}, growing by ${h.pct(a.work_phase_in, 0)} of each extra dollar up to ${h.eur(a.work[0])}, ${h.eur(a.work[1])}, ${h.eur(a.work[2])} or ${h.eur(a.work[3])} depending on the number of children. The base part starts to shrink above ${h.eur(a.base_thr)} of family net income and the working part above ${h.eur(a.work_thr)}, but neither Alberta nor the CRA publishes the reduction rates, so above a threshold our calculator gives a ceiling. The CRA pays the benefit four times a year, in August, November, February and May; the 2026 deposit days are ${h.date(d[0])}, ${h.date(d[1])}, ${h.date(d[2])} and ${h.date(d[3])}. It is not taxable, and the amount you receive is the one on your CRA notice.`; },
    faqs: (h) => { const a = A(h); return [
      { q: 'How much employment income do I need for the full Alberta working component?', a: `With one child, ${h.eur(Math.ceil(a.work_start + a.work[0] / a.work_phase_in))} of family employment income: the component starts after ${h.eur(a.work_start)} and grows by ${h.pct(a.work_phase_in, 0)} until it reaches ${h.eur(a.work[0])}. Two children need ${h.eur(Math.ceil(a.work_start + a.work[1] / a.work_phase_in))} to reach ${h.eur(a.work[1])}. Net family income must also stay under ${h.eur(a.work_thr)} for the full amount.` },
      { q: 'Do I have to apply for the Alberta child and family benefit?', a: `No. The CRA works it out from the tax returns you and your spouse or partner file, as long as you live in Alberta, have a child under 18 and qualify for the Canada child benefit. A family with no income still gets the base component of ${h.eur(a.base[0])} for one child, provided the returns are filed.` },
      { q: 'When is the next Alberta child and family benefit payment after November 2026?', a: `In February 2027. The benefit year runs from July to June with four deposits, in August, November, February and May, and the ${h.date(dates(h)[3])} payment is the second of the 2026–27 year. The CRA had not yet published the exact 2027 dates; wait ${h.num(h.P.missing_payment_wait.ccb_acfb)} business days after the expected day before calling about a missing deposit.` },
    ]; },
    body: (h) => { const a = A(h); return `
<h2>What the calculator does</h2>
<p>It picks the base and working maximums for your number of children (four and more share the same amounts), builds the working part from ${h.pct(a.work_phase_in, 0)} of employment income above ${h.eur(a.work_start)}, and flags each part whose threshold your net income exceeds. Each additional child adds ${h.eur(a.base[1] - a.base[0])} to the base, while the working component adds less and less: ${h.eur(a.work[1] - a.work[0])}, then ${h.eur(a.work[2] - a.work[1])}, then ${h.eur(a.work[3] - a.work[2])}.</p>
<h2>Typical families for 2026–27</h2>
${table(h, 0)}
<p>The third family has no earnings and receives only the base part. The last two are above at least one threshold, so the figures are upper bounds: the true payment is lower, by an amount only the CRA notice will show.</p>
<h2>What it cannot tell you</h2>
<p>Without published reduction rates, no honest tool can give an exact amount above ${h.eur(a.base_thr)}. It also ignores shared custody. Albertans on disability support can read the ${h.a('aish-alberta', 'AISH and ADAP guide')}; the federal ${h.a('ccb-calculator', 'child benefit')} is paid separately each month. Parameters come from the ${h.src('craAlberta', 'CRA’s Alberta page')} and ${h.src('albertaAcfb', 'alberta.ca')}.</p>
`; },
  },
  fr: {
    slug: 'allocation-enfants-familles-alberta',
    nav: 'Allocation pour enfants de l’Alberta',
    card: 'Les composantes de base et travail de l’Alberta pour 2026-2027, les seuils de revenu et les quatre versements.',
    title: 'Allocation pour enfants et familles de l’Alberta 2026',
    description: 'Allocation pour enfants et familles de l’Alberta 2026 : base jusqu’à 1 529 $ pour un enfant, composante travail jusqu’à 782 $, réduites au-delà de 28 116 $.',
    h1: 'L’allocation pour enfants et familles de l’Alberta',
    intro: 'Entrez vos enfants, votre revenu familial net de 2025 et votre revenu de travail pour voir les deux parties de l’allocation de l’Alberta de juillet 2026 à juin 2027.',
    resume: (h) => { const a = A(h); const d = dates(h); return `L’allocation pour enfants et familles de l’Alberta (ACFB) de juillet 2026 à juin 2027 comporte deux parties. La composante de base verse jusqu’à ${h.eur(a.base[0])} par année pour un enfant, ${h.eur(a.base[1])} pour deux, ${h.eur(a.base[2])} pour trois et ${h.eur(a.base[3])} pour quatre ou plus, à toute famille admissible à faible revenu. La composante travail s’ajoute dès que le revenu d’emploi familial dépasse ${h.eur(a.work_start)} : elle croît de ${h.pct(a.work_phase_in, 0)} de chaque dollar supplémentaire jusqu’à ${h.eur(a.work[0])}, ${h.eur(a.work[1])}, ${h.eur(a.work[2])} ou ${h.eur(a.work[3])} selon le nombre d’enfants. La base commence à diminuer au-delà de ${h.eur(a.base_thr)} de revenu familial net et la partie travail au-delà de ${h.eur(a.work_thr)}, mais ni l’Alberta ni l’ARC ne publient les taux de réduction : au-delà d’un seuil, notre calculateur donne un plafond. L’ARC verse l’allocation quatre fois par année, en août, novembre, février et mai ; les dépôts de 2026 sont fixés au ${h.date(d[0])}, le ${h.date(d[1])}, le ${h.date(d[2])} et le ${h.date(d[3])}. Elle n’est pas imposable, et le montant reçu est celui de votre avis de l’ARC.`; },
    faqs: (h) => { const a = A(h); return [
      { q: 'Quel revenu d’emploi faut-il pour la composante travail complète de l’Alberta ?', a: `Avec un enfant, ${h.eur(Math.ceil(a.work_start + a.work[0] / a.work_phase_in))} de revenu d’emploi familial : la composante démarre après ${h.eur(a.work_start)} et croît de ${h.pct(a.work_phase_in, 0)} jusqu’à ${h.eur(a.work[0])}. Deux enfants demandent ${h.eur(Math.ceil(a.work_start + a.work[1] / a.work_phase_in))} pour atteindre ${h.eur(a.work[1])}. Le revenu familial net doit aussi rester sous ${h.eur(a.work_thr)} pour le montant complet.` },
      { q: 'Faut-il présenter une demande pour l’allocation pour enfants et familles de l’Alberta ?', a: `Non. L’ARC la calcule à partir des déclarations de revenus que vous et votre conjoint produisez, à condition d’habiter l’Alberta, d’avoir un enfant de moins de 18 ans et d’être admissible à l’allocation canadienne pour enfants. Une famille sans revenu reçoit la base de ${h.eur(a.base[0])} pour un enfant, à condition que les déclarations soient produites.` },
      { q: 'Quand arrive le versement de l’allocation de l’Alberta après novembre 2026 ?', a: `En février 2027. L’année de prestations va de juillet à juin avec quatre dépôts, en août, novembre, février et mai, et le versement du ${h.date(dates(h)[3])} est le deuxième de 2026-2027. L’ARC n’avait pas encore publié les dates exactes de 2027 ; attendez ${h.num(h.P.missing_payment_wait.ccb_acfb)} jours ouvrables après la date prévue avant de signaler un dépôt manquant.` },
    ]; },
    body: (h) => { const a = A(h); return `
<h2>Ce que fait le calculateur</h2>
<p>Il retient les maximums de base et de travail selon le nombre d’enfants (quatre et plus partagent les mêmes montants), construit la composante travail à ${h.pct(a.work_phase_in, 0)} du revenu d’emploi au-delà de ${h.eur(a.work_start)} et signale chaque partie dont le seuil est dépassé. Chaque enfant de plus ajoute ${h.eur(a.base[1] - a.base[0])} à la base, alors que la composante travail augmente de moins en moins : ${h.eur(a.work[1] - a.work[0])}, puis ${h.eur(a.work[2] - a.work[1])}, puis ${h.eur(a.work[3] - a.work[2])}.</p>
<h2>Familles types pour 2026-2027</h2>
${table(h, 1)}
<p>La troisième famille n’a aucun revenu d’emploi et ne reçoit que la base. Les deux dernières dépassent au moins un seuil : les chiffres sont des bornes hautes, et le versement réel sera plus bas, d’un montant que seul l’avis de l’ARC indiquera.</p>
<h2>Ce que l’outil ne peut pas dire</h2>
<p>Sans taux de réduction publiés, aucun outil honnête ne peut donner un montant exact au-delà de ${h.eur(a.base_thr)}. La garde partagée n’est pas traitée non plus. Les Albertains qui reçoivent une aide pour invalidité liront le ${h.a('aish-alberta', 'guide AISH et ADAP')} ; l’${h.a('ccb-calculator', 'allocation canadienne pour enfants')} est versée à part chaque mois. Paramètres tirés de la ${h.src('craAlberta', 'page de l’ARC sur l’Alberta')} et d’${h.src('albertaAcfb', 'alberta.ca')} (en anglais).</p>
`; },
  },
});
