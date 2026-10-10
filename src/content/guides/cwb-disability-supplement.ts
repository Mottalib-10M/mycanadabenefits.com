import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

const S = (k: string) => k as SourceKey;
/** Revenu où le supplément s'annule (calcul : seuil + maximum / taux). */
const zero = (h: Helpers) => { const W = h.P.cwb; return { single: W.dis_thr_single + W.dis_max / W.dis_rate, one: W.dis_thr_family + W.dis_max / W.dis_rate, both: W.dis_thr_family + W.dis_max / W.dis_rate_both }; };
/** Revenu de travail à partir duquel le supplément est au maximum. */
const full = (h: Helpers) => h.P.cwb.dis_min_work + h.P.cwb.dis_max / h.P.cwb.phase_in;
/** Supplément selon le revenu familial net, calculé par le moteur. */
const grid = (h: Helpers) => {
  const e = h.eur;
  const one = (afni: number) => h.M.cwb({ family: false, working: Math.min(afni, 20000), afni, disability: true });
  const fam = (afni: number) => h.M.cwb({ family: true, working: 30000, afni, disability: true });
  const both = (afni: number) => h.M.cwb({ family: true, working: 25000, spouseWorking: 25000, afni, disability: true, spouseDisability: true });
  return [
    { en: `Single, net income ${e(20000)}`, fr: `Seul, revenu net de ${e(20000)}`, r: one(20000) },
    { en: `Single, net income ${e(40000)}`, fr: `Seul, revenu net de ${e(40000)}`, r: one(40000) },
    { en: `Single, net income ${e(43000)}`, fr: `Seul, revenu net de ${e(43000)}`, r: one(43000) },
    { en: `Family, one with the DTC, ${e(54000)}`, fr: `Famille, un admis au CIPH, ${e(54000)}`, r: fam(54000) },
    { en: `Family, both with the DTC, ${e(72000)}`, fr: `Famille, les deux admis au CIPH, ${e(72000)}`, r: both(72000) },
  ];
};

