import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'canada-child-benefit', group: 'family', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'canada-child-benefit', nav: 'canada-child-benefit', card: '', title: '', description: '', h1: 'canada-child-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'allocation-canadienne-pour-enfants', nav: 'allocation-canadienne-pour-enfants', card: '', title: '', description: '', h1: 'allocation-canadienne-pour-enfants', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
