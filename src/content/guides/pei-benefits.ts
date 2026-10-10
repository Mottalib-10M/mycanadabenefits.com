import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'pei-benefits', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'pei-benefits', nav: 'pei-benefits', card: '', title: '', description: '', h1: 'pei-benefits', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestations-ile-prince-edouard', nav: 'prestations-ile-prince-edouard', card: '', title: '', description: '', h1: 'prestations-ile-prince-edouard', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
