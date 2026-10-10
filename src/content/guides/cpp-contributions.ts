import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'cpp-contributions', group: 'cpp', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'cpp-contributions', nav: 'cpp-contributions', card: '', title: '', description: '', h1: 'cpp-contributions', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'cotisations-rpc', nav: 'cotisations-rpc', card: '', title: '', description: '', h1: 'cotisations-rpc', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
