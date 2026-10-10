/**
 * Prestations fédérales versées par l'ARC : allocation canadienne pour enfants (ACE) et prestation
 * pour enfants handicapés, allocation canadienne pour l'épicerie et les besoins essentiels (ACEBE,
 * ex-crédit TPS/TVH), allocation canadienne pour les travailleurs (ACT), prestation canadienne pour
 * les personnes en situation de handicap (EDSC), Régime canadien de soins dentaires.
 * Fonctions pures : tous les montants viennent de params-2026.json.
 */
import { P } from './params';

const pos = (x: number) => Math.max(0, x);
const r2 = (x: number) => Math.round(x * 100) / 100;

export interface CcbIn { under6: number; age6to17: number; afni: number; disabled?: number }
export interface CcbOut { max: number; reduction: number; base: number; cdb: number; annual: number; monthly: number; lumpSum: boolean; band: 0 | 1 | 2 }
/** ACE de juillet 2026 à juin 2027 : maximum par enfant moins la réduction selon le revenu familial net rajusté. */
export function ccb({ under6, age6to17, afni, disabled = 0 }: CcbIn): CcbOut {
  const C = P.ccb;
  const n = under6 + age6to17;
  const max = under6 * C.max_under6 + age6to17 * C.max_6_17;
  let reduction = 0; let band: 0 | 1 | 2 = 0;
  if (n > 0) {
    const i = Math.min(n, 4) - 1;
    if (afni > C.t2) { reduction = C.base2[i] + C.r2[i] * (afni - C.t2); band = 2; }
    else if (afni > C.t1) { reduction = C.r1[i] * (afni - C.t1); band = 1; }
  }
  const base = pos(max - reduction);
  const d = Math.min(disabled, n);
  const cdbMax = d * C.cdb.max;
  const cdb = d > 0 ? pos(cdbMax - (afni > C.cdb.threshold ? C.cdb.r[d >= 2 ? 1 : 0] * (afni - C.cdb.threshold) : 0)) : 0;
  const annual = r2(base + cdb);
  return { max, reduction: r2(Math.min(reduction, max)), base: r2(base), cdb: r2(cdb), annual, monthly: r2(annual / 12), lumpSum: annual > 0 && annual < C.lump_sum_under, band };
}
/** Revenu familial net rajusté à partir duquel l'ACE tombe à zéro (recherche par dichotomie sur le moteur). */
export function ccbZeroIncome(under6: number, age6to17: number): number {
  let lo = 0, hi = 2_000_000;
  for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (ccb({ under6, age6to17, afni: m }).base > 0) lo = m; else hi = m; }
  return Math.ceil(hi);
}

export interface CgebIn { couple: boolean; children: number; afni: number; ownNetIncome?: number }
export interface CgebOut { base: number; supplement: number; reduction: number; annual: number; quarterly: number }
/**
 * ACEBE (ex-crédit TPS/TVH), année de base 2025, versée de juillet 2026 à avril 2027 :
 * 445 $ par adulte, 445 $ pour le premier enfant d'une famille monoparentale, 234 $ par enfant,
 * supplément de 234 $ (personne seule : 2 % du revenu au-delà de 11 564 $ ; parent seul : entier),
 * réduit de 5 % du revenu familial net rajusté au-delà de 46 432 $.
 */
export function cgeb({ couple, children, afni, ownNetIncome }: CgebIn): CgebOut {
  const G = P.cgeb;
  let base = G.individual;
  let supplement = 0;
  if (couple) base += G.spouse + children * G.child;
  else if (children > 0) { base += G.first_child_single + (children - 1) * G.child; supplement = G.single_supp; }
  else supplement = Math.min(G.single_supp, G.supp_rate * pos((ownNetIncome ?? afni) - G.supp_start));
  const gross = base + supplement;
  const reduction = Math.min(gross, G.rate * pos(afni - G.threshold));
  const annual = r2(gross - reduction);
  return { base, supplement: r2(supplement), reduction: r2(reduction), annual, quarterly: r2(annual / 4) };
}

