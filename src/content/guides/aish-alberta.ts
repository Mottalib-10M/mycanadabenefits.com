import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'aish-alberta', group: 'disability', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'aish-alberta', nav: 'aish-alberta', card: '', title: '', description: '', h1: 'aish-alberta', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'aish-adap-alberta', nav: 'aish-adap-alberta', card: '', title: '', description: '', h1: 'aish-adap-alberta', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
