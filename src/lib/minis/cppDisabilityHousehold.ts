import { payDateIn } from '../engine/dates';
import { P } from '../engine/params';
import { T, eur, jourMois, moisOptions, type L } from './_kit';
/** Invalidité du RPC : dépôt mensuel du ménage (prestation + prestations d'enfant) et date du dépôt d'un mois choisi. */
export default (l: L) => ({
  title: T(l, 'CPP disability: what a household receives', 'Invalidité du RPC : ce que reçoit le ménage'),
  cta: T(l, 'CPP calculator', 'Calculateur du RPC'),
  inputs: [
    { id: 'd', label: T(l, 'Your monthly disability benefit', 'Votre prestation d’invalidité mensuelle'), def: Math.round(P.cpp.disability_avg), unit: '$', max: P.cpp.disability_max, decimals: 2 },
    { id: 'k', label: T(l, 'Dependent children', 'Enfants à charge'), def: 1, options: ['0', '1', '2', '3', '4'].map((x) => ({ value: x, label: x })) },
    { id: 'm', label: T(l, 'Month (2026)', 'Mois (2026)'), def: 11, options: moisOptions(l) },
  ],
  run: ({ d, k, m }: Record<string, number>) => {
    const own = Math.min(Math.max(d, 0), P.cpp.disability_max);
    const kids = k * P.cpp.child_rate;
    const date = payDateIn('cpp_oas', m || 1);
    return { head: [T(l, 'CPP deposit per month', 'Dépôt du RPC par mois'), eur(own + kids, l, 2)] as [string, string],
      rows: [
        [T(l, 'Fixed basic amount inside your benefit', 'Montant de base fixe compris'), eur(Math.min(own, P.cpp.disability_flat), l, 2)],
        [T(l, 'Children’s benefit', 'Prestation d’enfant'), eur(kids, l, 2)],
        [T(l, 'Over a full year', 'Sur une année complète'), eur((own + kids) * 12, l, 2)],
        [T(l, 'Deposit date that month', 'Date du dépôt ce mois-là'), date ? jourMois(date, l) : '–'],
      ] as [string, string][],
      note: T(l, `Work earnings above ${eur(P.x.dDisWorkLimit as number, l)} before tax in 2026 must be reported to Service Canada.`, `Un revenu de travail supérieur à ${eur(P.x.dDisWorkLimit as number, l)} avant impôt en 2026 doit être signalé à Service Canada.`) };
  },
});
