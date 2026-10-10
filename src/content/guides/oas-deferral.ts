import { defineGuide, type Helpers } from '../../lib/guide-types';

const AGES = [65, 66, 67, 68, 69, 70];
const full = (h: Helpers, a: number) => h.M.oas({ years: h.P.oas.res_full, startAge: a });
/** Années de versement après le début nécessaires pour rattraper un début à 65 ans (identique pour tout âge de début). */
const catchUp = (h: Helpers) => 1 / (h.P.oas.defer * 12);
const schedule = (h: Helpers) => AGES.map((a) => {
  const r = full(h, a), base = full(h, 65).gross;
  const be = a === 65 ? '–' : h.num(a + (base * (a - 65)) / (r.gross - base), 1);
  return [String(a), h.pct(r.deferral, 1), h.eur(r.gross, 2), h.eur(r.gross * 12, 2), be];
});
/** Personne seule à faible revenu : SRG mensuel perdu pendant le report. */
const LOW = 15000;
const lostGis = (h: Helpers) => h.M.gis('single', LOW).monthly;
/** Revenu d'emploi élevé à 66 ans : la SV de cette année-là serait entièrement récupérée. */
const HIGH = 160000;

export default defineGuide({
  id: 'oas-deferral',
  group: 'oas',
  order: 20,
  mini: 'oasDeferStart',
  miniHref: 'old-age-security',
  related: ['old-age-security', 'oas-clawback', 'guaranteed-income-supplement', 'cpp-at-60-or-70', 'oas-partial-pension', 'oas-at-75'],
  sources: ['oasStart', 'oasApply', 'oasQuarterly', 'oasRecovery', 'oasAmount'],
  en: {
    slug: 'oas-deferral',
    nav: 'Deferring OAS',
    card: 'Starting OAS between 65 and 70: the monthly gain, the break-even age and the GIS you give up.',
    title: 'OAS Deferral 2026: Start at 70 for $1,037.00 a Month',
    description: 'OAS deferral 2026: each month after 65 adds 0.6%, up to 36% at 70, or $1,037.00 a month in late 2026, but the GIS is never deferred. Break-even and examples.',
    h1: 'Deferring your Old Age Security pension',
    intro: 'You can start Old Age Security at any month between 65 and 70, and each month of waiting raises the pension for life, with one large exception for low incomes.',
    resume: (h) => `Each month you delay Old Age Security after 65 raises the pension by ${h.pct(h.P.oas.defer, 1)}, up to ${h.pct(h.P.oas.defer_max, 0)} at 70. In Service Canada’s own example for October to December 2026, a full pension that would be ${h.eur(full(h, 65).gross, 2)} a month at 65 becomes ${h.eur(h.P.oas.defer_70_example, 2)} when started at 70. The increase is permanent and stacks with the quarterly indexation, so the gap in dollars widens over time. There is no gain in waiting past 70, since the increase stops there. The trade-off is simple to state: you give up up to five years of payments in exchange for a larger cheque. In today’s dollars, the larger pension catches up with the smaller one about ${h.num(catchUp(h), 1)} years after it starts, whatever the start age, so a pension started at 70 pulls ahead around age ${h.num(70 + catchUp(h), 0)}. The Guaranteed Income Supplement does not follow: Service Canada states that it is not paid while OAS is deferred and that its amount does not increase when you delay. Your notice from Service Canada gives the amount actually granted.`,
    faqs: (h) => [
      { q: 'What does each month of OAS deferral add to the pension?', a: `Exactly ${h.pct(h.P.oas.defer, 1)} of the pension you would have received at 65, for each month between your 65th birthday and the start date, up to sixty months. A full pension started at 67 in the October to December 2026 quarter is ${h.eur(full(h, 67).gross, 2)} a month instead of ${h.eur(full(h, 65).gross, 2)}, and the difference is paid for life.` },
      { q: 'Should low-income seniors delay OAS to get more later?', a: `Usually not. The Guaranteed Income Supplement can only be paid to someone who receives OAS, and Service Canada states that it does not increase when OAS is delayed. A single senior with ${h.eur(LOW)} of other income would give up about ${h.eur(lostGis(h), 2)} of GIS each month while waiting, on top of the OAS itself (GIS model, accurate to about a dollar).` },
      { q: 'How do I delay OAS after receiving an automatic enrolment letter?', a: `Sign in to My Service Canada Account, open your profile and choose “Delay Receiving OAS/GIS Pension”, or contact Service Canada directly. The enrolment letter usually arrives around your 64th birthday, and the online option becomes available at least one month after that birthday, which leaves time to pick a later start before the first payment.` },
      { q: 'At what age does a deferred OAS pension break even?', a: `In constant dollars, a pension started at age A overtakes one started at 65 about ${h.num(catchUp(h), 1)} years after A. The reason is that each month waited costs one month of payment but adds ${h.pct(h.P.oas.defer, 1)} to every later payment, and one divided by that rate gives the same delay at every age. Started at 68, the crossover comes near ${h.num(68 + catchUp(h), 0)}.` },
      { q: 'Does deferring OAS change the recovery tax threshold?', a: `No. The threshold is the same for everyone, ${h.eur(h.P.oas.recovery.thr_2025)} of 2025 net income for payments from July 2026 to June 2027. A deferred pension is larger, so more of it remains when the ${h.pct(h.P.oas.recovery.rate, 0)} recovery applies, and the pension is fully recovered only at a higher income than a pension started at 65.` },
    ],
    body: (h) => `
<h2>The monthly amount at each start age</h2>
<p>The table applies the increase to the full pension of the October to December 2026 quarter, for someone with ${h.num(h.P.oas.res_full)} years in Canada after 18. The last column is the age at which the total received from that start overtakes the total received from 65, without indexation or interest.</p>
${h.table(['Start age', 'Increase', 'Per month', 'Per year', 'Overtakes 65 at'], schedule(h), 'Deferred OAS pension, October to December 2026 rates (computed with the site’s engine)', ['l', 'r', 'r', 'r', 'r'])}
<p>The figures match the example table on the ${h.src('oasStart', 'Service Canada page on when to start')}, which ends with ${h.eur(h.P.oas.defer_70_example, 2)} at 70. A partial pensioner applies the same percentage to a smaller base: deferral multiplies what you earned through residence, it does not replace it.</p>
<h2>Why the crossover is always about ${h.num(catchUp(h), 0)} years away</h2>
<p>Waiting one month means losing one payment. In exchange, every later payment is ${h.pct(h.P.oas.defer, 1)} larger. To earn back one lost payment, you need about ${h.num(1 / h.P.oas.defer, 0)} larger payments, which is ${h.num(catchUp(h), 1)} years. Because the rate is the same for every month between 65 and 70, the arithmetic does not depend on how long you wait: someone who starts at 66 catches up near ${h.num(66 + catchUp(h), 0)}, someone who starts at 70 near ${h.num(70 + catchUp(h), 0)}.</p>
<p>Indexation does not change this, since both pensions rise by the same percentage each quarter. Two things do. Investment returns on the payments you would have received at 65 push the crossover later. Taxes can matter too, since the larger pension arrives in years when other income may be lower. Health and family history matter more than any formula: deferral is a bet on living well past the crossover, and the larger pension then acts as insurance against running out of savings at 90.</p>
<h2>The GIS trap for modest incomes</h2>
<p>Service Canada is explicit on two points. If you do not receive the OAS pension, you cannot get the Guaranteed Income Supplement, and the supplement and the Allowance do not increase when you delay OAS. For anyone whose income would qualify for the supplement, deferral costs twice: the OAS itself and the GIS that would have come with it.</p>
<p>Take a single senior with ${h.eur(LOW)} a year of CPP and private pension income. At 65 they would receive the full OAS of ${h.eur(full(h, 65).gross, 2)} plus about ${h.eur(lostGis(h), 2)} of GIS each month, according to the site’s GIS model, which matches the published grid at its thresholds and stays within about a dollar a month between them. Waiting until 70 forgoes about ${h.eur(lostGis(h) * 12 * 5)} of supplement over five years, and when the pension finally starts, the GIS is the same as it would have been. The ${h.a('guaranteed-income-supplement', 'GIS calculator')} gives the amount for your income.</p>
<p>The spouse is affected too. While you defer, your spouse or common-law partner aged 60 to 64 cannot apply for the Allowance based on your pension, which Service Canada lists alongside the GIS rule.</p>
<h2>When deferring costs nothing: the recovery tax years</h2>
<p>At the other end of the income scale, deferral can be free. Someone still earning ${h.eur(HIGH)} at 66 would see the recovery tax take back ${h.eur(h.M.oasRecovery(HIGH, full(h, 65).gross * 12), 2)} of a ${h.eur(full(h, 65).gross * 12, 2)} pension, which is the whole thing at October 2026 rates. Starting OAS that year would mean receiving nothing, then losing the ${h.pct(h.P.oas.defer, 1)} monthly increase for good. Deferring until income drops keeps the increase and gives up no money.</p>
<p>The recovery threshold is the same for everyone, ${h.eur(h.P.oas.recovery.thr_2025)} of 2025 income and ${h.eur(h.P.oas.recovery.thr_2026)} of 2026 income. A deferred pension is larger, so the recovery runs longer before it reaches zero. The ${h.a('oas-clawback', 'clawback calculator')} shows the repayment year by year.</p>
<h2>Residence: the clock stops when payments start</h2>
<p>For people with fewer than ${h.num(h.P.oas.res_full)} years in Canada after 18, Service Canada adds a rule that matters: once you start receiving the pension, any additional time you live in Canada will not increase it. Someone still building residence years at 65 keeps adding to the base while waiting. How Service Canada combines extra years and the monthly increase in a given file is set out in your decision letter, and the ${h.a('oas-partial-pension', 'partial pension guide')} explains the fraction.</p>
<h2>How to choose your start date</h2>
<p>If Service Canada has your information, it sends an enrolment letter around your ${h.num(h.P.oas.enrolment_letter_age)}th birthday and you are enrolled automatically. To push the start back, sign in to My Service Canada Account, open “Profile” and choose “Delay Receiving OAS/GIS Pension”, or contact Service Canada; the online request is possible once at least one month has passed since your 64th birthday. If you were not enrolled, you choose the start date when you ${h.src('oasApply', 'apply')}.</p>
<p>The decision interacts with the Canada Pension Plan, which rewards waiting until 70 more generously per month than OAS does. The ${h.a('cpp-at-60-or-70', 'CPP start-age guide')} compares the two, and some retirees draw on savings first, then start one pension and keep the other for later.</p>
<!--mini:oasDeferStart-->
<h2>After 75</h2>
<p>The automatic ${h.pct(h.P.oas.increase_75, 0)} increase at 75 applies to the pension you receive, deferred or not, so a pension started at 70 is raised again five years later. The ${h.a('oas-at-75', 'age-75 page')} shows the amounts.</p>
`,
  },
  fr: {
    slug: 'report-securite-vieillesse',
    nav: 'Reporter la SV',
    card: 'Commencer la SV entre 65 et 70 ans : le gain mensuel, l’âge de rattrapage et le SRG sacrifié.',
    title: 'Report de la SV 2026 : 0,6 % par mois, 1 037,00 $ à 70 ans',
    description: 'Report de la SV 2026 : chaque mois après 65 ans ajoute 0,6 %, jusqu’à 36 % à 70 ans, soit 1 037,00 $ par mois fin 2026, mais le SRG ne se reporte pas. Exemples.',
    h1: 'Reporter sa pension de la Sécurité de la vieillesse',
    intro: 'La Sécurité de la vieillesse peut commencer n’importe quel mois entre 65 et 70 ans, et chaque mois d’attente majore la pension pour la vie, avec une grosse exception pour les petits revenus.',
    resume: (h) => `Chaque mois de report de la Sécurité de la vieillesse après 65 ans majore la pension de ${h.pct(h.P.oas.defer, 1)}, jusqu’à ${h.pct(h.P.oas.defer_max, 0)} à 70 ans. Dans l’exemple de Service Canada pour octobre à décembre 2026, une pension complète de ${h.eur(full(h, 65).gross, 2)} par mois à 65 ans devient ${h.eur(h.P.oas.defer_70_example, 2)} si elle commence à 70 ans. La majoration est permanente et s’ajoute à l’indexation trimestrielle : l’écart en dollars grandit avec le temps. Attendre au-delà de 70 ans ne rapporte rien, la majoration s’arrêtant là. L’arbitrage se résume ainsi : renoncer à jusqu’à cinq ans de paiements contre un chèque plus gros. En dollars constants, la pension majorée rattrape la pension de 65 ans environ ${h.num(catchUp(h), 1)} ans après son début, quel que soit l’âge choisi ; commencée à 70 ans, elle passe devant vers ${h.num(70 + catchUp(h), 0)} ans. Le Supplément de revenu garanti ne suit pas : Service Canada précise qu’il n’est pas versé pendant le report de la SV et que son montant n’augmente pas quand on reporte. L’avis de Service Canada indique le montant réellement accordé.`,
    faqs: (h) => [
      { q: 'Combien chaque mois de report ajoute-t-il à la pension de la SV ?', a: `Exactement ${h.pct(h.P.oas.defer, 1)} de la pension qui aurait été versée à 65 ans, pour chaque mois entre le 65e anniversaire et la date de début, sur soixante mois au plus. Une pension complète commencée à 67 ans au trimestre d’octobre à décembre 2026 vaut ${h.eur(full(h, 67).gross, 2)} par mois au lieu de ${h.eur(full(h, 65).gross, 2)}, et l’écart est versé à vie.` },
      { q: 'Un aîné à faible revenu a-t-il intérêt à reporter sa SV ?', a: `Rarement. Le Supplément de revenu garanti n’est versé qu’à une personne qui reçoit la SV, et Service Canada précise qu’il n’augmente pas quand la SV est reportée. Une personne seule ayant ${h.eur(LOW)} d’autres revenus renoncerait à environ ${h.eur(lostGis(h), 2)} de SRG par mois pendant l’attente, en plus de la SV elle-même (modèle du SRG, à un dollar près).` },
      { q: 'Comment reporter la SV après une lettre d’inscription automatique ?', a: `Connectez-vous à Mon dossier Service Canada, ouvrez « Profil » et choisissez « Retarder la réception de votre pension SV/SRG », sous « Dites-nous si quelque chose a changé », ou communiquez avec Service Canada. La lettre arrive en général vers le 64e anniversaire, et la démarche en ligne est possible au moins un mois après cet anniversaire.` },
      { q: 'À quel âge une SV reportée devient-elle rentable ?', a: `En dollars constants, une pension commencée à l’âge A dépasse celle commencée à 65 ans environ ${h.num(catchUp(h), 1)} ans après A. Chaque mois d’attente coûte un paiement mais ajoute ${h.pct(h.P.oas.defer, 1)} à tous les paiements suivants, et l’inverse de ce taux donne le même délai à tout âge. Commencée à 68 ans, la pension passe devant vers ${h.num(68 + catchUp(h), 0)} ans.` },
      { q: 'Reporter la SV modifie-t-il le seuil de récupération ?', a: `Non. Le seuil est le même pour tous : ${h.eur(h.P.oas.recovery.thr_2025)} de revenu net de 2025 pour les paiements de juillet 2026 à juin 2027. Une pension reportée étant plus grosse, il en reste davantage une fois la récupération de ${h.pct(h.P.oas.recovery.rate, 0)} appliquée, et elle n’est entièrement récupérée qu’à un revenu plus élevé.` },
    ],
    body: (h) => `
<h2>Le montant mensuel selon l’âge de début</h2>
<p>Le tableau applique la majoration à la pension complète du trimestre d’octobre à décembre 2026, pour une personne ayant ${h.num(h.P.oas.res_full)} ans de résidence au Canada après 18 ans. La dernière colonne donne l’âge auquel le total reçu depuis ce début dépasse le total reçu depuis 65 ans, sans indexation ni intérêts.</p>
${h.table(['Âge de début', 'Majoration', 'Par mois', 'Par année', 'Dépasse 65 ans à'], schedule(h), 'Pension de la SV reportée, taux d’octobre à décembre 2026 (calcul du moteur du site)', ['l', 'r', 'r', 'r', 'r'])}
<p>Ces chiffres concordent avec le tableau d’exemple de la ${h.src('oasStart', 'page de Service Canada sur le moment de commencer')}, qui se termine par ${h.eur(h.P.oas.defer_70_example, 2)} à 70 ans. Pour une pension partielle, le même pourcentage s’applique à une base plus petite : le report multiplie ce que la résidence a permis d’acquérir, il ne le remplace pas.</p>
<h2>Pourquoi le rattrapage prend toujours environ ${h.num(catchUp(h), 0)} ans</h2>
<p>Attendre un mois, c’est perdre un paiement. En échange, chaque paiement suivant est majoré de ${h.pct(h.P.oas.defer, 1)}. Pour regagner un paiement perdu, il faut environ ${h.num(1 / h.P.oas.defer, 0)} paiements majorés, soit ${h.num(catchUp(h), 1)} ans. Comme le taux est identique pour chaque mois entre 65 et 70 ans, le calcul ne dépend pas de la durée de l’attente : qui commence à 66 ans rattrape vers ${h.num(66 + catchUp(h), 0)} ans, qui commence à 70 ans vers ${h.num(70 + catchUp(h), 0)} ans.</p>
<p>L’indexation n’y change rien, puisque les deux pensions augmentent du même pourcentage chaque trimestre. Deux éléments, eux, comptent. Le rendement des sommes qu’on aurait touchées dès 65 ans repousse le point de rattrapage. Surtout, l’état de santé et l’histoire familiale pèsent plus que toute formule : reporter, c’est parier sur une vie longue au-delà du rattrapage, et la pension plus élevée joue alors le rôle d’une assurance contre l’épuisement de l’épargne à 90 ans.</p>
<h2>Le piège du SRG pour les revenus modestes</h2>
<p>Service Canada est clair sur deux points. Si vous ne recevez pas la pension de la SV, vous ne pouvez pas obtenir le Supplément de revenu garanti, et les montants du supplément et de l’Allocation n’augmentent pas lorsque vous reportez la SV. Pour qui aurait droit au supplément, le report coûte donc deux fois : la SV elle-même et le SRG qui l’aurait accompagnée.</p>
<p>Prenons une personne seule ayant ${h.eur(LOW)} par année de RPC et de rente privée. À 65 ans, elle toucherait la SV complète de ${h.eur(full(h, 65).gross, 2)} et environ ${h.eur(lostGis(h), 2)} de SRG par mois, selon le modèle du SRG du site, exact aux seuils de la grille publiée et à environ un dollar par mois près entre eux. Attendre 70 ans ferait perdre environ ${h.eur(lostGis(h) * 12 * 5)} de supplément sur cinq ans, et le SRG versé ensuite serait le même qu’à 65 ans. Le ${h.a('guaranteed-income-supplement', 'calculateur du SRG')} donne le montant selon votre revenu.</p>
<p>Le conjoint est touché lui aussi. Pendant le report, votre époux ou conjoint de fait de 60 à 64 ans ne peut pas demander l’Allocation, ce que Service Canada mentionne avec la règle du SRG.</p>
<h2>Quand reporter ne coûte rien : les années de récupération</h2>
<p>À l’autre bout de l’échelle des revenus, le report peut être gratuit. Une personne qui gagne encore ${h.eur(HIGH)} à 66 ans verrait l’impôt de récupération reprendre ${h.eur(h.M.oasRecovery(HIGH, full(h, 65).gross * 12), 2)} d’une pension de ${h.eur(full(h, 65).gross * 12, 2)}, soit la totalité au taux d’octobre 2026. Commencer la SV cette année-là reviendrait à ne rien toucher, puis à perdre pour de bon la majoration de ${h.pct(h.P.oas.defer, 1)} par mois. Reporter jusqu’à la baisse du revenu conserve la majoration sans sacrifier un sou.</p>
<p>Le seuil de récupération est le même pour tous : ${h.eur(h.P.oas.recovery.thr_2025)} pour le revenu de 2025 et ${h.eur(h.P.oas.recovery.thr_2026)} pour celui de 2026. Une pension reportée étant plus grosse, la récupération s’étale sur une plage de revenu plus large avant d’atteindre zéro. Le ${h.a('oas-clawback', 'calculateur de récupération')} montre le remboursement année par année.</p>
<h2>La résidence : le compteur s’arrête au premier paiement</h2>
<p>Pour qui compte moins de ${h.num(h.P.oas.res_full)} ans au Canada après 18 ans, Service Canada ajoute une règle importante : une fois la pension commencée, le temps supplémentaire passé au Canada ne l’augmente plus. Une personne qui accumule encore des années de résidence à 65 ans continue donc d’enrichir sa base pendant l’attente. La façon dont Service Canada combine années supplémentaires et majoration mensuelle dans un dossier donné figure dans la lettre de décision, et le ${h.a('oas-partial-pension', 'guide de la pension partielle')} explique la fraction.</p>
<h2>Choisir sa date de début</h2>
<p>Si Service Canada dispose de vos renseignements, il envoie une lettre d’inscription vers votre ${h.num(h.P.oas.enrolment_letter_age)}e anniversaire, et vous êtes inscrit d’office. Pour repousser le début, ouvrez Mon dossier Service Canada, allez dans « Profil » puis « Retarder la réception de votre pension SV/SRG », ou communiquez avec Service Canada ; la démarche en ligne est possible dès qu’au moins un mois s’est écoulé depuis le 64e anniversaire. Sans inscription d’office, la date se choisit au moment de la ${h.src('oasApply', 'demande')}.</p>
<p>La décision se combine avec celle du Régime de pensions du Canada, qui récompense l’attente jusqu’à 70 ans plus généreusement par mois que la SV. Le ${h.a('cpp-at-60-or-70', 'guide sur l’âge de début du RPC')} compare les deux ; certains retraités puisent d’abord dans leur épargne, commencent une pension et gardent l’autre pour plus tard.</p>
<!--mini:oasDeferStart-->
<h2>Après 75 ans</h2>
<p>La hausse automatique de ${h.pct(h.P.oas.increase_75, 0)} à 75 ans s’applique à la pension reçue, reportée ou non : une pension commencée à 70 ans est donc relevée de nouveau cinq ans plus tard. La ${h.a('oas-at-75', 'page sur la hausse à 75 ans')} en donne les montants.</p>
`,
  },
});
