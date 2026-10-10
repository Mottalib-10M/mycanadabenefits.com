import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'odsp-rates', group: 'disability', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'odsp-rates', nav: 'odsp-rates', card: '', title: '', description: '', h1: 'odsp-rates', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'taux-posph-ontario', nav: 'taux-posph-ontario', card: '', title: '', description: '', h1: 'taux-posph-ontario', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
