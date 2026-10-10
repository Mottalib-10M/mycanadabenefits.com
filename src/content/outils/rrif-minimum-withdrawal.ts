import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const BASE = 100000;
const AGES = Array.from({ length: 36 }, (_, i) => 60 + i);
const f = (a: number) => (h: Helpers) => h.M.rrifMinimum(1, a).factor;
const factorRows = (h: Helpers) => AGES.map((a) => {
  const r = h.M.rrifMinimum(BASE, a);
  const label = a === 95 ? (h.lang === 'fr' ? '95 ou plus' : '95 or older') : String(a);
  return [label, h.pct(r.factor, 2), h.eur(r.minimum)];
});

export default defineGuide({
  id: 'rrif-minimum-withdrawal',
  group: 'oas',
  order: 90,
  tool: 'rrif',
  related: ['rrif-gis-clawback', 'oas-clawback', 'guaranteed-income-supplement', 'old-age-security'],
  sources: ['rrif', S('eIta1463')],
  en: {
    slug: 'rrif-minimum-withdrawal',
    nav: 'RRIF minimum withdrawal',
    card: 'The prescribed factor for every age, the rule before 71 and the spouse’s age option.',
    title: 'RRIF Minimum Withdrawal 2026: Factor Table for Each Age',
    description: 'RRIF minimum withdrawal 2026: 5.28% of the January 1 value at 71, 6.82% at 80, 20% from 95, and 1/(90 minus age) before 71. Full factor table and calculator.',
    h1: 'RRIF minimum withdrawal calculator',
    intro: 'Enter the value of your RRIF on January 1 and your age on that date to get the minimum you must withdraw this year.',
    resume: (h) => `At 71 the RRIF minimum withdrawal is ${h.pct(f(71)(h), 2)} of the fund’s value on January 1, rising to ${h.pct(f(80)(h), 2)} at 80, ${h.pct(f(90)(h), 2)} at 90 and ${h.pct(f(95)(h), 0)} from 95 onward. These prescribed factors come from section 7308 of the Income Tax Regulations and depend only on age. Before 71, the factor is one divided by 90 minus your age on January 1: ${h.pct(f(65)(h), 2)} at 65 and ${h.pct(f(70)(h), 2)} at 70. The minimum is the fair market value of the fund at the start of the year multiplied by the factor for your age at that date, so on a fund of ${h.eur(BASE)} a 72-year-old must take out at least ${h.eur(h.M.rrifMinimum(BASE, 72).minimum)} during the year. No minimum applies in the year the fund is set up. If you elect it before the first payment, the factor can follow the age of your spouse or common-law partner instead of yours, which lowers the minimum when that person is younger. You can always withdraw more than the minimum.`,
    faqs: (h) => [
      { q: 'Can I base my RRIF minimum on my younger spouse’s age?', a: `Yes, if you make the election before the carrier has made any payment from the fund. The Income Tax Act then uses the prescribed factor of the person who was your spouse or common-law partner when you elected. With a spouse aged 68 rather than your own 72, the factor drops from ${h.pct(f(72)(h), 2)} to ${h.pct(f(68)(h), 2)}, which on ${h.eur(BASE)} lowers the minimum by ${h.eur(h.M.rrifMinimum(BASE, 72).minimum - h.M.rrifMinimum(BASE, 68).minimum)}.` },
      { q: 'Do I have to withdraw anything in the year I open my RRIF?', a: `No. The Income Tax Act sets the minimum amount at nil for the year in which the fund is entered into. The first required withdrawal comes the following calendar year, based on the value on January 1 of that year and your age on that date. A fund opened in December therefore has its first compulsory payment in the next calendar year, not within weeks.` },
      { q: 'What is the RRIF withdrawal percentage at age 65?', a: `At 65 the factor is one divided by 90 minus 65, or ${h.pct(f(65)(h), 2)}, so a fund worth ${h.eur(BASE)} on January 1 requires at least ${h.eur(h.M.rrifMinimum(BASE, 65).minimum)} during the year. The fixed table of section 7308 only starts at 71 with ${h.pct(f(71)(h), 2)}; every age below that uses the same formula.` },
    ],
    body: (h) => `
<h2>What the calculator computes</h2>
<p>You enter the fair market value of the fund on January 1 and your age, in whole years, on that date. The tool multiplies the two using the factor for that age and shows the factor for the next five years, so you can see how the required share climbs. If you elected to use your spouse’s or common-law partner’s age, enter their age instead.</p>
<h2>The full table of factors</h2>
${h.table(['Age on January 1', 'Factor', `Minimum on ${h.eur(BASE)}`], factorRows(h), 'RRIF minimum factors: 1/(90 minus age) before 71, then section 7308 of the Income Tax Regulations', ['l', 'r', 'r'])}
<p>The share climbs slowly through the seventies and steeply after 90, until it stops at ${h.pct(f(95)(h), 0)} from 95. Because the minimum is a share of a value that moves with the markets, the dollar amount can fall in a year when the factor rises.</p>
<h2>What it does not do</h2>
<p>The tool does not handle RRIFs set up before 1993 under older rules, and it does not compute tax withheld. It does not track withdrawals already made or the value of the fund at year end. Every dollar taken out is income for the year under subsection 146.3(5) of the ${h.src(S('eIta1463'), 'Income Tax Act')}, which matters for the Guaranteed Income Supplement and the OAS recovery tax: the ${h.a('rrif-gis-clawback', 'guide on RRIF withdrawals and benefits')} shows the effect, and the ${h.a('oas-clawback', 'clawback calculator')} gives the repayment.</p>
`,
  },
  fr: {
    slug: 'retrait-minimum-ferr',
    nav: 'Retrait minimum du FERR',
    card: 'Le facteur prescrit à chaque âge, la règle avant 71 ans et l’option de l’âge du conjoint.',
    title: 'Retrait minimum du FERR 2026 : table des facteurs par âge',
    description: 'Retrait minimum du FERR 2026 : 5,28 % de la valeur au 1er janvier à 71 ans, 6,82 % à 80 ans, 20 % dès 95 ans, 1/(90 moins l’âge) avant. Table et calculateur.',
    h1: 'Calculateur du retrait minimum d’un FERR',
    intro: 'Indiquez la valeur de votre FERR au 1er janvier et votre âge à cette date pour obtenir le retrait minimum de l’année.',
    resume: (h) => `À 71 ans, le retrait minimum d’un FERR est de ${h.pct(f(71)(h), 2)} de la valeur du fonds au 1er janvier, puis de ${h.pct(f(80)(h), 2)} à 80 ans, ${h.pct(f(90)(h), 2)} à 90 ans et ${h.pct(f(95)(h), 0)} dès 95 ans. Ces facteurs prescrits viennent de l’article 7308 du Règlement de l’impôt sur le revenu et ne dépendent que de l’âge. Avant 71 ans, le facteur est égal à un divisé par 90 moins votre âge au 1er janvier : ${h.pct(f(65)(h), 2)} à 65 ans et ${h.pct(f(70)(h), 2)} à 70 ans. Le minimum correspond à la juste valeur marchande du fonds au début de l’année multipliée par le facteur de votre âge à cette date : sur un fonds de ${h.eur(BASE)}, une personne de 72 ans doit retirer au moins ${h.eur(h.M.rrifMinimum(BASE, 72).minimum)} dans l’année. Aucun minimum ne s’applique l’année de l’établissement du fonds. Si vous en faites le choix avant le premier paiement, le facteur peut suivre l’âge de votre époux ou conjoint de fait plutôt que le vôtre, ce qui réduit le minimum quand cette personne est plus jeune. Retirer davantage reste toujours permis.`,
    faqs: (h) => [
      { q: 'Peut-on calculer le minimum du FERR sur l’âge du conjoint plus jeune ?', a: `Oui, si le choix est fait avant que l’émetteur ait versé quoi que ce soit à partir du fonds. La Loi de l’impôt sur le revenu retient alors le facteur prescrit de la personne qui était votre époux ou conjoint de fait au moment du choix. Avec un conjoint de 68 ans plutôt que vos 72 ans, le facteur passe de ${h.pct(f(72)(h), 2)} à ${h.pct(f(68)(h), 2)}, ce qui réduit le minimum de ${h.eur(h.M.rrifMinimum(BASE, 72).minimum - h.M.rrifMinimum(BASE, 68).minimum)} sur ${h.eur(BASE)}.` },
      { q: 'Faut-il retirer de l’argent du FERR l’année de son ouverture ?', a: `Non. La Loi de l’impôt sur le revenu fixe le minimum à zéro pour l’année où le fonds est établi. Le premier retrait obligatoire vient l’année civile suivante, calculé sur la valeur au 1er janvier de cette année-là et sur votre âge à cette date. Un fonds ouvert en décembre n’a donc son premier paiement imposé que l’année civile suivante, et non quelques semaines plus tard.` },
      { q: 'Quel est le pourcentage de retrait du FERR à 65 ans ?', a: `À 65 ans, le facteur vaut un divisé par 90 moins 65, soit ${h.pct(f(65)(h), 2)} : un fonds de ${h.eur(BASE)} au 1er janvier exige un retrait d’au moins ${h.eur(h.M.rrifMinimum(BASE, 65).minimum)} dans l’année. La table fixe de l’article 7308 ne commence qu’à 71 ans, avec ${h.pct(f(71)(h), 2)} ; tous les âges inférieurs suivent la même formule.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Vous saisissez la juste valeur marchande du fonds au 1er janvier et votre âge, en années complètes, à cette date. L’outil multiplie la valeur par le facteur de cet âge et affiche le facteur des cinq années suivantes, pour voir la part exigée augmenter. Si vous avez choisi l’âge de votre époux ou conjoint de fait, entrez le sien.</p>
<h2>La table complète des facteurs</h2>
${h.table(['Âge au 1er janvier', 'Facteur', `Minimum sur ${h.eur(BASE)}`], factorRows(h), 'Facteurs du minimum FERR : 1/(90 moins l’âge) avant 71 ans, puis article 7308 du Règlement de l’impôt sur le revenu', ['l', 'r', 'r'])}
<p>La part monte lentement de 71 à 79 ans, puis fortement après 90 ans, jusqu’à plafonner à ${h.pct(f(95)(h), 0)} dès 95 ans. Comme le minimum est une part d’une valeur qui suit les marchés, le montant en dollars peut baisser une année où le facteur augmente.</p>
<h2>Ce que l’outil ne fait pas</h2>
<p>L’outil ne traite pas les FERR établis avant 1993 selon d’anciennes règles et ne calcule pas l’impôt retenu à la source. Il ne suit ni les retraits déjà faits ni la valeur du fonds en fin d’année. Chaque dollar retiré est un revenu de l’année selon le paragraphe 146.3(5) de la ${h.src(S('eIta1463'), 'Loi de l’impôt sur le revenu')}, ce qui pèse sur le Supplément de revenu garanti et sur l’impôt de récupération de la SV : le ${h.a('rrif-gis-clawback', 'guide sur les retraits de FERR et les prestations')} en montre l’effet, et le ${h.a('oas-clawback', 'calculateur de récupération')} donne le remboursement.</p>
`,
  },
});
