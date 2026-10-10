import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'gst-credit-calculator', group: 'credits', order: 10, tool: 'cgeb',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'gst-credit-calculator', nav: 'gst-credit-calculator', card: '', title: '', description: '', h1: 'gst-credit-calculator', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'calcul-credit-tps', nav: 'calcul-credit-tps', card: '', title: '', description: '', h1: 'calcul-credit-tps', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
