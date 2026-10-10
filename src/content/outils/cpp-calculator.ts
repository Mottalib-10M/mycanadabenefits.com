import { defineGuide, type Helpers } from '../../lib/guide-types';
import type { SourceKey } from '../../lib/engine/params';

/** Cas types : relevé au maximum, à la moitié du maximum et à la moyenne des nouveaux retraités. */
const cases = (h: Helpers) => [h.P.cpp.max_65, h.P.cpp.avg_65, Math.round(h.P.cpp.max_65 / 2)];
const rows = (h: Helpers) => cases(h).map((p) => [h.eur(p, 2), h.eur(h.M.cppPension(p, 60).monthly, 2), h.eur(h.M.cppPension(p, 65).monthly, 2), h.eur(h.M.cppPension(p, 70).monthly, 2), h.eur(h.M.cppCumulative(p, 60, 85)), h.eur(h.M.cppCumulative(p, 70, 85))]);

export default defineGuide({
  id: 'cpp-calculator', group: 'cpp', order: 10, tool: 'cpp',
  related: ['cpp-at-60-or-70', 'cpp-payment-amount', 'cpp-payment-dates', 'old-age-security', 'guaranteed-income-supplement'],
  sources: ['cppAmounts', 'cppStart', 'dCppAmount' as SourceKey, 'oasAct'],
  en: {
    slug: 'cpp-calculator',
    nav: 'CPP calculator',
    card: 'Turn the figure on your Service Canada statement into a monthly pension at any age from 60 to 70.',
    title: 'CPP Calculator 2026: Your Pension at Any Age From 60 to 70',
    description: 'CPP calculator for 2026: enter your statement amount, pick a start age from 60 to 70 and see the monthly pension, lifetime totals and break-even age against 65.',
    h1: 'CPP retirement pension calculator',
    intro: 'Enter the age-65 estimate from your Service Canada statement and the calculator applies the 2026 start-age rules to it.',
    resume: (h) => `The calculator takes one number, the monthly pension at 65 printed on your CPP statement of contributions, and applies the official adjustment for the age you choose: ${h.pct(h.P.cpp.early, 1)} less for every month before 65, ${h.pct(h.P.cpp.late, 1)} more for every month after, between ${h.num(h.P.cpp.min_age)} and ${h.num(h.P.cpp.max_age)}. Any estimate above the 2026 maximum of ${h.eur(h.P.cpp.max_65, 2)} at 65 is capped at that figure. For the average new pension of July 2026, ${h.eur(h.P.cpp.avg_65, 2)}, the result is ${h.eur(h.M.cppPension(h.P.cpp.avg_65, 60).monthly, 2)} a month at 60 and ${h.eur(h.M.cppPension(h.P.cpp.avg_65, 70).monthly, 2)} at 70. Next to the monthly figure, the tool adds up what each start age pays until the age you pick, 75 to 95, and tells you when a pension started at 70 overtakes one started at 65: around age ${h.num(h.M.cppBreakEven(h.P.cpp.avg_65, 65, 70), 1)}. All figures are in 2026 dollars, before income tax, with no projected indexation. What Service Canada actually pays is the amount on your decision letter.`,
    faqs: (h) => [
      { q: 'Where do I find the age-65 amount the CPP calculator asks for?', a: `Sign in to My Service Canada Account and open your Canada Pension Plan statement of contributions. It shows an estimate of the monthly pension at 65 based on your contributions so far. Enter that figure as is; anything above ${h.eur(h.P.cpp.max_65, 2)}, the 2026 maximum at 65, is capped by the calculator because no new pension can exceed it.` },
      { q: 'Why does the break-even age barely move when I change my CPP estimate?', a: `Because the start-age adjustment is a percentage. Starting at 70 multiplies the pension by ${h.num(h.M.cppFactor(70), 2)} and starting at 65 by ${h.num(h.M.cppFactor(65), 0)}, whatever your amount, so the age at which the later start catches up stays near ${h.num(h.M.cppBreakEven(h.P.cpp.max_65, 65, 70), 1)}. Only the dollar totals change with your estimate.` },
      { q: 'Does the CPP calculator include the post-retirement benefit or indexation?', a: `No. It works from your statement estimate only. If you keep working after your pension starts and before 70, each year of contributions adds a post-retirement benefit, worth at most ${h.eur(h.P.cpp.pre_max_65, 2)} a month for 2026 at 65. Pensions are also indexed every January (${h.pct(h.P.cpp.indexation, 1)} for 2026), which the tool leaves out on purpose.` },
      { q: 'Can I use this CPP tool if I live in Quebec?', a: 'Not reliably. Quebec workers contribute to the Quebec Pension Plan, which has its own rates, adjustment factors and statement from Retraite Québec. The figures here follow federal CPP rules for 2026 only. If part of your career was in Quebec, ask Retraite Québec for your QPP statement and read our page on the Quebec plan before comparing start ages.' },
    ],
    body: (h) => `
<h2>What the calculator works out</h2>
<p>Three figures appear as soon as you enter an amount. The first is your monthly retirement pension at the start age you select, from ${h.num(h.P.cpp.min_age)} to ${h.num(h.P.cpp.max_age)}, with the percentage gained or lost against 65. The second is a running total for a start at 60, at 65 and at 70, counted up to the age you choose. The third is the break-even age, the birthday after which waiting until 70 has paid more in total than starting at 65.</p>
<p>The adjustment is applied month by month in the rules, so starting at 60 removes ${h.pct(h.P.cpp.early * 60, 0)} and starting at 70 adds ${h.pct(h.P.cpp.late * 60, 0)}. The calculator uses whole years; a start in the middle of a year falls between two rows.</p>
<h2>Typical cases for 2026</h2>
${h.table(['Statement at 65', 'Start at 60', 'Start at 65', 'Start at 70', 'Total to 85, start 60', 'Total to 85, start 70'], rows(h), 'Monthly CPP retirement pension by start age, 2026 dollars (BenefitLedger calculation from Service Canada rules)', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The first row is the 2026 maximum, the second the average new pension at 65 in July 2026, the third half the maximum. In each row the later start ends ahead by 85, which is why the ${h.a('cpp-at-60-or-70', 'guide on choosing 60 or 70')} spends most of its time on health, savings and other benefits rather than on arithmetic alone.</p>
<h2>Where the numbers come from</h2>
<p>The maximum and the average are those Service Canada publishes for 2026 (${h.src('cppAmounts')}). The ${h.pct(h.P.cpp.early, 1)} and ${h.pct(h.P.cpp.late, 1)} monthly rates come from the start-age page (${h.src('cppStart')}). Your statement estimate already reflects how much and how long you contributed, including the dropout of up to ${h.num(h.P.x.dDropoutYears)} low-earning years for the base component, as explained in ${h.src('dCppAmount' as SourceKey)}.</p>
<h2>What it does not do</h2>
<p>The tool cannot read your record of earnings, so it cannot rebuild your pension from your salary history or add future years of work. It does not project indexation or tax, and it ignores survivor and disability benefits. For the gap between your figure and the maximum, see the ${h.a('cpp-payment-amount', 'CPP payment amount guide')}. Low-income retirees should also look at the ${h.a('guaranteed-income-supplement', 'Guaranteed Income Supplement')}, since every CPP dollar counts as income for it.</p>
`,
  },
  fr: {
    slug: 'calcul-rpc',
    nav: 'Calcul du RPC',
    card: 'Transformez le montant de votre relevé de Service Canada en pension mensuelle à tout âge de 60 à 70 ans.',
    title: 'RPC 2026 : votre pension de retraite de 60 à 70 ans',
    description: 'Pension du RPC en 2026 : entrez votre relevé, choisissez un âge de début de 60 à 70 ans, puis voyez la rente mensuelle, les totaux et l’âge d’équilibre.',
    h1: 'Calculer sa pension de retraite du RPC',
    intro: 'Entrez l’estimation à 65 ans de votre relevé de Service Canada : le calculateur y applique les règles d’âge de début de 2026.',
    resume: (h) => `Le calculateur part d’un seul chiffre, la pension mensuelle à 65 ans inscrite sur votre état de compte des cotisations au RPC, et lui applique l’ajustement officiel selon l’âge choisi : ${h.pct(h.P.cpp.early, 1)} de moins par mois avant 65 ans, ${h.pct(h.P.cpp.late, 1)} de plus par mois après, entre ${h.num(h.P.cpp.min_age)} et ${h.num(h.P.cpp.max_age)} ans. Pour la pension moyenne des nouveaux retraités en juillet 2026, ${h.eur(h.P.cpp.avg_65, 2)}, on obtient ${h.eur(h.M.cppPension(h.P.cpp.avg_65, 60).monthly, 2)} par mois à 60 ans et ${h.eur(h.M.cppPension(h.P.cpp.avg_65, 70).monthly, 2)} à 70 ans. À côté du montant mensuel, l’outil additionne ce que verse chaque âge de début jusqu’à l’âge retenu et indique quand une pension commencée à 70 ans dépasse celle commencée à 65 ans : vers ${h.num(h.M.cppBreakEven(h.P.cpp.avg_65, 65, 70), 1)} ans. Tous les montants sont en dollars de 2026, avant impôt, sans indexation projetée. Le montant réellement versé est celui de la lettre de décision de Service Canada.`,
    faqs: (h) => [
      { q: 'Où trouver le montant à 65 ans demandé par le calcul du RPC ?', a: `Ouvrez une session dans Mon dossier Service Canada et consultez votre état de compte des cotisations au Régime de pensions du Canada. Il donne une estimation de la pension mensuelle à 65 ans selon vos cotisations à ce jour. Entrez ce chiffre tel quel ; au-delà de ${h.eur(h.P.cpp.max_65, 2)}, le maximum de 2026 à 65 ans, le calculateur plafonne, car aucune nouvelle pension ne peut le dépasser.` },
      { q: 'Pourquoi l’âge d’équilibre bouge-t-il si peu quand je change mon estimation du RPC ?', a: `Parce que l’ajustement selon l’âge est un pourcentage. Commencer à 70 ans multiplie la pension par ${h.num(h.M.cppFactor(70), 2)}, commencer à 65 ans par ${h.num(h.M.cppFactor(65), 0)}, quel que soit le montant : l’âge où le début tardif rattrape le début à 65 ans reste près de ${h.num(h.M.cppBreakEven(h.P.cpp.max_65, 65, 70), 1)} ans. Seuls les totaux en dollars suivent votre estimation.` },
      { q: 'Le calcul du RPC tient-il compte de la prestation après-retraite et de l’indexation ?', a: `Non. Il part uniquement de l’estimation de votre relevé. Si vous continuez à travailler après le début de votre pension et avant 70 ans, chaque année de cotisation ajoute une prestation après-retraite, d’au plus ${h.eur(h.P.cpp.pre_max_65, 2)} par mois en 2026 à 65 ans. Les pensions sont aussi indexées chaque janvier (${h.pct(h.P.cpp.indexation, 1)} pour 2026), ce que l’outil laisse volontairement de côté.` },
      { q: 'Puis-je utiliser cet outil du RPC si j’habite au Québec ?', a: 'Pas de façon fiable. Les travailleurs québécois cotisent au Régime de rentes du Québec, qui a ses propres taux, ses facteurs d’ajustement et son relevé de Retraite Québec. Les chiffres ici suivent uniquement les règles fédérales du RPC pour 2026. Si une partie de votre carrière s’est déroulée au Québec, demandez votre relevé du RRQ à Retraite Québec avant de comparer les âges de début.' },
    ],
    body: (h) => `
<h2>Ce que le calculateur établit</h2>
<p>Trois résultats s’affichent. D’abord, la pension de retraite mensuelle à l’âge de début choisi, de ${h.num(h.P.cpp.min_age)} à ${h.num(h.P.cpp.max_age)} ans, avec l’écart en pourcentage par rapport à 65 ans. Ensuite, un cumul pour un début à 60, 65 et 70 ans, compté jusqu’à l’âge que vous indiquez. Enfin, l’âge d’équilibre : l’anniversaire après lequel attendre 70 ans a rapporté davantage, au total, qu’un début à 65 ans.</p>
<p>Les règles appliquent l’ajustement mois par mois : commencer à 60 ans retire ${h.pct(h.P.cpp.early * 60, 0)}, commencer à 70 ans ajoute ${h.pct(h.P.cpp.late * 60, 0)}.</p>
<h2>Cas types pour 2026</h2>
${h.table(['Relevé à 65 ans', 'Début à 60 ans', 'Début à 65 ans', 'Début à 70 ans', 'Total à 85 ans, début à 60', 'Total à 85 ans, début à 70'], rows(h), 'Pension de retraite mensuelle du RPC selon l’âge de début, dollars de 2026 (calcul BenefitLedger selon les règles de Service Canada)', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>Lignes : le maximum de 2026, la moyenne des nouveaux retraités de juillet 2026, puis la moitié du maximum. Sur chaque ligne, le début tardif l’emporte à 85 ans : c’est pourquoi le ${h.a('cpp-at-60-or-70', 'guide sur le choix entre 60 et 70 ans')} parle surtout de santé, d’épargne et d’autres prestations plutôt que d’arithmétique seule.</p>
<h2>D’où viennent les chiffres</h2>
<p>Le maximum et la moyenne sont ceux que Service Canada publie pour 2026 (${h.src('cppAmounts')}). Les taux mensuels de ${h.pct(h.P.cpp.early, 1)} et de ${h.pct(h.P.cpp.late, 1)} viennent de la page sur l’âge de début (${h.src('cppStart')}). Votre relevé intègre déjà vos cotisations, y compris l’exclusion d’au plus ${h.num(h.P.x.dDropoutYears)} années de faibles gains pour la composante de base, comme l’explique ${h.src('dCppAmount' as SourceKey)}.</p>
<h2>Ce qu’il ne fait pas</h2>
<p>L’outil ne lit pas votre registre des gains et n’ajoute aucune année de travail future. Il ignore l’indexation, l’impôt et les prestations de survivant ou d’invalidité. Pour l’écart entre votre chiffre et le maximum, voyez le ${h.a('cpp-payment-amount', 'guide du montant du RPC')}. Les retraités à faible revenu regarderont aussi le ${h.a('guaranteed-income-supplement', 'Supplément de revenu garanti')}, car chaque dollar du RPC compte comme revenu pour ce calcul.</p>
`,
  },
});
