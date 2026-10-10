import { cwb } from '../engine/federal';
import { T, eur, type L } from './_kit';
/** Supplément pour invalidité de l'ACT : montant selon la situation (seul, un ou deux conjoints admis au CIPH). */
export default (l: L) => ({
  title: T(l, 'Your CWB disability supplement for 2026', 'Votre supplément pour invalidité de l’ACT 2026'),
  cta: T(l, 'Full workers benefit calculator', 'Calculateur complet de l’ACT'),
  inputs: [
    { id: 's', label: T(l, 'Situation', 'Situation'), def: 0, options: [T(l, 'Single, DTC approved', 'Seul, admis au CIPH'), T(l, 'Couple, one spouse with the DTC', 'Couple, un conjoint admis au CIPH'), T(l, 'Couple, both with the DTC', 'Couple, les deux admis au CIPH')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'w', label: T(l, 'Working income of each person with the DTC', 'Revenu de travail de chaque personne admise'), def: 9000, unit: '$', max: 200000 },
    { id: 'i', label: T(l, 'Family net income', 'Revenu familial net'), def: 30000, unit: '$', max: 500000 },
  ],
  run: ({ s, w, i }: Record<string, number>) => {
    const fam = s > 0, both = s === 2;
    const r = cwb({ family: fam, working: w, spouseWorking: both ? w : 0, afni: Math.max(i, both ? 2 * w : w), disability: true, spouseDisability: both });
    return { head: [T(l, 'Disability supplement', 'Supplément pour invalidité'), eur(r.disability, l, 2)] as [string, string],
      rows: [[T(l, 'Basic amount', 'Montant de base'), eur(r.basic, l, 2)], [T(l, 'Total workers benefit', 'ACT totale'), eur(r.total, l, 2)], [T(l, 'Income used for the reduction', 'Revenu retenu pour la réduction'), eur(r.adjustedIncome, l)]] as [string, string][],
      note: T(l, 'When both spouses have the DTC, each is assumed to earn the amount entered. Quebec, Alberta and Nunavut are not modelled.', 'Si les deux conjoints sont admis, chacun est supposé gagner le montant saisi. Québec, Alberta et Nunavut non modélisés.') };
  },
});