export interface CwbIn { family: boolean; working: number; afni: number; spouseWorking?: number; disability?: boolean; spouseDisability?: boolean }
export interface CwbOut { basic: number; disability: number; total: number; adjustedIncome: number; advanceMax: number }
/**
 * ACT 2026 : 27 % du revenu de travail au-delà de 3 000 $, plafonné, réduit de 15 % du revenu net
 * rajusté au-delà du seuil ; exemption du deuxième revenu (le plus faible revenu de travail du
 * couple, jusqu'à 16 714 $) ; supplément pour invalidité : 27 % au-delà de 1 150 $, plafonné à 860 $.
 * Barème général : le Québec, l'Alberta et le Nunavut ont des paramètres propres non modélisés.
 */
export function cwb({ family, working, afni, spouseWorking = 0, disability = false, spouseDisability = false }: CwbIn): CwbOut {
  const W = P.cwb;
  const totalWork = working + (family ? spouseWorking : 0);
  const secondary = family && spouseWorking > 0 ? Math.min(Math.min(working, spouseWorking), W.secondary_exempt) : 0;
  const adjustedIncome = pos(afni - secondary);
  const max = family ? W.max_family : W.max_single;
  const thr = family ? W.thr_family : W.thr_single;
  const basic = pos(Math.min(max, W.phase_in * pos(totalWork - W.min_work)) - W.rate * pos(adjustedIncome - thr));
  let dis = 0;
  if (disability || spouseDisability) {
    const both = disability && spouseDisability;
    const one = (w: number) => Math.min(W.dis_max, W.phase_in * pos(w - W.dis_min_work));
    const dthr = family ? W.dis_thr_family : W.dis_thr_single;
    const rate = both ? W.dis_rate_both : W.dis_rate;
    const each = (w: number) => pos(one(w) - rate * pos(adjustedIncome - dthr));
    dis = (disability ? each(working) : 0) + (spouseDisability && family ? each(spouseWorking) : 0);
  }
  const total = r2(basic + dis);
  return { basic: r2(basic), disability: r2(dis), total, adjustedIncome, advanceMax: r2(total * W.advance_share) };
}

export interface CdbIn { couple: boolean; bothEligible?: boolean; afni: number; working: number; age: number; dtc: boolean }
export interface CdbOut { eligible: boolean; reason?: 'age' | 'dtc'; countedIncome: number; annual: number; monthly: number }
/** Prestation canadienne pour les personnes en situation de handicap, juillet 2026 à juin 2027 (revenu 2025). */
export function canadaDisabilityBenefit({ couple, bothEligible = false, afni, working, age, dtc }: CdbIn): CdbOut {
  const D = P.cdb;
  if (age < D.age[0] || age > D.age[1]) return { eligible: false, reason: 'age', countedIncome: 0, annual: 0, monthly: 0 };
  if (!dtc) return { eligible: false, reason: 'dtc', countedIncome: 0, annual: 0, monthly: 0 };
  const exempt = Math.min(working, couple ? D.work_exempt_couple : D.work_exempt_single);
  const countedIncome = pos(afni - exempt);
  const thr = couple ? D.thr_couple : D.thr_single;
  const rate = couple && bothEligible ? D.rate_both : D.rate;
  const annual = r2(pos(D.max_month * 12 - rate * pos(countedIncome - thr)));
  return { eligible: true, countedIncome, annual, monthly: r2(annual / 12) };
}

/** Régime canadien de soins dentaires : part payée par le régime et quote-part selon le revenu familial net rajusté. */
export function dental(afni: number): { eligible: boolean; copay: number } {
  const D = P.dental;
  if (afni >= D.income_limit) return { eligible: false, copay: 1 };
  for (const [limit, copay] of D.bands as [number, number][]) if (afni < limit) return { eligible: true, copay };
  return { eligible: false, copay: 1 };
}
