import { makeRouter, type RouteDef } from './routes-core';
import { PAGES } from '../lib/guides';
export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, en: string, fr: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${en}/`, fr: `/fr/${fr}/` }, ...(noindex ? { noindex } : {}) });
/** Pages du cœur. Les guides et les pages outils viennent de `src/content/` (lib/guides.ts). */
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/', fr: '/fr/' } },
  R('method', 'method', 'methode'),
  R('about', 'about', 'a-propos'),
  R('widget', 'widget', 'widget', true),
  R('contact', 'contact', 'contact', true),
  R('editorial', 'editorial-policy', 'politique-editoriale', true),
  R('privacy', 'privacy', 'confidentialite', true),
  R('terms', 'terms-of-use', 'mentions-legales', true),
  R('cookies', 'cookies', 'temoins', true),
];
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...PAGES.map((p) => R(p.id, p.en.slug, p.fr.slug)),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
