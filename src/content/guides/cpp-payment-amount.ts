import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'cpp-payment-amount', group: 'cpp', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'cpp-payment-amount', nav: 'cpp-payment-amount', card: '', title: '', description: '', h1: 'cpp-payment-amount', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'montant-rpc', nav: 'montant-rpc', card: '', title: '', description: '', h1: 'montant-rpc', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
