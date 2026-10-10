import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'oas-deferral', group: 'oas', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'oas-deferral', nav: 'oas-deferral', card: '', title: '', description: '', h1: 'oas-deferral', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'report-securite-vieillesse', nav: 'report-securite-vieillesse', card: '', title: '', description: '', h1: 'report-securite-vieillesse', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
