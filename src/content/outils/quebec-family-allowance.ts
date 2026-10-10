import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'quebec-family-allowance', group: 'provinces', order: 10, tool: 'qcfa',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'quebec-family-allowance', nav: 'quebec-family-allowance', card: '', title: '', description: '', h1: 'quebec-family-allowance', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'allocation-famille-quebec', nav: 'allocation-famille-quebec', card: '', title: '', description: '', h1: 'allocation-famille-quebec', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
