import { defineGuide, type Helpers } from '../../lib/guide-types';

const INCOMES = [95000, 100000, 110000, 125000, 140000, 150000];
/** Pension complète sur un an au taux d'octobre à décembre 2026 (65 à 74 ans). */
const year = (h: Helpers) => h.P.oas.max_65_74 * 12;
const rows = (h: Helpers) => INCOMES.map((inc) => {
  const r25 = h.M.oasRecovery(inc, year(h), 2025), r26 = h.M.oasRecovery(inc, year(h), 2026);
  return [h.eur(inc), h.eur(r25, 2), h.eur(r25 / 12, 2), h.eur(r26, 2)];
});
const R = (h: Helpers) => h.P.oas.recovery;

export default defineGuide({
  id: 'oas-clawback',
  group: 'oas',
  order: 30,
  tool: 'clawback',
  related: ['old-age-security', 'rrif-gis-clawback', 'oas-deferral', 'oas-at-75', 'rrif-minimum-withdrawal'],
  sources: ['oasRecovery', 'oasPayments', 'oasQuarterly'],
  en: {
    slug: 'oas-clawback',
    nav: 'OAS clawback',
    card: 'The 15% recovery tax on OAS, the 2025 and 2026 income thresholds and the monthly withholding.',
    title: 'OAS Clawback 2026: Recovery Tax Thresholds and Amounts',
    description: 'OAS clawback 2026: 15% of net income above $93,454 for 2025 income and $95,323 for 2026 income, withheld from each OAS payment. Calculator and worked cases.',
    h1: 'OAS clawback calculator',
    intro: 'Enter your net world income to see how much of your Old Age Security pension the recovery tax takes back, per year and per payment.',
    resume: (h) => `The OAS clawback takes ${h.pct(R(h).rate, 0)} of your net world income above ${h.eur(R(h).thr_2025)} for 2025 income, and above ${h.eur(R(h).thr_2026)} for 2026 income. Service Canada calls it the recovery tax. It does not touch the Canada Pension Plan or any other income: it is capped at the Old Age Security pension itself, so it can at most cancel the pension. The 2025 threshold governs the payments from July 2026 to June 2027, the 2026 threshold those from July 2027 to June 2028. Service Canada’s own example is a 2025 income of ${h.eur(h.P.x.eRecoveryExampleIncome)}, which gives a repayment of ${h.eur(h.P.x.eRecoveryExample, 2)} for the year, or about ${h.eur(h.P.x.eRecoveryExample / 12, 2)} withheld from each monthly payment. Service Canada’s table places the point where the pension is fully recovered at ${h.eur(R(h).zero_2025[0])} of 2025 income for ages 65 to 74 and ${h.eur(R(h).zero_2025[1])} at 75 or older; for 2026 income, the published cut-offs of ${h.eur(R(h).zero_2026_est[0])} and ${h.eur(R(h).zero_2026_est[1])} carry the estimate footnote. The amount actually withheld is the one on your Service Canada notice.`,
    faqs: (h) => [
      { q: 'At what income does the OAS clawback start in 2026?', a: `It depends on the income year. For payments made from July 2026 to June 2027, the recovery tax applies to 2025 net world income above ${h.eur(R(h).thr_2025)}. From July 2027, it is 2026 income above ${h.eur(R(h).thr_2026)} that counts. Below the threshold nothing is withheld, and a dollar above it costs ${h.pct(R(h).rate, 0)} of a dollar of pension.` },
      { q: 'How does Service Canada withhold the OAS recovery tax each month?', a: `The net world income on your return is used to estimate the repayment for the following period. That annual amount is divided by twelve and deducted from each OAS payment. With a 2025 income of ${h.eur(110000)}, the full-year repayment works out to ${h.eur(h.M.oasRecovery(110000, year(h)), 2)}, or ${h.eur(h.M.oasRecovery(110000, year(h)) / 12, 2)} held back from every deposit.` },
      { q: 'Why are the 2026 maximum clawback thresholds called estimates?', a: `Service Canada computes the upper cut-offs, ${h.eur(R(h).zero_2026_est[0])} and ${h.eur(R(h).zero_2026_est[1])} for 2026 income, from the maximum OAS amounts. Its footnote says these figures are estimates from January to September of the tax year and final from October to December, because the quarterly pension amounts are only known as the year goes by. The starting threshold of ${h.eur(R(h).thr_2026)} is not affected.` },
      { q: 'Does the OAS clawback reduce my Guaranteed Income Supplement?', a: `No, because the two never overlap in practice. The Guaranteed Income Supplement stops well below the clawback zone: for a single senior the supplement ends at ${h.eur(h.P.gis.single.thr)} of income other than OAS, while the recovery tax only starts at ${h.eur(R(h).thr_2025)}. Someone hit by the clawback has an income far too high for the supplement.` },
    ],
    body: (h) => `
<h2>What the calculator computes</h2>
<p>You enter your net world income (line 23400 of the return), choose the income year, 2025 or 2026, and say whether you are 75 or older. The tool applies ${h.pct(R(h).rate, 0)} to the income above the threshold of that year, caps the result at a full year of pension at the October to December 2026 rate, and shows the annual repayment, the monthly withholding and the pension you keep. The thresholds come from the ${h.src('oasRecovery', 'Service Canada recovery tax page')}.</p>
<h2>Worked cases, ages 65 to 74</h2>
${h.table(['Net income', 'Repayment, 2025 income', 'Per month', 'Repayment, 2026 income'], rows(h), 'OAS recovery tax computed with the site’s engine', ['r', 'r', 'r', 'r'])}
<p>The higher 2026 threshold lowers every repayment by the same amount, ${h.eur(R(h).rate * (R(h).thr_2026 - R(h).thr_2025), 2)} a year, as long as the pension is not fully recovered. For the previous period, July 2025 to June 2026, the threshold was ${h.eur(R(h).thr_2024)} on 2024 income and the pension vanished at ${h.eur(h.P.x.eRecoveryZero2024[0])} and ${h.eur(h.P.x.eRecoveryZero2024[1])}.</p>
<h2>Limits of the tool</h2>
<p>The calculator caps the repayment at twelve payments of ${h.eur(h.P.oas.max_65_74, 2)} (or ${h.eur(h.P.oas.max_75, 2)} at 75 or older), so its zero point sits a little above Service Canada’s published cut-off, which is built on the maximum pension expected over the whole period. It assumes a full pension: with a ${h.a('oas-partial-pension', 'partial pension')} or a ${h.a('oas-deferral', 'deferred start')}, the cap changes and the ${h.a('old-age-security', 'OAS calculator')} gives the net amount. It does not estimate your net income for you: RRIF withdrawals, capital gains and pension income all feed it, as the ${h.a('rrif-gis-clawback', 'guide on RRIF withdrawals')} shows.</p>
`,
  },
  fr: {
    slug: 'recuperation-securite-vieillesse',
    nav: 'Récupération de la SV',
    card: 'L’impôt de récupération de 15 % sur la SV, les seuils de revenu 2025 et 2026 et la retenue mensuelle.',
    title: 'Récupération de la SV 2026 : seuils et impôt de récupération',
    description: 'Récupération de la SV 2026 : 15 % du revenu net au-delà de 93 454 $ (revenu 2025) et de 95 323 $ (revenu 2026), retenus sur chaque paiement. Calculateur et cas.',
    h1: 'Calculateur de l’impôt de récupération de la SV',
    intro: 'Indiquez votre revenu net mondial pour savoir quelle part de votre pension de la Sécurité de la vieillesse l’impôt de récupération reprend, par année et par paiement.',
    resume: (h) => `L’impôt de récupération de la SV prend ${h.pct(R(h).rate, 0)} de votre revenu net mondial au-delà de ${h.eur(R(h).thr_2025)} pour le revenu de 2025, et au-delà de ${h.eur(R(h).thr_2026)} pour le revenu de 2026. C’est ce qu’on appelle couramment la récupération de la pension de vieillesse. Il ne touche ni le Régime de pensions du Canada ni vos autres revenus : il est plafonné à la pension de la Sécurité de la vieillesse elle-même, qu’il peut au plus annuler. Le seuil de 2025 régit les paiements de juillet 2026 à juin 2027, celui de 2026 les paiements de juillet 2027 à juin 2028. L’exemple de Service Canada part d’un revenu de ${h.eur(h.P.x.eRecoveryExampleIncome)} en 2025, soit un remboursement de ${h.eur(h.P.x.eRecoveryExample, 2)} pour l’année, environ ${h.eur(h.P.x.eRecoveryExample / 12, 2)} retenus sur chaque paiement mensuel. Le tableau de Service Canada situe la récupération totale de la pension à ${h.eur(R(h).zero_2025[0])} de revenu de 2025 entre 65 et 74 ans et à ${h.eur(R(h).zero_2025[1])} à 75 ans ou plus ; pour le revenu de 2026, les seuils publiés de ${h.eur(R(h).zero_2026_est[0])} et ${h.eur(R(h).zero_2026_est[1])} portent la mention d’estimation. Le montant réellement retenu est celui de votre avis de Service Canada.`,
    faqs: (h) => [
      { q: 'À partir de quel revenu la récupération de la SV commence-t-elle en 2026 ?', a: `Tout dépend de l’année de revenu. Pour les paiements de juillet 2026 à juin 2027, l’impôt s’applique au revenu net mondial de 2025 qui dépasse ${h.eur(R(h).thr_2025)}. Dès juillet 2027, c’est le revenu de 2026 au-delà de ${h.eur(R(h).thr_2026)} qui compte. Sous le seuil, rien n’est retenu ; au-dessus, chaque dollar coûte ${h.pct(R(h).rate, 0)} d’un dollar de pension.` },
      { q: 'Comment Service Canada retient-il l’impôt de récupération chaque mois ?', a: `Le revenu net mondial déclaré sert à évaluer le remboursement de la période suivante. Ce montant annuel est réparti sur douze mois et déduit de chaque paiement de la SV. Avec un revenu de ${h.eur(110000)} en 2025, le remboursement annuel atteint ${h.eur(h.M.oasRecovery(110000, year(h)), 2)}, soit ${h.eur(h.M.oasRecovery(110000, year(h)) / 12, 2)} retenus sur chaque dépôt.` },
      { q: 'Pourquoi les seuils maximums de récupération de 2026 sont-ils des estimations ?', a: `Service Canada calcule les seuils supérieurs, ${h.eur(R(h).zero_2026_est[0])} et ${h.eur(R(h).zero_2026_est[1])} pour le revenu de 2026, à partir des montants maximaux de la SV. Sa note précise que ces chiffres sont estimatifs de janvier à septembre de l’année d’imposition et définitifs d’octobre à décembre, puisque les montants trimestriels ne sont connus qu’au fil de l’année. Le seuil de départ de ${h.eur(R(h).thr_2026)} n’est pas concerné.` },
      { q: 'La récupération de la SV réduit-elle mon Supplément de revenu garanti ?', a: `Non, car les deux ne se croisent pas en pratique. Le Supplément de revenu garanti s’arrête bien avant la zone de récupération : pour une personne seule, il prend fin à ${h.eur(h.P.gis.single.thr)} de revenu hors SV, alors que l’impôt de récupération ne commence qu’à ${h.eur(R(h).thr_2025)}. Qui subit la récupération a un revenu beaucoup trop élevé pour le supplément.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Vous saisissez votre revenu net mondial (ligne 23400 de la déclaration), choisissez l’année de revenu, 2025 ou 2026, et indiquez si vous avez 75 ans ou plus. L’outil applique ${h.pct(R(h).rate, 0)} au revenu qui dépasse le seuil de cette année, plafonne le résultat à une année de pension au taux d’octobre à décembre 2026, puis affiche le remboursement annuel, la retenue mensuelle et la pension conservée. Les seuils proviennent de la ${h.src('oasRecovery', 'page de Service Canada sur l’impôt de récupération')}.</p>
<h2>Cas calculés, de 65 à 74 ans</h2>
${h.table(['Revenu net', 'Remboursement, revenu 2025', 'Par mois', 'Remboursement, revenu 2026'], rows(h), 'Impôt de récupération de la SV calculé avec le moteur du site', ['r', 'r', 'r', 'r'])}
<p>Le seuil plus élevé de 2026 réduit chaque remboursement du même montant, ${h.eur(R(h).rate * (R(h).thr_2026 - R(h).thr_2025), 2)} par année, tant que la pension n’est pas entièrement récupérée. Pour la période précédente, de juillet 2025 à juin 2026, le seuil était de ${h.eur(R(h).thr_2024)} sur le revenu de 2024 et la pension disparaissait à ${h.eur(h.P.x.eRecoveryZero2024[0])} et ${h.eur(h.P.x.eRecoveryZero2024[1])}.</p>
<h2>Les limites de l’outil</h2>
<p>Le calculateur plafonne le remboursement à douze paiements de ${h.eur(h.P.oas.max_65_74, 2)} (ou ${h.eur(h.P.oas.max_75, 2)} à 75 ans ou plus) : son point zéro se situe donc un peu au-dessus du seuil publié par Service Canada, établi sur la pension maximale prévue pour toute la période. Il suppose une pension complète : avec une ${h.a('oas-partial-pension', 'pension partielle')} ou un ${h.a('oas-deferral', 'début reporté')}, le plafond change, et le ${h.a('old-age-security', 'calculateur de la SV')} donne le montant net. Il n’estime pas votre revenu net à votre place : retraits de FERR, gains en capital et rentes l’alimentent tous, comme le montre le ${h.a('rrif-gis-clawback', 'guide sur les retraits de FERR')}.</p>
`,
  },
});
