import { gis, allowance, gisWorkExemption } from '../engine/pensions';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Allocation (60 à 64 ans) : montant du conjoint et SRG du pensionné pour un revenu combiné. */
export default (l: L) => ({
  title: T(l, 'Allowance for a spouse aged 60 to 64', 'L’Allocation d’un conjoint de 60 à 64 ans'),
  cta: T(l, 'GIS calculator', 'Calculateur du SRG'),
  inputs: [
    { id: 'i', label: T(l, 'Couple’s yearly income, OAS excluded', 'Revenu annuel du couple, hors SV'), def: 12000, unit: '$', max: 100000 },
    { id: 'e', label: T(l, 'Of which wages of one partner', 'Dont salaire d’un conjoint'), def: 0, unit: '$', max: 100000 },
  ],
  run: ({ i, e }: Record<string, number>) => {
    const counted = Math.max(0, i - gisWorkExemption(Math.min(e, i)));
    const a = allowance(false, counted).monthly, g = gis('spouse_allowance', counted).monthly;
    return { head: [T(l, 'Allowance per month', 'Allocation par mois'), eur(a, l, 2)] as [string, string],
      rows: [[T(l, 'Pensioner’s GIS', 'SRG du pensionné'), eur(g, l, 2)], [T(l, 'Allowance + GIS for the couple', 'Allocation + SRG du couple'), eur(a + g, l, 2)], [T(l, 'Income counted / cut-off', 'Revenu compté / seuil'), `${eur(counted, l)} / ${eur(P.allowance.thr, l)}`]] as [string, string][],
      note: T(l, 'October to December 2026, pensioner’s OAS not included. Model fitted to ESDC’s published maximum and thresholds.', 'Octobre à décembre 2026, SV du pensionné non comprise. Modèle calé sur le maximum et les seuils publiés par EDSC.') };
  },
});
