import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'ontario-gains', group: 'provinces', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'ontario-gains', nav: 'ontario-gains', card: '', title: '', description: '', h1: 'ontario-gains', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'rrag-ontario', nav: 'rrag-ontario', card: '', title: '', description: '', h1: 'rrag-ontario', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
