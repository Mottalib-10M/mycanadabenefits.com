import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'ccb-shared-custody', group: 'family', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'ccb-shared-custody', nav: 'ccb-shared-custody', card: '', title: '', description: '', h1: 'ccb-shared-custody', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'garde-partagee-allocation-enfants', nav: 'garde-partagee-allocation-enfants', card: '', title: '', description: '', h1: 'garde-partagee-allocation-enfants', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
