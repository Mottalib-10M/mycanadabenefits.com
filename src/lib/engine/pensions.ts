/**
 * Pensions fédérales : Régime de pensions du Canada (RPC), Sécurité de la vieillesse (SV) et impôt
 * de récupération, Supplément de revenu garanti (SRG), Allocation et Allocation au survivant, FERR.
 * Montants du trimestre d'octobre à décembre 2026 (EDSC), lus dans params-2026.json.
 */
import { P } from './params';
const pos = (x: number) => Math.max(0, x);
const r2 = (x: number) => Math.round(x * 100) / 100;

/** Facteur d'ajustement du RPC selon l'âge de début (en mois depuis 60 ans, 60 à 70 ans). */
export function cppFactor(ageYears: number, extraMonths = 0): number {
  const C = P.cpp;
  const m = Math.round((Math.min(C.max_age, Math.max(C.min_age, ageYears)) - 65) * 12 + extraMonths);
  const months = Math.max(-60, Math.min(60, m));
  return months < 0 ? 1 + C.early * months : 1 + C.late * months;
}
export interface CppOut { factor: number; monthly: number; annual: number; capped: boolean }
/** Pension de retraite du RPC pour un montant estimé à 65 ans (relevé de Service Canada) et un âge de début. */
export function cppPension(at65: number, startAge: number): CppOut {
  const capped = at65 > P.cpp.max_65;
  const base = Math.min(at65, P.cpp.max_65);
  const factor = cppFactor(startAge);
  const monthly = r2(base * factor);
  return { factor, monthly, annual: r2(monthly * 12), capped };
}
/** Total reçu de l'âge de début jusqu'à un âge donné (sans indexation, en dollars de 2026). */
export function cppCumulative(at65: number, startAge: number, toAge: number): number {
  return r2(cppPension(at65, startAge).monthly * 12 * pos(toAge - startAge));
}
/** Âge auquel commencer à `a` rattrape commencer à `b` (a > b), en années, sans indexation. */
export function cppBreakEven(at65: number, b: number, a: number): number {
  const pb = cppPension(at65, b).monthly, pa = cppPension(at65, a).monthly;
  if (pa <= pb) return Infinity;
  return Math.round((a + (pb * (a - b)) / (pa - pb)) * 10) / 10;
}
/** Cotisation 2026 d'un salarié au RPC de base et au RPC2. */
export function cppContribution(earnings: number, selfEmployed = false) {
  const C = P.cpp;
  const base = r2(C.rate * pos(Math.min(earnings, C.ympe) - C.exemption));
  const second = r2(C.cpp2_rate * pos(Math.min(earnings, C.yampe) - C.ympe));
  const k = selfEmployed ? 2 : 1;
  return { base: base * k, second: second * k, total: r2((base + second) * k) };
}

export interface OasIn { years: number; startAge: number; age75?: boolean; netIncome?: number; incomeYear?: 2025 | 2026 }
export interface OasOut { eligible: boolean; fraction: number; gross: number; recovery: number; net: number; annualNet: number; deferral: number }
/** Pension de la SV d'octobre à décembre 2026 : pension partielle (années ÷ 40), report jusqu'à 70 ans, +10 % à 75 ans, récupération de 15 %. */
export function oas({ years, startAge, age75 = false, netIncome = 0, incomeYear = 2025 }: OasIn): OasOut {
  const O = P.oas;
  const y = Math.min(O.res_full, Math.floor(years));
  if (y < O.res_min) return { eligible: false, fraction: 0, gross: 0, recovery: 0, net: 0, annualNet: 0, deferral: 0 };
  const fraction = y / O.res_full;
  const months = Math.round((Math.min(70, Math.max(65, startAge)) - 65) * 12);
  const deferral = Math.min(O.defer_max, O.defer * months);
  const max = age75 ? O.max_75 : O.max_65_74;
  const gross = r2(max * fraction * (1 + deferral));
  const thr = incomeYear === 2026 ? O.recovery.thr_2026 : O.recovery.thr_2025;
  const recovery = r2(Math.min(gross, (O.recovery.rate * pos(netIncome - thr)) / 12));
  const net = r2(gross - recovery);
  return { eligible: true, fraction, gross, recovery, net, annualNet: r2(net * 12), deferral };
}
/** Impôt de récupération annuel de la SV pour un revenu net et une pension annuelle donnés. */
export function oasRecovery(netIncome: number, annualOas: number, incomeYear: 2025 | 2026 = 2025): number {
  const R = P.oas.recovery;
  return r2(Math.min(annualOas, R.rate * pos(netIncome - (incomeYear === 2026 ? R.thr_2026 : R.thr_2025))));
}

