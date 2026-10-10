/** Calendrier 2026 des versements (ARC, Service Canada, EDSC), lu dans params-2026.json. */
import { P } from './params';

export type PayKey = 'cpp_oas' | 'ccb' | 'cgeb' | 'acwb' | 'otb' | 'acfb' | 'cdb' | 'nldb';
export const PAY_KEYS: PayKey[] = ['cpp_oas', 'ccb', 'cgeb', 'acwb', 'otb', 'acfb', 'cdb', 'nldb'];
/** Toutes les dates 2026 connues d'une prestation (ISO). L'ACEBE reprend les deux versements du crédit TPS/TVH de janvier et d'avril. */
export function payDates(k: PayKey): string[] {
  switch (k) {
    case 'cpp_oas': return P.pay_dates_2026.cpp_oas;
    case 'ccb': return P.ccb.dates_2026;
    case 'cgeb': return [...P.cgeb.gst_dates_2026, ...P.cgeb.dates.filter((d) => d.length === 10)];
    case 'acwb': return P.cwb.advance_dates_2026;
    case 'otb': return P.pay_dates_2026.otb;
    case 'acfb': return P.pay_dates_2026.acfb;
    case 'cdb': return P.cdb.dates_2026;
    case 'nldb': return P.pay_dates_2026.nldb;
  }
}
/** Date de versement d'une prestation pour un mois donné (1 à 12), ou null s'il n'y en a pas ce mois-là. */
export function payDateIn(k: PayKey, month: number): string | null {
  return payDates(k).find((d) => Number(d.slice(5, 7)) === month) ?? null;
}
/** Versements restants à partir d'une date ISO, triés, toutes prestations confondues. */
export function upcoming(fromIso: string, keys: PayKey[] = PAY_KEYS): Array<{ key: PayKey; date: string }> {
  return keys.flatMap((key) => payDates(key).filter((d) => d >= fromIso).map((date) => ({ key, date }))).sort((a, b) => a.date.localeCompare(b.date) || a.key.localeCompare(b.key));
}
