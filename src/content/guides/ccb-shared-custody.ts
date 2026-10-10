import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
const share = (h: Helpers) => h.P.x.bCustodyShare as number;
/** Part de l'ACE d'un parent en garde partagée : la moitié de l'ACE calculée sur le revenu de son ménage. */
const half = (h: Helpers, under6: number, age6to17: number, afni: number) => h.M.ccb({ under6, age6to17, afni }).annual * share(h);
const A = 42000, B = 95000;

export default defineGuide({
  id: 'ccb-shared-custody',
  group: 'family',
  order: 40,
  mini: 'ccbCustodySplit',
  miniHref: 'ccb-calculator',
  related: ['canada-child-benefit', 'ccb-calculator', 'ccb-payment-dates', 'child-disability-benefit', 'gst-credit-calculator'],
  sources: ['ccbCalc', S('bCcbWho'), S('bCcbKeep'), S('bCcbApply')],
  en: {
    slug: 'ccb-shared-custody',
    nav: 'CCB and shared custody',
    card: 'In shared custody, each parent gets half of a CCB computed on their own household income.',
    title: 'CCB Shared Custody 2026: How the 50% Split Really Works',
    description: 'CCB shared custody 2026: each parent receives 50% of the benefit computed on their own household income once the child lives with them 40% of the time.',
    h1: 'The Canada child benefit in shared custody',
    intro: 'When a child lives with both parents in turn, the CRA pays each of them half of a CCB worked out on that parent’s own family income.',
    resume: (h) => `In shared custody, each parent receives ${h.pct(share(h), 0)} of the Canada child benefit they would get if the child lived with them full time, and that amount is calculated on their own adjusted family net income, not on the former couple’s combined income. The Canada Revenue Agency treats custody as shared when the child lives with you at least ${h.pct(h.P.x.bCustodyMinTime, 0)} of the time, or on an approximately equal basis with you and another person at a different address. Both parents then apply. For July 2026 to June 2027, the maximum before any reduction is ${h.eur(h.P.ccb.max_under6)} per child under 6 and ${h.eur(h.P.ccb.max_6_17)} per child aged 6 to 17, so each parent starts from half of those figures. The split is rarely equal in money. Take two children aged 6 to 17: a parent whose household reported ${h.eur(A)} for 2025 receives ${h.eur(half(h, 0, 2, A))} for the year, while a parent at ${h.eur(B)} receives ${h.eur(half(h, 0, 2, B))}. A new spouse’s income counts in that parent’s household. Any change in the arrangement must be reported to the CRA right away, by each parent.`,
    faqs: (h) => [
      { q: 'What counts as shared custody for the CCB?', a: `The CRA speaks of shared custody when the child lives with you at least ${h.pct(h.P.x.bCustodyMinTime, 0)} of the time, or on an approximately equal basis with you and another person living at a different address. Below that share, the child is considered to live mainly with the other parent, who receives the full benefit if they are primarily responsible for the child’s care. What matters is the share of time the child actually lives with you, not a label in an agreement.` },
      { q: 'Does my ex’s income affect my half of the child benefit?', a: `No. Since the CRA calculates each parent’s share on that parent’s own adjusted family net income, your former partner’s line 23600 plays no part in your payment. What counts is your 2025 net income, plus the income of a current spouse or common-law partner if you have one. Two parents with the same child can therefore receive very different amounts, as the ${h.eur(A)} and ${h.eur(B)} example on this page shows.` },
      { q: 'Do both parents have to apply when custody becomes shared?', a: 'Yes. In a shared custody situation the CRA expects each parent to apply, through My Account or form RC66. A parent who was already receiving the full CCB keeps receiving it until the CRA records the new arrangement. The CRA asks each parent to report the change immediately, so the split starts from the right month.' },
      { q: 'Can one parent get the whole CCB with a week-on, week-off schedule?', a: `Not under the CRA rule. An alternating week schedule places the child with each parent on an approximately equal basis, which is shared custody. Each parent then receives ${h.pct(share(h), 0)} of a benefit computed on their own income. A private agreement between parents to let one of them collect everything does not change how the CRA calculates the benefit.` },
      { q: 'How does a new partner change my shared-custody CCB?', a: `Once you live with a new spouse or common-law partner, the CRA adds that person’s net income to yours to compute your half. If your household income goes from ${h.eur(A)} to ${h.eur(A + 50000)}, your share for two school-age children drops from ${h.eur(half(h, 0, 2, A))} to ${h.eur(half(h, 0, 2, A + 50000))} a year. Your former partner’s share does not move.` },
    ],
    body: (h) => {
      const fullA = h.M.ccb({ under6: 0, age6to17: 2, afni: A }).annual, fullB = h.M.ccb({ under6: 0, age6to17: 2, afni: B }).annual;
      const hA = half(h, 0, 2, A), hB = half(h, 0, 2, B);
      const cases: Array<[number, number, number]> = [[1, 0, 35000], [1, 0, 70000], [0, 1, 60000], [0, 2, 50000], [0, 2, 110000], [1, 2, 80000]];
      const rows = cases.map(([u, o, x]) => { const full = h.M.ccb({ under6: u, age6to17: o, afni: x }).annual; return [`${h.num(u)} / ${h.num(o)}`, h.eur(x), h.eur(full), h.eur(full * share(h)), h.eur((full * share(h)) / 12, 2)]; });
      return `
<h2>The rule in two sentences</h2>
<p>The ${h.src('ccbCalc', 'CRA calculation page')} puts it plainly: each parent with shared custody gets ${h.pct(share(h), 0)} of what they would have received with full custody, and that amount is based on their own adjusted family net income. Everything else follows from those two ideas: a half, and a separate calculation for each home.</p>
<p>The threshold for being in shared custody comes from the ${h.src(S('bCcbWho'), 'CRA eligibility page')}: the child lives with you at least ${h.pct(h.P.x.bCustodyMinTime, 0)} of the time, or on an approximately equal basis with you and someone at a different address. A two-week rotation, a five-two-two-five schedule or alternating weeks usually qualify. A child who spends every second weekend and part of the summer with one parent does not reach that level; the other parent, if primarily responsible for the child, receives the whole benefit.</p>
<h2>Why the two halves differ</h2>
<p>A half of what? Of the full-custody CCB for that parent, which depends on that parent’s household income. The CRA does not split one benefit computed on the former couple; it computes two benefits and pays half of each. Take two children aged 6 to 17, a parent A whose household income for 2025 was ${h.eur(A)} and a parent B at ${h.eur(B)}:</p>
<ul>
<li>with full custody, parent A would receive ${h.eur(fullA)} a year; in shared custody, ${h.eur(hA)}, or ${h.eur(hA / 12, 2)} a month;</li>
<li>with full custody, parent B would receive ${h.eur(fullB)}; in shared custody, ${h.eur(hB)}, or ${h.eur(hB / 12, 2)} a month.</li>
</ul>
<p>Together the two homes receive ${h.eur(hA + hB)} a year. That is more than parent B alone would get with full custody, and less than parent A alone would get. The lower-income home ends up with the larger share, which is the point of a benefit that falls as income rises.</p>
<h2>Shared custody amounts for common situations</h2>
<p>The table gives one parent’s share for several family shapes, using the CRA formula for July 2026 to June 2027 through the site’s engine. Run it once for each parent with that parent’s own household income.</p>
${h.table(['Children under 6 / aged 6 to 17', 'This parent’s household income', 'Full-custody CCB', 'Shared-custody share', 'Per month'], rows, `One parent’s CCB in shared custody, ${h.pct(share(h), 0)} of the full amount (July 2026 to June 2027)`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Whose income goes into each half</h2>
<p>Each parent’s calculation uses line 23600 of their own 2025 return, plus that of a current spouse or common-law partner if there is one, with the usual small adjustments of the adjusted family net income. The other parent’s income is never part of it. This is where blended families feel the rule: a parent who moves in with a partner earning a good salary sees their own half shrink, sometimes sharply, while the other home is untouched. The reverse holds after a separation from that new partner.</p>
<p>The CRA works from returns, so both parents must file every year even with little income, as the ${h.src(S('bCcbKeep'), 'CRA page on keeping your payments')} requires. A parent who does not file risks seeing their own half stop, whatever the other parent does.</p>
<h2>Applying and reporting a change</h2>
<p>When custody becomes shared, each parent applies, either in My Account or with form RC66, Canada Child Benefits Application, as described on the ${h.src(S('bCcbApply'), 'CRA application page')}. If one parent was receiving the full benefit before, that parent should report the new arrangement at the same time. The CRA asks each parent to tell it immediately about a new custody arrangement. Until it does, the old split keeps running, and both homes are paid on a situation that no longer exists.</p>
<p>The same applies when shared custody ends, for instance when a teenager moves in full time with one parent. That parent then reports the change and can apply for the full CCB as the parent primarily responsible.</p>
<h2>Small shares and the July lump sum</h2>
<p>Halving can push a payment below the CRA’s monthly threshold. When a parent’s total benefit for the year is under ${h.eur(h.P.ccb.lump_sum_under)}, the CRA pays it once, with the July payment, rather than monthly. In shared custody this happens at lower incomes than in full custody, because only half the benefit is involved. Higher-income parents should not be surprised to see a single deposit in July and nothing until the next benefit year.</p>
<h2>Children with a disability and other benefits</h2>
<p>The child disability benefit is paid inside the CCB deposit; the ${h.a('child-disability-benefit', 'CDB guide')} explains its own reduction. The Groceries and Essentials Benefit, the former GST/HST credit, also counts children, and each parent can check their own amount with the ${h.a('gst-credit-calculator', 'GST credit calculator')}. For the full picture of the CCB itself, see the ${h.a('canada-child-benefit', 'Canada child benefit guide')} and, for the deposit days, the ${h.a('ccb-payment-dates', 'CCB payment dates')}.</p>
<p>The amounts here are estimates built on CRA rules. Each parent’s CRA notice of determination gives the amount actually paid.</p>
`; },
  },
  fr: {
    slug: 'garde-partagee-allocation-enfants',
    nav: 'ACE et garde partagée',
    card: 'En garde partagée, chaque parent reçoit la moitié d’une ACE calculée sur le revenu de son propre ménage.',
    title: 'Garde partagée et ACE 2026 : le partage à 50 % expliqué',
    description: 'Garde partagée et ACE 2026 : chaque parent reçoit 50 % de l’allocation calculée sur son propre revenu, dès que l’enfant vit chez lui au moins 40 % du temps.',
    h1: 'L’allocation canadienne pour enfants en garde partagée',
    intro: 'Quand l’enfant vit tour à tour chez ses deux parents, l’ARC verse à chacun la moitié d’une ACE établie sur le revenu familial de ce parent.',
    resume: (h) => `En garde partagée, chaque parent reçoit ${h.pct(share(h), 0)} de l’allocation canadienne pour enfants qu’il toucherait si l’enfant vivait chez lui à temps plein, et ce montant est calculé sur son propre revenu familial net rajusté, pas sur le revenu de l’ancien couple. L’Agence du revenu du Canada considère la garde comme partagée quand l’enfant vit avec vous au moins ${h.pct(h.P.x.bCustodyMinTime, 0)} du temps, ou pendant une période à peu près égale avec vous et une autre personne habitant une adresse différente. Les deux parents font alors la demande. Pour juillet 2026 à juin 2027, le maximum avant réduction est de ${h.eur(h.P.ccb.max_under6)} par enfant de moins de 6 ans et de ${h.eur(h.P.ccb.max_6_17)} par enfant de 6 à 17 ans : chaque parent part de la moitié de ces chiffres. Le partage est rarement égal en dollars. Avec deux enfants de 6 à 17 ans, un parent dont le ménage a déclaré ${h.eur(A)} pour 2025 reçoit ${h.eur(half(h, 0, 2, A))} pour l’année, alors qu’un parent à ${h.eur(B)} reçoit ${h.eur(half(h, 0, 2, B))}. Le revenu d’un nouveau conjoint compte dans le ménage de ce parent. Tout changement d’entente doit être signalé sans délai à l’ARC, par chacun des parents.`,
    faqs: (h) => [
      { q: 'Qu’est-ce qui compte comme garde partagée pour l’ACE ?', a: `L’ARC parle de garde partagée quand l’enfant vit avec vous au moins ${h.pct(h.P.x.bCustodyMinTime, 0)} du temps, ou pendant une période à peu près égale avec vous et une autre personne habitant une adresse différente. En deçà, l’enfant est réputé vivre surtout chez l’autre parent, qui reçoit l’allocation entière s’il est le principal responsable de ses soins. Ce qui compte est la part du temps que l’enfant passe réellement chez vous, pas l’étiquette d’une entente.` },
      { q: 'Le revenu de mon ex change-t-il ma moitié de l’allocation pour enfants ?', a: `Non. Puisque l’ARC calcule la part de chaque parent sur son propre revenu familial net rajusté, la ligne 23600 de votre ex ne joue aucun rôle dans votre versement. Ce qui compte, c’est votre revenu net de 2025, plus celui de votre conjoint actuel, marié ou de fait, s’il y a lieu. Deux parents d’un même enfant peuvent donc toucher des montants très différents, comme le montre l’exemple à ${h.eur(A)} et ${h.eur(B)} de cette page.` },
      { q: 'Les deux parents doivent-ils faire une demande quand la garde devient partagée ?', a: 'Oui. En garde partagée, l’ARC s’attend à ce que chaque parent présente une demande, par son compte de l’ARC ou le formulaire RC66. Le parent qui touchait déjà l’ACE complète continue de la recevoir tant que l’ARC n’a pas enregistré la nouvelle entente. L’ARC demande à chaque parent de signaler le changement immédiatement, pour que le partage démarre au bon mois.' },
      { q: 'Un parent peut-il garder toute l’ACE avec une garde une semaine sur deux ?', a: `Pas selon la règle de l’ARC. Une alternance d’une semaine sur deux place l’enfant chez chaque parent pendant une période à peu près égale : c’est une garde partagée. Chaque parent reçoit alors ${h.pct(share(h), 0)} d’une allocation calculée sur son propre revenu. Une entente privée entre parents pour que l’un d’eux touche tout ne change pas la façon dont l’ARC fait le calcul.` },
      { q: 'Comment un nouveau conjoint modifie-t-il mon ACE en garde partagée ?', a: `Dès que vous vivez avec un nouveau conjoint marié ou de fait, l’ARC ajoute son revenu net au vôtre pour calculer votre moitié. Si le revenu de votre ménage passe de ${h.eur(A)} à ${h.eur(A + 50000)}, votre part pour deux enfants d’âge scolaire descend de ${h.eur(half(h, 0, 2, A))} à ${h.eur(half(h, 0, 2, A + 50000))} par année. La part de votre ex ne bouge pas.` },
    ],
    body: (h) => {
      const fullA = h.M.ccb({ under6: 0, age6to17: 2, afni: A }).annual, fullB = h.M.ccb({ under6: 0, age6to17: 2, afni: B }).annual;
      const hA = half(h, 0, 2, A), hB = half(h, 0, 2, B);
      const cases: Array<[number, number, number]> = [[1, 0, 35000], [1, 0, 70000], [0, 1, 60000], [0, 2, 50000], [0, 2, 110000], [1, 2, 80000]];
      const rows = cases.map(([u, o, x]) => { const full = h.M.ccb({ under6: u, age6to17: o, afni: x }).annual; return [`${h.num(u)} / ${h.num(o)}`, h.eur(x), h.eur(full), h.eur(full * share(h)), h.eur((full * share(h)) / 12, 2)]; });
      return `
<h2>La règle en deux phrases</h2>
<p>La ${h.src('ccbCalc', 'page de calcul de l’ARC')} le dit sans détour : chaque parent en garde partagée reçoit ${h.pct(share(h), 0)} de ce qu’il aurait touché avec la garde complète, et ce montant repose sur son propre revenu familial net rajusté. Tout le reste découle de ces deux idées : une moitié, et un calcul distinct pour chaque foyer.</p>
<p>Le seuil de la garde partagée vient de la ${h.src(S('bCcbWho'), 'page d’admissibilité de l’ARC')} : l’enfant vit avec vous au moins ${h.pct(h.P.x.bCustodyMinTime, 0)} du temps, ou pendant une période à peu près égale avec vous et une personne habitant ailleurs. Une rotation aux deux semaines, un horaire cinq-deux-deux-cinq ou une semaine sur deux y répondent en général. Un enfant qui passe une fin de semaine sur deux et une partie de l’été chez un parent n’atteint pas ce niveau ; l’autre parent, s’il est le principal responsable, reçoit l’allocation entière.</p>
<h2>Pourquoi les deux moitiés diffèrent</h2>
<p>La moitié de quoi ? De l’ACE à garde complète de ce parent, qui dépend du revenu de son ménage. L’ARC ne coupe pas en deux une allocation calculée sur l’ancien couple : elle en calcule deux et verse la moitié de chacune. Prenons deux enfants de 6 à 17 ans, un parent A dont le ménage a déclaré ${h.eur(A)} pour 2025 et un parent B à ${h.eur(B)} :</p>
<ul>
<li>avec la garde complète, le parent A recevrait ${h.eur(fullA)} par année ; en garde partagée, ${h.eur(hA)}, soit ${h.eur(hA / 12, 2)} par mois ;</li>
<li>avec la garde complète, le parent B recevrait ${h.eur(fullB)} ; en garde partagée, ${h.eur(hB)}, soit ${h.eur(hB / 12, 2)} par mois.</li>
</ul>
<p>Ensemble, les deux foyers reçoivent ${h.eur(hA + hB)} par année. C’est plus que ce que le parent B toucherait seul avec la garde complète, et moins que ce que toucherait le parent A. Le foyer au revenu le plus faible obtient la plus grosse part, ce qui est la logique même d’une allocation qui diminue avec le revenu.</p>
<h2>Les montants en garde partagée pour des cas courants</h2>
<p>Le tableau donne la part d’un parent pour plusieurs configurations familiales, selon la formule de l’ARC de juillet 2026 à juin 2027 appliquée par le moteur du site. Refaites l’exercice pour chaque parent, avec le revenu de son propre ménage.</p>
${h.table(['Enfants de moins de 6 ans / de 6 à 17 ans', 'Revenu du ménage de ce parent', 'ACE à garde complète', 'Part en garde partagée', 'Par mois'], rows, `ACE d’un parent en garde partagée, ${h.pct(share(h), 0)} du montant complet (juillet 2026 à juin 2027)`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Quel revenu entre dans chaque moitié</h2>
<p>Le calcul de chaque parent part de la ligne 23600 de sa déclaration de 2025, plus celle de son conjoint actuel, marié ou de fait, s’il en a un, avec les petits rajustements habituels du revenu familial net rajusté. Le revenu de l’autre parent n’y entre jamais. C’est là que les familles recomposées sentent la règle : un parent qui emménage avec un conjoint bien payé voit sa propre moitié fondre, parfois nettement, alors que l’autre foyer n’est pas touché. L’inverse vaut après une séparation d’avec ce nouveau conjoint.</p>
<p>L’ARC travaille à partir des déclarations : les deux parents doivent donc produire la leur chaque année, même avec peu de revenu, comme l’exige la ${h.src(S('bCcbKeep'), 'page de l’ARC sur le maintien des versements')}. Un parent qui ne produit pas sa déclaration risque de voir sa propre moitié s’arrêter, quoi que fasse l’autre parent.</p>
<h2>Faire la demande et signaler un changement</h2>
<p>Quand la garde devient partagée, chaque parent fait la demande, dans son compte de l’ARC ou avec le formulaire RC66, Demande de prestations canadiennes pour enfants, comme le décrit la ${h.src(S('bCcbApply'), 'page de demande de l’ARC')}. Si l’un des parents recevait l’allocation complète, il signale la nouvelle entente en même temps. L’ARC demande à chaque parent de l’informer immédiatement de toute nouvelle entente de garde. Tant que ce n’est pas fait, l’ancien partage continue, et les deux foyers sont payés sur une situation qui n’existe plus.</p>
<p>Il en va de même quand la garde partagée prend fin, par exemple quand un adolescent s’installe à temps plein chez un parent. Ce parent signale alors le changement et peut demander l’ACE complète à titre de principal responsable.</p>
<h2>Les petites parts et le versement unique de juillet</h2>
<p>Couper en deux peut faire passer un montant sous le seuil mensuel de l’ARC. Quand le total annuel d’un parent est inférieur à ${h.eur(h.P.ccb.lump_sum_under)}, l’ARC le verse en une fois, avec le paiement de juillet, plutôt que chaque mois. En garde partagée, cela arrive à des revenus plus bas qu’en garde complète, puisque seule la moitié de l’allocation est en jeu. Un parent à revenu élevé ne devrait pas s’étonner de voir un seul dépôt en juillet, puis rien jusqu’à l’année de prestations suivante.</p>
<h2>Enfants handicapés et autres prestations</h2>
<p>La prestation pour enfants handicapés est versée dans le dépôt de l’ACE ; le ${h.a('child-disability-benefit', 'guide de la PEH')} explique sa propre réduction. L’allocation pour l’épicerie et les besoins essentiels, l’ancien crédit pour la TPS/TVH, tient aussi compte des enfants, et chaque parent peut vérifier son montant avec le ${h.a('gst-credit-calculator', 'calcul du crédit TPS')}. Pour l’ACE elle-même, voir le ${h.a('canada-child-benefit', 'guide de l’allocation canadienne pour enfants')} et, pour les jours de dépôt, les ${h.a('ccb-payment-dates', 'dates de versement de l’ACE')}.</p>
<p>Les montants de cette page sont des estimations fondées sur les règles de l’ARC. L’avis de prestations de l’ARC de chaque parent fait foi du montant versé.</p>
`; },
  },
});
