import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'nova-scotia-benefits', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'nova-scotia-benefits', nav: 'nova-scotia-benefits', card: '', title: '', description: '', h1: 'nova-scotia-benefits', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestations-nouvelle-ecosse', nav: 'prestations-nouvelle-ecosse', card: '', title: '', description: '', h1: 'prestations-nouvelle-ecosse', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
