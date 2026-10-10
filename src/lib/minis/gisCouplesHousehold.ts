import { gis, allowance, type GisCase } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** SRG en couple : ce que touche le ménage (SRG du pensionné + SRG ou Allocation du conjoint) selon la situation du conjoint. */
const KINDS: GisCase[] = ['spouse_oas', 'spouse_allowance', 'spouse_no_oas'];
export default (l: L) => ({
  title: T(l, 'GIS for a couple, by your spouse’s situation', 'Le SRG d’un couple selon la situation du conjoint'),
  cta: T(l, 'Full GIS calculator', 'Calculateur complet du SRG'),
  inputs: [
    { id: 'k', label: T(l, 'Your spouse', 'Votre conjoint'), def: 0, options: [T(l, 'Also receives OAS', 'Reçoit aussi la SV'), T(l, 'Receives the Allowance (60 to 64)', 'Reçoit l’Allocation (60 à 64 ans)'), T(l, 'Receives neither', 'Ne reçoit ni l’une ni l’autre')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'i', label: T(l, 'Combined yearly income, OAS excluded', 'Revenu annuel combiné, hors SV'), def: 14000, unit: '$', max: 100000 },
  ],
  run: ({ k, i }: Record<string, number>) => {
    const kind = KINDS[Math.min(2, Math.max(0, k || 0))];
    const own = gis(kind, i).monthly;
    const partner = kind === 'spouse_oas' ? own : kind === 'spouse_allowance' ? allowance(false, i).monthly : 0;
    const partnerLabel = kind === 'spouse_oas' ? T(l, 'Spouse’s GIS', 'SRG du conjoint') : kind === 'spouse_allowance' ? T(l, 'Spouse’s Allowance', 'Allocation du conjoint') : T(l, 'Spouse (no benefit)', 'Conjoint (aucune prestation)');
    return { head: [T(l, 'Paid to the couple each month', 'Versé au couple chaque mois'), eur(own + partner, l, 2)] as [string, string],
      rows: [[T(l, 'Pensioner’s GIS', 'SRG du pensionné'), eur(own, l, 2)], [partnerLabel, eur(partner, l, 2)], [T(l, 'Combined cut-off in this situation', 'Seuil combiné dans cette situation'), eur(P.gis[kind].thr, l)]] as [string, string][],
      note: T(l, 'October to December 2026, OAS pensions not included. Model fitted to the ESDC grid, within about $1 a month between thresholds.', 'Octobre à décembre 2026, pensions de la SV non comprises. Modèle calé sur la grille d’EDSC, à environ 1 $ par mois près entre deux seuils.') };
  },
});
