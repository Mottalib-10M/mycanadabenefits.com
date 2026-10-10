import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'oas-payment-dates', group: 'dates', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'oas-payment-dates', nav: 'oas-payment-dates', card: '', title: '', description: '', h1: 'oas-payment-dates', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'dates-paiement-securite-vieillesse', nav: 'dates-paiement-securite-vieillesse', card: '', title: '', description: '', h1: 'dates-paiement-securite-vieillesse', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
