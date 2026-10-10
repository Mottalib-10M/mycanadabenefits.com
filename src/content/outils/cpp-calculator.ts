import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'cpp-calculator', group: 'cpp', order: 10, tool: 'cpp',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'cpp-calculator', nav: 'cpp-calculator', card: '', title: '', description: '', h1: 'cpp-calculator', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'calcul-rpc', nav: 'calcul-rpc', card: '', title: '', description: '', h1: 'calcul-rpc', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
