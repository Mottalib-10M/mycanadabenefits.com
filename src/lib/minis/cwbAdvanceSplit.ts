import { cwb } from '../engine/federal';
import { payDates } from '../engine/dates';
import { P } from '../engine/params';
import { T, eur, pct, jourMois, type L } from './_kit';
/** Paiements anticipés de l'ACT : moitié du montant 2026 versée d'avance, reste au moment de la déclaration. */
export default (l: L) => ({
  title: T(l, 'How much of your workers benefit comes early', 'La part de votre ACT versée d’avance'),
  cta: T(l, 'Full workers benefit calculator', 'Calculateur complet de l’ACT'),
  inputs: [
    { id: 'f', label: T(l, 'Household', 'Ménage'), def: 0, options: [T(l, 'Single, no child', 'Seul, sans enfant'), T(l, 'Spouse or child at home', 'Conjoint ou enfant à charge')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'w', label: T(l, 'Working income for the year', 'Revenu de travail de l’année'), def: 22000, unit: '$', max: 200000 },
    { id: 'i', label: T(l, 'Family net income', 'Revenu familial net'), def: 24000, unit: '$', max: 500000 },
  ],
  run: ({ f, w, i }: Record<string, number>) => {
    const r = cwb({ family: f === 1, working: w, afni: Math.max(i, w) });
    const d = payDates('acwb');
    return { head: [T(l, `Paid in advance (${pct(P.cwb.advance_share, l, 0)} at most)`, `Versé d’avance (${pct(P.cwb.advance_share, l, 0)} au plus)`), eur(r.advanceMax, l, 2)] as [string, string],
      rows: [[T(l, 'Full benefit for the year', 'Allocation complète de l’année'), eur(r.total, l, 2)], [T(l, 'Left for the tax return', 'Reste à la déclaration de revenus'), eur(r.total - r.advanceMax, l, 2)], [T(l, 'Last advance date published for 2026', 'Dernière date d’avance publiée pour 2026'), jourMois(d[d.length - 1], l)]] as [string, string][],
      note: T(l, 'General federal rates for 2026; Quebec, Alberta and Nunavut are not modelled. The CRA bases the advances on your return.', 'Barème fédéral général 2026 ; Québec, Alberta et Nunavut non modélisés. L’ARC calcule les avances d’après votre déclaration.') };
  },
});
