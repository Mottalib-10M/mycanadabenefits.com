import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'newfoundland-labrador-benefits', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'newfoundland-labrador-benefits', nav: 'newfoundland-labrador-benefits', card: '', title: '', description: '', h1: 'newfoundland-labrador-benefits', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestations-terre-neuve-labrador', nav: 'prestations-terre-neuve-labrador', card: '', title: '', description: '', h1: 'prestations-terre-neuve-labrador', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
