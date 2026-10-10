import { oas, gis } from '../engine/pensions';
import { T, eur, type L } from './_kit';
/** Accueil : SV + SRG d'une personne seule selon son revenu hors SV. */
export default (l: L) => ({
  title: T(l, 'OAS and GIS for a single senior', 'SV et SRG d’une personne seule'),
  cta: T(l, 'GIS calculator', 'Calculateur du SRG'),
  inputs: [{ id: 'i', label: T(l, 'Yearly income without OAS', 'Revenu annuel hors SV'), def: 12000, unit: '$', max: 200000 }],
  run: ({ i }: Record<string, number>) => {
    const o = oas({ years: 40, startAge: 65, netIncome: i }), g = gis('single', i);
    return { head: [T(l, 'OAS + GIS per month', 'SV + SRG par mois'), eur(o.net + g.monthly, l, 2)] as [string, string],
      rows: [[T(l, 'Old Age Security', 'Sécurité de la vieillesse'), eur(o.net, l, 2)], [T(l, 'Guaranteed Income Supplement', 'Supplément de revenu garanti'), eur(g.monthly, l, 2)]] as [string, string][],
      note: T(l, 'October to December 2026, age 65 to 74, 40 years in Canada.', 'Octobre à décembre 2026, 65 à 74 ans, 40 ans au Canada.') };
  },
});
