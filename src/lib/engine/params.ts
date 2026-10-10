/**
 * Paramètres 2026 du site, lus une seule fois depuis `data/params-2026.json` (RECETTE §4).
 * Les faits relevés plus tard pour une page (montant, délai, seuil) vont dans `data/extra/<lot>.json`,
 * de forme { "sources": { clé: {...} }, "x": { clé: valeur } } : ils sont fusionnés ici dans
 * `P.sources` et `P.x`, ce qui évite que plusieurs rédacteurs modifient le même fichier.
 */
import raw from '../../data/params-2026.json';
type Extra = { sources?: Record<string, unknown>; x?: Record<string, unknown> };
const extras = import.meta.glob<{ default: Extra }>('../../data/extra/*.json', { eager: true });
const merged = raw as typeof raw & { x: Record<string, any> };
merged.x = merged.x ?? {};
for (const m of Object.values(extras)) {
  Object.assign(merged.sources, m.default.sources ?? {});
  Object.assign(merged.x, m.default.x ?? {});
}
export const P = merged;
export type Params = typeof merged;
export type SourceKey = keyof typeof raw.sources;
export const YEAR_PARAMS = raw.year;
