import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'oas-partial-pension', group: 'oas', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'oas-partial-pension', nav: 'oas-partial-pension', card: '', title: '', description: '', h1: 'oas-partial-pension', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'pension-partielle-securite-vieillesse', nav: 'pension-partielle-securite-vieillesse', card: '', title: '', description: '', h1: 'pension-partielle-securite-vieillesse', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
