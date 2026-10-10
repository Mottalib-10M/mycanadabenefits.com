import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'ccb-payment-dates', group: 'dates', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'ccb-payment-dates', nav: 'ccb-payment-dates', card: '', title: '', description: '', h1: 'ccb-payment-dates', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'dates-versement-allocation-enfants', nav: 'dates-versement-allocation-enfants', card: '', title: '', description: '', h1: 'dates-versement-allocation-enfants', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
