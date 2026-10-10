import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'ccb-calculator', group: 'family', order: 10, tool: 'ccb',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'ccb-calculator', nav: 'ccb-calculator', card: '', title: '', description: '', h1: 'ccb-calculator', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'calcul-allocation-canadienne-enfants', nav: 'calcul-allocation-canadienne-enfants', card: '', title: '', description: '', h1: 'calcul-allocation-canadienne-enfants', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
