import { route, type Locale } from './routes';
import { PAGES, pageById, GROUPS } from '../lib/guides';
import type { Group } from '../lib/guide-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<Locale, Record<string, string>> = {
  en: { home: 'All my benefits', method: 'Method and sources', about: 'About', widget: 'Embed the calculator', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Terms of use', cookies: 'Cookies' },
  fr: { home: 'Toutes mes prestations', method: 'Méthode et sources', about: 'À propos', widget: 'Intégrer le calculateur', contact: 'Contact', editorial: 'Politique éditoriale', privacy: 'Confidentialité', terms: 'Conditions d’utilisation', cookies: 'Témoins (cookies)' },
};
const GROUP_LABEL: Record<Locale, Record<Group, string>> = {
  en: { dates: 'Payment dates', family: 'Children', credits: 'Credits and workers', cpp: 'CPP and QPP', oas: 'OAS and GIS', disability: 'Disability', provinces: 'Provinces' },
  fr: { dates: 'Dates de versement', family: 'Enfants', credits: 'Crédits et travailleurs', cpp: 'RPC et RRQ', oas: 'SV et SRG', disability: 'Invalidité', provinces: 'Provinces' },
};
export const groupLabel = (g: Group, lang: Locale) => GROUP_LABEL[lang][g];
export const label = (id: string, lang: Locale) => CORE[lang][id] ?? pageById(id)?.[lang].nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
const inGroup = (g: Group, lang: Locale) => PAGES.filter((p) => p.group === g).sort((a, b) => Number(!!b.tool) - Number(!!a.tool) || a.order - b.order).map((p) => link(p.id, lang));
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: GROUP_LABEL[lang][g], links: inGroup(g, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang), { label: lang === 'fr' ? 'Le site' : 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (_lang: Locale): NavLink[] => [];
