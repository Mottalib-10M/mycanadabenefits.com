import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

/** Cas types de l'ACT 2026, tous calculés par le moteur. */
const cases = (h: Helpers) => {
  const c = (family: boolean, working: number, afni: number, spouseWorking = 0, disability = false) => h.M.cwb({ family, working, afni, spouseWorking, disability });
  const e = h.eur;
  return [
    { en: `Single, earns ${e(12000)}`, fr: `Seul, gagne ${e(12000)}`, r: c(false, 12000, 12000) },
    { en: `Single, earns ${e(25000)}`, fr: `Seul, gagne ${e(25000)}`, r: c(false, 25000, 25000) },
    { en: `Single, earns ${e(32000)}`, fr: `Seul, gagne ${e(32000)}`, r: c(false, 32000, 32000) },
    { en: `Single with the DTC, earns ${e(20000)}`, fr: `Seul admis au CIPH, gagne ${e(20000)}`, r: c(false, 20000, 20000, 0, true) },
    { en: `Family, one earner at ${e(30000)}`, fr: `Famille, un revenu de ${e(30000)}`, r: c(true, 30000, 30000) },
    { en: `Family, one earner at ${e(42000)}`, fr: `Famille, un revenu de ${e(42000)}`, r: c(true, 42000, 42000) },
    { en: `Family, ${e(28000)} + ${e(14000)}`, fr: `Famille, ${e(28000)} + ${e(14000)}`, r: c(true, 28000, 42000, 14000) },
  ];
};
const rows = (h: Helpers, l: 'en' | 'fr') => cases(h).map((x) => [l === 'en' ? x.en : x.fr, h.eur(x.r.basic), h.eur(x.r.disability), h.eur(x.r.total), h.eur(x.r.advanceMax)]);
const S = (k: string) => k as SourceKey;