export default defineGuide({
  id: 'cwb-disability-supplement',
  group: 'credits',
  order: 30,
  mini: 'cwbDisabilitySupp',
  miniHref: 'canada-workers-benefit',
  related: ['canada-workers-benefit', 'advanced-canada-workers-benefit', 'disability-tax-credit', 'canada-disability-benefit', 'child-disability-benefit'],
  sources: ['indexation', 'ita1227', 'cwbHow', S('cCwbClaim'), 'dtc'],
  en: {
    slug: 'cwb-disability-supplement',
    nav: 'CWB disability supplement',
    card: 'The extra workers benefit for people approved for the DTC: amount, thresholds and couples.',
    title: 'CWB Disability Supplement 2026: $860 and Its Income Limits',
    description: 'CWB disability supplement 2026: up to $860 on top of the basic amount for workers with the DTC, from $1,150 of earnings, cut by 15% or 7.5% above the threshold.',
    h1: 'The disability supplement of the Canada workers benefit',
    intro: 'Workers approved for the disability tax credit receive a second layer of the workers benefit, which starts at a lower income and fades out later.',
    resume: (h) => { const W = h.P.cwb; const z = zero(h); return `The disability supplement of the Canada workers benefit is worth up to ${h.eur(W.dis_max)} for 2026, up from ${h.eur(W.y2025.dis_max)} for 2025, and it is added to the basic amount of up to ${h.eur(W.max_single)} for a single worker or ${h.eur(W.max_family)} for a family. Only a person approved for the disability tax credit can receive it. It builds up at ${h.pct(W.phase_in, 0)} of working income above ${h.eur(W.dis_min_work)}, a much lower starting point than the ${h.eur(W.min_work)} required for the basic amount, so the full supplement is reached at about ${h.eur(full(h))} of earnings. The reduction starts later too: at ${h.eur(W.dis_thr_single)} of adjusted net income for a single person and ${h.eur(W.dis_thr_family)} for a family, with a rate of ${h.pct(W.dis_rate, 0)}, or ${h.pct(W.dis_rate_both, 1)} when both spouses are approved for the credit. By our arithmetic the supplement disappears near ${h.eur(z.single)} for a single person and ${h.eur(z.one)} for a family with one eligible member. It is claimed on Schedule 6 with the basic amount, on line 45300, and half of it can be paid in advance.`; },
    faqs: (h) => { const W = h.P.cwb; const z = zero(h); return [
      { q: 'Can I get the CWB disability supplement if I work only a few hours a week?', a: `Yes, as long as your working income for the year exceeds ${h.eur(W.dis_min_work)}. Each dollar above that adds ${h.pct(W.phase_in, 0)} to the supplement, which reaches the ${h.eur(W.dis_max)} maximum at about ${h.eur(full(h))} of earnings. Below the ${h.eur(W.min_work)} threshold of the basic amount you can still receive the supplement alone, provided your disability tax credit is approved.` },
      { q: 'Who claims the disability supplement when only one spouse has the DTC?', a: `The CRA asks the spouse who is eligible for the disability tax credit to claim both the basic amount and the supplement on their Schedule 6. The other spouse claims nothing for the workers benefit. The supplement uses the family threshold of ${h.eur(W.dis_thr_family)} and the ${h.pct(W.dis_rate, 0)} reduction rate. Source: ${h.src(S('cCwbClaim'))}.` },
      { q: 'Why is the reduction rate 7.5% when both spouses have the DTC?', a: `Because each spouse then claims a separate supplement on their own Schedule 6, and the Income Tax Act halves the rate for each to ${h.pct(W.dis_rate_both, 1)}. The two supplements together therefore shrink at the usual ${h.pct(W.dis_rate, 0)} of family income above ${h.eur(W.dis_thr_family)}, and each one lasts until about ${h.eur(z.both)} by our arithmetic. Source: ${h.src('ita1227')}.` },
      { q: 'Does the CWB disability supplement need a new T2201 every year?', a: `No. Form ${h.P.dtc.form} is not attached to each return: what counts is that the CRA has approved your disability tax credit for the year you claim. If your approval was limited to certain years, the supplement can only return once a new certificate has been accepted, so check the years covered before filing. The ${h.a('disability-tax-credit', 'disability tax credit guide')} covers the application.` },
      { q: 'Is the CWB disability supplement paid with the advance payments?', a: `Yes. The CRA adds ${h.pct(W.advance_share, 0)} of the supplement to the basic advance payments, on the same three dates. In 2026 those deposits came on ${h.P.cwb.advance_dates_2026.map((d) => h.date(d)).join(', ')}. The rest of the supplement arrives with the refund after you file. Source: ${h.src('cwbHow')}.` },
    ]; },
    body: (h) => { const W = h.P.cwb; const z = zero(h); const rows = grid(h).map((x) => [x.en, h.eur(x.r.basic), h.eur(x.r.disability), h.eur(x.r.total)]); return `
<h2>A second layer with its own curve</h2>
<p>The workers benefit has two parts. The basic amount rewards any low-income worker. The disability supplement is reserved for workers approved for the disability tax credit, the federal recognition of a severe and prolonged impairment certified on form ${h.P.dtc.form}. The supplement has its own formula in section 122.7 of the Income Tax Act, with three numbers that differ from the basic amount: a lower starting income of ${h.eur(W.dis_min_work)}, a lower maximum of ${h.eur(W.dis_max)}, and higher reduction thresholds of ${h.eur(W.dis_thr_single)} for a single person and ${h.eur(W.dis_thr_family)} for a family.</p>
<p>Those thresholds sit just above the point where the basic amount runs out. For a single worker, the basic amount is gone at about ${h.eur(W.zero_single)} of adjusted net income by our arithmetic, and the supplement only starts shrinking at ${h.eur(W.dis_thr_single)}. A worker with a disability therefore keeps a few hundred dollars of workers benefit over an income range where a worker without one gets nothing at all.</p>
<h2>The supplement across incomes</h2>
${h.table(['Situation', 'Basic amount', 'Supplement', 'Total'], rows, 'Canada workers benefit 2026 with the disability supplement, general federal rates', ['l', 'r', 'r', 'r'])}
<p>At ${h.eur(20000)} the single worker collects both maximums. At ${h.eur(40000)} the basic amount has vanished but the supplement is only slightly cut, and at ${h.eur(43000)} a small supplement still remains. The family with one approved member keeps a reduced supplement at ${h.eur(54000)}, an income where the family basic amount has long reached zero. The last row shows the halved rate at work: with both spouses approved and ${h.eur(72000)} of family income, which includes ${h.eur(25000)} of earnings each, the secondary earner exemption of up to ${h.eur(W.secondary_exempt)} lowers the income used and each spouse keeps a supplement.</p>
<!--mini:cwbDisabilitySupp-->
<h2>Thresholds and end points for 2026</h2>
<ul>
<li>Single person: reduction from ${h.eur(W.dis_thr_single)}, at ${h.pct(W.dis_rate, 0)}, supplement gone near ${h.eur(z.single)}.</li>
<li>Family, one person with the disability tax credit: reduction from ${h.eur(W.dis_thr_family)}, at ${h.pct(W.dis_rate, 0)}, gone near ${h.eur(z.one)}.</li>
<li>Family, both spouses with the credit: reduction from ${h.eur(W.dis_thr_family)}, at ${h.pct(W.dis_rate_both, 1)} for each supplement, each gone near ${h.eur(z.both)}.</li>
</ul>
<p>The thresholds come from the CRA indexation table for 2026. The end points are our own arithmetic, threshold plus maximum divided by the rate; the CRA page on amounts still showed 2025 figures when we checked, when the maximum was ${h.eur(W.y2025.dis_max)}.</p>
<h2>Small earnings, real money</h2>
<p>The low starting point is what makes the supplement matter for people who can only work a little. Take a single worker approved for the credit who earns ${h.eur(2500)} in the year from a few shifts: the basic amount is still zero, because earnings are below ${h.eur(W.min_work)}, yet the supplement already pays ${h.eur(h.M.cwb({ family: false, working: 2500, afni: 2500, disability: true }).disability)}. At ${h.eur(6000)} of earnings the same person receives ${h.eur(h.M.cwb({ family: false, working: 6000, afni: 6000, disability: true }).total)} in total, the supplement at its maximum and the basic amount still climbing. For someone whose disability limits the hours they can work, these first few thousand dollars of earnings are where the benefit grows fastest.</p>
<h2>The income that counts</h2>
<p>Two different incomes are used, and mixing them up is the usual mistake. Working income, meaning employment earnings and net self-employment income, decides how much of the supplement you build up. Adjusted net income, line 23600 of your return plus your spouse’s, minus the secondary earner exemption when it applies, decides how much is taken away. Disability payments such as the ${h.a('canada-disability-benefit', 'Canada Disability Benefit')} or CPP disability are not working income, so they never help you build the supplement, but any of them included in net income can reduce it.</p>
<h2>Claiming it as a couple</h2>
<p>The claim is made on Schedule 6, step 3, and the result goes on line 45300 with the basic amount. The CRA gives three cases. If only one spouse is approved for the disability tax credit, that person claims the basic amount and the supplement. If both are approved, one claims the basic amount for the family, and each claims a supplement on their own Schedule 6. A single person claims both parts alone.</p>
<h2>Before you count on it</h2>
<p>Getting the disability tax credit approved comes first. When the approval covers past years, the CRA lets you claim the disability amount back up to ${h.num(h.P.x.cDtcBackYears)} years, so earlier returns are worth a second look. Source: ${h.src(S('cDtcClaim'))}. Quebec, Alberta and Nunavut use their own Schedule 6, so the figures above do not apply there. The amount you receive is the one on your notice of assessment. Sources: ${h.src('indexation')}, ${h.src('ita1227')} and ${h.src(S('cCwbClaim'))}. The ${h.a('canada-workers-benefit', 'workers benefit calculator')} combines both parts for any income.</p>
`; },
  },
  fr: {
    slug: 'supplement-invalidite-act',
    nav: 'Supplément pour invalidité de l’ACT',
    card: 'Le complément de l’ACT pour les personnes admises au CIPH : montant, seuils et couples.',
    title: 'Supplément pour invalidité de l’ACT 2026 : 860 $ et seuils',
    description: 'Supplément pour invalidité de l’ACT 2026 : jusqu’à 860 $ pour les travailleurs admis au CIPH, dès 1 150 $ de gains, réduit de 15 % ou 7,5 % au-delà du seuil.',
    h1: 'Le supplément pour invalidité de l’allocation canadienne pour les travailleurs',
    intro: 'Les travailleurs admis au crédit d’impôt pour personnes handicapées reçoivent un second volet de l’ACT, qui commence plus bas et s’éteint plus tard.',
    resume: (h) => { const W = h.P.cwb; const z = zero(h); return `Le supplément pour invalidité de l’allocation canadienne pour les travailleurs vaut jusqu’à ${h.eur(W.dis_max)} pour 2026, contre ${h.eur(W.y2025.dis_max)} pour 2025, et s’ajoute au montant de base, qui atteint ${h.eur(W.max_single)} pour une personne seule ou ${h.eur(W.max_family)} pour une famille. Seule une personne admise au crédit d’impôt pour personnes handicapées (CIPH) peut le recevoir. Il se constitue à raison de ${h.pct(W.phase_in, 0)} du revenu de travail au-delà de ${h.eur(W.dis_min_work)}, un point de départ bien plus bas que les ${h.eur(W.min_work)} exigés pour le montant de base : le supplément complet est donc atteint vers ${h.eur(full(h))} de gains. La réduction commence aussi plus tard, à ${h.eur(W.dis_thr_single)} de revenu net rajusté pour une personne seule et ${h.eur(W.dis_thr_family)} pour une famille, au taux de ${h.pct(W.dis_rate, 0)}, ou de ${h.pct(W.dis_rate_both, 1)} quand les deux conjoints sont admis au crédit. Selon notre calcul, le supplément disparaît vers ${h.eur(z.single)} pour une personne seule et ${h.eur(z.one)} pour une famille comptant une personne admissible. Il se demande à l’annexe 6 avec le montant de base, à la ligne 45300, et la moitié peut être versée d’avance.`; },
    faqs: (h) => { const W = h.P.cwb; const z = zero(h); return [
      { q: 'Puis-je toucher le supplément pour invalidité de l’ACT en travaillant quelques heures par semaine ?', a: `Oui, dès que votre revenu de travail de l’année dépasse ${h.eur(W.dis_min_work)}. Chaque dollar au-delà ajoute ${h.pct(W.phase_in, 0)} au supplément, qui atteint son maximum de ${h.eur(W.dis_max)} vers ${h.eur(full(h))} de gains. Sous le seuil de ${h.eur(W.min_work)} du montant de base, vous pouvez recevoir le supplément seul, à condition que votre CIPH soit approuvé.` },
      { q: 'Qui demande le supplément quand un seul conjoint est admis au CIPH ?', a: `L’ARC demande au conjoint admissible au crédit d’impôt pour personnes handicapées de réclamer à la fois le montant de base et le supplément sur son annexe 6. L’autre conjoint ne demande rien au titre de l’ACT. Le supplément suit alors le seuil familial de ${h.eur(W.dis_thr_family)} et le taux de réduction de ${h.pct(W.dis_rate, 0)}. Source : ${h.src(S('cCwbClaim'))}.` },
      { q: 'Pourquoi le taux de réduction tombe-t-il à 7,5 % quand les deux conjoints ont le CIPH ?', a: `Parce que chaque conjoint demande alors son propre supplément sur sa propre annexe 6, et la Loi de l’impôt sur le revenu réduit de moitié le taux de chacun, à ${h.pct(W.dis_rate_both, 1)}. Les deux suppléments réunis diminuent donc au taux habituel de ${h.pct(W.dis_rate, 0)} du revenu familial au-delà de ${h.eur(W.dis_thr_family)}, et chacun dure jusque vers ${h.eur(z.both)} selon notre calcul. Source : ${h.src('ita1227')}.` },
      { q: 'Faut-il un nouveau T2201 chaque année pour le supplément de l’ACT ?', a: `Non. Le formulaire ${h.P.dtc.form} n’est pas joint à chaque déclaration : ce qui compte, c’est que l’ARC ait approuvé votre crédit d’impôt pour personnes handicapées pour l’année demandée. Si l’approbation ne visait que certaines années, le supplément ne peut revenir qu’après l’acceptation d’un nouveau certificat : vérifiez les années couvertes avant de produire. Le ${h.a('disability-tax-credit', 'guide du CIPH')} détaille la demande.` },
      { q: 'Le supplément pour invalidité est-il compris dans les avances de l’ACT ?', a: `Oui. L’ARC ajoute ${h.pct(W.advance_share, 0)} du supplément aux paiements anticipés de base, aux trois mêmes dates. En 2026, ces dépôts sont arrivés le ${h.P.cwb.advance_dates_2026.map((d) => h.date(d)).join(', le ')}. Le reste du supplément arrive avec le remboursement, après la déclaration. Source : ${h.src('cwbHow')}.` },
    ]; },
    body: (h) => { const W = h.P.cwb; const z = zero(h); const rows = grid(h).map((x) => [x.fr, h.eur(x.r.basic), h.eur(x.r.disability), h.eur(x.r.total)]); return `
<h2>Un second volet avec sa propre courbe</h2>
<p>L’ACT compte deux volets. Le montant de base récompense tout travailleur à faible revenu. Le supplément pour invalidité est réservé aux travailleurs admis au crédit d’impôt pour personnes handicapées, la reconnaissance fédérale d’une déficience grave et prolongée attestée sur le formulaire ${h.P.dtc.form}. Le supplément a sa propre formule à l’article 122.7 de la Loi de l’impôt sur le revenu, avec trois chiffres qui diffèrent du montant de base : un revenu de départ plus bas, ${h.eur(W.dis_min_work)}, un maximum plus faible, ${h.eur(W.dis_max)}, et des seuils de réduction plus élevés, ${h.eur(W.dis_thr_single)} pour une personne seule et ${h.eur(W.dis_thr_family)} pour une famille.</p>
<p>Ces seuils se situent juste au-dessus du point où le montant de base s’épuise. Pour une personne seule, le montant de base disparaît vers ${h.eur(W.zero_single)} de revenu net rajusté selon notre calcul, et le supplément ne commence à baisser qu’à ${h.eur(W.dis_thr_single)}. Un travailleur handicapé garde donc quelques centaines de dollars d’ACT sur une plage de revenu où un travailleur sans handicap ne reçoit plus rien.</p>
<h2>Le supplément selon le revenu</h2>
${h.table(['Situation', 'Montant de base', 'Supplément', 'Total'], rows, 'ACT 2026 avec supplément pour invalidité, barème fédéral général', ['l', 'r', 'r', 'r'])}
<p>À ${h.eur(20000)}, la personne seule touche les deux maximums. À ${h.eur(40000)}, le montant de base a disparu mais le supplément n’est que légèrement entamé, et à ${h.eur(43000)} il en reste encore un peu. La famille comptant une personne admise garde un supplément réduit à ${h.eur(54000)}, un revenu où le montant de base familial est nul depuis longtemps. La dernière ligne montre le taux réduit de moitié : avec deux conjoints admis et ${h.eur(72000)} de revenu familial, dont ${h.eur(25000)} de gains chacun, l’exemption du deuxième revenu, jusqu’à ${h.eur(W.secondary_exempt)}, abaisse le revenu retenu et chaque conjoint garde un supplément.</p>
<!--mini:cwbDisabilitySupp-->
<h2>Seuils et points d’extinction pour 2026</h2>
<ul>
<li>Personne seule : réduction dès ${h.eur(W.dis_thr_single)}, à ${h.pct(W.dis_rate, 0)}, supplément éteint vers ${h.eur(z.single)}.</li>
<li>Famille, une personne admise au CIPH : réduction dès ${h.eur(W.dis_thr_family)}, à ${h.pct(W.dis_rate, 0)}, éteint vers ${h.eur(z.one)}.</li>
<li>Famille, deux conjoints admis : réduction dès ${h.eur(W.dis_thr_family)}, à ${h.pct(W.dis_rate_both, 1)} pour chaque supplément, chacun éteint vers ${h.eur(z.both)}.</li>
</ul>
<p>Les seuils viennent du tableau d’indexation 2026 de l’ARC. Les points d’extinction sont notre propre calcul, seuil plus maximum divisé par le taux ; la page de l’ARC sur les montants affichait encore les chiffres de 2025 lors de notre vérification, quand le maximum était de ${h.eur(W.y2025.dis_max)}.</p>
<h2>De petits gains, une vraie somme</h2>
<p>Le point de départ bas fait toute la valeur du supplément pour les personnes qui ne peuvent travailler qu’un peu. Prenons une personne seule admise au crédit qui gagne ${h.eur(2500)} dans l’année grâce à quelques quarts de travail : le montant de base reste nul, car ses gains sont sous ${h.eur(W.min_work)}, mais le supplément verse déjà ${h.eur(h.M.cwb({ family: false, working: 2500, afni: 2500, disability: true }).disability)}. À ${h.eur(6000)} de gains, la même personne reçoit ${h.eur(h.M.cwb({ family: false, working: 6000, afni: 6000, disability: true }).total)} au total, le supplément à son maximum et le montant de base encore en hausse. Pour qui ne peut travailler que peu d’heures, ces premiers milliers de dollars sont ceux où l’allocation progresse le plus vite.</p>
<h2>Le revenu qui compte</h2>
<p>Deux revenus différents entrent en jeu, et les confondre est l’erreur la plus fréquente. Le revenu de travail, c’est-à-dire le salaire et le revenu net d’entreprise, détermine la part du supplément que vous constituez. Le revenu net rajusté, ligne 23600 de votre déclaration et de celle du conjoint, moins l’exemption du deuxième revenu s’il y a lieu, détermine ce qui est retranché. Les prestations d’invalidité comme la ${h.a('canada-disability-benefit', 'PCPSH')} ou la prestation d’invalidité du RPC ne sont pas un revenu de travail : elles n’aident jamais à constituer le supplément, mais celles qui entrent dans le revenu net peuvent le réduire.</p>
<h2>La demande en couple</h2>
<p>La demande se fait à l’étape 3 de l’annexe 6, et le résultat va à la ligne 45300 avec le montant de base. L’ARC distingue trois cas. Si un seul conjoint est admis au CIPH, il demande le montant de base et le supplément. Si les deux le sont, l’un demande le montant de base pour la famille et chacun demande un supplément sur sa propre annexe 6. Une personne seule demande les deux volets.</p>
<h2>Avant d’y compter</h2>
<p>Il faut d’abord obtenir l’approbation du CIPH. Quand elle couvre des années passées, l’ARC permet de demander le montant pour personnes handicapées jusqu’à ${h.num(h.P.x.cDtcBackYears)} ans en arrière : les déclarations antérieures méritent alors un second regard. Source : ${h.src(S('cDtcClaim'))}. Le Québec, l’Alberta et le Nunavut ont leur propre annexe 6 : les chiffres ci-dessus n’y valent pas. Le montant versé est celui de votre avis de cotisation. Sources : ${h.src('indexation')}, ${h.src('ita1227')} et ${h.src(S('cCwbClaim'))}. Le ${h.a('canada-workers-benefit', 'calculateur de l’ACT')} combine les deux volets pour tout revenu.</p>
`; },
  },
});
