import { defineGuide, type Helpers } from '../../lib/guide-types';

const on = (h: Helpers) => h.P.prov.on;
const otbDates = (h: Helpers) => h.P.pay_dates_2026.otb.filter((d) => d >= '2026-07-01');
/** Cas types calculés par le moteur (année de prestations juillet 2026 à juin 2027, revenus de 2025). */
type Case = { couple: boolean; children: number; afni: number; rent?: number; propertyTax?: number; senior?: boolean; north?: boolean };
const CASES: Case[] = [
  { couple: false, children: 0, afni: 24000, rent: 14400 },
  { couple: false, children: 0, afni: 31000, propertyTax: 3600, senior: true },
  { couple: true, children: 2, afni: 46000, rent: 21600 },
  { couple: false, children: 0, afni: 33000, rent: 10800, north: true },
  { couple: false, children: 0, afni: 38000, rent: 7200 },
];
const label = (h: Helpers, c: Case, l: 0 | 1) => {
  const who = c.couple ? (l ? `Couple, ${c.children} enfants` : `Couple, ${c.children} children`) : c.senior ? (l ? 'Personne seule de 65 ans' : 'Single, 65 or over') : (l ? 'Personne seule' : 'Single');
  const where = c.north ? (l ? ', Nord de l’Ontario' : ', Northern Ontario') : '';
  const cost = c.rent ? (l ? `loyer ${h.eur(c.rent)}` : `rent ${h.eur(c.rent)}`) : (l ? `impôt foncier ${h.eur(c.propertyTax ?? 0)}` : `property tax ${h.eur(c.propertyTax ?? 0)}`);
  return `${who}${where}, ${l ? 'revenu' : 'income'} ${h.eur(c.afni)}, ${cost}`;
};
const cases = (h: Helpers) => CASES.map((c) => ({ c, r: h.M.trillium(c) }));
const table = (h: Helpers, l: 0 | 1) => h.table(
  l ? ['Situation (année 2025)', 'CIEFO', 'CTVO', 'CENO', 'Total annuel', 'Versement'] : ['Situation (2025 tax year)', 'OEPTC', 'OSTC', 'NOEC', 'Annual total', 'Payment'],
  cases(h).map(({ c, r }) => [label(h, c, l), h.eur(r.oeptc), h.eur(r.ostc), h.eur(r.noec), h.eur(r.annual), r.lumpSum ? (l ? 'une fois, en juillet' : 'once, in July') : `${h.eur(r.monthly, 2)}${l ? ' par mois' : ' a month'}`]),
  l ? 'Prestation Trillium de juillet 2026 à juin 2027, calculée par notre moteur avec les paramètres de l’ARC' : 'Ontario Trillium Benefit, July 2026 to June 2027, computed by our engine with CRA parameters',
  ['l', 'r', 'r', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'ontario-trillium-benefit', group: 'provinces', order: 10, tool: 'otb',
  related: ['benefit-payment-dates', 'ontario-child-benefit', 'ontario-gains', 'gst-credit-calculator', 'odsp-rates'],
  sources: ['craOntario', 'oeptcSheet', 'ontarioOtb', 'craDates'],
  en: {
    slug: 'ontario-trillium-benefit',
    nav: 'Ontario Trillium Benefit',
    card: 'Energy, property tax, sales tax and northern credits added up, with the monthly deposit.',
    title: 'Ontario Trillium Benefit 2026: Amounts, Dates and Lump Sum',
    description: 'Ontario Trillium Benefit 2026: OEPTC up to $1,307 or $1,488 at 65, $378 of sales tax credit per person, paid on the 10th or once in July if $500 or less.',
    h1: 'Ontario Trillium Benefit',
    intro: 'Enter your 2025 income, rent or property tax and family size to see the three Ontario credits the CRA pays as one Trillium deposit from July 2026.',
    resume: (h) => { const o = on(h); const d = otbDates(h); return `The Ontario Trillium Benefit for July 2026 to June 2027 combines three credits based on your 2025 return: the Ontario energy and property tax credit (OEPTC), worth up to ${h.eur(o.oeptc.max_18_64)} a year between 18 and 64 and ${h.eur(o.oeptc.max_65)} from age 65; the Ontario sales tax credit (OSTC), ${h.eur(o.ostc.per_person)} for each adult and each child; and the Northern Ontario energy credit (NOEC), up to ${h.eur(o.noec.max_single)} for a single person or ${h.eur(o.noec.max_family)} for a family living in the North. The CRA adds them and pays the total on the 10th of each month, so ${h.date(d[0])}, ${h.date(d[1])}, ${h.date(d[2])}, ${h.date(d[3])}, ${h.date(d[4])} and ${h.date(d[5])}. When the yearly total is ${h.eur(o.otb.lump_max)} or less, it comes as a single payment in July. Income above ${h.eur(o.oeptc.thr_single)} (single) or ${h.eur(o.oeptc.thr_family)} (family) reduces the first two credits. The amount you actually receive is the one on your CRA notice.`; },
    faqs: (h) => { const o = on(h); return [
      { q: 'Can I get my whole Ontario Trillium Benefit in June 2027 instead of monthly?', a: `Yes, if your entitlement is above ${h.eur(o.otb.lump_max)}. You make the choice on form ON-BEN when you file your 2025 return, and the CRA then holds the money and pays it in one deposit on ${h.date(h.P.x.gOtbDeferDate)}, at the end of the benefit year. Smaller entitlements are paid in July whatever you choose.` },
      { q: 'How much rent counts toward the Ontario energy and property tax credit?', a: `${h.pct(o.oeptc.rent_share, 0)} of the rent you paid in Ontario for 2025 counts as occupancy cost, added to any property tax. On the CRA calculation sheet, a renter paying ${h.eur(CASES[0].rent!)} a year therefore declares ${h.eur(CASES[0].rent! * o.oeptc.rent_share)}, and the energy part alone is capped at ${h.eur(o.oeptc.energy_max)} before the property tax part is added.` },
      { q: 'Why did I receive $10 from the Trillium benefit?', a: `Because the CRA rounds tiny entitlements up. When the annual total of the three credits lands between ${h.eur(o.otb.none_under)} and ${h.eur(o.otb.raised_to)}, a single ${h.eur(o.otb.raised_to)} payment is issued; at ${h.eur(o.otb.none_under)} or less, nothing is paid at all. It usually means your income sits close to the point where every credit has run out.` },
      { q: 'Do I need form ON-BEN to receive the Ontario sales tax credit?', a: `No. The sales tax credit is worked out from your return alone, which is why a person with no rent or property tax still receives ${h.eur(o.ostc.per_person)} a head at low income. Form ON-BEN is what claims the energy and property tax credit and the northern credit, and it is filed with the same return.` },
    ]; },
    body: (h) => { const o = on(h); return `
<h2>What the calculator adds up</h2>
<p>The tool follows the CRA’s 2026 calculation sheets. Energy costs count up to ${h.eur(o.oeptc.energy_max)}; the property tax part adds ${h.eur(o.oeptc.prop_18_64[1])} plus a tenth of occupancy cost, capped at ${h.eur(o.oeptc.prop_18_64[0])} (${h.eur(o.oeptc.prop_65[1])} and ${h.eur(o.oeptc.prop_65[0])} from 65). Income then trims the OEPTC by ${h.pct(o.oeptc.rate, 0)} and the OSTC by ${h.pct(o.ostc.rate, 0)} of the excess, and the NOEC by ${h.pct(o.noec.rate, 0)} above ${h.eur(o.noec.thr_single)} single or ${h.eur(o.noec.thr_family)} family, for those living in the North on December 31, 2025.</p>
<h2>Typical cases for 2026–27</h2>
${table(h, 0)}
<p>The senior homeowner benefits from the larger age-65 property tax amount, and only the northern renter gets the NOEC. The last case shows the ${h.eur(o.otb.lump_max)} rule: a modest total arrives once, in July, rather than spread over the year.</p>
<h2>What it does not cover</h2>
<p>Reserve, long-term care and student residence rules (${h.eur(o.oeptc.max_reserve)} ceiling, ${h.eur(o.oeptc.student_res)} for a residence) and mid-year moves are not modelled. Ontario’s ${h.a('ontario-child-benefit', 'child benefit')} is a different program, paid with the federal ${h.a('ccb-calculator', 'child benefit')}, and the ${h.a('benefit-payment-dates', 'combined calendar')} lists every deposit. Figures come from the ${h.src('craOntario', 'CRA’s Ontario programs page')} and its ${h.src('oeptcSheet', '2026 calculation sheet')}.</p>
`; },
  },
  fr: {
    slug: 'prestation-trillium-ontario',
    nav: 'Prestation Trillium de l’Ontario',
    card: 'Les crédits d’énergie, d’impôts fonciers, de taxe de vente et du Nord réunis en un dépôt mensuel.',
    title: 'Prestation Trillium de l’Ontario 2026 : montants et dates',
    description: 'Prestation Trillium de l’Ontario 2026 : CIEFO jusqu’à 1 307 $ ou 1 488 $ à 65 ans, CTVO de 378 $ par personne, versée le 10, ou en juillet sous 500 $.',
    h1: 'La prestation Trillium de l’Ontario',
    intro: 'Indiquez votre revenu 2025, votre loyer ou vos impôts fonciers et la taille de votre famille pour voir les trois crédits que l’ARC verse en un seul dépôt Trillium dès juillet 2026.',
    resume: (h) => { const o = on(h); const d = otbDates(h); return `La prestation Trillium de l’Ontario de juillet 2026 à juin 2027 réunit trois crédits : le crédit d’impôt de l’Ontario pour les coûts d’énergie et les impôts fonciers (CIEFO), jusqu’à ${h.eur(o.oeptc.max_18_64)} par an de 18 à 64 ans et ${h.eur(o.oeptc.max_65)} dès 65 ans ; le crédit de taxe de vente (CTVO), ${h.eur(o.ostc.per_person)} par adulte et par enfant ; et le crédit pour les coûts d’énergie dans le Nord (CENO), jusqu’à ${h.eur(o.noec.max_single)} ou ${h.eur(o.noec.max_family)} pour une famille. L’ARC verse le total le 10 de chaque mois : le ${h.date(d[0])}, le ${h.date(d[1])}, le ${h.date(d[2])}, le ${h.date(d[3])}, le ${h.date(d[4])} et le ${h.date(d[5])}. Si le total annuel est de ${h.eur(o.otb.lump_max)} ou moins, il est payé en une seule fois en juillet. Les deux premiers crédits baissent au-delà de ${h.eur(o.oeptc.thr_single)} (personne seule) ou de ${h.eur(o.oeptc.thr_family)} (famille). Le montant reçu est celui de votre avis de l’ARC.`; },
    faqs: (h) => { const o = on(h); return [
      { q: 'Peut-on recevoir toute la prestation Trillium en juin 2027 plutôt que chaque mois ?', a: `Oui, si votre droit dépasse ${h.eur(o.otb.lump_max)}. Ce choix se fait sur le formulaire ON-BEN joint à la déclaration de 2025 ; l’ARC verse alors tout en un dépôt le ${h.date(h.P.x.gOtbDeferDate)}, à la fin de l’année de prestations. Les petits montants sont payés en juillet, quel que soit votre choix.` },
      { q: 'Quelle part du loyer compte pour le crédit pour l’énergie et les impôts fonciers ?', a: `${h.pct(o.oeptc.rent_share, 0)} du loyer payé en Ontario pour 2025 compte comme coût d’habitation, ajouté aux impôts fonciers éventuels. Sur la feuille de calcul de l’ARC, un locataire qui paie ${h.eur(CASES[0].rent!)} par an déclare donc ${h.eur(CASES[0].rent! * o.oeptc.rent_share)}, dont la partie énergie retient au plus ${h.eur(o.oeptc.energy_max)}.` },
      { q: 'Pourquoi ai-je reçu 10 $ de la prestation Trillium ?', a: `L’ARC arrondit les très petits droits vers le haut. Quand le total annuel des trois crédits se situe entre ${h.eur(o.otb.none_under)} et ${h.eur(o.otb.raised_to)}, un versement unique de ${h.eur(o.otb.raised_to)} est émis ; à ${h.eur(o.otb.none_under)} ou moins, rien n’est versé. Votre revenu est alors tout près du point où chaque crédit s’éteint.` },
      { q: 'Faut-il le formulaire ON-BEN pour toucher le crédit de taxe de vente de l’Ontario ?', a: `Non. Le crédit de taxe de vente se calcule à partir de la seule déclaration: sans loyer ni impôts fonciers, on reçoit tout de même ${h.eur(o.ostc.per_person)} par personne à faible revenu. Le formulaire ON-BEN, joint à la même déclaration, demande le CIEFO et le CENO.` },
    ]; },
    body: (h) => { const o = on(h); return `
<h2>Ce que le calculateur additionne</h2>
<p>L’outil suit les feuilles de calcul 2026 de l’ARC. L’énergie compte jusqu’à ${h.eur(o.oeptc.energy_max)} ; la partie impôts fonciers ajoute ${h.eur(o.oeptc.prop_18_64[1])} plus un dixième du coût d’habitation, plafonné à ${h.eur(o.oeptc.prop_18_64[0])} (${h.eur(o.oeptc.prop_65[1])} et ${h.eur(o.oeptc.prop_65[0])} dès 65 ans). Le revenu retranche ensuite ${h.pct(o.oeptc.rate, 0)} de l’excédent au CIEFO et ${h.pct(o.ostc.rate, 0)} au CTVO ; le CENO, réservé aux résidents du Nord au 31 décembre 2025, perd ${h.pct(o.noec.rate, 0)} au-delà de ${h.eur(o.noec.thr_single)} (seul) ou ${h.eur(o.noec.thr_family)} (famille).</p>
<h2>Cas types pour 2026-2027</h2>
${table(h, 1)}
<p>L’aîné propriétaire profite du montant foncier des 65 ans et plus. Le dernier cas illustre la règle des ${h.eur(o.otb.lump_max)} : un total modeste arrive une seule fois, en juillet, au lieu d’être étalé sur l’année.</p>
<h2>Ce que l’outil ne fait pas</h2>
<p>Les règles des réserves, des soins de longue durée et des résidences étudiantes (plafond de ${h.eur(o.oeptc.max_reserve)}, ${h.eur(o.oeptc.student_res)} en résidence) et les déménagements en cours d’année ne sont pas modélisés. La ${h.a('ontario-child-benefit', 'prestation ontarienne pour enfants')} est un autre programme, versé avec l’${h.a('ccb-calculator', 'allocation canadienne pour enfants')}, et le ${h.a('benefit-payment-dates', 'calendrier combiné')} donne tous les dépôts. Les chiffres viennent de la ${h.src('craOntario', 'page de l’ARC sur l’Ontario')} et de sa ${h.src('oeptcSheet', 'feuille de calcul 2026')}.</p>
`; },
  },
});
