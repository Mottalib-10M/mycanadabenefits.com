import { gis, rrifMinimum } from '../engine/pensions';
import { T, eur, type L } from './_kit';
/** FERR et SRG : retrait minimum de l'année et SRG mensuel perdu quand ce retrait s'ajoute au revenu (personne seule). */
export default (l: L) => ({
  title: T(l, 'What your RRIF minimum costs in GIS', 'Ce que votre minimum FERR coûte en SRG'),
  cta: T(l, 'GIS calculator', 'Calculateur du SRG'),
  inputs: [
    { id: 'v', label: T(l, 'RRIF value on January 1', 'Valeur du FERR au 1er janvier'), def: 60000, unit: '$', max: 5000000 },
    { id: 'a', label: T(l, 'Age on January 1', 'Âge au 1er janvier'), def: 72, max: 110 },
    { id: 'i', label: T(l, 'Other income, OAS excluded (CPP, pensions)', 'Autres revenus hors SV (RPC, rentes)'), def: 9000, unit: '$', max: 200000 },
  ],
  run: ({ v, a, i }: Record<string, number>) => {
    const r = rrifMinimum(v, a || 72);
    const without = gis('single', i).monthly, withIt = gis('single', i + r.minimum).monthly;
    return { head: [T(l, 'GIS lost per month', 'SRG perdu par mois'), eur(without - withIt, l, 2)] as [string, string],
      rows: [
        [T(l, 'Minimum withdrawal for the year', 'Retrait minimum de l’année'), eur(r.minimum, l, 2)],
        [T(l, 'GIS without the withdrawal', 'SRG sans le retrait'), eur(without, l, 2)],
        [T(l, 'GIS once the withdrawal is counted', 'SRG une fois le retrait compté'), eur(withIt, l, 2)],
        [T(l, 'GIS lost over twelve months', 'SRG perdu sur douze mois'), eur((without - withIt) * 12, l, 2)],
      ] as [string, string][],
      note: T(l, 'Single senior, October to December 2026 GIS grid. GIS model accurate to about $1 a month; the loss shows up in the GIS based on that year’s income.', 'Personne seule, grille du SRG d’octobre à décembre 2026. Modèle du SRG à environ 1 $ par mois près ; la perte apparaît dans le SRG calculé sur le revenu de cette année-là.') };
  },
});
