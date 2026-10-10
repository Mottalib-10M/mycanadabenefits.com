import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'territories-child-benefits', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'territories-child-benefits', nav: 'territories-child-benefits', card: '', title: '', description: '', h1: 'territories-child-benefits', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestations-enfants-territoires', nav: 'prestations-enfants-territoires', card: '', title: '', description: '', h1: 'prestations-enfants-territoires', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
