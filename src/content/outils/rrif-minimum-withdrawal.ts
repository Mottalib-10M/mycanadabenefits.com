import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'rrif-minimum-withdrawal', group: 'oas', order: 10, tool: 'rrif',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'rrif-minimum-withdrawal', nav: 'rrif-minimum-withdrawal', card: '', title: '', description: '', h1: 'rrif-minimum-withdrawal', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'retrait-minimum-ferr', nav: 'retrait-minimum-ferr', card: '', title: '', description: '', h1: 'retrait-minimum-ferr', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
