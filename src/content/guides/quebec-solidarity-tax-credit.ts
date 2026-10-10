import { defineGuide, type Helpers } from '../../lib/guide-types';

const S = (h: Helpers) => h.P.prov.qc.solidarity;
type Hh = { kind: 'alone' | 'single' | 'couple'; kids: number; north?: boolean };
/** Montant maximal avant réduction (paramètres de juillet 2026 à juin 2027 de Finances Québec), composante par composante. */
const parts = (h: Helpers, x: Hh) => {
  const s = S(h); const couple = x.kind === 'couple', alone = x.kind === 'alone';
  const qst = s.qst_base + (couple ? s.qst_spouse : 0) + (alone ? s.qst_alone : 0);
  const housing = (couple ? s.housing_couple : s.housing_single) + x.kids * s.housing_child;
  const north = x.north ? (couple ? 2 : 1) * s.northern_adult + x.kids * s.northern_child : 0;
  return { qst, housing, north, total: qst + housing + north };
};
const HH: Hh[] = [
  { kind: 'alone', kids: 0 },
  { kind: 'single', kids: 1 },
  { kind: 'couple', kids: 0 },
  { kind: 'couple', kids: 2 },
  { kind: 'couple', kids: 2, north: true },
];
/** Paramètres de la période précédente (juillet 2025 à juin 2026) face à ceux de 2026-2027. */
const prevRows = (h: Helpers, l: 0 | 1) => {
  const s = S(h); const p = h.P.x.gSolPrev;
  const rows: Array<[string, string, number, number]> = [
    ['QST, basic amount', 'TVQ, montant de base', p.qst_base, s.qst_base],
    ['QST, person living alone', 'TVQ, personne vivant seule', p.qst_alone, s.qst_alone],
    ['Housing, couple', 'Logement, couple', p.housing_couple, s.housing_couple],
    ['Housing, alone or single parent', 'Logement, seul ou monoparental', p.housing_single, s.housing_single],
    ['Housing, per child', 'Logement, par enfant', p.housing_child, s.housing_child],
    ['Northern village, per adult', 'Village nordique, par adulte', p.northern_adult, s.northern_adult],
    ['Reduction threshold', 'Seuil de réduction', p.threshold, s.threshold],
    ['Debt protection income', 'Revenu protégé contre les dettes', p.debt_thr, h.P.x.gSolDebtThr],
  ];
  return rows.map((r) => [r[l], h.eur(r[2]), h.eur(r[3])]);
};
const name = (x: Hh, l: 0 | 1) => {
  const k = x.kids ? (l ? `, ${x.kids} enfant${x.kids > 1 ? 's' : ''}` : `, ${x.kids} child${x.kids > 1 ? 'ren' : ''}`) : '';
  const base = x.kind === 'alone' ? (l ? 'Personne vivant seule' : 'Person living alone') : x.kind === 'single' ? (l ? 'Famille monoparentale' : 'Single parent') : (l ? 'Couple' : 'Couple');
  return `${base}${k}${x.north ? (l ? ', village nordique' : ', northern village') : ''}`;
};
const table = (h: Helpers, l: 0 | 1) => h.table(
  l ? ['Ménage', 'TVQ', 'Logement', 'Village nordique', 'Total avant réduction'] : ['Household', 'QST', 'Housing', 'Northern village', 'Total before reduction'],
  HH.map((x) => { const p = parts(h, x); return [name(x, l), h.eur(p.qst), h.eur(p.housing), h.eur(p.north), h.eur(p.total)]; }),
  l ? 'Crédit d’impôt pour solidarité, juillet 2026 à juin 2027, montants maximaux (Finances Québec)' : 'Solidarity tax credit, July 2026 to June 2027, maximum amounts (Finances Québec)',
  ['l', 'r', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'quebec-solidarity-tax-credit',
  group: 'provinces',
  order: 30,
  mini: 'qcSolidarityMax',
  miniHref: 'quebec-family-allowance',
  related: ['quebec-family-allowance', 'gst-credit-calculator', 'canada-groceries-essentials-benefit', 'quebec-pension-plan', 'benefit-payment-dates'],
  sources: ['qcParams', 'cgebAmounts', 'rqAf'],
  en: {
    slug: 'quebec-solidarity-tax-credit',
    nav: 'Quebec solidarity tax credit',
    card: 'The three components of Quebec’s solidarity credit for July 2026 to June 2027, and the income at which it starts to shrink.',
    title: 'Quebec Solidarity Tax Credit 2026: Components and Threshold',
    description: 'Quebec solidarity tax credit 2026: QST amount of $363, housing amount of $746 or $906, northern village amount of $2,134 per adult, reduced above $43,195.',
    h1: 'Quebec solidarity tax credit',
    intro: 'Quebec’s refundable solidarity credit adds up a sales tax part, a housing part and, in the far North, a northern village part, then trims the total above a family income threshold.',
    resume: (h) => { const s = S(h); return `The Quebec solidarity tax credit for July 2026 to June 2027 is built from three components set in Finances Québec’s 2026 parameters. The QST component is ${h.eur(s.qst_base)} for you, ${h.eur(s.qst_spouse)} more for a spouse and ${h.eur(s.qst_alone)} more if you live alone. The housing component is ${h.eur(s.housing_couple)} for a couple, ${h.eur(s.housing_single)} for a person living alone or a single-parent family, plus ${h.eur(s.housing_child)} per dependent child. Residents of a northern village add ${h.eur(s.northern_adult)} per adult and ${h.eur(s.northern_child)} per child. The total is reduced once family income passes ${h.eur(s.threshold)}. Revenu Québec, which administers the credit, did not let us read its pages, so the reduction rate is not verified here and we do not compute reduced amounts. A person living alone with low income can therefore receive up to ${h.eur(parts(h, HH[0]).total)} over the year, and a couple with two children ${h.eur(parts(h, HH[3]).total)}. These parameters stay fixed from July to June. The amount you receive is the one Revenu Québec determines from your return.`; },
    faqs: (h) => { const s = S(h); const a = parts(h, HH[0]); return [
      { q: 'How much is the solidarity tax credit for a person living alone in 2026–27?', a: `Up to ${h.eur(a.total)} for July 2026 to June 2027, if family income is at or below ${h.eur(s.threshold)}. That is ${h.eur(s.qst_base)} plus ${h.eur(s.qst_alone)} for the QST component and ${h.eur(s.housing_single)} for housing. Above the threshold the credit is reduced; Finances Québec’s parameters give the threshold but not the rate, which Revenu Québec applies.` },
      { q: 'What family income starts reducing the Quebec solidarity credit from July 2026?', a: `${h.eur(s.threshold)} of family income, the threshold in Finances Québec’s parameters for July 2026 to June 2027. For a couple, family income combines both spouses. Below it you keep the full total of your components; above it the credit shrinks, at a rate we could not verify on Revenu Québec’s site, so we give no reduced figure.` },
      { q: 'How much is the northern village amount of the solidarity credit?', a: `${h.eur(s.northern_adult)} per adult and ${h.eur(s.northern_child)} per dependent child for July 2026 to June 2027, on top of the other components. It is by far the largest piece of the credit: for a couple with two children in a northern village, it adds ${h.eur(parts(h, HH[4]).north)} to the yearly maximum.` },
      { q: 'Can Quebec keep my solidarity tax credit to pay a debt to the government?', a: `Partly, depending on income. Finances Québec’s parameters set a family income of ${h.eur(h.P.x.gSolDebtThr)} for July 2026 to June 2027: at or below it, only ${h.pct(h.P.x.gSolDebtShare, 0)} of the credit can be applied to a debt owed to the State. Above that income, the protection no longer applies and more of the credit can be offset.` },
      { q: 'Why do the solidarity credit amounts change in July instead of January?', a: `Because they are indexed on July 1 each year, not on January 1 like most Quebec tax parameters. The amounts then stay unchanged from July to the following June. That is why the figures on this page, published in November 2025, apply to payments from July 2026 to June 2027.` },
    ]; },
    body: (h) => { const s = S(h); const cg = h.M.cgeb({ couple: false, children: 0, afni: 15000 }); return `
<h2>The three components for 2026–27</h2>
<p>Finances Québec publishes the parameters each November in its document on the indexation of the personal tax system. The solidarity credit has its own table, with two columns: July 2025 to June 2026, and July 2026 to June 2027. The second column is the one that applies now.</p>
<h3>QST component</h3>
<p>This part compensates for the Quebec sales tax. Every eligible adult gets ${h.eur(s.qst_base)}, a spouse adds ${h.eur(s.qst_spouse)}, and a person who lives alone adds ${h.eur(s.qst_alone)}. A single parent lives with children, not alone, so the extra amount does not apply to them.</p>
<h3>Housing component</h3>
<p>The housing part is ${h.eur(s.housing_couple)} for a couple and ${h.eur(s.housing_single)} for a person living alone or a single-parent family, with ${h.eur(s.housing_child)} for each dependent child. Revenu Québec sets who can claim it, usually tied to the dwelling you live in; since its pages were not readable for us, our mini-simulator simply assumes you qualify and says so.</p>
<h3>Northern village component</h3>
<p>Residents of Quebec’s northern villages receive ${h.eur(s.northern_adult)} per adult and ${h.eur(s.northern_child)} per child, reflecting a much higher cost of living. In those households the northern part outweighs everything else. Our table adds it to the other two components; whether every combination is allowed is a Revenu Québec rule, so read the northern totals as upper bounds.</p>
<h2>Maximum amounts by household</h2>
${table(h, 0)}
<p>These totals apply only while family income stays at or below ${h.eur(s.threshold)}. They are yearly figures for the July 2026 to June 2027 period, before any reduction.</p>
<!--mini:qcSolidarityMax-->
<h2>The income threshold, and what we cannot tell you</h2>
<p>Above ${h.eur(s.threshold)} of family income, the credit starts to decline. The rate is set by law and applied by Revenu Québec, but it does not appear in the Finances Québec table, and Revenu Québec’s site refused our requests. Rather than publish a percentage we could not check, this page stops at the threshold. If your income is above it, the credit still exists, only smaller, and the exact figure appears on your notice of assessment or on your online file with Revenu Québec.</p>
<p>The same caution applies to the payment calendar and the precise eligibility rules for each component. They are administered by Revenu Québec, and we only report here what Finances Québec published.</p>
<h2>What changed in July 2026</h2>
<p>Each amount rose slightly when the new period began. The table compares the two columns of the Finances Québec document.</p>
${h.table(['Parameter', 'July 2025 to June 2026', 'July 2026 to June 2027'], prevRows(h, 0), 'Solidarity tax credit parameters, two consecutive periods (Finances Québec)', ['l', 'r', 'r'])}
<p>The increases are a few dollars per component, about the pace of Quebec’s ${h.pct(h.P.prov.qc.indexation, 2)} indexation for 2026. The threshold moved up by ${h.eur(s.threshold - h.P.x.gSolPrev.threshold)}: a household whose income did not change now sits that much further below it, or that much less above it.</p>
<h2>A protection for low-income households</h2>
<p>When someone owes money to the Quebec government, refundable credits can be used to pay the debt. For the solidarity credit, the parameters protect the poorest households: if family income is ${h.eur(h.P.x.gSolDebtThr)} or less, no more than ${h.pct(h.P.x.gSolDebtShare, 0)} of the credit can be applied to a debt owed to the State. The rest still reaches the household.</p>
<h2>Why the year runs from July to June</h2>
<p>Most Quebec tax parameters are indexed on January 1. The solidarity credit is the exception: its amounts are indexed on July 1 and remain unchanged until the following June. This matches the federal benefit year, which also runs from July to June.</p>
<h2>Next to the federal credit</h2>
<p>Quebec residents also receive the federal Canada Groceries and Essentials Benefit, which replaced the GST/HST credit in July 2026. It is separate, paid by the CRA, and calculated with its own rules. For a single adult with ${h.eur(15000)} of family net income, the federal benefit comes to ${h.eur(cg.annual)} for the year, on top of the solidarity credit. The ${h.a('gst-credit-calculator', 'federal credit calculator')} gives your figure, and the ${h.a('canada-groceries-essentials-benefit', 'groceries benefit guide')} explains the change of name.</p>
<p>Families with children should also check the ${h.a('quebec-family-allowance', 'Quebec family allowance')}, paid by Retraite Québec rather than Revenu Québec. Parameters on this page come from the ${h.src('qcParams', 'Finances Québec 2026 parameters')}; federal amounts come from the ${h.src('cgebAmounts', 'CRA’s CGEB amounts page')}.</p>
<h2>Getting the credit</h2>
<p>The solidarity credit is claimed through your Quebec income tax return. Filing every spring is what keeps it coming, even with little or no income, and couples should make sure both returns are filed since the threshold applies to family income. A change in your situation during the period, such as a move, a separation or a birth, can change the amount, so report it to Revenu Québec rather than wait for the next return.</p>
`; },
  },
  fr: {
    slug: 'credit-solidarite-quebec',
    nav: 'Crédit pour solidarité',
    card: 'Les trois composantes du crédit pour solidarité de juillet 2026 à juin 2027, et le revenu à partir duquel il diminue.',
    title: 'Crédit d’impôt pour solidarité 2026 : montants et seuil',
    description: 'Crédit d’impôt pour solidarité 2026 : 363 $ pour la TVQ, 746 $ ou 906 $ pour le logement, 2 134 $ par adulte en village nordique, réduit au-delà de 43 195 $.',
    h1: 'Le crédit d’impôt pour solidarité',
    intro: 'Le crédit d’impôt remboursable pour solidarité additionne une composante TVQ, une composante logement et, dans le Grand Nord, une composante village nordique, puis réduit le total au-delà d’un seuil de revenu familial.',
    resume: (h) => { const s = S(h); return `Le crédit d’impôt pour solidarité de juillet 2026 à juin 2027 se compose de trois montants fixés dans les paramètres 2026 de Finances Québec. La composante TVQ vaut ${h.eur(s.qst_base)} pour vous, ${h.eur(s.qst_spouse)} de plus pour un conjoint et ${h.eur(s.qst_alone)} de plus si vous vivez seul. La composante logement est de ${h.eur(s.housing_couple)} pour un couple, de ${h.eur(s.housing_single)} pour une personne vivant seule ou une famille monoparentale, plus ${h.eur(s.housing_child)} par enfant à charge. Les résidents d’un village nordique ajoutent ${h.eur(s.northern_adult)} par adulte et ${h.eur(s.northern_child)} par enfant. Le total diminue dès que le revenu familial dépasse ${h.eur(s.threshold)}. Revenu Québec, qui administre le crédit, a bloqué notre lecture de ses pages : le taux de réduction n’est donc pas vérifié ici, et nous ne calculons aucun montant réduit. Une personne vivant seule à faible revenu peut ainsi recevoir jusqu’à ${h.eur(parts(h, HH[0]).total)} sur l’année, et un couple avec deux enfants ${h.eur(parts(h, HH[3]).total)}. Ces paramètres restent fixes de juillet à juin. Le montant reçu est celui que Revenu Québec établit à partir de votre déclaration.`; },
    faqs: (h) => { const s = S(h); const a = parts(h, HH[0]); return [
      { q: 'Combien vaut le crédit pour solidarité pour une personne vivant seule en 2026-2027 ?', a: `Jusqu’à ${h.eur(a.total)} de juillet 2026 à juin 2027, si le revenu familial ne dépasse pas ${h.eur(s.threshold)}. Ce total réunit ${h.eur(s.qst_base)} et ${h.eur(s.qst_alone)} pour la composante TVQ, et ${h.eur(s.housing_single)} pour le logement. Au-delà du seuil, le crédit diminue ; les paramètres de Finances Québec donnent le seuil mais pas le taux, appliqué par Revenu Québec.` },
      { q: 'À partir de quel revenu familial le crédit pour solidarité diminue-t-il dès juillet 2026 ?', a: `À partir de ${h.eur(s.threshold)} de revenu familial, le seuil prévu par Finances Québec pour juillet 2026 à juin 2027. Pour un couple, le revenu familial additionne celui des deux conjoints. Sous ce seuil, vous gardez le total de vos composantes ; au-dessus, le crédit baisse à un taux que nous n’avons pas pu vérifier chez Revenu Québec, d’où l’absence de montant réduit.` },
      { q: 'Combien vaut la composante village nordique du crédit pour solidarité ?', a: `${h.eur(s.northern_adult)} par adulte et ${h.eur(s.northern_child)} par enfant à charge de juillet 2026 à juin 2027, en plus des autres composantes. C’est de loin la plus grosse partie du crédit : pour un couple avec deux enfants dans un village nordique, elle ajoute ${h.eur(parts(h, HH[4]).north)} au maximum annuel.` },
      { q: 'Le gouvernement peut-il garder mon crédit pour solidarité pour payer une dette ?', a: `En partie, selon le revenu. Les paramètres de Finances Québec fixent un revenu familial de ${h.eur(h.P.x.gSolDebtThr)} pour juillet 2026 à juin 2027 : à ce niveau ou en dessous, seulement ${h.pct(h.P.x.gSolDebtShare, 0)} du crédit peut servir au paiement d’une dette envers l’État. Au-delà, cette protection ne joue plus et une plus grande part peut être retenue.` },
      { q: 'Pourquoi les montants du crédit pour solidarité changent-ils en juillet plutôt qu’en janvier ?', a: `Parce qu’ils sont indexés le 1er juillet de chaque année, et non le 1er janvier comme la plupart des paramètres fiscaux du Québec. Les montants restent ensuite inchangés jusqu’au mois de juin suivant. C’est pourquoi les chiffres de cette page, publiés en novembre 2025, valent pour les versements de juillet 2026 à juin 2027.` },
    ]; },
    body: (h) => { const s = S(h); const cg = h.M.cgeb({ couple: false, children: 0, afni: 15000 }); return `
<h2>Les trois composantes pour 2026-2027</h2>
<p>Finances Québec publie chaque mois de novembre les paramètres du régime d’imposition des particuliers. Le crédit pour solidarité y a son propre tableau, en deux colonnes : juillet 2025 à juin 2026, puis juillet 2026 à juin 2027. C’est la seconde qui s’applique maintenant.</p>
<h3>La composante TVQ</h3>
<p>Elle compense la taxe de vente du Québec. Chaque adulte admissible obtient ${h.eur(s.qst_base)}, un conjoint ajoute ${h.eur(s.qst_spouse)}, et une personne vivant seule ajoute ${h.eur(s.qst_alone)}. Un parent seul vit avec ses enfants, pas seul : le montant additionnel ne s’applique donc pas à lui.</p>
<h3>La composante logement</h3>
<p>Elle est de ${h.eur(s.housing_couple)} pour un couple et de ${h.eur(s.housing_single)} pour une personne vivant seule ou une famille monoparentale, avec ${h.eur(s.housing_child)} par enfant à charge. Revenu Québec définit qui peut la demander, en général selon le logement occupé ; ses pages nous étant inaccessibles, notre mini-simulateur suppose simplement que vous y avez droit, et l’indique.</p>
<h3>La composante village nordique</h3>
<p>Les résidents des villages nordiques du Québec reçoivent ${h.eur(s.northern_adult)} par adulte et ${h.eur(s.northern_child)} par enfant, pour tenir compte d’un coût de la vie bien plus élevé. Dans ces ménages, la part nordique dépasse tout le reste. Notre tableau l’additionne aux deux autres composantes ; comme le cumul relève des règles de Revenu Québec, lisez les totaux nordiques comme des maximums.</p>
<h2>Montants maximaux selon le ménage</h2>
${table(h, 1)}
<p>Ces totaux ne valent que si le revenu familial reste égal ou inférieur à ${h.eur(s.threshold)}. Ce sont des montants annuels pour la période de juillet 2026 à juin 2027, avant toute réduction.</p>
<!--mini:qcSolidarityMax-->
<h2>Le seuil de revenu, et ce que nous ne pouvons pas dire</h2>
<p>Au-delà de ${h.eur(s.threshold)} de revenu familial, le crédit commence à baisser. Le taux est fixé par la loi et appliqué par Revenu Québec, mais il ne figure pas au tableau de Finances Québec, et le site de Revenu Québec a refusé nos demandes. Plutôt que de publier un pourcentage invérifiable, cette page s’arrête au seuil. Si votre revenu le dépasse, le crédit existe toujours, en plus petit, et le chiffre exact figure sur votre avis de cotisation ou dans votre dossier en ligne chez Revenu Québec.</p>
<p>La même prudence vaut pour le calendrier des versements et les règles précises d’admissibilité de chaque composante. Revenu Québec les administre, et nous rapportons seulement ce que Finances Québec a publié.</p>
<h2>Ce qui a changé en juillet 2026</h2>
<p>Chaque montant a légèrement augmenté au début de la nouvelle période. Le tableau compare les deux colonnes du document de Finances Québec.</p>
${h.table(['Paramètre', 'Juillet 2025 à juin 2026', 'Juillet 2026 à juin 2027'], prevRows(h, 1), 'Paramètres du crédit pour solidarité, deux périodes consécutives (Finances Québec)', ['l', 'r', 'r'])}
<p>Les hausses sont de quelques dollars par composante, à peu près au rythme de l’indexation de ${h.pct(h.P.prov.qc.indexation, 2)} retenue par le Québec pour 2026. Le seuil a monté de ${h.eur(s.threshold - h.P.x.gSolPrev.threshold)} : un ménage dont le revenu n’a pas bougé se trouve d’autant plus loin sous ce seuil, ou d’autant moins au-dessus.</p>
<h2>Une protection pour les ménages à faible revenu</h2>
<p>Quand une personne doit de l’argent au gouvernement du Québec, les crédits remboursables peuvent servir à rembourser la dette. Pour le crédit pour solidarité, les paramètres protègent les ménages les plus pauvres : si le revenu familial est de ${h.eur(h.P.x.gSolDebtThr)} ou moins, au plus ${h.pct(h.P.x.gSolDebtShare, 0)} du crédit peut être affecté au paiement d’une dette envers l’État. Le reste parvient quand même au ménage.</p>
<h2>Pourquoi l’année va de juillet à juin</h2>
<p>La plupart des paramètres fiscaux québécois sont indexés le 1er janvier. Le crédit pour solidarité fait exception : ses montants sont indexés le 1er juillet et ne bougent plus jusqu’au mois de juin suivant. Ce calendrier rejoint celui des prestations fédérales, qui courent aussi de juillet à juin.</p>
<h2>À côté du crédit fédéral</h2>
<p>Les Québécois reçoivent aussi l’allocation canadienne pour l’épicerie et les besoins essentiels, qui a remplacé le crédit pour la TPS/TVH en juillet 2026. Elle est distincte, versée par l’ARC et calculée selon ses propres règles. Pour un adulte seul dont le revenu familial net est de ${h.eur(15000)}, l’allocation fédérale atteint ${h.eur(cg.annual)} pour l’année, en plus du crédit pour solidarité. Le ${h.a('gst-credit-calculator', 'calculateur du crédit fédéral')} donne votre chiffre, et le ${h.a('canada-groceries-essentials-benefit', 'guide de l’allocation pour l’épicerie')} explique le changement de nom.</p>
<p>Les familles avec enfants vérifieront aussi l’${h.a('quebec-family-allowance', 'Allocation famille')}, versée par Retraite Québec et non par Revenu Québec. Les paramètres de cette page viennent des ${h.src('qcParams', 'paramètres 2026 de Finances Québec')} ; les montants fédéraux, de la ${h.src('cgebAmounts', 'page de l’ARC sur les montants de l’ACEBE')}.</p>
<h2>Obtenir le crédit</h2>
<p>Le crédit pour solidarité se demande dans votre déclaration de revenus du Québec. La produire chaque printemps, même avec peu ou pas de revenu, est ce qui le maintient ; un couple s’assurera que les deux déclarations sont produites, le seuil visant le revenu familial. Un changement de situation pendant la période, comme un déménagement, une séparation ou une naissance, peut modifier le montant : mieux vaut le signaler à Revenu Québec sans attendre la déclaration suivante.</p>
`; },
  },
});
