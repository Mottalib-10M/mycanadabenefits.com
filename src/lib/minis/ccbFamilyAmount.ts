import { ccb } from '../engine/federal';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
/** ACE : montant mensuel selon l'âge des enfants et le revenu familial net rajusté, avec la tranche de réduction. */
export default (l: L) => ({
  title: T(l, 'Your Canada child benefit, July 2026 to June 2027', 'Votre allocation canadienne pour enfants, juillet 2026 à juin 2027'),
  cta: T(l, 'Open the full CCB calculator', 'Ouvrir le calculateur complet de l’ACE'),
  inputs: [
    { id: 'u', label: T(l, 'Children under 6', 'Enfants de moins de 6 ans'), def: 1, max: 10 },
    { id: 'o', label: T(l, 'Children aged 6 to 17', 'Enfants de 6 à 17 ans'), def: 1, max: 10 },
    { id: 'i', label: T(l, 'Adjusted family net income 2025', 'Revenu familial net rajusté 2025'), def: 65000, unit: '$', max: 1000000 },
  ],
  run: ({ u, o, i }: Record<string, number>) => {
    const r = ccb({ under6: u || 0, age6to17: o || 0, afni: i || 0 });
    const band = r.band === 0 ? T(l, `None: income at or under ${eur(P.ccb.t1, l)}`, `Aucune : revenu d’au plus ${eur(P.ccb.t1, l)}`)
      : r.band === 1 ? T(l, `First tier, ${eur(P.ccb.t1, l)} to ${eur(P.ccb.t2, l)}`, `Première tranche, de ${eur(P.ccb.t1, l)} à ${eur(P.ccb.t2, l)}`)
      : T(l, `Second tier, over ${eur(P.ccb.t2, l)}`, `Deuxième tranche, au-delà de ${eur(P.ccb.t2, l)}`);
    return { head: [T(l, 'Per month', 'Par mois'), r.lumpSum ? T(l, `${eur(r.annual, l, 2)} in July`, `${eur(r.annual, l, 2)} en juillet`) : eur(r.monthly, l, 2)] as [string, string],
      rows: [[T(l, 'Maximum before reduction', 'Maximum avant réduction'), eur(r.max, l)], [T(l, 'Income reduction', 'Réduction selon le revenu'), eur(r.reduction, l, 2)], [T(l, 'Reduction tier', 'Tranche de réduction'), band], [T(l, 'Children counted', 'Enfants comptés'), num((u || 0) + (o || 0), l)]] as [string, string][],
      note: T(l, `Under ${eur(P.ccb.lump_sum_under, l)} for the year, the CRA pays one sum in July. Your notice from the CRA gives the amount paid.`, `Sous ${eur(P.ccb.lump_sum_under, l)} pour l’année, l’ARC verse une seule somme en juillet. L’avis de l’ARC fait foi du montant versé.`) };
  },
});
