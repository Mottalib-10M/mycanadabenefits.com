import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'manitoba-benefits', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'manitoba-benefits', nav: 'manitoba-benefits', card: '', title: '', description: '', h1: 'manitoba-benefits', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestations-manitoba', nav: 'prestations-manitoba', card: '', title: '', description: '', h1: 'prestations-manitoba', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
