import { defineGuide, type Helpers } from '../../lib/guide-types';

const B = (h: Helpers) => h.P.prov.bc.bcfb;
type Case = { n: number; afni: number; single?: boolean };
const CASES: Case[] = [
  { n: 1, afni: 25000 },
  { n: 2, afni: 45000 },
  { n: 2, afni: 80000 },
  { n: 1, afni: 40000, single: true },
  { n: 3, afni: 110000 },
];
/** Revenu où l'allocation s'éteint : minimum garanti épuisé à 4 % au-delà du second seuil. */
const zeroAt = (h: Helpers, n: number, single = false) => B(h).thr2 + h.M.bcFamilyBenefit(n, B(h).thr2, single).min / B(h).rate;
const table = (h: Helpers, l: 0 | 1) => h.table(
  l ? ['Famille, revenu net rajusté 2025', 'Maximum', 'Minimum garanti', 'Par année', 'Par mois'] : ['Family, 2025 adjusted net income', 'Maximum', 'Guaranteed minimum', 'Per year', 'Per month'],
  CASES.map((c) => {
    const r = h.M.bcFamilyBenefit(c.n, c.afni, c.single);
    const who = c.single ? (l ? 'Parent seul' : 'Single parent') : (l ? 'Couple' : 'Couple');
    const kids = l ? `${c.n} enfant${c.n > 1 ? 's' : ''}` : `${c.n} child${c.n > 1 ? 'ren' : ''}`;
    return [`${who}, ${kids}, ${h.eur(c.afni)}`, h.eur(r.max), h.eur(r.min), h.eur(r.annual), h.eur(r.monthly, 2)];
  }),
  l ? 'Allocation familiale de la C.-B., juillet 2026 à juin 2027, calculée par notre moteur' : 'BC family benefit, July 2026 to June 2027, computed by our engine',
  ['l', 'r', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'bc-family-benefit', group: 'provinces', order: 30, tool: 'bcfb',
  related: ['ccb-calculator', 'ccb-payment-dates', 'bc-climate-action-tax-credit', 'canada-child-benefit', 'alberta-child-family-benefit'],
  sources: ['craBc', 'ccbDates', 'craDates'],
  en: {
    slug: 'bc-family-benefit',
    nav: 'BC family benefit',
    card: 'The B.C. family benefit for July 2026 to June 2027: per-child amounts, the floor between two thresholds, and the single-parent supplement.',
    title: 'BC Family Benefit 2026: Per-Child Amounts and Thresholds',
    description: 'BC family benefit 2026: $1,750 for the first child, $1,100 for the second, $900 for each other, a guaranteed floor up to $96,562 and $500 for single parents.',
    h1: 'BC family benefit',
    intro: 'Enter your children, family situation and 2025 adjusted family net income to see the B.C. family benefit added to your child benefit from July 2026.',
    resume: (h) => { const b = B(h); return `The BC family benefit for July 2026 to June 2027 pays up to ${h.eur(b.max[0])} a year for the first child, ${h.eur(b.max[1])} for the second and ${h.eur(b.max[2])} for each additional child under 18, and a single-parent family adds up to ${h.eur(b.single_supp)}. The CRA folds it into the monthly Canada child benefit deposit, so it arrives on the same day, tax-free. When 2025 adjusted family net income passes ${h.eur(b.thr1)}, the benefit loses ${h.pct(b.rate, 0)} of the excess, but it cannot fall below a guaranteed amount of ${h.eur(b.min[0])}, ${h.eur(b.min[1])} and ${h.eur(b.min[2])} per child. That floor holds until ${h.eur(b.thr2)}; above that second threshold the remaining amount shrinks again by ${h.pct(b.rate, 0)} until it reaches zero. Unlike Ontario or Alberta, British Columbia publishes every parameter, so the calculator gives an exact figure, not a range. The amount actually paid is the one on your CRA notice.`; },
    faqs: (h) => { const b = B(h); return [
      { q: 'At what income does the BC family benefit stop for two children?', a: `At about ${h.eur(Math.ceil(zeroAt(h, 2)))} of adjusted family net income. Between ${h.eur(b.thr1)} and ${h.eur(b.thr2)} two children keep at least ${h.eur(b.min[0] + b.min[1])}; past ${h.eur(b.thr2)}, that floor shrinks by ${h.pct(b.rate, 0)} of the excess, which wipes it out once income is ${h.eur(Math.round((b.min[0] + b.min[1]) / b.rate))} higher. Your exact cut-off depends on the number and order of your children.` },
      { q: 'Is the BC single-parent supplement paid per child?', a: `No, it is one supplement per family, up to ${h.eur(b.single_supp)} a year, shown by the CRA as a monthly amount added to the first child. It follows the same reductions as the rest of the benefit, so a single parent with income between the two thresholds still keeps it in full on top of the guaranteed amounts.` },
      { q: 'Does the BC family benefit come on the same day as the Canada child benefit?', a: `Yes. The CRA combines both into one monthly payment, so the provincial share lands on the federal dates: ${h.date(h.P.ccb.dates_2026[9])}, ${h.date(h.P.ccb.dates_2026[10])} and ${h.date(h.P.ccb.dates_2026[11])} for the last three months of 2026. If the deposit is missing, wait ${h.num(h.P.missing_payment_wait.ccb_acfb)} business days before calling the CRA.` },
    ]; },
    body: (h) => { const b = B(h); return `
<h2>How the calculator works</h2>
<p>It adds the per-child amounts by birth order and the single-parent supplement, takes ${h.pct(b.rate, 0)} of income above ${h.eur(b.thr1)}, stops the reduction at the guaranteed amounts, then resumes it above ${h.eur(b.thr2)}. The income used is your 2025 adjusted family net income, the same figure the CRA uses for the ${h.a('ccb-calculator', 'Canada child benefit')}.</p>
<h2>Typical families for 2026–27</h2>
${table(h, 0)}
<p>The two-child family at ${h.eur(CASES[2].afni)} sits on the floor: its income would justify less, but the guaranteed amounts hold it up. Three children at ${h.eur(CASES[4].afni)} are past the second threshold and already below that floor.</p>
<h2>What it leaves out</h2>
<p>Shared custody, where each parent gets half, is not modelled, nor are mid-year changes in family status. The B.C. ${h.a('bc-climate-action-tax-credit', 'climate action tax credit')} that used to be paid alongside has ended. Deposit days are on the ${h.a('ccb-payment-dates', 'child benefit calendar')}. Parameters come from the ${h.src('craBc', 'CRA’s British Columbia page')}.</p>
`; },
  },
  fr: {
    slug: 'allocation-familiale-colombie-britannique',
    nav: 'Allocation familiale de la C.-B.',
    card: 'L’allocation familiale de la C.-B. de juillet 2026 à juin 2027 : montants par enfant, plancher entre deux seuils et supplément monoparental.',
    title: 'Allocation familiale de la C.-B. 2026 : montants et seuils',
    description: 'Allocation familiale de la C.-B. 2026 : 1 750 $ pour le 1er enfant, 1 100 $ pour le 2e, 900 $ pour les suivants, un plancher jusqu’à 96 562 $ et 500 $ de plus.',
    h1: 'L’allocation familiale de la Colombie-Britannique',
    intro: 'Entrez vos enfants, votre situation familiale et votre revenu familial net rajusté de 2025 pour voir l’allocation familiale de la C.-B. ajoutée à votre allocation pour enfants dès juillet 2026.',
    resume: (h) => { const b = B(h); return `L’allocation familiale de la Colombie-Britannique de juillet 2026 à juin 2027 verse jusqu’à ${h.eur(b.max[0])} par année pour le premier enfant, ${h.eur(b.max[1])} pour le deuxième et ${h.eur(b.max[2])} pour chaque enfant suivant de moins de 18 ans ; une famille monoparentale ajoute jusqu’à ${h.eur(b.single_supp)}. L’ARC l’intègre au dépôt mensuel de l’allocation canadienne pour enfants : elle arrive le même jour, libre d’impôt. Quand le revenu familial net rajusté de 2025 dépasse ${h.eur(b.thr1)}, l’allocation perd ${h.pct(b.rate, 0)} de l’excédent, sans descendre sous un montant garanti de ${h.eur(b.min[0])}, ${h.eur(b.min[1])} et ${h.eur(b.min[2])} par enfant. Ce plancher tient jusqu’à ${h.eur(b.thr2)} ; au-delà de ce second seuil, le solde baisse de nouveau de ${h.pct(b.rate, 0)} jusqu’à zéro. Contrairement à l’Ontario ou à l’Alberta, la Colombie-Britannique publie tous ses paramètres : le calculateur donne un chiffre exact, pas une fourchette. Le montant versé est celui de votre avis de l’ARC.`; },
    faqs: (h) => { const b = B(h); return [
      { q: 'À quel revenu l’allocation familiale de la C.-B. s’arrête-t-elle pour deux enfants ?', a: `Vers ${h.eur(Math.ceil(zeroAt(h, 2)))} de revenu familial net rajusté. Entre ${h.eur(b.thr1)} et ${h.eur(b.thr2)}, deux enfants gardent au moins ${h.eur(b.min[0] + b.min[1])} ; au-delà de ${h.eur(b.thr2)}, ce plancher baisse de ${h.pct(b.rate, 0)} de l’excédent, ce qui l’efface une fois le revenu plus élevé de ${h.eur(Math.round((b.min[0] + b.min[1]) / b.rate))}.` },
      { q: 'Le supplément monoparental de la C.-B. est-il versé par enfant ?', a: `Non, c’est un seul supplément par famille, jusqu’à ${h.eur(b.single_supp)} par année, que l’ARC présente comme un montant mensuel ajouté au premier enfant. Il suit les mêmes réductions que le reste de l’allocation : un parent seul dont le revenu se situe entre les deux seuils le conserve donc en entier, en plus des montants garantis.` },
      { q: 'L’allocation familiale de la C.-B. arrive-t-elle le même jour que l’allocation canadienne pour enfants ?', a: `Oui. L’ARC réunit les deux en un seul versement mensuel : la part provinciale suit donc les dates fédérales, soit le ${h.date(h.P.ccb.dates_2026[9])}, le ${h.date(h.P.ccb.dates_2026[10])} et le ${h.date(h.P.ccb.dates_2026[11])} pour les trois derniers mois de 2026. Si le dépôt manque, attendez ${h.num(h.P.missing_payment_wait.ccb_acfb)} jours ouvrables avant d’appeler l’ARC.` },
    ]; },
    body: (h) => { const b = B(h); return `
<h2>Le fonctionnement du calculateur</h2>
<p>Il additionne les montants par enfant selon le rang de naissance et le supplément monoparental, retire ${h.pct(b.rate, 0)} du revenu au-delà de ${h.eur(b.thr1)}, arrête la réduction aux montants garantis, puis la reprend au-delà de ${h.eur(b.thr2)}. Le revenu retenu est votre revenu familial net rajusté de 2025, celui que l’ARC utilise pour l’${h.a('ccb-calculator', 'allocation canadienne pour enfants')}.</p>
<h2>Familles types pour 2026-2027</h2>
${table(h, 1)}
<p>La famille de deux enfants à ${h.eur(CASES[2].afni)} repose sur le plancher : son revenu justifierait moins, mais les montants garantis la soutiennent. Trois enfants à ${h.eur(CASES[4].afni)} ont franchi le second seuil et sont déjà sous ce plancher.</p>
<h2>Ce que l’outil laisse de côté</h2>
<p>La garde partagée, où chaque parent reçoit la moitié, n’est pas modélisée, pas plus que les changements de situation en cours d’année. Le ${h.a('bc-climate-action-tax-credit', 'crédit d’action climatique de la C.-B.')}, autrefois versé en parallèle, a pris fin. Les jours de dépôt figurent au ${h.a('ccb-payment-dates', 'calendrier de l’allocation pour enfants')}. Paramètres tirés de la ${h.src('craBc', 'page de l’ARC sur la Colombie-Britannique')}.</p>
`; },
  },
});
