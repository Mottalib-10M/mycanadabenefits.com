/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://mycanadabenefits.com";
export const SITE_NAMES: Record<string, string> = {"en": "My Canada Benefits", "fr": "My Canada Benefits"};
export const LANG_TAGS: Record<string, string> = {"en": "en-CA", "fr": "fr-CA"};
export const OG_LOCALES: Record<string, string> = {"en": "en_CA", "fr": "fr_CA"};
/** Une locale par langue (RECETTE §4) : « $1,234 » en anglais, « 1 234 $ » en français. */
export const LOCALE_BY_LANG: Record<string, string> = { en: 'en-CA', fr: 'fr-CA' };
export const LOCALE_TAG = 'en-CA';
export const CURRENCY = 'CAD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-10';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Publisher of Canadian benefit and pension calculators · CCB, CGEB, CWB, CPP, OAS, GIS, provincial programs", "fr": "Éditeur de calculateurs des prestations et pensions canadiennes · ACE, ACEBE, ACT, RPC, SV, SRG, programmes provinciaux"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners maintains one parameter file for every federal and provincial benefit it models, read line by line from canada.ca, the CRA payment charts, Service Canada's quarterly OAS and GIS tables and Retraite Québec. When the July benefit year turns over or a quarterly indexation lands, the file is re-read and the engine tests are replayed before anything changes on the site.", "fr": "Radif Partners tient un seul fichier de paramètres pour toutes les prestations fédérales et provinciales qu'il modélise, relu ligne à ligne sur canada.ca, dans les tableaux de versement de l'ARC, les grilles trimestrielles de la SV et du SRG de Service Canada et chez Retraite Québec. À chaque nouvelle année de prestations en juillet et à chaque indexation trimestrielle, le fichier est relu et les tests du moteur rejoués avant toute mise à jour du site."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["Canada child benefit", "Canada Groceries and Essentials Benefit (former GST/HST credit)", "Canada workers benefit", "Canada Pension Plan", "Old Age Security and the Guaranteed Income Supplement", "Provincial benefits administered by the CRA"], "fr": ["Allocation canadienne pour enfants", "Allocation canadienne pour l'épicerie et les besoins essentiels (ex-crédit pour la TPS/TVH)", "Allocation canadienne pour les travailleurs", "Régime de pensions du Canada", "Pension de la Sécurité de la vieillesse et Supplément de revenu garanti", "Prestations provinciales administrées par l'ARC"]};
export const CONTACT_EMAIL = "contact@mycanadabenefits.com";
export const THEME_COLOR = '#B8141F';
export const LOGO_SYMBOL = '+$';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'yvjpnlmw9g';
export const INDEXNOW_KEY = '7f3c2a9e5b1d4e8fa06c3b2d9e7a1f45';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "Business number",
  registerNumber: '',
  vatLabel: "GST/HST",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "Canada",
  supervisoryAuthority: "Office of the Privacy Commissioner of Canada (OPC)",
  supervisoryAuthorityUrl: "https://www.priv.gc.ca",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
