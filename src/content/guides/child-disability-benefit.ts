import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'child-disability-benefit', group: 'family', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'child-disability-benefit', nav: 'child-disability-benefit', card: '', title: '', description: '', h1: 'child-disability-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestation-enfants-handicapes', nav: 'prestation-enfants-handicapes', card: '', title: '', description: '', h1: 'prestation-enfants-handicapes', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
