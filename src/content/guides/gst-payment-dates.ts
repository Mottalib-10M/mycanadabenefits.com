import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'gst-payment-dates', group: 'dates', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'gst-payment-dates', nav: 'gst-payment-dates', card: '', title: '', description: '', h1: 'gst-payment-dates', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'dates-versement-credit-tps', nav: 'dates-versement-credit-tps', card: '', title: '', description: '', h1: 'dates-versement-credit-tps', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
