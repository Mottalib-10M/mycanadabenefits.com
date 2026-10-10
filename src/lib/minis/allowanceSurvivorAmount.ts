import { allowance, gisWorkExemption } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Allocation au survivant : montant mensuel et marge sous le seuil de revenu. */
export default (l: L) => ({
  title: T(l, 'Your Allowance for the Survivor', 'Votre Allocation au survivant'),
  cta: T(l, 'GIS calculator', 'Calculateur du SRG'),
  inputs: [
    { id: 'i', label: T(l, 'Your yearly income (survivor’s pension, interest…)', 'Votre revenu annuel (rente de conjoint survivant, intérêts…)'), def: 9000, unit: '$', max: 100000 },
    { id: 'e', label: T(l, 'Of which wages', 'Dont salaire'), def: 0, unit: '$', max: 100000 },
  ],
  run: ({ i, e }: Record<string, number>) => {
    const counted = Math.max(0, i - gisWorkExemption(Math.min(e, i)));
    const a = allowance(true, counted).monthly;
    return { head: [T(l, 'Allowance for the Survivor per month', 'Allocation au survivant par mois'), eur(a, l, 2)] as [string, string],
      rows: [[T(l, 'Income counted', 'Revenu compté'), eur(counted, l)], [T(l, 'Over twelve months', 'Sur douze mois'), eur(a * 12, l)], [T(l, 'Room left under the cut-off', 'Marge sous le seuil'), eur(Math.max(0, P.allowance.survivor_thr - counted), l)]] as [string, string][],
      note: T(l, 'October to December 2026, tax-free. Model fitted to ESDC’s published maximum and thresholds.', 'Octobre à décembre 2026, non imposable. Modèle calé sur le maximum et les seuils publiés par EDSC.') };
  },
});
