import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'ontario-child-benefit', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'ontario-child-benefit', nav: 'ontario-child-benefit', card: '', title: '', description: '', h1: 'ontario-child-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestation-ontarienne-enfants', nav: 'prestation-ontarienne-enfants', card: '', title: '', description: '', h1: 'prestation-ontarienne-enfants', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
