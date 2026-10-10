import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'old-age-security', group: 'oas', order: 10, tool: 'oas',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'old-age-security', nav: 'old-age-security', card: '', title: '', description: '', h1: 'old-age-security', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'pension-de-vieillesse', nav: 'pension-de-vieillesse', card: '', title: '', description: '', h1: 'pension-de-vieillesse', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
