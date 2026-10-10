import { defineGuide } from '../../lib/guide-types';
/** ÉBAUCHE RÉSERVÉE : titre vide = page à écrire (CONTRIBUTING-PAGES.md). */
export default defineGuide({
  id: 'gis-couples', group: 'oas', order: 10, mini: 'homeCcbBand',
  related: ['cpp-payment-dates', 'benefit-payment-dates', 'ccb-calculator'], sources: ['craDates', 'benefitsCalendar'],
  en: { slug: 'gis-couples', nav: 'gis-couples', card: '', title: '', description: '', h1: 'gis-couples', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
  fr: { slug: 'srg-couple', nav: 'srg-couple', card: '', title: '', description: '', h1: 'srg-couple', intro: '', resume: () => '', faqs: () => [], body: () => '<p>À écrire.</p>' },
});
