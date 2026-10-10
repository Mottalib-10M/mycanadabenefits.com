import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'canada-disability-benefit', group: 'disability', order: 10, tool: 'cdb',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'canada-disability-benefit', nav: 'canada-disability-benefit', card: '', title: '', description: '', h1: 'canada-disability-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'prestation-canadienne-personnes-handicapees', nav: 'prestation-canadienne-personnes-handicapees', card: '', title: '', description: '', h1: 'prestation-canadienne-personnes-handicapees', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
