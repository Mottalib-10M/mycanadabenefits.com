import type { Locale } from './routes';
const en = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions people ask', relatedCalculators: 'Related pages and calculators', sourcesTitle: 'Official sources', writtenBy: 'Written by',
  asOf: 'Amounts', lastUpdated: 'checked on', footerValidated: 'Sources: canada.ca, Canada Revenue Agency, Service Canada, Retraite Québec, provincial governments', footerBrowser: 'Runs in your browser · nothing you type is sent · free, no account',
  footerDisclaimer: 'BenefitLedger is an independent site published by Radif Partners. It is not the Government of Canada, the Canada Revenue Agency, Service Canada, Retraite Québec or any provincial ministry, and it is not affiliated with them. Every figure is an estimate built from the rates those bodies publish and from what you enter: the amount actually paid is the one on your notice. We collect no data and refer you to no one.', footerPopular: '', notFound: 'There is no page at this address.',
  readMore: 'Keep reading',
};
const fr: typeof en = {
  updatedOn: 'Mis à jour le', editorialPolicy: 'Politique éditoriale', contactLabel: 'Contact', reviewedBy: 'Vérifié par',
  skipToContent: 'Aller au contenu', mainNav: 'Navigation principale', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Les questions qu’on nous pose', relatedCalculators: 'Pages et calculateurs liés', sourcesTitle: 'Sources officielles', writtenBy: 'Rédigé par',
  asOf: 'Montants', lastUpdated: 'vérifiés le', footerValidated: 'Sources : canada.ca, Agence du revenu du Canada, Service Canada, Retraite Québec, gouvernements provinciaux', footerBrowser: 'Calcul dans votre navigateur · rien de ce que vous tapez n’est transmis · gratuit, sans compte',
  footerDisclaimer: 'BenefitLedger est un site indépendant publié par Radif Partners. Ce n’est ni le gouvernement du Canada, ni l’Agence du revenu du Canada, ni Service Canada, ni Retraite Québec, ni un ministère provincial, et il n’a aucun lien avec eux. Chaque montant est une estimation tirée des taux publiés par ces organismes et de vos saisies : le montant versé est celui de votre avis. Aucune donnée recueillie, aucune mise en relation.', footerPopular: '', notFound: 'Aucune page à cette adresse.',
  readMore: 'Lire la suite',
};
export function t(lang: Locale) { return lang === 'fr' ? fr : en; }
