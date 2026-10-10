import { cgeb } from '../engine/federal';
import { payDates } from '../engine/dates';
import { P } from '../engine/params';
import { T, eur, jourMois, type L } from './_kit';
/** Dates TPS / ACEBE : quatre versements trimestriels ou un seul versement en juillet (moins de 50 $ par trimestre). */
export default (l: L) => ({
  title: T(l, 'Quarterly payments or one July payment?', 'Quatre versements ou un seul en juillet ?'),
  cta: T(l, 'GST credit and CGEB calculator', 'Calculateur du crédit TPS et de l’ACEBE'),
  inputs: [
    { id: 's', label: T(l, 'Situation', 'Situation'), def: 0, options: [{ value: '0', label: T(l, 'Single', 'Seul') }, { value: '1', label: T(l, 'Couple', 'En couple') }] },
    { id: 'c', label: T(l, 'Children under 19', 'Enfants de moins de 19 ans'), def: 0, max: 10 },
    { id: 'i', label: T(l, 'Family net income (2025)', 'Revenu familial net (2025)'), def: 52000, unit: '$', max: 500000 },
  ],
  run: ({ s, c, i }: Record<string, number>) => {
    const r = cgeb({ couple: s === 1, children: c || 0, afni: i });
    const min = P.x.aCgebQuarterMin as number;
    const d = payDates('cgeb').filter((x) => x >= '2026-07-01');
    const lump = r.annual > 0 && r.quarterly < min;
    const head = r.annual === 0 ? T(l, 'No payment', 'Aucun versement') : lump ? T(l, `One payment of ${eur(r.annual, l, 2)}`, `Un versement de ${eur(r.annual, l, 2)}`) : T(l, `Four payments of ${eur(r.quarterly, l, 2)}`, `Quatre versements de ${eur(r.quarterly, l, 2)}`);
    return { head: [T(l, 'From July 2026 to April 2027', 'De juillet 2026 à avril 2027'), head] as [string, string],
      rows: [[T(l, 'Yearly benefit', 'Allocation annuelle'), eur(r.annual, l, 2)], [T(l, 'Per quarter', 'Par trimestre'), eur(r.quarterly, l, 2)],
        [T(l, 'Dates', 'Dates'), r.annual === 0 ? '–' : lump ? jourMois(d[0], l) : `${d.map((x) => jourMois(x, l)).join(' · ')} · ${T(l, 'January and April 2027', 'janvier et avril 2027')}`]] as [string, string][],
      note: T(l, `Under ${eur(min, l)} per quarter, the CRA pays the whole year in July. The 2027 dates are not published yet.`, `Sous ${eur(min, l)} par trimestre, l’ARC verse toute l’année en juillet. Les dates de 2027 ne sont pas encore publiées.`) };
  },
});
