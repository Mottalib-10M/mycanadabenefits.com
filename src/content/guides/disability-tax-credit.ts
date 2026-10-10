import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'disability-tax-credit', group: 'disability', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'disability-tax-credit', nav: 'disability-tax-credit', card: '', title: '', description: '', h1: 'disability-tax-credit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'credit-impot-personnes-handicapees', nav: 'credit-impot-personnes-handicapees', card: '', title: '', description: '', h1: 'credit-impot-personnes-handicapees', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
