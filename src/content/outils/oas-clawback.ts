import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'oas-clawback', group: 'oas', order: 10, tool: 'clawback',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'oas-clawback', nav: 'oas-clawback', card: '', title: '', description: '', h1: 'oas-clawback', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'recuperation-securite-vieillesse', nav: 'recuperation-securite-vieillesse', card: '', title: '', description: '', h1: 'recuperation-securite-vieillesse', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
