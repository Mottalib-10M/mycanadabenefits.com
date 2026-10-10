import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'cpp-survivor-pension', group: 'cpp', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'cpp-survivor-pension', nav: 'cpp-survivor-pension', card: '', title: '', description: '', h1: 'cpp-survivor-pension', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'pension-survivant-rpc', nav: 'pension-survivant-rpc', card: '', title: '', description: '', h1: 'pension-survivant-rpc', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