export default defineGuide({
  id: 'canada-workers-benefit',
  group: 'credits',
  order: 10,
  tool: 'cwb',
  related: ['advanced-canada-workers-benefit', 'cwb-disability-supplement', 'gst-credit-calculator', 'canada-groceries-essentials-benefit', 'disability-tax-credit'],
  sources: ['cwbHow', 'indexation', 'ita1227', S('cCwbClaim'), S('cCwbElig')],
  en: {
    slug: 'canada-workers-benefit',
    nav: 'Canada workers benefit',
    card: 'Your 2026 workers benefit from your earnings and family income, with the disability supplement.',
    title: 'CWB 2026: Canada Workers Benefit Amounts and Income Limits',
    description: 'Canada workers benefit 2026: up to $1,665 for a single worker and $2,869 for a family, cut by 15% of income above the threshold. Calculator with worked cases.',
    h1: 'Canada workers benefit calculator',
    intro: 'Enter your earnings and your family net income to see the refundable tax credit the CRA adds to your 2026 return.',
    resume: (h) => { const W = h.P.cwb; return `The Canada workers benefit for 2026 pays up to ${h.eur(W.max_single)} to a single worker and up to ${h.eur(W.max_family)} to a family, meaning a worker with a spouse, a common-law partner or an eligible dependant. It is a refundable credit claimed on line 45300, paid even when no tax is owed. The benefit builds up at ${h.pct(W.phase_in, 0)} of working income above ${h.eur(W.min_work)} until it reaches the maximum, then falls by ${h.pct(W.rate, 0)} of adjusted net income above ${h.eur(W.thr_single)} for a single person or ${h.eur(W.thr_family)} for a family. In a couple, up to ${h.eur(W.secondary_exempt)} of the lower earner’s working income is left out of the reduction. A worker approved for the disability tax credit can add a supplement of up to ${h.eur(W.dis_max)}. Half can arrive early as advance payments. Quebec, Alberta and Nunavut set their own amounts, which this calculator does not model.`; },
    faqs: (h) => { const W = h.P.cwb; return [
      { q: 'What working income do I need before the workers benefit starts?', a: `More than ${h.eur(W.min_work)} of employment or self-employment income in the year. Each dollar above that adds ${h.pct(W.phase_in, 0)} to the benefit, so a single worker reaches the ${h.eur(W.max_single)} ceiling after a few thousand dollars more. Employment insurance, social assistance and pensions do not count as working income, though they do count in the net income that reduces the benefit.` },
      { q: 'How does the secondary earner exemption change a couple’s workers benefit?', a: `The CRA removes up to ${h.eur(W.secondary_exempt)} of the lower earner’s working income from family net income before applying the ${h.pct(W.rate, 0)} reduction. In our table, a couple earning ${h.eur(28000)} and ${h.eur(14000)} keeps the full family amount, while a one-earner family with the same ${h.eur(42000)} income gets much less.` },
      { q: 'Can a full-time student claim the Canada workers benefit for 2026?', a: `Not if you were enrolled full time at a designated educational institution for more than ${h.num(h.P.x.cCwbStudentWeeks)} weeks in the year, unless you had an eligible dependant on December 31. You must also be ${h.num(h.P.x.cCwbMinAge)} or older on December 31 or live with a spouse, partner or child, and you are excluded after ${h.num(h.P.x.cCwbPrisonDays)} days or more in prison. Source: ${h.src(S('cCwbElig'))}.` },
    ]; },
    body: (h) => { const W = h.P.cwb; return `
<h2>What the calculator works out</h2>
<p>It applies the federal formula of section 122.7 of the Income Tax Act with the 2026 amounts the CRA published in its indexation table: the basic amount, the disability supplement for a worker approved for the disability tax credit, the income used for the reduction after the secondary earner exemption, and the share that can be paid in advance, ${h.pct(W.advance_share, 0)} of the total. It returns an annual figure for the 2026 tax year, the one you claim when you file your 2026 return in spring 2027.</p>
<h2>Worked cases for 2026</h2>
${h.table(['Situation', 'Basic amount', 'Disability supplement', 'Total', 'Advance share'], rows(h, 'en'), 'Canada workers benefit 2026, general federal rates, net income equal to working income unless stated', ['l', 'r', 'r', 'r', 'r'])}
<p>The single worker at ${h.eur(12000)} is already at the maximum, because the phase-in stops long before that income. At ${h.eur(25000)} nothing has been lost yet, since the reduction begins at ${h.eur(W.thr_single)}. At ${h.eur(32000)} the ${h.pct(W.rate, 0)} reduction has eaten a large part of the credit. For families the threshold is ${h.eur(W.thr_family)}, and the last two rows show why the second earner matters: the same family income gives two very different results.</p>
<h2>Inputs to have at hand</h2>
<p>Working income is employment plus net self-employment income for 2026; family net income is line 23600 of your return, plus your spouse’s. Net income is never taken below working income. The ${h.a('cwb-disability-supplement', 'supplement guide')} covers the disability part. By our arithmetic the basic amount reaches zero near ${h.eur(W.zero_single)} for a single person and ${h.eur(W.zero_family)} for a family, levels the CRA had not yet published for 2026.</p>
<h2>What it does not cover</h2>
<p>It does not model the separate amounts of Quebec, Alberta and Nunavut, a change of marital status during the year, or someone who was not resident in Canada for the whole year. It does not tell you what was already paid in advance: those payments appear on an RC210 slip and are reconciled on your return, as the ${h.a('advanced-canada-workers-benefit', 'advance payments guide')} shows. The amount you receive is the one on your notice of assessment from the CRA. Sources: ${h.src('indexation')}, ${h.src('cwbHow')} and ${h.src(S('cCwbClaim'))}.</p>
`; },
  },
  fr: {
    slug: 'allocation-canadienne-travailleurs',
    nav: 'Allocation canadienne pour les travailleurs',
    card: 'Votre ACT 2026 selon vos gains et le revenu familial, avec le supplément pour invalidité.',
    title: 'Allocation canadienne pour les travailleurs 2026 : montants',
    description: 'Allocation canadienne pour les travailleurs 2026 : 1 665 $ seul et 2 869 $ en famille, moins 15 % du revenu au-delà du seuil. Calculateur et cas types.',
    h1: 'Calcul de l’allocation canadienne pour les travailleurs',
    intro: 'Entrez vos gains et le revenu net de la famille pour voir le crédit remboursable que l’ARC ajoute à votre déclaration de 2026.',
    resume: (h) => { const W = h.P.cwb; return `L’allocation canadienne pour les travailleurs (ACT) de 2026 atteint ${h.eur(W.max_single)} pour une personne seule et ${h.eur(W.max_family)} pour une famille (travailleur avec conjoint ou personne à charge admissible). Ce crédit remboursable de la ligne 45300 est versé même sans impôt à payer. L’allocation se constitue à raison de ${h.pct(W.phase_in, 0)} du revenu de travail au-delà de ${h.eur(W.min_work)} jusqu’au maximum, puis baisse de ${h.pct(W.rate, 0)} du revenu net rajusté au-delà de ${h.eur(W.thr_single)} pour une personne seule ou de ${h.eur(W.thr_family)} pour une famille. En couple, jusqu’à ${h.eur(W.secondary_exempt)} du plus petit revenu de travail échappent à la réduction. Un travailleur admis au crédit d’impôt pour personnes handicapées ajoute un supplément d’au plus ${h.eur(W.dis_max)}. La moitié peut être versée d’avance. Le Québec, l’Alberta et le Nunavut fixent leurs propres montants, que ce calculateur ne reproduit pas.`; },
    faqs: (h) => { const W = h.P.cwb; return [
      { q: 'Quel revenu de travail faut-il avant de toucher l’ACT ?', a: `Plus de ${h.eur(W.min_work)} de salaire ou de revenu d’entreprise dans l’année. Chaque dollar au-delà ajoute ${h.pct(W.phase_in, 0)} à l’allocation, si bien qu’une personne seule atteint le plafond de ${h.eur(W.max_single)} après quelques milliers de dollars de plus. L’assurance-emploi et les pensions ne comptent pas comme revenu de travail, mais entrent dans le revenu net.` },
      { q: 'Comment l’exemption du deuxième revenu modifie-t-elle l’ACT d’un couple ?', a: `L’ARC retire du revenu familial net jusqu’à ${h.eur(W.secondary_exempt)} du revenu de travail du conjoint qui gagne le moins, avant d’appliquer la réduction de ${h.pct(W.rate, 0)}. Dans notre tableau, un couple qui gagne ${h.eur(28000)} et ${h.eur(14000)} garde le montant familial complet, alors qu’une famille à un seul revenu de ${h.eur(42000)} reçoit beaucoup moins.` },
      { q: 'Un étudiant à temps plein peut-il demander l’ACT pour 2026 ?', a: `Non s’il était inscrit à temps plein dans un établissement d’enseignement agréé pendant plus de ${h.num(h.P.x.cCwbStudentWeeks)} semaines dans l’année, sauf s’il avait une personne à charge admissible le 31 décembre. Une détention de ${h.num(h.P.x.cCwbPrisonDays)} jours ou plus exclut aussi, et il faut avoir ${h.num(h.P.x.cCwbMinAge)} ans le 31 décembre ou vivre avec un conjoint ou un enfant. Source : ${h.src(S('cCwbElig'))}.` },
    ]; },
    body: (h) => { const W = h.P.cwb; return `
<h2>Ce que calcule l’outil</h2>
<p>Il applique la formule fédérale de l’article 122.7 de la Loi de l’impôt sur le revenu avec les montants 2026 du tableau d’indexation de l’ARC : montant de base, supplément pour invalidité, revenu retenu après l’exemption du deuxième revenu et part versable d’avance, soit ${h.pct(W.advance_share, 0)} du total. Le résultat est annuel et vise l’année d’imposition 2026, déclarée au printemps 2027.</p>
<h2>Cas types pour 2026</h2>
${h.table(['Situation', 'Montant de base', 'Supplément pour invalidité', 'Total', 'Part anticipée'], rows(h, 'fr'), 'Allocation canadienne pour les travailleurs 2026, barème fédéral général, revenu net égal au revenu de travail sauf indication', ['l', 'r', 'r', 'r', 'r'])}
<p>À ${h.eur(12000)}, la personne seule touche déjà le maximum ; à ${h.eur(25000)}, rien n’est perdu, la réduction commençant à ${h.eur(W.thr_single)}. À ${h.eur(32000)}, la réduction de ${h.pct(W.rate, 0)} a déjà absorbé une bonne partie du crédit. En famille, le seuil est de ${h.eur(W.thr_family)} ; les deux dernières lignes montrent le poids du deuxième revenu.</p>
<h2>Les chiffres à préparer</h2>
<p>Le revenu de travail regroupe salaire et revenu net d’entreprise de 2026 ; le revenu familial net est la ligne 23600 de votre déclaration, plus celle du conjoint. Le ${h.a('cwb-disability-supplement', 'guide du supplément')} traite la partie invalidité. Selon notre calcul, le montant de base s’annule vers ${h.eur(W.zero_single)} seul et ${h.eur(W.zero_family)} en famille, des seuils que l’ARC n’avait pas publiés pour 2026.</p>
<h2>Ce qu’il ne fait pas</h2>
<p>Il ne reproduit ni les montants du Québec, de l’Alberta et du Nunavut, ni un changement d’état civil en cours d’année. Les avances déjà reçues (feuillet RC210) sont traitées dans le ${h.a('advanced-canada-workers-benefit', 'guide des paiements anticipés')}. Le montant versé est celui de votre avis de cotisation de l’ARC. Sources : ${h.src('indexation')}, ${h.src('cwbHow')} et ${h.src(S('cCwbClaim'))}.</p>
`; },
  },
});
