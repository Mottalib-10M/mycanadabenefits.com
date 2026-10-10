import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'benefit-payment-dates', group: 'dates', order: 10, tool: 'dates',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'benefit-payment-dates', nav: 'benefit-payment-dates', card: '', title: '', description: '', h1: 'benefit-payment-dates', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'dates-versement-prestations', nav: 'dates-versement-prestations', card: '', title: '', description: '', h1: 'dates-versement-prestations', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
