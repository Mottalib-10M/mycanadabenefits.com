import { oas, gis } from '../engine/pensions';
import { T, eur, pct, num, type L } from './_kit';
/** Report de la SV : pension mensuelle à l'âge de début choisi, âge où le report est rattrapé, SRG perdu pendant l'attente (personne seule). */
const AGES = [65, 66, 67, 68, 69, 70];
export default (l: L) => ({
  title: T(l, 'What waiting for OAS is worth', 'Ce que vaut l’attente pour la SV'),
  cta: T(l, 'Full OAS calculator', 'Calculateur complet de la SV'),
  inputs: [
    { id: 'a', label: T(l, 'Age you start OAS', 'Âge de début de la SV'), def: 68, options: AGES.map((x) => ({ value: String(x), label: String(x) })) },
    { id: 'y', label: T(l, 'Years in Canada after 18', 'Années au Canada après 18 ans'), def: 40, max: 60 },
    { id: 'i', label: T(l, 'Yearly income without OAS (single)', 'Revenu annuel hors SV (personne seule)'), def: 20000, unit: '$', max: 300000 },
  ],
  run: ({ a, y, i }: Record<string, number>) => {
    const age = AGES.includes(a) ? a : 68;
    const now = oas({ years: y, startAge: 65 }), later = oas({ years: y, startAge: age });
    const gain = later.gross - now.gross;
    // Âge où le total reçu en commençant plus tard rattrape le total reçu dès 65 ans (sans indexation).
    const breakEven = gain > 0 ? age + (now.gross * (age - 65)) / gain : 0;
    const lostGis = gis('single', i).monthly * 12 * (age - 65);
    return { head: [T(l, `OAS per month from ${age}`, `SV par mois dès ${age} ans`), later.eligible ? eur(later.gross, l, 2) : T(l, 'Not eligible', 'Non admissible')] as [string, string],
      rows: [
        [T(l, 'Deferral increase', 'Majoration pour report'), pct(later.deferral, l, 1)],
        [T(l, 'Same pension started at 65', 'Même pension commencée à 65 ans'), eur(now.gross, l, 2)],
        [T(l, 'Age when waiting pays off', 'Âge où l’attente est rattrapée'), breakEven ? num(breakEven, l, 1) : '–'],
        [T(l, 'GIS given up while waiting', 'SRG perdu pendant l’attente'), eur(lostGis, l)],
      ] as [string, string][],
      note: T(l, 'October to December 2026 rates, no indexation. GIS is not paid without OAS and does not increase with deferral (model, about $1 a month).', 'Taux d’octobre à décembre 2026, sans indexation. Le SRG n’est pas versé sans la SV et n’augmente pas avec le report (modèle, à 1 $ par mois près).') };
  },
});
