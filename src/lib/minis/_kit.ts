/** Petits outils communs aux mini-simulateurs (fichier ignoré par le registre : préfixe « _ »). */
import { formatMoney, formatPercent, formatNumber } from '../format';
export type L = 'en' | 'fr';
/** Libellé dans la langue de la page : anglais d'abord, français ensuite. */
export const T = <A>(l: L, en: A, fr: A) => (l === 'fr' ? fr : en);
/** Montant en dollars canadiens (nom historique gardé pour la trame). */
export const eur = (x: number, l: L, d = 0) => formatMoney(x, d, l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
const MOIS = { fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
/** « March 2027 » / « mars 2027 » à partir d'une date ISO. */
export const moisAnnee = (iso: string, l: L) => { const [y, m] = iso.split('-').map(Number); return `${MOIS[l][m - 1]} ${y}`; };
/** « 20 July 2026 » / « 20 juillet 2026 ». */
export const jourMois = (iso: string, l: L) => { const [y, m, d] = iso.split('-').map(Number); return l === 'fr' ? `${d === 1 ? '1er' : d} ${MOIS.fr[m - 1]} ${y}` : `${MOIS.en[m - 1]} ${d}, ${y}`; };
export const moisOptions = (l: L) => MOIS[l].map((m, i) => ({ value: String(i + 1), label: m }));
