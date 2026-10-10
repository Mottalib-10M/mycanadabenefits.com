import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'quebec-pension-plan', group: 'cpp', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'quebec-pension-plan', nav: 'quebec-pension-plan', card: '', title: '', description: '', h1: 'quebec-pension-plan', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'regime-rentes-quebec', nav: 'regime-rentes-quebec', card: '', title: '', description: '', h1: 'regime-rentes-quebec', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
