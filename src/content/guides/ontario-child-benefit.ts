import { defineGuide, type Helpers } from '../../lib/guide-types';

const O = (h: Helpers) => h.P.prov.on.ocb;
/** Exemple suivi dans la page : un enfant de moins de 6 ans, un de 6 à 17 ans, revenu sous le seuil de la POE. */
const EX = { under6: 1, age6to17: 1, afni: 24000 };
const ex = (h: Helpers) => ({ fed: h.M.ccb(EX), ocb: h.M.ontarioChildBenefit(EX.under6 + EX.age6to17, EX.afni) });
const sizes = [1, 2, 3, 4, 5];

export default defineGuide({
  id: 'ontario-child-benefit',
  group: 'provinces',
  order: 20,
  mini: 'ocbMonthlyDeposit',
  miniHref: 'ccb-calculator',
  related: ['ccb-calculator', 'canada-child-benefit', 'ontario-trillium-benefit', 'ccb-payment-dates', 'odsp-rates', 'bc-family-benefit'],
  sources: ['craOntario', 'ontarioOcb', 'ccbDates', 'ccbCalc'],
  en: {
    slug: 'ontario-child-benefit',
    nav: 'Ontario Child Benefit',
    card: 'Up to $1,760 per child, the low threshold where it starts to fall, and the single deposit it shares with the CCB.',
    title: 'Ontario Child Benefit 2026: Amount per Child and Threshold',
    description: 'Ontario Child Benefit 2026: up to $1,760 per child under 18, or $146.66 a month, in full when adjusted family net income is $26,865 or less, paid with the CCB.',
    h1: 'Ontario Child Benefit',
    intro: 'Ontario adds its own child benefit to the federal one, and the CRA pays both in a single deposit each month.',
    resume: (h) => { const o = O(h); return `The Ontario Child Benefit (OCB) pays up to ${h.eur(o.max_year)} per child under 18 for the benefit year from July 2026 to June 2027, which the CRA delivers as ${h.eur(o.max_month, 2)} a month for each child. Families receive the full amount when their 2025 adjusted family net income is ${h.eur(o.threshold)} or less. Above that line the CRA says you may get a partial benefit, but neither the CRA nor the Ontario government publishes the rate at which it is reduced, so this page gives the maximum and the threshold and does not guess what happens in between. There is no application: the CRA works out the OCB from the income tax and benefit returns it already uses for the Canada child benefit, and adds it to the same monthly deposit. The program is funded entirely by Ontario and administered by the CRA. For a parent of two children with modest income, it adds ${h.eur(o.max_month * 2, 2)} to each monthly payment. The amount you actually receive is the one on your CRA notice.`; },
    faqs: (h) => { const o = O(h); return [
      { q: 'Why is the Ontario Child Benefit $146.66 a month but $1,760 a year?', a: `Because the yearly figure is rounded. Twelve payments of ${h.eur(o.max_month, 2)} add up to ${h.eur(o.max_month * 12, 2)}, a few cents short of the ${h.eur(o.max_year)} that Ontario announces per child. The CRA pays the monthly figure, so over July 2026 to June 2027 a family at the maximum receives the slightly lower total for each child.` },
      { q: 'Do I have to apply for the Ontario Child Benefit separately from the CCB?', a: `No. The CRA uses the information from your income tax and benefit return to decide whether you qualify, and it pays the OCB automatically to families already set up for the Canada child benefit. What matters is filing your 2025 return, and your spouse’s or common-law partner’s, because the ${h.eur(o.threshold)} threshold applies to family income, not to yours alone.` },
      { q: 'How fast does the Ontario Child Benefit go down above $26,865?', a: `Nobody outside the CRA can say precisely for 2026. The CRA’s Ontario page states only that families above ${h.eur(o.threshold)} of adjusted family net income may receive a partial benefit, and Ontario’s own page gives no rate either. We do not publish an estimate: your CRA notice, issued after your return is assessed, shows the exact monthly OCB.` },
      { q: 'Is the Ontario Child Benefit a separate deposit in my bank account?', a: `No, it is merged with the federal benefit. The CRA sends one monthly payment combining the Canada child benefit and the OCB, on the child benefit dates: ${h.date(h.P.ccb.dates_2026[9])}, ${h.date(h.P.ccb.dates_2026[10])} and ${h.date(h.P.ccb.dates_2026[11])} for the end of 2026. Your notice breaks the total down so you can see the provincial share.` },
      { q: 'Which year’s income sets the Ontario Child Benefit paid from July 2026?', a: `Your 2025 adjusted family net income, from the returns filed in spring 2026. That figure fixes the OCB for July 2026 to June 2027, just as it does for the federal child benefit. A raise you get during 2026 therefore changes nothing until July 2027, when the 2026 returns take over.` },
      { q: 'What happens to the Ontario Child Benefit if we move to another province?', a: `It stops, because it is only paid to Ontario residents. Tell the CRA about the move: the federal child benefit continues, and the province you move to may pay its own program in the same deposit, such as the ${h.a('bc-family-benefit', 'BC family benefit')}. Quebec is the exception, since its family allowance is paid by Retraite Québec, not the CRA.` },
    ]; },
    body: (h) => { const o = O(h); const e = ex(h); const d = h.P.ccb.dates_2026; return `
<h2>Maximum by number of children</h2>
<p>The OCB is a flat amount per child, with no extra for a younger child and no smaller amount for the third or fourth. That makes the maximum simple to read: multiply ${h.eur(o.max_year)} by the number of children under 18.</p>
${h.table(['Children under 18', 'Maximum per year', 'Maximum per month'], sizes.map((n) => { const r = h.M.ontarioChildBenefit(n, 0); return [h.num(n), h.eur(r.max), h.eur(r.monthlyMax, 2)]; }), 'Ontario Child Benefit, July 2026 to June 2027, family income at or below the threshold', ['l', 'r', 'r'])}
<p>The monthly column is what lands in your account. The yearly column is Ontario’s headline figure, and the gap between them, a few cents per child, comes from rounding the monthly amount down.</p>
<h2>A threshold set very low</h2>
<p>The OCB starts to fall at ${h.eur(o.threshold)} of adjusted family net income. That is far below the point where the federal benefit begins its own reduction, ${h.eur(h.P.ccb.t1)}, so a couple working full time at modest wages is often already past the OCB threshold while still receiving the maximum Canada child benefit. In other words, the provincial benefit is aimed at the lowest-income families, and anything above the threshold should be treated as a bonus rather than counted on in a budget.</p>
<p>What happens above ${h.eur(o.threshold)} is the part nobody publishes. The CRA writes only that you may receive a partial benefit. Some older documents describe a reduction rate, but none appears on the current CRA or Ontario pages, and we do not reproduce a figure we cannot check. Our calculators therefore show the full OCB below the threshold and label it a ceiling above it. Your notice of determination gives the real number.</p>
<h2>One deposit, two programs</h2>
<p>Take a family with one child under 6 and one aged 6 to 17, and an adjusted family net income of ${h.eur(EX.afni)}. The federal child benefit for July 2026 to June 2027 comes to ${h.eur(e.fed.monthly, 2)} a month, and the OCB adds ${h.eur(e.ocb.monthlyMax, 2)}, since the family is under the threshold. The CRA sends ${h.eur(e.fed.monthly + e.ocb.monthlyMax, 2)} in a single transfer, on the same day as every other child benefit payment.</p>
<p>The 2026 dates are those of the federal calendar: ${d.map((x) => h.date(x)).join(', ')}. The December payment comes early, before the holidays. If a deposit has not arrived, the CRA asks you to wait ${h.num(h.P.missing_payment_wait.ccb_acfb)} business days before calling, the same delay as for the Canada child benefit.</p>
<!--mini:ocbMonthlyDeposit-->
<h2>Who qualifies</h2>
<p>The OCB goes to families who receive, or are entitled to, the Canada child benefit for a child under 18 and who live in Ontario. The CRA sets eligibility from your return, with no form to fill. Two practical conditions follow. First, the return has to be filed on time each spring even if you had little or no income, since a missing return stops both benefits from July. Second, if you have a spouse or common-law partner, their return counts too: the family income that the CRA compares with ${h.eur(o.threshold)} is the sum of both net incomes, adjusted.</p>
<p>The benefit is designed and paid for by Ontario. The CRA only runs it, which is why it appears on the CRA’s Ontario page and on your CCB notice rather than on a separate provincial statement. ${h.src('ontarioOcb', 'Ontario’s own page')} describes the program in the same terms.</p>
<h2>How Ontario compares with its neighbours</h2>
<p>Every province designs its child benefit differently. Families moving across a border should not expect the same amount, or the same threshold, on the other side.</p>
${h.table(['Province', 'Maximum, 1 child', 'Maximum, 2 children', 'Full amount up to'], (['on', 'bc', 'ab', 'qc'] as const).map((p) => { const a = h.M.provinceChildMax(p, 1), b = h.M.provinceChildMax(p, 2); return [{ on: 'Ontario', bc: 'British Columbia', ab: 'Alberta', qc: 'Quebec' }[p], h.eur(a.annualMax), h.eur(b.annualMax), a.threshold ? h.eur(a.threshold) : '–']; }), 'Provincial child benefits, yearly maximums for 2026 (Alberta: base plus working component; Quebec: calendar year, couple threshold)', ['l', 'r', 'r', 'r'])}
<p>British Columbia pays a little less for a first child but keeps a guaranteed floor well into middle incomes; Alberta splits its benefit into a base part and a part tied to earnings; Quebec pays far more per child but through Retraite Québec. Ontario’s design is the plainest of the four: one amount, one threshold.</p>
<h2>Mistakes that cost families money</h2>
<ul>
<li><strong>Not filing because income was low.</strong> A family with almost no income is exactly the one that gets the full ${h.eur(o.max_year)} per child, but only if the returns are filed.</li>
<li><strong>Forgetting to update marital status.</strong> A separation or a new partner changes family income, and the OCB is recalculated from it.</li>
<li><strong>Counting on the OCB above the threshold.</strong> Without a published rate, treat any partial amount as uncertain until the notice arrives.</li>
<li><strong>Confusing it with the Trillium benefit.</strong> The ${h.a('ontario-trillium-benefit', 'Ontario Trillium Benefit')} is paid on the 10th and covers energy, property tax and sales tax; the OCB comes with the child benefit around the 20th.</li>
</ul>
<p>Parents on social assistance should also read the ${h.a('odsp-rates', 'ODSP rates guide')}, and anyone checking the federal side can use the ${h.a('ccb-calculator', 'child benefit calculator')}. Amounts on this page come from ${h.src('craOntario', 'the CRA’s Ontario programs page')}.</p>
`; },
  },
  fr: {
    slug: 'prestation-ontarienne-enfants',
    nav: 'Prestation ontarienne pour enfants',
    card: 'Jusqu’à 1 760 $ par enfant, le seuil très bas où elle commence à baisser et le dépôt unique partagé avec l’ACE.',
    title: 'Prestation ontarienne pour enfants 2026 : montant et seuil',
    description: 'Prestation ontarienne pour enfants 2026 : jusqu’à 1 760 $ par enfant, soit 146,66 $ par mois, au complet sous 26 865 $ de revenu familial net rajusté.',
    h1: 'La prestation ontarienne pour enfants',
    intro: 'L’Ontario ajoute sa propre prestation pour enfants à celle du fédéral, et l’ARC verse les deux en un seul dépôt chaque mois.',
    resume: (h) => { const o = O(h); return `La prestation ontarienne pour enfants (POE) verse jusqu’à ${h.eur(o.max_year)} par enfant de moins de 18 ans pour l’année de prestations de juillet 2026 à juin 2027, que l’ARC paie à raison de ${h.eur(o.max_month, 2)} par mois et par enfant. Les familles touchent le montant complet quand leur revenu familial net rajusté de 2025 ne dépasse pas ${h.eur(o.threshold)}. Au-delà, l’ARC indique qu’une prestation partielle peut être versée, mais ni l’ARC ni le gouvernement de l’Ontario ne publient le taux de réduction : cette page donne donc le maximum et le seuil, sans deviner ce qui se passe entre les deux. Aucune demande n’est nécessaire : l’ARC calcule la POE à partir des déclarations de revenus et de prestations qu’elle utilise déjà pour l’allocation canadienne pour enfants, et l’ajoute au même dépôt mensuel. Le programme est financé entièrement par l’Ontario et administré par l’ARC. Pour un parent de deux enfants à revenu modeste, il ajoute ${h.eur(o.max_month * 2, 2)} à chaque versement mensuel. Le montant reçu est celui de votre avis de l’ARC.`; },
    faqs: (h) => { const o = O(h); return [
      { q: 'Pourquoi la POE est-elle de 146,66 $ par mois mais de 1 760 $ par année ?', a: `Parce que le montant annuel est arrondi. Douze versements de ${h.eur(o.max_month, 2)} donnent ${h.eur(o.max_month * 12, 2)}, quelques cents de moins que les ${h.eur(o.max_year)} annoncés par l’Ontario pour chaque enfant. L’ARC verse le montant mensuel : de juillet 2026 à juin 2027, une famille au maximum reçoit donc ce total légèrement inférieur par enfant.` },
      { q: 'Faut-il demander la prestation ontarienne pour enfants à part de l’ACE ?', a: `Non. L’ARC se sert des renseignements de votre déclaration de revenus et de prestations pour établir votre admissibilité, et verse la POE d’office aux familles déjà inscrites à l’allocation canadienne pour enfants. L’essentiel est de produire votre déclaration de 2025, et celle de votre époux ou conjoint de fait, car le seuil de ${h.eur(o.threshold)} vise le revenu familial, pas le vôtre seulement.` },
      { q: 'À quel rythme la POE baisse-t-elle au-delà de 26 865 $ ?', a: `Personne hors de l’ARC ne peut le dire avec précision pour 2026. La page de l’ARC sur l’Ontario précise seulement qu’au-delà de ${h.eur(o.threshold)} de revenu familial net rajusté, une prestation partielle peut être versée, et la page de l’Ontario ne donne aucun taux non plus. Nous ne publions pas d’estimation : l’avis de l’ARC, émis après l’établissement de la cotisation, indique la POE mensuelle exacte.` },
      { q: 'La POE arrive-t-elle dans un dépôt distinct de l’allocation fédérale ?', a: `Non, elle est fusionnée avec l’allocation fédérale. L’ARC envoie un seul paiement mensuel qui réunit l’allocation canadienne pour enfants et la POE, aux dates de l’allocation : le ${h.date(h.P.ccb.dates_2026[9])}, le ${h.date(h.P.ccb.dates_2026[10])} et le ${h.date(h.P.ccb.dates_2026[11])} pour la fin de 2026. Votre avis détaille le total, ce qui permet de voir la part provinciale.` },
      { q: 'Quel revenu sert à calculer la POE versée à partir de juillet 2026 ?', a: `Votre revenu familial net rajusté de 2025, tiré des déclarations produites au printemps 2026. Ce chiffre fixe la POE de juillet 2026 à juin 2027, comme pour l’allocation fédérale. Une augmentation de salaire obtenue en 2026 ne change donc rien avant juillet 2027, lorsque les déclarations de 2026 prendront le relais.` },
      { q: 'Que devient la POE si la famille déménage dans une autre province ?', a: `Elle cesse, puisqu’elle est réservée aux résidents de l’Ontario. Signalez le déménagement à l’ARC : l’allocation fédérale continue, et la nouvelle province peut verser son propre programme dans le même dépôt, comme l’${h.a('bc-family-benefit', 'allocation familiale de la C.-B.')}. Le Québec fait exception, son Allocation famille étant versée par Retraite Québec et non par l’ARC.` },
    ]; },
    body: (h) => { const o = O(h); const e = ex(h); const d = h.P.ccb.dates_2026; return `
<h2>Le maximum selon le nombre d’enfants</h2>
<p>La POE est un montant fixe par enfant : rien de plus pour un tout-petit, rien de moins pour le troisième ou le quatrième. Le maximum se lit donc facilement : ${h.eur(o.max_year)} multiplié par le nombre d’enfants de moins de 18 ans.</p>
${h.table(['Enfants de moins de 18 ans', 'Maximum annuel', 'Maximum mensuel'], sizes.map((n) => { const r = h.M.ontarioChildBenefit(n, 0); return [h.num(n), h.eur(r.max), h.eur(r.monthlyMax, 2)]; }), 'Prestation ontarienne pour enfants, juillet 2026 à juin 2027, revenu familial égal ou inférieur au seuil', ['l', 'r', 'r'])}
<p>La colonne mensuelle correspond à ce qui arrive dans votre compte. La colonne annuelle reprend le chiffre annoncé par l’Ontario ; l’écart, quelques cents par enfant, vient de l’arrondi du montant mensuel vers le bas.</p>
<h2>Un seuil fixé très bas</h2>
<p>La POE commence à diminuer à ${h.eur(o.threshold)} de revenu familial net rajusté. C’est bien en deçà du point où l’allocation fédérale entame sa propre réduction, ${h.eur(h.P.ccb.t1)} : un couple qui travaille à temps plein à salaire modeste a souvent déjà dépassé le seuil de la POE tout en recevant l’allocation canadienne maximale. Autrement dit, la prestation provinciale vise les familles au plus bas revenu, et tout montant au-delà du seuil doit être vu comme un appoint plutôt qu’inscrit au budget.</p>
<p>Ce qui se passe au-delà de ${h.eur(o.threshold)} n’est publié nulle part. L’ARC écrit seulement qu’une prestation partielle peut être versée. D’anciens documents évoquent un taux de réduction, mais aucun ne figure sur les pages actuelles de l’ARC ou de l’Ontario, et nous ne reproduisons pas un chiffre invérifiable. Nos calculateurs affichent donc la POE complète sous le seuil et la présentent comme un plafond au-dessus. L’avis de détermination donne le vrai montant.</p>
<h2>Un dépôt, deux programmes</h2>
<p>Prenons une famille avec un enfant de moins de 6 ans et un de 6 à 17 ans, et un revenu familial net rajusté de ${h.eur(EX.afni)}. L’allocation fédérale de juillet 2026 à juin 2027 atteint ${h.eur(e.fed.monthly, 2)} par mois, et la POE y ajoute ${h.eur(e.ocb.monthlyMax, 2)}, puisque la famille est sous le seuil. L’ARC verse ${h.eur(e.fed.monthly + e.ocb.monthlyMax, 2)} en un seul virement, le même jour que tout autre paiement d’allocation pour enfants.</p>
<p>Les dates de 2026 sont celles du calendrier fédéral : ${d.map((x) => h.date(x)).join(', ')}. Le versement de décembre arrive plus tôt, avant les Fêtes. Si un dépôt manque, l’ARC demande d’attendre ${h.num(h.P.missing_payment_wait.ccb_acfb)} jours ouvrables avant d’appeler, le même délai que pour l’allocation canadienne pour enfants.</p>
<!--mini:ocbMonthlyDeposit-->
<h2>Qui y a droit</h2>
<p>La POE s’adresse aux familles qui reçoivent l’allocation canadienne pour enfants, ou y ont droit, pour un enfant de moins de 18 ans, et qui habitent l’Ontario. L’ARC établit l’admissibilité à partir de la déclaration, sans formulaire. Deux conditions pratiques en découlent. D’abord, la déclaration doit être produite à temps chaque printemps, même avec peu ou pas de revenu : une déclaration manquante interrompt les deux prestations dès juillet. Ensuite, si vous avez un époux ou conjoint de fait, sa déclaration compte aussi : le revenu familial que l’ARC compare à ${h.eur(o.threshold)} additionne les deux revenus nets, rajustés.</p>
<p>La prestation est conçue et payée par l’Ontario. L’ARC ne fait que l’administrer, d’où sa présence sur la page de l’ARC consacrée à l’Ontario et sur votre avis d’allocation plutôt que sur un relevé provincial distinct. La ${h.src('ontarioOcb', 'page du gouvernement de l’Ontario')} décrit le programme dans les mêmes termes.</p>
<h2>L’Ontario face à ses voisines</h2>
<p>Chaque province conçoit sa prestation pour enfants à sa façon. Une famille qui change de province ne doit s’attendre ni au même montant ni au même seuil de l’autre côté.</p>
${h.table(['Province', 'Maximum, 1 enfant', 'Maximum, 2 enfants', 'Montant complet jusqu’à'], (['on', 'bc', 'ab', 'qc'] as const).map((p) => { const a = h.M.provinceChildMax(p, 1), b = h.M.provinceChildMax(p, 2); return [{ on: 'Ontario', bc: 'Colombie-Britannique', ab: 'Alberta', qc: 'Québec' }[p], h.eur(a.annualMax), h.eur(b.annualMax), a.threshold ? h.eur(a.threshold) : '–']; }), 'Prestations provinciales pour enfants, maximums annuels pour 2026 (Alberta : base et composante travail ; Québec : année civile, seuil des couples)', ['l', 'r', 'r', 'r'])}
<p>La Colombie-Britannique verse un peu moins pour un premier enfant mais garde un plancher jusqu’aux revenus moyens ; l’Alberta divise sa prestation entre une base et une partie liée au revenu de travail ; le Québec paie beaucoup plus par enfant, mais par l’entremise de Retraite Québec. La formule ontarienne est la plus simple des quatre : un montant, un seuil.</p>
<h2>Les erreurs qui coûtent cher aux familles</h2>
<ul>
<li><strong>Ne pas produire de déclaration faute de revenu.</strong> Une famille presque sans revenu est justement celle qui reçoit les ${h.eur(o.max_year)} complets par enfant, à condition de produire les déclarations.</li>
<li><strong>Oublier de signaler un changement d’état civil.</strong> Une séparation ou un nouveau conjoint modifie le revenu familial, et la POE est recalculée en conséquence.</li>
<li><strong>Compter sur la POE au-delà du seuil.</strong> Faute de taux publié, tout montant partiel reste incertain jusqu’à l’arrivée de l’avis.</li>
<li><strong>La confondre avec la prestation Trillium.</strong> La ${h.a('ontario-trillium-benefit', 'prestation Trillium de l’Ontario')} arrive le 10 et couvre l’énergie, les impôts fonciers et la taxe de vente ; la POE accompagne l’allocation pour enfants vers le 20.</li>
</ul>
<p>Les parents qui reçoivent de l’aide sociale liront aussi le ${h.a('odsp-rates', 'guide des taux du POSPH')}, et le volet fédéral se vérifie avec le ${h.a('ccb-calculator', 'calculateur de l’allocation pour enfants')}. Les montants de cette page viennent de la ${h.src('craOntario', 'page de l’ARC sur les programmes de l’Ontario')}.</p>
`; },
  },
});