/** Exemption de revenu d'emploi du SRG et de l'Allocation : 5 000 $ entiers, puis la moitié jusqu'à 15 000 $. */
export function gisWorkExemption(employment: number): number {
  const G = P.gis;
  return Math.min(employment, G.work_exempt_full) + 0.5 * Math.min(pos(employment - G.work_exempt_full), G.work_exempt_half_to - G.work_exempt_full);
}
export type GisCase = 'single' | 'spouse_oas' | 'spouse_allowance' | 'spouse_no_oas';
/**
 * SRG mensuel d'octobre à décembre 2026. Modèle calé sur les grilles d'EDSC : partie de base réduite
 * de 1 $ par 2 $ de revenu mensuel (personne seule) ou par 4 $ de revenu mensuel combiné (couple),
 * complément réduit de 1 $ par 4 $ (puis 8 $) au-delà de 2 000 $ (4 000 $ pour un couple), chaque
 * paramètre recalé pour retomber exactement sur le maximum, le seuil du complément et le seuil de revenu
 * publiés. Écart possible d'environ un dollar par mois entre deux seuils (arrondi des tranches de revenu).
 */
export function gis(kind: GisCase, income: number): { monthly: number; basic: number; topup: number } {
  const g = P.gis[kind];
  const single = kind === 'single';
  const d = single ? 24 : 48;
  const x0 = single ? 2000 : 4000;
  const tp = Math.min(g.max, (g.topup_thr - x0) / (2 * d));
  const bm = g.max - tp;
  const x = pos(g.thr - bm * d);
  const i = pos(income);
  const basic = pos(Math.min(bm, bm - (i - x) / d));
  const topup = pos(tp - pos(i - x0) / (2 * d));
  const monthly = i >= g.thr ? 0 : r2(basic + topup);
  return { monthly, basic: r2(basic), topup: r2(i >= g.thr ? 0 : topup) };
}
/**
 * Allocation (60 à 64 ans, conjoint d'un pensionné du SRG) ou Allocation au survivant, d'octobre à
 * décembre 2026 : partie équivalente à la SV réduite de 3 $ par 4 $ de revenu mensuel, puis partie
 * équivalente au SRG et complément, calés sur le maximum et les seuils publiés par EDSC.
 */
export function allowance(survivor: boolean, income: number): { monthly: number } {
  const A = P.allowance;
  const max = survivor ? A.survivor_max : A.max;
  const thr = survivor ? A.survivor_thr : A.thr;
  const topThr = survivor ? A.survivor_topup_thr : A.topup_thr;
  const d = survivor ? 24 : 48;
  const x0 = survivor ? 2000 : 4000;
  const i = pos(income);
  if (i >= thr) return { monthly: 0 };
  const oasPart = P.oas.max_65_74;
  const tp = (topThr - x0) / (2 * d);
  const bm = max - oasPart - tp;
  const x = pos(thr - bm * d);
  const o = pos(oasPart - i / 16);
  const basic = pos(Math.min(bm, bm - (i - x) / d));
  const topup = pos(tp - pos(i - x0) / (2 * d));
  return { monthly: r2(o + basic + topup) };
}

/** Retrait minimum d'un FERR pour l'année : valeur au 1er janvier × facteur selon l'âge au 1er janvier. */
export function rrifMinimum(value: number, ageJan1: number): { factor: number; minimum: number } {
  const F = P.rrif.factors as Record<string, number>;
  const factor = ageJan1 < 71 ? 1 / (90 - ageJan1) : F[String(Math.min(95, Math.floor(ageJan1)))];
  return { factor, minimum: r2(value * factor) };
}
