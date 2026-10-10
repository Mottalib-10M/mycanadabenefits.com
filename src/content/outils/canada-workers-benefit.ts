import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'canada-workers-benefit', group: 'credits', order: 10, tool: 'cwb',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'canada-workers-benefit', nav: 'canada-workers-benefit', card: '', title: '', description: '', h1: 'canada-workers-benefit', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'allocation-canadienne-travailleurs', nav: 'allocation-canadienne-travailleurs', card: '', title: '', description: '', h1: 'allocation-canadienne-travailleurs', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
