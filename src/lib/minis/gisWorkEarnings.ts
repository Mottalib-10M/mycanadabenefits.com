import { gis, gisWorkExemption, type GisCase } from '../engine/pensions';
import { T, eur, type L } from './_kit';
/** Exemption de revenu d'emploi du SRG : ce que le salaire coûte (ou ne coûte pas) en SRG mensuel. */
const KINDS: GisCase[] = ['single', 'spouse_oas'];
export default (l: L) => ({
  title: T(l, 'How much GIS you keep while working', 'Le SRG que vous gardez en travaillant'),
  cta: T(l, 'Full GIS calculator', 'Calculateur complet du SRG'),
  inputs: [
    { id: 'w', label: T(l, 'Yearly wages or self-employment earnings', 'Salaire ou revenu de travail autonome annuel'), def: 9000, unit: '$', max: 100000 },
    { id: 'o', label: T(l, 'Other income (CPP, pensions, interest)', 'Autres revenus (RPC, rentes, intérêts)'), def: 7000, unit: '$', max: 100000 },
    { id: 'k', label: T(l, 'Situation', 'Situation'), def: 0, options: [T(l, 'Single', 'Seul'), T(l, 'Couple, both on OAS', 'Couple, tous deux à la SV')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ w, o, k }: Record<string, number>) => {
    const kind = KINDS[k === 1 ? 1 : 0];
    const ex = gisWorkExemption(w);
    const counted = Math.max(0, w + o - ex);
    const withEx = gis(kind, counted).monthly, without = gis(kind, w + o).monthly;
    return { head: [T(l, 'GIS per month with the exemption', 'SRG par mois avec l’exemption'), eur(withEx, l, 2)] as [string, string],
      rows: [[T(l, 'Earnings exempted', 'Gains exemptés'), eur(ex, l)], [T(l, 'Income counted for the GIS', 'Revenu compté pour le SRG'), eur(counted, l)], [T(l, 'GIS if no exemption existed', 'SRG sans exemption'), eur(without, l, 2)], [T(l, 'Monthly gain from the exemption', 'Gain mensuel dû à l’exemption'), eur(withEx - without, l, 2)]] as [string, string][],
      note: T(l, 'October to December 2026, per person. For a couple, enter combined income and the wages of one partner.', 'Octobre à décembre 2026, par personne. Pour un couple, inscrivez le revenu combiné et le salaire d’un seul conjoint.') };
  },
});
