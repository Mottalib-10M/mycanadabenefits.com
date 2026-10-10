import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'cpp-disability', group: 'cpp', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'cpp-disability', nav: 'cpp-disability', card: '', title: '', description: '', h1: 'cpp-disability', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestation-invalidite-rpc', nav: 'prestation-invalidite-rpc', card: '', title: '', description: '', h1: 'prestation-invalidite-rpc', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
