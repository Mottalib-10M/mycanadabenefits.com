import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'bc-family-benefit', group: 'provinces', order: 10, tool: 'bcfb',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'bc-family-benefit', nav: 'bc-family-benefit', card: '', title: '', description: '', h1: 'bc-family-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'allocation-familiale-colombie-britannique', nav: 'allocation-familiale-colombie-britannique', card: '', title: '', description: '', h1: 'allocation-familiale-colombie-britannique', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
